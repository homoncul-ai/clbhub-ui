// This template is for generating a GROUP component  
// This was generated using entityName = WorkItemDeliverable
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { WorkItemDeliverableCrudWrapper, WorkItemDeliverableCrudComponent } from '@app/components/_crud/workitemdeliverable/workitemdeliverable-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-workitemdeliverable-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, WorkItemDeliverableCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './workitemdeliverable-group.component.html',
})
export class WorkItemDeliverableGroupComponent extends AbstractEntityGroupComponent<WorkItemDeliverableCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): WorkItemDeliverableCrudWrapper {
    return WorkItemDeliverableCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<WorkItemDeliverableCrudWrapper> {
    return WorkItemDeliverableCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

} 