import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CreateTicketSetupUIData, HcclService, RoutingActionPOSTData, SimpleRestActionResponse, WorkQueueGETData, WorkRequestGETData, WorkRequestItemCriteria } from '@app/restsvc/hccl.service';
import { WorkRequestCrudWrapper } from '@app/components/_crud/workrequest/workrequest-crud.component';
import { SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { FormsModule } from '@angular/forms';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';
import { CRUD_MODES } from '@app/@core/constants/app-settings';
import { AbstractMultimodeComponent } from '@app/components/_global/abstract-multimode/abstract-multimode.component';
import { SimpleMessage, SimpleMessageList } from '@app/restsvc/common-request-service.model';
import { WorkRequestItemListComponent } from '../workrequestitem/workrequestitem-list.component';
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { MenuControlData, MenuControlDataList } from '@app/restsvc/hccl.service';
import { MdbModalService, MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { WorkRequestAcceptModalComponent } from './workrequest-accept-modal.component';
import { WorkRequestAttachContentModalComponent } from './workrequest-attach-content-modal.component';
import { WorkRequestEnqueueModalComponent } from './workrequest-enqueue-modal.component';
import { SimpleButtonBar, SimpleButtonbarComponent } from '@app/components/_global/simple-buttonbar/simple-buttonbar.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-workrequest-update',
  standalone: true,
  imports: [CommonModule, SimpleMessagesSectionComponent, FormsModule,
    WorkRequestItemListComponent, SimpleButtonbarComponent],
  templateUrl: './workrequest-update.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss'
})
export class WorkrequestUpdateComponent extends AbstractMultimodeComponent<WorkRequestCrudWrapper> implements OnInit, OnDestroy  {
  
  // Properties referenced in template
  acceptText: string = '';
  availableQueues: any[] = [];
  error: any = null;
  
  // Cache the button bar to prevent recreation on every change detection
  private _buttonBar: SimpleButtonBar | null = null;
  
  // Inject modal service
  private modalService = inject(MdbModalService);
  private acceptModalRef: MdbModalRef<WorkRequestAcceptModalComponent> | null = null;
  private attachModalRef: MdbModalRef<WorkRequestAttachContentModalComponent> | null = null;
  private enqueueModalRef: MdbModalRef<WorkRequestEnqueueModalComponent> | null = null;
  
  // Subscription management
  private subscriptions: Subscription[] = [];

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    // Set up local modes for the component
    this.localModes = ['accept', 'reroute'];
    this.loading = false;
  }

  ngOnDestroy(): void {
    // Clean up all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
    
    // Clear button bar cache
    this._buttonBar = null;
    
    // Close any open modals
    if (this.acceptModalRef) {
      this.acceptModalRef.close();
    }
    if (this.attachModalRef) {
      this.attachModalRef.close();
    }
    if (this.enqueueModalRef) {
      this.enqueueModalRef.close();
    }
  }

  protected override async prepareModeEntry(entity: WorkRequestCrudWrapper, mode: string): Promise<void> {
    await super.prepareModeEntry(entity, mode);
    console.log('WorkrequestUpdateComponent prepareModeEntry ' + (entity?.dump || 'entity is null'));
    if (mode === 'accept') {
      // Create show a text area.
    } else if (mode === 'reroute') {
      // show a list of queues to reroute to.
    }
    return Promise.resolve();
  }

  isTicketAccepted(): boolean {
    return this.entity?.isTicketAccepted() || false;
  }

  isTicketRerouted(): boolean {
    return this.entity?.getCurrentStateCode() === 'rerouted' || false;
  }
  // Methods referenced in template
  openAcceptModal(): void {
    const baseRoute = this.getBaseRoute();
    
    this.acceptModalRef = this.modalService.open(WorkRequestAcceptModalComponent, {
      modalClass: 'modal-lg',
      data: {
        workRequestId: this.id,
        baseRoute: baseRoute
      }
    });
    
    // Refresh entity after modal closes
    const subscription = this.acceptModalRef.onClose.subscribe(() => {
      WorkRequestCrudWrapper.newInstance(this.id, this.hcclService).then(x => {
        this.entity = x;
        this.refreshButtonBar(); // Refresh button bar to update button visibility
      });
    });
    this.subscriptions.push(subscription);
  }

  openAttachContentModal(): void {
    this.attachModalRef = this.modalService.open(WorkRequestAttachContentModalComponent, {
      modalClass: 'modal-lg',
      data: {
        workRequestId: this.id,
        userProfileId: this.hcclContextService.getCurrentUserProfileId() || ''
      }
    });
    
    // Refresh entity after modal closes
    const subscription = this.attachModalRef.onClose.subscribe(() => {
      WorkRequestCrudWrapper.newInstance(this.id, this.hcclService).then(x => {
        this.entity = x;
        this.refreshButtonBar(); // Refresh button bar to update button visibility
      });
    });
    this.subscriptions.push(subscription);
  }

  openEnqueueModal(): void {
    this.enqueueModalRef = this.modalService.open(WorkRequestEnqueueModalComponent, {
      modalClass: 'modal-lg',
      data: {
        workRequestId: this.id,
        userProfileId: this.hcclContextService.getCurrentUserProfileId() || ''
      }
    });
    
    // Refresh entity after modal closes with success result
    const subscription = this.enqueueModalRef.onClose.subscribe((result: boolean) => {
      if (result) {
        WorkRequestCrudWrapper.newInstance(this.id, this.hcclService).then(x => {
          this.entity = x;
          this.refreshButtonBar(); // Refresh button bar to update button visibility
        });
      }
    });
    this.subscriptions.push(subscription);
  }

  async acceptTicket(): Promise<void> {
     
    var data: RoutingActionPOSTData = {
      comments: this.acceptText,
      userProfileId: this.hcclContextService.getCurrentUserProfileId() || ''
    };
    this.loading = true;
    this.hcclService.acceptTicket(this.id,data).subscribe(
      (data: WorkRequestGETData) => {
         //this.router.navigate([this.getBaseRoute(), this.id, 'update']);
         WorkRequestCrudWrapper.newInstance(this.id, this.hcclService).then(x => {
          this.entity = x;
          this.loading = false;
        });
      }
    );
  }

  rerouteTicket(selectedQueue?: any): void {
    var data: RoutingActionPOSTData = {
      comments: this.acceptText,
      userProfileId: this.hcclContextService.getCurrentUserProfileId() || '',
      newQueueId: this.selectedWorkQueue?.id || ''
    };
    this.hcclService.rerouteTicket(this.id,data).subscribe(
      (data: WorkRequestGETData) => {
       this.router.navigate([this.getBaseRoute(), this.id, 'logs']);
      }
    );
  }

  get itemsCriteria(): WorkRequestItemCriteria {
    var criteria: WorkRequestItemCriteria = {  
      workRequestId: this.id
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

  selectedWorkQueue: MenuControlData | null = null;
  onWorkQueueChange(selectedItem: MenuControlData | null): void {
    this.selectedWorkQueue = selectedItem;
  }

  // Convert the 
  
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
  
  isEnqueuedTicket(): boolean {
    return this.entity?.getData().parentWorkRequestItemId && this.entity?.getData().parentWorkRequestItemId !== '' || false;
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

  protected async loadEntityByIdCall(id: string): Promise<WorkRequestCrudWrapper> {
    return WorkRequestCrudWrapper.newInstance(id, this.hcclService);
  }
} 