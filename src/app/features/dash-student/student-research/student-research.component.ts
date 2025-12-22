import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HcclService, VocationEncodingRefGETData, VocationEncodingRefCriteria } from '@app/restsvc/hccl.service';
import { VocationEncodingRefCrudComponent } from '@app/components/_crud/vocationencodingref/vocationencodingref-crud.component';
import { RouterModule } from '@angular/router';

export interface VocationEncodingRefResult {
  id: string;
  name: string;
  businessCode: string;
  description?: string;
  primaryCode?: number;
  secondaryCode?: number;
  available?: number;
}

@Component({
  selector: 'app-student-research',
  standalone: true,
  imports: [CommonModule, FormsModule, VocationEncodingRefCrudComponent, RouterModule],
  templateUrl: './student-research.component.html',
  styleUrls: ['./student-research.component.scss']
})
export class StudentResearchComponent implements OnInit {
  searchResults: VocationEncodingRefResult[] = [];
  rawSearchResults: VocationEncodingRefGETData[] = [];
  isLoading: boolean = false;
  hasSearched: boolean = false;

  // Search properties
  searchKeyword: string = '';
  showAvailableOnly: boolean = true;

  // Pagination
  pageSize: number = 20;

  constructor(
    private hcclService: HcclService
  ) {}

  ngOnInit(): void {
    // Don't auto-search on load - wait for user to click Search
  }

  performSearch() {
    this.isLoading = true;
    this.hasSearched = true;
    this.searchResults = [];

    const criteria: VocationEncodingRefCriteria = {
      pageNumber: 1,
      pageSize: this.pageSize,
      isPaging: true
    };

    // Add keyword search
    if (this.searchKeyword) {
      criteria.searchByText = this.searchKeyword;
    }

    // Add available only filter
    if (this.showAvailableOnly) {
      criteria.available = 1;
    }

    this.hcclService.findVocationEncodingRefs(criteria).subscribe({
      next: (response) => {
        console.log('Server Response:', response);
        this.isLoading = false;
        if (response.searchResults) {
          this.rawSearchResults = response.searchResults;
          this.searchResults = response.searchResults.map(entry => {
            const result: VocationEncodingRefResult = {
              id: entry.id || '',
              name: entry.name || '',
              businessCode: entry.businessCode || '',
              description: entry.description || '',
              primaryCode: entry.primaryCode,
              secondaryCode: entry.secondaryCode,
              available: entry.available
            };
            return result;
          });
        }
      },
      error: (error) => {
        console.error('Search error:', error);
        this.isLoading = false;
      }
    });
  }

  getDisplayCode(result: VocationEncodingRefResult): string {
    if (result.primaryCode !== undefined && result.secondaryCode !== undefined) {
      return `(${result.primaryCode}.${result.secondaryCode})`;
    } else if (result.primaryCode !== undefined) {
      return `(${result.primaryCode})`;
    }
    return '';
  }
}
