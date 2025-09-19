import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Router } from '@angular/router';
import { HcclService, HcclUserContextGETData, WorkItemFormContext, WorkItemFormRequest, WorkItemFormResponse } from '@app/restsvc/hccl.service';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';
import { StdBooleanComponent } from '@app/components/_global/std-boolean/std-boolean.component';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { WorkRequestItemCrudWrapper } from '../workrequestitem/workrequestitem-crud.component';

@Component({
  selector: 'app-workrequestitem-complete-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, StdMdbFormTextareaComponent, StdBooleanComponent],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">
        <i class="fas fa-check-circle me-2"></i>
        Complete Work Request Item
      </h5>
      <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
    </div>
    
    <div class="modal-body">
      <form (ngSubmit)="onSubmit()" #completeForm="ngForm">
        <!-- Optional Note -->
        <div class="mb-4">
          <app-std-mdb-form-textarea
            prefix="workRequestItem"
            name="completionNote"
            label="Completion Note"
            [required]="false"
            [maxlength]="500"
            [rows]="4"
            placeholder="Enter optional completion notes..."
            helpText="Add any additional notes about the completion of this work request item."
            [error]="error"
            [(ngModel)]="completionNote">
          </app-std-mdb-form-textarea>
        </div>

        <!-- Close Work Request Checkbox -->
        <div class="mb-4">
          <app-std-boolean
            prefix="workRequestItem"
            name="closeWorkRequest"
            label="Close Work Request"
            [(ngModel)]="closeWorkRequest"
            mode="checkbox"
            helpText="Check this box to close the entire work request when completing this item."
            [error]="error">
          </app-std-boolean>
        </div>
      </form>
    </div>
    
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="closeModal()">
        Cancel
      </button>
      <button type="button" class="btn btn-success" (click)="onSubmit()" [disabled]="isSubmitting">
        <i class="fas fa-check me-2" *ngIf="!isSubmitting"></i>
        <i class="fas fa-spinner fa-spin me-2" *ngIf="isSubmitting"></i>
        Mark as Completed
      </button>
    </div>
  `,
  styles: [`
    .modal-header {
      background-color: #f8f9fa;
      border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    }
    
    .modal-title {
      color: #333;
      font-weight: 600;
    }
    
    .modal-body {
      padding: 1.5rem;
    }
    
    .modal-footer {
      border-top: 1px solid rgba(0, 0, 0, 0.125);
      padding: 1rem 1.5rem;
    }
    
    .btn-success {
      background-color: #198754;
      border-color: #198754;
    }
    
    .btn-success:hover {
      background-color: #157347;
      border-color: #146c43;
    }
    
    .btn-success:disabled {
      background-color: #6c757d;
      border-color: #6c757d;
      opacity: 0.65;
    }
  `]
})
export class WorkRequestItemCompleteModalComponent implements OnInit {
  // Form data
  completionNote: string = '';
  closeWorkRequest: boolean = true; // Default checked as requested
  workRequestId: string = '';
  workRequestItemId: string = '';
  baseRoute: string = '';
  
  protected hcclService = inject(HcclService);
  protected hcclContextService = inject(HcclContextService);
  // State
  isSubmitting: boolean = false;
  
  // Error handling
  error: any = null;
  
  // Inject services
  private router = inject(Router);
  
  // Modal reference
  constructor(public modalRef: MdbModalRef<WorkRequestItemCompleteModalComponent>) {}
  protected workRequestItem: WorkRequestItemCrudWrapper | null = null;
  async ngOnInit(): Promise<void> {
    // Get data from modal service if passed
    if (this.modalRef && (this.modalRef as any).data) {
      const data = (this.modalRef as any).data;
      this.workRequestId = data.workRequestId || '';
      this.workRequestItemId = data.workRequestItemId || '';
      this.baseRoute = data.baseRoute || '';
    }

    var x : HcclUserContextGETData = this.hcclContextService.getContext();

    if (this.workItemFormContext.workRequestId === '') {
      this.workItemFormContext.workRequestId = this.workRequestId;
      this.workItemFormContext.workRequestItemId = this.workRequestItemId || '';
      this.workItemFormContext.userProfileId = x.currentUserProfileId
      this.workItemFormContext.mapContextData = {};
      this.workItemFormContext.mapResultsData = {};
    }
    this.workRequestItem = await WorkRequestItemCrudWrapper.newInstance(this.workRequestItemId || '', this.hcclService);  
  }
  
  protected workItemFormContext : WorkItemFormContext = {
    workRequestId: '',
    workRequestItemId: '',
    userProfileId: '',
    mapContextData: {},
    mapResultsData: {}
  };
  isFormValid(): boolean {
    // Form is valid if we have the required IDs
    return !!(this.workRequestId && this.workRequestItemId);
  }
  
  onSubmit(): void {
    if (!this.isFormValid() || this.isSubmitting) {
      return;
    }
    
    this.isSubmitting = true;
    this.error = null;
    
    // Create the work item form request
    const request: WorkItemFormRequest = {
      op: 'completeWorkItem',
      context: this.workItemFormContext, // This would need to be set based on the work request item context
      actionFormData: {
        completionNote: this.completionNote,
        closeWorkRequest: this.closeWorkRequest,
        someData: 'someData', // Keep the existing structure
      }
    };
    
    // Call the service to complete the work request item
    this.hcclService.callWorkRequestUi(this.workRequestId, this.workRequestItem?.getActionCode() || '', request)
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          const workItemResponse: WorkItemFormResponse = response as WorkItemFormResponse;
          const workRequestItemId: string = workItemResponse.context?.workRequestItemId || this.workRequestItemId;
                   
          // Close the modal
          this.closeModal();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.error = error;
          console.error('Error completing work request item:', error);
        }
      });
  }
  
  closeModal(): void {
    this.modalRef?.close();
  }
}
