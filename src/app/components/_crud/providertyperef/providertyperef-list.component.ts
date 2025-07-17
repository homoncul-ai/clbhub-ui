import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclService } from '../../../restsvc/hccl.service';
import { ProviderTypeRefGETData, ProviderTypeRefCriteria, ProviderTypeRefGETDataSearchResults } from '../../../restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { Observable } from 'rxjs';

/**
 * Component for displaying and managing ProviderTypeRef data using HcclService
 * Extends AbstractListComponent for common grid functionality
 */

@Component({
  selector: 'app-providertyperef-list',
  templateUrl: './providertyperef-list.component.html',
  styleUrls: ['../list-search-starter.component.css'],
  imports: [CommonModule]
})
export class ProviderTypeRefListComponent extends AbstractListComponent<ProviderTypeRefGETData, ProviderTypeRefCriteria, ProviderTypeRefGETDataSearchResults> {
  
  constructor(
    hcclService: HcclService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(hcclService, route, router);
    
    // Set entity-specific properties
    this.searchHeading = 'Provider Types';
    this.searchPlaceholder = 'search by name or business code, * for wildcard';
  }

  protected getGridColumns(): any[] {
    return [
      { id: 'id', header: [{ text: 'ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'name', header: [{ text: 'Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'businessCode', header: [{ text: 'Business Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'description', header: [{ text: 'Description', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'available', header: [{ text: 'Available', align: 'center' }, { content: 'inputFilter' }], minWidth: 100, adjust: true },
      { id: 'createdByInfo', header: [{ text: 'Created By', align: 'center' }], minWidth: 120, adjust: true },
      { id: 'dateCreated', header: [{ text: 'Date Created', align: 'center' }], minWidth: 120, adjust: true },
      { id: 'lastUpdatedByInfo', header: [{ text: 'Last Updated By', align: 'center' }], minWidth: 120, adjust: true },
      { id: 'dateLastUpdated', header: [{ text: 'Date Last Updated', align: 'center' }], minWidth: 120, adjust: true }
    ];
  }

  protected createCriteria(): ProviderTypeRefCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected findEntities(criteria: ProviderTypeRefCriteria): Observable<ProviderTypeRefGETDataSearchResults> {
    return this.hcclService.findProviderTypeRefs(criteria);
  }

  protected hasSearchResults(response: ProviderTypeRefGETDataSearchResults): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(response: ProviderTypeRefGETDataSearchResults): ProviderTypeRefGETData[] {
    return response.searchResults || [];
  }

  protected formatEntityData(entity: ProviderTypeRefGETData): any {
    return {
      createdByInfo: entity.createdByInfo?.name || '',
      lastUpdatedByInfo: entity.lastUpdatedByInfo?.name || '',
      dateCreated: entity.dateCreated?.formattedDate || '',
      dateLastUpdated: entity.dateLastUpdated?.formattedDate || ''
    };
  }

  protected getDetailsRoute(): string {
    return '/ecoadmin-dashboard/providertyperefs';
  }

  protected onAdvancedSearchAction(checkedRows: any[], entityIds: string[]): void {
    // TODO: Implement tuning logic
    alert(`Tuning ${checkedRows.length} provider type ref(s): ` + entityIds.join(', '));
  }

  /**
   * Override onGoClick for entity-specific behavior
   */
  public override onGoClick() {
    alert('onGoClick called');
    // Default implementation - can be customized for ProviderTypeRef specific behavior
  }
} 