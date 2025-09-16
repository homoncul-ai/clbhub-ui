import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { HcclService } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-provider-details-tab-myschool',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                <i class="fas fa-school me-2"></i>
                My School Information
              </h3>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <h5>School Details</h5>
                  <div class="list-group">
                    <div class="list-group-item">
                      <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">School Name</h6>
                      </div>
                      <p class="mb-1">{{ getSchoolInfo().name }}</p>
                    </div>
                    <div class="list-group-item">
                      <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">Address</h6>
                      </div>
                      <p class="mb-1">{{ getSchoolInfo().address }}</p>
                    </div>
                    <div class="list-group-item">
                      <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">Phone</h6>
                      </div>
                      <p class="mb-1">{{ getSchoolInfo().phone }}</p>
                    </div>
                    <div class="list-group-item">
                      <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">Email</h6>
                      </div>
                      <p class="mb-1">{{ getSchoolInfo().email }}</p>
                    </div>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <h5>Quick Actions</h5>
                  <div class="list-group">
                    <div class="list-group-item">
                      <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">Update School Information</h6>
                        <button class="btn btn-sm btn-outline-primary">Edit</button>
                      </div>
                      <p class="mb-1">Update your school's contact details</p>
                    </div>
                    <div class="list-group-item">
                      <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">View School Profile</h6>
                        <button class="btn btn-sm btn-outline-success">View</button>
                      </div>
                      <p class="mb-1">View your school's public profile</p>
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
    
    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
    }
  `]
})
export class ProviderDetailsTabMyschoolComponent implements OnInit {
  // Inject services using inject() function for standalone components
  private hcclContextService = inject(HcclContextService);
  private hcclService = inject(HcclService);

  constructor() {
    console.log('ProviderDetailsTabMyschoolComponent initialized');
  }

  ngOnInit(): void {
    this.loadSchoolInfo();
  }

  protected getSchoolInfo(): any {
    // Mock data for now - replace with actual service call
    return {
      name: 'Example High School',
      address: '123 Education Street, Learning City, LC 12345',
      phone: '(555) 123-4567',
      email: 'info@examplehighschool.edu'
    };
  }

  protected loadSchoolInfo() {
    // TODO: Implement actual service call for school information
    console.log('Loading school information...');
  }
}
