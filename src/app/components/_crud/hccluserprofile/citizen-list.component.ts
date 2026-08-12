import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { GuidanceTicketModalComponent } from '../../../features/dash-citizen/guidance-ticket-modal.component';
import { HcclService, HcclUserContextGETData } from '../../../restsvc/hccl.service';
import { HcclUserProfileGETData, HcclUserProfileCriteria, HcclUserProfileGETDataSearchResults } from '../../../restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { Observable } from 'rxjs';

/**
 * Component for displaying and managing HcclUserProfile data using HcclService
 * Extends AbstractListComponent for common grid functionality
 */

@Component({
  selector: 'app-citizen-list',
  standalone: true,
  templateUrl: '../../_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../_global/abstract-list/abstract-list.component.scss'],
    imports: [CommonModule]
})
export class CitizenListComponent extends AbstractListComponent<HcclUserProfileGETData, HcclUserProfileCriteria, HcclUserProfileGETDataSearchResults> {
  
  // Inject modal service
  protected override modalService = inject(MdbModalService);
  
  constructor(   
  ) {
    super();
    
    // Set entity-specific properties
    this.searchHeading = 'HCCL User Profiles';
    this.showingAddButton = true;
    this.showingIdCheckbox = true;
    //this.searchPlaceholder = ...
  }

  protected getGridColumns(): any[] {
    return [
      //{ id: 'id', header: [{ text: 'ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'action', header: [{ text: 'Action', align: 'center' }], width: 150, htmlEnable: true, template: () => {
        return `<button class=\"create-ticket-btn\">Create Ticket</button>`;
      }},
      { id: 'messageHandle', header: [{ text: 'Message Handle', align: 'center' }, { content: 'inputFilter' }], minWidth: 180, adjust: true },
      { id: 'userCode', header: [{ text: 'User Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
 //     { id: 'userId', header: [{ text: 'User', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
 //     { id: 'organizationId', header: [{ text: 'Organization', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
 //     { id: 'profileTypeCode', header: [{ text: 'Profile Type Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'userEmail', header: [{ text: 'User Email', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
    
      { id: 'cellPhoneNumber', header: [{ text: 'Cell Phone', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'workPhoneNumber', header: [{ text: 'Work Phone', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
 //     { id: 'externalUserId', header: [{ text: 'External User ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
 //     { id: 'externalUserEntityType', header: [{ text: 'External User Entity Type', align: 'center' }, { content: 'inputFilter' }], minWidth: 180, adjust: true },
 //     { id: 'externalUserName', header: [{ text: 'External User Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 180, adjust: true },
 //     { id: 'available', header: [{ text: 'Available', align: 'center' }, { content: 'inputFilter' }], minWidth: 100, adjust: true },
//      { id: 'createdByInfo', header: [{ text: 'Created By', align: 'center' }], minWidth: 120, adjust: true },
  //    { id: 'dateCreated', header: [{ text: 'Date Created', align: 'center' }], minWidth: 120, adjust: true },
    //  { id: 'lastUpdatedByInfo', header: [{ text: 'Last Updated By', align: 'center' }], minWidth: 120, adjust: true },
 //     { id: 'dateLastUpdated', header: [{ text: 'Date Last Updated', align: 'center' }], minWidth: 120, adjust: true }
    ];
  }

  protected override addGridEventListeners(grid: any) {
    // Default implementation - subclasses can override
    //console.log('addGridEventListeners called');
    // Use grid's cellClick event for the Action column
    grid.events.on('cellClick', (row: any, col: any, e: any) => {
      if (col && col.id === 'action') {
        this.createTicketForUser(row.id);
      }
    });
  }

  protected createCriteria(): HcclUserProfileCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected findEntities(criteria: HcclUserProfileCriteria): Observable<HcclUserProfileGETDataSearchResults> {
    var x = this.hcclService.findHcclUserProfiles(criteria);
    return x;
  }

  protected hasSearchResults(response: HcclUserProfileGETDataSearchResults): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(response: HcclUserProfileGETDataSearchResults): HcclUserProfileGETData[] {
    return response.searchResults || [];
  }

  protected override formatEntityData(entity: HcclUserProfileGETData): any {
    return {
      createdByInfo: entity.createdByInfo?.name || '',
      lastUpdatedByInfo: entity.lastUpdatedByInfo?.name || '',
      dateCreated: entity.dateCreated?.formattedDate || '',
      dateLastUpdated: entity.dateLastUpdated?.formattedDate || ''
    };
  }

  protected createTicketForUser(userProfileId: string) {
    //alert('Creating ticket for user profile:' + userProfileId);
    // Get the current user profile ID from context
    const userContext : HcclUserContextGETData = this.hcclContextService.getContext();
    const advocateUserProfileId = userContext?.currentUserProfileId;
    
    if (!advocateUserProfileId) {
      console.error('No advocate user profile ID found in context');
      alert('Unable to determine advocate user profile. Please try again.');
      return;
    }

    // Open guidance ticket modal instead of navigating to create-ticket route
    this.openGuidanceTicketModal(userProfileId, advocateUserProfileId);
  }

  /**
   * Open the guidance ticket modal
   */
  private openGuidanceTicketModal(clientUserProfileId: string, advocateUserProfileId: string): void {
    const modalData = {
      userProfileId: clientUserProfileId,
      advocateUserProfileId: advocateUserProfileId
    };

    const modalRef: MdbModalRef<GuidanceTicketModalComponent> = this.modalService.open(
      GuidanceTicketModalComponent,
      {
        data: modalData,
        modalClass: 'modal-lg',
        backdrop: true,
        keyboard: true,
        ignoreBackdropClick: false
      }
    );

    // Handle modal result
    modalRef.onClose.subscribe((result) => {
      if (result) {
        console.log('Modal closed with result:', result);
        if (result.success) {
          // Handle successful ticket creation
          console.log('Guidance ticket created successfully:', result.ticketId);
          // You can add additional success handling here (e.g., show toast notification)
        }
      } else {
        console.log('Modal closed without result');
      }
    });
  }

  
} 