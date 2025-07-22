import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclService } from '../../../restsvc/hccl.service';
import { CatalogEntryGETData, CatalogEntryCriteria, CatalogEntryGETDataSearchResults } from '../../../restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { Observable } from 'rxjs';

/**
 * Component for displaying and managing CatalogEntry data using HcclService
 * Extends AbstractListComponent for common grid functionality
 */

@Component({
  selector: 'app-catalogentry-list',
  standalone: true,
  templateUrl: '../../_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../_global/abstract-list/abstract-list.component.scss'],
    imports: [CommonModule]
})
export class CatalogEntryListComponent extends AbstractListComponent<CatalogEntryGETData, CatalogEntryCriteria, CatalogEntryGETDataSearchResults> {
  
  constructor(
    protected override router: Router
  ) {
    super();
    
    // Set entity-specific properties
    this.searchHeading = 'Catalog Entries';
    this.showingAddButton = true;
    this.showingIdCheckbox = true;
    //this.searchPlaceholder = ...
  }

  protected getGridColumns(): any[] {
    return [
      //{ id: 'id', header: [{ text: 'ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'entryCode', header: [{ text: 'Entry Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'title', header: [{ text: 'Title', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'shortDescription', header: [{ text: 'Short Description', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'description', header: [{ text: 'Description', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'notes', header: [{ text: 'Notes', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'available', header: [{ text: 'Available', align: 'center' }, { content: 'inputFilter' }], minWidth: 100, adjust: true },
      { id: 'url', header: [{ text: 'URL', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'vocodeInstanceId', header: [{ text: 'Vocode Instance ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'integrationEntityId', header: [{ text: 'Integration Entity ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'integrationEntityType', header: [{ text: 'Integration Entity Type', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'integrationEntityName', header: [{ text: 'Integration Entity Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
//      { id: 'createdByInfo', header: [{ text: 'Created By', align: 'center' }], minWidth: 120, adjust: true },
  //    { id: 'dateCreated', header: [{ text: 'Date Created', align: 'center' }], minWidth: 120, adjust: true },
    //  { id: 'lastUpdatedByInfo', header: [{ text: 'Last Updated By', align: 'center' }], minWidth: 120, adjust: true },
      { id: 'dateLastUpdated', header: [{ text: 'Date Last Updated', align: 'center' }], minWidth: 120, adjust: true }
    ];
  }

  protected createCriteria(): CatalogEntryCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected findEntities(criteria: CatalogEntryCriteria): Observable<CatalogEntryGETDataSearchResults> {
    return this.hcclService.findCatalogEntrys(criteria);
  }

  protected hasSearchResults(response: CatalogEntryGETDataSearchResults): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(response: CatalogEntryGETDataSearchResults): CatalogEntryGETData[] {
    return response.searchResults || [];
  }

  protected override formatEntityData(entity: CatalogEntryGETData): any {
    return {
      createdByInfo: entity.createdByInfo?.name || '',
      lastUpdatedByInfo: entity.lastUpdatedByInfo?.name || '',
      dateCreated: entity.dateCreated?.formattedDate || '',
      dateLastUpdated: entity.dateLastUpdated?.formattedDate || ''
    };
  }

  
  
} 