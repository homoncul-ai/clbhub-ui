// PersonalStatementResume LIST Component
// Generated from template-list.component.ts for entityName = PersonalStatementResume
// Extends AbstractListComponent - uses abstract list template (no custom template)

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclService } from '../../../restsvc/hccl.service';
import { PersonalStatementResumeGETData, PersonalStatementResumeCriteria, PersonalStatementResumeGETDataSearchResults } from '../../../restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { Observable } from 'rxjs';
import { HcclUserProfileCrudWrapper } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { PersonalStatementCrudWrapper } from '@app/components/_crud/personalstatement/personalstatement-crud.component';

/**
 * Component for displaying and managing PersonalStatementResume data using HcclService
 * Extends AbstractListComponent for common grid functionality
 */

@Component({
  selector: 'app-personalstatementresume-list',
  standalone: true,
  templateUrl: '../../_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../_global/abstract-list/abstract-list.component.scss'],
  imports: [CommonModule]
})
export class PersonalStatementResumeListComponent extends AbstractListComponent<PersonalStatementResumeGETData, PersonalStatementResumeCriteria, PersonalStatementResumeGETDataSearchResults> {
  
  constructor() {
    super();
    
    // Set entity-specific properties
    this.searchHeading = 'Personal Statement Resumes';
    this.showingAddButton = true;
    this.showingIdCheckbox = true;
  }

  // Grid columns configuration
  // Start with the id, dateCreated, dateLastUpdated, createdByInfo, lastUpdatedByInfo commented out.
  protected getGridColumns(): any[] {
    return [
      // id is commented out for now - not sure if we want to show this
      //{ id: 'id', header: [{ text: 'ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'title', header: [{ text: 'Title', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'userProfileStr', header: [{ text: 'User Profile', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'personalStatementStr', header: [{ text: 'Personal Statement', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'available', header: [{ text: 'Available', align: 'center' }, { content: 'inputFilter' }], minWidth: 100, adjust: true },
      // Commented out for now - not sure if we want to show this
      //{ id: 'createdByInfo', header: [{ text: 'Created By', align: 'center' }], minWidth: 120, adjust: true },
      //{ id: 'dateCreated', header: [{ text: 'Date Created', align: 'center' }], minWidth: 120, adjust: true },
      //{ id: 'lastUpdatedByInfo', header: [{ text: 'Last Updated By', align: 'center' }], minWidth: 120, adjust: true },
      { id: 'dateLastUpdated', header: [{ text: 'Date Last Updated', align: 'center' }], minWidth: 120, adjust: true }
    ];
  }

  protected createCriteria(): PersonalStatementResumeCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected findEntities(criteria: PersonalStatementResumeCriteria): Observable<PersonalStatementResumeGETDataSearchResults> {
    return this.hcclService.findPersonalStatementResumes(criteria);
  }

  protected hasSearchResults(response: PersonalStatementResumeGETDataSearchResults): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(response: PersonalStatementResumeGETDataSearchResults): PersonalStatementResumeGETData[] {
    return response.searchResults || [];
  }

  /**
   * Format entity data for display in the grid.
   * FK info needs to be added here to resolve foreign keys to display text.
   * @param entity 
   * @returns formatted entity data
   */
  protected override async formatEntityDataAsync(entity: PersonalStatementResumeGETData): Promise<any> {
    // Every attribute of the form [prefix]Id is a "foreign key" and should be replaced with the displaytext of the crudwrapper
    const userProfileStr: string = entity.userProfileId == null ? 'unknown' :
      (await HcclUserProfileCrudWrapper.newInstance(entity.userProfileId, this.hcclService)).getDisplayText();

    const personalStatementStr: string = entity.personalStatmentId == null ? 'unknown' :
      (await PersonalStatementCrudWrapper.newInstance(entity.personalStatmentId, this.hcclService)).getDisplayText();

    return {
      createdByInfo: entity.createdByInfo?.name || '',
      lastUpdatedByInfo: entity.lastUpdatedByInfo?.name || '',
      dateCreated: entity.dateCreated?.formattedDate || '',
      dateLastUpdated: entity.dateLastUpdated?.formattedDate || '',
      userProfileStr: userProfileStr,
      personalStatementStr: personalStatementStr
    };
  }

}

