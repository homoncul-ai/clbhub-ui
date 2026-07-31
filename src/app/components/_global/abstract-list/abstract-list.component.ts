import { BaseCriteria } from '../../../restsvc/hccl.service';
import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclService } from '../../../restsvc/hccl.service';
import { Observable } from 'rxjs';
import { DateGETData } from '@app/restsvc/common-request-service.model';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { SimpleButton, SimpleButtonBar, SimpleButtonbarComponent  } from '../simple-buttonbar/simple-buttonbar.component';

declare const dhx: any;


/**
 * Abstract base component for displaying and managing entity data using HcclService
 * Provides common grid functionality and requires subclasses to implement entity-specific methods
 */

@Component({
  selector: 'app-abstract-list',
  templateUrl: './abstract-list.component.html',
  styleUrls: ['./abstract-list.component.scss'],
  standalone: true,
  imports: [CommonModule, SimpleButtonbarComponent, MatButtonModule],
})
export abstract class AbstractListComponent<T, TCriteria extends BaseCriteria, TSearchResults> 
implements OnInit, AfterViewInit, OnDestroy {
  
  
  // [showingSearchHeading]="false" [showingSearch]="false" [showingGoButton]="false" [showingAddButton]="false" [showingIdCheckbox]="false"
  @Input() criteria: TCriteria | null = null;
  @Input() fkMenuCriteria: BaseCriteria | null = null;
  @Input() showingSearch: boolean = true;
  @Input() searchButtonLabel: string = 'Search';
  @Input() searchPlaceholder: string = 'search by name or business code, * for wildcard';
  @Input() showingSearchHeading: boolean = true;
  @Input() searchHeadingLabel: string = 'Entities';
  @Input() showingGoButton: boolean = true;
  @Input() goButtonLabel: string = 'Go';
  @Input() showingAddButton: boolean = false;
  @Input() addButtonLabel: string = 'Add';
  @Input() showingIdCheckbox: boolean = false;
  @Input() hideInternalButtons: boolean = false; // When true, hides Go and Add buttons for external control
  @Input() onRowClickBehavior: OnRowClickBehavior = new OnRowClickBehavior();
  @Input() onDeleteClickBehavior: OnDeleteClickBehavior | undefined = undefined;
  @Input() onGoClickAction: OnGoClickActionBehavior = new OnGoClickActionBehavior();
  @Input() onAddAction: OnAddActionBehavior | null = null;
  @Input() otherData: any = {};
  @Input() showingDiagnostics: boolean = false;
  @Input() onFinishLoading: OnFinishLoadingBehavior | null = null;
  
  // Auto-height settings - grid height adjusts to content, with max rows before scrolling
  @Input() autoHeight: boolean = true;
  @Input() maxRows: number = 20;
  @Input() rowHeight: number = 40; // Approximate height per row in pixels

  // CSV values to control checkbox selection externally
  @Input() selectedIdsCsv: string = '';
  
  // Event emitter for when selected IDs change
  @Output() selectedIdsChanged = new EventEmitter<string[]>();

  // This is a list of button names and their labels that will be displayed in the button bar.
  @Input() buttonBar: SimpleButtonBar | null = null;

  protected actionCode: string = 'search';

  @ViewChild('gridContainer') gridContainer!: ElementRef;
  @ViewChild('searchInput') searchInput!: ElementRef;
  protected grid: any;
  protected isDhtmlxLoaded = false;
  private resizeListener?: () => void;
  private keepPaginationInView = false;
  private hostElement = inject(ElementRef);

  protected selectedId: string | null = null;
  protected showingAdvancedSearch: boolean = false;
  protected showingButtonBar: boolean = false;
  isLoading = false;

  protected searchHeading: string = 'Entities';
  protected hcclService = inject(HcclService);
  protected router = inject(Router);
  protected route = inject(ActivatedRoute);
  protected hcclContextService = inject(HcclContextService);
  protected totalRows: number = 0;
  protected currentPage: number = 1;
  protected pageSize: number = 50;
  protected lastSearchByText: string | undefined = undefined;

  /**
   * When true, header inputFilters trigger a server reload (full DB) instead of
   * filtering only the rows currently on the page. Needed with server-side paging.
   */
  protected usingServerSideColumnFilters = false;
  protected columnFilters: Record<string, string> = {};
  private columnFilterDebounceHandle: ReturnType<typeof setTimeout> | null = null;
  private columnFilterDebounceMs = 350;
  protected restoringColumnFilters = false;
  /** True while top-bar and/or column filters are actively narrowing results. */
  private searchFilterActive = false;
  /** Page the user was on before entering a search; restored when search is cleared. */
  private pageBeforeSearch: number | null = null;

  protected modalService: MdbModalService = inject(MdbModalService);


  ngOnInit() {
    // Check for ID parameter in route
    this.searchHeading = this.searchHeadingLabel;
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.selectedId = id;
      } else {
        this.selectedId = null;
      }
    });


    // Check if DHTMLX is loaded
    this.checkDhtmlxLoaded();
    this.showingButtonBar = this.hasButtonBarList()  ;
  }

  setSelectedId(id: string) {
    this.selectedId = id;
  }

  getSelectedId(): string | null {
    return this.selectedId;
  }

  ngAfterViewInit() {
    // If DHTMLX is already loaded, initialize the grid
    if (this.isDhtmlxLoaded) {
      this.initializeGrid();
    }
  }

  ngOnDestroy() {
    // Clean up resize listener
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
      this.resizeListener = undefined;
    }

    if (this.columnFilterDebounceHandle) {
      clearTimeout(this.columnFilterDebounceHandle);
      this.columnFilterDebounceHandle = null;
    }
    
    // Destroy grid if it exists
    if (this.grid) {
      try {
        this.grid.destructor();
      } catch (error) {
        console.error('Error destroying grid:', error);
      }
      this.grid = null;
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
      // Calculate available height for the grid
      this.calculateGridHeight();
      this.setupGrid();

      // Attach afterRowDrop event listener
      this.grid.events.on("afterRowDrop", (from: string, to: string, dragInfo: any) => {
        console.log(`Row with ID ${from} was dropped before row with ID ${to}`);
        this.onRowDrop(from, to, dragInfo);
      });

      // Add row click event listener
      this.grid.events.on('cellClick', (row: any, col: any, e: any) => {
        console.log('Cell clicked:', row, col);

        if (col && col.id === 'delete_action' && row && row.id && this.onDeleteClickBehavior) {
          this.onDeleteClickBehavior.clicked(row.id);
          return;
        }

        // Don't trigger on checkbox column, action column, delete column, or if no row data
        if (col && col.id !== 'select' && col.id !== 'action' && col.id !== 'delete_action' && row && row.id) {
          console.log('Calling onRowClick with entityId:', row.id);
          this.onRowClick(row.id);
        }
      });

      this.addGridEventListeners(this.grid)
      this.attachServerSideColumnFilterListeners(this.grid);

      // Load on next tick so isLoading is applied outside AfterViewInit CD
      setTimeout(() => this.loadGridData(), 0);

      // Add resize listener to recalculate grid height
      this.setupResizeListener();

    } catch (error) {
      console.error('Error initializing DHTMLX grid:', error);
    }
  }

  private setupResizeListener(): void {
    // Remove existing listener if any
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }

    // Create new resize listener
    this.resizeListener = () => {
      if (this.grid && this.gridContainer?.nativeElement && typeof this.grid.setHeight === 'function') {
        this.calculateGridHeight();
        const newHeight = (this as any)._calculatedHeight;
        if (newHeight && newHeight !== 'auto') {
          this.grid.setHeight(newHeight);
        }
      }
    };

    window.addEventListener('resize', this.resizeListener);
  }

  protected addGridEventListeners(grid: any) {
    // Default implementation - subclasses can override
    console.log('addGridEventListeners called');
    
    // Add checkbox change event listener
    if (this.getShowingIdCheckbox()) {
      grid.events.on('cellClick', (row: any, col: any, e: any) => {
        if (col && col.id === 'select') {
          // Checkbox was clicked, emit the change
          this.emitSelectedIdsChange();
        }
      });
    }
  }

  /**
   * Wire header filters to server reloads when usingServerSideColumnFilters is on.
   * Cancels DHTMLX client filtering so filters are not limited to the current page.
   */
  protected attachServerSideColumnFilterListeners(grid: any): void {
    if (!this.usingServerSideColumnFilters || !grid?.events) {
      return;
    }

    grid.events.on('beforeFilter', (_value: any, _colId?: string | number) => false);

    grid.events.on('filterChange', (value: any, colId: string | number) => {
      if (this.restoringColumnFilters) {
        return;
      }
      const key = String(colId);
      const normalized =
        value == null
          ? ''
          : Array.isArray(value)
            ? value.map((v) => String(v)).join(' ').trim()
            : value instanceof Date && !Number.isNaN(value.getTime())
              ? value.toISOString().slice(0, 10)
              : String(value).trim();

      if (this.handleColumnFilterChange(key, normalized)) {
        return;
      }

      if (normalized) {
        this.columnFilters[key] = normalized;
      } else {
        delete this.columnFilters[key];
      }

      if (this.columnFilterDebounceHandle) {
        clearTimeout(this.columnFilterDebounceHandle);
      }
      this.columnFilterDebounceHandle = setTimeout(() => {
        this.columnFilterDebounceHandle = null;
        this.loadGridData(undefined, true);
      }, this.columnFilterDebounceMs);
    });
  }

  /**
   * Subclasses can handle a column filter specially (e.g. open a modal).
   * Return true to skip the default columnFilters + reload behavior.
   */
  protected handleColumnFilterChange(_colId: string, _value: string): boolean {
    return false;
  }

  /**
   * Map active header filter values onto API criteria. Override per entity.
   * Default: first non-empty filter value becomes searchByText.
   */
  protected applyColumnFiltersToCriteria(criteria: TCriteria): void {
    const values = Object.values(this.columnFilters).filter((v) => !!v?.trim());
    if (!values.length) {
      return;
    }
    const existing = ((criteria as any).searchByText as string | undefined)?.trim();
    const columnSearch = values.join(' ');
    (criteria as any).searchByText = existing
      ? `${existing} ${columnSearch}`
      : columnSearch;
  }

  protected calculateGridHeight(): void {
    // Calculate available height by measuring the grid container's available space
    if (!this.gridContainer?.nativeElement) {
      return;
    }
    
    const container = this.gridContainer.nativeElement;
    const parentElement = container.parentElement;
    
    if (parentElement) {
      // Get the parent container's computed style
      const parentRect = parentElement.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      // Calculate available height: parent height minus search bar and other elements above grid
      // Measure the space from grid container top to parent bottom
      const gridTop = containerRect.top - parentRect.top;
      const availableHeight = parentRect.height - gridTop - 80; // 80px for pagination and padding
      
      // Set minimum height to ensure grid is usable
      const minHeight = 300;
      const calculatedHeight = Math.max(availableHeight, minHeight);
      
      // Store calculated height for use in setupGrid
      (this as any)._calculatedHeight = calculatedHeight;
    }
  }

  protected setupGrid() {
    // Build columns array based on showingIdCheckbox state
    const columns: any[] = [];
    //this.showingIdCheckbox = this.getShowingIdCheckbox();
  
    // Add checkbox column only if showingIdCheckbox is true
    if (this.showingIdCheckbox) {
      columns.push({ id: 'select', header: [{ text: '' }], type: 'boolean', editorType: 'checkbox', editable: true, width: 50 });
    }
    
    // Add entity-specific columns
    const entityColumns = this.getGridColumns();
    columns.push(...entityColumns);

    // Add delete action column if onDeleteClickBehavior is provided
    if (this.onDeleteClickBehavior) {
      columns.push({
        id: 'delete_action',
        header: [{ text: '' }],
        width: 50,
        align: 'center',
        htmlEnable: true,
        template: () => `<div style="cursor:pointer;display:inline-flex;align-items:center;justify-content:center;height:100%;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#000000" style="pointer-events:none;"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></div>`,
      });
      //alert("Delete column added");
    }

    // Build footer array based on column count
    const footerCount = columns.length;
    const footer = Array(footerCount).fill({ text: '' });

    // Get calculated height or use auto
    let gridHeight: number | string = (this as any)._calculatedHeight || 'auto';
    
    // If autoHeight is enabled, use dhtmlx autoHeight feature
    const useAutoHeight = this.autoHeight;
    if (useAutoHeight) {
      // Calculate max height based on maxRows
      const headerHeight = 50; // Approximate header height
      const maxHeight = headerHeight + (this.maxRows * this.rowHeight);
      gridHeight = maxHeight;      
    }
    gridHeight = 'auto';

    // Server-side paging is handled by AbstractList controls below the grid.
    // Keep DHTMLX client pagination off so Next/Prev map to API pageNumber.
    this.grid = new dhx.Grid(this.gridContainer.nativeElement, {
      columns: columns,
      css: useAutoHeight ? "search-list-grid search-list-grid--auto-height" : "search-list-grid",
      height: gridHeight,
      autoHeight: useAutoHeight,
      autoWidth: false, // Disable autoWidth to prevent horizontal overflow
      selection: 'row',
      editable: false,
      resizable: true,
      drag: true, // Enable drag and drop
      footer: footer,
      pagination: {
        enabled: false
      }
    });
  }

  /**
   * Handle row drop event
   * @param from The ID of the row being moved
   * @param to The ID of the row being moved to
   * @param dragInfo Additional drag information
   */
  protected onRowDrop(from: string, to: string, dragInfo: any): void {
    // Default implementation - subclasses can override
    console.log(`Row with ID ${from} was dropped before row with ID ${to}`);
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

  /**
   * Public method to refresh the list/grid from external components
   */
  public refresh(): void {
    this.refreshGrid();
  }

  copyCreateCriteria(criteria: TCriteria): TCriteria {
    return { ...criteria };
  }

  currentCriteria: TCriteria | null = null;
  protected loadGridData(searchByText?: string, resetPage: boolean = false) {
    if (searchByText !== undefined) {
      this.lastSearchByText = searchByText;
    }
    const activeSearchByText = searchByText !== undefined ? searchByText : this.lastSearchByText;
    const willBeFiltered = this.isSearchFilterActive(activeSearchByText);
    const wasFiltered = this.searchFilterActive;

    if (resetPage) {
      if (!wasFiltered && willBeFiltered) {
        // Entering search from browse — remember page, then show matches from page 1.
        this.pageBeforeSearch = this.currentPage;
        this.currentPage = 1;
      } else if (wasFiltered && !willBeFiltered) {
        // Cleared back to wildcard — return to the page where search began.
        this.currentPage = this.pageBeforeSearch && this.pageBeforeSearch > 0
          ? this.pageBeforeSearch
          : 1;
        this.pageBeforeSearch = null;
      } else if (willBeFiltered) {
        // Still searching (refined query) — restart at page 1.
        this.currentPage = 1;
      }
    }

    this.searchFilterActive = willBeFiltered;

    // Merge list defaults with parent criteria so filter fields cannot wipe paging.
    const criteria = {
      ...this.createCriteria(),
      ...(this.criteria || {})
    } as TCriteria;

    if (activeSearchByText && activeSearchByText.trim() !== '') {
      (criteria as any).searchByText = activeSearchByText; 
    }
    if (this.criteria == null && this.selectedId && this.selectedId.trim() !== '') {
      (criteria as any).ids = [this.selectedId];
    }

    if (this.usingServerSideColumnFilters) {
      this.applyColumnFiltersToCriteria(criteria);
    }

    if ((criteria as any).isPaging !== false) {
      this.pageSize = Number((criteria as any).pageSize) || this.pageSize || 50;
      (criteria as any).pageNumber = this.currentPage;
      (criteria as any).pageSize = this.pageSize;
      (criteria as any).isPaging = true;
    }

    this.currentCriteria = criteria;
   // alert('loadGridData criteria: ' + JSON.stringify(criteria));
    this.loadGridDataCall(criteria);
  }

  /** Top-bar text and/or column header filters are narrowing the list. */
  protected isSearchFilterActive(searchByText?: string | null): boolean {
    const text = (searchByText ?? '').trim();
    const hasTopSearch = !!text && text !== '*';
    const hasColumnFilters = Object.values(this.columnFilters).some((v) => !!v?.trim());
    return hasTopSearch || hasColumnFilters;
  }
  protected getTotalRows(): number {
    return this.totalRows;
  }

  protected getTotalPages(): number {
    if (!this.pageSize || this.pageSize <= 0) {
      return 1;
    }
    return Math.max(1, Math.ceil(this.totalRows / this.pageSize));
  }

  /**
   * Page numbers (and optional ellipsis markers) shown as clickable bubbles.
   * Keeps the control compact when there are many pages.
   */
  protected getVisiblePageNumbers(): Array<number | 'ellipsis'> {
    const total = this.getTotalPages();
    const current = this.currentPage;
    if (total <= 9) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages = new Set<number>();
    pages.add(1);
    pages.add(total);
    for (let p = current - 2; p <= current + 2; p++) {
      if (p >= 1 && p <= total) {
        pages.add(p);
      }
    }

    const sorted = Array.from(pages).sort((a, b) => a - b);
    const result: Array<number | 'ellipsis'> = [];
    let previous = 0;
    for (const page of sorted) {
      if (previous && page - previous > 1) {
        result.push('ellipsis');
      }
      result.push(page);
      previous = page;
    }
    return result;
  }

  protected get showingServerPagination(): boolean {
    const criteria = this.currentCriteria as any;
    if (criteria && criteria.isPaging === false) {
      return false;
    }
    return this.totalRows > this.pageSize;
  }

  protected get pageRangeLabel(): string {
    if (this.totalRows <= 0) {
      return '0 of 0';
    }
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalRows);
    return `${start}–${end} of ${this.totalRows}`;
  }

  public goToPreviousPage(): void {
    if (this.currentPage <= 1 || this.isLoading) {
      return;
    }
    this.currentPage -= 1;
    this.keepPaginationInView = true;
    this.loadGridData();
  }

  public goToNextPage(): void {
    if (this.currentPage >= this.getTotalPages() || this.isLoading) {
      return;
    }
    this.currentPage += 1;
    this.keepPaginationInView = true;
    this.loadGridData();
  }

  public goToPage(page: number | string): void {
    if (page === 'ellipsis' || this.isLoading) {
      return;
    }
    const target = Number(page);
    const total = this.getTotalPages();
    if (!Number.isFinite(target) || target < 1 || target > total || target === this.currentPage) {
      return;
    }
    this.currentPage = target;
    this.keepPaginationInView = true;
    this.loadGridData();
  }

  /**
   * After a page change, keep the pagination bar visible at the bottom of the viewport.
   */
  protected scrollPaginationIntoViewIfNeeded(): void {
    if (!this.keepPaginationInView) {
      return;
    }
    this.keepPaginationInView = false;

    // Wait for grid height / DOM to settle after parse.
    setTimeout(() => {
      const host = this.hostElement?.nativeElement as HTMLElement | undefined;
      const pagination = host?.querySelector?.(
        '.search-list-server-pagination, .feed-pagination'
      ) as HTMLElement | null;
      if (!pagination) {
        return;
      }
      pagination.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }, 50);
  }

  protected loadGridDataCall(criteria: TCriteria) {
    console.log('Loading entities with criteria:', criteria);
    this.isLoading = true;

    this.findEntities(criteria).subscribe({
      next: (response: TSearchResults) => {
        if (this.hasSearchResults(response)) {
          const entities = this.getSearchResults(response);
          const pagingInfo = (response as any).pagingInfo;
          if (pagingInfo?.pageNumber) {
            this.currentPage = Number(pagingInfo.pageNumber) || this.currentPage;
          }
          if (pagingInfo?.pageSize) {
            this.pageSize = Number(pagingInfo.pageSize) || this.pageSize;
          }
          if (pagingInfo?.totalRows != null && pagingInfo.totalRows !== '') {
            this.totalRows = Number(pagingInfo.totalRows);
          } else if (entities.length >= this.pageSize) {
            // API did not return a total; assume at least one more page exists.
            this.totalRows = this.currentPage * this.pageSize + 1;
          } else {
            this.totalRows = (this.currentPage - 1) * this.pageSize + entities.length;
          }

          // Restored pre-search page may be past the end if the list shrank.
          const totalPages = this.getTotalPages();
          if (this.currentPage > totalPages) {
            this.currentPage = totalPages;
            this.isLoading = false;
            this.loadGridData(undefined, false);
            return;
          }

          // Set up fk data, whatever else.
          const ids: string[] = entities.map((entity: T) => this.extractId(entity));
          
          // Ensure all preprocessing is complete before processing entities
          this.preProcessEntities(entities, ids)
            .then(() => {
              // All preprocessing is now complete, safe to process entities
              var data =  this.processEntities(entities);
              if (this.onFinishLoading) { 
                var id = this.extractId(entities[0]);
                this.onFinishLoading.onFinishLoading(id, data, this.totalRows);
              }
              return data;
            })
            .then(() => {
              this.isLoading = false;
              this.scrollPaginationIntoViewIfNeeded();
            })
            .catch(error => {
              console.error('Error in preprocessing or processing entities:', error);
              this.grid.data.parse([]);
              this.isLoading = false;
              this.scrollPaginationIntoViewIfNeeded();
            });
        
        } else {
          this.grid.data.parse([]);
          this.totalRows = 0;
          this.isLoading = false;
          this.scrollPaginationIntoViewIfNeeded();
          console.log("No entities found");
        }
      },
      error: (error) => {
        console.error('Error loading entity data:', error);
        this.grid.data.parse([]);
        this.totalRows = 0;
        this.isLoading = false;
        this.scrollPaginationIntoViewIfNeeded();
      }
    });
  }

  protected extractId(entity: T): string {
    let id: string = '';
    let entityObj: any = entity;
    id = entityObj.id;
    return id;
  }

  protected async preProcessEntities(entities: T[], ids: string[]): Promise<void> {
    // Default implementation - subclasses can override
    return Promise.resolve();
  }


  private async processEntities(entities: T[]) {
    const gridData = await Promise.all(entities.map(async (entity, index) => {
      const asyncData = await this.formatEntityDataAsync(entity);
      const data: any = {
        ...entity,
        ...this.formatEntityData(entity),
        ...asyncData,
        ...this.getOtherData(entity)
      };
      
      // Only add select property if checkbox is shown
      if (this.getShowingIdCheckbox()) {
        const entityId = this.extractId(entity);
        data.select = this.isIdSelected(entityId);
      }
      console.log('data:', data);
      
      return data;
    }));
    this.grid.data.parse(gridData);
    console.log("Loaded entities:", gridData.length);
    this.restoreServerSideColumnFilterInputs();
  }

  /** Keep header filter text after a server reload (parse can reset client filter state). */
  protected restoreServerSideColumnFilterInputs(): void {
    if (!this.usingServerSideColumnFilters || !this.grid || typeof this.grid.getHeaderFilter !== 'function') {
      return;
    }
    this.restoringColumnFilters = true;
    try {
      Object.entries(this.columnFilters).forEach(([colId, value]) => {
        try {
          const headerFilter = this.grid.getHeaderFilter(colId);
          if (headerFilter && typeof headerFilter.setValue === 'function') {
            headerFilter.setValue(value);
          }
        } catch (error) {
          console.warn('Unable to restore header filter for column', colId, error);
        }
      });
    } finally {
      // Allow filterChange from setValue to settle before accepting user input again.
      setTimeout(() => {
        this.restoringColumnFilters = false;
      }, 0);
    }
  }

  /**
   * 
   * @param entity Pass in constant data that is not part of the entity
   * @returns 
   */
  protected getOtherData(entity: T): any {
    return this.otherData;
  }

  protected hasButtonBarList(): boolean {
    return this.buttonBar != null && this.buttonBar.buttons.length > 0 && !this.buttonBar.hidingButtonBar;
  }
  public getButtonBar(): SimpleButtonBar  {
    return this.buttonBar|| new SimpleButtonBar();
  }

  protected onGoClick() {
    this.actionCode = 'go';
    //myAlert('onGoClick called');
    if (!this.showingIdCheckbox) {
      this.myAlert('Please enable checkboxes first to select entities for tuning');
      return;
    }
    if (this.grid) {
      const allData = this.grid.data.serialize();
      const checkedRows = allData.filter((row: any) => row.select === true);
      
      if (checkedRows.length === 0) {
        //myAlert('Please select at least one entity to tune');
        return;
      }

      const entityIds = checkedRows.map((row: any) => row.id);
      if (entityIds.length > 0) {
        console.log('Tuning entities:', entityIds);
        const baseRoute = this.getBaseRoute();
        if (this.onGoClickAction.alertMessage.length > 0) {
          this.myAlert('OnGoClick: ' + this.onGoClickAction.alertMessage + ' ' + entityIds.join('/'));
        }
        this.onGoClickAction.onGoClick(entityIds, baseRoute, this.router);
      }
    }
    // Default implementation - subclasses can override
  }

  protected getSelectedEntityIds(): string[] {
    const allData = this.grid.data.serialize();
    const checkedRows = allData.filter((row: any) => row.select === true);
    return checkedRows.map((row: any) => row.id);
  }

  protected __onButtonClick(id: string) {
    var button: SimpleButton | undefined = this.buttonBar?.getButton(id);
    //myAlert('__onButtonClick ' + id + ' ' + button?.label);
    if (button) {
      const entityIds = this.getSelectedEntityIds();
      if (this.onGoClickAction.alertMessage.length > 0) {
        this.myAlert("id: " + id + ' ' + this.onGoClickAction.alertMessage + ' ' + entityIds.join('/'));
      }
      this.onGoClickAction.onButtonClick(button.id, entityIds, button);
    }
  }

  protected myAlert(message: string) {
    alert(message);
  }

  public getCheckedRows(): any[] {
    if (this.grid) {
      const allData = this.grid.data.serialize();
      const checkedRows = allData.filter((row: any) => row.select === true);
      return checkedRows;
    }
    return [];
  }

  protected onShowingAdvancedSearch() {

    if (this.grid) {
      const allData = this.grid.data.serialize();
      const checkedRows = allData.filter((row: any) => row.select === true);
      
      if (checkedRows.length === 0) {
        alert('Please select at least one entity to tune');
        return;
      }

      const entityIds = checkedRows.map((row: any) => row.id);
      console.log('Tuning entities:', entityIds);

      this.onAdvancedSearchAction(checkedRows, entityIds);
    }
  }

  public onRefresh() {
    this.loadGridData(undefined, false);
  }

  public onSearch(query: string) {
    this.actionCode = 'search';
    this.loadGridData(query, true);
  }

  public onFormSubmit(event: Event) {
    event.preventDefault();
    if (this.searchInput?.nativeElement) {
      this.onSearch(this.searchInput.nativeElement.value);
    }
  }

  protected onAdvancedSearch() { 
    // TODO: Implement advanced search functionality
    alert('Advanced search functionality not yet implemented');
  }

  protected onAddEntity() {
    // TODO: Implement add functionality
    alert('Add functionality not yet implemented');
  }

  /**
   * Toggle the checkbox column visibility
   */
  public toggleIdCheckbox(): void {
    this.showingIdCheckbox = !this.showingIdCheckbox;
    console.log('Checkbox visibility toggled:', this.showingIdCheckbox);
    
    // Reinitialize the grid to reflect the checkbox state
    if (this.grid) {
      this.grid.destructor();
      this.grid = null;
    }
    this.initializeGrid();
  }

  /**
   * Get the current state of the checkbox visibility
   */
  public getShowingIdCheckbox(): boolean {
    var x = this.showingIdCheckbox;
    // if (this.buttonBar && this.buttonBar.hidingButtonBar == true) {
    //   x = false;
    // }
    return x;
  }

  // Abstract methods that subclasses must implement

  /**
   * Get the grid columns configuration for this entity
   */
  protected abstract getGridColumns(): any[];

  /**
   * Create a new criteria object for this entity
   */
  protected abstract createCriteria(): TCriteria;

  /**
   * Find entities using the service
   */
  protected abstract findEntities(criteria: TCriteria): Observable<TSearchResults>;

  /**
   * Check if the search results contain data
   */
  protected abstract hasSearchResults(response: TSearchResults): boolean;

  /**
   * Get the search results array from the response
   */
  protected abstract getSearchResults(response: TSearchResults): T[];

  /**
   * Format entity data for grid display
   */
  protected  formatEntityData(entity: T): any {
    return {};
  }

  /**
   * Format entity data asynchronously for grid display (e.g., FK relationships)
   * Default implementation returns empty object - subclasses can override
   */
  protected async formatEntityDataAsync(entity: T): Promise<any> {
    return Promise.resolve({});
  }

  /**
   * Handle advanced search action
   */
  protected  onAdvancedSearchAction(checkedRows: any[], entityIds: string[]): void {

  }

  
  /**
   * Handle row click event
   */
  protected onRowClick(entityId: string): void {
    // Default implementation - subclasses can override
    const baseRoute = this.getBaseRoute(); 
    console.log('onRowClick called with entityId:', entityId);
    console.log('Current URL:', this.router.url);
    console.log('Calculated base route:', baseRoute);
    this.onRowClickBehavior.onRowClick(entityId, baseRoute, this.router);
  }

  protected onAdd(): void {
     // If custom add action is provided, use it
     if (this.onAddAction) {
       const baseRoute = this.getBaseRoute();
       this.onAddAction.onAdd(baseRoute, this.router);
       return;
     }
     
     // Default implementation - navigate to create route
     const baseRoute = this.getBaseRoute();
     console.log('Current URL:', this.router.url);
     console.log('Calculated base route:', baseRoute);
     console.log('Navigating to:', [baseRoute, 'create']);
     this.router.navigate([baseRoute, 'create']);
  }

  /**
   * Calculate the base route for the current entity type
   * @returns The base route path for navigation
   */
  protected getBaseRoute(): string {
    return AbstractListComponent.extractBaseRoute(this.router.url);
  }
  protected getIdBaseRoute(id: string): string {
    var x = AbstractListComponent.extractIdBaseRoute(this.router.url, id);
    return x
  }


  public static extractIdBaseRoute(url: string, id: string): string {
    var urlPrefixIdx = url.indexOf("/e/");
    if (urlPrefixIdx == -1) {
      alert('url prefix idx is -1 for id: ' + id + ' url: ' + url);
      return '';
    }
    // find the next 2 slashes after the /e/
    var urlPrefixIdx2 = url.indexOf("/", urlPrefixIdx + 3);
    if (urlPrefixIdx2 == -1) {
      alert('url prefix idx2 is -1 for id: ' + id + ' url: ' + url);
      return '';
    }
    var urlPrefixIdx3 = url.indexOf("/", urlPrefixIdx2 + 1);
    if (urlPrefixIdx3 == -1) {
      alert('url prefix idx3 is -1 for id: ' + id + ' url: ' + url);
      return '';
    }
    var urlPrefix = url.substring(0, urlPrefixIdx3);
    var x = urlPrefix ;
    
    //alert(x);

    return x;
  }

  public static extractBaseRoute(url:string ): string {
    // Get the current URL segments
    const urlSegments = url.split('/').filter(segment => segment.length > 0);
    
    // Find the dashboard type (advocate-dashboard, broker-dashboard, etc.)
    const dashboardIndex = urlSegments.findIndex(segment => segment.includes('-dashboard'));
    if (dashboardIndex === -1) {
      // Fallback to ecoadmin-dashboard if no dashboard found
      return '/ecoadmin-dashboard';
    }
    
    const dashboardType = urlSegments[dashboardIndex];
    
    // Find the entity route (the segment after the dashboard)
    const entityRouteIndex = dashboardIndex + 1;
    if (entityRouteIndex >= urlSegments.length) {
      // If no entity route found, return dashboard
      return `/${dashboardType}`;
    }
    
    // Get the entity route (e.g., 'providertyperefs', 'clstudents', etc.)
    var entityRoute = urlSegments[entityRouteIndex];

    // if the entitROute like : /catalogs#state=ef9bd2f3-62c2-4461-b8cb-3cd1bedf979b&session_state=8dd4f98a-9d74-4896-9bea-...
    // then remove the #state=ef9bd2f3-62c2-4461-b8cb-3cd1bedf979b&session_state=8dd4f98a-9d74-4896-9bea-...
    if (entityRoute.includes('#')) {
      entityRoute = entityRoute.split('#')[0];
    }
    
    // Remove any trailing segments like 'create', 'details', etc. to get the base route
    // This handles cases where we're on a route like /dashboard/entity/create
    const baseRoute = `/${dashboardType}/${entityRoute}`;
    
    return baseRoute;
  }

  public static routeToPath(router: Router, routePath: string[]) {
    window.location.href = router.createUrlTree(routePath).toString();
  }
  public static routeToPathNewTab(router: Router, routePath: string[]) {
    window.open(router.createUrlTree(routePath).toString(), '_blank');
  }
  public static openUrlInNewTab(url: string) {
    // This app is hosted on a url prefix '/hccl' or on '/' - how can I figure out which is which?
    if (window.location.pathname.startsWith('/hccl')) {
      url = '/hccl' + url;
    }
    window.open(url, '_blank');
  }

  // Need a 

  protected formatDateTime(date: DateGETData | undefined): string {
    if (!date) {
      return '';
    }
    var dx : Date = new Date(date.dateMilliseconds || 0);
    return dx.toLocaleString();
  }

  /**
   * Check if an ID is selected based on CSV values
   */
  private isIdSelected(entityId: string): boolean {
    if (!this.selectedIdsCsv || this.selectedIdsCsv.trim() === '') {
      return false;
    }
    const selectedIds = this.selectedIdsCsv.split(',').map(id => id.trim());
    return selectedIds.includes(entityId);
  }

  /**
   * Emit selected IDs change event
   */
  private emitSelectedIdsChange(): void {
    const selectedIds = this.getSelectedEntityIds();
    this.selectedIdsChanged.emit(selectedIds);
  }

  /**
   * Get selected IDs as CSV string
   */
  public getSelectedIdsAsCsv(): string {
    const selectedIds = this.getSelectedEntityIds();
    return selectedIds.join(',');
  }

  /**
   * Update selected IDs from external CSV
   */
  public updateSelectedIdsFromCsv(csvString: string): void {
    this.selectedIdsCsv = csvString;
    if (this.grid && this.getShowingIdCheckbox()) {
      // Refresh the grid to update checkbox states
      this.refreshGrid();
    }
  }

  
} 

