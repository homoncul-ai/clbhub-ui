import { BaseCriteria } from '../../../restsvc/hccl.service';
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclService } from '../../../restsvc/hccl.service';
import { Observable } from 'rxjs';

declare const dhx: any;


/**
 * Abstract base component for displaying and managing entity data using HcclService
 * Provides common grid functionality and requires subclasses to implement entity-specific methods
 */

@Component({
  selector: 'app-abstract-list',
  templateUrl: './abstract-list.component.html',
  styleUrls: ['./abstract-list.component.scss'],
  imports: [CommonModule],
})
export abstract class AbstractListComponent<T, TCriteria extends BaseCriteria, TSearchResults> 
implements OnInit, AfterViewInit {
  @Input() criteria: TCriteria | null = null;
  @Input() showingSearch: boolean = true;
  @Input() showingSearchHeading: boolean = true;
  @Input() showingGoButton: boolean = true;
  @Input() showingAddButton: boolean = false;
  @Input() showingIdCheckbox: boolean = false;
  @Input() onRowClickBehavior: OnRowClickBehavior = new OnRowClickBehavior();

  @ViewChild('gridContainer') gridContainer!: ElementRef;
  protected grid: any;
  protected isDhtmlxLoaded = false;

  protected selectedId: string | null = null;
  protected showingAdvancedSearch: boolean = false;
  protected searchHeading: string = 'Entities';
  protected searchPlaceholder: string = 'search by name or business code, * for wildcard';
  


  protected hcclService = inject(HcclService);
  protected route = inject(ActivatedRoute);
  protected router = inject(Router);

  ngOnInit() {
    // Check for ID parameter in route
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
      this.setupGrid();

      // Attach afterRowDrop event listener
      this.grid.events.on("afterRowDrop", (from: string, to: string, dragInfo: any) => {
        console.log(`Row with ID ${from} was dropped before row with ID ${to}`);
        this.onRowDrop(from, to, dragInfo);
      });

      // Add row click event listener
      this.grid.events.on('cellClick', (row: any, col: any, e: any) => {
        console.log('Cell clicked:', row, col);
        // Don't trigger on checkbox column or if no row data
        if (col && col.id !== 'select' && row && row.id) {
          console.log('Calling onRowClick with entityId:', row.id);
          this.onRowClick(row.id);
        }
      });

      // Load initial data
      this.loadGridData();

    } catch (error) {
      console.error('Error initializing DHTMLX grid:', error);
    }
  }

  protected setupGrid() {
    // Build columns array based on showingIdCheckbox state
    const columns: any[] = [];
    
    // Add checkbox column only if showingIdCheckbox is true
    if (this.showingIdCheckbox) {
      columns.push({ id: 'select', header: [{ text: '' }], type: 'boolean', editorType: 'checkbox', editable: true, width: 50 });
    }
    
    // Add entity-specific columns
    const entityColumns = this.getGridColumns();
    columns.push(...entityColumns);

    // Build footer array based on column count
    const footerCount = this.showingIdCheckbox ? entityColumns.length + 1 : entityColumns.length;
    const footer = Array(footerCount).fill({ text: '' });

    // Initialize DHTMLX grid with pagination and drag and drop
    this.grid = new dhx.Grid(this.gridContainer.nativeElement, {
      columns: columns,
      css: "search-list-grid",
      height: 600,
      autoWidth: false,
      selection: 'row',
      editable: false,
      resizable: true,
      drag: true, // Enable drag and drop
      footer: footer,
      pagination: {
        limit: 10,
        enabled: true,
        countable: true,
        navs: true,
        pageSizes: [10, 20, 50],
        range: true,
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

  private loadGridData(searchByText?: string) {
    const criteria = this.criteria || this.createCriteria();

    // Add search criteria if provided
    if (searchByText && searchByText.trim() !== '') {
      (criteria as any).searchByText = searchByText;
    }
    if (this.criteria == null && this.selectedId) {
      (criteria as any).ids = [this.selectedId];
    }
    this.loadGridDataCall(criteria);
  }

  protected loadGridDataCall(criteria: TCriteria) {
    console.log('Loading entities with criteria:', criteria);

    this.findEntities(criteria).subscribe({
      next: (response: TSearchResults) => {
        if (this.hasSearchResults(response)) {
          const entities = this.getSearchResults(response);
          this.processEntities(entities).catch(error => {
            console.error('Error processing entities:', error);
            this.grid.data.parse([]);
          });
        } else {
          this.grid.data.parse([]);
          console.log("No entities found");
        }
      },
      error: (error) => {
        console.error('Error loading entity data:', error);
        this.grid.data.parse([]);
      }
    });
  }

  private async processEntities(entities: T[]) {
    const gridData = await Promise.all(entities.map(async (entity, index) => {
      const asyncData = await this.formatEntityDataAsync(entity);
      const data: any = {
        ...entity,
        ...this.formatEntityData(entity),
        ...asyncData
      };
      
      // Only add select property if checkbox is shown
      if (this.showingIdCheckbox) {
        data.select = false;
      }
      console.log('data:', data);
      
      return data;
    }));
    this.grid.data.parse(gridData);
    console.log("Loaded entities:", gridData.length);
  }

  protected onGoClick() {
    alert('onGoClick called');
    if (!this.showingIdCheckbox) {
      alert('Please enable checkboxes first to select entities for tuning');
      return;
    }
    // Default implementation - subclasses can override
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
    this.loadGridData();
  }

  public onSearch(query: string) {
    this.loadGridData(query);
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
    return this.showingIdCheckbox;
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
     // Default implementation - subclasses can override
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

  
} 

/**
 * Object containing row click action functionality
 */
export class OnRowClickBehavior  {
  alertMessage: string = '';
  parentId: string = '';
  tabId: string = '';
  childId: string = '';

  onRowClick(entityId: string, baseRoute: string, router: Router): void {
    console.log('OnRowClickAction.onRowClick called with entityId:', entityId, 'baseRoute:', baseRoute);
    if (router) {
      var urlParts = [baseRoute, entityId, 'details'];
      if (this.tabId != null && this.parentId != '') {
        urlParts = this.getNavigateUrl(entityId, baseRoute);
      } else {
        urlParts = [baseRoute, entityId, 'details'];
      }
      if (this.alertMessage.length > 0) {
        alert(this.alertMessage + ' ' + urlParts.join('/'));
      }
      router.navigate(urlParts);
    } else {
      console.warn('Router not provided to OnRowClickAction.onRowClick');
    }
  }

  getNavigateUrl(entityId: string, baseRoute: string): any[] {
      return [baseRoute, this.parentId, this.tabId, entityId ];
  }
  
};
