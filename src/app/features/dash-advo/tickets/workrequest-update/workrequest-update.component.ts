import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HcclService } from '@app/restsvc/hccl.service';
import { WorkRequestCrudWrapper, WorkrequestCrudComponent } from '@app/components/_crud/workrequest-crud/workrequest-crud.component';
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


  override async ngOnInit(): Promise<void> {
    this.entity = await WorkRequestCrudWrapper.newInstance(this.id, this.hcclService);
    this.localModes = ['accept', 'reroute'];
    super.ngOnInit();
  }
  
}
