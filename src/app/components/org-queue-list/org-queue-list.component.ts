import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HcclService } from '../../restsvc/hccl.service';
import { WorkQueueGETData, WorkQueueCriteria, WorkQueueGETDataSearchResults, HcclOrganizationGETData } from '../../restsvc/hccl.service';

declare const dhx: any;

@Component({
  selector: 'app-org-queue-list',
  templateUrl: './org-queue-list.component.html',
  styleUrls: ['./org-queue-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class OrgQueueListComponent implements OnInit, AfterViewInit {
  @ViewChild('gridContainer') gridContainer!: ElementRef;
  @Input() entityId?: string; // Input parameter for organization ID
  
  private grid: any;
  private isDhtmlxLoaded = false;
  private organization: HcclOrganizationGETData | null = null;

  constructor(
    private hcclService: HcclService,
    private router: Router
  ) {}

  async ngOnInit() {
    if (this.entityId) {
      this.loadParentEntity();
    }
    this.checkDhtmlxLoaded();
  }

  ngAfterViewInit() {
    if (this.isDhtmlxLoaded) {
      this.initializeGrid();
    }
  }

  private checkDhtmlxLoaded() {
    if (typeof dhx !== 'undefined' && typeof dhx.Grid !== 'undefined') {
      this.isDhtmlxLoaded = true;
      this.initializeGrid();
    } else {
      const checkInterval = setInterval(() => {
        if (typeof dhx !== 'undefined' && typeof dhx.Grid !== 'undefined') {
          this.isDhtmlxLoaded = true;
          this.initializeGrid();
          clearInterval(checkInterval);
        }
      }, 100);
      setTimeout(() => {
        clearInterval(checkInterval);
      }, 5000);
    }
  }

  private initializeGrid() {
    if (!this.gridContainer?.nativeElement || !this.isDhtmlxLoaded) {
      return;
    }
    try {
      this.grid = new dhx.Grid(this.gridContainer.nativeElement, {
        columns: [
          { id: 'select', header: [{ text: '' }], type: 'checkbox', width: 50 },
          { id: 'rowId', header: [{ text: 'ID', align: 'center' }, { content: 'inputFilter' }], width: 120, adjust: true },
          { id: 'go', header: [{ text: 'Go', align: 'center' }], width: 80, htmlEnable: true, template: () => `<button class="go-btn">Go</button>` },
          { id: 'name', header: [{ text: 'Queue Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
          { id: 'businessCode', header: [{ text: 'Business Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
          { id: 'description', header: [{ text: 'Description', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
          { id: 'prefixCode', header: [{ text: 'Prefix Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
          { id: 'workQueueTypeId', header: [{ text: 'Type ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
          { id: 'workQueueTeamId', header: [{ text: 'Team ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
          { id: 'available', header: [{ text: 'Available', align: 'center' }, { content: 'inputFilter' }], minWidth: 100, adjust: true },
          { id: 'externalQueue', header: [{ text: 'External', align: 'center' }, { content: 'inputFilter' }], minWidth: 100, adjust: true },
        ],
        css: "search-list-grid",
        height: 600,
        autoWidth: false,
        selection: 'row',
        editable: false,
        resizable: true,
        drag: true,
        footer: [
          { text: '' },
          { text: '' },
          { text: '' },
          { text: '' },
          { text: '' },
          { text: '' },
          { text: '' },
          { text: '' },
          { text: '' },
        ],
        pagination: {
          limit: 10,
          enabled: true,
          countable: true,
          navs: true,
          pageSizes: [10, 20, 50],
          range: true,
        }
      });

      // Use cellClick event for the Go button
      this.grid.events.on('cellClick', (row: any, col: any, e: any) => {
        if (col && col.id === 'go') {
          this.router.navigate(['/advocate-dashboard/org-queue-tix', row.id]);
        }
      });

      this.loadListData();
    } catch (error) {
      console.error('Error initializing DHTMLX grid:', error);
    }
  }

  private loadListData(searchCriteria?: string) {
    const criteria: WorkQueueCriteria = {
      organizationId: this.entityId || undefined,
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
    if (searchCriteria && searchCriteria.trim() !== '') {
      criteria.name = searchCriteria;
    }
    this.hcclService.findWorkQueues(criteria).subscribe({
      next: (response: WorkQueueGETDataSearchResults) => {
        if (response.searchResults) {
          const gridData = response.searchResults.map(queue => ({
            ...queue,
            rowId: queue.id,
            select: false
          }));
          this.grid.data.parse(gridData);
        } else {
          this.grid.data.parse([]);
        }
      },
      error: (error) => {
        console.error('Error loading work queue data:', error);
        this.grid.data.parse([]);
      }
    });
  }

  public onGoClick() {
    // Not used in this version; Go is per-row
  }
  

  public onSearch(query: string) {
    this.loadListData(query);
  }

  public onAdvancedSearch() {
    // TODO: Implement advanced search logic
  }

  private loadParentEntity() {
    if (!this.entityId) {
      return;
    }
    this.hcclService.getHcclOrganizationById(this.entityId).subscribe({
      next: (organization: HcclOrganizationGETData) => {
        this.organization = organization;
      },
      error: (error) => {
        this.organization = null;
      }
    });
  }

  public getParentEntity(): HcclOrganizationGETData | null {
    return this.organization;
  }
} 