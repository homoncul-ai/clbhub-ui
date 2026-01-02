// PersonalStatementResume GROUP Component
// Generated from template-group.component.ts for entityName = PersonalStatementResume

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { PersonalStatementResumeCrudWrapper, PersonalStatementResumeCrudComponent } from '@app/components/_crud/personalstatementresume/personalstatementresume-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-personalstatementresume-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, PersonalStatementResumeCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './personalstatementresume-group.component.html',
})
export class PersonalStatementResumeGroupComponent extends AbstractEntityGroupComponent<PersonalStatementResumeCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): PersonalStatementResumeCrudWrapper {
    return PersonalStatementResumeCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<PersonalStatementResumeCrudWrapper> {
    return PersonalStatementResumeCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

}

