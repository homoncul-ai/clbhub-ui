import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { CatalogEntrySignupPacketCrudWrapper, CatalogEntrySignupPacketCrudComponent } from '@app/components/_crud/catalogentrysignuppacket/catalogentrysignuppacket-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { PmfilegroupUiComponent } from '@app/components/_crud/pmfilegroup-ui/pmfilegroup-ui.component';

@Component({
  selector: 'app-catalogentrysignuppacket-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, CatalogEntrySignupPacketCrudComponent, PmfilegroupUiComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './catalogentrysignuppacket-group.component.html',
})
export class CatalogEntrySignupPacketGroupComponent extends AbstractEntityGroupComponent<CatalogEntrySignupPacketCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): CatalogEntrySignupPacketCrudWrapper {
    return CatalogEntrySignupPacketCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<CatalogEntrySignupPacketCrudWrapper> {
    return CatalogEntrySignupPacketCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    const baseTabs = this.setupListDetailsTabs();
    const baseRoute = this.getBaseRoute();
    
    // Add the File Group tab
    const fileGroupTab = new SimpleTab('filegroup', 'File Group', '', 
      () => {
        this.currentTabId = 'filegroup';
        this.router.navigate([baseRoute, this.id, 'filegroup']);
      },
      () => {
        return this.entity !== null;
      }
    );
    baseTabs.push(fileGroupTab);
    
    return baseTabs;
  }

  /**
   * Get the fileGroupId from the current entity
   */
  public getFileGroupId(): string | null {
    return this.entity?.getData()?.fileGroupId || null;
  }

  /**
   * Handle creating a new file group
   */
  public onCreateNewFileGroup(): void {
    alert('Create New File Group - functionality to be implemented');
  }

}

