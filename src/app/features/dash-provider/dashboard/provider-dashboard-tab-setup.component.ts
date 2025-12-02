import { Component, OnInit, Input, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HcclService } from '@app/restsvc/hccl.service';
import { HcclUserProfileCriteria, WorkQueueCriteria, CatalogCriteria, HcclTeamCriteria } from '@app/restsvc/hccl.service';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { OnAddActionBehavior } from '@app/components/_global/abstract-list/abstract-list.component';

import { AbstractMultimodeComponent } from '@app/components/_global/abstract-multimode/abstract-multimode.component';
import { HcclOrganizationCrudWrapper } from '@app/components/_crud/hcclorganization/hcclorganization-crud.component';
import { HcclUserProfileListComponent } from '@app/components/_crud/hccluserprofile/hccluserprofile-list.component';
import { ProviderWorkQueueListComponent } from '@app/components/_crud/workqueue/provider-workqueue-list.component';
import { CatalogListComponent } from '@app/components/_crud/catalog/catalog-list.component';
import { HcclTeamListComponent } from '@app/components/_crud/hcclteam/hcclteam-list.component';
import { OnboardOrgUserModalComponent } from '@app/features/dash-ecoadmin/orgs/onboard-org-user-modal.component';
import { CreateQueueModalComponent } from './create-queue-modal.component';
import { CreateTeamModalComponent } from './create-team-modal.component';

