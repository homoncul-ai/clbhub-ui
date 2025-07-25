// This template is for generating a GROUP component  
// This was generated using entityName = ProviderRequest
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { ProviderRequestCrudWrapper, ProviderRequestCrudComponent } from '@app/components/_crud/providerrequest/providerrequest-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-providerrequest-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, ProviderRequestCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './providerrequest-group.component.html',
})
export class ProviderRequestGroupComponent extends AbstractEntityGroupComponent<ProviderRequestCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): ProviderRequestCrudWrapper {
    return ProviderRequestCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<ProviderRequestCrudWrapper> {
    return ProviderRequestCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

} 