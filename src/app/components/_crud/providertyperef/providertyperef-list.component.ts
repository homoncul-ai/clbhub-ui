import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclService } from '../../../restsvc/hccl.service';
import { ProviderTypeRefGETData, ProviderTypeRefCriteria, ProviderTypeRefGETDataSearchResults } from '../../../restsvc/hccl.service';
declare const dhx: any;

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

  constructor(
    private hcclService: HcclService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.selectedProviderTypeRefId = id;
      } else {
        this.selectedProviderTypeRefId = null;
      }
    });
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
    const container = this.gridContainer.nativeElement;
    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      setTimeout(() => this.initializeGrid(), 100);
      return;
    }
    try {
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
        drag: true,
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
      this.grid.events.on('cellClick', (row: any, col: any, e: any) => {
        if (col && col.id !== 'select' && row && row.id) {
          this.onRowClick(row.id);
        }
      });
      this.loadProviderTypeRefData();
    } catch (error) {
      console.error('Error initializing DHTMLX grid:', error);
    }
  }

  public onRowClick(id: string): void {
    this.router.navigate(['/advocate-dashboard/integrations/providertyperefs', id, 'details']);
  }

  private loadProviderTypeRefData(searchCriteria?: string) {
    const criteria: ProviderTypeRefCriteria = {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
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
          }));
          this.grid.data.parse(gridData);
        }
      },
      error: (error) => {
        console.error('Error loading ProviderTypeRef data:', error);
        this.grid.data.parse([]);
      }
    });
  }
} 