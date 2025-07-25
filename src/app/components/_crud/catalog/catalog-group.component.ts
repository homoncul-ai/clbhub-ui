import { CatalogEntryCriteria } from './../../../restsvc/hccl.service';
// This template is for generating a GROUP component  
// This was generated using entityName = Catalog
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { CatalogCrudWrapper, CatalogCrudComponent } from '@app/components/_crud/catalog/catalog-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { CatalogEntryListComponent } from "../catalogentry/catalogentry-list.component";
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { CatalogEntryCrudComponent } from '../catalogentry/catalogentry-crud.component';

@Component({
  selector: 'app-catalog-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, CatalogCrudComponent, CatalogEntryListComponent,CatalogEntryCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './catalog-group.component.html',
})
export class CatalogGroupComponent extends AbstractEntityGroupComponent<CatalogCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): CatalogCrudWrapper {
    return CatalogCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<CatalogCrudWrapper> {
    return CatalogCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    var tabs : SimpleTab[] = this.setupListDetailsTabs();
    var baseRoute = this.getBaseRoute();
    var tab =  new SimpleTab('entries', 'Entries', '', 
      () => {
        //this.currentTabId = 'entries';
        this.router.navigate([baseRoute, this.id, 'entries']);
        
      },
      () => {
        return this.entity !== null;
      }
    );
    tabs.push(tab)
    tab =  new SimpleTab('catalogEntry', 'Catalog Entry', '', 
      () => {
        this.router.navigate([baseRoute, this.id, 'catalogEntry', this.childId]);
        //this.currentTabId = 'catalogEntry';
        
      },
      () => {
        return this.childId !== null && this.childId !== undefined && this.childId !== '';
      }
    );
    tabs.push(tab)
    return tabs;
  }

  protected getCatalogEntryCriteria(): CatalogEntryCriteria {
    return {
      catalogId: this.id,
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected getCatalogEntryOnClickBehavior(): OnRowClickBehavior {
    var x: OnRowClickBehavior =  new OnRowClickBehavior();
    x.parentId = this.id;
    x.tabId = 'catalogEntry';
    //x.alertMessage = 'Catalog Entry';
    return x;
  }
} 