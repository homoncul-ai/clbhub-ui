import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Router } from '@angular/router';
import { HcclService, HcclUserContextGETData, MenuControlData, MenuControlDataList, WorkItemFormContext, WorkItemFormRequest, WorkItemFormResponse } from '@app/restsvc/hccl.service';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { WorkRequestItemAttachRFIContentComponent } from '../workrequestitem/workrequestitem-attachrficontent.component';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { SimpleMessage, SimpleMessageList } from '@app/restsvc/common-request-service.model';
import { WorkRequestCrudWrapper } from './workrequest-crud.component';

@Component({
  selector: 'app-workrequest-attach-content-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, StdMdbFormTextComponent, MenuControlDataListComponent, 
    WorkRequestItemAttachRFIContentComponent, SimpleMessagesSectionComponent],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">
        <i class="fas fa-paperclip me-2"></i>
        Attach RFI Content
      </h5>
      <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
    </div>
    
    <div class="modal-body">
    
    <!-- <app-simple-messages-section [messagesList]="this.messages"></app-simple-messages-section> -->

<div *ngIf="!isLoading()">

    <h3>Select Catalog and Attach Entries  </h3>
    <app-std-mdb-form-text 
    prefix="workRequest" 
    name="speaker_notes"
    label="Notes"
    [required]="true"
    [error]="false"
    [(ngModel)]="notes">
  </app-std-mdb-form-text>

    <app-menu-control-data-list
              [menuControlDataList]="this.menuCatalogs || null"
              placeholder="Select catalog..."
              (selectionChange)="onCatalogChange($event)">
            </app-menu-control-data-list>
    
</div>

    </div>
    
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="closeModal()">
        Cancel
      </button>
      <button type="button" class="btn btn-success" (click)="onSubmit()" [disabled]="!isFormValid()">
        <i class="fas fa-paperclip me-2"></i>
        Attach RFI Content
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
export class WorkRequestAttachContentModalComponent implements OnInit {
  // Form data
  workRequestId: string = '';
  userProfileId: string = '';
  notes: string = '';
  catalogCode: string = '';
  
  // Menu data
  menuCatalogs: MenuControlDataList = {
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
  constructor(public modalRef: MdbModalRef<WorkRequestAttachContentModalComponent>) {}
  
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
    
    // Load catalog data
    this.loadCatalogData();
  }
  
  /**
   * Load catalog data from the service
   */
  private async loadCatalogData(): Promise<void> {
    try {
      const request: WorkItemFormRequest = {
        op: 'createItemView',
        context: this.workItemFormContext,
        actionFormData: {}
      };
      
      const response = await this.hcclService.callWorkRequestUi(this.workRequestId, 'AttachRFIContent', request).toPromise();
      const workItemFormResponse: WorkItemFormResponse = response as WorkItemFormResponse;
      
      this.menuCatalogs = workItemFormResponse.mapFormElements.menu_catalogs;
      this.workItemFormContext = workItemFormResponse.context as WorkItemFormContext;
    } catch (error) {
      console.error('Error loading catalog data:', error);
      this.error = error;
    }
  }
  
  /**
   * Handle catalog selection change
   */
  onCatalogChange(selectedItem: MenuControlData | null): void {
    this.catalogCode = selectedItem?.id || '';
  }
  
  /**
   * Check if form is valid
   */
  isFormValid(): boolean {
    return !!(this.catalogCode && this.notes && this.notes.trim().length > 0);
  }
  
  /**
   * Handle form submission
   */
  async onSubmit(): Promise<void> {
    if (!this.isFormValid()) {
      return;
    }
    
    try {
      const request: WorkItemFormRequest = {
        op: 'createItemViewPost',
        context: this.workItemFormContext,
        actionFormData: {
          catalogCode: this.catalogCode,
          notes: this.notes
        }
      };
      
      const response = await this.hcclService.callWorkRequestUi(this.workRequestId, 'AttachRFIContent', request).toPromise();
      const workItemFormResponse: WorkItemFormResponse = response as WorkItemFormResponse;
      
      const workRequestItemId: string = workItemFormResponse.context?.workRequestItemId || '';
//      const path: string[] = ['/ecoadmin-dashboard/workrequests', this.workRequestId, 'workRequestItem', workRequestItemId];
      
      // Close modal and navigate
      this.closeModal();
  //    this.router.navigate(path);
    } catch (error) {
      console.error('Error attaching RFI content:', error);
      this.error = error;
    }
  }
  
  /**
   * Close the modal
   */
  closeModal(): void {
    this.modalRef.close();
  }
  protected messages: SimpleMessage[] = [];
  protected loading: boolean = false;
  protected isLoading(): boolean {
    return this.loading;
  } 

  protected async loadEntityByIdCall(id: string): Promise<WorkRequestCrudWrapper> {
    return WorkRequestCrudWrapper.newInstance(id, this.hcclService);
  }
 
  protected async setupCreateItemView() {
    var x : HcclUserContextGETData = this.hcclContextService.getContext();

    if (this.workItemFormContext.workRequestId === '') {
      this.workItemFormContext.workRequestId = this.id;
      this.workItemFormContext.workRequestItemId = undefined;
      this.workItemFormContext.userProfileId = x.currentUserProfileId
      this.workItemFormContext.mapContextData = {};
      this.workItemFormContext.mapResultsData = {};
    }
    
     
    var request : WorkItemFormRequest = {
      op: 'createItemView',
      context: this.workItemFormContext,
      actionFormData: {}
    }
    this.workItemFormRequest = request;
    
    console.log('WorkRequestItemAttachRFIContentComponent ngOnInit ' + JSON.stringify(this.workItemFormContext));
    //debugger;
    var rsp  =  await this.hcclService.callWorkRequestUi(this.id, 'AttachRFIContent', request).toPromise();

    
    var wirsp : WorkItemFormResponse = rsp as WorkItemFormResponse;
    this.workItemFormResponse = wirsp;
    console.log('WorkRequestItemAttachRFIContentComponent ngOnInit ' + JSON.stringify(rsp));
    this.menuCatalogs = wirsp.mapFormElements.menu_catalogs;
    this.workItemFormContext = wirsp.context as WorkItemFormContext;
  } 

  protected workItemFormResponse : WorkItemFormResponse | null = null;
  protected workItemFormRequest : WorkItemFormRequest | null = null;

  protected selectedWorkQueue : MenuControlData | null = null;
 
  protected id: string = '';
  protected messagesList: SimpleMessage[] = [];

  createItemViewPost() { 
    var request : WorkItemFormRequest = {
      op: 'createItemViewPost',
      context: this.workItemFormContext,
      actionFormData: {
        catalogCode: this.catalogCode,
        notes: this.notes
      }
    }
   var rsp  =   this.hcclService.callWorkRequestUi(this.id, 'AttachRFIContent', request).toPromise().then(rsp => {
    var wirsp : WorkItemFormResponse = rsp as WorkItemFormResponse;
    var wrid: string = wirsp.context?.workRequestItemId || '';
    var path : string[] = ['/ecoadmin-dashboard/workrequests', this.id, 'workRequestItem', wrid];
    //alert(this.modeName + ' ' + path.join('/'));
    this.router.navigate(path)
    //this.enterMode('createItemViewPost'); 
   });


  }

}
