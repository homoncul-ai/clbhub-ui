import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HcclService,
  HcclUserInviteGETData,
  HcclUserInviteCriteria,
  HcclUserInviteGETDataSearchResults,
  HandleInviteActionResponse,
} from '@app/restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { Observable } from 'rxjs';
import { HcclUserInviteActionModalComponent } from './hccluserinvite-action-modal.component';

@Component({
  selector: 'app-hccluserinvite-list',
  standalone: true,
  templateUrl: '../../_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../_global/abstract-list/abstract-list.component.scss'],
  imports: [CommonModule]
})
export class HcclUserInviteListComponent extends AbstractListComponent<
  HcclUserInviteGETData,
  HcclUserInviteCriteria,
  HcclUserInviteGETDataSearchResults
> {
  @Output() inviteActionCompleted = new EventEmitter<HandleInviteActionResponse>();

  constructor() {
    super();
    this.searchHeading = 'Hccl User Invites';
    this.showingAddButton = true;
    this.showingIdCheckbox = true;
  }

  protected getGridColumns(): any[] {
    return [
      { id: 'inviteCode', header: [{ text: 'Invite Code', align: 'center' }, { content: 'inputFilter' }], width: '20%' },
      { id: 'invitedByName', header: [{ text: 'Invited By', align: 'center' }, { content: 'inputFilter' }], width: '20%' },
      { id: 'currentStateCode', header: [{ text: 'Status', align: 'center' }, { content: 'inputFilter' }], width: '15%' },
      { id: 'organizationName', header: [{ text: 'Organization', align: 'center' }, { content: 'inputFilter' }], width: '20%' },
      { id: 'dateCreated', header: [{ text: 'Date', align: 'center' }], width: '15%' },
      { id: 'action', header: [{ text: '', align: 'center' }], width: '10%', htmlEnable: true, template: () => {
        return `<i class="fas fa-envelope text-primary" style="cursor:pointer;font-size:1.1rem;" title="Open Invitation"></i>`;
      }},
    ];
  }

  protected override addGridEventListeners(grid: any): void {
    grid.events.on('cellClick', (row: any, col: any) => {
      if (col && col.id === 'action') {
        const inviteId = typeof row === 'string' ? row : row?.id;
        if (inviteId) {
          this.openInviteActionModal(inviteId);
        }
      }
    });
  }

  private openInviteActionModal(inviteId: string): void {
    const modalRef = this.modalService.open(HcclUserInviteActionModalComponent, {
      modalClass: 'modal-lg',
      data: { inviteId },
    });

    modalRef.onClose.subscribe((response: HandleInviteActionResponse | null) => {
      if (response) {
        this.inviteActionCompleted.emit(response);
        this.onRefresh();
      }
    });
  }

  protected createCriteria(): HcclUserInviteCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected findEntities(criteria: HcclUserInviteCriteria): Observable<HcclUserInviteGETDataSearchResults> {
    return this.hcclService.findHcclUserInvites(criteria);
  }

  protected hasSearchResults(response: HcclUserInviteGETDataSearchResults): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(response: HcclUserInviteGETDataSearchResults): HcclUserInviteGETData[] {
    return response.searchResults || [];
  }

  protected override formatEntityData(entity: HcclUserInviteGETData): any {
    return {
      invitedByName: entity.createdByUserProfile?.entityDisplayName || entity.createdByInfo?.name || '',
      organizationName: entity.organization?.entityDisplayName || '',
      dateCreated: entity.dateCreated?.formattedDate || '',
    };
  }
}
