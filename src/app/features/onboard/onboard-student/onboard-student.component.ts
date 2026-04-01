import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ContractSectionComponent } from '@app/components/_global/contract-section/contract-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import {
  ConsentRequestPOSTData,
  HcclService,
  MenuControlData,
  MenuControlDataList,
  MultiConsentRequestGETData,
  OnboardStudentPOSTData,
} from '@app/restsvc/hccl.service';
import { OnboardPublicHeaderComponent } from '../components/onboard-public-header.component';

type UiMessage = { message: string; severity?: number };

@Component({
  selector: 'app-onboard-student',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    OnboardPublicHeaderComponent,
    MenuControlDataListComponent,
    ContractSectionComponent,
  ],
  templateUrl: './onboard-student.component.html',
  styleUrl: './onboard-student.component.scss',
})
export class OnboardStudentComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly hcclService = inject(HcclService);

  loadingUiData = false;
  submitting = false;
  submitted = false;
  preloadFailed = false;
  schoolSelectData: MenuControlDataList | null = null;
  consentData: MultiConsentRequestGETData | null = null;
  selectedConsents: ConsentRequestPOSTData[] = [];
  allContractsAccepted = false;
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
  });

  ngOnInit(): void {
    this.loadOnboardStudentUiData();
  }

  get canSubmit(): boolean {
    return (
      !this.preloadFailed &&
      !this.loadingUiData &&
      !this.submitting &&
      this.form.valid &&
      this.allContractsAccepted
    );
  }

  private extractMessages(payload: any): UiMessage[] {
    const msgs = payload?.messages?.messages || payload?.messages || payload?.errorList || [];
    return Array.isArray(msgs) ? msgs : [];
  }

  loadOnboardStudentUiData(): void {
    this.loadingUiData = true;
    this.preloadFailed = false;
    this.messages = [];

    this.hcclService
      .resolvePublicSignupUIData('')
      .pipe(finalize(() => (this.loadingUiData = false)))
      .subscribe({
        next: (res) => {
          this.schoolSelectData = res?.schoolSelectData || null;
          this.consentData = res?.consents || null;
          this.allContractsAccepted = !(this.consentData?.contracts?.length || 0);
          const menuItems = this.schoolSelectData?.menuItems || [];
          if (!menuItems.length) {
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

  onSchoolSelectionChange(selected: MenuControlData | null): void {
    this.form.controls.schoolId.setValue(selected?.id || '');
    this.form.controls.schoolId.markAsTouched();
    this.form.controls.schoolId.updateValueAndValidity();
  }

  onConsentSelectionChange(consents: ConsentRequestPOSTData[]): void {
    this.selectedConsents = consents;
  }

  onAllContractsAcceptedChange(isAccepted: boolean): void {
    this.allContractsAccepted = isAccepted;
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
    const payload: OnboardStudentPOSTData & Record<string, unknown> = {
      schoolId: value.schoolId,
      orgUserData: {
        organizationCode: value.schoolId,
        emailAddress: value.email.trim(),
        userName: value.userName.trim(),
        firstName: value.firstName.trim(),
        lastName: value.lastName.trim(),
      },
      consents: {
        consents: this.selectedConsents,
      },
      // Keep additional spec fields until API contract is finalized.
      birthMonth: Number(value.birthMonth),
      birthYear: Number(value.birthYear),
      captchaToken: value.captchaToken,
    };

    this.hcclService
      .onboardStudent(payload)
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: (res) => {
          const responseMessages = this.extractMessages(res);
          if (responseMessages.length) {
            this.messages = responseMessages;
          }
          this.submitted = !responseMessages.some((msg) => Number(msg?.severity || 0) >= 3);
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
    this.messages = [{ message: 'Resend verification endpoint not yet available in HcclService.', severity: 2 }];
  }
}
