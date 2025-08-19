// This template is for generating a LIST component for an entity that has a FK Menu
// This was generated using entityName = CatalogSearchResultEntry
// Generate the new [entityName]-list.component.ts   files using this template
// Of course, the code related to the attributes of the entity in the grid should be changed to match the entityName's attributes


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclService } from '../../../restsvc/hccl.service';
import { CatalogSearchResultEntryGETData, CatalogSearchResultEntryCriteria, CatalogSearchResultEntryGETDataSearchResults } from '../../../restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { Observable } from 'rxjs';
import { CatalogSearchResultCrudWrapper } from '@app/components/_crud/catalogsearchresult/catalogsearchresult-crud.component';
import { CatalogEntryCrudWrapper } from '@app/components/_crud/catalogentry/catalogentry-crud.component';
import { CatalogCrudWrapper } from '@app/components/_crud/catalog/catalog-crud.component';
import { SimpleButtonbarComponent, SimpleTabsetComponent } from '@app/components/_global';

/**
 * Component for displaying and managing CatalogSearchResultEntry data using HcclService
 * Extends AbstractListComponent for common grid functionality
 */

@Component({
  selector: 'app-catalogsearchresultentry-list',
  standalone: true,
  templateUrl: '../../_global/abstract-list/abstract-list.component-bb.html',
  styleUrls: ['../../_global/abstract-list/abstract-list.component.scss'],
    imports: [CommonModule, SimpleButtonbarComponent]
})
export class CatalogSearchResultEntryListComponent extends AbstractListComponent<CatalogSearchResultEntryGETData, CatalogSearchResultEntryCriteria, CatalogSearchResultEntryGETDataSearchResults> {
  
  constructor(   
  ) {
    super();
    
    // Set entity-specific properties
    this.searchHeading = 'Catalog Search Result Entries';
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
     // { id: 'catalogSearchResultId', header: [{ text: 'Catalog Search Result', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      //{ id: 'catalogEntryId', header: [{ text: 'Catalog Entry', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
    //  { id: 'catalogId', header: [{ text: 'Catalog', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      //{ id: 'comments', header: [{ text: 'Comments', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },

      // Replace [prefix]Id with the displaytext of the crudwrapper - named [prefix]Str instead of [prefix]Id
      //{ id: 'catalogSearchResultStr', header: [{ text: 'Catalog Search Result', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      //{ id: 'catalogEntryStr', header: [{ text: 'Catalog Entry', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      //{ id: 'catalogStr', header: [{ text: 'Catalog', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },

      // Commented out for now - not sure if we want to show this
//      { id: 'createdByInfo', header: [{ text: 'Created By', align: 'center' }], minWidth: 120, adjust: true },
  //    { id: 'dateCreated', header: [{ text: 'Date Created', align: 'center' }], minWidth: 120, adjust: true },
    //  { id: 'lastUpdatedByInfo', header: [{ text: 'Last Updated By', align: 'center' }], minWidth: 120, adjust: true },
      //{ id: 'dateLastUpdated', header: [{ text: 'Date Last Updated', align: 'center' }], minWidth: 120, adjust: true }
      //{ id: 'catalogCode', header: [{ text: 'Catalog Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'catalogEntryEntryCode', header: [{ text: 'Entry Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'catalogEntryTitle', header: [{ text: 'Title', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'catalogEntryShortDescription', header: [{ text: 'Short Description', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      //{ id: 'catalogEntryDescription', header: [{ text: 'Catalog Entry Description', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      //{ id: 'catalogEntryNotes', header: [{ text: 'Catalog Entry Notes', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      //{ id: 'catalogEntryAvailable', header: [{ text: 'Catalog Entry Available', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      //{ id: 'catalogEntryUrl', header: [{ text: 'Catalog Entry Url', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
    ];
  }

  protected createCriteria(): CatalogSearchResultEntryCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected findEntities(criteria: CatalogSearchResultEntryCriteria): Observable<CatalogSearchResultEntryGETDataSearchResults> {
    return this.hcclService.findCatalogSearchResultEntrys(criteria);
  }

  protected hasSearchResults(response: CatalogSearchResultEntryGETDataSearchResults): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(response: CatalogSearchResultEntryGETDataSearchResults): CatalogSearchResultEntryGETData[] {
    return response.searchResults || [];
  }

  /**
   * Special attributes in the grid.  FK info needs to be added here.
   * @param entity 
   * @returns 
   */
  protected override async formatEntityDataAsync(entity: CatalogSearchResultEntryGETData): Promise<any> {
    // Every attribute of the form [prefix]Id is an "foreign key" and should be replaced with the displaytext of the crudwrapper
    const catalogSearchResultStr: string = entity.catalogSearchResultId == null ? 'unknown' : 
       (await CatalogSearchResultCrudWrapper.newInstance(entity.catalogSearchResultId, this.hcclService)).getDisplayText();
    
    const catalogEntryStr: string = entity.catalogEntryId == null ? 'unknown' : 
       (await CatalogEntryCrudWrapper.newInstance(entity.catalogEntryId, this.hcclService)).getDisplayText();
    
    const catalogStr: string = entity.catalogId == null ? 'unknown' : 
       (await CatalogCrudWrapper.newInstance(entity.catalogId, this.hcclService)).getDisplayText();

    return {
      createdByInfo: entity.createdByInfo?.name || '',
      lastUpdatedByInfo: entity.lastUpdatedByInfo?.name || '',
      dateCreated: entity.dateCreated?.formattedDate || '',
      dateLastUpdated: entity.dateLastUpdated?.formattedDate || '',
      catalogEntryEntryCode: entity.catalogEntry?.entryCode || '',
      catalogEntryTitle: entity.catalogEntry?.title || '',
      catalogEntryShortDescription: entity.catalogEntry?.shortDescription || '',
      //catalogSearchResultStr: catalogSearchResultStr,
      //catalogEntryStr: catalogEntryStr,
      //catalogStr: catalogStr
    };
  }
} 