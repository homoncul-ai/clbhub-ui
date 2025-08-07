import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HcclService, OnboardOrgUserPOSTData } from '../../../restsvc/hccl.service';
import { StdMdbFormTextComponent } from '../../../components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbPhoneComponent } from '../../../components/_global/std-mdb-phone/std-mdb-phone.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-onboard-org-user-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, StdMdbFormTextComponent, StdMdbPhoneComponent, TranslateModule],
  templateUrl: './onboard-org-user-modal.component.html',
  styleUrls: ['./onboard-org-user-modal.component.scss']
})
export class OnboardOrgUserModalComponent implements OnInit {
  
  onboardForm: FormGroup;
  isLoading = false;
  error: any = {};
  organizationId?: string;

  constructor(
    public modalRef: MdbModalRef<OnboardOrgUserModalComponent>,
    private formBuilder: FormBuilder,
    private hcclService: HcclService
  ) {
    this.onboardForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      userName: ['', [Validators.required, Validators.maxLength(255)]],
      emailAddress: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      workPhone: ['', [Validators.maxLength(255)]],
      cellPhone: ['', [Validators.maxLength(255)]],
      profileTypeCode: ['', [Validators.required, Validators.maxLength(50)]],
      roles: [[]]
    });
  }

  ngOnInit(): void {
    this.onboardForm.reset();
    
    // Get organization ID from modal data
    if (this.modalRef && (this.modalRef as any).data) {
      this.organizationId = (this.modalRef as any).data.organizationId;
    }
  }

  get formControls() {
    return this.onboardForm.controls;
  }

  onSubmit(): void {
    if (this.onboardForm.valid) {
      this.isLoading = true;
      this.error = {};

      const formData = this.onboardForm.value;
      const onboardData: OnboardOrgUserPOSTData = {
        organizationId: this.organizationId,
        name: formData.name,
        userName: formData.userName,
        emailAddress: formData.emailAddress,
        workPhone: formData.workPhone || undefined,
        cellPhone: formData.cellPhone || undefined,
        profileTypeCode: formData.profileTypeCode,
        roles: formData.roles || []
      };
      debugger
      this.hcclService.onboardOrgUser(onboardData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.modalRef.close(true); // Close with success
        },
        error: (error) => {
          this.isLoading = false;
          this.error = error;
          console.error('Onboarding error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.modalRef.close(false);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.onboardForm.controls).forEach(key => {
      const control = this.onboardForm.get(key);
      control?.markAsTouched();
    });
  }
}
