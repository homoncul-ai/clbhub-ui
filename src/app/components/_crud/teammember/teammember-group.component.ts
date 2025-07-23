// This template is for generating a GROUP component  
// This was generated using entityName = HcclTeamMember
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclTeamMemberCrudWrapper, TeamMemberCrudComponent } from '@app/components/_crud/teammember/teammember-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { A } from 'node_modules/@angular/cdk/activedescendant-key-manager.d-Bjic5obv';

@Component({
  selector: 'app-teammember-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, TeamMemberCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './teammember-group.component.html',
})
export class TeamMemberGroupComponent extends AbstractEntityGroupComponent<HcclTeamMemberCrudWrapper> implements OnInit {  

  constructor() {
    super();    
    var x = 1;
  }

  protected newCrudWrapperForCreate(): HcclTeamMemberCrudWrapper {
    return HcclTeamMemberCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<HcclTeamMemberCrudWrapper> {
    return HcclTeamMemberCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

} 