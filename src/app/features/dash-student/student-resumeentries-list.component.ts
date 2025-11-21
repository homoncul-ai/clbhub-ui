import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HcclService, ResumeEntryGETData, ResumeEntryCriteria, ResumeEntryGETDataSearchResults } from '@app/restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { Observable } from 'rxjs';

/**
 * Component for displaying and managing ResumeEntry data
 * Extends AbstractListComponent for common grid functionality
 */
@Component({
  selector: 'app-student-resumeentries-list',
  standalone: true,
  templateUrl: '../../components/_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../components/_global/abstract-list/abstract-list.component.scss'],
  imports: [CommonModule]
})
export class StudentResumeEntriesListComponent extends AbstractListComponent<ResumeEntryGETData, ResumeEntryCriteria, ResumeEntryGETDataSearchResults> {
  
  constructor() {
    super();
    
    // Set entity-specific properties
    this.searchHeading = 'Resume Entries';
    this.showingAddButton = false;
    this.showingIdCheckbox = false;
  }

  protected getGridColumns(): any[] {
    return [
      { id: 'title', header: [{ text: 'Title', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'organizationName', header: [{ text: 'Organization', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'position', header: [{ text: 'Position', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'dateStart', header: [{ text: 'Start Date', align: 'center' }], minWidth: 120, adjust: true },
      { id: 'dateEnd', header: [{ text: 'End Date', align: 'center' }], minWidth: 120, adjust: true },
      { id: 'dateCreated', header: [{ text: 'Date Created', align: 'center' }], minWidth: 120, adjust: true },
      { id: 'dateLastUpdated', header: [{ text: 'Date Last Updated', align: 'center' }], minWidth: 120, adjust: true }
    ];
  }

  protected createCriteria(): ResumeEntryCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected findEntities(criteria: ResumeEntryCriteria): Observable<ResumeEntryGETDataSearchResults> {
    return this.hcclService.findResumeEntrys(criteria);
  }

  protected hasSearchResults(response: ResumeEntryGETDataSearchResults): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(response: ResumeEntryGETDataSearchResults): ResumeEntryGETData[] {
    return response.searchResults || [];
  }

  protected override async formatEntityDataAsync(entity: ResumeEntryGETData): Promise<any> {
    // Extract data from theResumeEntryPojo if available, otherwise use direct fields
    const pojo = entity.theResumeEntryPojo;
    const organizationName = pojo?.organizationName || '';
    const position = pojo?.position || '';
    const dateStart = pojo?.dateStart || '';
    const dateEnd = pojo?.dateEnd || '';

    return {
      title: entity.title || '',
      organizationName: organizationName,
      position: position,
      dateStart: this.formatDate(dateStart),
      dateEnd: this.formatDate(dateEnd),
      createdByInfo: entity.createdByInfo?.name || '',
      lastUpdatedByInfo: entity.lastUpdatedByInfo?.name || '',
      dateCreated: entity.dateCreated?.formattedDate || '',
      dateLastUpdated: entity.dateLastUpdated?.formattedDate || ''
    };
  }

  protected formatDate(dateString?: string): string {
    if (!dateString) {
      return '';
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return original string if invalid date
      }
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (error) {
      return dateString; // Return original string if parsing fails
    }
  }

  /**
   * Override onRowClick to ensure resume entry navigation works correctly
   */
  protected override onRowClick(entityId: string): void {
    super.onRowClick(entityId);
  }
}

