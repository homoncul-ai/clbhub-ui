import { Component, inject, OnInit, AfterViewInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { HcclService } from '@app/restsvc/hccl.service';

import { AbstractMultimodeComponent } from '@app/components/_global/abstract-multimode/abstract-multimode.component';
import { HcclOrganizationCrudWrapper } from '@app/components/_crud/hcclorganization/hcclorganization-crud.component';
import { HcclOrganizationCrudComponent } from '@app/components/_crud/hcclorganization/hcclorganization-crud.component';

@Component({
  selector: 'app-provider-dashboard-tab-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, HcclOrganizationCrudComponent],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                <i class="fas fa-building me-2"></i>
                Organization Profile
              </h3>
            </div>
            <div class="card-body">
              <p class="text-muted mb-4">Manage your organization's profile information including name, description, and website.</p>
              
              <div *ngIf="organizationWrapper && !loading">
                <app-hcclorganization-crud 
                  [id]="organizationId" 
                  [modeName]="'detail'">
                </app-hcclorganization-crud>
              </div>
              
              <div *ngIf="loading" class="text-center py-4">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
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
    
    .chart-container {
      background-color: #f8f9fa;
      border-radius: 0.375rem;
      padding: 1rem;
    }
  `]
})
export class ProviderDashboardTabProfileComponent extends AbstractMultimodeComponent<HcclOrganizationCrudWrapper> {
  protected organizationId: string = '';
  protected organizationWrapper: HcclOrganizationCrudWrapper | null = null;

  constructor() {
      super();
      console.log('ProviderDashboardTabProfileComponent');
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    if (this.id) {
      this.organizationId = this.id;
      await this.loadOrganization();
    }
  }

  protected async loadOrganization(): Promise<void> {
    if (!this.organizationId) {
      return;
    }
    try {
      this.loading = true;
      this.organizationWrapper = await HcclOrganizationCrudWrapper.newInstance(this.organizationId, this.hcclService);
    } catch (error) {
      console.error('Error loading organization:', error);
    } finally {
      this.loading = false;
    }
  }

  protected newCrudWrapperForCreate(): HcclOrganizationCrudWrapper {
      return HcclOrganizationCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityByIdCall(id: string): Promise<HcclOrganizationCrudWrapper> {
      return HcclOrganizationCrudWrapper.newInstance(id, this.hcclService);
  }
}
