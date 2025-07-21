import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclService } from '../../../restsvc/hccl.service';
import { CatalogGETData, CatalogCriteria, CatalogGETDataSearchResults } from '../../../restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { Observable } from 'rxjs';

/**
 * Component for displaying and managing Catalog data using HcclService
 * Extends AbstractListComponent for common grid functionality
 */

@Component({
  selector: 'app-catalog-list',
  standalone: true,
  templateUrl: '../../_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../_global/abstract-list/abstract-list.component.scss'],
  imports: [CommonModule]
})
export class CatalogListComponent extends AbstractListComponent<CatalogGETData, CatalogCriteria, CatalogGETDataSearchResults> {
  
  constructor(   
  ) {
    super();
    
    // Set entity-specific properties
    this.searchHeading = 'Catalogs';
    this.showingAddButton = true;
    this.showingIdCheckbox = true;
    //this.searchPlaceholder = ...
  }

  protected getGridColumns(): any[] {
    return [
      //{ id: 'id', header: [{ text: 'ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'name', header: [{ text: 'Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'businessCode', header: [{ text: 'Business Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'description', header: [{ text: 'Description', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'urlPrefix', header: [{ text: 'URL Prefix', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'url', header: [{ text: 'URL', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'available', header: [{ text: 'Available', align: 'center' }, { content: 'inputFilter' }], minWidth: 100, adjust: true },
      { id: 'organizationId', header: [{ text: 'Organization', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'taxonomyEntryId', header: [{ text: 'Taxonomy Entry', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
//      { id: 'createdByInfo', header: [{ text: 'Created By', align: 'center' }], minWidth: 120, adjust: true },
  //    { id: 'dateCreated', header: [{ text: 'Date Created', align: 'center' }], minWidth: 120, adjust: true },
    //  { id: 'lastUpdatedByInfo', header: [{ text: 'Last Updated By', align: 'center' }], minWidth: 120, adjust: true },
      { id: 'dateLastUpdated', header: [{ text: 'Date Last Updated', align: 'center' }], minWidth: 120, adjust: true }
    ];
  }

  protected createCriteria(): CatalogCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected findEntities(criteria: CatalogCriteria): Observable<CatalogGETDataSearchResults> {
    return this.hcclService.findCatalogs(criteria);
  }

  protected hasSearchResults(response: CatalogGETDataSearchResults): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(response: CatalogGETDataSearchResults): CatalogGETData[] {
    return response.searchResults || [];
  }

  protected formatEntityData(entity: CatalogGETData): any {
    return {
      createdByInfo: entity.createdByInfo?.name || '',
      lastUpdatedByInfo: entity.lastUpdatedByInfo?.name || '',
      dateCreated: entity.dateCreated?.formattedDate || '',
      dateLastUpdated: entity.dateLastUpdated?.formattedDate || ''
    };
  }
  /**
   * Override onGoClick for entity-specific behavior
   */
  protected override onGoClick() {
    alert('onGoClick called');
    // Default implementation - can be customized for Catalog specific behavior
  }

  protected override onRowClick(entityId: string): void {
    console.log('onRowClick called with entityId:', entityId);
    this.router.navigate(['/ecoadmin-dashboard/catalogs', entityId, 'details']);
  }

  protected override onAdd(): void {
    this.router.navigate(['/ecoadmin-dashboard/catalogs', 'create']);
  }
} 