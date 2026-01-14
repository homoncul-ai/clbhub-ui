import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { CatalogEntrySignupPacketCrudWrapper, CatalogEntrySignupPacketCrudComponent } from '@app/components/_crud/catalogentrysignuppacket/catalogentrysignuppacket-crud.component';
import { HcclService, PMFileGroupPOSTData, CatalogEntrySignupPacketPUTData } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { PmfilegroupUiComponent } from '@app/components/_crud/pmfilegroup-ui/pmfilegroup-ui.component';

@Component({
  selector: 'app-catalogentrysignuppacket-ui',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, CatalogEntrySignupPacketCrudComponent, PmfilegroupUiComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './catalogentrysignuppacket-ui.component.html',
})
export class CatalogEntrySignupPacketUiComponent extends AbstractEntityGroupComponent<CatalogEntrySignupPacketCrudWrapper> implements OnInit {  
 
  constructor() {
    super();    
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.currentTabId = 'details';
    this.cdr.detectChanges();
  }

  protected newCrudWrapperForCreate(): CatalogEntrySignupPacketCrudWrapper {
    return CatalogEntrySignupPacketCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<CatalogEntrySignupPacketCrudWrapper> {
    return CatalogEntrySignupPacketCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    
    var tabs: SimpleTab[] = [];
    var tab = new SimpleTab('details', this.getDetailsTabLabel(), '', 
        () => {
          this.currentTabId = 'details';          
        },
        () => {
          return this.entity !== null;
        }
      );
      tabs.push(tab);
      // Add the File Group tab
      tab = new SimpleTab('filegroup', 'File Group', '', 
        () => {
        this.currentTabId = 'filegroup';
      },
      () => {
        return this.entity !== null;
      }
    );
    tabs.push(tab);
    
    return tabs;
  }

  /**
   * Get the fileGroupId from the current entity
   */
  public getFileGroupId(): string | null {
    return this.entity?.getData()?.fileGroupId || null;
  }

  // Flag to track if file group creation is in progress
  public creatingFileGroup: boolean = false;

  

}

