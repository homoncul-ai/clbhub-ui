import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import {
  BaseCriteria,
  StudentCohortSummaryGETData,
} from '../../../restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';

interface CitizenCohortRow extends StudentCohortSummaryGETData {
  id?: string;
}

interface CitizenCohortListSearchResults {
  searchResults?: CitizenCohortRow[];
}

interface CitizenCohortListCriteria extends BaseCriteria {
  searchByText?: string;
}

@Component({
  selector: 'app-citizen-cohort-list',
  standalone: true,
  templateUrl: '../../_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../_global/abstract-list/abstract-list.component.scss'],
  imports: [CommonModule],
})
export class CitizenCohortListComponent extends AbstractListComponent<
  CitizenCohortRow,
  CitizenCohortListCriteria,
  CitizenCohortListSearchResults
> {
  constructor() {
    super();
    this.searchHeading = 'Cohorts';
    this.showingAddButton = false;
    this.showingIdCheckbox = false;
    this.searchPlaceholder = 'search by name, organization, or leader, * for wildcard';
  }

  protected getGridColumns(): any[] {
    return [
      { id: 'cohortName', header: [{ text: 'Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'organizationName', header: [{ text: 'Organization', align: 'center' }, { content: 'inputFilter' }], minWidth: 180, adjust: true },
      { id: 'leaderName', header: [{ text: 'Leader', align: 'center' }, { content: 'inputFilter' }], minWidth: 220, adjust: true },
      { id: 'dateCreated', header: [{ text: 'Date Created', align: 'center' }], minWidth: 140, adjust: true },
    ];
  }

  protected createCriteria(): CitizenCohortListCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true,
    };
  }

  protected findEntities(criteria: CitizenCohortListCriteria): Observable<CitizenCohortListSearchResults> {
    return this.hcclService.loadMyCohorts().pipe(
      map((data) => {
        let rows: CitizenCohortRow[] = (data.cohorts || []).map((cohort) => ({
          ...cohort,
          id: cohort.cohortId,
        }));
        const query = (criteria.searchByText || '').trim().toLowerCase();
        if (query && query !== '*') {
          rows = rows.filter((cohort) => {
            const haystack = [
              cohort.cohortName,
              cohort.organizationName,
              cohort.leaderName,
            ].join(' ').toLowerCase();
            return haystack.includes(query);
          });
        }
        return { searchResults: rows };
      }),
    );
  }

  protected hasSearchResults(response: CitizenCohortListSearchResults): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(response: CitizenCohortListSearchResults): CitizenCohortRow[] {
    return response.searchResults || [];
  }

  protected override extractId(entity: CitizenCohortRow): string {
    return entity.id || entity.cohortId || '';
  }

  protected override getBaseRoute(): string {
    return '/citizen/cohorts';
  }

  protected override async formatEntityDataAsync(entity: CitizenCohortRow): Promise<any> {
    return {
      id: entity.cohortId || entity.id || '',
      dateCreated: entity.dateCreated?.formattedDate || '',
    };
  }
}
