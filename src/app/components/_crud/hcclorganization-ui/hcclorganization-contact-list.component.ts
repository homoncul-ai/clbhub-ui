import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import {
  HcclUserProfileGETData,
  HcclUserProfileCriteria,
  HcclUserProfileGETDataSearchResults,
  CreateInviteActionUIData,
} from '@app/restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { Observable } from 'rxjs';
import { HcclOrganizationContactMessageModalComponent } from './hcclorganization-contact-message-modal.component';
import { HcclOrganizationContactPmessageModalComponent } from './hcclorganization-contact-pmessage-modal.component';

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
  constructor() {
    super();
    this.searchHeading = 'Contacts';
    this.showingAddButton = false;
    this.showingIdCheckbox = false;
  }

  protected getGridColumns(): any[] {
    return [
      { id: 'contactName', header: [{ text: 'Name', align: 'center' }, { content: 'inputFilter' }], width: '20%' },
      { id: 'messageHandle', header: [{ text: 'Handle', align: 'center' }, { content: 'inputFilter' }], width: '20%' },
      { id: 'cellPhoneNumber', header: [{ text: 'Phone', align: 'center' }, { content: 'inputFilter' }], width: '15%' },
      { id: 'description', header: [{ text: 'Description', align: 'center' }, { content: 'inputFilter' }], width: '40%' },
      { id: 'action', header: [{ text: '', align: 'center' }], width: '5%', htmlEnable: true, template: () => {
        return `<i class="fas fa-envelope text-primary" style="cursor:pointer;font-size:1.1rem;" title="Send Message"></i>`;
      }},
    ];
  }

  protected override addGridEventListeners(grid: any): void {
    grid.events.on('cellClick', (row: any, col: any) => {
      if (col && col.id === 'action') {
        const userProfileId = typeof row === 'string' ? row : row?.id;
        console.log('cellClick action - row:', row, 'resolved userProfileId:', userProfileId);
        if (userProfileId) {
          this.sendMessage(userProfileId);
        }
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

  private sendMessage(userProfileId: string): void {
    console.log('sendMessage: ' + userProfileId);
    this.hcclService.newMessageInviteUI(userProfileId).subscribe({
      next: (uiData: CreateInviteActionUIData) => {
        if (uiData.message?.id) {
          this.openPmessageModal(uiData.message.id, uiData.message.title);
        } else {
          this.openInviteModal(uiData, userProfileId);
        }
      },
      error: (err) => {
        console.error('Error initiating message invite:', err);
      },
    });
  }

  private openPmessageModal(messageId: string, title?: string): void {
    this.modalService.open(HcclOrganizationContactPmessageModalComponent, {
      modalClass: 'modal-xl',
      data: { messageId, title: title || 'Message' },
    });
  }

  private openInviteModal(uiData: CreateInviteActionUIData, inviteeId: string): void {
    this.modalService.open(HcclOrganizationContactMessageModalComponent, {
      modalClass: 'modal-lg',
      data: { uiData, inviteeId },
    });
  }
}
