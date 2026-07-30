import { TeamMemberListComponent } from './../teammember/teammember-list.component';
// This template is for generating a GROUP component  
// This was generated using entityName = WorkRequest
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbModalService, MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { WorkRequestCrudWrapper, WorkRequestCrudComponent } from '@app/components/_crud/workrequest/workrequest-crud.component';
import { HcclService, HcclTeamLogCriteria, WorkItemDeliverableCriteria, WorkItemFormRequest, WorkRequestCriteria, WorkRequestItemCriteria, WorkRequestLogCriteria, WorkItemFormResponse } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { WorkrequestUpdateComponent } from "./workrequest-update.component";
import { WorkRequestListComponent } from './workrequest-list.component';
import { WorkRequestItemListComponent } from '../workrequestitem/workrequestitem-list.component';
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { WorkRequestItemCrudComponent, WorkRequestItemCrudWrapper } from '../workrequestitem/workrequestitem-crud.component';
import { WorkRequestItemEnqueueRFIComponent } from '../workrequestitem/workrequestitem-enqueuerfi.component';
import { WorkRequestItemAttachRFIContentAddEntriesComponent } from '../workrequestitem/workrequestitem-attachrficontent-addentries.component';
import { WorkRequestItemUpdateComponent } from '../workrequestitem/workrequestitem-update.component';
import { CatalogSearchResultCrudComponent } from "../catalogsearchresult/catalogsearchresult-crud.component";
import { HcclTeamLogListComponent } from '../hcclteamlog/hcclteamlog-list.component';
import { WorkRequestLogListComponent } from '../workrequestlog/workrequestlog-list.component';
import { WorkRequestRouteComponent } from './workrequest-route.component';
import { WorkRequestRouteTicketComponent } from './workrequest-route-ticket-modal.component';
import { WorkRequestAcceptModalComponent } from './workrequest-accept-modal.component';
import { WorkRequestItemCompleteModalComponent } from './workrequestitem-complete-modal.component';
import { SimpleButtonBar, SimpleButtonbarComponent } from '@app/components/_global/simple-buttonbar/simple-buttonbar.component';
import { ProviderRequestCrudComponent } from '../providerrequest/providerrequest-crud.component';
import { WorkItemDeliverableCrudComponent, WorkItemDeliverableCrudWrapper } from "../workitemdeliverable/workitemdeliverable-crud.component";
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { StdMdbEntitystateComponent } from '@app/components/_global/std-mdb-entitystate/std-mdb-entitystate.component';

@Component({
  selector: 'app-workrequest-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, WorkRequestCrudComponent, WorkrequestUpdateComponent,
    WorkRequestItemListComponent, WorkRequestItemUpdateComponent,
    WorkRequestLogListComponent, SimpleButtonbarComponent, ProviderRequestCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './workrequest-group.component.html',
})
export class WorkRequestGroupComponent extends AbstractEntityGroupComponent<WorkRequestCrudWrapper> implements OnInit {  

  // Inject modal service
  private modalService = inject(MdbModalService);
  private modalRef: MdbModalRef<any> | null = null;
  protected override cdr = inject(ChangeDetectorRef);

