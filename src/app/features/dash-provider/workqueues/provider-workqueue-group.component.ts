import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclUserProfileCrudWrapper } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { HcclUserContextGETData, WorkItemDeliverableCriteria, WorkQueueCriteria, WorkQueueGETData, WorkRequestCriteria, WorkRequestGETData, WorkRequestItemCriteria, WorkRequestItemGETData, WorkRequestLogCriteria } from '@app/restsvc/hccl.service';
import { HcclOrganizationCrudWrapper } from '@app/components/_crud/hcclorganization/hcclorganization-crud.component';
import { WorkRequestListComponent } from '@app/components/_crud/workrequest/workrequest-list.component';
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { HttpParams } from '@angular/common/http';
import { WorkRequestCrudComponent } from '@app/components/_crud/workrequest/workrequest-crud.component';
import { WorkrequestUpdateComponent } from '@app/components/_crud/workrequest/workrequest-update.component';
import { ProviderRequestCrudComponent } from '@app/components/_crud/providerrequest/providerrequest-crud.component';
import { WorkRequestItemListComponent } from '@app/components/_crud/workrequestitem/workrequestitem-list.component';
import { WorkRequestItemCrudComponent, WorkRequestItemCrudWrapper } from '@app/components/_crud/workrequestitem/workrequestitem-crud.component';
import { WorkItemDeliverableCrudComponent, WorkItemDeliverableCrudWrapper } from '@app/components/_crud/workitemdeliverable/workitemdeliverable-crud.component';
import { StdMdbEntitystateComponent } from '@app/components/_global/std-mdb-entitystate/std-mdb-entitystate.component';
import { WorkRequestItemAttachRFIContentAddEntriesComponent } from '@app/components/_crud/workrequestitem/workrequestitem-attachrficontent-addentries.component';
import { WorkRequestItemEnqueueRFIComponent } from '@app/components/_crud/workrequestitem/workrequestitem-enqueuerfi.component';
import { WorkRequestLogListComponent } from '@app/components/_crud/workrequestlog/workrequestlog-list.component';

@Component({
  selector: 'app-provider-workqueue-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, 
    WorkRequestListComponent, WorkRequestCrudComponent, WorkrequestUpdateComponent,
    ProviderRequestCrudComponent, WorkRequestItemListComponent, 
    WorkRequestItemCrudComponent , WorkItemDeliverableCrudComponent, StdMdbEntitystateComponent, 
    WorkRequestItemAttachRFIContentAddEntriesComponent, WorkRequestItemEnqueueRFIComponent, WorkRequestLogListComponent],
  templateUrl: './provider-workqueue-group.component.html',
  styleUrl: './provider-workqueue-group.component.scss'
})
export class ProviderWorkqueueGroupComponent extends AbstractEntityGroupComponent<HcclUserProfileCrudWrapper> implements OnInit {

  @Input() queueId: string = '';
    @Input() ticketId: string = '';
    @Input() workRequestItemId: string = '';
  override ngOnInit(): void {
    // For singleton behavior, always use current user profile ID
    this.hcclContextService.refreshContext().subscribe(context => {
      this.defaultId = context.currentUserProfileId || '';
      
      this.id = this.defaultId;
      this.organizationId = context.currentUserProfile.organizationId || '';
      // Call parent ngOnInit after setting the ID
      super.ngOnInit();
    });
  }
  protected override calculateTabIdFromUrl(tabId_in: string): string {

    let tabId = tabId_in;
    tabId = this.tabId;
   
    return tabId;
  }

  protected override populateFromParams(params: any): void {
    super.populateFromParams(params);
    this.queueId = params['queueId'];
    this.ticketId = params['ticketId'];
    this.workRequestItemId = params['workRequestItemId'];
    //alert('queueId: ' + this.queueId + ' ticketId: ' + this.ticketId);
  }
  protected defaultId: string = '';
  protected override getDefaultId(): string {
    return this.defaultId;
  }

  protected newCrudWrapperForCreate(): HcclUserProfileCrudWrapper {
    return HcclUserProfileCrudWrapper.newInstanceForCreate(this.hcclService);
  }


  protected workQueues: WorkQueueGETData[] = [];
  protected getWorkQueues(): WorkQueueGETData[] {
    return this.workQueues;
  }

