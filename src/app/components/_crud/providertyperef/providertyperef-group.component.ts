// This template is for generating a GROUP component  
// This was generated using entityName = ProviderTypeRef
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { ProviderTypeRefCrudWrapper, ProvidertyperefCrudComponent } from '@app/components/_crud/providertyperef/providertyperef-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-providertyperef-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, ProvidertyperefCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './providertyperef-group.component.html',
})
export class ProviderTypeRefGroupComponent extends AbstractEntityGroupComponent<ProviderTypeRefCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): ProviderTypeRefCrudWrapper {
    return ProviderTypeRefCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<ProviderTypeRefCrudWrapper> {
    return ProviderTypeRefCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

} 