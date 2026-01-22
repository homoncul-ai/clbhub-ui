import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { CatalogEntryCrudWrapper, CatalogEntryCrudComponent } from '@app/components/_crud/catalogentry/catalogentry-crud.component';
import { HcclService, MenuControlDataList, MenuControlData, CatalogEntryPUTData } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { StdEntitySectionComponent } from "@app/components/_global/std-entity-section/std-entity-section.component";
import { CatalogEntrySignupPacketUiComponent } from '../catalogentrysignuppacket/catalogentrysignuppacket-ui.component';
import { CatalogEntrySignupPacketGroupComponent } from "../catalogentrysignuppacket/catalogentrysignuppacket-group.component";
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { StdBubaComponent } from "@app/components/_global/std-buba/std-buba.component";
import { AbstractCrudComponent } from "@app/components/_global";
import { VocationEncodingDisplayComponent } from "../vocationencoding/vocationencoding-display.component"; 

// UI component for editing/maintaining the catalog entry.
@Component({
  selector: 'app-catalogentry-ui',
  standalone: true,
  imports: [CommonModule, FormsModule, SimpleTabsetComponent, CatalogEntryCrudComponent,
    CatalogEntrySignupPacketUiComponent, CatalogEntrySignupPacketGroupComponent,
    MenuControlDataListComponent, RouterLink, StdBubaComponent, VocationEncodingDisplayComponent, CommonModule],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './catalogentry-ui.component.html',
})
export class CatalogEntryUiComponent extends AbstractEntityGroupComponent<CatalogEntryCrudWrapper> implements OnInit {  

  @Input() readonly: boolean = false;

  constructor() {
    super();    
  }

  
  override ngOnInit(): void {
    super.ngOnInit();
    this.signupPacketId = this.getCurrentEntity().getSignupPacketId() || '';
    this.cdr.detectChanges();
  }

  protected newCrudWrapperForCreate(): CatalogEntryCrudWrapper {
    return CatalogEntryCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  public signupPacketId: string = '';
  public savingSignupPacket: boolean = false;
  public saveSuccess: boolean = false;
  public saveError: string | null = null;

  protected isReadOnly(): boolean {
    return this.readonly;
  }

  protected getSignupPacketId(): string {
    return this.signupPacketId;
  }
  protected setSignupPacketId(value: string) {
    this.signupPacketId = value;
  }

  /**
   * Get the signup packet menu for the dropdown
   */
  public getSignupPacketMenu(): MenuControlDataList | null {
    return this.entity?.getData()?.signupPacketMenu || null;
  }

  /**
   * Handle signup packet selection change from the dropdown
   */
  public onSignupPacketChange(selectedItem: MenuControlData | null): void {
    const newId = selectedItem?.id || '';
    this.signupPacketId = newId;
    // Update the entity's signupPacketId as well
    if (this.entity) {
      this.entity.setSignupPacketId(newId);
    }
    // Reset save status indicators
    this.saveSuccess = false;
    this.saveError = null;
    this.cdr.detectChanges();
  }

  /**
   * Save the signup packet selection by loading the latest catalog entry and updating it
   */
  public async saveSignupPacketSelection(): Promise<void> {
    if (!this.id || this.savingSignupPacket) {
      return;
    }

    this.savingSignupPacket = true;
    this.saveSuccess = false;
    this.saveError = null;

    try {
      // Load the latest copy of the catalog entry
      const latestEntity = await this.hcclService.getCatalogEntryById(this.id).toPromise();
      
      if (!latestEntity) {
        throw new Error('Could not load catalog entry');
      }

      // Build the PUT data with the new signupPacketId
      const putData: CatalogEntryPUTData = {
        catalogId: latestEntity.catalogId || '',
        signupPacketId: this.signupPacketId || undefined,
        entryCode: latestEntity.entryCode || '',
        title: latestEntity.title || '',
        catalogTypeCode: latestEntity.catalogTypeCode || '',
        catalogTypeId: latestEntity.catalogTypeId || '',
        entryGroupCode: latestEntity.entryGroupCode,
        shortDescription: latestEntity.shortDescription || '',
        description: latestEntity.description || '',
        businessNeed: latestEntity.businessNeed,
        businessSponsor: latestEntity.businessSponsor,
        entryPrice: latestEntity.entryPrice,
        entryCost: latestEntity.entryCost,
        tarotPrompt: latestEntity.tarotPrompt,
        notes: latestEntity.notes,
        available: latestEntity.available || 1,
        url: latestEntity.url,
        tarotFileId: latestEntity.tarotFileId,
        tarotFileUrl: latestEntity.tarotFileUrl,
        vocodeInstanceId: latestEntity.vocodeInstanceId,
        integrationEntityId: latestEntity.integrationEntityId,
        integrationEntityType: latestEntity.integrationEntityType,
        integrationEntityName: latestEntity.integrationEntityName,
        version: latestEntity.version,
        updateNotes: latestEntity.updateNotes,
        referenceId: latestEntity.referenceId,
        subjectEntityId: latestEntity.subjectEntityId,
        subjectEntityType: latestEntity.subjectEntityType,
        subjectEntityName: latestEntity.subjectEntityName
      };

      // Update the catalog entry
      await this.hcclService.updateCatalogEntryById(this.id, putData).toPromise();

      // Reload the entity to get the updated data
      this.entity = await this.loadEntityById(this.id);
      this.saveSuccess = true;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error saving signup packet selection:', error);
      this.saveError = (error as Error).message || 'Failed to save signup packet';
    } finally {
      this.savingSignupPacket = false;
      this.cdr.detectChanges();
    }
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
          return this.isReadOnly() == false;
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

      if (this.isReadOnly() == false) {
      tab = new SimpleTab('signup', 'Signup', '', 
        () => {
          this.currentTabId = 'signup';         
        },
        () => {
          return this.isReadOnly() == false;
        }
      );
      tabs.push(tab);
    } else {

      tab = new SimpleTab('signupPacket', 'Signup Packet', '', 
        () => {
          this.currentTabId = 'signupPacket';         
        },
        () => {
          return this.isReadOnly() == true;
        }
      );
      tabs.push(tab);
    }
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

