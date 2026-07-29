import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { HcclUserInviteListComponent } from '@app/components/_crud/hccluserinvite/hccluserinvite-list.component';
import { InviteColleagueModalComponent } from '@app/features/dash-ecoadmin/orgs/invite-colleague-modal.component';

@Component({
  selector: 'app-provider-details-invitations-list',
  standalone: true,
  templateUrl: '../../../components/_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../../components/_global/abstract-list/abstract-list.component.scss'],
  imports: [CommonModule]
})
export class ProviderDetailsInvitationsListComponent extends HcclUserInviteListComponent {
  protected inviteCode = 'INVITE_SCHOOL_COLLEAGUE';
  protected modalRef?: MdbModalRef<InviteColleagueModalComponent>;

  constructor() {
    super();
    this.searchHeadingLabel = 'Invitations';
    this.searchHeading = 'Invitations';
    this.showingAddButton = true;
    this.showingIdCheckbox = false;
    this.showingGoButton = false;
    this.addButtonLabel = 'Invite';
    this.searchPlaceholder = 'Search by email';
  }

  protected override getGridColumns(): any[] {
    return [
      { id: 'emailAddress', header: [{ text: 'Email', align: 'center' }, { content: 'inputFilter' }], width: '28%' },
      { id: 'currentStateCode', header: [{ text: 'Status', align: 'center' }, { content: 'inputFilter' }], width: '15%' },
      { id: 'invitedByName', header: [{ text: 'Invited By', align: 'center' }, { content: 'inputFilter' }], width: '20%' },
      { id: 'dateCreated', header: [{ text: 'Date', align: 'center' }], width: '15%' },
      { id: 'inviteCode', header: [{ text: 'Invite Code', align: 'center' }, { content: 'inputFilter' }], width: '12%' },
      { id: 'action', header: [{ text: '', align: 'center' }], width: '10%', htmlEnable: true, template: () => {
        return `<i class="fas fa-envelope text-primary" style="cursor:pointer;font-size:1.1rem;" title="Open Invitation"></i>`;
      }},
    ];
  }

  protected override onAdd(): void {
    const organizationId = this.criteria?.organizationId;

    const modalRef = this.modalService.open(InviteColleagueModalComponent, {
      modalClass: 'modal-lg',
      keyboard: false,
      ignoreBackdropClick: true,
      data: {
        organizationId,
        inviteCode: this.inviteCode
      }
    });
    this.modalRef = modalRef;

    if (modalRef.component) {
      modalRef.component.organizationId = organizationId;
      modalRef.component.inviteCode = this.inviteCode;
    }

    modalRef.onClose.subscribe(() => {
      this.onRefresh();
    });
  }
}
