import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HcclService } from '@app/restsvc/hccl.service';
import { PersonalStatementCrudWrapper, PersonalStatementCrudComponent } from '@app/components/_crud/personalstatement/personalstatement-crud.component';
import { AbstractMultimodeComponent } from '@app/components/_global/abstract-multimode/abstract-multimode.component';
import { CatalogEntryCriteria, VeiSearchResultsGETData } from '@app/restsvc/hccl.service';
import { MdbModalService, MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { CatalogEntryModalComponent } from './catalog-entry-modal.component';
import { CatalogCrudComponent } from "@app/components/_crud/catalog/catalog-crud.component";

@Component({
  selector: 'app-student-personalstatement-search',
  standalone: true,
  imports: [CommonModule, FormsModule, PersonalStatementCrudComponent, CatalogCrudComponent],
  templateUrl: './student-personalstatement-search.component.html',
  styleUrl: '../../components/_global/abstract-crud/abstract-crud.component.scss'
})
export class StudentPersonalStatementSearchComponent extends AbstractMultimodeComponent<PersonalStatementCrudWrapper> implements OnInit  {
  
  @Input() searchType: string = '';
  
  // Inject modal service
  private modalService = inject(MdbModalService);
  private modalRef: MdbModalRef<CatalogEntryModalComponent> | null = null;
  
  // Properties for dropdown and search functionality
  selectedSearchType: string = '';
  searchKeyword: string = '';
  searchResults: VeiSearchResultsGETData | null = null;
  override loading: boolean = false;
  error: any = null;

  // Search type options
  searchTypes = [
    { value: 'all', label: 'All' },
    { value: 'jobs', label: 'Jobs' },
    { value: 'courses', label: 'Courses' },
    { value: 'events', label: 'Events' }
  ];

  /* update this page to have a dropdown with 3 choices : jobs, courses, events
    and a search button. 
    When the user selects a choice, update the criteria object with the appropriate criteria.
    Add a method "getCriteria" that returns a catalogentrycriteria object and pass it to the catalog entry list component.
    call the method queryCatalogEntries and display the VEISearchResultsGETData
   */

  override async ngOnInit(): Promise<void> {
    super.ngOnInit();
    console.log('PersonalStatementSearchComponent ngOnInit');
    this.entity = await PersonalStatementCrudWrapper.newInstance(this.id, this.hcclService);
    this.localModes = ['mode1', 'mode2'];
    this.loading = false;
    
    // Initialize searchType from input parameter if provided
    if (this.searchType && this.searchTypes.some(type => type.value === this.searchType)) {
      this.selectedSearchType = this.searchType;
      // Automatically perform search if searchType is provided
      this.performSearch();
    }
  }

  protected override async prepareModeEntry(entity: PersonalStatementCrudWrapper, mode: string): Promise<void> {
    super.prepareModeEntry(entity, mode);
    console.log('PersonalStatementSearchComponent prepareModeEntry ' + this.entity.dump);
    return Promise.resolve();
  }

  /**
   * Get criteria based on selected search type
   */
  getCriteria(): CatalogEntryCriteria {
    const criteria: CatalogEntryCriteria = {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true,
      vocationEncodingId: this.entity?.getVocationEncodingId(),
      searchByText: this.searchKeyword || undefined
    };

    // Add specific criteria based on search type
    switch (this.selectedSearchType) {
      case 'jobs':
        criteria.catalogTypeCode = 'JOB';
        break;
      case 'courses':
        criteria.catalogTypeCode = 'COURSE';
        break;
      case 'events':
        criteria.catalogTypeCode = 'EVENT';
        break;
    }

    return criteria;
  }

  /**
   * Perform search using queryCatalogEntries (findCatalogEntrysUsingVocode)
   */
  async performSearch(): Promise<void> {
    if (!this.selectedSearchType) {
      this.error = 'Please select a search type';
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const criteria = this.getCriteria();
      const results = await this.hcclService.findCatalogEntrysUsingVocode(criteria).toPromise();
      this.searchResults = results || null;
      console.log('Search results:', results);
    } catch (err) {
      this.error = 'Error performing search: ' + (err as any)?.message || 'Unknown error';
      console.error('Search error:', err);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Handle search type change
   */
  onSearchTypeChange(): void {
    // Clear previous results when search type changes
    this.searchResults = null;
    this.error = null;
  }

  /**
   * Handle search button click
   */
  onSearchClick(): void {
    this.searchKeyword = this.searchKeyword.trim();
    this.performSearch();
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