/**
 * Object containing row click action functionality
 */
export class OnRowClickBehavior  {
  alertMessage: string = '';
  parentId: string = '';
  tabId: string = '';
  doNotNavigate: boolean = false;
  usingNavigateUrl: boolean = false;

  onRowClick(entityId: string, baseRoute: string, router: Router): void {
    console.log('OnRowClickAction.onRowClick called with entityId:', entityId, 'baseRoute:', baseRoute);
    if (router) {
      var urlParts = [baseRoute, entityId, 'details'];
      if (this.tabId != null && this.parentId != '') {
        this.usingNavigateUrl = true;
      } 
      if (this.usingNavigateUrl) {
        urlParts = this.getNavigateUrl(entityId, baseRoute);
      }
      if (this.alertMessage.length > 0) {
        alert(this.alertMessage + ' ' + urlParts.join('/'));
      }
      if (this.doNotNavigate) {
        console.log('doNotNavigate is true, not navigating');
      } else {
        router.navigate(urlParts);
      }
    } else {
      console.warn('Router not provided to OnRowClickAction.onRowClick');
    }
  }

  getNavigateUrl(entityId: string, baseRoute: string): any[] {
      return [baseRoute, this.parentId, this.tabId, entityId ];
  }
  
  /**
   * Object containing row click action functionality
   */
  static getOnRowClickDoNothing(): OnRowClickBehavior {
    let x: OnRowClickBehavior = new OnRowClickBehavior();
    x.doNotNavigate = true;
    return x;
  }

  
 
};

