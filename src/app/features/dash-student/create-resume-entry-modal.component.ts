import { Component, OnInit, AfterViewInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HcclService, ResumeEntryPOSTData } from '@app/restsvc/hccl.service';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';
import { StdMdbDatepickerComponent } from '@app/components/_global/std-mdb-datepicker/std-mdb-datepicker.component';
import { HcclContextService } from '@app/shell/services/hccl-context.service';

@Component({
  selector: 'app-create-resume-entry-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, StdMdbFormTextComponent, StdMdbFormTextareaComponent, StdMdbDatepickerComponent],
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
              
              <!-- Title (readonly, computed from organizationName and position) -->
              <app-std-mdb-form-text 
                prefix="resumeEntry" 
                name="title"
                label="Title"
                [required]="true"
                [disabled]="true"
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

              <!-- Date Range -->
              <div class="row">
                <div class="col-md-6">
                  <app-std-mdb-datepicker 
                    prefix="resumeEntry" 
                    name="dateStart"
                    label="Start Date"
                    [error]="error"
                    placeholder="MM/DD/YYYY"
                    formControlName="dateStart">
                  </app-std-mdb-datepicker>
                </div>
                <div class="col-md-6">
                  <app-std-mdb-datepicker 
                    prefix="resumeEntry" 
                    name="dateEnd"
                    label="End Date"
                    [error]="error"
                    placeholder="MM/DD/YYYY"
                    formControlName="dateEnd">
                  </app-std-mdb-datepicker>
                </div>
              </div>

              <!-- Resume Text -->
              <app-std-mdb-form-textarea 
                prefix="resumeEntry" 
                name="resumeText"
                label="Resume Text"
                [rows]="6"
                [error]="error"
                [placeholder]="'Enter what you did at this job/event here for the resume...'"
                formControlName="resumeText">
              </app-std-mdb-form-textarea>


              <!-- Description -->
              <app-std-mdb-form-textarea 
                prefix="resumeEntry" 
                name="description"
                label="Description"
                [rows]="4"
                [error]="error"
                [placeholder]="'Enter a longer form description of your role and responsibilities here...'"
                formControlName="description">
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
      title: [{value: '', disabled: true}, [Validators.required, Validators.maxLength(255)]],
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

    // Subscribe to organizationName and position changes to update title
    this.resumeEntryForm.get('organizationName')?.valueChanges.subscribe(() => {
      this.updateTitle();
    });
    this.resumeEntryForm.get('position')?.valueChanges.subscribe(() => {
      this.updateTitle();
    });
    
    // Update title initially
    this.updateTitle();
  }

  private updateTitle(): void {
    const organizationName = this.resumeEntryForm.get('organizationName')?.value || '';
    const position = this.resumeEntryForm.get('position')?.value || '';
    
    let titleValue = '';
    if (organizationName && position) {
      titleValue = `${organizationName}, ${position}`;
    } else if (organizationName) {
      titleValue = organizationName;
    } else if (position) {
      titleValue = position;
    }
    
    // Temporarily enable the control to set the value, then disable it again
    const titleControl = this.resumeEntryForm.get('title');
    if (titleControl) {
      titleControl.enable({ emitEvent: false });
      titleControl.setValue(titleValue, { emitEvent: false });
      titleControl.disable({ emitEvent: false });
    }
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
    // Ensure title is updated before submission
    this.updateTitle();
    
    if (this.resumeEntryForm.valid) {
      this.isLoading = true;
      this.error = {};

      const userProfile = this.hcclContextService.getCurrentUserProfile();
      if (!userProfile || !userProfile.id) {
        this.error = { message: 'User profile not found' };
        this.isLoading = false;
        return;
      }

      // Use getRawValue() to include disabled form controls (like title)
      const formData = this.resumeEntryForm.getRawValue();
      
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

