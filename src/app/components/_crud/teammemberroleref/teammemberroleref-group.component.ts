// This template is for generating a GROUP component  
// This was generated using entityName = TeamMemberRoleRef
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { TeamMemberRoleRefCrudWrapper, TeamMemberRoleRefCrudComponent } from '@app/components/_crud/teammemberroleref/teammemberroleref-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-teammemberroleref-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, TeamMemberRoleRefCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './teammemberroleref-group.component.html',
})
export class TeamMemberRoleRefGroupComponent extends AbstractEntityGroupComponent<TeamMemberRoleRefCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): TeamMemberRoleRefCrudWrapper {
    return TeamMemberRoleRefCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<TeamMemberRoleRefCrudWrapper> {
    return TeamMemberRoleRefCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

} 