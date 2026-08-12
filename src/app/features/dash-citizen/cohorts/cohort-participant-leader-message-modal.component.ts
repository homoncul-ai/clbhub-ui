import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { PMessageUiComponent } from '@app/components/_crud/pmessage-ui/pmessage-ui.component';

@Component({
  selector: 'app-cohort-participant-leader-message-modal',
  standalone: true,
  imports: [CommonModule, PMessageUiComponent],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">Message {{ leaderName }}</h5>
      <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <app-pmessage-ui *ngIf="messageId" [id]="messageId"></app-pmessage-ui>
      <p *ngIf="!messageId" class="text-muted small mb-0">
        Wireframe: set a leader <code>messageId</code> to load the conversation.
      </p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="closeModal()">Close</button>
    </div>
  `,
})
export class CohortParticipantLeaderMessageModalComponent {
  /** Set by MdbModalService from open({ data: { leaderName, messageId } }). */
  leaderName = '';
  messageId = '';

  constructor(public modalRef: MdbModalRef<CohortParticipantLeaderMessageModalComponent>) {}

  closeModal(): void {
    this.modalRef.close();
  }
}
