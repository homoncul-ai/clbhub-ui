// This template is for generating a GROUP component  
// This was generated using entityName = HcclTeam
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclTeamCrudWrapper, HcclTeamCrudComponent } from '@app/components/_crud/hcclteam/hcclteam-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-hcclteam-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, HcclTeamCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './hcclteam-group.component.html',
})
export class HcclTeamGroupComponent extends AbstractEntityGroupComponent<HcclTeamCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): HcclTeamCrudWrapper {
    return HcclTeamCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<HcclTeamCrudWrapper> {
    return HcclTeamCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

} 