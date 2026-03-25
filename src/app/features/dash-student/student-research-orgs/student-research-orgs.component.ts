import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  HcclOrganizationCriteria,
  HcclOrganizationGETData,
  HcclOrganizationInterestGETData,
  HcclOrganizationInterestPOSTData,
  HcclService
} from '@app/restsvc/hccl.service';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { StdMarkdownDisplayComponent } from '@app/components/_global/std-markdown-display/std-markdown-display.component';

@Component({
  selector: 'app-student-research-orgs',
  standalone: true,
  imports: [CommonModule, FormsModule, StdMarkdownDisplayComponent],
  templateUrl: './student-research-orgs.component.html',
  styleUrls: ['./student-research-orgs.component.scss']
})
export class StudentResearchOrgsComponent implements OnInit {
  searchKeyword: string = '';
  hideIrrelevant: boolean = true;
  pageSize: number = 20;
  isLoading: boolean = false;
  hasSearched: boolean = false;
  error: string | null = null;
  rawSearchResults: HcclOrganizationGETData[] = [];

  constructor(
    private hcclService: HcclService,
    private hcclContextService: HcclContextService
  ) {}

  ngOnInit(): void {
    this.performSearch();
  }

  performSearch(): void {
    this.isLoading = true;
    this.hasSearched = true;
    this.error = null;
    this.rawSearchResults = [];

    const criteria: HcclOrganizationCriteria = {
      pageNumber: 1,
      pageSize: this.pageSize,
      isPaging: true,
      searchByText: this.searchKeyword || undefined,
      optionalDataHint: 'interest'
    };

    this.hcclService.findHcclOrganizations(criteria).subscribe({
      next: (response) => {
        this.isLoading = false;
        const orgs = response.searchResults || [];
        this.rawSearchResults = this.hideIrrelevant
          ? orgs.filter(org => !org.organizationInterest)
          : orgs;
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err?.message || 'Failed to search organizations';
      }
    });
  }

  markInterested(result: HcclOrganizationGETData): void {
    this.recordInterest(result, 10);
  }

  markNotInterested(result: HcclOrganizationGETData): void {
    this.recordInterest(result, 0);
  }

  toggleInterest(result: HcclOrganizationGETData): void {
    const currentInterest = result.organizationInterest?.interest || 0;
    this.recordInterest(result, currentInterest > 0 ? 0 : 10);
  }

  private recordInterest(result: HcclOrganizationGETData, interest: number): void {
    const userProfileId = this.hcclContextService.getCurrentUserProfileId() || '';
    if (!result.id || !userProfileId) {
      return;
    }

    const interestData: HcclOrganizationInterestPOSTData = {
      organizationId: result.id,
      userProfileId,
      interest,
      currentStateCode: '--ChangedOnEntry--'
    };

    this.hcclService.showInterestInOrg(interestData).subscribe({
      next: (response) => {
        if (!result.organizationInterest) {
          result.organizationInterest = {} as HcclOrganizationInterestGETData;
        }
        result.organizationInterest.interest = interest;
        if (response?.id) {
          result.organizationInterest.id = response.id;
          alert("id " + response.id + " " + JSON.stringify(result.organizationInterest));
        }
      },
      error: (error) => {
        console.error('Error recording organization interest:', error);
      }
    });
  }
}
