// This template is for generating a GROUP component  
// This was generated using entityName = WorkRequest
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { WorkRequestCrudWrapper, WorkrequestCrudComponent } from '@app/components/_crud/workrequest/workrequest-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-workrequest-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, WorkrequestCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './workrequest-group.component.html',
})
export class WorkRequestGroupComponent extends AbstractEntityGroupComponent<WorkRequestCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  } 
  protected newCrudWrapperForCreate(): WorkRequestCrudWrapper {
    return WorkRequestCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<WorkRequestCrudWrapper> {
    return WorkRequestCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

} 