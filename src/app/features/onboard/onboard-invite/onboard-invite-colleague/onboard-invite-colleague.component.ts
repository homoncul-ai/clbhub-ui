import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { SimpleMessageList } from '@app/restsvc/common-request-service.model';
import {
  HcclService,
  HcclUserInviteGETData,
  HandleInviteActionPOSTData,
} from '@app/restsvc/hccl.service';
import { OnboardPublicHeaderComponent } from '../../components/onboard-public-header.component';

@Component({
  selector: 'app-onboard-invite-colleague',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    OnboardPublicHeaderComponent,
    SimpleMessagesSectionComponent,
  ],
  templateUrl: './onboard-invite-colleague.component.html',
  styleUrl: './onboard-invite-colleague.component.scss',
})
export class OnboardInviteColleagueComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly hcclService = inject(HcclService);

  loading = false;
  setupComplete = false;
  inviteId = '';
  invite?: HcclUserInviteGETData;
  introTitle = 'Colleague invitation';
  introText = '';
  inviteNotes = '';
  expiresText = '';
  messagesList: SimpleMessageList = { messages: [] };

  readonly form = this.fb.nonNullable.group({
    accepted: [false, [Validators.requiredTrue]],
    notes: [''],
  });

  get hasErrorMessages(): boolean {
    return (this.messagesList.messages || []).some((msg) => Number(msg?.severity ?? 0) === 1);
  }

  ngOnInit(): void {
    this.inviteId = String(this.route.snapshot.queryParamMap.get('inviteId') || '').trim();
    if (!this.inviteId) {
      this.messagesList = {
        messages: [{ message: 'Missing inviteId query parameter.', severity: 1 }],
      };
      return;
    }
    this.loadInviteSetup(this.inviteId);
  }

  private loadInviteSetup(inviteId: string): void {
    this.loading = true;
    this.hcclService
      .onboardInviteSetup(inviteId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          const apiMessages = res?.messages?.messages || [];
          this.messagesList = { messages: apiMessages };
          if (this.hasErrorMessages) {
            this.setupComplete = false;
            return;
          }
          this.invite = res?.invite;
          this.applyIntroFromInvite(this.invite);
          this.setupComplete = true;
        },
        error: () => {
          this.setupComplete = false;
          this.messagesList = {
            messages: [{ message: 'Unable to load invite details.', severity: 1 }],
          };
        },
      });
  }

  private applyIntroFromInvite(invite?: HcclUserInviteGETData): void {
    const orgName =
      invite?.organization?.entityDisplayName ||
      invite?.organization?.name ||
      'your organization';
    const inviteCode = String(invite?.inviteCode || '').trim();
    const teamLabel = this.resolveTeamLabel(inviteCode);

    this.introTitle = `Welcome to the Club — clbhub.org`;
    this.introText =
      `You've been invited to join the ${teamLabel} at ${orgName}. ` +
      `Please take a few minutes to accept this invitation. ` +
      `We'll create your account so you can sign in, update your profile, and start collaborating.`;
    const rawNotes = String(invite?.notes || '').trim();
    // Invite modal stores a placeholder when the inviter left notes blank.
    this.inviteNotes =
      !rawNotes || rawNotes === '--- no notes ---' ? '' : rawNotes;
    this.expiresText = String(invite?.dateExpires?.formattedDateTime || '').trim();
  }

  private resolveTeamLabel(inviteCode: string): string {
    switch (inviteCode) {
      case 'INVITE_SCHOOL_COLLEAGUE':
        return 'school team';
      case 'INVITE_NONPROFIT_COLLEAGUE':
        return 'nonprofit team';
      case 'INVITE_BUSINESS_COLLEAGUE':
        return 'business team';
      default:
        return 'team';
    }
  }

  submit(): void {
    if (!this.inviteId) {
      this.messagesList = {
        messages: [{ message: 'Missing inviteId query parameter.', severity: 1 }],
      };
      return;
    }
    if (this.form.invalid) {
      this.messagesList = {
        messages: [{ message: 'Please accept the invitation to continue.', severity: 1 }],
      };
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.messagesList = { messages: [] };

    const value = this.form.getRawValue();
    const payload: HandleInviteActionPOSTData = {
      realmName: 'hav',
      inviteId: this.inviteId,
      accepted: !!value.accepted,
      notes: value.notes.trim() || undefined,
    };

    this.hcclService
      .handlePublicInviteAction(payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          const apiMessages = res?.messages?.messages || [];
          this.messagesList = { messages: apiMessages };
          if (this.hasErrorMessages) {
            return;
          }
          const redirectUrl = String(res?.redirectUrl || '').trim();
          if (!redirectUrl) {
            this.messagesList = {
              messages: [
                {
                  message: 'Invitation processed, but no redirect URL was returned.',
                  severity: 1,
                },
              ],
            };
            return;
          }
          // Hard redirect so Keycloak auth runs when leaving the public area.
          window.location.assign(redirectUrl);
        },
        error: () => {
          this.messagesList = {
            messages: [{ message: 'Request failed. Please try again.', severity: 1 }],
          };
        },
      });
  }
}
