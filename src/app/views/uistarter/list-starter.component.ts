import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const dhx: any;

/**
 * Basic list component - Dhtmlx list of data with sortable columns and paging
 * Example: list of students
 */
@Component({
  selector: 'app-list-starter',
  template: `
    <div class="search-list-container">
      <h2>Students List</h2>
      
      <div class="search-list-button-bar">
        <button class="search-list-button-bar-button" (click)="onGoClick()">Go</button>
        <button class="search-list-button-bar-button btn-primary" (click)="onRefresh()">Refresh</button>
      </div>
      
      <div #gridContainer class="search-list-grid"></div>
    </div>
  `,
  styleUrls: ['./list-search-starter.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ListStarterComponent implements OnInit, AfterViewInit {
  @ViewChild('gridContainer') gridContainer!: ElementRef;
  private grid: any;
  private isDhtmlxLoaded = false;

  // Fake data for demonstration
  private fakeData = [
    { id: '1', name: 'John Doe', businessCode: 'STU001', firstName: 'John', lastName: 'Doe', userEmail: 'john.doe@example.com', cellPhoneNumber: '555-0101', workPhoneNumber: '555-0102', schoolId: 'SCH001', available: 'Yes' },
    { id: '2', name: 'Jane Smith', businessCode: 'STU002', firstName: 'Jane', lastName: 'Smith', userEmail: 'jane.smith@example.com', cellPhoneNumber: '555-0201', workPhoneNumber: '555-0202', schoolId: 'SCH001', available: 'Yes' },
    { id: '3', name: 'Bob Johnson', businessCode: 'STU003', firstName: 'Bob', lastName: 'Johnson', userEmail: 'bob.johnson@example.com', cellPhoneNumber: '555-0301', workPhoneNumber: '555-0302', schoolId: 'SCH002', available: 'No' },
    { id: '4', name: 'Alice Williams', businessCode: 'STU004', firstName: 'Alice', lastName: 'Williams', userEmail: 'alice.williams@example.com', cellPhoneNumber: '555-0401', workPhoneNumber: '555-0402', schoolId: 'SCH002', available: 'Yes' },
    { id: '5', name: 'Charlie Brown', businessCode: 'STU005', firstName: 'Charlie', lastName: 'Brown', userEmail: 'charlie.brown@example.com', cellPhoneNumber: '555-0501', workPhoneNumber: '555-0502', schoolId: 'SCH001', available: 'Yes' },
  ];

  ngOnInit() {
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
          { id: 'name', header: [{ text: 'Student Name', align: 'center' }], minWidth: 200, adjust: true },
          { id: 'businessCode', header: [{ text: 'Business Code', align: 'center' }], minWidth: 120, adjust: true },
          { id: 'firstName', header: [{ text: 'First Name', align: 'center' }], minWidth: 120, adjust: true },
          { id: 'lastName', header: [{ text: 'Last Name', align: 'center' }], minWidth: 120, adjust: true },
          { id: 'userEmail', header: [{ text: 'Email', align: 'center' }], minWidth: 200, adjust: true },
          { id: 'cellPhoneNumber', header: [{ text: 'Cell Phone', align: 'center' }], minWidth: 120, adjust: true },
          { id: 'workPhoneNumber', header: [{ text: 'Work Phone', align: 'center' }], minWidth: 120, adjust: true },
          { id: 'schoolId', header: [{ text: 'School ID', align: 'center' }], minWidth: 120, adjust: true },
          { id: 'available', header: [{ text: 'Available', align: 'center' }], minWidth: 100, adjust: true },
        ],
        css: "search-list-grid",
        height: 600,
        autoWidth: false,
        selection: 'row',
        editable: false,
        resizable: true,
        sortable: true,
        footer: [
          { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' },
          { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' },
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

      this.loadListData();
    } catch (error) {
      console.error('Error initializing DHTMLX grid:', error);
    }
  }

  private loadListData() {
    const gridData = this.fakeData.map(item => ({
      ...item,
      select: false
    }));
    this.grid.data.parse(gridData);
  }

  public onGoClick() {
    if (this.grid) {
      const allData = this.grid.data.serialize();
      const checkedRows = allData.filter((row: any) => row.select === true);
      console.log('Checked rows:', checkedRows);
      alert(`Selected ${checkedRows.length} student(s)`);
    }
  }

  public onRefresh() {
    this.loadListData();
  }
}

