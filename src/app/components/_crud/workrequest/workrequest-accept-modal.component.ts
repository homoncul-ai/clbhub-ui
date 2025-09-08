import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Router } from '@angular/router';
import { HcclService, RoutingActionPOSTData, WorkRequestGETData } from '@app/restsvc/hccl.service';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';

@Component({
  selector: 'app-workrequest-accept-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, StdMdbFormTextComponent],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">
        <i class="fas fa-check-circle me-2"></i>
        Accept Ticket
      </h5>
      <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
    </div>
    
    <div class="modal-body">
      <form (ngSubmit)="onSubmit()" #acceptForm="ngForm">
        <!-- Accept Text -->
        <div class="mb-4">
          <app-std-mdb-form-text
            prefix="workRequest"
            name="acceptText"
            label="Accept Text"
            [required]="true"
            [maxlength]="500"
            placeholder="Enter acceptance comments..."
            helpText="Please provide comments explaining why you are accepting this ticket."
            [error]="error"
            [(ngModel)]="acceptText">
          </app-std-mdb-form-text>
        </div>
      </form>
    </div>
    
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="closeModal()">
        Cancel
      </button>
      <button type="button" class="btn btn-success" (click)="onSubmit()" [disabled]="!isFormValid()">
        <i class="fas fa-check me-2"></i>
        Accept Ticket
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
export class WorkRequestAcceptModalComponent implements OnInit {
  // Form data
  acceptText: string = '';
  workRequestId: string = '';
  baseRoute: string = '';
  
  // Error handling
  error: any = null;
  
  // Inject services
  private hcclService = inject(HcclService);
  private hcclContextService = inject(HcclContextService);
  private router = inject(Router);
  
  // Modal reference
  constructor(public modalRef: MdbModalRef<WorkRequestAcceptModalComponent>) {}
  
  ngOnInit(): void {
    // Get data from modal service if passed
    if (this.modalRef && (this.modalRef as any).data) {
      this.workRequestId = (this.modalRef as any).data.workRequestId || '';
      this.baseRoute = (this.modalRef as any).data.baseRoute || '';
    }
  }
  
  /**
   * Check if form is valid
   */
  isFormValid(): boolean {
    return !!(this.acceptText && this.acceptText.trim().length > 0);
  }
  
  /**
   * Handle form submission
   */
  async onSubmit(): Promise<void> {
    if (!this.isFormValid()) {
      return;
    }
    
    try {
      const data: RoutingActionPOSTData = {
        comments: this.acceptText,
        userProfileId: (this.hcclContextService.getCurrentUserProfileId() as string) || ''
      };
      
      this.hcclService.acceptTicket(this.workRequestId, data).subscribe({
        next: (response: WorkRequestGETData) => {
          // Close modal and navigate
          this.closeModal();
          this.router.navigate([this.baseRoute, this.workRequestId]);
        },
        error: (error) => {
          console.error('Error accepting ticket:', error);
          this.error = error;
        }
      });
    } catch (error) {
      console.error('Error accepting ticket:', error);
      this.error = error;
    }
  }
  
  /**
   * Close the modal
   */
  closeModal(): void {
    this.modalRef.close();
  }
}
