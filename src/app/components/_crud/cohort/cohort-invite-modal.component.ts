import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import {
  HcclService,
  HcclUserProfileGETData,
} from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-cohort-invite-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MdbFormsModule],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">
        <i class="fas fa-envelope me-2"></i>
        Invite User to Cohort
      </h5>
      <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
    </div>

    <div class="modal-body">
      <div *ngIf="error" class="alert alert-danger">{{ error }}</div>

      <div class="mb-3">
        <label class="form-label" for="cohortInviteLookupEmail">Email address</label>
        <div class="input-group">
          <input
            id="cohortInviteLookupEmail"
            type="email"
            class="form-control"
            [(ngModel)]="email"
            [disabled]="searching || submitting"
            placeholder="user@example.com"
            (keyup.enter)="lookupProfiles()" />
          <button
            type="button"
            class="btn btn-outline-primary"
            [disabled]="searching || submitting || !email.trim()"
            (click)="lookupProfiles()">
            {{ searching ? 'Searching...' : 'Look Up' }}
          </button>
        </div>
      </div>

      <div *ngIf="searched && !searching && !matchingProfiles.length" class="alert alert-info mb-0">
        <i class="fas fa-info-circle me-2"></i>
        <strong>{{ searchedEmail }}</strong> is not in the system yet.
        They will be invited to create a new account before joining this cohort.
        Click <strong>Send Invite</strong> to send that invitation.
      </div>

      <div *ngIf="matchingProfiles.length" class="profile-results">
        <p class="text-muted mb-2">
          Select one profile to invite for <strong>{{ searchedEmail }}</strong>:
        </p>
        <div class="table-responsive">
          <table class="table table-sm table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th style="width: 2.5rem;"></th>
                <th>Message Handle</th>
                <th>Email</th>
                <th>Organization</th>
              </tr>
            </thead>
            <tbody>
              <tr
                *ngFor="let profile of matchingProfiles"
                [class.table-active]="selectedProfileId === profile.id"
                (click)="selectProfile(profile)"
                style="cursor: pointer;">
                <td>
                  <input
                    type="radio"
                    name="cohortInviteProfile"
                    [value]="profile.id"
                    [checked]="selectedProfileId === profile.id"
                    (click)="$event.stopPropagation()"
                    (change)="selectProfile(profile)" />
                </td>
                <td>{{ profile.messageHandle || '—' }}</td>
                <td>{{ profile.userEmail || searchedEmail }}</td>
                <td>{{ getOrganizationName(profile) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
      <button
        type="button"
        class="btn btn-primary"
        [disabled]="submitting || !canSendInvite()"
        (click)="sendInvite()">
        {{ submitting ? 'Sending...' : 'Send Invite' }}
      </button>
    </div>
  `,
  styles: [`
    .modal-header {
      background-color: #f8f9fa;
      border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    }

    .modal-title {
      color: #333;
      font-weight: 600;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .profile-results {
      margin-top: 1rem;
    }
  `],
})
export class CohortInviteModalComponent implements OnInit {
  private hcclService = inject(HcclService);

  cohortId = '';
  email = '';
  searchedEmail = '';
  searching = false;
  searched = false;
  submitting = false;
  error = '';
  matchingProfiles: HcclUserProfileGETData[] = [];
  selectedProfileId = '';

  constructor(public modalRef: MdbModalRef<CohortInviteModalComponent>) {}

  ngOnInit(): void {
    if (this.modalRef && (this.modalRef as MdbModalRef<CohortInviteModalComponent> & { data?: { cohortId?: string } }).data) {
      this.cohortId = (this.modalRef as MdbModalRef<CohortInviteModalComponent> & { data?: { cohortId?: string } }).data?.cohortId || '';
    }
  }

  lookupProfiles(): void {
    this.error = '';
    this.searched = false;
    this.matchingProfiles = [];
    this.selectedProfileId = '';

    const email = this.email.trim();
    if (!email) {
      this.error = 'Email address is required.';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.error = 'Enter a valid email address.';
      return;
    }

    this.searching = true;
    this.searchedEmail = email;
    this.hcclService.findHcclUserProfiles({
      userEmail: email,
      pageNumber: 1,
      pageSize: 50,
      isPaging: true,
      optionalDataHint: 'all',
    }).subscribe({
      next: (response) => {
        this.searching = false;
        this.searched = true;
        this.matchingProfiles = response.searchResults || [];
        if (this.matchingProfiles.length === 1 && this.matchingProfiles[0].id) {
          this.selectedProfileId = this.matchingProfiles[0].id;
        }
      },
      error: () => {
        this.searching = false;
        this.searched = true;
        this.error = 'Failed to look up user profiles.';
      },
    });
  }

  selectProfile(profile: HcclUserProfileGETData): void {
    this.selectedProfileId = profile.id || '';
  }

  getOrganizationName(profile: HcclUserProfileGETData): string {
    return profile.organization?.entityDisplayName || '—';
  }

  canSendInvite(): boolean {
    if (!this.searched || this.searching) {
      return false;
    }
    if (!this.matchingProfiles.length) {
      return !!this.searchedEmail;
    }
    return !!this.selectedProfileId;
  }

  sendInvite(): void {
    this.error = '';

    if (!this.cohortId) {
      this.error = 'Cohort is not available.';
      return;
    }

    if (!this.matchingProfiles.length) {
      if (!this.searchedEmail) {
        this.error = 'Look up an email address before sending an invite.';
        return;
      }
      this.submitInvite({ emailAddress: this.searchedEmail });
      return;
    }

    const profile = this.matchingProfiles.find((p) => p.id === this.selectedProfileId);
    if (!profile?.id) {
      this.error = 'Select a user profile to invite.';
      return;
    }

    this.submitInvite({
      userProfileToInviteId: profile.id,
      emailAddress: profile.userEmail || this.searchedEmail,
      profile,
    });
  }

  private submitInvite(payload: {
    emailAddress: string;
    userProfileToInviteId?: string;
    profile?: HcclUserProfileGETData;
  }): void {
    this.submitting = true;
    this.hcclService.inviteCitizenToCohort(this.cohortId, {
      userProfileToInviteId: payload.userProfileToInviteId,
      emailAddress: payload.emailAddress,
    }).subscribe({
      next: (response) => {
        this.submitting = false;
        const errors = response.messages?.messages?.filter((m) => m.severity === 1) || [];
        if (errors.length) {
          this.error = errors.map((e) => e.message).join(' ');
          return;
        }
        this.modalRef.close({
          invited: true,
          email: payload.emailAddress,
          profile: payload.profile,
          isNewUser: !payload.userProfileToInviteId,
        });
      },
      error: () => {
        this.submitting = false;
        this.error = 'Failed to send invitation. Please try again.';
      },
    });
  }

  closeModal(): void {
    this.modalRef.close({ invited: false });
  }
}
