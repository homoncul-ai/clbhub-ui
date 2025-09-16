import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { EntityStateStatGETData, HcclService, WorkRequestDashboardUIGETData, WorkRequestGETData } from '@app/restsvc/hccl.service';
import { HcclOrganizationCrudWrapper } from 'tooling/prompt/templates/template-crud.component';
import { AbstractMultimodeComponent } from '@app/components/_global/abstract-multimode/abstract-multimode.component';
import { HcclUserProfileCrudWrapper } from '@app/features/dash-ecoadmin/orgs/org-school-staff-crud.component';

@Component({
  selector: 'app-provider-dashboard-tab-mydash',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                <i class="fas fa-tachometer-alt me-2"></i>
                Provider Dashboard
              </h3>
            </div>
            <div class="card-body">
              <!-- Provider Request Stats -->
              <div class="row mb-4">                 
                <div class="col-md-3">
                  <div class="text-center">
                    <div class="display-4 text-primary">{{ getProviderRequestStats('New')?.itemCount }}</div>
                    <div class="text-muted">{{ getProviderRequestStats('New')?.stateLabel }}</div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="text-center">
                    <div class="display-4 text-warning">{{ getProviderRequestStats('InProgress')?.itemCount }}</div>
                    <div class="text-muted">{{ getProviderRequestStats('InProgress')?.stateLabel }}</div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="text-center">
                    <div class="display-4 text-success">{{ getProviderRequestStats('Closed')?.itemCount }}</div>
                    <div class="text-muted">{{ getProviderRequestStats('Closed')?.stateLabel }}</div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="text-center">
                    <div class="display-4 text-info">{{ getCatalogCount() }}</div>
                    <div class="text-muted">Total Catalogs</div>
                  </div>
                </div>
              </div>
              
              <div class="row">
                <!-- Course Catalog Interests Chart -->
                <div class="col-md-6">
                  <h5>Course Catalog Interests</h5>
                  <div class="card">
                    <div class="card-body">
                      <canvas id="catalogInterestsChart" width="400" height="200"></canvas>
                      <p class="text-muted mt-2">Distribution of interests across catalogs</p>
                    </div>
                  </div>
                </div>
                
                <!-- Catalog List -->
                <div class="col-md-6">
                  <h5>Available Catalogs</h5>
                  <div class="list-group">
                    <div class="list-group-item" *ngFor="let catalog of getCatalogs()">
                      <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">{{ catalog.name }}</h6>
                        <span class="badge bg-primary">{{ catalog.entryCount }}</span>
                      </div>
                      <p class="mb-1">{{ catalog.description }}</p>
                      <small class="text-muted">Last updated: {{ catalog.lastUpdated }}</small>
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
export class ProviderDashboardTabMydashComponent extends AbstractMultimodeComponent<HcclOrganizationCrudWrapper>{
  constructor() {
      super();
      console.log('ProviderDashboardTabMydashComponent');
  }

  protected newCrudWrapperForCreate(): HcclOrganizationCrudWrapper {
      return HcclOrganizationCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<HcclOrganizationCrudWrapper> {
      return HcclOrganizationCrudWrapper.newInstance(id, this.hcclService);
  }  

  protected getProviderRequestStats(stateCode: string): EntityStateStatGETData | null {
    return  {itemCount: 0, stateCode: stateCode, stateLabel: stateCode};
  }

  protected getCatalogCount(): number {
    // Mock data for now - replace with actual service call
    return 5;
  }

  protected getCatalogs(): any[] {
    // Mock data for now - replace with actual service call
    return [
      { name: 'Computer Science', description: 'Programming and software development courses', entryCount: 25, lastUpdated: '2024-01-15' },
      { name: 'Business Administration', description: 'Management and business courses', entryCount: 18, lastUpdated: '2024-01-10' },
      { name: 'Healthcare', description: 'Medical and healthcare related courses', entryCount: 32, lastUpdated: '2024-01-20' },
      { name: 'Engineering', description: 'Engineering and technical courses', entryCount: 28, lastUpdated: '2024-01-18' },
      { name: 'Arts & Design', description: 'Creative and design courses', entryCount: 15, lastUpdated: '2024-01-12' }
    ];
  }

  protected loadInfo() {
    // TODO: Implement actual service call for provider dashboard data
    // this.hcclService.resolveProviderUIData().subscribe((data) => {
    //   console.log('Provider UI data loaded:', data);
    //   this.providerUIData = data;
    // });
    console.log('Loading provider dashboard data...');
  }
}
