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

  // Flag to track if file group creation is in progress
  public creatingFileGroup: boolean = false;

  /**
   * Handle creating a new file group
   */
  public async onCreateNewFileGroup(): Promise<void> {
    if (!this.entity || this.creatingFileGroup) {
      return;
    }

    const entityData = this.entity.getData();
    if (!entityData.id) {
      alert('Cannot create file group: Signup packet ID is missing');
      return;
    }

    this.creatingFileGroup = true;

    try {
      // Build the PMFileGroupPOSTData
      const displayText = this.entity.getDisplayText();
      const postData: PMFileGroupPOSTData = {
       parentEntityType: 'CatalogEntrySignupPacket',
        parentEntityId: entityData.id,
        aspectCode: 'info',
        title: `${displayText} Info`,
        instructions: entityData.instructionsMd || 'PLACEHOLDER INSTRUCTIONS',
        available: true
      };

      
      // Create the PMFileGroup
      const createResponse = await this.hcclService.createPMFileGroup(postData).toPromise();
      if (createResponse && createResponse.id) {
        // Update the CatalogEntrySignupPacket with the new fileGroupId
        const putData: CatalogEntrySignupPacketPUTData = {
          organizationId: entityData.organizationId || '',
          catalogId: entityData.catalogId,
          catalogEntryId: entityData.catalogEntryId,
          fileGroupId: createResponse.id,
          name: entityData.name || '',
          signupBehaviorCode: entityData.signupBehaviorCode || '',
          description: entityData.description || '',
          available: entityData.available || 0,
          instructionsMd: entityData.instructionsMd || ''
        };

        await this.hcclService.updateCatalogEntrySignupPacketById(entityData.id, putData).toPromise();

        // Reload the entity to get updated data
        this.entity = await this.loadEntityById(entityData.id);
        this.cdr.detectChanges();
      } else {
        alert('Failed to create file group: No ID returned');
      }
    } catch (error) {
      console.error('Error creating file group:', error);
      alert('Error creating file group: ' + (error as Error).message);
    } finally {
      this.creatingFileGroup = false;
    }
  }

}

