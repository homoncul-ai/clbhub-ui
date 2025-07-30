// This template is for generating a LIST component for an entity that has a FK Menu
// This was generated using entityName = CLStudent
// Generate the new [entityName]-list.component.ts   files using this template
// Of course, the code related to the attributes of the entity in the grid should be changed to match the entityName's attributes


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclService, HcclUserGETData, HcclUserProfileCriteria, HcclUserProfileGETData, HcclUserProfileGETDataSearchResults } from '../../../restsvc/hccl.service';
import { CLStudentGETData, CLStudentCriteria, CLStudentGETDataSearchResults } from '../../../restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { Observable } from 'rxjs';
import { CLSchoolCrudWrapper } from '@app/components/_crud/clschool/clschool-crud.component';

/**
 * Component for displaying and managing CLStudent data using HcclService
 * Extends AbstractListComponent for common grid functionality
 */

@Component({
  selector: 'app-clstudent-list',
  standalone: true,
  templateUrl: '../../_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../_global/abstract-list/abstract-list.component.scss'],
    imports: [CommonModule]
})
export class CLStudentListComponent extends AbstractListComponent<CLStudentGETData, CLStudentCriteria, CLStudentGETDataSearchResults> {
  
  constructor(   
  ) {
    super();
    
    // Set entity-specific properties
    this.searchHeading = 'CL Students';
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
      { id: 'userProfileStr', header: [{ text: 'Account', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },

      { id: 'name', header: [{ text: 'Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'businessCode', header: [{ text: 'Business Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'firstName', header: [{ text: 'First Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'lastName', header: [{ text: 'Last Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'userEmail', header: [{ text: 'Email', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'cellPhoneNumber', header: [{ text: 'Cell Phone', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'workPhoneNumber', header: [{ text: 'Work Phone', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'available', header: [{ text: 'Available', align: 'center' }, { content: 'inputFilter' }], minWidth: 100, adjust: true },

      // Replace [prefix]Id with the displaytext of the crudwrapper - named [prefix]Str instead of [prefix]Id
      { id: 'schoolStr', header: [{ text: 'School', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },

      // Commented out for now - not sure if we want to show this
//      { id: 'createdByInfo', header: [{ text: 'Created By', align: 'center' }], minWidth: 120, adjust: true },
  //    { id: 'dateCreated', header: [{ text: 'Date Created', align: 'center' }], minWidth: 120, adjust: true },
    //  { id: 'lastUpdatedByInfo', header: [{ text: 'Last Updated By', align: 'center' }], minWidth: 120, adjust: true },
      { id: 'dateLastUpdated', header: [{ text: 'Date Last Updated', align: 'center' }], minWidth: 120, adjust: true }
    ];
  }

  protected createCriteria(): CLStudentCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected findEntities(criteria: CLStudentCriteria): Observable<CLStudentGETDataSearchResults> {
    return this.hcclService.findCLStudents(criteria);
  }

  protected hasSearchResults(response: CLStudentGETDataSearchResults): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(response: CLStudentGETDataSearchResults): CLStudentGETData[] {
    return response.searchResults || [];
  }

  /**
   * Special attributes in the grid.  FK info needs to be added here.
   * @param entity 
   * @returns 
   */
  protected override async formatEntityDataAsync(entity: CLStudentGETData): Promise<any> {
    // Get the entity ID
    const entityId: string = entity.id || '';
    
    // Every attribute of the form [prefix]Id is an "foreign key" and should be replaced with the displaytext of the crudwrapper
    const schoolStr: string = entity.schoolId == null ? 'unknown' : 
       (await CLSchoolCrudWrapper.newInstance(entity.schoolId, this.hcclService)).getDisplayText();

    // const hcclUserGETDataGD = 
    //    (await CLSchoolCrudWrapper.newInstance(entity.schoolId, this.hcclService)).getDisplayText();

    let userProfileStr: string = '';
    if (entity.id) { //clstudent.id
      let userProfile: HcclUserProfileGETData = this.mapFkUser.get(entity.id) || {};
      if (userProfile && userProfile.userEmail) {
        userProfileStr = userProfile.userEmail || '';
       console.log('userProfileStr: ' + userProfile.userEmail + ' ' + entity.id);
      }
    }

    return {
      id: entityId, // Include the entity ID in the formatted data
      createdByInfo: entity.createdByInfo?.name || '',
      lastUpdatedByInfo: entity.lastUpdatedByInfo?.name || '',
      dateCreated: entity.dateCreated?.formattedDate || '',
      dateLastUpdated: entity.dateLastUpdated?.formattedDate || '',
      schoolStr: schoolStr,
      userProfileStr: userProfileStr
    };
  }


  protected mapFkUser : Map<string, HcclUserProfileGETData> = new Map<string, HcclUserProfileGETData>();

  protected override async  preProcessEntities(entities: CLStudentGETData[], ids: string[]): Promise<void> {
    super.preProcessEntities(entities, ids);


    // Get the hcclUserGETData for each entity
    const criteria: HcclUserProfileCriteria = {
      externalUserIds: ids,
      externalUserEntityType: 'CLStudent'
    };
   this.hcclService.findHcclUserProfiles(criteria).subscribe((response: HcclUserProfileGETDataSearchResults) => {
    // loop through the users, update the map of id to UserProfile
    if (response.searchResults) {
      for (const user of response.searchResults) {
        let userProfile: HcclUserProfileGETData = user;
        let id: string = userProfile.externalUserId || '';
        this.mapFkUser.set(id, userProfile);
      }
    }
   });

    // Default implementation - subclasses can override
    return Promise.resolve();
  }

} 