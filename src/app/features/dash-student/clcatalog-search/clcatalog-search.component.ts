import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HcclService, CatalogGETData, CatalogEntryGETData, CatalogCriteria, CatalogEntryCriteria } from '@app/restsvc/hccl.service';

export interface Opportunity {
  title: string;
  catalogId: string;
  dateLastUpdated?: string;
  url?: string;
  description?: string;
  available?: number;
}

@Component({
  selector: 'app-clcatalog-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clcatalog-search.component.html',
  styleUrls: ['./clcatalog-search.component.scss']
})
export class CLCatalogSearchComponent implements OnInit {
  selectedTab: string = 'simple';
  searchResults: Opportunity[] = [];
  rawSearchResults: CatalogEntryGETData[] = [];
  isLargeFont: boolean = true;
  selectedCatalogs: string[] = [];

  // Advanced search properties
  advKeyword: string = '';
  advAvailableOnly: boolean = false;
  showDebug: boolean = false;
  simpleKeyword: string = '';

  // Catalog Data
  catalogs: CatalogGETData[] = [];

  constructor(private hcclService: HcclService) {}

  ngOnInit(): void {
    this.loadCatalogs();
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  onCatalogChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedCatalogs.push(checkbox.id);
    } else {
      this.selectedCatalogs = this.selectedCatalogs.filter(c => c !== checkbox.id);
    }

    if (this.selectedTab === 'simple') {
      this.search();
    } else {
      this.advancedSearch();
    }
  }

  loadCatalogs() {
    const criteria: CatalogCriteria = { isPaging: false };
    this.hcclService.findCatalogs(criteria).subscribe(response => {
      if (response.searchResults) {
        this.catalogs = response.searchResults;
      }
    });
  }

  search() {
    if (this.selectedCatalogs.length === 0) {
      this.searchResults = [];
      return;
    }

    const criteria: CatalogEntryCriteria = {
      catalogId: this.selectedCatalogs.join(','), // Join selected catalogs
      searchByText: this.simpleKeyword,
    };
    console.log("Search criteria: " + JSON.stringify(criteria))

    this.hcclService.findCatalogEntrys(criteria).subscribe(response => {
      console.log('Server Response:', response);
      if (response.searchResults) {
        this.rawSearchResults = response.searchResults;
        this.searchResults = response.searchResults.map(entry => {
          const opportunity: Opportunity = {
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
    });
  }

  advancedSearch() {
    if (this.selectedCatalogs.length === 0) {
      this.searchResults = [];
      return;
    }

    const criteria: CatalogEntryCriteria = {
      catalogId: this.selectedCatalogs.join(','), // Join selected catalogs
    };

    if (this.advKeyword) {
      criteria.searchByText = this.advKeyword;
    }
    if (this.advAvailableOnly) {
      criteria.available = 1;
    }
    console.log("Search criteria: " + JSON.stringify(criteria))

    this.hcclService.findCatalogEntrys(criteria).subscribe(response => {
      console.log('Server Response:', response);
      if (response.searchResults) {
        this.rawSearchResults = response.searchResults;
        this.searchResults = response.searchResults.map(entry => {
          const opportunity: Opportunity = {
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
    });
  }

  toggleFontSize() {
    this.isLargeFont = !this.isLargeFont;
  }
}

