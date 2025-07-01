import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HcclService } from '../../../restsvc/hccl.service';
import { 
  HcclUserProfileGETData, 
  HcclUserProfileCriteria, 
  HcclUserProfileGETDataSearchResults,
  HcclUserContextGETData
} from '../../../restsvc/hccl.service';

declare const dhx: any;

@Component({
  selector: 'app-advo-student-list',
  template: `
    <div class="search-list-container">
      <h2>Students</h2>
      <div class="search-list-button-bar">
        <button class="search-list-button-bar-button" (click)="onGoClick()">Go</button>
        <button class="search-list-button-bar-button btn-primary" (click)="onRefresh()">Refresh</button>
      </div>
      <form class="search-list-search-bar" (submit)="onSearch(searchInput.value); $event.preventDefault();">
        <input #searchInput type="text" class="search-list-input" placeholder="search by user code or email, * for wildcard" />
        <button type="submit" class="search-list-input-button">
          <span class="material-icons" aria-label="Search">search</span>
        </button>
        <button type="button" class="search-list-input-button" (click)="onAdvancedSearch()">
          <span class="material-icons" aria-label="Advanced Search">tune</span>
        </button>
      </form>
      <div #gridContainer class="search-list-grid"></div>
    </div>
  `,
  styleUrls: ['../../../views/uistarter/list-search-starter.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AdvoStudentListComponent implements OnInit, AfterViewInit {
  @ViewChild('gridContainer') gridContainer!: ElementRef;
  private grid: any;
  private isDhtmlxLoaded = false;
  private userContext: HcclUserContextGETData | null = null;

  constructor(
    private hcclService: HcclService,
    private router: Router
  ) {}

  async ngOnInit() {
    // Load user context first to get the current user profile
    await this.loadUserContext();
    // Check if DHTMLX is loaded
    this.checkDhtmlxLoaded();
  }

  ngAfterViewInit() {
    // If DHTMLX is already loaded, initialize the grid
    if (this.isDhtmlxLoaded) {
      this.initializeGrid();
    }
  }

  private async loadUserContext(): Promise<void> {
    try {
      // Call resolveTicketContext to get the current user context
      this.hcclService.resolveTicketContext().subscribe({
        next: (context: HcclUserContextGETData) => {
          this.userContext = context;
          console.log('User context loaded:', context);
          // Load data immediately after context is loaded
          if (this.grid) {
            this.loadUserProfileData();
          }
        },
        error: (error) => {
          console.error('Error loading user context:', error);
        }
      });
    } catch (error) {
      console.error('Error in loadUserContext:', error);
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
          { id: 'select', header: [{ text: '' }], type: 'boolean', editorType: 'checkbox', editable: true, width: 50 },
          { id: 'action', header: [{ text: 'Action', align: 'center' }], width: 120, htmlEnable: true, template: () => {
            return `<button class=\"create-ticket-btn\">Create Ticket</button>`;
          }},
          { id: 'userCode', header: [{ text: 'User Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
          { id: 'profileTypeCode', header: [{ text: 'Profile Type', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
          { id: 'userEmail', header: [{ text: 'Email', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
          { id: 'cellPhoneNumber', header: [{ text: 'Cell Phone', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
          { id: 'workPhoneNumber', header: [{ text: 'Work Phone', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
          { id: 'available', header: [{ text: 'Available', align: 'center' }, { content: 'selectFilter' }], minWidth: 100, adjust: true },
          { id: 'externalUserName', header: [{ text: 'External User Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
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
            { text: '' }, // Empty footer for the action column
            { text: '' }, // Empty footer for the userCode column
            { text: '' }, // Empty footer for the profileTypeCode column
            { text: '' }, // Empty footer for the userEmail column
            { text: '' }, // Empty footer for the cellPhoneNumber column
            { text: '' }, // Empty footer for the workPhoneNumber column
            { text: '' }, // Empty footer for the organizationId column
            { text: '' }, // Empty footer for the available column
            { text: '' }, // Empty footer for the externalUserName column
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
      });

      // Use grid's cellClick event for the Action column
      this.grid.events.on('cellClick', (row: any, col: any, e: any) => {
        if (col && col.id === 'action') {
          this.createTicketForUser(row.id);
        }
      });

      // Load initial data immediately after grid is initialized
      this.loadUserProfileData();

    } catch (error) {
      console.error('Error initializing DHTMLX grid:', error);
    }
  }

  private createTicketForUser(userProfileId: string) {
    alert('Creating ticket for user profile:' + userProfileId);
    
    // Get the current user profile ID from context
    const advocateUserProfileId = this.userContext?.currentUserProfileId;
    
    if (!advocateUserProfileId) {
      console.error('No advocate user profile ID found in context');
      alert('Unable to determine advocate user profile. Please try again.');
      return;
    }

    // Navigate to create-ticket route with both advocate and client user profile IDs
    this.router.navigate(['/advocate-dashboard/tickets/create',
  advocateUserProfileId,
  userProfileId]);
  }

  private loadUserProfileData(searchCriteria?: string) {
    // Get organization ID from current user profile
    const organizationId = this.userContext?.currentUserProfile?.organizationId;
    
    if (!organizationId) {
      console.error('No organization ID found in user context');
      this.grid.data.parse([]);
      return;
    }

    const criteria: HcclUserProfileCriteria = {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true,
      profileTypeCode: 'Client',
      organizationId: organizationId // Use the organization ID from current user profile
    };

    // Add search criteria if provided, otherwise use '*' to load all records
    if (searchCriteria && searchCriteria.trim() !== '') {
      criteria.searchByText = searchCriteria;
    } else {
      criteria.searchByText = '*'; // Load all records by default
    }

    this.hcclService.findHcclUserProfiles(criteria).subscribe({
      next: (response: HcclUserProfileGETDataSearchResults) => {
        if (response.searchResults) {
          // Transform the data to include the select field for checkboxes
          const gridData = response.searchResults.map(profile => ({
            ...profile,
            select: false // Add checkbox field
          }));
          this.grid.data.parse(gridData);
          console.log("Loaded user profiles:", gridData.length);
        } else {
          this.grid.data.parse([]);
          console.log("No user profiles found");
        }
      },
      error: (error) => {
        console.error('Error loading user profile data:', error);
        this.grid.data.parse([]);
      }
    });
  }

  public onGoClick() {
    if (this.grid) {
      // DHTMLX Suite 8: get checked rows by 'select' column (checkbox)
      const allData = this.grid.data.serialize();
      const checkedRows = allData.filter((row: any) => row.select === true);
      console.log('Checked rows:', checkedRows);
      
      if (checkedRows.length > 0) {
        alert(`Selected ${checkedRows.length} user profile(s)`);
      } else {
        alert('No user profiles selected');
      }
    }
  }

  public onRefresh() {
    console.log('Refreshing user profile data...');
    this.loadUserProfileData();
  }

  public onSearch(query: string) {
    console.log('Search submitted:', query);
    this.loadUserProfileData(query);
  }

  public onAdvancedSearch() {
    // TODO: Implement advanced search logic
    console.log('Advanced search clicked');
  }
} 