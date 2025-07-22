// This template is for generating a LIST component for an entity that has a FK Menu
// This was generated using entityName = HcclTeamLog
// Generate the new [entityName]-list.component.ts   files using this template
// Of course, the code related to the attributes of the entity in the grid should be changed to match the entityName's attributes


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclService } from '../../../restsvc/hccl.service';
import { HcclTeamLogGETData, HcclTeamLogCriteria, HcclTeamLogGETDataSearchResults } from '../../../restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { Observable } from 'rxjs';
import { HcclTeamCrudWrapper } from '@app/components/_crud/hcclteam/hcclteam-crud.component';
import { HcclTeamMemberCrudWrapper } from '@app/components/_crud/teammember/teammember-crud.component';

/**
 * Component for displaying and managing HcclTeamLog data using HcclService
 * Extends AbstractListComponent for common grid functionality
 */

@Component({
  selector: 'app-hcclteamlog-list',
  standalone: true,
  templateUrl: '../../_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../_global/abstract-list/abstract-list.component.scss'],
    imports: [CommonModule]
})
export class HcclTeamLogListComponent extends AbstractListComponent<HcclTeamLogGETData, HcclTeamLogCriteria, HcclTeamLogGETDataSearchResults> {
  
  constructor(   
  ) {
    super();
    
    // Set entity-specific properties
    this.searchHeading = 'HCCL Team Logs';
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
      { id: 'nameText', header: [{ text: 'Name Text', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'description', header: [{ text: 'Description', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'teamStr', header: [{ text: 'Team', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'teamMemberStr', header: [{ text: 'Team Member', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'roleCode', header: [{ text: 'Role Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'actionCode', header: [{ text: 'Action Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'commentText', header: [{ text: 'Comment Text', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },

      // Commented out for now - not sure if we want to show this
//      { id: 'createdByInfo', header: [{ text: 'Created By', align: 'center' }], minWidth: 120, adjust: true },
  //    { id: 'dateCreated', header: [{ text: 'Date Created', align: 'center' }], minWidth: 120, adjust: true },
    //  { id: 'lastUpdatedByInfo', header: [{ text: 'Last Updated By', align: 'center' }], minWidth: 120, adjust: true },
      { id: 'dateLastUpdated', header: [{ text: 'Date Last Updated', align: 'center' }], minWidth: 120, adjust: true }
    ];
  }

  protected createCriteria(): HcclTeamLogCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected findEntities(criteria: HcclTeamLogCriteria): Observable<HcclTeamLogGETDataSearchResults> {
    return this.hcclService.findHcclTeamLogs(criteria);
  }

  protected hasSearchResults(response: HcclTeamLogGETDataSearchResults): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(response: HcclTeamLogGETDataSearchResults): HcclTeamLogGETData[] {
    return response.searchResults || [];
  }

  /**
   * Special attributes in the grid.  FK info needs to be added here.
   * @param entity 
   * @returns 
   */
  protected override async formatEntityDataAsync(entity: HcclTeamLogGETData): Promise<any> {
    // Every attribute of the form [prefix]Id is an "foreign key" and should be replaced with the displaytext of the crudwrapper
    const teamStr: string = entity.teamId == null ? 'unknown' : 
       (await HcclTeamCrudWrapper.newInstance(entity.teamId, this.hcclService)).getDisplayText();

    const teamMemberStr: string = entity.teamMemberId == null ? 'unknown' : 
       (await HcclTeamMemberCrudWrapper.newInstance(entity.teamMemberId, this.hcclService)).getDisplayText();

      return {
        createdByInfo: entity.createdByInfo?.name || '',
        lastUpdatedByInfo: entity.lastUpdatedByInfo?.name || '',
        dateCreated: entity.dateCreated?.formattedDate || '',
        dateLastUpdated: entity.dateLastUpdated?.formattedDate || '',
        teamStr: teamStr,
        teamMemberStr: teamMemberStr
      };
    }
  } 