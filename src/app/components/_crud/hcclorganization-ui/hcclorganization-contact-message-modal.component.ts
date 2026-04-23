import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import {
  CreateInviteActionUIData,
  CreateInviteActionPOSTData,
  HcclService,
} from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-hcclorganization-contact-message-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MdbFormsModule],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">Send Message</h5>
      <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
    </div>
    <div class="modal-body">

      <!-- Invite already pending -->
      <div *ngIf="uiData?.invite" class="alert alert-info">
        <i class="fas fa-hourglass-half me-2"></i>
        A message invite is waiting for response.
      </div>

      <!-- Create invite form -->
      <div *ngIf="!uiData?.invite">
        <div class="mb-3">
          <mdb-form-control>
            <textarea mdbInput
              class="form-control"
              id="notes"
              rows="4"
              [(ngModel)]="notes">
            </textarea>
            <label mdbLabel class="form-label" for="notes">Message to {{ inviteeHandle }}</label>
          </mdb-form-control>
        </div>

        <div *ngIf="successMessage" class="alert alert-success mt-3">
          <i class="fas fa-check-circle me-2"></i>{{ successMessage }}
        </div>
        <div *ngIf="errorMessage" class="alert alert-danger mt-3">
          <i class="fas fa-exclamation-triangle me-2"></i>{{ errorMessage }}
        </div>
      </div>

    </div>
    <div class="modal-footer">
      <button *ngIf="!uiData?.invite && !successMessage"
        type="button"
        class="btn btn-primary"
        [disabled]="sending"
        (click)="sendInvite()">
        <i class="fas fa-paper-plane me-1"></i>
        {{ sending ? 'Sending...' : 'Invite' }}
      </button>
      <button type="button" class="btn btn-secondary" (click)="closeModal()">Close</button>
    </div>

    <!-- Debug -->
    <div class="modal-footer bg-light" style="font-size:0.75rem;">
      <pre class="mb-0 text-muted">inviteeId: {{ inviteeId | json }}
inviteeUser.id: {{ uiData?.inviteeUser?.id | json }}
invitedByUser.id: {{ uiData?.invitedByUser?.id | json }}
inviteCode: {{ uiData?.inviteCode | json }}
invite: {{ uiData?.invite ? 'exists' : 'null' }}
message: {{ uiData?.message ? uiData?.message?.id : 'null' }}</pre>
    </div>
  `,
})
export class HcclOrganizationContactMessageModalComponent implements OnInit {
  private hcclService = inject(HcclService);

  uiData: CreateInviteActionUIData | null = null;
  inviteeId: string = '';
  notes: string = '';
  inviteeHandle: string = '';
  sending = false;
  successMessage = '';
  errorMessage = '';

  constructor(public modalRef: MdbModalRef<HcclOrganizationContactMessageModalComponent>) {}

  ngOnInit(): void {
    const data = (this.modalRef as any).data;
    if (data?.uiData) {
      this.uiData = data.uiData;
      this.inviteeHandle = this.uiData?.inviteeUser?.messageHandle || 'contact';
    }
    if (data?.inviteeId) {
      this.inviteeId = data.inviteeId;
    }
  }

  sendInvite(): void {
    if (!this.uiData) return;

    this.sending = true;
    this.errorMessage = '';

    const postData: CreateInviteActionPOSTData = {
      inviteCode: this.uiData.inviteCode,
      notes: this.notes,
      invitedByUserId: this.uiData.invitedByUser?.id,
      inviteeUserId: this.inviteeId || this.uiData.inviteeUser?.id,
    };

    this.hcclService.handleNewMessageInviteCreate(postData).subscribe({
      next: () => {
        this.sending = false;
        this.successMessage = 'Invite sent successfully!';
      },
      error: () => {
        this.sending = false;
        this.errorMessage = 'Failed to send invite. Please try again.';
      },
    });
  }

  closeModal(): void {
    this.modalRef.close();
  }
}