  constructor() {
    super();    
  } 
  protected newCrudWrapperForCreate(): WorkRequestCrudWrapper {
    return WorkRequestCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected workItemDeliverableId?: string = '';
  protected async loadEntityById(id: string): Promise<WorkRequestCrudWrapper> {
    var workRequest = await WorkRequestCrudWrapper.newInstance(id, this.hcclService);
    if (this.childId != null) {
      this.workRequestItem = await WorkRequestItemCrudWrapper.newInstance(this.childId || '', this.hcclService).then(async x => {
        this.workRequestItem = x;
        
        if (this.workRequestItem.getData().currentStateCode == 'completed') {
          const workitemdeliverablecriteria : WorkItemDeliverableCriteria = {
            pageNumber: 1,
            pageSize: 50,
            isPaging: true,
            workRequestItemId: this.childId || ''
          };
     //     alert("childId " + this.childId);
          WorkItemDeliverableCrudWrapper.newInstanceByCriteria(workitemdeliverablecriteria, this.hcclService).then(workitemdeliverable => {
            this.workItemDeliverableId = workitemdeliverable.getData().id;
       //     alert("workItemDeliverableId: " + this.workItemDeliverableId + " " + JSON.stringify(workitemdeliverable.getData()));
          });
        }
        
        return x;
      });
    }
   
    return workRequest;
  }

  protected override calculateTabIdFromUrl(tabId_in: string): string {
    let tabId = this.tabId;
    return tabId;
  }

  /**
   * Override the refresh method to handle WorkRequest-specific refresh logic
   */
  protected override refreshComponent(): void {
    // Reset WorkRequest-specific state
    this.workRequestItem = null;
    this.workItemDeliverableId = '';
    
    // Call parent refresh method
    super.refreshComponent();
    
    // Trigger change detection
    this.cdr.detectChanges();
  }


  protected workRequestItem: WorkRequestItemCrudWrapper | null = null;

  protected setupTabs(): SimpleTab[] {
    var tabs = this.setupListDetailsTabs();
    var baseRoute = this.getBaseRoute();
    var tab =  new SimpleTab('details-complete', 'More Details ...', '', 
      () => {
        //this.currentTabId = 'update';
        this.router.navigate([baseRoute, this.id, 'details-complete']);
       // alert("update");
      },
      () => {
        return this.entity !== null;
      }
    );
    tabs.push(tab) 

    tab =  new SimpleTab('update', 'Update', '', 
      () => {
        //this.currentTabId = 'update';
        this.router.navigate([baseRoute, this.id, 'update']);
       // alert("update");
      },
      () => {
        return this.entity !== null;
      }
    );
    //tabs.push(tab) 
    tab =  new SimpleTab('logs', 'Logs', '', 
      () => {
        this.router.navigate([baseRoute, this.id, 'logs']);
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
        this.router.navigate([baseRoute, this.id, 'items']);
        
      },
      () => {
        return this.entity !== null;
      }
    );
    tabs.push(tab) 
    
    tab =  new SimpleTab('workRequestItem', 'Item', '', 
      () => {
        this.router.navigate([baseRoute, this.id, 'workRequestItem', this.childId]);
        //this.currentTabId = 'workRequestItem';
        
      },
      () => {
        return this.childId !== null && this.childId !== undefined && this.childId !== '';
      }
    );
    tabs.push(tab)

    
    // var tabD: SimpleTab | undefined = this.findTabById(tabs, 'details');
    // if (tabD) {
    //   //alert('found tabD');
    //   tabD.label = this.entity?.getBusinessCode() || '';
    // }
    return tabs;
    return tabs;
  }

  override getDetailsTabLabel(): string {
    return this.entity?.getBusinessCode() || '';
  }
 
  get itemsCriteria(): WorkRequestItemCriteria {
    var criteria: WorkRequestItemCriteria = {
      workRequestId: this.id,
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    }
    return criteria;
  }

  myOnRowClickBehavior(): OnRowClickBehavior {
    var x: OnRowClickBehavior =  new OnRowClickBehavior();
    x.parentId = this.id;
    x.tabId = 'workRequestItem';
    //x.alertMessage = 'Catalog Entry';
    return x;
  }
   
  getWorkRequestItemActionCode(): string {
    return this.workRequestItem?.getData().actionCode || 'Error';
  }

  getLogsCriteria(): WorkRequestLogCriteria {
    var criteria: WorkRequestLogCriteria = {
      workRequestId: this.id || '',
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    }
    return criteria;
  }

  getWorkRequestActionsButtonBar(): SimpleButtonBar {
    var x: SimpleButtonBar = new SimpleButtonBar();
    
    // Route Work Request action - only show when ticket is not complete
    const routeAction = x.addButton('routeWorkRequest', 'Route Work Request', () => {
      this.openRouteTicketModal();
    });
    routeAction.showingButtonFunction = () => !this.isTicketComplete() && this.hasValidRoutingDestinations();
    
    // Add more actions as needed
    const acceptAction = x.addButton('acceptWorkRequest', 'Accept Work Request', () => {
      this.openAcceptModal();
    });
    acceptAction.showingButtonFunction = () => !this.isTicketAccepted();
    
    return x;
  }

  hasValidRoutingDestinations(): boolean {
    // Check if there are available work queues for routing
    const queues = this.hcclContextService.getContext().dashQueues || [];
    return queues.length > 0;
  }

  openAcceptModal(): void {
    const baseRoute = this.getBaseRoute();
    
    this.modalRef = this.modalService.open(WorkRequestAcceptModalComponent, {
      modalClass: 'modal-lg',
      data: {
        workRequestId: this.id,
        baseRoute: baseRoute
      }
    });
  }

  isTicketAccepted(): boolean {
    return this.entity?.isTicketAccepted() || false;
  }

  openRouteTicketModal(): void {
    const baseRoute = this.getBaseRoute();
    
    this.modalRef = this.modalService.open(WorkRequestRouteTicketComponent, {
      modalClass: 'modal-lg',
      data: {
        workRequestId: this.id,
        baseRoute: baseRoute
      }
    });
  }

  isTicketComplete(): boolean {
    // Check if ticket is in a completed state - you may need to adjust this based on your business logic
    const stateCode = this.entity?.getCurrentStateCode();
    return stateCode === 'completed' || stateCode === 'closed' || stateCode === 'finished';
  }

  onWorkRequestActionSelected(actionId: string): void {
    // Handle the selected action from the dropdown
    const buttonBar = this.getWorkRequestActionsButtonBar();
    const button = buttonBar.getButton(actionId);
    if (button) {
      button.activate(null);
    }
  }

  protected canChangeWorkItemStateToComplete(workRequestItem?: WorkRequestItemCrudWrapper | null): boolean {
    return workRequestItem?.getCurrentStateCode() === 'inprocess';
  }

  openCompleteWorkRequestItemModal(): void {
    const baseRoute = this.getBaseRoute();
    
    this.modalRef = this.modalService.open(WorkRequestItemCompleteModalComponent, {
      modalClass: 'modal-lg',
      data: {
        workRequestId: this.id,
        workRequestItemId: this.childId,
        baseRoute: baseRoute
      }
    });
  }

  changeWorRequestItemStateToComplete() {
    var request : WorkItemFormRequest = {
       op: 'completeWorkItem',
       context: undefined, //this.workRequestItem?.getWorkItemFormContext(),
       actionFormData: {
         someData: 'someData',
       }
     } 
    var actionCode = this.workRequestItem?.getActionCode() || '';
    var rsp  =   this.hcclService.callWorkRequestUi(this.id, actionCode, request).toPromise().then(rsp => {
     var wirsp : WorkItemFormResponse = rsp as WorkItemFormResponse;
     var wrid: string = wirsp.context?.workRequestItemId || '';
     this.closeModal();
    });
   }

  
} 