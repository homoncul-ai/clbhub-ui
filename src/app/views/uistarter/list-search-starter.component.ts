import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HcclService } from '../../restsvc/hccl.service';
import { CLStudentGETData, CLStudentCriteria, CLStudentGETDataSearchResults, HcclOrganizationGETData } from '../../restsvc/hccl.interfaces';

declare const dhx: any;

/**
 * Component for displaying and managing CLStudent data using HcclService
 * Uses CLStudentGETData interface for proper field mapping and labels
 */

@Component({
  selector: 'app-list-search-starter',
  templateUrl: './list-search-starter.component.html',
  styleUrls: ['./list-search-starter.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ListSearchStarterComponent implements OnInit, AfterViewInit {
  @ViewChild('gridContainer') gridContainer!: ElementRef;
  @Input() id?: string; // Input parameter for organization ID
  
  private grid: any;
  private isDhtmlxLoaded = false;
  private organization: HcclOrganizationGETData | null = null;

  constructor(
    private hcclService: HcclService
  ) {}

  async ngOnInit() {
    // Load organization if ID is provided
    if (this.id) {
      this.loadParentEntity();
    }
    
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
          { id: 'name', header: [{ text: 'Student Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
          { id: 'businessCode', header: [{ text: 'Business Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
          { id: 'firstName', header: [{ text: 'First Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
          { id: 'lastName', header: [{ text: 'Last Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
          { id: 'userEmail', header: [{ text: 'Email', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
          { id: 'cellPhoneNumber', header: [{ text: 'Cell Phone', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
          { id: 'workPhoneNumber', header: [{ text: 'Work Phone', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
          { id: 'schoolId', header: [{ text: 'School ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
          { id: 'available', header: [{ text: 'Available', align: 'center' }, { content: 'inputFilter' }], minWidth: 100, adjust: true },
        ],
        css: "search-list-grid",
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
            { text: '' }, // Empty footer for the firstName column
            { text: '' }, // Empty footer for the lastName column
            { text: '' }, // Empty footer for the userEmail column
            { text: '' }, // Empty footer for the cellPhoneNumber column
            { text: '' }, // Empty footer for the workPhoneNumber column
            { text: '' }, // Empty footer for the schoolId column
            { text: '' }, // Empty footer for the available column
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
        // For example, if you have an array of students, you would reorder that array.
        // The grid's internal data is already updated by the drop action.
      });

      // Load initial data
      this.loadListData();

    } catch (error) {
      console.error('Error initializing DHTMLX grid:', error);
    }
  }

  private loadListData(searchCriteria?: string) {
    const criteria: CLStudentCriteria = {
      schoolId: this.id,
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };

    // Add search criteria if provided
    if (searchCriteria && searchCriteria.trim() !== '') {
      criteria.searchByText = searchCriteria;
    }

    this.hcclService.findCLStudents(criteria).subscribe({
      next: (response: CLStudentGETDataSearchResults) => {
        if (response.searchResults) {
          // Transform the data to include the select field for checkboxes
          const gridData = response.searchResults.map(student => ({
            ...student,
            select: false // Add checkbox field
          }));
          this.grid.data.parse(gridData);
          console.log("Loaded students:", gridData.length);
        } else {
          this.grid.data.parse([]);
          console.log("No students found");
        }
      },
      error: (error) => {
        console.error('Error loading student data:', error);
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
    this.loadListData(query);
  }

  public onAdvancedSearch() {
    // TODO: Implement advanced search logic
    console.log('Advanced search clicked');
  }

  /**
   * Loads the organization using the provided ID
   */
  private loadParentEntity() {
    if (!this.id) {
      console.warn('No organization ID provided');
      return;
    }

    this.hcclService.getHcclOrganizationById(this.id).subscribe({
      next: (organization: HcclOrganizationGETData) => {
        this.organization = organization;
        console.log('Organization loaded:', organization);
        // You can add additional logic here to handle the loaded organization
        // For example, update the UI or filter data based on the organization
      },
      error: (error) => {
        console.error('Error loading organization:', error);
        this.organization = null;
      }
    });
  }

  /**
   * Getter method to access the loaded organization
   */
  public getParentEntity(): HcclOrganizationGETData | null {
    return this.organization;
  }
} 