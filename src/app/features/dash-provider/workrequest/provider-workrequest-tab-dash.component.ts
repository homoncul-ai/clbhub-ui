import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { HcclService } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-provider-workrequest-tab-dash',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                <i class="fas fa-tasks me-2"></i>
                Work Request Dashboard
              </h3>
            </div>
            <div class="card-body">
              <!-- Action Required Tile -->
              <div class="row mb-4">
                <div class="col-12">
                  <h5>Action Required</h5>
                  <div class="card">
                    <div class="card-body">
                      <div class="list-group">
                        <div class="list-group-item" *ngFor="let ticket of getActionRequiredTickets()">
                          <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-1">{{ ticket.businessCode }}</h6>
                            <span class="badge bg-{{ ticket.priority === 'High' ? 'danger' : ticket.priority === 'Medium' ? 'warning' : 'info' }}">{{ ticket.priority }}</span>
                          </div>
                          <p class="mb-1">{{ ticket.description }}</p>
                          <small class="text-muted">Due: {{ ticket.dueDate }} | Assigned: {{ ticket.assignedTo }}</small>
                          <div class="mt-2">
                            <button class="btn btn-sm btn-primary me-2">View Details</button>
                            <button class="btn btn-sm btn-success">Take Action</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Work Request Stats -->
              <div class="row mb-4">                 
                <div class="col-md-3">
                  <div class="text-center">
                    <div class="display-4 text-primary">{{ getWorkRequestStats('Open')?.itemCount }}</div>
                    <div class="text-muted">{{ getWorkRequestStats('Open')?.stateLabel }}</div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="text-center">
                    <div class="display-4 text-warning">{{ getWorkRequestStats('InProgress')?.itemCount }}</div>
                    <div class="text-muted">{{ getWorkRequestStats('InProgress')?.stateLabel }}</div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="text-center">
                    <div class="display-4 text-success">{{ getWorkRequestStats('Completed')?.itemCount }}</div>
                    <div class="text-muted">{{ getWorkRequestStats('Completed')?.stateLabel }}</div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="text-center">
                    <div class="display-4 text-info">{{ getWorkRequestStats('Cancelled')?.itemCount }}</div>
                    <div class="text-muted">{{ getWorkRequestStats('Cancelled')?.stateLabel }}</div>
                  </div>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6">
                  <h5>Recent Work Requests</h5>
                  <div class="list-group">
                    <div class="list-group-item" *ngFor="let request of getRecentWorkRequests()">
                      <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">{{ request.businessCode }}</h6>
                        <span class="badge bg-{{ request.currentStateCode === 'Open' ? 'warning' : request.currentStateCode === 'Completed' ? 'success' : 'primary' }}">{{ request.currentStateCode }}</span>
                      </div>
                      <p class="mb-1">{{ request.description }}</p>
                      <small class="text-muted">Created: {{ request.createdDate }}</small>
                    </div>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <h5>Quick Actions</h5>
                  <div class="list-group">
                    <div class="list-group-item">
                      <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">Create New Request</h6>
                        <button class="btn btn-sm btn-outline-primary">Create</button>
                      </div>
                      <p class="mb-1">Submit a new work request</p>
                    </div>
                    <div class="list-group-item">
                      <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">View All Requests</h6>
                        <button class="btn btn-sm btn-outline-success">View All</button>
                      </div>
                      <p class="mb-1">Browse all work requests</p>
                    </div>
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
export class ProviderWorkrequestTabDashComponent implements OnInit {
  // Inject services using inject() function for standalone components
  private hcclContextService = inject(HcclContextService);
  private hcclService = inject(HcclService);

  constructor() {
    console.log('ProviderWorkrequestTabDashComponent initialized');
  }

  ngOnInit(): void {
    this.loadWorkRequestData();
  }

  protected getActionRequiredTickets(): any[] {
    // Mock data for now - replace with actual service call
    return [
      { 
        businessCode: 'WR-2024-001', 
        description: 'Review and approve course catalog entries for Computer Science department',
        priority: 'High',
        dueDate: '2024-02-15',
        assignedTo: 'Dr. Sarah Johnson'
      },
      { 
        businessCode: 'WR-2024-002', 
        description: 'Update school profile information and contact details',
        priority: 'Medium',
        dueDate: '2024-02-20',
        assignedTo: 'Mr. Michael Chen'
      }
    ];
  }

  protected getWorkRequestStats(stateCode: string): any {
    // Mock data for now - replace with actual service call
    const stats = {
      'Open': { itemCount: 5, stateLabel: 'Open Requests' },
      'InProgress': { itemCount: 3, stateLabel: 'In Progress' },
      'Completed': { itemCount: 12, stateLabel: 'Completed' },
      'Cancelled': { itemCount: 1, stateLabel: 'Cancelled' }
    };
    return stats[stateCode] || { itemCount: 0, stateLabel: stateCode };
  }

  protected getRecentWorkRequests(): any[] {
    // Mock data for now - replace with actual service call
    return [
      { businessCode: 'WR-2024-003', description: 'Course catalog review for Mathematics', currentStateCode: 'Open', createdDate: '2024-01-25' },
      { businessCode: 'WR-2024-004', description: 'School information update', currentStateCode: 'Completed', createdDate: '2024-01-20' },
      { businessCode: 'WR-2024-005', description: 'New course proposal review', currentStateCode: 'InProgress', createdDate: '2024-01-18' }
    ];
  }

  protected loadWorkRequestData() {
    // TODO: Implement actual service call for work request data
    console.log('Loading work request data...');
  }
}
