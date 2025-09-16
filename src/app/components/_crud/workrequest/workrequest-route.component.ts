import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CreateTicketSetupUIData, HcclService, RoutingActionPOSTData, SimpleRestActionResponse, WorkQueueGETData, WorkRequestGETData, WorkRequestItemCriteria } from '@app/restsvc/hccl.service';
import { WorkRequestCrudWrapper } from '@app/components/_crud/workrequest/workrequest-crud.component';
import { SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { FormsModule } from '@angular/forms';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';
import { CRUD_MODES } from '@app/@core/constants/app-settings';
import { AbstractMultimodeComponent } from '@app/components/_global/abstract-multimode/abstract-multimode.component';
import { SimpleMessage, SimpleMessageList } from '@app/restsvc/common-request-service.model';
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { StdMdbFormTextComponent } from "../../_global/std-mdb-form-text/std-mdb-form-text.component";
import { MenuControlData, MenuControlDataList } from '@app/restsvc/hccl.service';
import { MdbModalService, MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { WorkRequestAcceptModalComponent } from './workrequest-accept-modal.component';


@Component({
  selector: 'app-workrequest-route',
  standalone: true,
  imports: [CommonModule, SimpleMessagesSectionComponent, FormsModule,
    StdMdbFormTextComponent, MenuControlDataListComponent],
  templateUrl: './workrequest-route.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss'
})
export class WorkRequestRouteComponent extends AbstractMultimodeComponent<WorkRequestCrudWrapper> implements OnInit  {
  
  // Properties referenced in template
  acceptText: string = '';
  availableQueues: any[] = [];
  error: any = null;
  
  // Inject modal service
  private modalService = inject(MdbModalService);
  private modalRef: MdbModalRef<WorkRequestAcceptModalComponent> | null = null;

  override async ngOnInit(): Promise<void> {
    super.ngOnInit();
    //alert("WorkRequestRouteComponent ngOnInit " + this.id);
    console.log('WorkRequestRouteComponent ngOnInit');
    this.entity = await WorkRequestCrudWrapper.newInstance(this.id, this.hcclService);
    //

    const queues = this.hcclContextService.getContext().dashQueues || [];

    // First, inbound tickets 
    this.menu_queues = {
      menuItems: [],
    }

    for (const queueT of queues) {
      const queue: WorkQueueGETData = queueT as WorkQueueGETData;
      var md : MenuControlData = {
        id: queue.id,
        name: queue.businessCode,
        selected: false,
      }
      this.menu_queues?.menuItems?.push(md);      
    }

    this.localModes = ['accept', 'reroute'];
    this.loading = false;
  }

  protected override async prepareModeEntry(entity: WorkRequestCrudWrapper, mode: string): Promise<void> {
    super.prepareModeEntry(entity, mode);
    console.log('WorkRequestRouteComponent ngOnInit ' + this.entity.dump);
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
    return this.entity?.getCurrentStateCode() === 'rerouted';
  }
  // Methods referenced in template
  openAcceptModal(): void {
    const baseRoute = super.getBaseRoute();
    
    this.modalRef = this.modalService.open(WorkRequestAcceptModalComponent, {
      modalClass: 'modal-lg',
      data: {
        workRequestId: this.id,
        baseRoute: baseRoute
      }
    });
  }

  rerouteTicket(selectedQueue?: any): void {
    var baseRoute = super.getBaseRoute();
   
    var data: RoutingActionPOSTData = {
      comments: this.acceptText,
      userProfileId: this.hcclContextService.getCurrentUserProfileId() || '',
      newQueueId: this.selectedWorkQueue?.id || ''
    };
    this.hcclService.rerouteTicket(this.id,data).subscribe(
      (data: WorkRequestGETData) => {
       this.router.navigate([baseRoute, this.id, 'logs  ']);
      }
    );
  }

  menu_queues: MenuControlDataList | null = null; 
  
  showingAttachRFIContent: boolean = true;
  public isShowingEnqueueRFI(): boolean {
    return this.showingAttachRFIContent == false;
  }
  public isShowingAttachRFIContent(): boolean {
    return this.showingAttachRFIContent == true;
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

  protected async loadEntityByIdCall(id: string): Promise<WorkRequestCrudWrapper> {
    return WorkRequestCrudWrapper.newInstance(id, this.hcclService);
  }
} 