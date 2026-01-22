import { TeamMemberListComponent } from './../teammember/teammember-list.component';
// This template is for generating a GROUP UI component  
// This was generated using entityName = WorkRequest
// Generate the new [entityName]-group-ui.component.ts   files using this template 

import { Component, Input, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbModalService, MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { WorkRequestCrudWrapper, WorkRequestCrudComponent } from '@app/components/_crud/workrequest/workrequest-crud.component';
import { HcclService, HcclTeamLogCriteria, WorkItemDeliverableCriteria, WorkItemFormRequest, WorkRequestCriteria, WorkRequestItemCriteria, WorkRequestLogCriteria, WorkItemFormResponse, WorkRequestUIControllerGETData, MenuControlDataList, WorkRequestGETData, WorkRequestDeliverableGETData, HcclUserProfileCriteria, HcclUserProfileGETData } from '@app/restsvc/hccl.service';
import { SimpleMessage, SimpleMessageList } from '@app/restsvc/common-request-service.model';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { WorkrequestUpdateComponent } from "./workrequest-update.component";
import { WorkRequestListComponent } from './workrequest-list.component';
import { WorkRequestItemListComponent } from '../workrequestitem/workrequestitem-list.component';
import { OnFinishLoadingBehavior, OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { Subscription } from 'rxjs';
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
import { WorkRequestAttachContentModalComponent } from './workrequest-attach-content-modal.component';
import { WorkRequestEnqueueModalComponent } from './workrequest-enqueue-modal.component';
import { WorkRequestItemCompleteModalComponent } from './workrequestitem-complete-modal.component';
import { SimpleButtonBar, SimpleButtonbarComponent } from '@app/components/_global/simple-buttonbar/simple-buttonbar.component';
import { ProviderRequestCrudComponent } from '../providerrequest/providerrequest-crud.component';
import { WorkItemDeliverableCrudComponent, WorkItemDeliverableCrudWrapper } from "../workitemdeliverable/workitemdeliverable-crud.component";
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { StdMdbEntitystateComponent } from '@app/components/_global/std-mdb-entitystate/std-mdb-entitystate.component';
import { CatalogEntryInterestCrudComponent } from '../catalogentryinterest/catalogentryinterest-crud.component';
import { StdEntitySectionComponent } from '@app/components/_global/std-entity-section/std-entity-section.component';
import { WorkRequestDeliverableUiComponent } from '../workrequestdeliverable-ui/workrequestdeliverable-ui.component';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { PMessageUiComponent } from '../pmessage-ui/pmessage-ui.component';

@Component({
  selector: 'app-workrequest-group-ui',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, WorkRequestCrudComponent, WorkrequestUpdateComponent,
    WorkRequestItemListComponent, WorkRequestItemCrudComponent,
      WorkRequestItemAttachRFIContentAddEntriesComponent, WorkRequestItemUpdateComponent,
      WorkRequestLogListComponent, 
    SimpleButtonbarComponent, StdEntitySectionComponent, WorkItemDeliverableCrudComponent,
     StdMdbEntitystateComponent, WorkRequestDeliverableUiComponent, MdbAccordionModule, PMessageUiComponent ],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './workrequest-group-ui.component.html',
})
export class WorkRequestGroupUIComponent extends AbstractEntityGroupComponent<WorkRequestCrudWrapper> implements OnInit, OnDestroy {  

  // Inject modal service
  private modalService = inject(MdbModalService);
  private modalRef: MdbModalRef<any> | null = null;
  protected override cdr = inject(ChangeDetectorRef);
   
  // Cache the button bar to prevent recreation on every change detection
  private _buttonBar: SimpleButtonBar | null = null;
  
  // Subscription management for modal close events
  private subscriptions: Subscription[] = [];

  // Accordion state management - track which accordion is currently open
  protected accordionId: string = 'clientMessages';
  
  constructor() {
    super();    
  }

  ngOnDestroy(): void {
    // Clean up all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
    
    // Clear button bar cache
    this._buttonBar = null;
    
    // Close any open modals
    if (this.modalRef) {
      this.modalRef.close();
    }
  } 
  protected newCrudWrapperForCreate(): WorkRequestCrudWrapper {
    return WorkRequestCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected workRequestUIController?: WorkRequestUIControllerGETData | null = null;

  protected canUpdateWorkRequest(): boolean {
    return !this.isClientView()  && this.isWorkRequestOpen();
  }
  protected getDeliverable(): WorkRequestDeliverableGETData | undefined {
    return this.workRequestUIController?.deliverable || undefined;
  }
  protected isShowingDeliverable(): boolean {
    return this.getDeliverable() != null;
  }
  protected isAdvocateView(): boolean {
    return this.isClientView() == false;
  }
  protected isClientView(): boolean {
    var userProfileTypeCode = this.getUserProfileTypeCode().toLowerCase();
    if (userProfileTypeCode == 'student') {
      return true;
    }
    return false;
  }
  protected getWorkRequest(): WorkRequestGETData   {
    return this.workRequestUIController?.workRequest || {};
  }

  // Message tabs properties and methods
  protected messageTabId: string = 'client';

  protected getWorkRequestMessageTabs(): SimpleTab[] {
    const tabs: SimpleTab[] = [];
    
    tabs.push(new SimpleTab('client', 'Client Messages', '', () => {
      this.messageTabId = 'client';
    }, () => this.hasClientMessageThread()));

    tabs.push(new SimpleTab('internal', 'Internal Messages', '', () => {
      this.messageTabId = 'internal';
    }, () => this.hasInternalMessageThread() && !this.isClientView()));

    return tabs;
  }

  protected hasClientMessageThread(): boolean {
    return !!this.getWorkRequest().clientFacingMessageId;
  }

  protected hasInternalMessageThread(): boolean {
    return !!this.getWorkRequest().internalFacingMessageId;
  }

  protected getClientMessageThreadId(): string {
    return this.getWorkRequest().clientFacingMessageId || '';
  }

  protected getInternalMessageThreadId(): string {
    return this.getWorkRequest().internalFacingMessageId || '';
  }

  protected hasAnyMessageThread(): boolean {
    return this.hasClientMessageThread() || this.hasInternalMessageThread();
  }

  protected totalItems: number = 0;
  protected getTotalItems(): number {
    return this.totalItems;
  }
  protected isShowingItemsList(): boolean {
    return ( this.workRequestUIController?.showingItemsList) || false;
  }
  public isShowingWorkRequestItem(): boolean {
    return this.workRequestItemId !== null && this.workRequestItemId !== undefined && this.workRequestItemId !== '';
  }
  protected workRequestItemId?: string = '';

  protected isShowingCreateWorkItem(): boolean {
    return this.workRequestUIController?.showingCreateWorkItem || false;
  }

  protected isShowingParentDocuments(): boolean {
    return false;
    //return this.workRequestUIController?.showingParentDocuments || false;
  }
  protected getItemActionMenu(): MenuControlDataList | null {
    return this.workRequestUIController?.createWorkItemActionMenu || null;
  }

  protected getMessages(): SimpleMessageList | null {
    return this.workRequestUIController?.messages || null;
  }
  protected workItemDeliverableId?: string = '';
  protected async loadEntityById(id: string): Promise<WorkRequestCrudWrapper> {
    this.totalItems = 0;
    this.workRequestItem = null;
    this.workRequestItemId = undefined;
    var workRequestUIController = await this.hcclService.getWorkRequestUIController(id).toPromise();
    if (workRequestUIController) {
      this.workRequestUIController = workRequestUIController;
    }

    var workRequest = new WorkRequestCrudWrapper(workRequestUIController?.workRequest || {}, this.hcclService);
    this.workRequestItemId = workRequestUIController?.workRequestItem?.id || undefined;
    if (this.workRequestItemId != null && this.workRequestItemId != undefined && this.workRequestItemId != '') {
      this.loadWorkRequestItemById();
    }

    // Set default accordion to clientMessages when loading completes
    this.accordionId = 'clientMessages';
   
    return workRequest;
  }

  protected async loadWorkRequestItemById(): Promise<WorkRequestItemCrudWrapper | null> {
    const itemId = this.workRequestItemId;
    if (itemId != null && itemId != undefined && itemId !== '') {
      try {
        this.workRequestItem = await WorkRequestItemCrudWrapper.newInstance(itemId, this.hcclService);
        
        if (this.workRequestItem.getData().currentStateCode == 'completed') {
          const workitemdeliverablecriteria: WorkItemDeliverableCriteria = {
            pageNumber: 1,
            pageSize: 50,
            isPaging: true,
            workRequestItemId: itemId
          };
          const workitemdeliverable = await WorkItemDeliverableCrudWrapper.newInstanceByCriteria(workitemdeliverablecriteria, this.hcclService);
          this.workItemDeliverableId = workitemdeliverable.getData().id;
        }
        
        // Trigger change detection after load completes
        this.cdr.detectChanges();
        return this.workRequestItem;
      } catch (error) {
        console.error('Error loading work request item:', error);
        this.workRequestItem = null;
        this.cdr.detectChanges();
      }
    }
    return null;
  }

  protected isWorkRequestOpen(): boolean {
    return this.entity?.getCurrentState().openStatus === true || false;
  }

  protected isWorkRequestClosedOrCancelled (): boolean {
    return this.isWorkRequestClosed() || this.isWorkRequestCancelled() || false;
  }

  protected isWorkRequestClosed(): boolean {
    return this.entity?.getCurrentState().closedStatus === true || false;
  }

  protected isWorkRequestCancelled(): boolean {
    return this.entity?.getCurrentState().cancelledStatus === true || false;
  }

  protected isWorkRequestAccepted(): boolean {
    return this.entity?.getCurrentState().stateCode === 'accepted' || false;
  }
  protected isWorkRequestInitialState(): boolean {
    return this.entity?.getCurrentState().stateCode === 'initial' || false;
  }


  protected isShowingClientMessages(): boolean {
    return this.hasClientMessageThread() && !this.isWorkRequestInitialState();
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
    
    // Reload work request item if one was selected
    if (this.workRequestItemId) {
      this.loadWorkRequestItemById();
    } else {
      // Trigger change detection
      this.cdr.detectChanges();
    }
  }


  protected workRequestItem: WorkRequestItemCrudWrapper | null = null;


  protected setupTabs(): SimpleTab[] {
    var tabs : SimpleTab[] = [];
    var entityType = (this.entity?.getEntityType() || '').toLowerCase();
    entityType = 'workrequest';
    //var idBaseRoute = this.getIdBaseRoute(this.id);
    var tab = new SimpleTab('details', this.getDetailsTabLabel(), '', 
        () => {
          this.currentTabId = 'details';
        
        },
        () => {
          return this.workRequestItemId !== null;
        }
      );
      tabs.push(tab);

       tab = new SimpleTab('deliverables', this.getDeliverablesTabLabel(), '', 
      () => {
        this.currentTabId = 'deliverables';
      
      },
      () => {
        return this.workRequestItemId !== null && this.isShowingDeliverable();
      }
    );
    if (this.isClientView() == false) {
     tabs.push(tab);
  } 
      tab =  new SimpleTab('details-complete', 'More Details ...', '', 
      () => {
        this.currentTabId = 'details-complete';
        //this.router.navigate([idBaseRoute, 'details-complete']);
       
      },
      () => {
        return this.entity !== null;
      }
    );
    tabs.push(tab) 

    tab =  new SimpleTab('update', 'Update', '', 
      () => {
        //this.currentTabId = 'update';
        //this.router.navigate([idBaseRoute, 'update']);
        this.currentTabId = 'update';
       
      },
      () => {
        return this.entity !== null;
      }
    );
    if (this.canUpdateWorkRequest()) {
      tabs.push(tab) 
    }

    tab =  new SimpleTab('logs', 'Logs', '', 
      () => {
        //this.router.navigate([idBaseRoute, 'logs']);
        this.currentTabId = 'logs';
        
      },
      () => {
        return true;
      }
    );
      tabs.push(tab)


    return tabs;
    return tabs;
  }

  override getDetailsTabLabel(): string {
    return this.entity?.getDisplayText(this.entity?.getData()) || '';
  }
  protected getDeliverablesTabLabel(): string {
    return 'Deliverables';
  }
  get itemsCriteria(): WorkRequestItemCriteria {
    var criteria: WorkRequestItemCriteria = {  
      workRequestId: this.id
    }
    return criteria;
  }

  onClickWorkRequestItemBehavior(): OnRowClickBehavior {
    var x: OnRowClickBehavior = new OnRowClickBehavior();
    x.parentId = this.id;
    x.tabId = 'workRequestItem';
    x.usingNavigateUrl = false;
    x.doNotNavigate = true;
    x.onRowClick = (entityId: string) => {
      // Reset current item state
      this.workRequestItem = null;
      this.workItemDeliverableId = '';
      // Set new item ID and trigger load
      this.workRequestItemId = entityId;
      this.loadWorkRequestItemById();
    };
    return x;
  }
   
  getWorkRequestItemActionCode(): string {
    return this.workRequestItem?.getData().actionCode || 'Error';
  }


  protected isWorkRequestItemOpen(): boolean {
    return this.workRequestItem?.getCurrentState().openStatus === true || false;
  }

  protected isWorkRequestItemClosedOrCancelled (): boolean {
    return this.isWorkRequestClosed() || this.isWorkRequestCancelled() || false;
  }

  protected isWorkItemRequestClosed(): boolean {
    return this.workRequestItem?.getCurrentState().closedStatus === true || false;
  }

  protected isWorkRequestItemCancelled(): boolean {
    return this.workRequestItem?.getCurrentState().cancelledStatus === true || false;
  }

  getLogsCriteria(): WorkRequestLogCriteria {
    var criteria: WorkRequestLogCriteria = {  
      workRequestId: this.id || '',
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

    // Refresh component after modal closes
    const subscription = this.modalRef.onClose.subscribe(() => {
      this.refreshAfterModalClose();
    });
    this.subscriptions.push(subscription);
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

    // Refresh component after modal closes
    const subscription = this.modalRef.onClose.subscribe(() => {
      this.refreshAfterModalClose();
    });
    this.subscriptions.push(subscription);
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

    // Refresh component after modal closes
    const subscription = this.modalRef.onClose.subscribe(() => {
      this.refreshAfterModalClose();
    });
    this.subscriptions.push(subscription);
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

  protected onFinishLoadingBehavior(): OnFinishLoadingBehavior {
    var x: OnFinishLoadingBehavior = new OnFinishLoadingBehavior();
    x.onFinishLoading = (id: string, data: any, totalRows: number) => {
      this.workRequestItemId = id;
      var showingItemsList = totalRows > 1;
      if (this.workRequestUIController) {
        this.workRequestUIController.showingItemsList = showingItemsList;
      }
      this.totalItems = totalRows;
      // Load the work request item - it handles change detection internally
      this.loadWorkRequestItemById();
    };
    return x;
  }

  // Methods copied from workrequest-update.component.ts for simple-buttonbar support
  
  isTicketCompleted(): boolean {
    return this.isWorkRequestClosedOrCancelled();
  }

  isTicketCancelled(): boolean {
    return this.isWorkRequestCancelled();
  }

  protected isReadonly(): boolean {
    return this.readonly;
  }

  isEnqueuedTicket(): boolean {
    return this.entity?.getData().parentWorkRequestItemId && this.entity?.getData().parentWorkRequestItemId !== '' || false;
  }

  getSimpleButtonBar(): SimpleButtonBar {
    // Return cached button bar if it exists
    if (this._buttonBar) {
      return this._buttonBar;
    }
    
    this._buttonBar = new SimpleButtonBar();
    
    // Accept Ticket button - only show when ticket is not accepted
    const acceptButton = this._buttonBar.addButton('acceptTicket', 'Accept Ticket', () => {
      this.openAcceptModal();
    });
    acceptButton.showingButtonFunction = () => !this.isTicketAccepted();
    
    // Attach RFI Content button - only show when ticket is accepted
    const attachButton = this._buttonBar.addButton('attachContent', 'Attach RFI Content', () => {
      this.openAttachContentModal();
    });
    attachButton.showingButtonFunction = () => this.isTicketAccepted();
    
    // Enqueue RFI button - only show when ticket is accepted
    const enqueueButton = this._buttonBar.addButton('enqueueRFI', 'Enqueue RFI', () => {
      this.openEnqueueModal();
    });
    enqueueButton.showingButtonFunction = () => this.isTicketAccepted() && !this.isEnqueuedTicket();
    
    return this._buttonBar;
  }

  dumpWorkRequest(): string {
    return  this.entity?.getData().debugInfo || '';
  }

  onButtonSelected(buttonId: string): void {
    const button = this.getSimpleButtonBar().getButton(buttonId);
    if (button) {
      button.activate();
    }
  }

  // Refresh button bar when entity changes
  private refreshButtonBar(): void {
    this._buttonBar = null; // Clear cache to force recreation
  }

  // Refresh the component after a modal closes
  private async refreshAfterModalClose(): Promise<void> {
    // Reload the main entity (work request)
    if (this.id) {
      this.entity = await this.loadEntityById(this.id);
      this.refreshButtonBar();
      
      // Reload work request item if one is currently selected
      if (this.workRequestItemId) {
        await this.loadWorkRequestItemById();
      }
      
      this.cdr.detectChanges();
    }
  }

  openAttachContentModal(): void {
    this.modalRef = this.modalService.open(WorkRequestAttachContentModalComponent, {
      modalClass: 'modal-lg',
      data: {
        workRequestId: this.id,
        userProfileId: this.hcclContextService.getCurrentUserProfileId() || ''
      }
    });

    // Refresh component after modal closes
    const subscription = this.modalRef.onClose.subscribe(() => {
      this.refreshAfterModalClose();
    });
    this.subscriptions.push(subscription);
  }

  openEnqueueModal(): void {
    this.modalRef = this.modalService.open(WorkRequestEnqueueModalComponent, {
      modalClass: 'modal-lg',
      data: {
        workRequestId: this.id,
        userProfileId: this.hcclContextService.getCurrentUserProfileId() || ''
      }
    });

    // Refresh component after modal closes with success result
    const subscription = this.modalRef.onClose.subscribe((result: boolean) => {
      if (result) {
        this.refreshAfterModalClose();
      }
    });
    this.subscriptions.push(subscription);
  }

  protected isShowingWorkRequestItemWorkSection(): boolean {
    return this.isWorkRequestItemOpen() && this.isWorkRequestOpen()  && this.isClientView() == false;
  }

  // Accordion state management - uses accordionId to track which is open
  protected openAccordion(id: string): void {
    this.accordionId = id;
  }

  protected isAccordionCollapsed(id: string): boolean {
    return this.accordionId !== id;
  }

  protected getWorkRequestItemWorkSectionTabs(): SimpleTab[] {
    var tabs: SimpleTab[] = [];
    tabs.push(new SimpleTab('details', 'Details', '', () => {
      this.currentTabId = 'details';
    }, () => {
      return this.isShowingWorkRequestItemWorkSection();
    }));
    tabs.push(new SimpleTab('update', 'Update', '', () => {
      this.currentTabId = 'update';
    }, () => {
      return this.isShowingWorkRequestItemWorkSection();
    }));
    tabs.push(new SimpleTab('about', 'About', '', () => {
      this.currentTabId = 'about';
    }, () => {
      return this.isShowingWorkRequestItemWorkSection();
    }));
    tabs.push(new SimpleTab('deliverables', 'Deliverables', '', () => {
      this.currentTabId = 'deliverables';
    }, () => {
      return this.isShowingWorkRequestItemWorkSection();
    }));
    return tabs;    
  }
} 

