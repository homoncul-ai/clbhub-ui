import { HcclUserContextGETData, MenuControlData, MenuControlDataList, WorkItemFormContext, WorkItemFormRequest, WorkItemFormResponse, WorkQueueCriteria } from './../../../restsvc/hccl.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractMultimodeComponent } from '@app/components/_global/abstract-multimode/abstract-multimode.component';
import { WorkRequestItemCrudComponent } from './workrequestitem-crud.component';
import { SimpleMessage } from '@app/restsvc/common-request-service.model';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { FormsModule } from '@angular/forms';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { WorkRequestCrudWrapper } from '../workrequest/workrequest-crud.component';
import { JsonPipe } from '@angular/common';
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { Router } from '@angular/router';
import { ProviderWorkQueueListComponent } from '../workqueue/provider-workqueue-list.component';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';

@Component({
  selector: 'app-workrequestitem-enqueuerfi',
  standalone: true,
  imports: [ CommonModule, WorkRequestItemCrudComponent, SimpleMessagesSectionComponent, 
    FormsModule, MenuControlDataListComponent, JsonPipe, ProviderWorkQueueListComponent, StdMdbFormTextComponent ],
  templateUrl: './workrequestitem-enqueuerfi.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss'
})
export class WorkRequestItemEnqueueRFIComponent extends AbstractMultimodeComponent<WorkRequestCrudWrapper> implements OnInit  {
  
  // Properties referenced in template
  acceptText: string = '';
  availableQueues: any[] = [];

  // RFI is for enqueuing a new erquest.
  override async ngOnInit(): Promise<void> {
    console.log('WorkrequestUpdateComponent ngOnInit');
     //
    this.localModes = ['createItemView', 'createItemViewPost'];
    super.ngOnInit();
    this.enterMode('createItemView');
  }

  protected async loadEntityByIdCall(id: string): Promise<WorkRequestCrudWrapper> {
    return WorkRequestCrudWrapper.newInstance(id, this.hcclService);
  }

  protected workItemFormContext : WorkItemFormContext = {
    workRequestId: '',
    workRequestItemId: '',
    userProfileId: '',
    mapContextData: {},
    mapResultsData: {}
  };

  protected override async prepareModeEntry(entity: WorkRequestCrudWrapper, mode: string): Promise<void> {
    super.prepareModeEntry(entity, mode);
    console.log('WorkrequestUpdateComponent ngOnInit ' + this.entity.dump);
  // debugger;
     
    if (mode === 'createItemView') {
      // Create show a text area.
        await this.setupCreateItemView();
    } else if (mode === 'createItemViewPost') {
      // show a list of queues to reroute to.

    }
    return Promise.resolve();
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
    
    console.log('WorkrequestUpdateComponent ngOnInit ' + JSON.stringify(this.workItemFormContext));
    //debugger;
    var rsp  =  await this.hcclService.callWorkRequestUi(this.id, 'EnqueueRFI', request).toPromise();

    
    //debugger;
    var wirsp : WorkItemFormResponse = rsp as WorkItemFormResponse;
    console.log('WorkrequestUpdateComponent ngOnInit ' + JSON.stringify(rsp));
    this.menuQueues = wirsp.mapFormElements.menu_workqueues;
    this.workItemFormContext = wirsp.context as WorkItemFormContext;
  }

  protected menuQueues : MenuControlDataList = {
    menuItems: []
  };

  protected selectedWorkQueue : MenuControlData | null = null;

  protected queueId : string = '';
  onWorkQueueChange(selectedItem: MenuControlData | null): void {
    this.selectedWorkQueue = selectedItem;
   this.queueId = selectedItem?.id || '';
  }

  createItemViewPost() { 
    if (this.providerIds.length === 0) {
      alert('Please select at least one provider');
      return;
    }
    
    var request : WorkItemFormRequest = {
      op: 'createItemViewPost',
      context: this.workItemFormContext,
      actionFormData: {
        queueCode: this.queueId,
        comments: this.comments,
        providerQueueIds: this.providerIds
      }
    }
   var rsp  =   this.hcclService.callWorkRequestUi(this.id, 'EnqueueRFI', request).toPromise().then(rsp => {
    var wirsp : WorkItemFormResponse = rsp as WorkItemFormResponse;
    var wrid: string = wirsp.context?.workRequestItemId || '';
    var path : string[] = ['/ecoadmin-dashboard/workrequests', this.id, 'workRequestItem', wrid];
    //alert(this.modeName + ' ' + path.join('/'));
    this.router.navigate(path)
    this.enterMode('createItemViewPost'); 
   });
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
    o.parentId = this.id;
    o.tabId = 'catalogentry'; 
    //o.alertMessage = 'Modal to show catalog entry';
    o.doNotNavigate = true;
    return o;
  }


  protected comments: string = '';

  /**
   * Handle provider selection changes from the list component
   */
  onProviderSelectionChanged(selectedIds: string[]): void {
    this.providerIds = selectedIds;
    console.log('Provider selection changed:', selectedIds);
  }


}
