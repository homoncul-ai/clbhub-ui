// This template is for generating a GROUP component  
// This was generated using entityName = CLSchool
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { CLSchoolCrudWrapper, CLSchoolCrudComponent } from '@app/components/_crud/clschool/clschool-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-clschool-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, CLSchoolCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './clschool-group.component.html',
})
export class CLSchoolGroupComponent extends AbstractEntityGroupComponent<CLSchoolCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): CLSchoolCrudWrapper {
    return CLSchoolCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<CLSchoolCrudWrapper> {
    return CLSchoolCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

} 