import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HcclService } from '../../../restsvc/hccl.service';
import { 
  HcclUserProfileGETData, 
  HcclUserProfileCriteria, 
  HcclUserProfileGETDataSearchResults,
  HcclUserContextGETData
} from '../../../restsvc/hccl.interfaces';

declare const dhx: any;

@Component({
  selector: 'app-advo-student-list',
  template: `
    <div class="student-list-container">
      <h2>HCCL User Profiles</h2>
      <div class="button-bar" style="margin-bottom: 16px; display: flex; gap: 8px;">
        <button (click)="onGoClick()">Go</button>
        <button (click)="onRefresh()" class="btn btn-primary">Refresh</button>
      </div>
      <form class="search-bar" style="margin-bottom: 16px; display: flex; align-items: center; gap: 8px;" (submit)="onSearch(searchInput.value); $event.preventDefault();">
        <input #searchInput type="text" placeholder="search by user code or email, * for wildcard" style="flex: 1; padding: 6px 8px; border-radius: 4px; border: 1px solid #ccc;" />
        <button type="submit" style="background: none; border: none; cursor: pointer; padding: 4px;">
          <span class="material-icons" aria-label="Search">search</span>
        </button>
        <button type="button" style="background: none; border: none; cursor: pointer; padding: 4px;" (click)="onAdvancedSearch()">
          <span class="material-icons" aria-label="Advanced Search">tune</span>
        </button>
      </form>
      <div #gridContainer class="student-grid"></div>
    </div>
  `,
  styles: [`
    .student-list-container {
      margin: 16px;
      padding: 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
    }
    h2 {
      margin: 0 0 16px 0;
      color: #333;
    }
    .student-grid {
      height: 600px;
      border-radius: 4px;
    }
    .button-bar button {
      padding: 8px 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: #f8f9fa;
      cursor: pointer;
    }
    .button-bar button:hover {
      background: #e9ecef;
    }
    .btn-primary {
      background: #007bff !important;
      color: white;
      border-color: #007bff !important;
    }
    .btn-primary:hover {
      background: #0056b3 !important;
    }
    .create-ticket-btn {
      background: #28a745;
      color: white;
      border: none;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }
    .create-ticket-btn:hover {
      background: #218838;
    }
  `],
  styleUrls: ['./advo-student-list.component.css'],
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
          { id: 'organizationId', header: [{ text: 'Organization ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
          { id: 'available', header: [{ text: 'Available', align: 'center' }, { content: 'selectFilter' }], minWidth: 100, adjust: true },
          { id: 'externalUserName', header: [{ text: 'External User Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
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

      // Load initial data
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

    // Add search criteria if provided
    if (searchCriteria && searchCriteria.trim() !== '') {
      if (searchCriteria.includes('*')) {
        // Handle wildcard search - remove * and search by userCode
        criteria.userCode = searchCriteria.replace(/\*/g, '%');
      } else {
        // Search by userCode or userEmail
        criteria.userCode = searchCriteria;
        criteria.userEmail = searchCriteria;
      }
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