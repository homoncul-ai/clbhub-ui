import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { OnboardPublicHeaderComponent } from '../components/onboard-public-header.component';

type OnboardMessage = { message: string; severity?: number };

@Component({
  selector: 'app-onboard-business-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, OnboardPublicHeaderComponent],
  templateUrl: './onboard-business-user.component.html',
  styleUrl: './onboard-business-user.component.scss',
})
export class OnboardBusinessUserComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  loading = false;
  setupComplete = false;
  inviteId = '';
  messages: OnboardMessage[] = [];
  readonly servicePrefix = 'http://localhost:8099/trutesta-hccl-services';

  readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: [''],
    messageHandle: ['', [Validators.required]],
    userName: [''],
    password: [''],
    acceptNotes: [''],
    inviteId: ['', [Validators.required]],
  });

  ngOnInit(): void {
    const params = new URLSearchParams(window.location.search);
    this.inviteId = params.get('inviteId') || '';
    this.form.patchValue({ inviteId: this.inviteId });
    if (this.inviteId) {
      this.loadInviteSetup(this.inviteId);
    }
  }

  private extractMessages(payload: any): OnboardMessage[] {
    const msgs = payload?.messages?.messages || payload?.messages || [];
    return Array.isArray(msgs) ? msgs : [];
  }

  private setMessages(messages: OnboardMessage[]): boolean {
    this.messages = messages;
    return messages.some((m) => Number(m?.severity || 0) >= 3);
  }

  private loadInviteSetup(inviteId: string): void {
    this.loading = true;
    const url = `${this.servicePrefix}/hccl/public/onboard/invite/setup?invitedId=${encodeURIComponent(inviteId)}`;
    this.http
      .get<any>(url)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          this.setupComplete = !this.setMessages(this.extractMessages(res));
          const inviteEmail = String(res?.invite?.emailAddress || '').trim();
          if (inviteEmail) {
            const local = inviteEmail.split('@')[0] || inviteEmail;
            this.form.patchValue({
              firstName: this.form.value.firstName || local,
              lastName: this.form.value.lastName || local,
              userName: this.form.value.userName || inviteEmail,
              messageHandle: this.form.value.messageHandle || local,
            });
          }
        },
        error: () => {
          this.setupComplete = false;
          this.messages = [{ message: 'Unable to load invite details.', severity: 3 }];
        },
      });
  }

  submit(): void {
    if (this.form.invalid) {
      this.messages = [{ message: 'Invite ID, first name, and message handle are required.', severity: 3 }];
      return;
    }

    this.loading = true;
    this.messages = [];

    const value = this.form.getRawValue();
    const payload = {
      inviteId: value.inviteId.trim(),
      firstName: value.firstName.trim(),
      lastName: value.lastName.trim() || undefined,
      messageHandle: value.messageHandle.trim(),
      userName: value.userName.trim() || undefined,
      password: value.password.trim() || undefined,
      acceptNotes: value.acceptNotes.trim() || undefined,
      consents: { consents: [] as string[] },
    };

    this.http
      .post<any>(`${this.servicePrefix}/hccl/public/onboard/invite`, payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          const hasError = this.setMessages(this.extractMessages(res));
          if (hasError) {
            return;
          }
          const redirectUrl = res?.dashboardUrl || '/public/onboard';
          if (redirectUrl.startsWith('http')) {
            window.location.assign(redirectUrl);
            return;
          }
          this.router.navigateByUrl(redirectUrl);
        },
        error: () => {
          this.messages = [{ message: 'Request failed. Please try again.', severity: 3 }];
        },
      });
  }
}
