import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbModalService, MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { GuidanceTicketModalComponent } from './guidance-ticket-modal.component';
import { HcclContextService } from '@app/shell/services/hccl-context.service';

@Component({
  selector: 'app-dash-student-guidance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                <i class="fas fa-life-ring me-2"></i>
                Guidance & Support
              </h3>
            </div>
            <div class="card-body">
              <div class="row mb-4">
                <div class="col-md-3">
                  <div class="text-center">
                    <div class="display-4 text-primary">5</div>
                    <div class="text-muted">Open Tickets</div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="text-center">
                    <div class="display-4 text-success">12</div>
                    <div class="text-muted">Resolved</div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="text-center">
                    <div class="display-4 text-info">2</div>
                    <div class="text-muted">In Progress</div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="text-center">
                    <div class="display-4 text-warning">1</div>
                    <div class="text-muted">Pending Review</div>
                  </div>
                </div>
              </div>
              
              <!-- <div class="row mb-4">
                <div class="col-12">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5>My Support Tickets</h5>
                    <button class="btn btn-primary">
                      <i class="fas fa-plus me-2"></i>
                      New Ticket
                    </button>
                  </div>
                </div>
              </div> -->
              
              <div class="row">
                <div class="col-md-6">
                  <h5>Recent Tickets</h5>
                  <div class="list-group">
                    <div class="list-group-item">
                      <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">Course Registration Issue</h6>
                        <span class="badge bg-warning">In Progress</span>
                      </div>
                      <p class="mb-1">Unable to register for Advanced Algorithms course</p>
                      <small class="text-muted">Created 2 days ago</small>
                    </div>
                    <div class="list-group-item">
                      <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">Academic Planning Help</h6>
                        <span class="badge bg-success">Resolved</span>
                      </div>
                      <p class="mb-1">Need guidance on course selection for next semester</p>
                      <small class="text-muted">Resolved 1 week ago</small>
                    </div>
                    <div class="list-group-item">
                      <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">Financial Aid Question</h6>
                        <span class="badge bg-primary">Open</span>
                      </div>
                      <p class="mb-1">Questions about scholarship renewal process</p>
                      <small class="text-muted">Created 3 days ago</small>
                    </div>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <h5>Quick Actions</h5>
                  <div class="list-group">
                    <div class="list-group-item">
                      <!-- <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">Schedule Meeting with Advisor</h6>
                        <button class="btn btn-sm btn-outline-primary">Schedule</button>
                      </div>
                      <p class="mb-1">Book a one-on-one session with your academic advisor</p> -->
                    </div>
                    <div class="list-group-item">
                      <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">Career Counseling</h6>
                        <button class="btn btn-sm btn-outline-success" (click)="openGuidanceTicketModal()">Request</button>
                      </div>
                      <p class="mb-1">Get guidance on career paths and job opportunities</p>
                    </div>
                    <!-- <div class="list-group-item">
                      <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">Mental Health Support</h6>
                        <button class="btn btn-sm btn-outline-info">Connect</button>
                      </div>
                      <p class="mb-1">Access counseling and mental health resources</p>
                    </div> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
      border: 1px solid rgba(0, 0, 0, 0.125);
    }
    
    .card-header {
      background-color: #f8f9fa;
      border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    }
    
    .list-group-item {
      border-left: none;
      border-right: none;
    }
    
    .badge {
      font-size: 0.75em;
    }
    
    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
    }
  `]
})
export class DashStudentGuidanceComponent {
  private modalRef: MdbModalRef<GuidanceTicketModalComponent> | null = null;
  
  // Inject services using inject() function for standalone components
  private modalService = inject(MdbModalService);
  private hcclContextService = inject(HcclContextService);
  
  constructor() {
    console.log('DashStudentGuidanceComponent initialized');
  }
  
  /**
   * Open the guidance ticket modal
   */
  openGuidanceTicketModal(): void {
    // Get current user profile ID from HCCL context service
    const userProfileId = this.hcclContextService.getCurrentUserProfileId();
    
    if (!userProfileId) {
      console.warn('User profile ID not available - context may not be ready');
      // TODO: Show user-friendly error message
      return;
    }
    
    this.modalRef = this.modalService.open(GuidanceTicketModalComponent, {
      modalClass: 'modal-lg',
      data: {
        userProfileId: userProfileId,
        personalStatementId: '', // Will be selected in the modal
        title: '',
        notes: '',
        dueDate: ''
      }
    }) as MdbModalRef<GuidanceTicketModalComponent>;
    
    // Handle modal close
    if (this.modalRef?.onClose) {
      this.modalRef.onClose.subscribe((result) => {
        if (result && result.success) {
          console.log('Guidance ticket submitted successfully:', result);
          // TODO: Show success message to user
          // TODO: Refresh ticket data if needed
        //  alert(result.message || 'Guidance ticket submitted successfully!');
        } else if (result) {
          console.log('Guidance ticket submission cancelled or failed');
        }
        this.modalRef = null;
      });
    }
  }
}
