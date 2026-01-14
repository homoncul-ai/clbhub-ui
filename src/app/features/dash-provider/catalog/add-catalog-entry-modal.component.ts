import { Component, OnInit, AfterViewInit, inject, ChangeDetectorRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { HcclService, CatalogEntryPOSTData } from '@app/restsvc/hccl.service';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';

@Component({
  selector: 'app-add-catalog-entry-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, 
    StdMdbFormTextComponent, StdMdbFormTextareaComponent, AvailableSelectorComponent],
  template: `
  <pre>
  <!-- catalogId:{{ catalogId }}
  catalogTypeId:{{ catalogTypeId }} -->
</pre>

    <div class="modal-header bg-primary text-white">
      <h5 class="modal-title"><i class="fas fa-plus-circle me-2"></i>Create New Catalog Entry</h5>
      <span class="fa fa-times cursorPointer" (click)="onCancel()"></span>
    </div>

    <div class="modal-body">
      <!-- Display general/API errors -->
      <div *ngIf="error?.general" class="alert alert-danger mb-3">
        <i class="fas fa-exclamation-triangle me-2"></i>
        {{ error.general.errorMessage }}
      </div>
      
      <!-- Display validation error summary -->
      <div *ngIf="error && !error.general && hasValidationErrors()" class="alert alert-warning mb-3">
        <i class="fas fa-exclamation-circle me-2"></i>
        <strong>Please fix the following errors:</strong>
        <ul class="mb-0 mt-2">
          <li *ngIf="error.entryCode">{{ error.entryCode.errorMessage }}</li>
          <li *ngIf="error.title">{{ error.title.errorMessage }}</li>
          <li *ngIf="error.shortDescription">{{ error.shortDescription.errorMessage }}</li>
          <li *ngIf="error.description">{{ error.description.errorMessage }}</li>
        </ul>
      </div>

      <div class="form-container" style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
        <form (ngSubmit)="onSubmit()">
          <app-std-mdb-form-text 
            prefix="catalogEntry" 
            name="entryCode"
            label="Entry Code"
            [required]="true"
            [maxLength]="50"
            [error]="error"
            [(ngModel)]="entryCode">
          </app-std-mdb-form-text>
          <app-std-mdb-form-text 
            prefix="catalogEntry" 
            name="title"
            label="Title"
            [required]="true"
            [maxLength]="255"
            [error]="error"
            [(ngModel)]="title">
          </app-std-mdb-form-text>
          <app-std-mdb-form-textarea 
            prefix="catalogEntry" 
            name="shortDescription"
            label="Short Description"
            [required]="true"
            [maxLength]="1024"
            [error]="error"
            [(ngModel)]="shortDescription">
          </app-std-mdb-form-textarea>
          <app-std-mdb-form-textarea 
            prefix="catalogEntry" 
            name="description"
            label="Description"
            [required]="true"
            [error]="error"
            [(ngModel)]="description">
          </app-std-mdb-form-textarea>
          <div class="form-group mb-3">
            <label>Available:</label>
            <app-available-selector [(ngModel)]="available" name="available"></app-available-selector>
          </div>
          
          <div class="form-actions" style="display: flex; gap: 10px; margin-top: 20px; padding-top: 15px; border-top: 1px solid #dee2e6;">
            <button type="submit" class="btn btn-success" [disabled]="isLoading">
              <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
              {{ isLoading ? 'Saving...' : 'Save' }}
            </button>
            <button type="button" (click)="onCancel()" class="btn btn-secondary" [disabled]="isLoading">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .cursorPointer {
      cursor: pointer;
    }
  `]
})
export class AddCatalogEntryModalComponent implements OnInit, AfterViewInit {
  
    // Input data passed from the parent component
    @Input() catalogId: string = '';
    @Input() catalogTypeId: string = '';
  // Form fields
  entryCode: string = '';
  title: string = '';
  shortDescription: string = '';
  description: string = '';
  available: number = 1;
   
  isLoading = false;
  error: any = null;

  private hcclService = inject(HcclService);
  private cdr = inject(ChangeDetectorRef);

  constructor(
    public modalRef: MdbModalRef<AddCatalogEntryModalComponent>
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);
  }

  // Validation methods
  private validateEntryCode(entryCode: string): string | null {
    if (!entryCode || entryCode.trim() === '') {
      return 'Entry Code is required';
    }
    if (entryCode.length > 50) {
      return 'Entry Code must be less than 50 characters';
    }
    return null;
  }

  private validateTitle(title: string): string | null {
    if (!title || title.trim() === '') {
      return 'Title is required';
    }
    if (title.length > 255) {
      return 'Title must be less than 255 characters';
    }
    return null;
  }

  private validateShortDescription(shortDescription: string): string | null {
    if (!shortDescription || shortDescription.trim() === '') {
      return 'Short Description is required';
    }
    if (shortDescription.length > 1024) {
      return 'Short Description must be less than 1024 characters';
    }
    return null;
  }

  private validateDescription(description: string): string | null {
    if (!description || description.trim() === '') {
      return 'Description is required';
    }
    return null;
  }

  private validateForm(): any {
    const errors: any = {};
    
    const entryCodeError = this.validateEntryCode(this.entryCode);
    if (entryCodeError) {
      errors.entryCode = { errorMessage: entryCodeError };
    }
    
    const titleError = this.validateTitle(this.title);
    if (titleError) {
      errors.title = { errorMessage: titleError };
    }
    
    const shortDescriptionError = this.validateShortDescription(this.shortDescription);
    if (shortDescriptionError) {
      errors.shortDescription = { errorMessage: shortDescriptionError };
    }
    
    const descriptionError = this.validateDescription(this.description);
    if (descriptionError) {
      errors.description = { errorMessage: descriptionError };
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  }

  hasValidationErrors(): boolean {
    return this.error && (this.error.entryCode || this.error.title || this.error.shortDescription || this.error.description);
  }

  async onSubmit(): Promise<void> {
    // Validate form
    this.error = this.validateForm();
    if (this.error) {
      return;
    }

    this.isLoading = true;

    const postData: CatalogEntryPOSTData = {
      catalogId: this.catalogId,
      catalogTypeId: this.catalogTypeId,
      entryCode: this.entryCode,
      title: this.title,
      shortDescription: this.shortDescription,
      description: this.description,
      available: this.available,
      catalogTypeCode: 'course'
    };

    try {
      const response = await this.hcclService.createCatalogEntry(postData).toPromise();
      console.log('Create response:', response);
      alert('Catalog entry created successfully ' + response?.id);
      this.error = null;
      // Close modal with success result
      this.modalRef.close({ success: true, catalogEntryId: response?.id || response });
    } catch (error) {
      console.error('Create error:', error);
      alert('Failed to create catalog entry ' + (error as Error).message);
      this.error = { general: { errorMessage: (error as Error).message || 'Failed to create catalog entry' } };
      this.isLoading = false;
    }
  }

  onCancel(): void {
    this.modalRef.close(false);
  }
}
