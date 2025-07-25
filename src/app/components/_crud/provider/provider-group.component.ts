// This template is for generating a GROUP component  
// This was generated using entityName = Provider
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { ProviderCrudWrapper, ProviderCrudComponent } from '@app/components/_crud/provider/provider-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-provider-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, ProviderCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './provider-group.component.html',
})
export class ProviderGroupComponent extends AbstractEntityGroupComponent<ProviderCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): ProviderCrudWrapper {
    return ProviderCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<ProviderCrudWrapper> {
    return ProviderCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

} 