// This template is for generating a GROUP component  
// This was generated using entityName = PersonalStatement
// Generate the new personalstatement-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { PersonalStatementCrudWrapper, PersonalStatementCrudComponent } from '@app/components/_crud/personalstatement/personalstatement-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-personalstatement-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, PersonalStatementCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './personalstatement-group.component.html',
})
export class PersonalStatementGroupComponent extends AbstractEntityGroupComponent<PersonalStatementCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): PersonalStatementCrudWrapper {
    return PersonalStatementCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<PersonalStatementCrudWrapper> {
    return PersonalStatementCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

}
