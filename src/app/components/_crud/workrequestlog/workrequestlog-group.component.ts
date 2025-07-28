// This template is for generating a GROUP component  
// This was generated using entityName = WorkRequestLog
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { WorkRequestLogCrudWrapper, WorkRequestLogCrudComponent } from '@app/components/_crud/workrequestlog/workrequestlog-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-workrequestlog-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, WorkRequestLogCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './workrequestlog-group.component.html',
})
export class WorkRequestLogGroupComponent extends AbstractEntityGroupComponent<WorkRequestLogCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): WorkRequestLogCrudWrapper {
    return WorkRequestLogCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<WorkRequestLogCrudWrapper> {
    return WorkRequestLogCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

} 