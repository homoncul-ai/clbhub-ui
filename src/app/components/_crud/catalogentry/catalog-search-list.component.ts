import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import {
  CatalogEntryCriteria,
  CatalogEntryGETDataSearchResults,
  SearchCatalogRequest,
} from '@app/restsvc/hccl.service';
import { SimpleButtonbarComponent } from '@app/components/_global/simple-buttonbar/simple-buttonbar.component';
import { CatalogEntryListComponent } from './catalogentry-list.component';

/**
 * Catalog search list backed by SearchCatalogServices / SearchCatalogRequest.
 */
@Component({
  selector: 'app-catalog-search-list',
  standalone: true,
  templateUrl: './catalogentry-list.component.html',
  styleUrls: ['../../_global/abstract-list/abstract-list.component.scss'],
  imports: [CommonModule, SimpleButtonbarComponent],
})
export class CatalogSearchListComponent extends CatalogEntryListComponent {
  constructor(protected override router: Router) {
    super(router);
    this.searchHeading = 'Catalog Search';
    this.showingAddButton = false;
    this.showingIdCheckbox = false;
    this.showingGoButton = false;
  }

  protected override findEntities(
    criteria: CatalogEntryCriteria
  ): Observable<CatalogEntryGETDataSearchResults> {
    const searchText = criteria.searchByText?.trim();
    if (!searchText) {
      return of({ searchResults: [], pagingInfo: { totalRows: 0 } });
    }

    const request = this.buildSearchCatalogRequest(criteria, searchText);
    return this.hcclService.searchCatalog(request).pipe(
      map((response) =>
        response.results?.catalogEntries ?? { searchResults: [], pagingInfo: { totalRows: 0 } }
      )
    );
  }

  private buildSearchCatalogRequest(
    criteria: CatalogEntryCriteria,
    searchText: string
  ): SearchCatalogRequest {
    const catalogTypeCodes = criteria.catalogTypeCodes?.length
      ? criteria.catalogTypeCodes
      : criteria.catalogTypeCode
        ? [criteria.catalogTypeCode]
        : undefined;

    return {
      searchByText: searchText,
      pageNumber: criteria.pageNumber,
      pageSize: criteria.pageSize,
      isPaging: criteria.isPaging,
      maxResults: criteria.maxResults,
      orderByHint: criteria.orderByHint,
      catalogTypeCodes,
      savingSearchResults: true,
    };
  }
}
