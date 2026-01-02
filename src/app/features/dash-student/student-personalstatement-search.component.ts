import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HcclService, CatalogEntryGETData, CatalogEntryInterestPOSTData, CatalogEntryInterestGETData } from '@app/restsvc/hccl.service';
import { PersonalStatementCrudWrapper } from '@app/components/_crud/personalstatement/personalstatement-crud.component';
import { AbstractMultimodeComponent } from '@app/components/_global/abstract-multimode/abstract-multimode.component';
import { CatalogEntryCriteria, VeiSearchResultsGETData } from '@app/restsvc/hccl.service';
import { MdbModalService, MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { CatalogEntryModalComponent } from './catalog-entry-modal.component';
import { StdBubaComponent } from "@app/components/_global/std-buba/std-buba.component";

@Component({
  selector: 'app-student-personalstatement-search',
  standalone: true,
  imports: [CommonModule, FormsModule, StdBubaComponent],
  templateUrl: './student-personalstatement-search.component.html',
  styleUrls: ['./student-personalstatement-search.component.scss']
})
export class StudentPersonalStatementSearchComponent extends AbstractMultimodeComponent<PersonalStatementCrudWrapper> implements OnInit  {
  
  @Input() searchType: string = '';
  
  // Inject services
  private modalService = inject(MdbModalService);
  private modalRef: MdbModalRef<CatalogEntryModalComponent> | null = null;
  
  // Properties for search functionality
  searchKeyword: string = '';
  searchResults: VeiSearchResultsGETData | null = null;
  rawSearchResults: CatalogEntryGETData[] = [];
  override loading: boolean = false;
  error: any = null;

  // Filter properties
  selectedCategory: string = 'all';
  hideIrrelevant: boolean = true;

  // Pagination
  pageSize: number = 20;

  override async ngOnInit(): Promise<void> {
    super.ngOnInit();
    console.log('PersonalStatementSearchComponent ngOnInit');
    this.entity = await PersonalStatementCrudWrapper.newInstance(this.id, this.hcclService);
    this.localModes = ['mode1', 'mode2'];
    this.loading = false;
    
    // Initialize category from input parameter if provided
    if (this.searchType) {
      this.selectedCategory = this.searchType;
    }
    
    // Always perform search on page load
    this.performSearch();
  }

  protected override async prepareModeEntry(entity: PersonalStatementCrudWrapper, mode: string): Promise<void> {
    super.prepareModeEntry(entity, mode);
    console.log('PersonalStatementSearchComponent prepareModeEntry ' + this.entity.dump);
    return Promise.resolve();
  }

  /**
   * Select category filter
   */
  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.performSearch();
  }

  /**
   * Get criteria based on selected category
   */
  getCriteria(): CatalogEntryCriteria {
    const criteria: CatalogEntryCriteria = {
      pageNumber: 1,
      pageSize: this.pageSize,
      isPaging: true,
      vocationEncodingId: this.entity?.getVocationEncodingId(),
      searchByText: this.searchKeyword || undefined
    };

    // Add category filter based on selection
    if (this.selectedCategory !== 'all') {
      criteria.catalogTypeCode = this.selectedCategory;
    }

    // Hide irrelevant entries (those already marked with interest)
    criteria.ignoringWithInterest = this.hideIrrelevant;

    return criteria;
  }

  /**
   * Perform search using findCatalogEntrysUsingVocode
   */
  performSearch(): void {
    this.loading = true;
    this.error = null;
    this.rawSearchResults = [];

    const criteria = this.getCriteria();
    
    this.hcclService.findCatalogEntrysUsingVocode(criteria).subscribe({
      next: (response) => {
        console.log('Search results:', response);
        this.loading = false;
        this.searchResults = response || null;
        
        if (response?.catalogEntries?.searchResults) {
          this.rawSearchResults = response.catalogEntries.searchResults;
        }
      },
      error: (err) => {
        this.error = 'Error performing search: ' + (err?.message || 'Unknown error');
        console.error('Search error:', err);
        this.loading = false;
      }
    });
  }

  /**
   * Get catalog entry image URL
   */
  getCatalogEntryImageUrl(): string {
    return "imgs/TAROT-HR.png";
  }

  /**
   * Mark as interested (thumbs up)
   */
  markInterested(result: CatalogEntryGETData): void {
    console.log('Interested:', result.title);
    this.recordInterest(result, 10);
  }

  /**
   * Mark as not interested (thumbs down)
   */
  markNotInterested(result: CatalogEntryGETData): void {
    console.log('Not Interested:', result.title);
    this.recordInterest(result, 0);
  }

  /**
   * Toggle interest state
   */
  toggleInterest(result: CatalogEntryGETData): void {
    const currentInterest = result.catalogEntryInterest?.interest || 0;
    if (currentInterest > 0) {
      this.recordInterest(result, 0);
    } else {
      this.recordInterest(result, 10);
    }
  }

  /**
   * Record interest for a catalog entry
   */
  private recordInterest(result: CatalogEntryGETData, interest: number): void {
    const userProfileId = this.hcclContextService.getCurrentUserProfileId() || '';
    
    const interestData: CatalogEntryInterestPOSTData = {
      catalogId: result.catalogId || '',
      catalogEntryId: result.id || '',
      personalStatementId: this.id,
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
        if (response?.id) {
          result.catalogEntryInterest.id = response.id;
        }
      },
      error: (error) => {
        console.error('Error recording interest:', error);
      }
    });
  }

  /**
   * Open modal with the selected catalog entry
   */
  openModal(entryIndex: number): void {
    if (!this.searchResults?.catalogEntries?.searchResults) {
      return;
    }

    console.log('Opening modal with data:', {
      entries: this.searchResults.catalogEntries.searchResults,
      currentIndex: entryIndex,
      entriesLength: this.searchResults.catalogEntries.searchResults.length,
      personalStatementId: this.id,
      userProfileId: this.entity?.getData()?.parentEntityId || ''
    });

    this.modalRef = this.modalService.open(CatalogEntryModalComponent, {
      modalClass: 'modal-xl',
      data: {
        entries: this.searchResults.catalogEntries.searchResults,
        currentIndex: entryIndex,
        personalStatementId: this.id,
        userProfileId: this.entity?.getData()?.parentEntityId || ''
      }
    }) as MdbModalRef<CatalogEntryModalComponent>;

    // Handle modal close
    if (this.modalRef?.onClose) {
      this.modalRef.onClose.subscribe(() => {
        this.modalRef = null;
      });
    }
  }

  protected async loadEntityByIdCall(id: string): Promise<PersonalStatementCrudWrapper> {
    return PersonalStatementCrudWrapper.newInstance(id, this.hcclService);
  }
}
