import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { HcclService } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-provider-details-tab-colleagues',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                <i class="fas fa-users me-2"></i>
                Colleagues
              </h3>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-8">
                  <h5>School Staff</h5>
                  <div class="list-group">
                    <div class="list-group-item" *ngFor="let colleague of getColleagues()">
                      <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">{{ colleague.name }}</h6>
                        <span class="badge bg-{{ colleague.role === 'Principal' ? 'primary' : colleague.role === 'Teacher' ? 'success' : 'info' }}">{{ colleague.role }}</span>
                      </div>
                      <p class="mb-1">{{ colleague.department }}</p>
                      <small class="text-muted">Email: {{ colleague.email }}</small>
                    </div>
                  </div>
                </div>
                
                <div class="col-md-4">
                  <h5>Quick Actions</h5>
                  <div class="list-group">
                    <div class="list-group-item">
                      <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">Add Colleague</h6>
                        <button class="btn btn-sm btn-outline-primary">Add</button>
                      </div>
                      <p class="mb-1">Add a new colleague to your school</p>
                    </div>
                    <div class="list-group-item">
                      <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">Send Message</h6>
                        <button class="btn btn-sm btn-outline-success">Message</button>
                      </div>
                      <p class="mb-1">Send a message to colleagues</p>
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
export class ProviderDetailsTabColleaguesComponent implements OnInit {
  // Inject services using inject() function for standalone components
  private hcclContextService = inject(HcclContextService);
  private hcclService = inject(HcclService);

  constructor() {
    console.log('ProviderDetailsTabColleaguesComponent initialized');
  }

  ngOnInit(): void {
    this.loadColleagues();
  }

  protected getColleagues(): any[] {
    // Mock data for now - replace with actual service call
    return [
      { name: 'Dr. Sarah Johnson', role: 'Principal', department: 'Administration', email: 'sarah.johnson@examplehighschool.edu' },
      { name: 'Mr. Michael Chen', role: 'Teacher', department: 'Mathematics', email: 'michael.chen@examplehighschool.edu' },
      { name: 'Ms. Emily Rodriguez', role: 'Teacher', department: 'English', email: 'emily.rodriguez@examplehighschool.edu' },
      { name: 'Dr. James Wilson', role: 'Teacher', department: 'Science', email: 'james.wilson@examplehighschool.edu' },
      { name: 'Ms. Lisa Thompson', role: 'Counselor', department: 'Guidance', email: 'lisa.thompson@examplehighschool.edu' }
    ];
  }

  protected loadColleagues() {
    // TODO: Implement actual service call for colleagues information
    console.log('Loading colleagues information...');
  }
}