@Component({
  selector: 'app-provider-dashboard-tab-setup',
  standalone: true,
  imports: [CommonModule, HcclUserProfileListComponent, ProviderWorkQueueListComponent, CatalogListComponent, HcclTeamListComponent],
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
                <div *ngIf="!loading">
                  <app-hccluserprofile-list 
                    [showingSearch]="true" 
                    [showingSearchHeading]="false"
                    [showingAddButton]="true"
                    [criteria]="getUserProfileCriteria()"
                    [onAddAction]="getUserAddAction()">
                  </app-hccluserprofile-list>
                </div>
              </div>

              <!-- Teams Section -->
              <div class="setup-section mb-5">
                <h4 class="section-title">
                  <i class="fas fa-users-cog me-2"></i>
                  Teams
                </h4>
                <p class="text-muted">Manage organization teams. Click "New Team" to add a new team.</p>
                <div *ngIf="!loading">
                  <app-hcclteam-list 
                    [showingSearch]="true" 
                    [showingSearchHeading]="false"
                    [showingAddButton]="true"
                    [criteria]="getTeamCriteria()"
                    [onAddAction]="getTeamAddAction()">
                  </app-hcclteam-list>
                </div>
              </div>

              <!-- Queues Section -->
              <div class="setup-section mb-5">
                <h4 class="section-title">
                  <i class="fas fa-list-alt me-2"></i>
                  Queues
                </h4>
                <p class="text-muted">Manage work queues. Click "New Queue" to create a new queue.</p>
                <div *ngIf="!loading">
                  <app-provider-workqueue-list 
                    [showingSearch]="true" 
                    [showingSearchHeading]="false"
                    [showingAddButton]="true"
                    [criteria]="getWorkQueueCriteria()"
                    [onAddAction]="getWorkQueueAddAction()">
                  </app-provider-workqueue-list>
                </div>
              </div>

              <!-- Signup Packets Section -->
              <div class="setup-section mb-5">
                <h4 class="section-title">
                  <i class="fas fa-file-alt me-2"></i>
                  Signup Packets
                </h4>
                <p class="text-muted">Manage signup packets. Click "New Signup Packet" to create a new signup packet.</p>
                <div *ngIf="!loading">
                  <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    Signup packet management will be available soon.
                  </div>
                </div>
              </div>

              <!-- Catalogs Section -->
              <div class="setup-section mb-5">
                <h4 class="section-title">
                  <i class="fas fa-book me-2"></i>
                  Catalogs
                </h4>
                <p class="text-muted">Manage course catalogs. Click "New Catalog" to create a new catalog.</p>
                <div *ngIf="!loading">
                  <app-catalog-list 
                    [showingSearch]="true" 
                    [showingSearchHeading]="false"
                    [showingAddButton]="false"
                    [criteria]="getCatalogCriteria()">
                  </app-catalog-list>
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
  protected modalService = inject(MdbModalService);
  protected modalRef?: MdbModalRef<OnboardOrgUserModalComponent>;
  protected queueModalRef?: MdbModalRef<CreateQueueModalComponent>;
  protected teamModalRef?: MdbModalRef<CreateTeamModalComponent>;
  @ViewChild(HcclUserProfileListComponent) userProfileListComponent?: HcclUserProfileListComponent;
  @ViewChild(ProviderWorkQueueListComponent) workQueueListComponent?: ProviderWorkQueueListComponent;
  @ViewChild(HcclTeamListComponent) teamListComponent?: HcclTeamListComponent;

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

  /**
   * Get criteria for HcclUserProfile list filtered by organization
   */
  protected getUserProfileCriteria(): HcclUserProfileCriteria {
    return {
      organizationId: this.organizationId || undefined,
      pageNumber: 1,
      pageSize: 50,
      isPaging: true,
      available: 1
    };
  }

  /**
   * Get criteria for WorkQueue list filtered by organization
   */
  protected getWorkQueueCriteria(): WorkQueueCriteria {
    return {
      organizationId: this.organizationId || undefined,
      externalQueue: 1,
      pageNumber: 1,
      pageSize: 50,
      isPaging: true,
      includingStats: true
    };
  }

  /**
   * Get criteria for Catalog list filtered by organization
   */
  protected getCatalogCriteria(): CatalogCriteria {
    return {
      organizationId: this.organizationId || undefined,
      available: 1,
      pageNumber: 1,
      pageSize: 50,
      isPaging: true,
      includingCatalogStats: true
    };
  }

  /**
   * Get criteria for HcclTeam list filtered by organization
   */
  protected getTeamCriteria(): HcclTeamCriteria {
    return {
      organizationId: this.organizationId || undefined,
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  /**
   * Get the add action handler for user profile list
   * Opens the onboard user modal
   */
  protected getUserAddAction(): OnAddActionBehavior {
    const addAction = new OnAddActionBehavior();
    addAction.onAdd = (baseRoute: string, router: any) => {
      // Open the onboarding modal
      this.modalRef = this.modalService.open(OnboardOrgUserModalComponent, {
        modalClass: 'modal-lg',
        keyboard: false,
        ignoreBackdropClick: true,
        data: {
          organizationId: this.organizationId
        }
      });

      // Handle modal close - refresh list if user was successfully onboarded
      this.modalRef.onClose.subscribe((result: boolean) => {
        if (result) {
          console.log('User onboarded successfully');
          // Refresh the user profile list
          if (this.userProfileListComponent) {
            this.userProfileListComponent.onRefresh();
          }
        }
      });
    };
    return addAction;
  }

  /**
   * Get the add action handler for work queue list
   * Opens the create queue modal
   */
  protected getWorkQueueAddAction(): OnAddActionBehavior {
    const addAction = new OnAddActionBehavior();
    addAction.onAdd = (baseRoute: string, router: any) => {
      // Open the create queue modal
      this.queueModalRef = this.modalService.open(CreateQueueModalComponent, {
        modalClass: 'modal-lg',
        keyboard: false,
        ignoreBackdropClick: true,
        data: {
          organizationId: this.organizationId
        }
      });

      // Handle modal close - refresh list if queue was successfully created
      this.queueModalRef.onClose.subscribe((result: boolean) => {
        if (result) {
          console.log('Queue created successfully');
          // Refresh the work queue list
          if (this.workQueueListComponent) {
            this.workQueueListComponent.onRefresh();
          }
        }
      });
    };
    return addAction;
  }

  /**
   * Get the add action handler for team list
   * Opens the create team modal
   */
  protected getTeamAddAction(): OnAddActionBehavior {
    const addAction = new OnAddActionBehavior();
    addAction.onAdd = (baseRoute: string, router: any) => {
      // Open the create team modal
      this.teamModalRef = this.modalService.open(CreateTeamModalComponent, {
        modalClass: 'modal-lg',
        keyboard: false,
        ignoreBackdropClick: true,
        data: {
          organizationId: this.organizationId
        }
      });

      // Handle modal close - refresh list if team was successfully created
      this.teamModalRef.onClose.subscribe((result: boolean) => {
        if (result) {
          console.log('Team created successfully');
          // Refresh the team list
          if (this.teamListComponent) {
            this.teamListComponent.onRefresh();
          }
        }
      });
    };
    return addAction;
  }
}
