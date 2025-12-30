import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { CatalogCriteria, CatalogGETData, HcclService } from '@app/restsvc/hccl.service';
import { HcclOrganizationCrudWrapper } from '@app/components/_crud/hcclorganization/hcclorganization-crud.component';
import { AbstractMultimodeComponent } from '@app/components/_global/abstract-multimode/abstract-multimode.component';
import { AddCatalogModalComponent } from './add-catalog-modal.component';

@Component({
  selector: 'app-provider-catalog-tab-dash',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h3 class="card-title mb-0">
                <i class="fas fa-book me-2"></i>
                Catalog Dashboard
              </h3>
              <button class="btn btn-primary btn-sm" (click)="addCatalog()">
                <i class="fas fa-plus me-1"></i>
                Add Catalog
              </button>
            </div>
            <div class="card-body">
              <!-- Catalog Tiles -->
              <div class="row">
                <div class="col-md-6 col-lg-4 mb-4" *ngFor="let catalog of getCatalogs()">
                  <div class="card h-100">
                    <div class="card-header">
                      <h5 class="card-title mb-0">
                        <i class="fas fa-book me-2"></i>
                        {{ catalog.name }}
                      </h5>
                    </div>
                    <div class="card-body">
                      <p class="card-text">{{ catalog.description }}</p>
                      <div class="row text-center">
                        <div class="col-6">
                          <div class="display-6 text-primary">{{ catalog.stats?.entryCount }}</div>
                          <small class="text-muted">Entries</small>
                        </div>
                        <div class="col-6">
                          <div class="display-6 text-success">{{ catalog.stats?.interestCount }}</div>
                          <small class="text-muted">Active</small>
                        </div>
                      </div>
                    </div>
                    <div class="card-footer">
                      <div class="d-flex justify-content-between">
                        <small class="text-muted">Updated: {{ catalog.dateLastUpdated?.formattedDate }}</small>
                        <div>
                          <button class="btn btn-sm btn-outline-primary me-1">View</button>
                          <button class="btn btn-sm btn-outline-success">Edit</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Quick Actions -->
              <!-- <div class="row mt-4">
                <div class="col-12">
                  <h5>Quick Actions</h5>
                  <div class="card">
                    <div class="card-body">
                      <div class="row">
                        <div class="col-md-3">
                          <div class="text-center">
                            <button class="btn btn-primary btn-lg mb-2">
                              <i class="fas fa-plus me-2"></i>
                              Create New Catalog
                            </button>
                            <p class="text-muted">Add a new course catalog</p>
                          </div>
                        </div>
                        <div class="col-md-3">
                          <div class="text-center">
                            <button class="btn btn-success btn-lg mb-2">
                              <i class="fas fa-edit me-2"></i>
                              Manage Entries
                            </button>
                            <p class="text-muted">Add or edit catalog entries</p>
                          </div>
                        </div>
                        <div class="col-md-3">
                          <div class="text-center">
                            <button class="btn btn-info btn-lg mb-2">
                              <i class="fas fa-chart-bar me-2"></i>
                              View Analytics
                            </button>
                            <p class="text-muted">View catalog usage statistics</p>
                          </div>
                        </div>
                        <div class="col-md-3">
                          <div class="text-center">
                            <button class="btn btn-warning btn-lg mb-2">
                              <i class="fas fa-download me-2"></i>
                              Export Data
                            </button>
                            <p class="text-muted">Export catalog data</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>  -->
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
    
    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
    }
    
    .btn-lg {
      padding: 0.5rem 1rem;
      font-size: 1.125rem;
    }
  `]
})
export class ProviderCatalogTabDashComponent extends AbstractMultimodeComponent<HcclOrganizationCrudWrapper> {
  private modalService = inject(MdbModalService);
  private modalRef: MdbModalRef<AddCatalogModalComponent> | null = null;

  constructor() {
    super();
    console.log('ProviderCatalogTabDashComponent');
  }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
  }
  
  protected newCrudWrapperForCreate(): HcclOrganizationCrudWrapper {
      return HcclOrganizationCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected organizationId: string = '';
  protected getOrganizationId(): string {
    return this.organizationId;
  }
  protected catalogList: CatalogGETData[] = [];
  protected async loadEntityByIdCall(id: string): Promise<HcclOrganizationCrudWrapper> {
    this.organizationId = this.hcclContextService.getCurrentUserProfile().organizationId;

    var ids: string[] = [];
    if (id !== '') {
    //  ids.push(id);
    }
    var organizationId: string = '';
    if (this.organizationId !== '') {
      organizationId = this.organizationId;
    }
    const catalogcriteria : CatalogCriteria = {
      ids: ids,
      organizationId: this.organizationId,
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    }
    
    const catalogs  = await this.hcclService.findCatalogs(catalogcriteria).toPromise();

    
    this.catalogList = catalogs?.searchResults || [];

//  alert('organizationId ' + organizationId + JSON.stringify(catalogs));
    const organizationWrapper = HcclOrganizationCrudWrapper.newInstance(organizationId, this.hcclService);
//    alert('organizationWrapper ' + JSON.stringify((await organizationWrapper).dump()));
    return organizationWrapper;
  }  
 

  protected getCatalogCount(): number {
    // Mock data for now - replace with actual service call    
    return 5;
  }

  protected getCatalogs(): CatalogGETData[] {
    return this.catalogList;
  }

  protected addCatalog(): void {
    this.modalRef = this.modalService.open(AddCatalogModalComponent, {
      modalClass: 'modal-lg',
      backdrop: true,
      keyboard: true,
      ignoreBackdropClick: false
    });

    // Handle modal result
    this.modalRef.onClose.subscribe((result) => {
      if (result?.success) {
        console.log('Catalog created successfully:', result.catalogId);
        // Refresh the catalog list
        this.refreshCatalogs();
      }
      this.modalRef = null;
    });
  }

  /**
   * Refresh the catalog list after adding a new catalog
   */
  private async refreshCatalogs(): Promise<void> {
    const catalogcriteria: CatalogCriteria = {
      organizationId: this.organizationId,
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
    
    const catalogs = await this.hcclService.findCatalogs(catalogcriteria).toPromise();
    this.catalogList = catalogs?.searchResults || [];
  }
}
