import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HcclService, HcclUserProfileGETData, HcclUserInvitePOSTData } from '@app/restsvc/hccl.service';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-invite-colleague-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, StdMdbFormTextComponent, TranslateModule],
  templateUrl: './invite-colleague-modal.component.html',
  styleUrls: ['./invite-colleague-modal.component.scss']
})
export class InviteColleagueModalComponent implements OnInit {
  inviteForm: FormGroup;
  isLoading = false;
  error: any = {};
  organizationId?: string;
  teamId?: string;
  inviteCode?: string;
  checkingEmail = false;
  emailExists: HcclUserProfileGETData | null = null;
  validationErrors: { email?: string } = {};

  private emailCheckSubject = new Subject<string>();

  constructor(
    public modalRef: MdbModalRef<InviteColleagueModalComponent>,
    private formBuilder: FormBuilder,
    private hcclService: HcclService
  ) {
    this.inviteForm = this.formBuilder.group({
      emailAddress: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      notes: ['', [Validators.maxLength(2000)]] 
    });

    this.setupEmailValidation();
  }

  ngOnInit(): void {
    this.inviteForm.reset();

    if (this.modalRef && (this.modalRef as any).data) {
      this.organizationId = (this.modalRef as any).data.organizationId || this.organizationId;
      this.teamId = (this.modalRef as any).data.teamId || this.teamId;
    }
  }

  get formControls() {
    return this.inviteForm.controls;
  }

  onSubmit(): void {
    if (this.hasValidationErrors()) {
      return;
    }

    if (this.inviteForm.valid) {
      this.isLoading = true;
      this.error = {};

      const formData = this.inviteForm.value;
      const inviteData: HcclUserInvitePOSTData = {
        emailAddress: formData.emailAddress,
        organizationId: this.organizationId,
        teamId: this.teamId,
        inviteCode: this.inviteCode || '',
        notes: formData.notes || '--- no notes ---',
        dateExpires: '2026-03-01' ,
        available: 1,
        currentStateCode: 'NEW'
      };

      this.hcclService.createHcclUserInvite(inviteData).subscribe({
        next: () => {
          this.isLoading = false;
          this.modalRef.close(true);
        },
        error: (error) => {
          this.isLoading = false;
          this.error = error;
          console.error('Invite colleague error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.modalRef.close(false);
  }

  checkEmailAddress(): void {
    const email = this.inviteForm.get('emailAddress')?.value;
    const emailControl = this.inviteForm.get('emailAddress');

    if (!email) {
      this.checkingEmail = false;
      this.emailExists = null;
      this.validationErrors.email = undefined;
      return;
    }

    if (emailControl?.valid) {
      this.emailCheckSubject.next(email);
    } else {
      this.checkingEmail = false;
      this.emailExists = null;
      this.validationErrors.email = undefined;
    }
  }

  navigateToUser(userProfileId: string): void {
    console.log('Navigate to user profile:', userProfileId);
  }

  hasValidationErrors(): boolean {
    return !!this.validationErrors.email;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.inviteForm.controls).forEach(key => {
      const control = this.inviteForm.get(key);
      control?.markAsTouched();
    });
  }

  private setupEmailValidation(): void {
    this.emailCheckSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((email: string) => {
        this.checkingEmail = true;
        this.emailExists = null;
        this.validationErrors.email = undefined;
        return this.hcclService.findHcclUserProfiles({
          userEmail: email,
          pageSize: 1,
          isPaging: true
        });
      })
    ).subscribe({
      next: (response) => {
        this.checkingEmail = false;
        if (response.searchResults && response.searchResults.length > 0) {
          this.emailExists = response.searchResults[0];
          this.validationErrors.email = 'A user with this email already exists.';
        } else {
          this.emailExists = null;
          this.validationErrors.email = undefined;
        }
      },
      error: (error) => {
        this.checkingEmail = false;
        console.error('Error checking email:', error);
      }
    });
  }

  private generateInviteCode(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`.toUpperCase();
  }
}
