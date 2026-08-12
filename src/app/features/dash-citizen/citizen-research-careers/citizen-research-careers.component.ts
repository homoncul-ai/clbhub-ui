import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  HcclService,
  VocationEncodingRefGETData,
  VocationEncodingRefCriteria
} from '@app/restsvc/hccl.service';
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
  selector: 'app-citizen-research-careers',
  standalone: true,
  imports: [CommonModule, FormsModule, VocationEncodingRefCrudComponent, RouterModule],
  templateUrl: './citizen-research-careers.component.html',
  styleUrls: ['./citizen-research-careers.component.scss']
})
export class CitizenResearchCareersComponent implements OnInit {
  searchResults: VocationEncodingRefResult[] = [];
  rawSearchResults: VocationEncodingRefGETData[] = [];
  isLoading: boolean = false;
  hasSearched: boolean = false;

  searchKeyword: string = '';
  showAvailableOnly: boolean = true;
  pageSize: number = 20;

  constructor(private hcclService: HcclService) {}

  ngOnInit(): void {
    // Wait for user search input.
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

    if (this.searchKeyword) {
      criteria.searchByText = this.searchKeyword;
    }

    if (this.showAvailableOnly) {
      criteria.available = 1;
    }

    this.hcclService.findVocationEncodingRefs(criteria).subscribe({
      next: (response) => {
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
      error: () => {
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
