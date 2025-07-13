import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HcclService, WorkRequestGETData, WorkRequestCriteria, WorkRequestGETDataSearchResults } from '../../restsvc/hccl.service';


declare const dhx: any;

@Component({
  selector: 'app-org-queue-tix-list',
  templateUrl: './org-queue-tix-list.component.html',
  styleUrls: ['./org-queue-tix-list.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class OrgQueueTixListComponent implements OnInit, AfterViewInit {
  @ViewChild('gridContainer') gridContainer!: ElementRef;
  @Input() workQueueId?: string;

  private grid: any;
  private isDhtmlxLoaded = false;

  constructor(
    private hcclService: HcclService,
    private router: Router
  ) {}

  async ngOnInit() {
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
          { id: 'id', header: [{ text: 'ID', align: 'center' }, { content: 'inputFilter' }], width: 120, adjust: true },
          { id: 'go', header: [{ text: 'Go', align: 'center' }], width: 80, htmlEnable: true, template: () => `<button class=\"go-btn\">Go</button>` },
          { id: 'name', header: [{ text: 'Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
          { id: 'businessCode', header: [{ text: 'Business Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
          { id: 'description', header: [{ text: 'Description', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
          { id: 'workRequestTypeId', header: [{ text: 'Type ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
          { id: 'currentStateCode', header: [{ text: 'State', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
          { id: 'createdByUserId', header: [{ text: 'Created By', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
          { id: 'acceptedByUserId', header: [{ text: 'Accepted By', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
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
      this.grid.events.on('cellClick', (row: any, col: any, e: any) => {
        if (col && col.id === 'go') {
          console.log('onRowClick1 called with workRequestId:', row.id); 
          this.router.navigate(['/advocate-dashboard/tickets', row.id, 'details']);
        }
      });
      this.loadListData();
    } catch (error) {
      console.error('Error initializing DHTMLX grid:', error);
    }
  }

  private loadListData(searchCriteria?: string) {
    const criteria: WorkRequestCriteria = {
      workQueueId: this.workQueueId,
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
    if (searchCriteria && searchCriteria.trim() !== '') {
      criteria.name = searchCriteria;
    }
    this.hcclService.findWorkRequests(criteria).subscribe({
      next: (response: WorkRequestGETDataSearchResults) => {
        if (response.searchResults) {
          this.grid.data.parse(response.searchResults);
        } else {
          this.grid.data.parse([]);
        }
      },
      error: (error) => {
        console.error('Error loading work request data:', error);
        this.grid.data.parse([]);
      }
    });
  }

  public onSearch(query: string) {
    this.loadListData(query);
  }

  public onAdvancedSearch() {
    // TODO: Implement advanced search logic
  }
}
