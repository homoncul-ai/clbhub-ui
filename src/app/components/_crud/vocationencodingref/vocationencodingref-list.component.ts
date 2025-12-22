import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclService } from '../../../restsvc/hccl.service';
import { VocationEncodingRefGETData, VocationEncodingRefCriteria, VocationEncodingRefGETDataSearchResults } from '../../../restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { Observable } from 'rxjs';

/**
 * Component for displaying and managing VocationEncodingRef data using HcclService
 * Extends AbstractListComponent for common grid functionality
 */

@Component({
  selector: 'app-vocationencodingref-list',
  standalone: true,
  templateUrl: '../../_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../_global/abstract-list/abstract-list.component.scss'],
  imports: [CommonModule]
})
export class VocationEncodingRefListComponent extends AbstractListComponent<VocationEncodingRefGETData, VocationEncodingRefCriteria, VocationEncodingRefGETDataSearchResults> {

  constructor() {
    super();

    // Set entity-specific properties
    this.searchHeading = 'Vocation Encoding Refs';
    this.showingAddButton = true;
    this.showingIdCheckbox = true;
  }

  protected getGridColumns(): any[] {
    return [
      //{ id: 'id', header: [{ text: 'ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'name', header: [{ text: 'Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'businessCode', header: [{ text: 'Business Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'description', header: [{ text: 'Description', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'primaryCode', header: [{ text: 'Primary Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 100, adjust: true },
      { id: 'secondaryCode', header: [{ text: 'Secondary Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 100, adjust: true },
      { id: 'available', header: [{ text: 'Available', align: 'center' }, { content: 'inputFilter' }], minWidth: 100, adjust: true },
      //{ id: 'createdByInfo', header: [{ text: 'Created By', align: 'center' }], minWidth: 120, adjust: true },
      //{ id: 'dateCreated', header: [{ text: 'Date Created', align: 'center' }], minWidth: 120, adjust: true },
      //{ id: 'lastUpdatedByInfo', header: [{ text: 'Last Updated By', align: 'center' }], minWidth: 120, adjust: true },
      { id: 'dateLastUpdated', header: [{ text: 'Date Last Updated', align: 'center' }], minWidth: 120, adjust: true }
    ];
  }

  protected createCriteria(): VocationEncodingRefCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected findEntities(criteria: VocationEncodingRefCriteria): Observable<VocationEncodingRefGETDataSearchResults> {
    return this.hcclService.findVocationEncodingRefs(criteria);
  }

  protected hasSearchResults(response: VocationEncodingRefGETDataSearchResults): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(response: VocationEncodingRefGETDataSearchResults): VocationEncodingRefGETData[] {
    return response.searchResults || [];
  }

  protected override formatEntityData(entity: VocationEncodingRefGETData): any {
    return {
      createdByInfo: entity.createdByInfo?.name || '',
      lastUpdatedByInfo: entity.lastUpdatedByInfo?.name || '',
      dateCreated: entity.dateCreated?.formattedDate || '',
      dateLastUpdated: entity.dateLastUpdated?.formattedDate || ''
    };
  }
}

