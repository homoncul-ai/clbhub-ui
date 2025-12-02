import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HcclService } from '@app/restsvc/hccl.service';

import { AbstractMultimodeComponent } from '@app/components/_global/abstract-multimode/abstract-multimode.component';
import { HcclOrganizationCrudWrapper } from '@app/components/_crud/hcclorganization/hcclorganization-crud.component';
import { HcclUserListComponent } from '@app/components/_crud/hccluser/hccluser-list.component';
import { ProviderWorkQueueListComponent } from '@app/components/_crud/workqueue/provider-workqueue-list.component';
import { CatalogListComponent } from '@app/components/_crud/catalog/catalog-list.component';

@Component({
  selector: 'app-provider-dashboard-tab-setup',
  standalone: true,
  imports: [CommonModule, HcclUserListComponent, ProviderWorkQueueListComponent, CatalogListComponent],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card mb-4">
            <div class="card-header">
              <h3 class="card-title">
                <i class="fas fa-cog me-2"></i>
                Organization Setup
              </h3>
            </div>
            <div class="card-body">
              <p class="text-muted mb-4">Manage users, queues, signup packets, and catalogs for your organization.</p>
              
              <!-- Users Section -->
              <div class="setup-section mb-5">
                <h4 class="section-title">
                  <i class="fas fa-users me-2"></i>
                  Users
                </h4>
                <p class="text-muted">Manage organization users. Click "New User" to add a new user.</p>
                <app-hccluser-list 
                  [showingSearch]="true" 
                  [showingSearchHeading]="false"
                  [showingAddButton]="false">
                </app-hccluser-list>
              </div>

              <!-- Queues Section -->
              <div class="setup-section mb-5">
                <h4 class="section-title">
                  <i class="fas fa-list-alt me-2"></i>
                  Queues
                </h4>
                <p class="text-muted">Manage work queues. Click "New Queue" to create a new queue.</p>
                <app-provider-workqueue-list 
                  [showingSearch]="true" 
                  [showingSearchHeading]="false"
                  [showingAddButton]="false">
                </app-provider-workqueue-list>
              </div>

              <!-- Signup Packets Section -->
              <div class="setup-section mb-5">
                <h4 class="section-title">
                  <i class="fas fa-file-alt me-2"></i>
                  Signup Packets
                </h4>
                <p class="text-muted">Manage signup packets. Click "New Signup Packet" to create a new signup packet.</p>
                <div class="alert alert-info">
                  <i class="fas fa-info-circle me-2"></i>
                  Signup packet management will be available soon.
                </div>
              </div>

              <!-- Catalogs Section -->
              <div class="setup-section mb-5">
                <h4 class="section-title">
                  <i class="fas fa-book me-2"></i>
                  Catalogs
                </h4>
                <p class="text-muted">Manage course catalogs. Click "New Catalog" to create a new catalog.</p>
                <app-catalog-list 
                  [showingSearch]="true" 
                  [showingSearchHeading]="false"
                  [showingAddButton]="false">
                </app-catalog-list>
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
    
    .setup-section {
      border-top: 1px solid rgba(0, 0, 0, 0.125);
      padding-top: 1.5rem;
    }
    
    .setup-section:first-of-type {
      border-top: none;
      padding-top: 0;
    }
    
    .section-title {
      color: #333;
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }
  `]
})
export class ProviderDashboardTabSetupComponent extends AbstractMultimodeComponent<HcclOrganizationCrudWrapper> {
  protected organizationId: string = '';

  constructor() {
      super();
      console.log('ProviderDashboardTabSetupComponent');
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    if (this.id) {
      this.organizationId = this.id;
    }
  }

  protected newCrudWrapperForCreate(): HcclOrganizationCrudWrapper {
      return HcclOrganizationCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityByIdCall(id: string): Promise<HcclOrganizationCrudWrapper> {
      return HcclOrganizationCrudWrapper.newInstance(id, this.hcclService);
  }
}
