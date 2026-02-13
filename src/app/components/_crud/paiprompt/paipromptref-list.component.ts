import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HcclService,
  PAiPromptRefGETData,
  PAiPromptRefCriteria,
  PAiPromptRefGETDataSearchResults
} from '@app/restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-paipromptref-list',
  standalone: true,
  templateUrl: '../../_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../_global/abstract-list/abstract-list.component.scss'],
  imports: [CommonModule]
})
export class PAIPromptRefListComponent extends AbstractListComponent<PAiPromptRefGETData, PAiPromptRefCriteria, PAiPromptRefGETDataSearchResults> {
  constructor() {
    super();
    this.searchHeading = 'PAI Prompt Refs';
    this.showingAddButton = true;
    this.showingIdCheckbox = true;
  }

  protected getGridColumns(): any[] {
    return [
      { id: 'name', header: [{ text: 'Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 220, adjust: true },
      { id: 'businessCode', header: [{ text: 'Business Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 140, adjust: true },
      { id: 'pojoClassName', header: [{ text: 'Pojo Class Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'description', header: [{ text: 'Description', align: 'center' }, { content: 'inputFilter' }], minWidth: 260, adjust: true },
      { id: 'available', header: [{ text: 'Available', align: 'center' }, { content: 'selectFilter' }], minWidth: 110, adjust: true },
      { id: 'dateLastUpdated', header: [{ text: 'Date Last Updated', align: 'center' }], minWidth: 150, adjust: true }
    ];
  }

  protected createCriteria(): PAiPromptRefCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected findEntities(criteria: PAiPromptRefCriteria): Observable<PAiPromptRefGETDataSearchResults> {
    return this.hcclService.findPAiPromptRefs(criteria);
  }

  protected hasSearchResults(response: PAiPromptRefGETDataSearchResults): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(response: PAiPromptRefGETDataSearchResults): PAiPromptRefGETData[] {
    return response.searchResults || [];
  }

  protected override async formatEntityDataAsync(entity: PAiPromptRefGETData): Promise<any> {
    return {
      available: entity.available ?? '',
      createdByInfo: entity.createdByInfo?.name || '',
      lastUpdatedByInfo: entity.lastUpdatedByInfo?.name || '',
      dateCreated: entity.dateCreated?.formattedDate || '',
      dateLastUpdated: entity.dateLastUpdated?.formattedDate || ''
    };
  }
}
