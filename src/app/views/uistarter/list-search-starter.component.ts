import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WireframeDataService } from '../../from_java/services/wireframe-data.service';
import { DataSchoolSetupService } from '../../from_java/services/data-school-setup.service';
import { UIStudentProfileList, UIStudentProfile } from '../../from_java/models/ui.models';

declare const dhx: any;

/**
 * Find the object in the restlib called HcclOrganizationGETData.  Using that object definition, 
 * - create a list of objects in JSON format that can be used to populate the grid.
 * - replace the data in the grid with the data from the list of objects.
 * - get the labels from the object definition and use them for the grid columns.
 * - use the data in tooling/hccl-data Import_Biz.yaml
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
  private grid: any;
  private isDhtmlxLoaded = false;

  constructor(
    private dataSchoolSetupService: DataSchoolSetupService,
    private wireframeDataService: WireframeDataService
  ) {}

  async ngOnInit() {
    // Wait for the data to be loaded
    await this.dataSchoolSetupService.loadFromYaml();
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
          { id: 'name', header: [{ text: 'Organization Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
          { id: 'businessCode', header: [{ text: 'Business Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
          { id: 'description', header: [{ text: 'Description', align: 'center' }, { content: 'inputFilter' }], minWidth: 250, adjust: true },
          { id: 'available', header: [{ text: 'Available', align: 'center' }, { content: 'inputFilter' }], minWidth: 100, adjust: true },
          { id: 'websiteUrl', header: [{ text: "Website URL", align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
          { id: 'jsonData', header: [{ text: 'JSON Data', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
        ],
        css: "student-grid",
        height: 600,
        autoWidth: false,
        selection: 'row',
        editable: false,
        resizable: true,
        drag: true, // Enable drag and drop
        footer: [
            { text: '' }, // Empty footer for the checkbox column
            { text: '' }, // Empty footer for the name column
            { text: '' }, // Empty footer for the business code column
            { text: '' }, // Empty footer for the description column
            { text: '' }, // Empty footer for the available column
            { text: '' }, // Empty footer for the websiteUrl column
            { text: '' }, // Empty footer for the jsonData column
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

      // Example data from Import_Biz.yaml
      const orgData = [
        { name: "Monogram Foods", businessCode: "MF001", description: "Produces pre-assembled sandwiches and operates a large food manufacturing and warehouse facility.", available: 1, websiteUrl: "https://monogramfoods.com/locations/haverhill-massachusetts/", jsonData: '{"focus": "food manufacturing, warehouse, sandwiches"}' },
        { name: "Magellan Aerospace Haverhill, Inc.", businessCode: "MAH001", description: "Manufactures aerospace components and assemblies.", available: 1, websiteUrl: "https://magellan.aero/", jsonData: '{"focus": "aerospace, components, assemblies"}' },
        { name: "Joseph's Gourmet Pasta Company", businessCode: "JGP001", description: "Produces gourmet pasta and food products for foodservice and retail.", available: 1, websiteUrl: "https://josephsgourmetpasta.com/", jsonData: '{"focus": "pasta, food manufacturing, foodservice"}' },
        { name: "Golden Fleece Manufacturing Group LLC", businessCode: "GF001", description: "Garment and textile manufacturing.", available: 1, websiteUrl: "https://southwick.com/", jsonData: '{"focus": "garments, textiles, manufacturing"}' },
        { name: "SEICA, Inc.", businessCode: "SEI001", description: "Manufactures electronic test systems and automation solutions.", available: 1, websiteUrl: "https://www.seica.com/", jsonData: '{"focus": "electronics, test systems, automation"}' },
        { name: "Häns Kissle Company", businessCode: "HK001", description: "Produces fresh prepared foods and salads for retail and foodservice.", available: 1, websiteUrl: "https://www.hanskissle.com/", jsonData: '{"focus": "prepared foods, salads, food manufacturing"}' },
        { name: "AmesburyTruth (Haverhill Facility)", businessCode: "AT001", description: "Manufactures window and door hardware and weatherseals.", available: 1, websiteUrl: "https://www.amesburytruth.com/", jsonData: '{"focus": "window hardware, door hardware, weatherseals"}' },
        { name: "Haverhill Paperboard Corp", businessCode: "HPC001", description: "Manufactures paperboard and packaging products.", available: 1, websiteUrl: "https://www.linkedin.com/company/haverhill-paperboard-corp", jsonData: '{"focus": "paperboard, packaging, manufacturing"}' },
        { name: "Progression, Inc.", businessCode: "PRG001", description: "Manufactures industrial NMR and spectroscopy analyzers.", available: 1, websiteUrl: "https://www.zippia.com/company/best-biggest-companies-in-haverhill-ma/", jsonData: '{"focus": "industrial analyzers, NMR, spectroscopy"}' },
        { name: "Haverhill Manufacturing Company", businessCode: "HM001", description: "Manufactures industrial equipment and machinery.", available: 1, websiteUrl: "https://www.haverhillmanufacturing.com/", jsonData: '{"focus": "industrial equipment, machinery"}' },
      ];
      this.grid.data.parse(orgData);
      console.log("size of orgs", orgData.length);
    } catch (error) {
      console.error('Error initializing DHTMLX grid:', error);
    }
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
    // TODO: Implement search logic
    console.log('Search submitted:', query);
  }

  public onAdvancedSearch() {
    // TODO: Implement advanced search logic
    console.log('Advanced search clicked');
  }
} 