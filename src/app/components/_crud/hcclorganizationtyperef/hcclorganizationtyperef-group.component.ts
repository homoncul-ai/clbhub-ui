// This template is for generating a GROUP component  
// This was generated using entityName = HcclOrganizationTypeRef
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclOrganizationTypeRefCrudWrapper, HcclOrganizationTypeRefCrudComponent } from '@app/components/_crud/hcclorganizationtyperef/hcclorganizationtyperef-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-hcclorganizationtyperef-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, HcclOrganizationTypeRefCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './hcclorganizationtyperef-group.component.html',
})
export class HcclOrganizationTypeRefGroupComponent extends AbstractEntityGroupComponent<HcclOrganizationTypeRefCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): HcclOrganizationTypeRefCrudWrapper {
    return HcclOrganizationTypeRefCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<HcclOrganizationTypeRefCrudWrapper> {
    return HcclOrganizationTypeRefCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

} 