// This template is for generating a LIST component for an entity that has a FK Menu
// This was generated using entityName = CatalogTypeRef
// Generate the new [entityName]-list.component.ts   files using this template
// Of course, the code related to the attributes of the entity in the grid should be changed to match the entityName's attributes


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclService } from '../../../restsvc/hccl.service';
import { CatalogTypeRefGETData, CatalogTypeRefCriteria, CatalogTypeRefGETDataSearchResults } from '../../../restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { Observable } from 'rxjs';

/**
 * Component for displaying and managing CatalogTypeRef data using HcclService
 * Extends AbstractListComponent for common grid functionality
 */

@Component({
  selector: 'app-catalogtyperef-list',
  standalone: true,
  templateUrl: '../../_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../_global/abstract-list/abstract-list.component.scss'],
    imports: [CommonModule]
})
export class CatalogTypeRefListComponent extends AbstractListComponent<CatalogTypeRefGETData, CatalogTypeRefCriteria, CatalogTypeRefGETDataSearchResults> {
  
  constructor(   
  ) {
    super();
    
    // Set entity-specific properties
    this.searchHeading = 'Catalog Type Refs';
    this.showingAddButton = true;
    this.showingIdCheckbox = true;
    //this.searchPlaceholder = ...
  }

  // Always start with the id column, then the attributes of the entity in the order you want them to appear in the grid
  // start with the id, dateCreated, dateLastUpdated, createdByInfo, lastUpdatedByInfo commented out.
  protected getGridColumns(): any[] {
    return [
      // id is commented out for now - not sure if we want to show this
      //{ id: 'id', header: [{ text: 'ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'name', header: [{ text: 'Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'businessCode', header: [{ text: 'Business Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'description', header: [{ text: 'Description', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },

      // Commented out for now - not sure if we want to show this
//      { id: 'createdByInfo', header: [{ text: 'Created By', align: 'center' }], minWidth: 120, adjust: true },
  //    { id: 'dateCreated', header: [{ text: 'Date Created', align: 'center' }], minWidth: 120, adjust: true },
    //  { id: 'lastUpdatedByInfo', header: [{ text: 'Last Updated By', align: 'center' }], minWidth: 120, adjust: true },
      { id: 'dateLastUpdated', header: [{ text: 'Date Last Updated', align: 'center' }], minWidth: 120, adjust: true }
    ];
  }

  protected createCriteria(): CatalogTypeRefCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected findEntities(criteria: CatalogTypeRefCriteria): Observable<CatalogTypeRefGETDataSearchResults> {
    return this.hcclService.findCatalogTypeRefs(criteria);
  }

  protected hasSearchResults(response: CatalogTypeRefGETDataSearchResults): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(response: CatalogTypeRefGETDataSearchResults): CatalogTypeRefGETData[] {
    return response.searchResults || [];
  }

  /**
   * Special attributes in the grid.  FK info needs to be added here.
   * @param entity 
   * @returns 
   */
  protected override async formatEntityDataAsync(entity: CatalogTypeRefGETData): Promise<any> {
      return {
        createdByInfo: entity.createdByInfo?.name || '',
        lastUpdatedByInfo: entity.lastUpdatedByInfo?.name || '',
        dateCreated: entity.dateCreated?.formattedDate || '',
        dateLastUpdated: entity.dateLastUpdated?.formattedDate || ''
      };
    }
  }


