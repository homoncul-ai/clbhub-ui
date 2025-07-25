import { HcclUserContextGETData, MenuControlData, MenuControlDataList, WorkItemFormContext, WorkItemFormRequest, WorkItemFormResponse } from './../../../restsvc/hccl.service';
import { Component, OnInit } from '@angular/core';
import { AbstractMultimodeComponent } from '@app/components/_global/abstract-multimode/abstract-multimode.component';
import { WorkRequestItemCrudComponent } from './workrequestitem-crud.component';
import { SimpleMessage } from '@app/restsvc/common-request-service.model';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { FormsModule } from '@angular/forms';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { WorkRequestCrudWrapper } from '../workrequest/workrequest-crud.component';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-workrequestitem-enqueuerfi',
  imports: [ WorkRequestItemCrudComponent, SimpleMessagesSectionComponent, FormsModule, MenuControlDataListComponent, JsonPipe ],
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
    this.entity = await WorkRequestCrudWrapper.newInstance(this.id, this.hcclService);
    //
    this.localModes = ['createItemView', 'createItemViewPost'];
    super.ngOnInit();
    this.enterMode('createItemView');
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
    var request : WorkItemFormRequest = {
      op: 'createItemViewPost',
      context: this.workItemFormContext,
      actionFormData: {
        queueCode: this.queueId
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
}
