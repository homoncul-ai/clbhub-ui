import { Component, OnInit, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { WorkRequestItemCrudWrapper } from './workrequestitem-crud.component';
import { WorkRequestCrudWrapper } from '../workrequest/workrequest-crud.component';
import { SimpleMessage } from '@app/restsvc/common-request-service.model';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { CatalogEntryListComponent } from "../catalogentry/catalogentry-list.component";
import { CatalogSearchResultEntryListComponent } from '../catalogsearchresultentry/catalogsearchresultentry-list.component';
import { CatalogSearchResultCrudComponent } from '../catalogsearchresult/catalogsearchresult-crud.component';
import { AbstractListComponent, OnGoClickActionBehavior, OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { CatalogEntryCriteria, CatalogSearchResultEntryCriteria, CatalogSearchResultGETData, WorkItemFormContext, WorkItemFormRequest, WorkItemFormResponse, HcclService, HcclUserContextGETData, MenuControlData, MenuControlDataList } from './../../../restsvc/hccl.service';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { SimpleButton, SimpleButtonBar } from '@app/components/_global/simple-buttonbar/simple-buttonbar.component';

@Component({
  selector: 'app-workrequestitem-attachrficontent-modal',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    CatalogEntryListComponent
  ],
  templateUrl: './workrequestitem-attachrficontent-modal.component.html',
  styleUrl: './workrequestitem-attachrficontent-modal.component.scss'
})
export class WorkRequestItemAttachRFIContentModalComponent implements OnInit {
  workRequestItem: WorkRequestItemCrudWrapper | null = null;
  workRequestId: string = '';
  
  // Injected services
  private hcclService = inject(HcclService);
  private hcclContextService = inject(HcclContextService);
  private router = inject(Router);
  
  constructor(
    public modalRef: MdbModalRef<WorkRequestItemAttachRFIContentModalComponent>
  ) {}
  
  // Properties referenced in template
  acceptText: string = '';
  availableQueues: any[] = [];
  loading: boolean = false;
  currentMode: string = 'createItemView';
  messages: SimpleMessage[] = [];

  protected workRequestItemEntity: WorkRequestItemCrudWrapper | null = null;
  protected workRequestEntity: WorkRequestCrudWrapper | null = null;
  
  // RFI is for enqueuing a new request.
  async ngOnInit(): Promise<void> {
    this.loading = true;
    
    // Get data from modal service
    if (this.modalRef && (this.modalRef as any).data) {
      this.workRequestItem = (this.modalRef as any).data.workRequestItem;
      this.workRequestId = (this.modalRef as any).data.workRequestId;
    }
    
    if (this.workRequestItem) {
      this.workRequestItemEntity = this.workRequestItem;
    }
    
    if (this.workRequestId) {
      this.workRequestEntity = await WorkRequestCrudWrapper.newInstance(this.workRequestId, this.hcclService);
    }

    var x : HcclUserContextGETData = this.hcclContextService.getContext();

    if (this.workItemFormContext.workRequestId === '') {
      this.workItemFormContext.workRequestId = this.workRequestId;
      this.workItemFormContext.workRequestItemId = this.workRequestItem?.getData()?.id || '';
      this.workItemFormContext.userProfileId = x.currentUserProfileId
      this.workItemFormContext.mapContextData = {};
      this.workItemFormContext.mapResultsData = {};
    }
    
    this.loading = false;
    this.localModes = ['createItemView', 'createItemViewPost'];
    this.enterMode('createItemView');
  }

  protected workItemFormContext : WorkItemFormContext = {
    workRequestId: '',
    workRequestItemId: '',
    userProfileId: '',
    mapContextData: {},
    mapResultsData: {}
  };

  protected async prepareModeEntry(entity: WorkRequestCrudWrapper, mode: string): Promise<void> {
    if (mode === 'createItemView') {
      // Create show a text area.
        await this.setupCreateItemView();
    } else if (mode === 'createItemViewPost') {
      // show a list of queues to reroute to.
    }
    return Promise.resolve();
  }

  protected async setupCreateItemView() {
    var request : WorkItemFormRequest = {
      op: 'createItemView',
      context: this.workItemFormContext,
      actionFormData: {}
    }
    this.workItemFormRequest = request;
    
    var rsp  =  await this.hcclService.callWorkRequestUi(this.workRequestId, 'AttachRFIContent', request).toPromise();

    var wirsp : WorkItemFormResponse = rsp as WorkItemFormResponse;
    this.workItemFormResponse = wirsp;
    this.menuCatalogs = wirsp.mapFormElements.menu_catalogs;
    this.catalogSearchResult = wirsp.mapFormElements.catalogSearchResult;
    this.catalogEntriesIdsToExclude = this.catalogSearchResult?.entries?.map
      (entry => entry.catalogEntryId).filter((id): id is string => id !== undefined) || [];
    this.workItemFormContext = wirsp.context as WorkItemFormContext;
  }

  protected notes: string = '';
  protected menuCatalogs : MenuControlDataList = {
    menuItems: []
  };

  protected workItemFormResponse : WorkItemFormResponse | null = null;
  protected workItemFormRequest : WorkItemFormRequest | null = null;
  protected catalogSearchResult : CatalogSearchResultGETData | null = null;
  protected catalogEntriesIdsToExclude: string[] = [];
  protected selectedWorkQueue : MenuControlData | null = null;
  protected catalogCode : string = '';
  protected localModes: string[] = [];

  onCatalogChange(selectedItem: MenuControlData | null): void {
    this.selectedWorkQueue = selectedItem;
    this.catalogCode = selectedItem?.id || '';
  }

  getCriteriaForEntries(): CatalogSearchResultEntryCriteria {
    return {
      catalogSearchResultId: this.catalogSearchResult?.id || ''
    }
  }   

  getCriteriaForSearch(): CatalogEntryCriteria {
    return {
      catalogId: this.catalogSearchResult?.catalogId || '',
      idsToExclude: this.catalogEntriesIdsToExclude
    }
  } 

  clickRowToShowEntry(): OnRowClickBehavior {
    var o : OnRowClickBehavior = new OnRowClickBehavior();
    o.parentId = this.workRequestId;
    o.tabId = 'catalogentry'; 
    o.alertMessage = 'Modal to show catalog entry';
    o.doNotNavigate = true;
    return o;
  }

  getCatalogCode(): string {
    return this.catalogCode;
  }

  getOnGoRemoveCatalogEntriesToRFI(): OnGoClickActionBehavior {
    var o : OnGoClickActionBehavior = new OnGoClickActionBehavior();
    o.onGoClick = async (entityIds: string[], baseRoute: string, router: Router) => {
      this.removeItemsFromRFI(entityIds);
    }
    o.alertMessage = 'Go with entity ids:';
    return o;
  }

  removeItemsFromRFI(entityIds: string[]) { 
    var request : WorkItemFormRequest = {
      op: 'contentRemoveItems',
      context: this.workItemFormContext,
      actionFormData: {
        searchResultsCatalogEntryIds: entityIds,
      }
    }
    var rsp  =   this.hcclService.callWorkRequestUi(this.workRequestId, 'AttachRFIContent', request).toPromise().then(rsp => {
      var wirsp : WorkItemFormResponse = rsp as WorkItemFormResponse;
      var wrid: string = wirsp.context?.workRequestItemId || '';
      var path : string[] = ['/ecoadmin-dashboard/workrequests', this.workRequestId, 'workRequestItem', wrid ];
      AbstractListComponent.routeToPath(this.router, path);
    });
  }

  getOnGoAddCatalogEntriesToRFI(): OnGoClickActionBehavior {
    var o : OnGoClickActionBehavior = new OnGoClickActionBehavior();
    o.onGoClick = async (entityIds: string[], baseRoute: string, router: Router) => {
      this.addItemsToRFI(entityIds);
    }
    o.onButtonClick = async (id: string, entityIds: string[], button: SimpleButton) => {
     // alert('onButtonClick ' + id + ' ' + entityIds.join(','));
      if (id === 'add') {
        this.addItemsToRFI(entityIds);
      } else if (id === 'cancel') {
        this.closeModal();
      }
    }
    //o.alertMessage = 'Go with access ids:';
    return o;
  }

  addItemsToRFI(entityIds: string[]) { 
    var request : WorkItemFormRequest = {
      op: 'contentAddPost',
      context: this.workItemFormContext,
      actionFormData: {
        catalogEntryIds: entityIds,
      }
    } 
    var rsp  =   this.hcclService.callWorkRequestUi(this.workRequestId, 'AttachRFIContent', request).toPromise().then(rsp => {
      var wirsp : WorkItemFormResponse = rsp as WorkItemFormResponse;
      var wrid: string = wirsp.context?.workRequestItemId || '';
      //var path : string[] = ['/ecoadmin-dashboard/workrequests', this.workRequestId, 'workRequestItem', wrid ];
     // AbstractListComponent.routeToPath(this.router, path);
     this.modalRef.close(true); // Pass true to indicate refresh is needed
    });
  }

  getCatalogEntryOtherData(): any {
    return {
      catalogCode: "Bambi"
    }
  }

  isWorkRequestItemInProcess(): boolean {
    return this.workRequestItemEntity?.getCurrentStateCode() === 'inprocess';
  }

  isWorkRequestItemComplete(): boolean {
    return this.workRequestItemEntity?.getCurrentStateCode() === 'complete';
  }

  changeWorRequestItemStateToComplete() {
    var request : WorkItemFormRequest = {
      op: 'completeWorkItem',
      context: this.workItemFormContext,
      actionFormData: {
        someData: 'someData',
      }
    } 
    var rsp  =   this.hcclService.callWorkRequestUi(this.workRequestId, 'AttachRFIContent', request).toPromise().then(rsp => {
      var wirsp : WorkItemFormResponse = rsp as WorkItemFormResponse;
      var wrid: string = wirsp.context?.workRequestItemId || '';
      var path : string[] = ['/ecoadmin-dashboard/workrequests', this.workRequestId, 'workRequestItem', wrid ];
      AbstractListComponent.routeToPath(this.router, path);
    });
  }

  closeModal() {
    // var wrid: string = this.workRequestItemEntity?.getData()?.id || '';
    // var path : string[] = ['/ecoadmin-dashboard/workrequests', this.workRequestId, 'workRequestItem', wrid ];
    //   AbstractListComponent.routeToPath(this.router, path);
      //this.closeModal();

      // how do we handle this?
      this.modalRef.close(true); // Pass true to indicate refresh is needed
  }

  isLoading(): boolean {
    return this.loading;
  }

  enterMode(mode: string) {
    this.currentMode = mode;
  }

  getSelectedActionsButtonBar(): SimpleButtonBar {
    var b : SimpleButtonBar = new SimpleButtonBar();
    b.addButton('add', 'Add Selected Items');
    b.addButton('cancel', 'Cancel');
    return b; 
  }

  
}
