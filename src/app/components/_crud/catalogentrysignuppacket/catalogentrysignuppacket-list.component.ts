import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclService } from '../../../restsvc/hccl.service';
import { CatalogEntrySignupPacketGETData, CatalogEntrySignupPacketCriteria, CatalogEntrySignupPacketGETDataSearchResults } from '../../../restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { Observable, firstValueFrom } from 'rxjs';
import { CatalogEntryCrudWrapper } from '@app/components/_crud/catalogentry/catalogentry-crud.component';
import { CatalogEntrySignupPacketCreateModalComponent } from './catalogentrysignuppacket-create-modal.component';

/**
 * Component for displaying and managing CatalogEntrySignupPacket data using HcclService
 * Extends AbstractListComponent for common grid functionality
 */

@Component({
  selector: 'app-catalogentrysignuppacket-list',
  standalone: true,
  templateUrl: '../../_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../_global/abstract-list/abstract-list.component.scss'],
    imports: [CommonModule]
})
export class CatalogEntrySignupPacketListComponent extends AbstractListComponent<CatalogEntrySignupPacketGETData, CatalogEntrySignupPacketCriteria, CatalogEntrySignupPacketGETDataSearchResults> {
  
  constructor(   
  ) {
    super();
    
    // Set entity-specific properties
    this.searchHeading = 'Catalog Entry Signup Packets';
    this.showingAddButton = true;
    this.showingIdCheckbox = true;
    //this.searchPlaceholder = ...
  }

  // Always start with the id column, then the attributes of the entity in the order you want them to appear in the grid
  // start with the id, dateCreated, dateLastUpdated, createdByInfo, lastUpdatedByInfo commented out.
  protected getGridColumns(): any[] {
    return [
      // id is commented out for now - not sure if we want to show this
      //{ id: 'id', header: [{ text: 'ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'name', header: [{ text: 'Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'signupBehaviorCode', header: [{ text: 'Signup Behavior', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'description', header: [{ text: 'Description', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'available', header: [{ text: 'Available', align: 'center' }, { content: 'inputFilter' }], minWidth: 100, adjust: true },

      // Replace [prefix]Id with the displaytext of the crudwrapper - named [prefix]Str instead of [prefix]Id
      { id: 'catalogEntryStr', header: [{ text: 'Catalog Entry', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },

      // Commented out for now - not sure if we want to show this
//      { id: 'createdByInfo', header: [{ text: 'Created By', align: 'center' }], minWidth: 120, adjust: true },
  //    { id: 'dateCreated', header: [{ text: 'Date Created', align: 'center' }], minWidth: 120, adjust: true },
    //  { id: 'lastUpdatedByInfo', header: [{ text: 'Last Updated By', align: 'center' }], minWidth: 120, adjust: true },
      { id: 'dateLastUpdated', header: [{ text: 'Date Last Updated', align: 'center' }], minWidth: 120, adjust: true }
    ];
  }

  protected createCriteria(): CatalogEntrySignupPacketCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected findEntities(criteria: CatalogEntrySignupPacketCriteria): Observable<CatalogEntrySignupPacketGETDataSearchResults> {
    return this.hcclService.findCatalogEntrySignupPackets(criteria);
  }

  protected hasSearchResults(response: CatalogEntrySignupPacketGETDataSearchResults): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(response: CatalogEntrySignupPacketGETDataSearchResults): CatalogEntrySignupPacketGETData[] {
    return response.searchResults || [];
  }

  /**
   * Special attributes in the grid.  FK info needs to be added here.
   * @param entity 
   * @returns 
   */
  protected override async formatEntityDataAsync(entity: CatalogEntrySignupPacketGETData): Promise<any> {
    // Every attribute of the form [prefix]Id is an "foreign key" and should be replaced with the displaytext of the crudwrapper
    const catalogEntryStr: string = entity.catalogEntryId == null ? '' : 
       (await CatalogEntryCrudWrapper.newInstance(entity.catalogEntryId, this.hcclService)).getDisplayText();

    const behaviorMap = await this.getBehaviorMap();
    const signupBehaviorName: string = entity.signupBehaviorCode
      ? (behaviorMap[entity.signupBehaviorCode] || entity.signupBehaviorCode)
      : '';

    return {
      createdByInfo: entity.createdByInfo?.name || '',
      lastUpdatedByInfo: entity.lastUpdatedByInfo?.name || '',
      dateCreated: entity.dateCreated?.formattedDate || '',
      dateLastUpdated: entity.dateLastUpdated?.formattedDate || '',
      catalogEntryStr: catalogEntryStr,
      signupBehaviorCode: signupBehaviorName
    };
  }

  private signupBehaviorMapPromise?: Promise<Record<string, string>>;

  /**
   * Lazily load and cache the signup-behavior code -> name map from setup data.
   */
  private getBehaviorMap(): Promise<Record<string, string>> {
    if (!this.signupBehaviorMapPromise) {
      this.signupBehaviorMapPromise = firstValueFrom(this.hcclService.getSignupPacketsSetupData())
        .then((data) => {
          const map: Record<string, string> = {};
          (data?.signupBehaviorSelectData?.menuItems || []).forEach((item) => {
            if (item.id) {
              map[item.id] = item.name || item.id;
            }
          });
          return map;
        })
        .catch(() => ({} as Record<string, string>));
    }
    return this.signupBehaviorMapPromise;
  }

  /**
   * Override onAdd to open a modal for creating a new CatalogEntrySignupPacket
   */
  protected override onAdd(): void {
    const modalRef = this.modalService.open(CatalogEntrySignupPacketCreateModalComponent, {
      modalClass: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true
    });

    modalRef.onClose.subscribe((result: any) => {
      if (result?.created) {
        // Refresh the grid after successful creation
        this.onRefresh();
      }
    });
  }
}

