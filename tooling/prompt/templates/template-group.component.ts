// This template is for generating a GROUP component  
// This was generated using entityName = HcclOrganization
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclOrganizationCrudWrapper, HcclOrganizationCrudComponent } from '@app/components/_crud/hcclorganization/hcclorganization-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-hcclorganization-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, HcclOrganizationCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  template: './hcclorganization-group.component.html',
})
export class HcclOrganizationGroupComponent extends AbstractEntityGroupComponent<HcclOrganizationCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): HcclOrganizationCrudWrapper {
    return HcclOrganizationCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<HcclOrganizationCrudWrapper> {
    return HcclOrganizationCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

} 