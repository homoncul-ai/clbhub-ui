import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclService } from '../../../restsvc/hccl.service';
import { ProviderTypeRefGETData, ProviderTypeRefCriteria, ProviderTypeRefGETDataSearchResults, SimpleRestActionResponse } from '../../../restsvc/hccl.service';

declare const dhx: any;

/**
 * Component for displaying and managing ProviderTypeRef data using HcclService
 * Uses ProviderTypeRefGETData interface for proper field mapping and labels
 */

@Component({
  selector: 'app-providertyperef-list',
  templateUrl: './providertyperef-list.component.html',
  styleUrls: ['../list-search-starter.component.css'],
  imports: [CommonModule]
})
export class ProviderTypeRefListComponent implements OnInit, AfterViewInit {
  @ViewChild('gridContainer') gridContainer!: ElementRef;
  private grid: any;
  private isDhtmlxLoaded = false;

  public selectedProviderTypeRefId: string | null = null;
  public showTuneButton: boolean = false; // Variable to control tune button visibility

  constructor(
    private hcclService: HcclService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Check for ID parameter in route
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.selectedProviderTypeRefId = id;
      } else {
        this.selectedProviderTypeRefId = null;
      }
    });

    // Check if DHTMLX is loaded
    this.checkDhtmlxLoaded();
  }

  ngAfterViewInit() {
    // If DHTMLX is already loaded, initialize the grid
    if (this.isDhtmlxLoaded) {
      this.initializeGrid();
    }
  }

  private checkDhtmlxLoaded() {
    if (typeof dhx !== 'undefined' && typeof dhx.Grid !== 'undefined') {
      this.isDhtmlxLoaded = true;
      this.initializeGrid();
    } else {
      // If not loaded, wait for it
      const checkInterval = setInterval(() => {
        if (typeof dhx !== 'undefined' && typeof dhx.Grid !== 'undefined') {
          this.isDhtmlxLoaded = true;
          this.initializeGrid();
          clearInterval(checkInterval);
        }
      }, 100);

      // Clear interval after 5 seconds to prevent infinite checking
      setTimeout(() => {
        clearInterval(checkInterval);
      }, 5000);
    }
  }

  private initializeGrid() {
    if (!this.gridContainer?.nativeElement || !this.isDhtmlxLoaded) {
      console.log('Grid initialization skipped - container or DHTMLX not ready');
      return;
    }

    // Check if the grid container is visible
    const container = this.gridContainer.nativeElement;
    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      console.log('Grid container not visible, retrying in 100ms');
      setTimeout(() => this.initializeGrid(), 100);
      return;
    }

    try {
      // Initialize DHTMLX grid with pagination and drag and drop
      this.grid = new dhx.Grid(this.gridContainer.nativeElement, {
        columns: [
          { id: 'select', header: [{ text: '' }], type: 'boolean', editorType: 'checkbox', editable: true, width: 50 },
          { id: 'id', header: [{ text: 'ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
          { id: 'name', header: [{ text: 'Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
          { id: 'businessCode', header: [{ text: 'Business Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
          { id: 'description', header: [{ text: 'Description', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
          { id: 'available', header: [{ text: 'Available', align: 'center' }, { content: 'inputFilter' }], minWidth: 100, adjust: true },
          { id: 'createdByInfo', header: [{ text: 'Created By', align: 'center' }], minWidth: 120, adjust: true },
          { id: 'dateCreated', header: [{ text: 'Date Created', align: 'center' }], minWidth: 120, adjust: true },
          { id: 'lastUpdatedByInfo', header: [{ text: 'Last Updated By', align: 'center' }], minWidth: 120, adjust: true },
          { id: 'dateLastUpdated', header: [{ text: 'Date Last Updated', align: 'center' }], minWidth: 120, adjust: true }
        ],
        css: "search-list-grid",
        height: 600,
        autoWidth: false,
        selection: 'row',
        editable: false,
        resizable: true,
        drag: true, // Enable drag and drop
        footer: Array(10).fill({ text: '' }),
        pagination: {
          limit: 10,
          enabled: true,
          countable: true,
          navs: true,
          pageSizes: [10, 20, 50],
          range: true,
        }
      });

      // Attach afterRowDrop event listener
      this.grid.events.on("afterRowDrop", (from: string, to: string, dragInfo: any) => {
        console.log(`Row with ID ${from} was dropped before row with ID ${to}`);
        // You would typically update your data source here to reflect the new order
        // For example, if you have an array of provider type refs, you would reorder that array.
        // The grid's internal data is already updated by the drop action.
      });

      // Add row click event listener
      this.grid.events.on('cellClick', (row: any, col: any, e: any) => {
        console.log('Cell clicked:', row, col);
        // Don't trigger on checkbox column or if no row data
        if (col && col.id !== 'select' && row && row.id) {
          console.log('Calling onRowClick with providerTypeRefId:', row.id);
          this.onRowClick(row.id);
        }
      });

      // Load initial data
      this.loadProviderTypeRefData();

    } catch (error) {
      console.error('Error initializing DHTMLX grid:', error);
    }
  }

  /**
   * Handle row click to show provider type ref details
   * @param providerTypeRefId The ID of the clicked provider type ref
   */
  public onRowClick(providerTypeRefId: string): void {
    console.log('onRowClick called with providerTypeRefId:', providerTypeRefId);
    this.router.navigate(['/ecoadmin-dashboard/providertyperefs', providerTypeRefId, 'details']);
  }

  /**
   * Refresh the grid by reinitializing it
   */
  private refreshGrid(): void {
    console.log('Refreshing grid...');
    if (this.grid) {
      // Destroy the existing grid
      this.grid.destructor();
      this.grid = null;
    }
    // Reinitialize the grid
    this.initializeGrid();
  }

  private loadProviderTypeRefData(searchCriteria?: string) {
    const criteria: ProviderTypeRefCriteria = {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };

    // Add search criteria if provided
    if (searchCriteria && searchCriteria.trim() !== '') {
      criteria.searchByText = searchCriteria;
    }
    if (this.selectedProviderTypeRefId) {
      criteria.ids = [this.selectedProviderTypeRefId];
    }

    this.hcclService.findProviderTypeRefs(criteria).subscribe({
      next: (response: ProviderTypeRefGETDataSearchResults) => {
        if (response.searchResults) {
          const refs = response.searchResults;
          const gridData = refs.map(ref => ({
            ...ref,
            select: false,
            createdByInfo: ref.createdByInfo?.name || '',
            lastUpdatedByInfo: ref.lastUpdatedByInfo?.name || '',
            dateCreated: ref.dateCreated?.formattedDate || '',
            dateLastUpdated: ref.dateLastUpdated?.formattedDate || ''
          }));
          this.grid.data.parse(gridData);
          console.log("Loaded provider type refs:", gridData.length);
        } else {
          this.grid.data.parse([]);
          console.log("No provider type refs found");
        }
      },
      error: (error) => {
        console.error('Error loading provider type ref data:', error);
        this.grid.data.parse([]);
      }
    });
  }

  public onGoClick() {
    alert('onGoClick called');
    // if (this.grid) {
    //   // DHTMLX Suite 8: get checked rows by 'select' column (checkbox)
    //   // The checked state is stored in the 'select' property of each row
    //   const allData = this.grid.data.serialize();
    //   const checkedRows = allData.filter((row: any) => row.select === true);
    //   console.log('Checked rows:', checkedRows);
      
    //   if (checkedRows.length > 0) {
    //     // Route to the first selected provider type ref's details
    //     const firstRef = checkedRows[0];
    //     const refId = firstRef.businessCode || firstRef.id;
    //     this.router.navigate(['/ecoadmin-dashboard/providertyperefs', refId, 'details']);
    //   } else {
    //     alert('No provider type refs selected');
    //   }
    // }
  }

  public onTuneProviderTypeRefs() {
    if (this.grid) {
      const allData = this.grid.data.serialize();
      const checkedRows = allData.filter((row: any) => row.select === true);
      
      if (checkedRows.length === 0) {
        alert('Please select at least one provider type ref to tune');
        return;
      }

      const refIds = checkedRows.map((row: any) => row.id);
      console.log('Tuning provider type refs:', refIds);

      // TODO: Implement tuning logic
      alert(`Tuning ${checkedRows.length} provider type ref(s): ` + refIds.join(', '));
    }
  }

  public onRefresh() {
    this.loadProviderTypeRefData();
  }

  public onSearch(query: string) {
    this.loadProviderTypeRefData(query);
  }

  public onAdvancedSearch() {
    // TODO: Implement advanced search functionality
    alert('Advanced search functionality not yet implemented');
  }

  public onImportProviderTypeRefs() {
    // TODO: Implement import functionality
    alert('Import functionality not yet implemented');
  }

  public onSyncProviderTypeRefs() {
    // TODO: Implement sync functionality
    alert('Sync functionality not yet implemented');
  }

  public onExportProviderTypeRefs() {
    // TODO: Implement export functionality
    alert('Export functionality not yet implemented');
  }
} 