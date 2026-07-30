import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclService } from '../../../restsvc/hccl.service';
import { CatalogEntryGETData, CatalogEntryCriteria, CatalogEntryGETDataSearchResults } from '../../../restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { map, Observable } from 'rxjs';
import { SimpleButtonbarComponent } from '@app/components/_global/simple-buttonbar/simple-buttonbar.component';

/**
 * Component for displaying and managing CatalogEntry data using HcclService
 * Extends AbstractListComponent for common grid functionality
 */

@Component({
  selector: 'app-catalogentry-list',
  standalone: true,
//  templateUrl: '../../_global/abstract-list/abstract-list-bb.component.html',
  templateUrl: './catalogentry-list.component.html',
  styleUrls: ['../../_global/abstract-list/abstract-list.component.scss'],
    imports: [CommonModule, SimpleButtonbarComponent]
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
    // Header filters must hit beyond the current page (see findEntities client filter path).
    this.usingServerSideColumnFilters = true;
    //this.searchPlaceholder = ...
  }

  /**
   * Text/column text filters are applied in findEntities. Do not put them on
   * searchByText — QA postgres SQL for that field is broken (invalid query).
   */
  protected override applyColumnFiltersToCriteria(_criteria: CatalogEntryCriteria): void {
    // Intentionally empty: columnFilters is read directly in findEntities.
  }

  protected getGridColumns(): any[] {
    return [
     // { id: 'id', header: [{ text: 'ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      //{ id: 'catalogId', header: [{ text: 'Catalog ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'entryCode', header: [{ text: 'Entry Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'entryTypeCode', header: [{ text: 'Entry Type', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'title', header: [{ text: 'Title', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, maxWidth: 300, adjust: true },
      { id: 'shortDescription', header: [{ text: 'Short Description', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true, wordWrap: true },
      //{ id: 'description', header: [{ text: 'Description', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      //{ id: 'notes', header: [{ text: 'Notes', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      //{ id: 'available', header: [{ text: 'Available', align: 'center' }, { content: 'inputFilter' }], minWidth: 100, adjust: true },
      //{ id: 'url', header: [{ text: 'URL', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      //{ id: 'vocodeInstanceId', header: [{ text: 'Vocode Instance ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      //{ id: 'integrationEntityId', header: [{ text: 'Integration Entity ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      //{ id: 'integrationEntityType', header: [{ text: 'Integration Entity Type', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      //{ id: 'integrationEntityName', header: [{ text: 'Integration Entity Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
//      { id: 'createdByInfo', header: [{ text: 'Created By', align: 'center' }], minWidth: 120, adjust: true },
  //    { id: 'dateCreated', header: [{ text: 'Date Created', align: 'center' }], minWidth: 120, adjust: true },
    //  { id: 'lastUpdatedByInfo', header: [{ text: 'Last Updated By', align: 'center' }], minWidth: 120, adjust: true },
      //{ id: 'dateLastUpdated', header: [{ text: 'Date Last Updated', align: 'center' }], minWidth: 120, adjust: true }
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
    if (criteria.vocationEncodingId) {
      return this.hcclService.findCatalogEntrysUsingVocode(criteria).pipe(
        map(response => response.catalogEntries ?? { searchResults: [] })
      );
    }

    const topSearch = criteria.searchByText?.trim() || '';
    const entryCode = this.columnFilters['entryCode']?.trim() || '';
    const title = this.columnFilters['title']?.trim() || '';
    const shortDescription = this.columnFilters['shortDescription']?.trim() || '';
    const entryTypeCode = this.columnFilters['entryTypeCode']?.trim() || '';

    const hasTextFilter =
      (!!topSearch && topSearch !== '*') ||
      !!entryCode ||
      !!title ||
      !!shortDescription ||
      !!entryTypeCode;

    // Never send searchByText to the API until the postgres predicate is fixed in QA.
    const { searchByText: _ignored, catalogTypeCode: _typeIgnored, ...base } = criteria;
    const apiCriteria: CatalogEntryCriteria = { ...base };

    if (!hasTextFilter) {
      return this.hcclService.findCatalogEntrys(apiCriteria);
    }

    // Broader fetch, then filter + page client-side (covers full result set up to maxResults).
    const fetchCriteria: CatalogEntryCriteria = {
      ...apiCriteria,
      isPaging: false,
      maxResults: criteria.maxResults && criteria.maxResults > 0 ? criteria.maxResults : 5000,
    };
    delete fetchCriteria.pageNumber;
    delete fetchCriteria.pageSize;

    const pageNumber = Number(criteria.pageNumber) || 1;
    const pageSize = Number(criteria.pageSize) || this.pageSize || 50;

    return this.hcclService.findCatalogEntrys(fetchCriteria).pipe(
      map((response) => {
        let rows = response.searchResults || [];
        rows = this.filterCatalogEntriesClientSide(rows, {
          topSearch,
          entryCode,
          title,
          shortDescription,
          entryTypeCode,
        });
        const start = (pageNumber - 1) * pageSize;
        return {
          searchResults: rows.slice(start, start + pageSize),
          pagingInfo: {
            totalRows: rows.length,
            pageNumber,
            pageSize,
          },
        };
      })
    );
  }

  private filterCatalogEntriesClientSide(
    rows: CatalogEntryGETData[],
    filters: {
      topSearch: string;
      entryCode: string;
      title: string;
      shortDescription: string;
      entryTypeCode: string;
    }
  ): CatalogEntryGETData[] {
    const matchesField = (value: string | undefined, needle: string): boolean => {
      if (!needle || needle === '*') {
        return true;
      }
      const hay = (value || '').toLowerCase();
      const n = needle.toLowerCase();
      if (n.includes('*')) {
        const pattern = n
          .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
          .replace(/\*/g, '.*');
        return new RegExp(`^${pattern}$`, 'i').test(value || '');
      }
      return hay.includes(n);
    };

    return rows.filter((row) => {
      if (filters.topSearch && filters.topSearch !== '*') {
        const top = filters.topSearch.toLowerCase();
        const fields = [
          row.entryCode || '',
          row.title || '',
          row.shortDescription || '',
          row.catalogTypeCode || '',
        ];
        const hit = top.includes('*')
          ? fields.some((f) => matchesField(f, filters.topSearch))
          : fields.some((f) => f.toLowerCase().includes(top));
        if (!hit) {
          return false;
        }
      }
      if (!matchesField(row.entryCode, filters.entryCode)) {
        return false;
      }
      if (!matchesField(row.title, filters.title)) {
        return false;
      }
      if (!matchesField(row.shortDescription, filters.shortDescription)) {
        return false;
      }
      if (!matchesField(row.catalogTypeCode, filters.entryTypeCode)) {
        return false;
      }
      return true;
    });
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
      dateLastUpdated: entity.dateLastUpdated?.formattedDate || '',
      entryTypeCode: entity.catalogTypeCode || ''
    };
  }

  
  
}
