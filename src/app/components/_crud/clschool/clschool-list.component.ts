// This template is for generating a LIST component for an entity that has a FK Menu
// This was generated using entityName = CLSchool
// Generate the new [entityName]-list.component.ts   files using this template
// Of course, the code related to the attributes of the entity in the grid should be changed to match the entityName's attributes


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclService, HcclUserProfileCriteria, HcclUserProfileGETData, HcclUserProfileGETDataSearchResults } from '../../../restsvc/hccl.service';
import { CLSchoolGETData, CLSchoolCriteria, CLSchoolGETDataSearchResults } from '../../../restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { Observable } from 'rxjs';
import { HcclOrganizationCrudWrapper } from '@app/components/_crud/hcclorganization/hcclorganization-crud.component';

/**
 * Component for displaying and managing CLSchool data using HcclService
 * Extends AbstractListComponent for common grid functionality
 */

@Component({
  selector: 'app-clschool-list',
  standalone: true,
  templateUrl: '../../_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../_global/abstract-list/abstract-list.component.scss'],
    imports: [CommonModule]
})
export class CLSchoolListComponent extends AbstractListComponent<CLSchoolGETData, CLSchoolCriteria, CLSchoolGETDataSearchResults> {
  
  constructor(   
  ) {
    super();
    
    // Set entity-specific properties
    this.searchHeading = 'CL Schools';
    this.showingAddButton = true;
    this.showingIdCheckbox = true;
    //this.searchPlaceholder = ...
  }

  // Always start with the id column, then the attributes of the entity in the order you want them to appear in the grid
  // start with the id, dateCreated, dateLastUpdated, createdByInfo, lastUpdatedByInfo commented out.
  protected getGridColumns(): any[] {
    return [
      // id is commented out for now - not sure if we want to show this
      //{ id: 'id', header: [{ text: 'ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'name', header: [{ text: 'Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'businessCode', header: [{ text: 'Business Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'organizationName', header: [{ text: 'Organization Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'addressLine1', header: [{ text: 'Address Line 1', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'addressLine2', header: [{ text: 'Address Line 2', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'addressLine3', header: [{ text: 'Address Line 3', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'addressLine4', header: [{ text: 'Address Line 4', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'districtCode', header: [{ text: 'District Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'dataOriginCode', header: [{ text: 'Data Origin Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'available', header: [{ text: 'Available', align: 'center' }, { content: 'inputFilter' }], minWidth: 100, adjust: true },

      // Replace [prefix]Id with the displaytext of the crudwrapper - named [prefix]Str instead of [prefix]Id
      { id: 'organizationStr', header: [{ text: 'Organization', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },

      // Commented out for now - not sure if we want to show this
//      { id: 'createdByInfo', header: [{ text: 'Created By', align: 'center' }], minWidth: 120, adjust: true },
  //    { id: 'dateCreated', header: [{ text: 'Date Created', align: 'center' }], minWidth: 120, adjust: true },
    //  { id: 'lastUpdatedByInfo', header: [{ text: 'Last Updated By', align: 'center' }], minWidth: 120, adjust: true },
      { id: 'dateLastUpdated', header: [{ text: 'Date Last Updated', align: 'center' }], minWidth: 120, adjust: true }
    ];
  }

  protected createCriteria(): CLSchoolCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected findEntities(criteria: CLSchoolCriteria): Observable<CLSchoolGETDataSearchResults> {
    return this.hcclService.findCLSchools(criteria);
  }

  protected hasSearchResults(response: CLSchoolGETDataSearchResults): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(response: CLSchoolGETDataSearchResults): CLSchoolGETData[] {
    return response.searchResults || [];
  }

  /**
   * Special attributes in the grid.  FK info needs to be added here.
   * @param entity 
   * @returns 
   */
  protected override async formatEntityDataAsync(entity: CLSchoolGETData): Promise<any> {
    // Every attribute of the form [prefix]Id is an "foreign key" and should be replaced with the displaytext of the crudwrapper
    const organizationStr: string = entity.organizationId == null ? 'unknown' : 
       (await HcclOrganizationCrudWrapper.newInstance(entity.organizationId, this.hcclService)).getDisplayText();

    return {
      createdByInfo: entity.createdByInfo?.name || '',
      lastUpdatedByInfo: entity.lastUpdatedByInfo?.name || '',
      dateCreated: entity.dateCreated?.formattedDate || '',
      dateLastUpdated: entity.dateLastUpdated?.formattedDate || '',
      organizationStr: organizationStr
    };
  }
} 