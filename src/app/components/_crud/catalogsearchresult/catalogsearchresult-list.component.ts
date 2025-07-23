// This template is for generating a LIST component for an entity that has a FK Menu
// This was generated using entityName = CatalogSearchResult
// Generate the new [entityName]-list.component.ts   files using this template
// Of course, the code related to the attributes of the entity in the grid should be changed to match the entityName's attributes


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclService } from '../../../restsvc/hccl.service';
import { CatalogSearchResultGETData, CatalogSearchResultCriteria, CatalogSearchResultGETDataSearchResults } from '../../../restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { Observable } from 'rxjs';
import { CatalogCrudWrapper } from '@app/components/_crud/catalog/catalog-crud.component';

/**
 * Component for displaying and managing CatalogSearchResult data using HcclService
 * Extends AbstractListComponent for common grid functionality
 */

@Component({
  selector: 'app-catalogsearchresult-list',
  standalone: true,
  templateUrl: '../../_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../_global/abstract-list/abstract-list.component.scss'],
    imports: [CommonModule]
})
export class CatalogSearchResultListComponent extends AbstractListComponent<CatalogSearchResultGETData, CatalogSearchResultCriteria, CatalogSearchResultGETDataSearchResults> {
  
  constructor(   
  ) {
    super();
    
    // Set entity-specific properties
    this.searchHeading = 'Catalog Search Results';
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
      { id: 'catalogId', header: [{ text: 'Catalog', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'comments', header: [{ text: 'Comments', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'subjectEntityName', header: [{ text: 'Subject Entity Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'subjectEntityType', header: [{ text: 'Subject Entity Type', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'parentWorkRequestItemId', header: [{ text: 'Parent Work Request Item ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },

      // Replace [prefix]Id with the displaytext of the crudwrapper - named [prefix]Str instead of [prefix]Id
      { id: 'catalogStr', header: [{ text: 'Catalog', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'websiteUrl', header: [{ text: 'Website URL', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'parentEntityName', header: [{ text: 'Parent Entity Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },

      // Commented out for now - not sure if we want to show this
//      { id: 'createdByInfo', header: [{ text: 'Created By', align: 'center' }], minWidth: 120, adjust: true },
  //    { id: 'dateCreated', header: [{ text: 'Date Created', align: 'center' }], minWidth: 120, adjust: true },
    //  { id: 'lastUpdatedByInfo', header: [{ text: 'Last Updated By', align: 'center' }], minWidth: 120, adjust: true },
      { id: 'dateLastUpdated', header: [{ text: 'Date Last Updated', align: 'center' }], minWidth: 120, adjust: true }
    ];
  }

  protected createCriteria(): CatalogSearchResultCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected findEntities(criteria: CatalogSearchResultCriteria): Observable<CatalogSearchResultGETDataSearchResults> {
    return this.hcclService.findCatalogSearchResults(criteria);
  }

  protected hasSearchResults(response: CatalogSearchResultGETDataSearchResults): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(response: CatalogSearchResultGETDataSearchResults): CatalogSearchResultGETData[] {
    return response.searchResults || [];
  }

  /**
   * Special attributes in the grid.  FK info needs to be added here.
   * @param entity 
   * @returns 
   */
  protected override async formatEntityDataAsync(entity: CatalogSearchResultGETData): Promise<any> {
    // Every attribute of the form [prefix]Id is an "foreign key" and should be replaced with the displaytext of the crudwrapper
    const catalogStr: string = entity.catalogId == null ? 'unknown' : 
       (await CatalogCrudWrapper.newInstance(entity.catalogId, this.hcclService)).getDisplayText();

    return {
      createdByInfo: entity.createdByInfo?.name || '',
      lastUpdatedByInfo: entity.lastUpdatedByInfo?.name || '',
      dateCreated: entity.dateCreated?.formattedDate || '',
      dateLastUpdated: entity.dateLastUpdated?.formattedDate || '',
      catalogStr: catalogStr
    };
  }
} 