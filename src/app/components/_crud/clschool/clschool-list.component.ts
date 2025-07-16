import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HcclService } from '../../../restsvc/hccl.service';
import { CLSchoolGETData, CLSchoolCriteria, CLSchoolGETDataSearchResults } from '../../../restsvc/hccl.service';

declare const dhx: any;

/**
 * Component for displaying and managing CLSchool data using HcclService
 * Uses CLSchoolGETData interface for proper field mapping and labels
 */

@Component({
  selector: 'app-clschool-list',
  templateUrl: './clschool-list.component.html',
  styleUrls: ['./clschool-list.component.css']
})
export class CLSchoolListComponent implements OnInit, AfterViewInit {
  @ViewChild('gridContainer') gridContainer!: ElementRef;
  private grid: any;
  private isDhtmlxLoaded = false;

  constructor(
    private hcclService: HcclService,
    private router: Router
  ) {}

  async ngOnInit() {
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
      return;
    }

    try {
      // Initialize DHTMLX grid with pagination and drag and drop
      this.grid = new dhx.Grid(this.gridContainer.nativeElement, {
        columns: [
          { id: 'select', header: [{ text: '' }], type: 'checkbox', width: 50 },
          { id: 'name', header: [{ text: 'School Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
          { id: 'businessCode', header: [{ text: 'School Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
          { id: 'organizationName', header: [{ text: 'Organization', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
          { id: 'addressLine1', header: [{ text: 'Address', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
          { id: 'districtCode', header: [{ text: 'District Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
          { id: 'available', header: [{ text: 'Status', align: 'center' }, { content: 'selectFilter' }], minWidth: 100, adjust: true },
          { id: 'dataOriginCode', header: [{ text: 'Data Origin', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
        ],
        css: "school-grid",
        height: 600,
        autoWidth: false,
        selection: 'row',
        editable: false,
        resizable: true,
        drag: true, // Enable drag and drop
        footer: [
            { text: '' }, // Empty footer for the checkbox column
            { text: '' }, // Empty footer for the name column
            { text: '' }, // Empty footer for the businessCode column
            { text: '' }, // Empty footer for the organizationName column
            { text: '' }, // Empty footer for the addressLine1 column
            { text: '' }, // Empty footer for the districtCode column
            { text: '' }, // Empty footer for the available column
            { text: '' }, // Empty footer for the dataOriginCode column
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

      // Attach afterRowDrop event listener
      this.grid.events.on("afterRowDrop", (from: string, to: string, dragInfo: any) => {
        console.log(`Row with ID ${from} was dropped before row with ID ${to}`);
        // You would typically update your data source here to reflect the new order
        // For example, if you have an array of schools, you would reorder that array.
        // The grid's internal data is already updated by the drop action.
      });

      // Add row click event listener
      this.grid.events.on('cellClick', (row: any, col: any, e: any) => {
        console.log('Cell clicked:', row, col);
       // alert('Cell clicked:' + row.id + ' ' + col.id);
        // Don't trigger on checkbox column or if no row data
        if (col && col.id !== 'select' && row && row.id) {
          console.log('Calling onRowClick with schoolId:', row.id);
          this.onRowClick(row.id);
        }
      });

      // Load initial data
      this.loadSchoolData();

    } catch (error) {
      console.error('Error initializing DHTMLX grid:', error);
    }
  }

  private loadSchoolData(searchCriteria?: string) {
    const criteria: CLSchoolCriteria = {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };

    // Add search criteria if provided
    if (searchCriteria && searchCriteria.trim() !== '') {
      if (searchCriteria.includes('*')) {
        // Handle wildcard search - remove * and search by name
        criteria.name = searchCriteria.replace(/\*/g, '%');
      } else {
        // Search by name or businessCode
        criteria.name = searchCriteria;
        criteria.businessCode = searchCriteria;
      }
    }

    this.hcclService.findCLSchools(criteria).subscribe({
      next: (response: CLSchoolGETDataSearchResults) => {
        if (response.searchResults) {
          // Transform the data to include the select field for checkboxes
          const gridData = response.searchResults.map(school => ({
            ...school,
            select: false // Add checkbox field
          }));
          this.grid.data.parse(gridData);
          console.log("Loaded schools:", gridData.length);
        } else {
          this.grid.data.parse([]);
          console.log("No schools found");
        }
      },
      error: (error) => {
        console.error('Error loading school data:', error);
        this.grid.data.parse([]);
      }
    });
  }

  public onGoClick() {
    if (this.grid) {
      // DHTMLX Suite 8: get checked rows by 'select' column (checkbox)
      // The checked state is stored in the 'select' property of each row
      const allData = this.grid.data.serialize();
      const checkedRows = allData.filter((row: any) => row.select === true);
      console.log('Checked rows:', checkedRows);
    }
  }

  public onSearch(query: string) {
    console.log('Search submitted:', query);
    this.loadSchoolData(query);
  }

  public onAdvancedSearch() {
    // TODO: Implement advanced search logic
    console.log('Advanced search clicked');
  }

  public onAddSchool() {
    // TODO: Implement add school functionality
    console.log('Add school clicked');
  }

  public onSyncSchools() {
    // TODO: Implement sync functionality
    console.log('Sync schools clicked');
  }

  /**
   * Handle row click to show school details
   * @param schoolId The ID of the clicked school
   */
  public onRowClick(schoolId: string): void {
    console.log('onRowClick1 called with schoolId:', schoolId); 
    this.router.navigate(['/advocate-dashboard/integrations/schools', schoolId, 'details']);
  }
} 