import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { ContractSectionComponent } from '@app/components/_global/contract-section/contract-section.component';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import {
  ConsentRequestPOSTData,
  HcclService,
  MultiConsentRequestGETData,
  OnboardInvitedRequest,
  OnboardInvitedResponse,
  OnboardInvitedUIData,
} from '@app/restsvc/hccl.service';
import { SimpleMessageList } from '@app/restsvc/common-request-service.model';
import { AppConstants } from '@app/shell/services/config.service';

const MESSAGE_SEVERITY_ERROR = 1;

/** Generated OnboardInvitedUIData omits consents; the Java DTO already has the field. */
type InviteSetupData = OnboardInvitedUIData & {
  consents?: MultiConsentRequestGETData;
};

@Component({
  selector: 'app-citizen-onboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContractSectionComponent,
    SimpleMessagesSectionComponent,
  ],
  templateUrl: './citizen-onboard.component.html',
  styleUrl: './citizen-onboard.component.scss',
})
export class CitizenOnboardComponent implements OnInit {
  private readonly hcclService = inject(HcclService);
  private readonly http = inject(HttpClient);
  private readonly appConstants = inject(AppConstants);
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);

  readonly form: FormGroup = this.formBuilder.group(
    {
      firstName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
      lastName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: [this.passwordsMatchValidator] },
  );

  inviteId = '';
  inviteEmail = '';
  organizationName = '';
  consents: MultiConsentRequestGETData | null = null;
  selectedConsents: ConsentRequestPOSTData[] = [];
  allConsentsAccepted = true;

  loading = false;
  submitting = false;
  setupReady = false;
  messagesList: SimpleMessageList = { messages: [] };

  showPassword = false;
  showConfirmPassword = false;

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    this.inviteId = (params.get('inviteId') || params.get('invitedId') || '').trim();
    this.loadInvite();
  }

  get passwordsMismatch(): boolean {
    const confirm = this.form.get('confirmPassword');
    return (
      this.form.hasError('passwordMismatch') &&
      !!confirm &&
      (confirm.dirty || confirm.touched)
    );
  }

  get canSubmit(): boolean {
    return this.form.valid && this.allConsentsAccepted && !this.submitting && this.setupReady;
  }

  onConsentSelectionChange(consents: ConsentRequestPOSTData[]): void {
    this.selectedConsents = consents;
  }

  onAllAcceptedChange(isAccepted: boolean): void {
    this.allConsentsAccepted = isAccepted;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  submit(): void {
    if (!this.canSubmit) {
      this.form.markAllAsTouched();
      return;
    }

    const firstName = String(this.form.value.firstName || '').trim();
    const lastName = String(this.form.value.lastName || '').trim();
    const password = String(this.form.value.password || '');
    const email = this.inviteEmail;

    const body: OnboardInvitedRequest = {
      inviteId: this.inviteId,
      firstName,
      lastName,
      password,
      userName: email,
      messageHandle: `${firstName} ${lastName}`.trim() || email,
      consents: { consents: this.selectedConsents },
    };

    this.submitting = true;
    this.messagesList = { messages: [] };

    // Call the public POST directly so we keep the real HTTP error body.
    // hccl.service wraps 403s as a generic Error and retries twice.
    this.http
      .post<OnboardInvitedResponse>(this.inviteCreateUrl(), body, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json;charset=UTF-8',
        }),
      })
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: (response) => {
          this.messagesList = response?.messages || { messages: [] };
          if (this.hasErrors(this.messagesList)) {
            return;
          }
          this.goToHomepage(response?.dashboardUrl);
        },
        error: (error) => {
          this.messagesList = this.messagesFromError(error, 'Unable to create your account. Please try again.');
        },
      });
  }

  private loadInvite(): void {
    if (!this.inviteId) {
      this.messagesList = {
        messages: [
          {
            message: 'This invitation link is missing an invite id. Please use the link from your email.',
            severity: MESSAGE_SEVERITY_ERROR,
          },
        ],
      };
      return;
    }

    this.loading = true;
    this.setupReady = false;
    this.messagesList = { messages: [] };

    this.hcclService
      .onboardInviteSetup(this.inviteId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          const data = response as InviteSetupData;
          this.messagesList = data?.messages || { messages: [] };
          if (this.hasErrors(this.messagesList)) {
            this.setupReady = false;
            return;
          }

          this.inviteEmail = (data?.invite?.emailAddress || '').trim();
          this.organizationName =
            data?.invite?.organization?.name ||
            data?.invite?.organization?.entityDisplayName ||
            '';
          this.consents = data?.consents || null;
          this.allConsentsAccepted = !(this.consents?.contracts?.length);
          this.setupReady = true;
        },
        error: (error) => {
          this.setupReady = false;
          this.messagesList = this.messagesFromError(
            error,
            'Unable to load this invitation. It may be expired or invalid.',
          );
        },
      });
  }

  private goToHomepage(dashboardUrl?: string): void {
    const fallback = '/';
    if (!dashboardUrl?.trim()) {
      window.location.assign(fallback);
      return;
    }

    try {
      const parsed = new URL(dashboardUrl, window.location.origin);
      if (parsed.origin === window.location.origin) {
        window.location.assign(`${parsed.pathname}${parsed.search}${parsed.hash}` || fallback);
        return;
      }
    } catch {
      // Fall through to relative-path / homepage handling.
    }

    if (dashboardUrl.startsWith('/')) {
      window.location.assign(dashboardUrl);
      return;
    }

    window.location.assign(fallback);
  }

  private hasErrors(messages?: SimpleMessageList): boolean {
    return messages?.messages?.some((m) => (m.severity ?? 3) === MESSAGE_SEVERITY_ERROR) ?? false;
  }

  private inviteCreateUrl(): string {
    const base = (this.appConstants.endPoints()?.hcclServicesEndPoint || '').replace(/\/$/, '');
    return `${base}/hccl/public/onboard/invite`;
  }

  private messagesFromError(error: unknown, fallback: string): SimpleMessageList {
    const httpError = error as HttpErrorResponse;
    const body = httpError?.error;
    const fromMessages = body?.messages as SimpleMessageList | undefined;
    if (fromMessages?.messages?.length) {
      return fromMessages;
    }

    const serverMessage =
      (typeof body === 'string' ? body : null) ||
      body?.errorMessage ||
      body?.developerMessage ||
      body?.message;
    const status = httpError?.status;
    if (status === 403) {
      return {
        messages: [
          {
            message:
              serverMessage ||
              'The server refused to create this account (HTTP 403). The invitation loaded, but POST /hccl/public/onboard/invite is blocked on the backend.',
            severity: MESSAGE_SEVERITY_ERROR,
          },
        ],
      };
    }
    if (serverMessage) {
      return { messages: [{ message: serverMessage, severity: MESSAGE_SEVERITY_ERROR }] };
    }
    return { messages: [{ message: fallback, severity: MESSAGE_SEVERITY_ERROR }] };
  }

  private passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (!password || !confirmPassword) {
      return null;
    }
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}
