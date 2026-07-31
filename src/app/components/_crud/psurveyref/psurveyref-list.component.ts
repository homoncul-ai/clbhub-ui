import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PSurveyRefGETData,
  PSurveyRefCriteria,
  PSurveyRefGETDataSearchResults,
} from '@app/restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { Observable } from 'rxjs';
import { ADMIN_SURVEYS_MANAGE_BASE, getPublicSurveyRoute } from '@app/features/surveys/survey-registry';

/**
 * Ecoadmin list for survey catalog metadata (PSurveyRef).
 * Expects HcclService PSurveyRef methods from swagger sync (001d).
 */
@Component({
  selector: 'app-psurveyref-list',
  standalone: true,
  templateUrl: '../../_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../_global/abstract-list/abstract-list.component.scss'],
  imports: [CommonModule],
})
export class PSurveyRefListComponent extends AbstractListComponent<
  PSurveyRefGETData,
  PSurveyRefCriteria,
  PSurveyRefGETDataSearchResults
> {
  constructor() {
    super();
    this.searchHeading = 'Manage Surveys';
    this.searchHeadingLabel = 'Manage Surveys';
    this.showingAddButton = false;
    this.showingIdCheckbox = false;
  }

  /** AbstractList only keeps one path segment after the dashboard; manage lives under surveys/. */
  protected override getBaseRoute(): string {
    return ADMIN_SURVEYS_MANAGE_BASE;
  }

  protected getGridColumns(): any[] {
    return [
      { id: 'name', header: [{ text: 'Title', align: 'center' }, { content: 'inputFilter' }], minWidth: 240, adjust: true },
      { id: 'surveyCode', header: [{ text: 'Code (slug)', align: 'center' }, { content: 'inputFilter' }], minWidth: 180, adjust: true },
      { id: 'description', header: [{ text: 'Description', align: 'center' }, { content: 'inputFilter' }], minWidth: 260, adjust: true },
      { id: 'available', header: [{ text: 'Available', align: 'center' }, { content: 'selectFilter' }], minWidth: 100, adjust: true },
      { id: 'publicLink', header: [{ text: 'Public', align: 'center' }], minWidth: 90, adjust: true },
      { id: 'resultsLink', header: [{ text: 'Results', align: 'center' }], minWidth: 90, adjust: true },
      { id: 'dateLastUpdated', header: [{ text: 'Date Last Updated', align: 'center' }], minWidth: 150, adjust: true },
    ];
  }

  protected createCriteria(): PSurveyRefCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true,
    };
  }

  protected findEntities(criteria: PSurveyRefCriteria): Observable<PSurveyRefGETDataSearchResults> {
    return this.hcclService.findPSurveyRefs(criteria);
  }

  protected hasSearchResults(response: PSurveyRefGETDataSearchResults): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(response: PSurveyRefGETDataSearchResults): PSurveyRefGETData[] {
    return response.searchResults || [];
  }

  protected override formatEntityData(entity: PSurveyRefGETData): any {
    const code = entity.surveyCode || '';
    return {
      available: (entity.available ?? 0) >= 1 ? 'true' : 'false',
      publicLink: getPublicSurveyRoute(code) || '',
      resultsLink: code ? `/ecoadmin-dashboard/surveys/${code}` : '',
      createdByInfo: entity.createdByInfo?.name || '',
      lastUpdatedByInfo: entity.lastUpdatedByInfo?.name || '',
      dateCreated: entity.dateCreated?.formattedDate || '',
      dateLastUpdated: entity.dateLastUpdated?.formattedDate || '',
    };
  }
}
