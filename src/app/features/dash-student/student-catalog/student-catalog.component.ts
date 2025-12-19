import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HcclService, CatalogGETData, CatalogEntryGETData, CatalogCriteria, CatalogEntryCriteria, CatalogEntryInterestPOSTData, PersonalStatementGETData, PersonalStatementCriteria } from '@app/restsvc/hccl.service';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { CatalogEntryCrudComponent } from '@app/components/_crud/catalogentry/catalogentry-crud.component';
import { RouterModule } from '@angular/router';
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
  imports: [CommonModule, FormsModule, CatalogEntryCrudComponent, RouterModule],
  templateUrl: './student-catalog.component.html',
  styleUrls: ['./student-catalog.component.scss']
})
export class StudentCatalogComponent implements OnInit {
  searchResults: Opportunity[] = [];
  rawSearchResults: CatalogEntryGETData[] = [];
  isLargeFont: boolean = true;
  selectedCatalogs: string[] = [];
  isLoading: boolean = false;
  isLoadingPersonalStatements: boolean = false;

  // Personal Statements
  personalStatements: PersonalStatementGETData[] = [];
  selectedPersonalStatement: PersonalStatementGETData | null = null;

  // Search properties
  searchKeyword: string = '';
  selectedCategory: string = 'all';
  showAvailableOnly: boolean = false;

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
    this.loadPersonalStatements();
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

  loadPersonalStatements() {
    const userProfileId = this.hcclContextService.getCurrentUserProfileId();
    if (!userProfileId) {
      console.warn('User profile ID not available - waiting for context');
      // Retry after context is ready
      this.hcclContextService.waitForReady().then(() => {
        this.loadPersonalStatements();
      });
      return;
    }

    this.isLoadingPersonalStatements = true;
    const criteria: PersonalStatementCriteria = {
      parentEntityId: userProfileId,
      isPaging: false
    };

    this.hcclService.findPersonalStatements(criteria).subscribe({
      next: (response) => {
        this.isLoadingPersonalStatements = false;
        if (response.searchResults) {
          this.personalStatements = response.searchResults;
          // Auto-select first personal statement if available
          if (this.personalStatements.length > 0) {
            this.selectedPersonalStatement = this.personalStatements[0];
          }
        }
      },
      error: (error) => {
        console.error('Error loading personal statements:', error);
        this.isLoadingPersonalStatements = false;
      }
    });
  }

  selectPersonalStatement(ps: PersonalStatementGETData) {
    this.selectedPersonalStatement = ps;
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

    // Add available only filter
    if (this.showAvailableOnly) {
      criteria.available = 1;
    }

    alert("Search criteria: " + JSON.stringify(criteria));

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

  markInterested(result: Opportunity): void {
    console.log('Interested:', result.title);
    this.recordInterest(result, 10);
  }

  markNotInterested(result: Opportunity): void {
    console.log('Not Interested:', result.title);
    this.recordInterest(result, 0);
  }

  private recordInterest(result: Opportunity, interest: number): void {
    const userProfileId = this.hcclContextService.getCurrentUserProfileId() || '';
    
    const interestData: CatalogEntryInterestPOSTData = {
      catalogId: result.catalogId,
      catalogEntryId: result.id,
      personalStatementId: this.selectedPersonalStatement?.id || '',
      userProfileId: userProfileId,
      interest: interest,
      currentStateCode: '--ChangedOnEntry--'
    };

    this.hcclService.showInterest(interestData).subscribe({
      next: (response) => {
        console.log('Interest recorded successfully:', response);
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
