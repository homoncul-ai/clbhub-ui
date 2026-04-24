import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import {
  HcclService,
  HandleInviteActionUIData,
  HandleInviteActionPOSTData,
  HandleInviteActionResponse,
} from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-hccluserinvite-action-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MdbFormsModule],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">
        <i class="fas fa-envelope-open me-2"></i>
        Invitation
      </h5>
      <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
    </div>

    <div class="modal-body">

      <!-- Loading state -->
      <div *ngIf="loadingUI" class="text-center py-4">
        <div class="spinner-border spinner-border-sm" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Loading invitation details...</p>
      </div>

      <!-- Load error -->
      <div *ngIf="loadError" class="alert alert-danger">
        <i class="fas fa-exclamation-triangle me-2"></i>{{ loadError }}
      </div>

      <!-- Invitation details -->
      <div *ngIf="!loadingUI && !loadError && uiData">

        <div class="card mb-3">
          <div class="card-body">
            <div class="row mb-2" *ngIf="uiData.invitedByUser?.entityDisplayName">
              <div class="col-4 fw-bold text-muted">Invited By</div>
              <div class="col-8">{{ uiData.invitedByUser?.entityDisplayName }}</div>
            </div>
            <div class="row mb-2" *ngIf="uiData.invite?.inviteCode">
              <div class="col-4 fw-bold text-muted">Invite Code</div>
              <div class="col-8">{{ uiData.invite?.inviteCode }}</div>
            </div>
            <div class="row mb-2" *ngIf="uiData.invite?.currentStateCode">
              <div class="col-4 fw-bold text-muted">Status</div>
              <div class="col-8">
                <span class="badge bg-info">{{ uiData.invite?.currentStateCode }}</span>
              </div>
            </div>
            <div class="row mb-2" *ngIf="uiData.invite?.organization?.entityDisplayName">
              <div class="col-4 fw-bold text-muted">Organization</div>
              <div class="col-8">{{ uiData.invite?.organization?.entityDisplayName }}</div>
            </div>
            <div class="row" *ngIf="uiData.invite?.notes">
              <div class="col-4 fw-bold text-muted">Notes</div>
              <div class="col-8">{{ uiData.invite?.notes }}</div>
            </div>
          </div>
        </div>

        <!-- INVITE_TO_MESSAGE hint -->
        <div *ngIf="uiData.invite?.inviteCode === 'INVITE_TO_MESSAGE'" class="alert alert-info mb-3">
          <i class="fas fa-info-circle me-2"></i>
          Accepting this invitation creates a message conversation.
        </div>

        <!-- Success message after action -->
        <div *ngIf="successMessage" class="alert alert-success">
          <i class="fas fa-check-circle me-2"></i>{{ successMessage }}
        </div>

        <!-- Error message after action -->
        <div *ngIf="actionError" class="alert alert-danger">
          <i class="fas fa-exclamation-triangle me-2"></i>{{ actionError }}
        </div>

        <!-- Notes form (only before action) -->
        <div *ngIf="!actionComplete" class="mb-3">
          <mdb-form-control>
            <textarea mdbInput
              class="form-control"
              id="actionNotes"
              rows="3"
              [(ngModel)]="notes">
            </textarea>
            <label mdbLabel class="form-label" for="actionNotes">Notes (optional)</label>
          </mdb-form-control>
        </div>

      </div>

    </div>

    <div class="modal-footer">
      <!-- Accept / Reject buttons (before action) -->
      <ng-container *ngIf="uiData && !actionComplete && !loadingUI">
        <button type="button"
          class="btn btn-success"
          [disabled]="submitting"
          (click)="handleAction(true)">
          <i class="fas fa-check me-1"></i>
          {{ submitting ? 'Processing...' : 'Accept' }}
        </button>
        <button type="button"
          class="btn btn-danger"
          [disabled]="submitting"
          (click)="handleAction(false)">
          <i class="fas fa-times me-1"></i>
          {{ submitting ? 'Processing...' : 'Reject' }}
        </button>
      </ng-container>

      <!-- Cancel / Close -->
      <button type="button" class="btn btn-secondary" (click)="closeModal()">
        {{ actionComplete ? 'Close' : 'Cancel' }}
      </button>
    </div>

    <!-- Debug -->
    <div class="modal-footer bg-light" style="font-size:0.75rem;">
      <details>
        <summary class="text-muted" style="cursor:pointer;">Debug: HandleInviteActionUIData</summary>
        <pre class="mb-0 text-muted mt-1" style="max-height:300px;overflow:auto;white-space:pre-wrap;">{{ uiData | json }}</pre>
      </details>
    </div>
  `,
})
export class HcclUserInviteActionModalComponent implements OnInit {
  private hcclService = inject(HcclService);

  inviteId: string = '';
  uiData: HandleInviteActionUIData | null = null;
  notes: string = '';

  loadingUI = true;
  loadError = '';
  submitting = false;
  actionComplete = false;
  successMessage = '';
  actionError = '';

  private actionResponse: HandleInviteActionResponse | null = null;

  constructor(public modalRef: MdbModalRef<HcclUserInviteActionModalComponent>) {}

  ngOnInit(): void {
    console.log('InviteActionModal inviteId:', this.inviteId);
    if (this.inviteId) {
      this.loadInviteUI();
    } else {
      this.loadingUI = false;
      this.loadError = 'No invite ID provided.';
    }
  }

  private loadInviteUI(): void {
    this.hcclService.inviteActionUI(this.inviteId).subscribe({
      next: (data: HandleInviteActionUIData) => {
        this.uiData = data;
        this.loadingUI = false;
      },
      error: (err) => {
        console.error('Error loading invite UI:', err);
        this.loadingUI = false;
        this.loadError = 'Failed to load invitation details.';
      },
    });
  }

  handleAction(accepted: boolean): void {
    this.submitting = true;
    this.actionError = '';

    const postData: HandleInviteActionPOSTData = {
      inviteId: this.inviteId,
      notes: this.notes,
      accepted,
    };

    this.hcclService.handleInviteAction(postData).subscribe({
      next: (response: HandleInviteActionResponse) => {
        this.submitting = false;
        this.actionComplete = true;
        this.actionResponse = response;
        this.successMessage = accepted
          ? 'Invitation accepted successfully!'
          : 'Invitation rejected.';
      },
      error: (err) => {
        console.error('Error handling invite action:', err);
        this.submitting = false;
        this.actionError = 'Failed to process invitation. Please try again.';
      },
    });
  }

  closeModal(): void {
    this.modalRef.close(this.actionResponse);
  }
}
