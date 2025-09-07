// This template is for generating a GROUP component  
// This was generated using entityName = CatalogEntryInterest
// Generate the new catalogentryinterest-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { CatalogEntryInterestCrudWrapper, CatalogEntryInterestCrudComponent } from '@app/components/_crud/catalogentryinterest/catalogentryinterest-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-catalogentryinterest-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, CatalogEntryInterestCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './catalogentryinterest-group.component.html',
})
export class CatalogEntryInterestGroupComponent extends AbstractEntityGroupComponent<CatalogEntryInterestCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): CatalogEntryInterestCrudWrapper {
    return CatalogEntryInterestCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<CatalogEntryInterestCrudWrapper> {
    return CatalogEntryInterestCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

}
