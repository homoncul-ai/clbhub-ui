import { WorkItemDeliverableCriteria } from '@app/restsvc/hccl.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclService } from '../../../restsvc/hccl.service';
import { HcclUserProfileGETData, HcclUserProfileCriteria, HcclUserProfileGETDataSearchResults } from '../../../restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { Observable } from 'rxjs';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { OnboardOrgUserModalComponent } from './onboard-org-user-modal.component';

/**
 * Component for displaying and managing HcclUserProfile data using HcclService
 * Extends AbstractListComponent for common grid functionality
 */

@Component({
  selector: 'app-org-school-staff-list',
  standalone: true,
  templateUrl: '../../../components/_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../../components/_global/abstract-list/abstract-list.component.scss'],
  imports: [CommonModule]
})


export class OrgSchoolStaffListComponent extends AbstractListComponent<HcclUserProfileGETData, HcclUserProfileCriteria, HcclUserProfileGETDataSearchResults> {
  
  protected modalRef?: MdbModalRef<OnboardOrgUserModalComponent>;
  
  constructor() {
    super();
    
    // Set entity-specific properties
    this.searchHeadingLabel = 'School Staff';
    this.showingAddButton = true;
    this.showingIdCheckbox = false;
    this.showingGoButton = false;
    this.searchPlaceholder = 'Search by Name';
  }

  protected getGridColumns(): any[] {
    return [
      //{ id: 'id', header: [{ text: 'ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'available', header: [{ text: 'Available', align: 'center' }, { content: 'inputFilter' }], minWidth: 100, adjust: true },
      { id: 'name', header: [{ text: 'Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
//      { id: 'userCode', header: [{ text: 'User Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
  //    { id: 'organizationId', header: [{ text: 'Organization', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'profileTypeCode', header: [{ text: 'Profile Type Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'userEmail', header: [{ text: 'User Email', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'cellPhoneNumber', header: [{ text: 'Cell Phone', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'workPhoneNumber', header: [{ text: 'Work Phone', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
  //    { id: 'externalUserId', header: [{ text: 'External User ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
 //     { id: 'externalUserEntityType', header: [{ text: 'External User Entity Type', align: 'center' }, { content: 'inputFilter' }], minWidth: 180, adjust: true },
 //     { id: 'externalUserName', header: [{ text: 'External User Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 180, adjust: true },
 
//      { id: 'createdByInfo', header: [{ text: 'Created By', align: 'center' }], minWidth: 120, adjust: true },
  //    { id: 'dateCreated', header: [{ text: 'Date Created', align: 'center' }], minWidth: 120, adjust: true },
    //  { id: 'lastUpdatedByInfo', header: [{ text: 'Last Updated By', align: 'center' }], minWidth: 120, adjust: true },
      { id: 'dateLastUpdated', header: [{ text: 'Date Last Updated', align: 'center' }], minWidth: 120, adjust: true }
    ];
  }

  protected createCriteria(): HcclUserProfileCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  

  protected findEntities(criteria: HcclUserProfileCriteria): Observable<HcclUserProfileGETDataSearchResults> {
    debugger;
   return this.hcclService.findHcclUserProfiles(criteria);
  }

  protected hasSearchResults(response: HcclUserProfileGETDataSearchResults): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(response: HcclUserProfileGETDataSearchResults): HcclUserProfileGETData[] {
    return response.searchResults || [];
  }

  protected override formatEntityData(entity: HcclUserProfileGETData): any {
    return {
      name: entity.theUser?.name || '',
      createdByInfo: entity.createdByInfo?.name || '',
      lastUpdatedByInfo: entity.lastUpdatedByInfo?.name || '',
      dateCreated: entity.dateCreated?.formattedDate || '',
      dateLastUpdated: entity.dateLastUpdated?.formattedDate || ''
    };
  }
  
  protected override onAdd(): void {
    // Get organization ID from route parameters if available
    const organizationId = this.criteria?.organizationId;

    // Open the onboarding modal
    this.modalRef = this.modalService.open(OnboardOrgUserModalComponent, {
      modalClass: 'modal-lg',
      keyboard: false,
      ignoreBackdropClick: true,
      data: {
        organizationId: organizationId
      }
    });

    // Handle modal close
    this.modalRef.onClose.subscribe((result: boolean) => {
      if (result) {
        // Refresh the list if onboarding was successful
        this.onRefresh();
      }
    });
  }
} 

@Component({
  selector: 'app-org-nonprofit-staff-list',
  standalone: true,
  templateUrl: '../../../components/_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../../components/_global/abstract-list/abstract-list.component.scss'],
  imports: [CommonModule]
})
export class OrgNonprofitStaffListComponent extends OrgSchoolStaffListComponent {
  constructor() {
    super();
    this.searchHeadingLabel = 'Nonprofit Staff';
  }

  protected override onAdd(): void {
    // Get organization ID from route parameters if available
    const organizationId = this.criteria?.organizationId;

    // Open the onboarding modal
    this.modalRef = this.modalService.open(OnboardOrgUserModalComponent, {
      modalClass: 'modal-lg',
      keyboard: false,
      ignoreBackdropClick: true,
      data: {
        organizationId: organizationId
      }
    });
  }
}

@Component({
  selector: 'app-org-business-staff-list',
  standalone: true,
  templateUrl: '../../../components/_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../../components/_global/abstract-list/abstract-list.component.scss'],
  imports: [CommonModule]
})
export class OrgBusinessStaffListComponent extends OrgSchoolStaffListComponent {
  constructor() {
    super();
    this.searchHeadingLabel = 'Business Staff';
  }

  protected override onAdd(): void {
    // Get organization ID from route parameters if available
    const organizationId = this.criteria?.organizationId;

    // Open the onboarding modal
    this.modalRef = this.modalService.open(OnboardOrgUserModalComponent, {
      modalClass: 'modal-lg',
      keyboard: false,
      ignoreBackdropClick: true,
      data: {
        organizationId: organizationId
      }
    });
  }
}