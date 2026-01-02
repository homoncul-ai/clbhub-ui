import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HcclService, PersonalStatementResumeGETData, PersonalStatementResumeCriteria, PersonalStatementResumeGETDataSearchResults } from '@app/restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { Observable } from 'rxjs';
import { PersonalStatementCrudWrapper } from '@app/components/_crud/personalstatement/personalstatement-crud.component';

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
export class StudentPersonalStatementResumeListComponent extends AbstractListComponent<PersonalStatementResumeGETData, PersonalStatementResumeCriteria, PersonalStatementResumeGETDataSearchResults> implements OnInit {
  
  @Input() personalStatementId?: string; // Optional: if provided, filter by this personal statement
  @Input() showAllResumes: boolean = false; // If true, show all resumes for the user
  
  constructor() {
    super();
    
    // Set entity-specific properties
    this.searchHeading = 'Resumes';
    this.showingAddButton = false; // We'll handle create via modal
    this.showingIdCheckbox = false;
  }

  override ngOnInit(): void {
    super.ngOnInit();
    // If showing all resumes, ensure we don't filter by personal statement
    if (this.showAllResumes) {
      this.personalStatementId = undefined;
    }
    this.setSelectedId('');
  }

  protected getGridColumns(): any[] {
    return [
      { id: 'title', header: [{ text: 'Title', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'personalStatementTitle', header: [{ text: 'Personal Statement Title', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'dateCreated', header: [{ text: 'Date Created', align: 'center' }], minWidth: 120, adjust: true },
      { id: 'dateLastUpdated', header: [{ text: 'Date Last Updated', align: 'center' }], minWidth: 120, adjust: true }
    ];
  }

  protected createCriteria(): PersonalStatementResumeCriteria {
    // Start with provided criteria or create new one
    var criteria: PersonalStatementResumeCriteria = this.criteria ? { ...this.criteria } : {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };

    // If personalStatementId is provided, filter by it (overrides criteria)
    if (this.personalStatementId) {
      criteria.personalStatmentId = this.personalStatementId;
      // Clear userProfileId if personalStatementId is set
      delete criteria.userProfileId;
    } else if (this.showAllResumes) {
      // If showing all resumes, filter by current user profile ID
      // Note: This assumes context is ready - if not, the search will be retried
      const userProfileId = this.hcclContextService.getCurrentUserProfileId();
      if (userProfileId) {
        criteria.userProfileId = userProfileId;
      }
      // Clear personalStatmentId if showing all resumes
      delete criteria.personalStatmentId;
    }
    // If neither is set, return criteria without filters (will show all)
    
    return criteria;
  }

  override async ngAfterViewInit(): Promise<void> {
    await super.ngAfterViewInit();
    
    // Wait for context if showing all resumes and context isn't ready yet
    if (this.showAllResumes && !this.hcclContextService.isReady()) {
      await this.hcclContextService.waitForReady();
      // Refresh the search with the updated criteria that includes userProfileId
      this.onRefresh();
    }
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
    const personalStatementTitle = await PersonalStatementCrudWrapper.newInstance(entity.personalStatmentId || '', this.hcclService)
    .then(wrapper => wrapper.getDisplayText());
    return {
      title: entity.title || '',
      personalStatementTitle: personalStatementTitle || '',
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

