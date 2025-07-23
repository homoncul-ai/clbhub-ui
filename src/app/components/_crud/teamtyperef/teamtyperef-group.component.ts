// This template is for generating a GROUP component  
// This was generated using entityName = TeamTypeRef
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { TeamTypeRefCrudWrapper, TeamTypeRefCrudComponent } from '@app/components/_crud/teamtyperef/teamtyperef-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-teamtyperef-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, TeamTypeRefCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './teamtyperef-group.component.html',
})
export class TeamTypeRefGroupComponent extends AbstractEntityGroupComponent<TeamTypeRefCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): TeamTypeRefCrudWrapper {
    return TeamTypeRefCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<TeamTypeRefCrudWrapper> {
    return TeamTypeRefCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

} 