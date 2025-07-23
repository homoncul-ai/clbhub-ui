// This template is for generating a GROUP component  
// This was generated using entityName = CatalogSearchResultEntry
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { CatalogSearchResultEntryCrudWrapper, CatalogSearchResultEntryCrudComponent } from '@app/components/_crud/catalogsearchresultentry/catalogsearchresultentry-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-catalogsearchresultentry-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, CatalogSearchResultEntryCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './catalogsearchresultentry-group.component.html',
})
export class CatalogSearchResultEntryGroupComponent extends AbstractEntityGroupComponent<CatalogSearchResultEntryCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): CatalogSearchResultEntryCrudWrapper {
    return CatalogSearchResultEntryCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<CatalogSearchResultEntryCrudWrapper> {
    return CatalogSearchResultEntryCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

} 