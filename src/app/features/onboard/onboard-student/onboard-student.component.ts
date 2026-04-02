import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ContractSectionComponent } from '@app/components/_global/contract-section/contract-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import {
  ConsentRequestPOSTData,
  HcclService,
  MenuControlData,
  MenuControlDataList,
  MultiConsentRequestGETData,
  OnboardStudentPOSTData,
} from '@app/restsvc/hccl.service';
import { SimpleMessage, SimpleMessageList } from '@app/restsvc/common-request-service.model';
import { OnboardPublicHeaderComponent } from '../components/onboard-public-header.component';

declare global {
  interface Window {
    grecaptcha?: {
      render: (container: HTMLElement, parameters: Record<string, unknown>) => number;
      reset: (widgetId?: number) => void;
    };
    __onRecaptchaLoad?: () => void;
  }
}

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
    SimpleMessagesSectionComponent,
  ],
  templateUrl: './onboard-student.component.html',
  styleUrl: './onboard-student.component.scss',
})
export class OnboardStudentComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly hcclService = inject(HcclService);
  @ViewChild('captchaContainer') captchaContainer?: ElementRef<HTMLDivElement>;
  private recaptchaWidgetId: number | null = null;
  private recaptchaScriptPromise: Promise<void> | null = null;
  readonly recaptchaSiteKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

  loadingUiData = false;
  submitting = false;
  submitted = false;
  preloadFailed = false;
  schoolSelectData: MenuControlDataList | null = null;
  consentData: MultiConsentRequestGETData | null = null;
  selectedConsents: ConsentRequestPOSTData[] = [];
  allContractsAccepted = false;
  messagesList: SimpleMessageList = { messages: [] };

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
    messageHandle: ['', [Validators.required, Validators.minLength(2)]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    initialPassword: ['', [Validators.required, Validators.minLength(8)]],
    verifyPassword: ['', [Validators.required]],
    birthMonth: [0, [Validators.required, Validators.min(1), Validators.max(12)]],
    birthYear: [0, [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
    captchaToken: ['', [Validators.required]],
  }, { validators: [this.passwordsMatchValidator] });

  ngOnInit(): void {
    this.loadOnboardStudentUiData();
  }

  async ngAfterViewInit(): Promise<void> {
    await this.initializeRecaptcha();
  }

  ngOnDestroy(): void {
    if (this.recaptchaWidgetId !== null && window.grecaptcha) {
      window.grecaptcha.reset(this.recaptchaWidgetId);
    }
  }

  get canSubmit(): boolean {
    return !this.loadingUiData && !this.submitting;
  }

  private extractMessages(payload: any): SimpleMessage[] {
    const msgs = payload?.messages?.messages || payload?.messages || payload?.errorList || [];
    if (!Array.isArray(msgs)) {
      return [];
    }
    return msgs.map((msg: any) => ({
      message: msg?.message || msg?.exceptionMessage || msg?.messageCode || 'Unknown message',
      severity: Number(msg?.severity ?? 1),
      messageCode: msg?.messageCode,
    }));
  }

  private setMessages(messages: SimpleMessage[]): void {
    this.messagesList = { messages };
  }

  private buildValidationMessages(): SimpleMessage[] {
    const messages: SimpleMessage[] = [];
    const v = this.form.controls;

    if (this.loadingUiData) messages.push({ message: 'Onboarding data is still loading.', severity: 2 });
    if (this.preloadFailed) messages.push({ message: 'School options could not be loaded.', severity: 1 });
    if (!v.schoolId.value) messages.push({ message: 'Select a school.', severity: 1 });
    if (v.email.hasError('required')) messages.push({ message: 'Email is required.', severity: 1 });
    if (v.email.hasError('email')) messages.push({ message: 'Enter a valid email address (example: name@example.com).', severity: 1 });
    if (!v.userName.value?.trim()) messages.push({ message: 'Username is required.', severity: 1 });
    if (!v.messageHandle.value?.trim()) messages.push({ message: 'Message handle is required.', severity: 1 });
    if (!v.firstName.value?.trim()) messages.push({ message: 'First name is required.', severity: 1 });
    if (!v.lastName.value?.trim()) messages.push({ message: 'Last name is required.', severity: 1 });
    if (!v.initialPassword.value?.trim()) messages.push({ message: 'Password is required.', severity: 1 });
    if (v.initialPassword.hasError('minlength')) messages.push({ message: 'Password must be at least 8 characters.', severity: 1 });
    if (!v.verifyPassword.value?.trim()) messages.push({ message: 'Verify password is required.', severity: 1 });
    if (this.form.hasError('passwordMismatch')) messages.push({ message: 'Passwords must match.', severity: 1 });
    if (!v.captchaToken.value) messages.push({ message: 'Complete the captcha challenge.', severity: 1 });
    if (!this.allContractsAccepted) messages.push({ message: 'Accept all contract checkboxes to continue.', severity: 1 });

    return messages;
  }

  private passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('initialPassword')?.value;
    const verifyPassword = control.get('verifyPassword')?.value;
    if (!password || !verifyPassword) {
      return null;
    }
    return password === verifyPassword ? null : { passwordMismatch: true };
  }

  private async initializeRecaptcha(): Promise<void> {
    if (!this.captchaContainer?.nativeElement) {
      return;
    }
    await this.loadRecaptchaScript();
    if (!window.grecaptcha || this.recaptchaWidgetId !== null) {
      return;
    }
    this.recaptchaWidgetId = window.grecaptcha.render(this.captchaContainer.nativeElement, {
      sitekey: this.recaptchaSiteKey,
      callback: (token: string) => this.form.controls.captchaToken.setValue(token || ''),
      'expired-callback': () => this.form.controls.captchaToken.setValue(''),
      'error-callback': () => this.form.controls.captchaToken.setValue(''),
    });
  }

  private loadRecaptchaScript(): Promise<void> {
    if (window.grecaptcha?.render) {
      return Promise.resolve();
    }
    if (this.recaptchaScriptPromise) {
      return this.recaptchaScriptPromise;
    }

    this.recaptchaScriptPromise = new Promise<void>((resolve, reject) => {
      const existingScript = document.querySelector('script[data-recaptcha-script="true"]') as HTMLScriptElement | null;
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(), { once: true });
        existingScript.addEventListener('error', () => reject(new Error('Failed to load reCAPTCHA script.')), {
          once: true,
        });
        return;
      }

      window.__onRecaptchaLoad = () => resolve();
      const script = document.createElement('script');
      script.setAttribute('data-recaptcha-script', 'true');
      script.src = 'https://www.google.com/recaptcha/api.js?onload=__onRecaptchaLoad&render=explicit';
      script.async = true;
      script.defer = true;
      script.onerror = () => reject(new Error('Failed to load reCAPTCHA script.'));
      document.head.appendChild(script);
    });

    return this.recaptchaScriptPromise;
  }

  loadOnboardStudentUiData(): void {
    this.loadingUiData = true;
    this.preloadFailed = false;
    this.setMessages([]);

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
            this.setMessages([{ message: 'School options could not be loaded.', severity: 1 }]);
          }
        },
        error: () => {
          this.preloadFailed = true;
          this.setMessages([{ message: 'Failed to load onboarding UI data. Please retry.', severity: 1 }]);
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

  submit(): void {
    this.form.markAllAsTouched();
    const validationMessages = this.buildValidationMessages();
    if (validationMessages.length) {
      this.setMessages(validationMessages);
      return;
    }

    this.submitting = true;
    this.setMessages([]);
    const value = this.form.getRawValue();
    const payload: OnboardStudentPOSTData & Record<string, unknown> = {
      schoolId: value.schoolId,
      orgUserData: {
        organizationCode: value.schoolId,
        emailAddress: value.email.trim(),
        userName: value.userName.trim(),
        messageHandle: value.messageHandle.trim(),
        firstName: value.firstName.trim(),
        lastName: value.lastName.trim(),
        initialPassword: value.initialPassword,
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
            this.setMessages(responseMessages);
          }
          this.submitted = !responseMessages.some((msg) => Number(msg?.severity || 0) <= 1);
          if (!this.submitted && !(this.messagesList.messages?.length || 0)) {
            this.setMessages([{ message: 'Registration could not be completed.', severity: 1 }]);
          }
        },
        error: (err) => {
          this.submitted = false;
          const responseMessages = this.extractMessages(err?.error);
          this.setMessages(responseMessages);
          if (!responseMessages.length) {
            this.setMessages([{ message: 'Registration failed. Please try again.', severity: 1 }]);
          }
        },
      });
  }

  resendVerification(): void {
    const email = String(this.form.controls.email.value || '').trim();
    if (!email) {
      this.setMessages([{ message: 'Enter your email to resend verification.', severity: 2 }]);
      return;
    }
    this.setMessages([{ message: 'Resend verification endpoint not yet available in HcclService.', severity: 2 }]);
  }
}
