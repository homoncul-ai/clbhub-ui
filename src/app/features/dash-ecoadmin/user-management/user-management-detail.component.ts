import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';

import { SimpleMessageList } from '../../../restsvc/common-request-service.model';
import {
  HcclPersonPOSTData,
  HcclService,
  HcclUserGETData,
  HcclUserProfileGETData,
  ManageUserRequest,
  ManageUserResponse,
  UtilmonLoginYearmoGETData,
  UtilmonReportingEventGETData,
} from '../../../restsvc/hccl.service';
import { StdMdbFormTextComponent } from '../../../components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbPhoneComponent } from '../../../components/_global/std-mdb-phone/std-mdb-phone.component';

import {
  ManageUserActionCodes,
  firstMessageText,
  hasErrors,
  hasWarnings,
} from './user-management-action-codes';
import {
  SetPasswordModalComponent,
  SetPasswordModalResult,
} from './set-password-modal.component';
import {
  ChangeEmailModalComponent,
  ChangeEmailModalResult,
} from './change-email-modal.component';
import { DeleteUserModalComponent } from './delete-user-modal.component';

/**
 * Page 2 - EcoAdmin User Management detail page.
 *
 * Loads a single user via `loadManageUserUIData`, shows an action bar mapped to
 * `ManageUserActionCodes`, and renders three accordion sections (Details,
 * Login & Events, Organizations & Profiles). All mutations go through
 * `manageUserAction`.
 */
