// This template is for generating a GROUP component  
// This was generated using entityName = ProviderRequestTypeRef
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { ProviderRequestTypeRefCrudWrapper, ProviderRequestTypeRefCrudComponent } from '@app/components/_crud/providerrequesttyperef/providerrequesttyperef-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-providerrequesttyperef-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, ProviderRequestTypeRefCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './providerrequesttyperef-group.component.html',
})
export class ProviderRequestTypeRefGroupComponent extends AbstractEntityGroupComponent<ProviderRequestTypeRefCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): ProviderRequestTypeRefCrudWrapper {
    return ProviderRequestTypeRefCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<ProviderRequestTypeRefCrudWrapper> {
    return ProviderRequestTypeRefCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

} 