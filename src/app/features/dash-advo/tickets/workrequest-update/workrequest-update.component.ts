import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HcclService, SimpleMessage } from '@app/restsvc/hccl.service';
import { WorkRequestCrudWrapper, WorkrequestCrudComponent } from '@app/components/_crud/workrequest/workrequest-crud.component';
import { SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { FormsModule } from '@angular/forms';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';
import { CRUD_MODES } from '@app/@core/constants/app-settings';
import { AbstractMultimodeComponent } from '@app/components/_global/abstract-multimode/abstract-multimode.component';

@Component({
  selector: 'app-workrequest-update',
  imports: [CommonModule, WorkrequestCrudComponent, SimpleMessagesSectionComponent, MenuControlDataListComponent, FormsModule, AvailableSelectorComponent ],
  templateUrl: './workrequest-update.component.html',
  styleUrl: './workrequest-update.component.scss'
})
export class WorkrequestUpdateComponent extends AbstractMultimodeComponent<WorkRequestCrudWrapper> implements OnInit  {

  // Properties referenced in template
  acceptText: string = '';
  availableQueues: any[] = [];

  override async ngOnInit(): Promise<void> {
    this.entity = await WorkRequestCrudWrapper.newInstance(this.id, this.hcclService);
    this.localModes = ['accept', 'reroute'];
    super.ngOnInit();
  }

  protected override async prepareModeEntry(entity: WorkRequestCrudWrapper, mode: string): Promise<void> {
    super.prepareModeEntry(entity, mode);
    if (mode === 'accept') {
      // Create show a text area.
    } else if (mode === 'reroute') {
      // show a list of queues to reroute to.
    }
    return Promise.resolve();
  }

  // Methods referenced in template
  acceptTicket(): void {
    // TODO: Implement accept ticket functionality
    var msg: SimpleMessage = {
      messageCode: 'TIX_ACCEPT_TICKET',
      severity: 1,
      message: 'Ticket accepted'
    };
    this.messages.messages.push(msg);
  }

  rerouteTicket(selectedQueue?: any): void {
    var msg: SimpleMessage = {
      messageCode: 'TIX_RE_ROUTE_TICKET',
      severity: 1,
      message: 'Ticket rerouted'
    };
    this.messages.messages.push(msg);
  }
}