@Component({
  selector: 'app-user-management-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MdbAccordionModule,
    StdMdbFormTextComponent,
    StdMdbPhoneComponent,
  ],
  templateUrl: './user-management-detail.component.html',
  styleUrls: ['./user-management-detail.component.scss'],
})
export class UserManagementDetailComponent implements OnInit {
  private hcclService = inject(HcclService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private modalService = inject(MdbModalService);
  private formBuilder = inject(FormBuilder);

  // Expose action codes to the template.
  readonly ACTION_CODES = ManageUserActionCodes;

  userId = '';
  user: HcclUserGETData | null = null;
  profiles: HcclUserProfileGETData[] = [];
  loginYearmos: UtilmonLoginYearmoGETData[] = [];
  reportingEvents: UtilmonReportingEventGETData[] = [];

  loading = false;
  actionInProgress = false;
  loadError = '';

  errorMessages: SimpleMessageList | null = null;
  warningMessages: SimpleMessageList | null = null;
  successMessage: SimpleMessageList | null = null;

  detailsForm: FormGroup;
  error: any = {};

  // Single-open accordion state.
  accordionId = 'details';

  constructor() {
    this.detailsForm = this.formBuilder.group({
      name: [''],
      firstName: [''],
      lastName: [''],
      messageHandle: [''],
      cellPhoneNumber: [''],
      workPhoneNumber: [''],
      languageCode: [''],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const userId = params['userId'];
      if (userId) {
        this.userId = userId;
        this.loadUser(userId);
      }
    });
  }

  // ---- Accordion helpers ----------------------------------------------------

  openAccordion(id: string): void {
    this.accordionId = id;
  }

  isAccordionCollapsed(id: string): boolean {
    return this.accordionId !== id;
  }

  // ---- Data loading ---------------------------------------------------------

  loadUser(userId: string): void {
    this.loading = true;
    this.loadError = '';
    this.hcclService.loadManageUserUIData(userId).subscribe({
      next: (ui) => {
        this.loading = false;
        this.user = ui.user ?? null;
        if (hasErrors(ui.messages)) {
          this.errorMessages = ui.messages ?? null;
        }
        this.populateForm();
        this.loadProfiles();
        this.loadEvents();
      },
      error: (err) => {
        this.loading = false;
        this.loadError = 'Failed to load user.';
        console.error('Error loading manage-user UI data:', err);
      },
    });
  }

  private populateForm(): void {
    const p = this.user?.person;
    this.detailsForm.patchValue({
      name: this.user?.name || p?.name || '',
      firstName: p?.firstName || '',
      lastName: p?.lastName || '',
      messageHandle: p?.messageHandle || '',
      cellPhoneNumber: p?.cellPhoneNumber || '',
      workPhoneNumber: p?.workPhoneNumber || '',
      languageCode: p?.languageCode || '',
    });
  }

  private loadProfiles(): void {
    if (!this.userId) {
      return;
    }
    this.hcclService
      .findHcclUserProfiles({ userId: this.userId, isPaging: false })
      .subscribe({
        next: (rsp) => {
          this.profiles = rsp.searchResults ?? [];
        },
        error: (err) => console.error('Error loading profiles:', err),
      });
  }

  private loadEvents(): void {
    const email = this.primaryEmail;
    if (!email) {
      this.loginYearmos = [];
      this.reportingEvents = [];
      return;
    }
    this.hcclService
      .findUtilmonLoginYearmos({ userEmail: email, isPaging: false })
      .subscribe({
        next: (rsp) => {
          this.loginYearmos = rsp.searchResults ?? [];
        },
        error: (err) => console.error('Error loading login counts:', err),
      });
    this.hcclService
      .findUtilmonReportingEvents({ subject: email, isPaging: false })
      .subscribe({
        next: (rsp) => {
          this.reportingEvents = rsp.searchResults ?? [];
        },
        error: (err) => console.error('Error loading events:', err),
      });
  }

  // ---- Derived display ------------------------------------------------------

  get isActive(): boolean {
    return this.user?.available === 1;
  }

  get statusLabel(): string {
    return this.isActive ? 'Active' : 'Inactive';
  }

  get statusBadgeClass(): string {
    return this.isActive ? 'badge bg-success' : 'badge bg-secondary';
  }

  get primaryEmail(): string {
    return (
      this.profiles.find((p) => p.userEmail)?.userEmail ||
      this.user?.person?.userEmail ||
      ''
    );
  }

  get successText(): string {
    return firstMessageText(this.successMessage ?? undefined);
  }

  get warningText(): string {
    return firstMessageText(this.warningMessages ?? undefined);
  }

  get errorText(): string {
    return firstMessageText(this.errorMessages ?? undefined);
  }

  // ---- Actions --------------------------------------------------------------

  /**
   * Central dispatcher: builds a ManageUserRequest and calls manageUserAction.
   */
  invokeAction(actionCode: string, extras?: Partial<ManageUserRequest>): void {
    if (!this.userId || this.actionInProgress) {
      return;
    }
    const req: ManageUserRequest = {
      actionCode,
      hcclUserId: this.userId,
      ...extras,
    };
    this.actionInProgress = true;
    this.errorMessages = null;
    this.warningMessages = null;
    this.successMessage = null;
    this.hcclService.manageUserAction(req).subscribe({
      next: (rsp) => this.handleActionResponse(rsp, actionCode),
      error: (err) => {
        this.actionInProgress = false;
        this.loadError = 'The action failed. Please try again.';
        console.error('manageUserAction error:', err);
      },
    });
  }

  private handleActionResponse(
    rsp: ManageUserResponse,
    actionCode: string,
  ): void {
    this.actionInProgress = false;
    if (hasErrors(rsp.messages)) {
      this.errorMessages = rsp.messages ?? null;
      this.warningMessages = null;
      this.successMessage = null;
      return;
    }
    this.errorMessages = null;
    if (hasWarnings(rsp.messages)) {
      this.warningMessages = rsp.messages ?? null;
      this.successMessage = null;
    } else {
      this.warningMessages = null;
      this.successMessage = rsp.messages ?? null;
    }

    if (actionCode === ManageUserActionCodes.DELETE_USER_COMPLETELY) {
      this.router.navigate(['/ecoadmin-dashboard/user-management']);
      return;
    }

    if (rsp.user) {
      this.user = rsp.user;
      this.populateForm();
      this.loadProfiles();
      this.loadEvents();
    }
  }

  activateUser(): void {
    if (confirm('Activate this user account?')) {
      this.invokeAction(ManageUserActionCodes.ENABLE_USER);
    }
  }

  deactivateUser(): void {
    if (confirm('Deactivate? User will not be able to log in.')) {
      this.invokeAction(ManageUserActionCodes.DISABLE_USER);
    }
  }

  saveDetails(): void {
    if (!this.user) {
      return;
    }
    const form = this.detailsForm.value;
    const p = this.user.person;
    const person: HcclPersonPOSTData = {
      organizationId: p?.organizationId,
      name: form.name || p?.name || this.user.name || '',
      businessCode: p?.businessCode || this.user.businessCode || '',
      available: p?.available ?? this.user.available ?? 1,
      dataOriginCode: p?.dataOriginCode,
      userId: this.user.id,
      userEmail: p?.userEmail,
      cellPhoneNumber: form.cellPhoneNumber || undefined,
      workPhoneNumber: form.workPhoneNumber || undefined,
      firstName: form.firstName || '',
      lastName: form.lastName || '',
      messageHandle: form.messageHandle || '',
      languageCode: form.languageCode || 'en-US',
    };
    this.invokeAction(ManageUserActionCodes.UPDATE_PERSONAL_INFO, { person });
  }

  openSetPasswordModal(): void {
    const ref = this.modalService.open(SetPasswordModalComponent, {
      modalClass: 'modal-md',
      keyboard: false,
      ignoreBackdropClick: true,
    });
    ref.onClose.subscribe((result: SetPasswordModalResult | null) => {
      if (result?.newPassword) {
        this.invokeAction(ManageUserActionCodes.TRIGGER_UPDATE_PASSWORD, {
          newPassword: result.newPassword,
        });
      }
    });
  }

  sendResetLink(): void {
    const email = this.primaryEmail || 'this user';
    if (confirm(`Send password-reset email to ${email}?`)) {
      this.invokeAction(ManageUserActionCodes.TRIGGER_UPDATE_PASSWORD);
    }
  }

  openChangeEmailModal(): void {
    const ref = this.modalService.open(ChangeEmailModalComponent, {
      modalClass: 'modal-md',
      keyboard: false,
      ignoreBackdropClick: true,
      data: { currentEmail: this.primaryEmail },
    });
    ref.onClose.subscribe((result: ChangeEmailModalResult | null) => {
      if (result?.updatedEmailAddress) {
        this.invokeAction(ManageUserActionCodes.CHANGE_EMAIL, {
          updatedEmailAddress: result.updatedEmailAddress,
        });
      }
    });
  }

  openDeleteUserModal(): void {
    const ref = this.modalService.open(DeleteUserModalComponent, {
      modalClass: 'modal-md',
      keyboard: false,
      ignoreBackdropClick: true,
      data: {
        username: this.user?.businessCode || '',
        displayName: this.user?.name || this.user?.businessCode || '',
      },
    });
    ref.onClose.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.invokeAction(ManageUserActionCodes.DELETE_USER_COMPLETELY);
      }
    });
  }

  backToList(): void {
    this.router.navigate(['/ecoadmin-dashboard/user-management']);
  }

  profileDetailRoute(profileId: string | undefined): any[] {
    return ['/ecoadmin-dashboard/hccluserprofiles', profileId, 'details'];
  }
}
