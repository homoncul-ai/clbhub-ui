import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Router } from '@angular/router';
import { HcclService, RoutingActionPOSTData, WorkRequestGETData, WorkQueueGETData, MenuControlData, MenuControlDataList } from '@app/restsvc/hccl.service';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { WorkRequestCrudWrapper } from '@app/components/_crud/workrequest/workrequest-crud.component';

@Component({
  selector: 'app-workrequest-route-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule, StdMdbFormTextComponent, MenuControlDataListComponent, SimpleMessagesSectionComponent],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">
        <i class="fas fa-route me-2"></i>
        Route Work Request
      </h5>
      <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
    </div>
    
    <div class="modal-body">
      <!-- <app-simple-messages-section [messagesList]="this.messages"></app-simple-messages-section>
       -->
      <form #routeForm="ngForm">
        <!-- Accept Ticket Section -->
        <div *ngIf="!isTicketAccepted()" class="mb-4">
          <h6 class="mb-3">
            <i class="fas fa-check-circle me-2"></i>
            Accept Ticket
          </h6>
          <app-std-mdb-form-text
            prefix="workRequest"
            name="acceptText"
            label="Accept Comments"
            [required]="true"
            [maxlength]="500"
            placeholder="Enter acceptance comments..."
            helpText="Please provide comments explaining why you are accepting this ticket."
            [error]="error"
            [(ngModel)]="acceptText">
          </app-std-mdb-form-text>
        </div>

        <!-- Reroute Ticket Section -->
        <div *ngIf="isTicketAccepted()" class="mb-4">
          <h6 class="mb-3">
            <i class="fas fa-route me-2"></i>
            Reroute Ticket
          </h6>
          
          <!-- Reroute Comments -->
          <div class="mb-3">
            <app-std-mdb-form-text
              prefix="workRequest"
              name="rerouteText"
              label="Reroute Comments"
              [required]="true"
              [maxlength]="500"
              placeholder="Enter rerouting comments..."
              helpText="Please provide comments explaining why you are rerouting this ticket."
              [error]="error"
              [(ngModel)]="rerouteText">
            </app-std-mdb-form-text>
          </div>

          <!-- Work Queue Selection -->
          <div class="mb-3">
            <label class="form-label">Select Work Queue</label>
            <app-menu-control-data-list
              [menuControlDataList]="menu_queues"
              placeholder="Select work queue..."
              (selectionChange)="onWorkQueueChange($event)">
            </app-menu-control-data-list>
            <div class="form-text">Choose the destination queue for this work request.</div>
          </div>
        </div>
      </form>
    </div>
    
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="closeModal()">
        Cancel
      </button>
      <button *ngIf="!isTicketAccepted()" type="button" class="btn btn-success" (click)="acceptTicket()" [disabled]="!isAcceptFormValid()">
        <i class="fas fa-check me-2"></i>
        Accept Ticket
      </button>
      <button *ngIf="isTicketAccepted()" type="button" class="btn btn-primary" (click)="rerouteTicket()" [disabled]="!isRerouteFormValid()">
        <i class="fas fa-route me-2"></i>
        Reroute Ticket
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
    
    .btn-primary {
      background-color: #0d6efd;
      border-color: #0d6efd;
    }
    
    .btn-primary:hover {
      background-color: #0b5ed7;
      border-color: #0a58ca;
    }
    
    .btn-success:disabled,
    .btn-primary:disabled {
      background-color: #6c757d;
      border-color: #6c757d;
      opacity: 0.65;
    }
    
    .form-label {
      font-weight: 600;
      color: #333;
      margin-bottom: 0.5rem;
    }
    
    .form-text {
      font-size: 0.875rem;
      color: #6c757d;
      margin-top: 0.25rem;
    }
    
    h6 {
      color: #495057;
      font-weight: 600;
    }
  `]
})
export class WorkRequestRouteTicketComponent implements OnInit {
  // Form data
  acceptText: string = '';
  rerouteText: string = '';
  workRequestId: string = '';
  baseRoute: string = '';
  
  // Work queue selection
  selectedWorkQueue: MenuControlData | null = null;
  menu_queues: MenuControlDataList | null = null;
  
  // Entity and state
  entity: WorkRequestCrudWrapper | null = null;
  messages: any[] = [];
  
  // Error handling
  error: any = null;
  
  // Inject services
  private hcclService = inject(HcclService);
  private hcclContextService = inject(HcclContextService);
  private router = inject(Router);
  
  // Modal reference
  constructor(public modalRef: MdbModalRef<WorkRequestRouteTicketComponent>) {}
  
  ngOnInit(): void {
    // Get data from modal service if passed
    if (this.modalRef && (this.modalRef as any).data) {
      this.workRequestId = (this.modalRef as any).data.workRequestId || '';
      this.baseRoute = (this.modalRef as any).data.baseRoute || '';
    }
    
    // Load work request entity and queues
    this.loadEntityAndQueues();
  }
  
  /**
   * Load work request entity and available work queues
   */
  private async loadEntityAndQueues(): Promise<void> {
    try {
      // Load the work request entity
      this.entity = await WorkRequestCrudWrapper.newInstance(this.workRequestId, this.hcclService);
      
      // Load available work queues
      const queues = this.hcclContextService.getContext().dashQueues || [];
      
      this.menu_queues = {
        menuItems: [],
      };

      for (const queueT of queues) {
        const queue: WorkQueueGETData = queueT as WorkQueueGETData;
        const md: MenuControlData = {
          id: queue.id,
          name: queue.businessCode,
          selected: false,
        };
        this.menu_queues?.menuItems?.push(md);
      }
    } catch (error) {
      console.error('Error loading entity and queues:', error);
      this.error = error;
    }
  }
  
  /**
   * Check if ticket is accepted
   */
  isTicketAccepted(): boolean {
    return this.entity?.isTicketAccepted() || false;
  }
  
  /**
   * Handle work queue selection change
   */
  onWorkQueueChange(selectedItem: MenuControlData | null): void {
    this.selectedWorkQueue = selectedItem;
  }
  
  /**
   * Check if accept form is valid
   */
  isAcceptFormValid(): boolean {
    return !!(this.acceptText && this.acceptText.trim().length > 0);
  }
  
  /**
   * Check if reroute form is valid
   */
  isRerouteFormValid(): boolean {
    return !!(this.rerouteText && this.rerouteText.trim().length > 0 && this.selectedWorkQueue);
  }
  
  /**
   * Handle accept ticket submission
   */
  async acceptTicket(): Promise<void> {
    if (!this.isAcceptFormValid()) {
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
          this.router.navigate([this.baseRoute, this.workRequestId, 'logs']);
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
   * Handle reroute ticket submission
   */
  async rerouteTicket(): Promise<void> {
    if (!this.isRerouteFormValid()) {
      return;
    }
    
    try {
      const data: RoutingActionPOSTData = {
        comments: this.rerouteText,
        userProfileId: (this.hcclContextService.getCurrentUserProfileId() as string) || '',
        newQueueId: this.selectedWorkQueue?.id || ''
      };
      
      this.hcclService.rerouteTicket(this.workRequestId, data).subscribe({
        next: (response: WorkRequestGETData) => {
          // Close modal and navigate
          this.closeModal();
          this.router.navigate([this.baseRoute, this.workRequestId, 'logs']);
        },
        error: (error) => {
          console.error('Error routing ticket:', error);
          this.error = error;
        }
      });
    } catch (error) {
      console.error('Error routing ticket:', error);
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
