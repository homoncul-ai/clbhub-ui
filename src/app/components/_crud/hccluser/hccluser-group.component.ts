// This template is for generating a GROUP component  
// This was generated using entityName = HcclUser
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclUserCrudWrapper, HccluserCrudComponent } from '@app/components/_crud/hccluser/hccluser-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-hccluser-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, HccluserCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './hccluser-group.component.html',
})
export class HcclUserGroupComponent extends AbstractEntityGroupComponent<HcclUserCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): HcclUserCrudWrapper {
    return HcclUserCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<HcclUserCrudWrapper> {
    return HcclUserCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

} 