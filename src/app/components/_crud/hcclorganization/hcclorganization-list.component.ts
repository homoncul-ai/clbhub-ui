import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclService } from '../../../restsvc/hccl.service';
import { HcclOrganizationGETData, HcclOrganizationCriteria, HcclOrganizationGETDataSearchResults } from '../../../restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { Observable } from 'rxjs';
import { HcclOrganizationTypeRefCrudWrapper } from '../hcclorganizationtyperef/hcclorganizationtyperef-crud.component';

/**
 * Component for displaying and managing HcclOrganization data using HcclService
 * Extends AbstractListComponent for common grid functionality
 */

@Component({
  selector: 'app-hcclorganization-list',
  standalone: true,
  templateUrl: '../../_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../_global/abstract-list/abstract-list.component.scss'],
    imports: [CommonModule]
})
export class HcclOrganizationListComponent extends AbstractListComponent<HcclOrganizationGETData, HcclOrganizationCriteria, HcclOrganizationGETDataSearchResults> {
  
  constructor(   
  ) {
    super();
    
    // Set entity-specific properties
    this.searchHeading = 'HCCL Organizations';
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
      { id: 'available', header: [{ text: 'Available', align: 'center' }, { content: 'inputFilter' }], minWidth: 100, adjust: true },
      { id: 'organizationTypeCode', header: [{ text: 'Organization Type Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'websiteUrl', header: [{ text: 'Website URL', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'parentEntityName', header: [{ text: 'Parent Entity Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
//      { id: 'createdByInfo', header: [{ text: 'Created By', align: 'center' }], minWidth: 120, adjust: true },
  //    { id: 'dateCreated', header: [{ text: 'Date Created', align: 'center' }], minWidth: 120, adjust: true },
    //  { id: 'lastUpdatedByInfo', header: [{ text: 'Last Updated By', align: 'center' }], minWidth: 120, adjust: true },
      { id: 'dateLastUpdated', header: [{ text: 'Date Last Updated', align: 'center' }], minWidth: 120, adjust: true }
    ];
  }

  protected createCriteria(): HcclOrganizationCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected findEntities(criteria: HcclOrganizationCriteria): Observable<HcclOrganizationGETDataSearchResults> {
    return this.hcclService.findHcclOrganizations(criteria);
  }

  protected hasSearchResults(response: HcclOrganizationGETDataSearchResults): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(response: HcclOrganizationGETDataSearchResults): HcclOrganizationGETData[] {
    return response.searchResults || [];
  }


  protected override async formatEntityDataAsync(entity: HcclOrganizationGETData): Promise<any> {
    // if and FK, then create a CrudWrapper for the FK and add the displaytext of the crudwrapper
    const id = entity.organizationTypeId || '';
    if (id) {
      const crudWrapper = await HcclOrganizationTypeRefCrudWrapper.newInstance(id, this.hcclService);
      const typeName = crudWrapper.getDisplayText();
      debugger;
      return {
        createdByInfo: entity.createdByInfo?.name || '',
        lastUpdatedByInfo: entity.lastUpdatedByInfo?.name || '',
        dateCreated: entity.dateCreated?.formattedDate || '',
        dateLastUpdated: entity.dateLastUpdated?.formattedDate || '',
        organizationTypeCode: typeName
      };
    }
    return {};
  }

} 