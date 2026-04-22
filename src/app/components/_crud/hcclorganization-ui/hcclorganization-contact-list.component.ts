import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import {
  HcclUserProfileGETData,
  HcclUserProfileCriteria,
  HcclUserProfileGETDataSearchResults,
} from '@app/restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { Observable } from 'rxjs';
import { HcclOrganizationContactMessageModalComponent } from './hcclorganization-contact-message-modal.component';

@Component({
  selector: 'app-hcclorganization-contact-list',
  standalone: true,
  templateUrl: '../../_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../_global/abstract-list/abstract-list.component.scss'],
  imports: [CommonModule],
})
export class HcclOrganizationContactListComponent extends AbstractListComponent<
  HcclUserProfileGETData,
  HcclUserProfileCriteria,
  HcclUserProfileGETDataSearchResults
> {
  private messageModalRef: MdbModalRef<HcclOrganizationContactMessageModalComponent> | null = null;

  constructor() {
    super();
    this.searchHeading = 'Contacts';
    this.showingAddButton = false;
    this.showingIdCheckbox = false;
  }

  protected getGridColumns(): any[] {
    return [
      { id: 'contactName', header: [{ text: 'Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 180, adjust: true },
      { id: 'messageHandle', header: [{ text: 'Handle', align: 'center' }, { content: 'inputFilter' }], minWidth: 160, adjust: true },
      { id: 'cellPhoneNumber', header: [{ text: 'Phone', align: 'center' }, { content: 'inputFilter' }], minWidth: 140, adjust: true },
      { id: 'action', header: [{ text: '', align: 'center' }], width: 140, htmlEnable: true, template: () => {
        return `<button class="btn btn-sm btn-outline-primary message-btn"><i class="fas fa-envelope me-1"></i>Message</button>`;
      }},
    ];
  }

  protected override addGridEventListeners(grid: any): void {
    grid.events.on('cellClick', (row: any, col: any) => {
      if (col && col.id === 'action') {
        this.openMessageModal(row.id);
      }
    });
  }

  protected createCriteria(): HcclUserProfileCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true,
    };
  }

  protected findEntities(criteria: HcclUserProfileCriteria): Observable<HcclUserProfileGETDataSearchResults> {
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
      contactName: entity.theUser?.name || entity.externalUserName || entity.messageHandle || '',
      createdByInfo: entity.createdByInfo?.name || '',
      lastUpdatedByInfo: entity.lastUpdatedByInfo?.name || '',
      dateCreated: entity.dateCreated?.formattedDate || '',
      dateLastUpdated: entity.dateLastUpdated?.formattedDate || '',
    };
  }

  private openMessageModal(userProfileId: string): void {
    this.messageModalRef = this.modalService.open(HcclOrganizationContactMessageModalComponent, {
      modalClass: 'modal-lg',
      data: { userProfileId },
    });
  }
}
