// This template is for generating a GROUP component  
// This was generated using entityName = WorkGroup
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { WorkGroupCrudWrapper, WorkgroupCrudComponent } from '@app/components/_crud/workgroup/workgroup-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-workgroup-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, WorkgroupCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './workgroup-group.component.html',
})
export class WorkGroupGroupComponent extends AbstractEntityGroupComponent<WorkGroupCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): WorkGroupCrudWrapper {
    return WorkGroupCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<WorkGroupCrudWrapper> {
    return WorkGroupCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

} 