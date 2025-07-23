// This template is for generating a GROUP component  
// This was generated using entityName = WorkQueueTypeRef
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { WorkQueueTypeRefCrudWrapper, WorkqueuetyperefCrudComponent } from '@app/components/_crud/workqueuetyperef/workqueuetyperef-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-workqueuetyperef-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, WorkqueuetyperefCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './workqueuetyperef-group.component.html',
})
export class WorkQueueTypeRefGroupComponent extends AbstractEntityGroupComponent<WorkQueueTypeRefCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): WorkQueueTypeRefCrudWrapper {
    return WorkQueueTypeRefCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<WorkQueueTypeRefCrudWrapper> {
    return WorkQueueTypeRefCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

} 