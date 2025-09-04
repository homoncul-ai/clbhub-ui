import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CreateTicketSetupUIData, HcclService, RoutingActionPOSTData, SimpleRestActionResponse, WorkQueueGETData, WorkRequestGETData, WorkRequestItemCriteria } from '@app/restsvc/hccl.service';
import { EntityNameCrudWrapper, EntityNameCrudComponent } from '@app/components/_crud/EntityName/EntityName-crud.component';
import { SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { FormsModule } from '@angular/forms';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';
import { CRUD_MODES } from '@app/@core/constants/app-settings';
import { AbstractMultimodeComponent } from '@app/components/_global/abstract-multimode/abstract-multimode.component';
import { SimpleMessage, SimpleMessageList } from '@app/restsvc/common-request-service.model';
import { EntityNameListComponent } from '../EntityNameitem/EntityName-list.component';
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { StdMdbFormTextComponent } from "../../_global/std-mdb-form-text/std-mdb-form-text.component";
import { MenuControlData, MenuControlDataList } from '@app/restsvc/hccl.service';


@Component({
  selector: 'app-entityname-tabName',
  standalone: true,
  imports: [CommonModule, EntityNameCrudComponent, SimpleMessagesSectionComponent, FormsModule
    , StdMdbFormTextComponent, MenuControlDataListComponent],
  templateUrl: './entityname-multimode-tabName.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss'
})
export class EntityName_TabNameComponent extends AbstractMultimodeComponent<EntityNameCrudWrapper> implements OnInit  {
  
  // Properties referenced in template
  acceptText: string = '';
  availableQueues: any[] = [];
  error: any = null;

  override async ngOnInit(): Promise<void> {
    super.ngOnInit();
    //alert("EntityNameRouteComponent ngOnInit " + this.id);
    console.log('EntityNameRouteComponent ngOnInit');
    this.entity = await EntityNameCrudWrapper.newInstance(this.id, this.hcclService);
    //

    this.localModes = ['mode1', 'mode2'];
    this.loading = false;
  }

  protected override async prepareModeEntry(entity: EntityNameCrudWrapper, mode: string): Promise<void> {
    super.prepareModeEntry(entity, mode);
    console.log('EntityNameComponent ngOnInit ' + this.entity.dump);
    if (mode === 'mode1') {
      // Create show a text area.
    } else if (mode === 'mode2') {
      // show a list of queues to reroute to.
    }
    return Promise.resolve();
  }
 
  // Methods referenced in template 

  // Data for display in template.
  

  myOnRowClickBehavior(): OnRowClickBehavior {
    var x: OnRowClickBehavior =  new OnRowClickBehavior();
    x.parentId = this.id;
    x.tabId = 'EntityNameItem';
    //x.alertMessage = 'Catalog Entry';
    return x;
  }
   
//   selectedWorkQueue: MenuControlData | null = null;
//   onWorkQueueChange(selectedItem: MenuControlData | null): void {
//     this.selectedWorkQueue = selectedItem;
//   }

} 