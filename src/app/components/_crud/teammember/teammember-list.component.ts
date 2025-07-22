// This template is for generating a LIST component for an entity that has a FK Menu
// This was generated using entityName = TeamMember
// Generate the new teammember-list.component.ts   files using this template
// Of course, the code related to the attributes of the entity in the grid should be changed to match the entityName's attributes


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclService } from '../../../restsvc/hccl.service';
import { HcclTeamMemberGETData, HcclTeamMemberCriteria, HcclTeamMemberGETDataSearchResults } from '../../../restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { Observable } from 'rxjs';
import { HcclTeamCrudWrapper } from '@app/components/_crud/hcclteam/hcclteam-crud.component';
import { HcclUserCrudWrapper } from '@app/components/_crud/hccluser/hccluser-crud.component';
import { HcclUserProfileCrudWrapper } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';

/**
 * Component for displaying and managing HcclTeamMember data using HcclService
 * Extends AbstractListComponent for common grid functionality
 */

@Component({
  selector: 'app-teammember-list',
  standalone: true,
  templateUrl: '../../_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../_global/abstract-list/abstract-list.component.scss'],
    imports: [CommonModule]
})
export class TeamMemberListComponent extends AbstractListComponent<HcclTeamMemberGETData, HcclTeamMemberCriteria, HcclTeamMemberGETDataSearchResults> {
  
  constructor(   
  ) {
    super();
    
    // Set entity-specific properties
    this.searchHeading = 'Team Members';
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
      { id: 'teamId', header: [{ text: 'Team ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'userId', header: [{ text: 'User ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'userProfileId', header: [{ text: 'User Profile ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'dateAdded', header: [{ text: 'Date Added', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'dateRemoved', header: [{ text: 'Date Removed', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },

      // Replace [prefix]Id with the displaytext of the crudwrapper - named [prefix]Str instead of [prefix]Id
      { id: 'teamStr', header: [{ text: 'Team', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'userStr', header: [{ text: 'User', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'userProfileStr', header: [{ text: 'User Profile', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },

      // Commented out for now - not sure if we want to show this
//      { id: 'createdByInfo', header: [{ text: 'Created By', align: 'center' }], minWidth: 120, adjust: true },
  //    { id: 'dateCreated', header: [{ text: 'Date Created', align: 'center' }], minWidth: 120, adjust: true },
    //  { id: 'lastUpdatedByInfo', header: [{ text: 'Last Updated By', align: 'center' }], minWidth: 120, adjust: true },
      { id: 'dateLastUpdated', header: [{ text: 'Date Last Updated', align: 'center' }], minWidth: 120, adjust: true }
    ];
  }

  protected createCriteria(): HcclTeamMemberCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected findEntities(criteria: HcclTeamMemberCriteria): Observable<HcclTeamMemberGETDataSearchResults> {
    return this.hcclService.findHcclTeamMembers(criteria);
  }

  protected hasSearchResults(response: HcclTeamMemberGETDataSearchResults): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(response: HcclTeamMemberGETDataSearchResults): HcclTeamMemberGETData[] {
    return response.searchResults || [];
  }

  /**
   * Special attributes in the grid.  FK info needs to be added here.
   * @param entity 
   * @returns 
   */
  protected override async formatEntityDataAsync(entity: HcclTeamMemberGETData): Promise<any> {
    // Every attribute of the form [prefix]Id is an "foreign key" and should be replaced with the displaytext of the crudwrapper
    const teamStr  :string = entity.teamId  == null ? 'unknown' : 
       (await HcclTeamCrudWrapper.newInstance(entity.teamId , this.hcclService)).getDisplayText();

    const userStr  :string = entity.userId  == null ? 'unknown' : 
       (await HcclUserCrudWrapper.newInstance(entity.userId , this.hcclService)).getDisplayText();

    const userProfileStr  :string = entity.userProfileId  == null ? 'unknown' : 
       (await HcclUserProfileCrudWrapper.newInstance(entity.userProfileId , this.hcclService)).getDisplayText();

      return {
        createdByInfo: entity.createdByInfo?.name || '',
        lastUpdatedByInfo: entity.lastUpdatedByInfo?.name || '',
        dateCreated: entity.dateCreated?.formattedDate || '',
        dateLastUpdated: entity.dateLastUpdated?.formattedDate || '',
        teamStr: teamStr,
        userStr: userStr,
        userProfileStr: userProfileStr
      };
    }
  } 