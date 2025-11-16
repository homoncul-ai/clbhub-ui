import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HcclService, PersonalStatementResumePOSTData } from '@app/restsvc/hccl.service';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { HcclContextService } from '@app/shell/services/hccl-context.service';

@Component({
  selector: 'app-create-resume-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, StdMdbFormTextComponent],
  template: `
    <div class="modal-header text-white">
      <h5 class="modal-title">Create New Resume</h5>
      <span class="fa fa-times cursorPointer" (click)="onCancel()"></span>
    </div>

    <div class="modal-body">
      <form [formGroup]="resumeForm">
        <div class="form-symbols-text text-end" *ngIf="!isLoading">
          <small class="text-muted">
            <span class="requiredField">* </span>Required fields
          </small>
        </div>
        
        <!-- Loading indicator -->
        <div *ngIf="isLoading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2 text-muted">Creating resume...</p>
        </div>
        
        <div class="row" *ngIf="!isLoading">
          <div class="col-md-12">
            <div class="col-md-10 offset-md-1">
              
              <!-- Title -->
              <app-std-mdb-form-text 
                prefix="resume" 
                name="title"
                label="Title"
                [required]="true"
                [error]="error"
                formControlName="title">
              </app-std-mdb-form-text>

            </div>
          </div>
        </div>
      </form>
    </div>

    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-sm btn-primary"
        (click)="onSubmit()"
        [disabled]="!resumeForm.valid || isLoading"
      >
        <span
          [ngClass]="{ 'spinner-border spinner-border-sm': isLoading }"
        >
          {{ isLoading ? 'Creating...' : 'Create Resume' }}
        </span>
      </button>
      <button type="button" class="btn btn-sm btn-dark" (click)="onCancel()">
        Cancel
      </button>
    </div>
  `,
  styles: [`
    .cursorPointer {
      cursor: pointer;
    }
    .requiredField {
      color: red;
    }
  `]
})
export class CreateResumeModalComponent implements OnInit {
  
  resumeForm: FormGroup;
  isLoading = false;
  error: any = {};
  personalStatementId?: string;

  private hcclService = inject(HcclService);
  private hcclContextService = inject(HcclContextService);

  constructor(
    public modalRef: MdbModalRef<CreateResumeModalComponent>,
    private formBuilder: FormBuilder
  ) {
    this.resumeForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(255)]]
    });
  }

  ngOnInit(): void {
    this.resumeForm.reset();
  }

  get formControls() {
    return this.resumeForm.controls;
  }

  onSubmit(): void {
    if (this.resumeForm.valid) {
      this.isLoading = true;
      this.error = {};

      const userProfile = this.hcclContextService.getCurrentUserProfile();
      if (!userProfile || !userProfile.id) {
        this.error = { message: 'User profile not found' };
        this.isLoading = false;
        return;
      }

      const formData = this.resumeForm.value;
      const resumeData: PersonalStatementResumePOSTData = {
        userProfileId: userProfile.id,
        personalStatmentId: this.personalStatementId || '',
        title: formData.title,
        resumeMd: '',
        resumeJson: '{}',
        available: 1
      };

      this.hcclService.createPersonalStatementResume(resumeData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.modalRef.close({ success: true, resumeId: response.id || response });
        },
        error: (error) => {
          this.isLoading = false;
          this.error = error;
          console.error('Create resume error:', error);
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
    Object.keys(this.resumeForm.controls).forEach(key => {
      const control = this.resumeForm.get(key);
      control?.markAsTouched();
    });
  }
}

