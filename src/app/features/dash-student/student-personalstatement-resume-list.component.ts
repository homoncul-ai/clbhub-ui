import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HcclService, PersonalStatementResumeGETData, PersonalStatementResumeCriteria, PersonalStatementResumeGETDataSearchResults } from '@app/restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { Observable } from 'rxjs';

/**
 * Component for displaying and managing PersonalStatementResume data
 * Extends AbstractListComponent for common grid functionality
 */
@Component({
  selector: 'app-student-personalstatement-resume-list',
  standalone: true,
  templateUrl: '../../components/_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../components/_global/abstract-list/abstract-list.component.scss'],
  imports: [CommonModule]
})
export class StudentPersonalStatementResumeListComponent extends AbstractListComponent<PersonalStatementResumeGETData, PersonalStatementResumeCriteria, PersonalStatementResumeGETDataSearchResults> {
  
  constructor() {
    super();
    
    // Set entity-specific properties
    this.searchHeading = 'Resumes';
    this.showingAddButton = false; // We'll handle create via modal
    this.showingIdCheckbox = false;
  }

  protected getGridColumns(): any[] {
    return [
      { id: 'title', header: [{ text: 'Title', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'dateCreated', header: [{ text: 'Date Created', align: 'center' }], minWidth: 120, adjust: true },
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

  protected override async formatEntityDataAsync(entity: PersonalStatementResumeGETData): Promise<any> {
    return {
      createdByInfo: entity.createdByInfo?.name || '',
      lastUpdatedByInfo: entity.lastUpdatedByInfo?.name || '',
      dateCreated: entity.dateCreated?.formattedDate || '',
      dateLastUpdated: entity.dateLastUpdated?.formattedDate || ''
    };
  }

  /**
   * Override onRowClick to ensure resume navigation works correctly
   * This will be called when clicking on any cell in a row (except select/action columns)
   */
  protected override onRowClick(entityId: string): void {
    //alert('Resume list: onRowClick called with resumeId: ' + entityId + ' ' + this.router.url);
    // Call parent implementation which uses onRowClickBehavior
    super.onRowClick(entityId);
  }

}

