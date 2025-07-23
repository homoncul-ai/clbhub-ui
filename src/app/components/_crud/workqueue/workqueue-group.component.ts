// This template is for generating a GROUP component  
// This was generated using entityName = WorkQueue
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { WorkQueueCrudWrapper, WorkqueueCrudComponent } from '@app/components/_crud/workqueue/workqueue-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-workqueue-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, WorkqueueCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './workqueue-group.component.html',
})
export class WorkQueueGroupComponent extends AbstractEntityGroupComponent<WorkQueueCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): WorkQueueCrudWrapper {
    return WorkQueueCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<WorkQueueCrudWrapper> {
    return WorkQueueCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

} 