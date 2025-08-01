import { HcclUserContextGETData, MenuControlData, MenuControlDataList, WorkItemFormContext, WorkItemFormRequest, WorkItemFormResponse } from './../../../restsvc/hccl.service';
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
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { ProviderWorkQueueListComponent } from '../workqueue/provider-workqueue-list.component';

@Component({
  selector: 'app-workrequestitem-attachrficontent',
  standalone: true,
  imports: [ CommonModule, WorkRequestItemCrudComponent, SimpleMessagesSectionComponent, FormsModule, MenuControlDataListComponent, JsonPipe,
    StdMdbFormTextComponent
   ],
  templateUrl: './workrequestitem-attachrficontent.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss'
})
export class WorkRequestItemAttachRFIContentComponent extends AbstractMultimodeComponent<WorkRequestCrudWrapper> implements OnInit  {
  
  // Properties referenced in template
  acceptText: string = '';
  availableQueues: any[] = [];

  // RFI is for enqueuing a new erquest.
  override async ngOnInit(): Promise<void> {
    console.log('WorkRequestItemAttachRFIContentComponent ngOnInit');
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
    console.log('WorkRequestItemAttachRFIContentComponent ngOnInit ' + this.entity.dump);
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
  protected notes: string = '';
  protected menuCatalogs : MenuControlDataList = {
    menuItems: []
  };

  protected workItemFormResponse : WorkItemFormResponse | null = null;
  protected workItemFormRequest : WorkItemFormRequest | null = null;

  protected selectedWorkQueue : MenuControlData | null = null;

  protected catalogCode : string = '';
  onCatalogChange(selectedItem: MenuControlData | null): void {
    this.selectedWorkQueue = selectedItem;
   this.catalogCode = selectedItem?.id || '';
  }

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
    this.enterMode('createItemViewPost'); 
   });


  }

  
} 