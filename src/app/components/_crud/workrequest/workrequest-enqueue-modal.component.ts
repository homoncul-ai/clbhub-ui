import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Router } from '@angular/router';
import { HcclService, HcclUserContextGETData, MenuControlData, MenuControlDataList, WorkItemFormContext, WorkItemFormRequest, WorkItemFormResponse, WorkQueueCriteria } from '@app/restsvc/hccl.service';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { WorkRequestItemEnqueueRFIComponent } from '../workrequestitem/workrequestitem-enqueuerfi.component';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { ProviderWorkQueueListComponent } from "../workqueue/provider-workqueue-list.component";
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';

@Component({
  selector: 'app-workrequest-enqueue-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, StdMdbFormTextComponent, MenuControlDataListComponent, WorkRequestItemEnqueueRFIComponent, SimpleMessagesSectionComponent, ProviderWorkQueueListComponent],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">
        <i class="fas fa-share me-2"></i>
        Enqueue RFI
      </h5>
      <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
    </div>
    
    <div class="modal-body">

    
    <!-- <app-workrequestitem-enqueuerfi [id]="workRequestId"></app-workrequestitem-enqueuerfi> -->
    <!-- <app-simple-messages-section [messagesList]="this.messages"></app-simple-messages-section> -->
 
    <h3>Send request to a provider </h3>

<!-- 
    <app-menu-control-data-list
              [menuControlDataList]="this.menuQueues || null"
              placeholder="Select work queue..."
              (selectionChange)="onWorkQueueChange($event)">
            </app-menu-control-data-list>

  -->
  <app-std-mdb-form-text 
  prefix="workRequest" 
  name="comments"
  label="Provider Instructions"
  [required]="true"
  [error]="false"
  [(ngModel)]="comments">
</app-std-mdb-form-text>

<app-provider-workqueue-list  [showingSearch]="true" [showingSearchHeading]="true" 
  [searchHeadingLabel]="'Choose Providers to Assist'"
  [criteria]="getCriteriaForProviders()"
  [showingGoButton]="false" [showingAddButton]="false" [showingIdCheckbox]="true" [hideInternalButtons]="true"
  [onRowClickBehavior]="onClickProviderRow()"
  (selectedIdsChanged)="onProviderSelectionChanged($event)"></app-provider-workqueue-list>


    </div>
    
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="closeModal()">
        Cancel
      </button>
      <button type="button" class="btn btn-success" (click)="onSubmit()" [disabled]="!isFormValid()">
        <i class="fas fa-share me-2"></i>
        Send to {{ providerIds.length }} Provider{{ providerIds.length !== 1 ? 's' : '' }}
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
    
    .requiredField {
      color: #dc3545;
      font-weight: bold;
    }
    
    .form-label {
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
    
    .btn-success {
      background-color: #198754;
      border-color: #198754;
    }
    
    .btn-success:hover {
      background-color: #157347;
      border-color: #146c43;
    }
    
    .btn-success:disabled {
      background-color: #6c757d;
      border-color: #6c757d;
      opacity: 0.65;
    }
  `]
})
export class WorkRequestEnqueueModalComponent implements OnInit {
  // Form data
  workRequestId: string = '';
  userProfileId: string = '';
  comments: string = '';
  queueId: string = '';
  
  // Menu data
  menuQueues: MenuControlDataList = {
    menuItems: []
  };
  
  // Work item form context
  workItemFormContext: WorkItemFormContext = {
    workRequestId: '',
    workRequestItemId: '',
    userProfileId: '',
    mapContextData: {},
    mapResultsData: {}
  };
  
  // Error handling
  error: any = null;
  
  // Inject services
  private hcclService = inject(HcclService);
  private hcclContextService = inject(HcclContextService);
  private router = inject(Router);
  
  // Modal reference
  constructor(public modalRef: MdbModalRef<WorkRequestEnqueueModalComponent>) {}
  
  ngOnInit(): void {
    // Get data from modal service if passed
    if (this.modalRef && (this.modalRef as any).data) {
      this.workRequestId = (this.modalRef as any).data.workRequestId || '';
      this.userProfileId = (this.modalRef as any).data.userProfileId || '';
    }
    
    // Initialize work item form context
    this.workItemFormContext.workRequestId = this.workRequestId;
    this.workItemFormContext.userProfileId = this.userProfileId;
    this.workItemFormContext.mapContextData = {};
    this.workItemFormContext.mapResultsData = {};
    
    // Load queue data
    this.loadQueueData();
  }
  
  /**
   * Load queue data from the service
   */
  private async loadQueueData(): Promise<void> {
    try {
      const request: WorkItemFormRequest = {
        op: 'createItemView',
        context: this.workItemFormContext,
        actionFormData: {}
      };
      
      const response = await this.hcclService.callWorkRequestUi(this.workRequestId, 'EnqueueRFI', request).toPromise();
      const workItemFormResponse: WorkItemFormResponse = response as WorkItemFormResponse;
      
      this.menuQueues = workItemFormResponse.mapFormElements.menu_workqueues;
      this.workItemFormContext = workItemFormResponse.context as WorkItemFormContext;
    } catch (error) {
      console.error('Error loading queue data:', error);
      this.error = error;
    }
  }
  
  /**
   * Handle work queue selection change
   */
  onWorkQueueChange(selectedItem: MenuControlData | null): void {
    this.queueId = selectedItem?.id || '';
  }
  
  /**
   * Handle provider selection changes from the list component
   */
  onProviderSelectionChanged(selectedIds: string[]): void {
    this.providerIds = selectedIds;
    console.log('Provider selection changed:', selectedIds);
  }

  /**
   * Check if form is valid
   */
  isFormValid(): boolean {
    return !!(this.comments && this.comments.trim().length > 0 && this.providerIds.length > 0);
  }
  
  /**
   * Handle form submission
   */
  async onSubmit(): Promise<void> {
    if (!this.isFormValid()) {
      return;
    }
    
    try {
      // collect the provider ids
      const request: WorkItemFormRequest = {
        op: 'createItemViewPost',
        context: this.workItemFormContext,
        actionFormData: {
          queueCode: this.queueId,
          comments: this.comments,
          providerQueueIds: this.providerIds
        }
      };
      
      const response = await this.hcclService.callWorkRequestUi(this.workRequestId, 'EnqueueRFI', request).toPromise();
      const workItemFormResponse: WorkItemFormResponse = response as WorkItemFormResponse;
      
      const workRequestItemId: string = workItemFormResponse.context?.workRequestItemId || '';
      this.closeModal();
    } catch (error) {
      console.error('Error enqueuing RFI:', error);
      this.error = error;
    }
  }
  
  /**
   * Close the modal
   */
  closeModal(): void {
    this.modalRef.close(false); // Pass false to indicate no refresh needed (user cancelled)
  }

  protected providerIds: string[] = [];
  getCriteriaForProviders(): WorkQueueCriteria {
    let idsToExclude : string[] = [];
    if (this.providerIds.length > 0) {
      idsToExclude = this.providerIds;
    }
    var criteria : WorkQueueCriteria = {
      //externalQueue: 1,
      pageNumber: 1,
      pageSize: 50,
      isPaging: true,
      idsToExclude: idsToExclude
    };
    return criteria;
  }

  onClickProviderRow(): OnRowClickBehavior {
    var o : OnRowClickBehavior = new OnRowClickBehavior();
    o.parentId = this.workRequestId;
    o.tabId = 'catalogentry'; 
    //o.alertMessage = 'Modal to show catalog entry';
    o.doNotNavigate = true;
    return o;
  }



}
