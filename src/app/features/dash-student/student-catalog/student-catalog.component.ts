import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HcclService, CatalogGETData, CatalogEntryGETData, CatalogCriteria, CatalogEntryCriteria, CatalogEntryInterestPOSTData, CatalogEntryInterestGETData, PersonalStatementGETData } from '@app/restsvc/hccl.service';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { CatalogEntryCrudComponent } from '@app/components/_crud/catalogentry/catalogentry-crud.component';
import { RouterModule } from '@angular/router';
import { PersonalStatementSelectorComponent } from '@app/components/_global/personal-statement-selector/personal-statement-selector.component';

export interface Opportunity {
  id: string;
  title: string;
  catalogId: string;
  dateLastUpdated?: string;
  url?: string;
  description?: string;
  available?: number;
}

@Component({
  selector: 'app-student-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, CatalogEntryCrudComponent, RouterModule, PersonalStatementSelectorComponent],
  templateUrl: './student-catalog.component.html',
  styleUrls: ['./student-catalog.component.scss']
})
export class StudentCatalogComponent implements OnInit {
  searchResults: Opportunity[] = [];
  rawSearchResults: CatalogEntryGETData[] = [];
  isLargeFont: boolean = true;
  selectedCatalogs: string[] = [];
  isLoading: boolean = false;

  // Personal Statement (from selector component)
  selectedPersonalStatement: PersonalStatementGETData | null = null;

  // Search properties
  searchKeyword: string = '';
  selectedCategory: string = 'all';
  hideIrrelevant: boolean = true;

  // Pagination
  pageSize: number = 20;

  // Catalog Data
  catalogs: CatalogGETData[] = [];

  constructor(
    private hcclService: HcclService,
    private hcclContextService: HcclContextService
  ) {}

  ngOnInit(): void {
    this.loadCatalogs();
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    // Don't auto-search, wait for user to click Search button
  }

  loadCatalogs() {
    const criteria: CatalogCriteria = { isPaging: false };
    this.hcclService.findCatalogs(criteria).subscribe(response => {
      if (response.searchResults) {
        this.catalogs = response.searchResults;
        // Auto-select all catalogs
        this.selectedCatalogs = this.catalogs.map(c => c.id || '').filter(id => id);
      }
    });
  }

  onPersonalStatementChange(ps: PersonalStatementGETData | null): void {
    const previousId = this.selectedPersonalStatement?.id;
    this.selectedPersonalStatement = ps;
    
    // Re-run search if a different personal statement is selected and we have a valid selection
    if (ps && ps.id !== previousId) {
      this.performSearch();
    }
  }

  canSearch(): boolean {
    return this.selectedPersonalStatement !== null;
  }

  protected getCatalogEntryImageUrl(): string {
    return "imgs/TAROT-HR.png";
  }

  performSearch() {
    if (!this.canSearch()) {
      console.warn('Please select a personal statement before searching');
      return;
    }

    this.isLoading = true;
    this.searchResults = [];

    const criteria: CatalogEntryCriteria = {
      // First page of results
      pageNumber: 1,
      pageSize: this.pageSize,
      isPaging: true
    };

    // Add vocation encoding from selected personal statement
    if (this.selectedPersonalStatement?.vocationEncodingId) {
      criteria.vocationEncodingId = this.selectedPersonalStatement.vocationEncodingId;
    }

    // Add category filter based on selection
    if (this.selectedCategory !== 'all') {
      criteria.catalogTypeCode = this.selectedCategory;
    } 
    //else if (this.selectedCatalogs.length > 0) {
    //   criteria.catalogId = this.selectedCatalogs.join(',');
    // }

    // Add keyword search
    if (this.searchKeyword) {
      criteria.searchByText = this.searchKeyword;
    }

    // Hide irrelevant entries (those already marked with interest)
    criteria.ignoringWithInterest = this.hideIrrelevant;

   // alert("Search criteria: " + JSON.stringify(criteria));

    this.hcclService.findCatalogEntrysUsingVocode(criteria).subscribe({
      next: (response) => {
        console.log('Server Response:', response);
        this.isLoading = false;
        // VeiSearchResultsGETData has catalogEntries which contains searchResults
        if (response.catalogEntries?.searchResults) {
          this.rawSearchResults = response.catalogEntries.searchResults;
          this.searchResults = response.catalogEntries.searchResults.map(entry => {
            const opportunity: Opportunity = {
              id: entry.id || '',
              title: entry.title || '',
              catalogId: entry.catalogId || '',
              dateLastUpdated: entry.dateLastUpdated?.formattedDateTime || 'N/A',
              url: entry.url || '#',
              description: entry.description || '',
              available: entry.available
            };
            return opportunity;
          });
        }
      },
      error: (error) => {
        console.error('Search error:', error);
        this.isLoading = false;
      }
    });
  }

  markInterested(result: CatalogEntryGETData): void {
    console.log('Interested:', result.title);
    this.recordInterest(result, 10);
  }

  markNotInterested(result: CatalogEntryGETData): void {
    console.log('Not Interested:', result.title);
    this.recordInterest(result, 0);
  }

  toggleInterest(result: CatalogEntryGETData): void {
    // If currently interested, mark as not interested; otherwise mark as interested
    const currentInterest = result.catalogEntryInterest?.interest || 0;
    if (currentInterest > 0) {
      this.recordInterest(result, 0);
    } else {
      this.recordInterest(result, 10);
    }
  }

  private recordInterest(result: CatalogEntryGETData, interest: number): void {
    const userProfileId = this.hcclContextService.getCurrentUserProfileId() || '';
    
    const interestData: CatalogEntryInterestPOSTData = {
      catalogId: result.catalogId || '',
      catalogEntryId: result.id || '',
      personalStatementId: this.selectedPersonalStatement?.id || '',
      userProfileId: userProfileId,
      interest: interest,
      currentStateCode: '--ChangedOnEntry--'
    };

    this.hcclService.showInterest(interestData).subscribe({
      next: (response) => {
        console.log('Interest recorded successfully:', response);
        // Update the local data to reflect the change
        if (!result.catalogEntryInterest) {
          result.catalogEntryInterest = {} as CatalogEntryInterestGETData;
        }
        result.catalogEntryInterest.interest = interest;
        // If response contains the created/updated interest object, use it
        if (response?.id) {
          result.catalogEntryInterest.id = response.id;
        }
      },
      error: (error) => {
        console.error('Error recording interest:', error);
      }
    });
  }

  toggleFontSize() {
    this.isLargeFont = !this.isLargeFont;
  }
}
