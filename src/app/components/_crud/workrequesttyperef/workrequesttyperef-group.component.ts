// This template is for generating a GROUP component  
// This was generated using entityName = WorkRequestTypeRef
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { WorkRequestTypeRefCrudWrapper, WorkrequesttyperefCrudComponent } from '@app/components/_crud/workrequesttyperef/workrequesttyperef-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-workrequesttyperef-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, WorkrequesttyperefCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './workrequesttyperef-group.component.html',
})
export class WorkRequestTypeRefGroupComponent extends AbstractEntityGroupComponent<WorkRequestTypeRefCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): WorkRequestTypeRefCrudWrapper {
    return WorkRequestTypeRefCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<WorkRequestTypeRefCrudWrapper> {
    return WorkRequestTypeRefCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

} 