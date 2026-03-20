import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HcclOrganizationInterestGETData,
  HcclOrganizationInterestCriteria,
  HcclOrganizationInterestGETDataSearchResults,
} from '@app/restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-hcclorganizationinterest-list',
  standalone: true,
  templateUrl: '../../_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../_global/abstract-list/abstract-list.component.scss'],
  imports: [CommonModule],
})
export class HcclOrganizationInterestListComponent extends AbstractListComponent<
  HcclOrganizationInterestGETData,
  HcclOrganizationInterestCriteria,
  HcclOrganizationInterestGETDataSearchResults
> {
  constructor() {
    super();
    this.searchHeading = 'Organization Interests';
    this.showingAddButton = true;
    this.showingIdCheckbox = true;
  }

  protected getGridColumns(): any[] {
    return [
      { id: 'interest', header: [{ text: 'Interest Level', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'orgName', header: [{ text: 'Organization Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 220, adjust: true },
      { id: 'orgBusinessCode', header: [{ text: 'Business Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 140, adjust: true },
      { id: 'orgTypeCode', header: [{ text: 'Org Type Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 140, adjust: true },
      { id: 'currentStateCode', header: [{ text: 'Current State', align: 'center' }, { content: 'inputFilter' }], minWidth: 140, adjust: true },
      { id: 'dateLastUpdated', header: [{ text: 'Date Last Updated', align: 'center' }], minWidth: 140, adjust: true },
    ];
  }

  protected createCriteria(): HcclOrganizationInterestCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true,
      optionalDataHint: 'all'
    };
  }

  protected findEntities(criteria: HcclOrganizationInterestCriteria): Observable<HcclOrganizationInterestGETDataSearchResults> {
    return this.hcclService.findHcclOrganizationInterests(criteria);
  }

  protected hasSearchResults(response: HcclOrganizationInterestGETDataSearchResults): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(response: HcclOrganizationInterestGETDataSearchResults): HcclOrganizationInterestGETData[] {
    return response.searchResults || [];
  }

  protected override async formatEntityDataAsync(entity: HcclOrganizationInterestGETData): Promise<any> {
    const organization: any = entity.organization || {};

    return {
      createdByInfo: entity.createdByInfo?.name || '',
      lastUpdatedByInfo: entity.lastUpdatedByInfo?.name || '',
      dateCreated: entity.dateCreated?.formattedDate || '',
      dateLastUpdated: entity.dateLastUpdated?.formattedDate || '',
      orgName: organization.name || '',
      orgBusinessCode: organization.businessCode || '',
      orgTypeCode: organization.organizationType.businessCode || '',
    };
  }
}
