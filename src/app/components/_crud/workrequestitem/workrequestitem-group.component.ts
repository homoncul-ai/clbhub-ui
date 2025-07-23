// This template is for generating a GROUP component  
// This was generated using entityName = WorkRequestItem
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { WorkRequestItemCrudWrapper, WorkRequestItemCrudComponent } from '@app/components/_crud/workrequestitem/workrequestitem-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-workrequestitem-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, WorkRequestItemCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './workrequestitem-group.component.html',
})
export class WorkRequestItemGroupComponent extends AbstractEntityGroupComponent<WorkRequestItemCrudWrapper> implements OnInit {  

  constructor() {
    super();    
    var x = 1;
  }


  protected newCrudWrapperForCreate(): WorkRequestItemCrudWrapper {
    return WorkRequestItemCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<WorkRequestItemCrudWrapper> {
    return WorkRequestItemCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

} 