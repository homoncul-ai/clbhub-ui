// This template is for generating a GROUP component  
// This was generated using entityName = CatalogTypeRef
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { CatalogTypeRefCrudWrapper, CatalogTypeRefCrudComponent } from '@app/components/_crud/catalogtyperef/catalogtyperef-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-catalogtyperef-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, CatalogTypeRefCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './catalogtyperef-group.component.html',
})
export class CatalogTypeRefGroupComponent extends AbstractEntityGroupComponent<CatalogTypeRefCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): CatalogTypeRefCrudWrapper {
    return CatalogTypeRefCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<CatalogTypeRefCrudWrapper> {
    return CatalogTypeRefCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

}

