import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CatalogEntryGETDataSearchResults, HcclService } from '@app/restsvc/hccl.service';
import { AbstractMultimodeComponent } from '@app/components/_global/abstract-multimode/abstract-multimode.component';
import { CatalogEntryCriteria, VeiSearchResultsGETData } from '@app/restsvc/hccl.service';
import { MdbModalService, MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { SwcatEntryModalComponent } from './modals/swcat-entry-modal.component';
import { CatalogCrudComponent } from "@app/components/_crud/catalog/catalog-crud.component";
import { HcclUserProfileCrudWrapper } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';

@Component({
  selector: 'app-swcat-trutesta-tab-overview',
  standalone: true,
  imports: [CommonModule, FormsModule, CatalogCrudComponent],
  templateUrl: './dash-swcat-trutesta-tab-overview.component.html',
  styleUrl: '../../components/_global/abstract-crud/abstract-crud.component.scss'
})
export class DashSwcatTrutestaTabOverviewComponent extends AbstractMultimodeComponent<HcclUserProfileCrudWrapper> implements OnInit  {
  
  @Input() searchType: string = '';
  
  // Inject modal service
  private modalService = inject(MdbModalService);
  private modalRef: MdbModalRef<SwcatEntryModalComponent> | null = null;
  
  // Properties for dropdown and search functionality
  selectedSearchType: string = '';
  searchResults: CatalogEntryGETDataSearchResults | null = null;
  override loading: boolean = false;
  error: any = null;

  // Search type options
  searchTypes = [
    { value: 'Legacy GBS', label: 'GBS' },
    { value: 'Intertek Cloud Custom', label: 'Intertek Cloud Custom' },
    { value: 'Trutesta Licensed', label: 'Trutesta Licensed' }
  ];

  override async ngOnInit(): Promise<void> {
    super.ngOnInit();
    console.log('DashSwcatTrutestaTabOverviewComponent ngOnInit');
    console.log('Component id:', this.id);
    console.log('SearchTypes:', this.searchTypes);
    
    // Create a default entity if no id is provided
    if (this.id) {
      this.entity = await HcclUserProfileCrudWrapper.newInstance(this.id, this.hcclService);
    } else {
      // Create a new instance for create mode
      this.entity = HcclUserProfileCrudWrapper.newInstanceForCreate(this.hcclService);
    }
    
    this.localModes = ['mode1', 'mode2'];
    this.loading = false;
    
    // Initialize searchType from input parameter if provided
    if (this.searchType && this.searchTypes.some(type => type.value === this.searchType)) {
      this.selectedSearchType = this.searchType;
      // Automatically perform search if searchType is provided
      this.performSearch();
    }
  }

  protected override async prepareModeEntry(entity: HcclUserProfileCrudWrapper, mode: string): Promise<void> {
    super.prepareModeEntry(entity, mode);
    console.log('DashSwcatTrutestaTabOverviewComponent prepareModeEntry ' + this.entity.dump);
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
      entryGroupCode: this.selectedSearchType
    };


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
      const results = await this.hcclService.findCatalogEntrys(criteria).toPromise();
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
    this.performSearch();
  }

  /**
   * Open modal with the selected catalog entry
   */
  openModal(entryIndex: number): void {
    if (!this.searchResults?.searchResults) {
      return;
    }

    console.log('Opening modal with data:', {
      entries: this.searchResults?.searchResults,
      currentIndex: entryIndex,
      entriesLength: this.searchResults?.searchResults.length,
      userProfileId: this.id || ''
    });

    this.modalRef = this.modalService.open(SwcatEntryModalComponent, {
      modalClass: 'modal-xl',
      data: {
        entries: this.searchResults?.searchResults,
        currentIndex: entryIndex,
        userProfileId: this.id
      }
    }) as MdbModalRef<SwcatEntryModalComponent>;

    // Handle modal close
    if (this.modalRef?.onClose) {
      this.modalRef.onClose.subscribe(() => {
        this.modalRef = null;
      });
    }
  }

  protected async loadEntityByIdCall(id: string): Promise<HcclUserProfileCrudWrapper> {
    return HcclUserProfileCrudWrapper.newInstance(id, this.hcclService);
  }


}
