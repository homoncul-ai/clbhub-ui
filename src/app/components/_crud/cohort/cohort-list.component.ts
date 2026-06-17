import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CohortCriteria,
  CohortGETData,
  CohortGETDataSearchResults,
  HcclService,
} from '../../../restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { Observable } from 'rxjs';
import { CohortCreateModalComponent } from './cohort-create-modal.component';

@Component({
  selector: 'app-cohort-list',
  standalone: true,
  templateUrl: '../../_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../_global/abstract-list/abstract-list.component.scss'],
  imports: [CommonModule],
})
export class CohortListComponent extends AbstractListComponent<
  CohortGETData,
  CohortCriteria,
  CohortGETDataSearchResults
> {
  constructor() {
    super();
    this.searchHeading = 'Cohorts';
    this.showingAddButton = true;
    this.showingIdCheckbox = true;
  }

  protected getGridColumns(): any[] {
    return [
      { id: 'name', header: [{ text: 'Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'businessCode', header: [{ text: 'Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 140, adjust: true },
      { id: 'description', header: [{ text: 'Description', align: 'center' }, { content: 'inputFilter' }], minWidth: 220, adjust: true },
      { id: 'currentStateCode', header: [{ text: 'Status', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'dateLastUpdated', header: [{ text: 'Date Last Updated', align: 'center' }], minWidth: 140, adjust: true },
    ];
  }

  protected createCriteria(): CohortCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true,
      optionalDataHint: 'all',
    };
  }

  protected findEntities(criteria: CohortCriteria): Observable<CohortGETDataSearchResults> {
    return this.hcclService.findCohorts(criteria);
  }

  protected hasSearchResults(response: CohortGETDataSearchResults): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(response: CohortGETDataSearchResults): CohortGETData[] {
    return response.searchResults || [];
  }

  protected override async formatEntityDataAsync(entity: CohortGETData): Promise<any> {
    return {
      dateLastUpdated: entity.dateLastUpdated?.formattedDate || entity.dateCreated?.formattedDate || '',
    };
  }

  protected override onAdd(): void {
    const modalRef = this.modalService.open(CohortCreateModalComponent, {
      modalClass: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });

    modalRef.onClose.subscribe((result: any) => {
      if (result?.created) {
        this.onRefresh();
      }
    });
  }
}
