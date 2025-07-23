// This template is for generating a GROUP component  
// This was generated using entityName = ClStudent
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { CLStudentCrudWrapper, CLStudentCrudComponent } from '@app/components/_crud/clstudent/clstudent-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-clstudent-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, CLStudentCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './clstudent-group.component.html',
})
export class CLStudentGroupComponent extends AbstractEntityGroupComponent<CLStudentCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): CLStudentCrudWrapper {
    return CLStudentCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<CLStudentCrudWrapper> {
    return CLStudentCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

}