export class OnGoClickActionBehavior  {
  alertMessage: string = '';
  doNotNavigate: boolean = false;

  async onGoClick(entityIds: string[], baseRoute: string, router: Router): Promise<void> {
    console.log('OnGoClickActionBehavior.onGoClick called with entityId:', entityIds, 'baseRoute:', baseRoute);
      
      if (this.alertMessage.length > 0) {
        alert(this.alertMessage + ' ' + entityIds.join('/'));
      }
  }

  async onButtonClick(id: string, entityIds: string[], button: SimpleButton) {
    // Default implementation - subclasses can override
    
  }

  
};

/**
 * Object containing add action functionality
 * Allows custom handling of the "Add" button click, such as opening a modal
 */
export class OnAddActionBehavior {
  /**
   * Custom handler for add action
   * @param baseRoute The base route for the entity
   * @param router The Angular router instance
   */
  onAdd(baseRoute: string, router: Router): void {
    // Default implementation - subclasses should override
    // Default behavior is to navigate to create route
    console.log('OnAddActionBehavior.onAdd called with baseRoute:', baseRoute);
    router.navigate([baseRoute, 'create']);
  }
}



/**
 * Object containing add action functionality
 * Allows custom handling of the "Add" button click, such as opening a modal
 */
export class OnFinishLoadingBehavior {
  /**
   * Custom handler for add action
   * @param baseRoute The base route for the entity
   * @param router The Angular router instance
   */
  onFinishLoading(id: string, data: any, totalRows: number): void {
    // Default implementation - subclasses should override
    // Default behavior is to do nothing
    //console.log('OnFinishLoadingBehavior.onFinishLoading called with entities:');
  }
}

export class OnDeleteClickBehavior {
  clicked(entityId: string): void {
    console.log('OnDeleteClickBehavior.clicked called with entityId:', entityId);
  }
}
