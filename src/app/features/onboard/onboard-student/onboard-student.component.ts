import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { OnboardPublicHeaderComponent } from '../components/onboard-public-header.component';

interface SchoolOption {
  id: string;
  label: string;
}

type UiMessage = { message: string; severity?: number };

@Component({
  selector: 'app-onboard-student',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, OnboardPublicHeaderComponent],
  templateUrl: './onboard-student.component.html',
  styleUrl: './onboard-student.component.scss',
})
export class OnboardStudentComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);

  readonly servicePrefix = 'http://localhost:8099/trutesta-hccl-services';
  readonly tosVersion = '2026-03-01';

  loadingUiData = false;
  submitting = false;
  submitted = false;
  preloadFailed = false;
  schools: SchoolOption[] = [];
  messages: UiMessage[] = [];

  readonly years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  readonly months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    schoolId: ['', [Validators.required]],
    userName: ['', [Validators.required, Validators.minLength(3)]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    birthMonth: [0, [Validators.required, Validators.min(1), Validators.max(12)]],
    birthYear: [0, [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
    captchaToken: ['', [Validators.required]],
    acceptTos: [false, [Validators.requiredTrue]],
  });

  ngOnInit(): void {
    this.loadOnboardStudentUiData();
  }

  get canSubmit(): boolean {
    return !this.preloadFailed && !this.loadingUiData && !this.submitting && this.form.valid;
  }

  private extractMessages(payload: any): UiMessage[] {
    const msgs = payload?.messages?.messages || payload?.messages || payload?.errorList || [];
    return Array.isArray(msgs) ? msgs : [];
  }

  private parseSchools(payload: any): SchoolOption[] {
    const rawSchools =
      payload?.menuControlDataList?.menuControlDataList ||
      payload?.menuControlDataList ||
      payload?.schools ||
      [];

    if (!Array.isArray(rawSchools)) {
      return [];
    }

    return rawSchools
      .map((s: any) => ({
        id: String(s?.id ?? s?.value ?? '').trim(),
        label: String(s?.name ?? s?.label ?? s?.description ?? '').trim(),
      }))
      .filter((s: SchoolOption) => !!s.id && !!s.label);
  }

  loadOnboardStudentUiData(): void {
    this.loadingUiData = true;
    this.preloadFailed = false;
    this.messages = [];

    this.http
      .get<any>(`${this.servicePrefix}/hccl/public/onboard/student/ui-data`)
      .pipe(finalize(() => (this.loadingUiData = false)))
      .subscribe({
        next: (res) => {
          this.schools = this.parseSchools(res);
          if (!this.schools.length) {
            this.preloadFailed = true;
            this.messages = [{ message: 'School options could not be loaded.', severity: 3 }];
          }
        },
        error: () => {
          this.preloadFailed = true;
          this.messages = [{ message: 'Failed to load onboarding UI data. Please retry.', severity: 3 }];
        },
      });
  }

  useEmailForUserName(): void {
    const email = String(this.form.controls.email.value || '').trim().toLowerCase();
    if (!email) {
      return;
    }
    this.form.controls.userName.setValue(email);
    this.form.controls.userName.markAsDirty();
  }

  // Placeholder for CAPTCHA integration until site key wiring is in place.
  setCaptchaSolved(checked: boolean): void {
    this.form.controls.captchaToken.setValue(checked ? 'captcha-placeholder-token' : '');
  }

  submit(): void {
    if (!this.canSubmit) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.messages = [];
    const value = this.form.getRawValue();
    const payload = {
      email: value.email.trim(),
      schoolId: value.schoolId,
      userName: value.userName.trim(),
      firstName: value.firstName.trim(),
      lastName: value.lastName.trim(),
      birthMonth: Number(value.birthMonth),
      birthYear: Number(value.birthYear),
      captchaToken: value.captchaToken,
      acceptTos: value.acceptTos,
      tosVersion: this.tosVersion,
    };

    this.http
      .post<any>(`${this.servicePrefix}/api/registration`, payload)
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: (res) => {
          const responseMessages = this.extractMessages(res);
          if (responseMessages.length) {
            this.messages = responseMessages;
          }
          this.submitted = !!res?.success;
          if (!this.submitted && !this.messages.length) {
            this.messages = [{ message: 'Registration could not be completed.', severity: 3 }];
          }
        },
        error: (err) => {
          this.submitted = false;
          this.messages = this.extractMessages(err?.error);
          if (!this.messages.length) {
            this.messages = [{ message: 'Registration failed. Please try again.', severity: 3 }];
          }
        },
      });
  }

  resendVerification(): void {
    const email = String(this.form.controls.email.value || '').trim();
    if (!email) {
      this.messages = [{ message: 'Enter your email to resend verification.', severity: 2 }];
      return;
    }
    this.http.post(`${this.servicePrefix}/api/registration/resend-verification`, { email }).subscribe();
    this.messages = [{ message: 'If an account exists, a new verification email will be sent.', severity: 1 }];
  }
}
