import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { CatalogEntryCrudWrapper, CatalogEntryCrudComponent } from '@app/components/_crud/catalogentry/catalogentry-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

// UI component for editing/maintaining the catalog entry.
@Component({
  selector: 'app-catalogentry-ui',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, CatalogEntryCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './catalogentry-ui.component.html',
})
export class CatalogEntryUiComponent extends AbstractEntityGroupComponent<CatalogEntryCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): CatalogEntryCrudWrapper {
    return CatalogEntryCrudWrapper.newInstanceForCreate(this.hcclService);
  }


  protected async loadEntityById(id: string): Promise<CatalogEntryCrudWrapper> {
    var hint = "edit";
    return CatalogEntryCrudWrapper.newInstanceFoHint(id, hint, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    const baseRoute = this.getBaseRoute();
    var tabs: SimpleTab[] = [];
    var tab = tab = new SimpleTab('details', this.getDetailsTabLabel(), '', 
        () => {
          this.currentTabId = 'details';          
        },
        () => {
          return this.entity !== null;
        }
      );
      tabs.push(tab);
     
      tab = new SimpleTab('icon', 'Icon', '', 
        () => {
          this.currentTabId = 'icon';
        },
        () => {
          return true;
        }
      );
      tabs.push(tab);

      tab = new SimpleTab('vocode', 'Vocation Encoding', '', 
        () => {
          this.currentTabId = 'vocode';
        },
        () => {
          return true;
        }
      );
      tabs.push(tab);

      tab = new SimpleTab('signup', 'Signup', '', 
        () => {
          this.currentTabId = 'signup';         
        },
        () => {
          return true;
        }
      );
      tabs.push(tab);


      // tab = new SimpleTab('fk_menu', 'FK_MENU', '', 
      //   () => {
      //     this.currentTabId = 'fk_menu';
      //     this.router.navigate([baseRoute, this.id, 'fk_menu']);
      //   },
      //   () => {
      //     return true;
      //   }
      // )
    //  tabs.push(tab);
      return tabs;
  }

}

