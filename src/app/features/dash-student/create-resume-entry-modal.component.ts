import { Component, OnInit, AfterViewInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HcclService, ResumeEntryPOSTData } from '@app/restsvc/hccl.service';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';
import { HcclContextService } from '@app/shell/services/hccl-context.service';

@Component({
  selector: 'app-create-resume-entry-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, StdMdbFormTextComponent, StdMdbFormTextareaComponent],
  template: `
    <div class="modal-header text-white">
      <h5 class="modal-title">Create New Resume Entry</h5>
      <span class="fa fa-times cursorPointer" (click)="onCancel()"></span>
    </div>

    <div class="modal-body">
      <form [formGroup]="resumeEntryForm">
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
          <p class="mt-2 text-muted">Creating resume entry...</p>
        </div>
        
        <div class="row" *ngIf="!isLoading">
          <div class="col-md-12">
            <div class="col-md-10 offset-md-1">
              
              <!-- Title -->
              <app-std-mdb-form-text 
                prefix="resumeEntry" 
                name="title"
                label="Title"
                [required]="true"
                [error]="error"
                formControlName="title">
              </app-std-mdb-form-text>

              <!-- Organization Name -->
              <app-std-mdb-form-text 
                prefix="resumeEntry" 
                name="organizationName"
                label="Organization"
                [error]="error"
                formControlName="organizationName">
              </app-std-mdb-form-text>

              <!-- Position -->
              <app-std-mdb-form-text 
                prefix="resumeEntry" 
                name="position"
                label="Position"
                [error]="error"
                formControlName="position">
              </app-std-mdb-form-text>

              <!-- Date Start -->
              <app-std-mdb-form-text 
                prefix="resumeEntry" 
                name="dateStart"
                label="Start Date"
                [error]="error"
                placeholder="YYYY-MM-DD"
                formControlName="dateStart">
              </app-std-mdb-form-text>

              <!-- Date End -->
              <app-std-mdb-form-text 
                prefix="resumeEntry" 
                name="dateEnd"
                label="End Date"
                [error]="error"
                placeholder="YYYY-MM-DD"
                formControlName="dateEnd">
              </app-std-mdb-form-text>

              <!-- Description -->
              <app-std-mdb-form-textarea 
                prefix="resumeEntry" 
                name="description"
                label="Description"
                [rows]="4"
                [error]="error"
                formControlName="description">
              </app-std-mdb-form-textarea>

              <!-- Resume Text -->
              <app-std-mdb-form-textarea 
                prefix="resumeEntry" 
                name="resumeText"
                label="Resume Text"
                [rows]="6"
                [error]="error"
                formControlName="resumeText">
              </app-std-mdb-form-textarea>

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
        [disabled]="!resumeEntryForm.valid || isLoading"
      >
        <span
          [ngClass]="{ 'spinner-border spinner-border-sm': isLoading }"
        >
          {{ isLoading ? 'Creating...' : 'Create Resume Entry' }}
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
export class CreateResumeEntryModalComponent implements OnInit, AfterViewInit {
  
  resumeEntryForm: FormGroup;
  isLoading = false;
  error: any = {};

  private hcclService = inject(HcclService);
  private hcclContextService = inject(HcclContextService);
  private cdr = inject(ChangeDetectorRef);

  constructor(
    public modalRef: MdbModalRef<CreateResumeEntryModalComponent>,
    private formBuilder: FormBuilder
  ) {
    this.resumeEntryForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      organizationName: ['', [Validators.maxLength(255)]],
      position: ['', [Validators.maxLength(255)]],
      dateStart: ['', [Validators.maxLength(50)]],
      dateEnd: ['', [Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(2000)]],
      resumeText: ['', [Validators.maxLength(2000)]]
    });
  }

  ngOnInit(): void {
    // Initialize form with empty values
    this.resumeEntryForm.reset({
      title: '',
      organizationName: '',
      position: '',
      dateStart: '',
      dateEnd: '',
      description: '',
      resumeText: ''
    });
  }

  ngAfterViewInit(): void {
    // Force change detection to ensure MDBootstrap form controls are initialized
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);
  }

  get formControls() {
    return this.resumeEntryForm.controls;
  }

  onSubmit(): void {
    if (this.resumeEntryForm.valid) {
      this.isLoading = true;
      this.error = {};

      const userProfile = this.hcclContextService.getCurrentUserProfile();
      if (!userProfile || !userProfile.id) {
        this.error = { message: 'User profile not found' };
        this.isLoading = false;
        return;
      }

      const formData = this.resumeEntryForm.value;
      
      // Create ResumeEntryPOJO structure
      const resumeEntryPojo = {
        title: formData.title || '',
        organizationName: formData.organizationName || '',
        position: formData.position || '',
        dateStart: formData.dateStart || undefined,
        dateEnd: formData.dateEnd || undefined,
        description: formData.description || '',
        resumeText: formData.resumeText || ''
      };

      // Build markdown content from the entry data
      // Combine title, organization, position, dates, description, and resumeText into markdown
      let entryMdContent = '';
      if (formData.title) {
        entryMdContent += `# ${formData.title}\n\n`;
      }
      if (formData.organizationName || formData.position) {
        entryMdContent += `**${formData.organizationName || ''}${formData.organizationName && formData.position ? ' - ' : ''}${formData.position || ''}**\n\n`;
      }
      if (formData.dateStart || formData.dateEnd) {
        const dateRange = `${formData.dateStart || 'Start'} - ${formData.dateEnd || 'Present'}`;
        entryMdContent += `*${dateRange}*\n\n`;
      }
      if (formData.description) {
        entryMdContent += `${formData.description}\n\n`;
      }
      if (formData.resumeText) {
        entryMdContent += `${formData.resumeText}\n\n`;
      }
      
      // Ensure entryMd and entryMdEdited are not empty (required fields)
      const entryMd = entryMdContent.trim() || formData.title || 'Resume Entry';
      const entryMdEdited = entryMd;

      const resumeEntryData: ResumeEntryPOSTData = {
        userProfileId: userProfile.id,
        title: formData.title,
        entryMd: entryMd,
        entryMdEdited: '*none*',
        entryJson: '{}',
        available: 1,
        dateStart: formData.dateStart || undefined,
        dateEnd: formData.dateEnd || undefined,
        theResumeEntryPojo: resumeEntryPojo
      };

      this.hcclService.createResumeEntry(resumeEntryData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.modalRef.close({ success: true, resumeEntryId: response.id || response });
        },
        error: (error) => {
          this.isLoading = false;
          this.error = error;
          console.error('Create resume entry error:', error);
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
    Object.keys(this.resumeEntryForm.controls).forEach(key => {
      const control = this.resumeEntryForm.get(key);
      control?.markAsTouched();
    });
  }
}