  protected queue: WorkQueueGETData | undefined;
  protected getQueue(): WorkQueueGETData | undefined {
    return this.queue;
  }
  protected ticket: WorkRequestGETData | undefined;
  protected getTicket(): WorkRequestGETData | undefined {
    return this.ticket;
  }
  protected workRequestItem: WorkRequestItemCrudWrapper | undefined;
  protected getWorkRequestItem(): WorkRequestItemCrudWrapper | undefined {
    return this.workRequestItem;
  } 
  protected workItemDeliverableId: string = '';
  protected workItemDeliverable: WorkItemDeliverableCrudWrapper | undefined;
  protected getWorkItemDeliverable(): WorkItemDeliverableCrudWrapper | undefined {
    return this.workItemDeliverable;
  }
  protected getWorkItemDeliverableId(): string {
    return this.workItemDeliverableId;
  }
  protected async loadEntityById(id: string): Promise<HcclUserProfileCrudWrapper> { 
    let workQueueCriteria : WorkQueueCriteria = {
      organizationId: this.organizationId,
      externalQueue: 1,
      includingStats: true,
      pageNumber: 1,
      pageSize: 2,
      isPaging: true
    };
    if (this.queueId != null && this.queueId != '') {
        workQueueCriteria.ids = [this.queueId];
    }

    const workQueueRsp = await this.hcclService.findWorkQueues(workQueueCriteria).toPromise();
    this. workQueues = workQueueRsp?.searchResults as WorkQueueGETData[] || [];
    if (this.workQueues.length > 0) {
        this.queue = this.workQueues[0];
        this.queueId = this.queue?.id || '--none--';
    }
    
    if (this.ticketId != null && this.ticketId != '') {
        const tiketRsp = await this.hcclService.getWorkRequestById(this.ticketId).toPromise();
        this.ticket = tiketRsp as WorkRequestGETData;
        this.ticketId = this.ticket?.id || '--none--';
    }

    if (this.workRequestItemId != null && this.workRequestItemId != '') {
      const tiketItemRsp = await WorkRequestItemCrudWrapper.newInstance(this.workRequestItemId, this.hcclService);//.loadEntityById(this.ticketItemId).toPromise();
      this.workRequestItem = tiketItemRsp as WorkRequestItemCrudWrapper;
      this.workRequestItemId = this.workRequestItem?.getId() || '--none--';
      //alert('workRequestItemId: ' + this.workRequestItemId);
      if (this.workRequestItem.getData().currentStateCode == 'completed') {
        const workitemdeliverablecriteria : WorkItemDeliverableCriteria = {
          pageNumber: 1,
          pageSize: 50,
          isPaging: true,
          workRequestItemId: this.childId || ''
        };
   //     alert("childId " + this.childId);
         WorkItemDeliverableCrudWrapper.newInstanceByCriteria(workitemdeliverablecriteria, this.hcclService).then(workitemdeliverable => {
          this.workItemDeliverable = workitemdeliverable;
          this.workItemDeliverableId = workitemdeliverable.getData().id || '';
     //     alert("workItemDeliverableId: " + this.workItemDeliverableId + " " + JSON.stringify(workitemdeliverable.getData()));
        });
      }
  }
    //alert('ticketId: ' + this.ticketId + ' ticket: ' + this.getTicket()?.name);
    return HcclUserProfileCrudWrapper.newInstance(id, this.hcclService);
  }

  protected getTicketId(): string {
    return this.ticketId;
  }

  protected organizationId : string = '';
  protected getOrganizationId(): string {
    return this.organizationId;  
  }

  protected setupTabs(): SimpleTab[] {
    const baseRoute = this.getBaseRoute();
    var tabs: SimpleTab[] = [
      new SimpleTab('queue', 'Queue: ' + this.getQueue()?.name, '', 
        () => {
          this.router.navigate([baseRoute]);
        },
        () => {
          return true;
        }
      )];

      if (this.ticketId != null && this.ticketId != '') {
        tabs.push(new SimpleTab('ticket', '' + this.getTicket()?.businessCode, '', 
          () => {
            this.router.navigate([baseRoute, this.getTicketId()]);
          },
          () => {
            return true;
          }
        ));
      }
    //tabs.push(tab) 
    var tab: SimpleTab =  new SimpleTab('logs', 'Logs X', '', 
      () => {
         var path =   ['/provider-dashboard', 'workqueues', this.queueId, this.ticketId, 'logs'];
         this.router.navigate(path);
        //this.router.navigate([baseRoute, this.ticketId, 'logs']);
        //this.currentTabId = 'workRequestItem';
        
      },
      () => {
        return true;
      }
    );
    tabs.push(tab)

     tab =  new SimpleTab('items', 'Items', '', 
      () => {
        //this.currentTabId = 'items';
        var path =   ['/provider-dashboard', 'workqueues', this.queueId, this.ticketId, 'items'];
        this.router.navigate(path);
        
      },
      () => {
        return this.entity !== null;
      }
    );
    tabs.push(tab) 
    
    tab =  new SimpleTab('workRequestItem', 'Item', '', 
      () => {
        var path =   ['/provider-dashboard', 'workqueues', this.queueId, this.ticketId, 'workRequestItem', this.workRequestItemId];
        this.router.navigate(path);
        //this.currentTabId = 'workRequestItem';
        
      },
      () => {
        return this.workRequestItemId !== null && this.workRequestItemId !== undefined && this.workRequestItemId !== '';
      }
    );
    tabs.push(tab)
   
    return tabs;
  }

  protected override getDefaultTabId(): string {
    return 'queue';
  }

  protected getQueueById(id: string): WorkQueueGETData | undefined {
    return this.workQueues.find(queue => queue.id === id);
  }


  onClickWorkRequestRow(): OnRowClickBehavior {
    var x: OnRowClickBehavior =  new OnRowClickBehavior();
    //x.alertMessage = 'Ticket';
    x.usingNavigateUrl = true;
    x.getNavigateUrl = (id: string) => {
      return ['/provider-dashboard', 'workqueues', this.queueId, id];
    };
    //x.alertMessage = 'Catalog Entry';
    return x;
  }
 

  protected getWorkRequestCriteriaForMyTickets(): WorkRequestCriteria {
    return {
      acceptedByUserId: this.hcclContextService.getCurrentUserProfile().id || ''
    };
  }


  protected getWorkRequestCriteriaForQueue(): WorkRequestCriteria {
    return {
      workQueueId: this.queueId || '',
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }
  protected getTicketItemsCriteria(): WorkRequestItemCriteria {
    return {
      workRequestId: this.ticketId || '',
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }
  protected myOnWorkRequestItemRowClickBehavior(): OnRowClickBehavior {
    var x: OnRowClickBehavior =  new OnRowClickBehavior();
    x.usingNavigateUrl = true;
    x.getNavigateUrl = (id: string) => {
      return ['/provider-dashboard', 'workqueues', this.queueId, this.ticketId, 'workRequestItem', id];
    };
    return x;
  }
  protected getLogsCriteria(): WorkRequestLogCriteria {
    return {
      workRequestId: this.ticketId || '',
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }
}
