import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const dhx: any;

@Component({
  selector: 'app-clguidance-list',
  template: `
    <div class="guidance-integration-container">
      <h3>CLGuidance Counsellors Integration</h3>
      <div class="guidance-actions">
        <button class="btn btn-primary">Add Counsellor</button>
        <button class="btn btn-secondary">Sync Counsellors</button>
        <button class="btn btn-success">Assign Students</button>
      </div>
      <div #gridContainer class="guidance-integration-grid"></div>
    </div>
  `,
  styles: [`
    .guidance-integration-container {
      margin: 16px;
      padding: 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
    }
    h3 {
      margin: 0 0 16px 0;
      color: #333;
    }
    .guidance-actions {
      margin-bottom: 16px;
    }
    .btn {
      margin-right: 8px;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-primary {
      background-color: #007bff;
      color: white;
    }
    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }
    .btn-success {
      background-color: #28a745;
      color: white;
    }
    .guidance-integration-grid {
      height: 500px;
      border: 1px solid #eee;
      border-radius: 4px;
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class CLGuidanceListComponent implements OnInit, AfterViewInit {
  @ViewChild('gridContainer') gridContainer!: ElementRef;
  private grid: any;
  private isDhtmlxLoaded = false;

  constructor() {}

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
          { id: 'counsellorName', header: [{ text: 'Counsellor Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
          { id: 'counsellorId', header: [{ text: 'Counsellor ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
          { id: 'school', header: [{ text: 'School', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
          { id: 'email', header: [{ text: 'Email', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
          { id: 'studentCount', header: [{ text: 'Students Assigned', align: 'center' }], minWidth: 150, adjust: true },
          { id: 'status', header: [{ text: 'Status', align: 'center' }, { content: 'selectFilter' }], minWidth: 120, adjust: true },
          { id: 'lastSync', header: [{ text: 'Last Sync', align: 'center' }], minWidth: 150, adjust: true },
        ],
        css: "guidance-integration-grid",
        height: 500,
        autoWidth: false,
        selection: 'row',
        editable: false,
        resizable: true,
        pagination: {
          limit: 10,
          enabled: true,
          countable: true,
          navs: true,
          pageSizes: [10, 20, 50],
          range: true,
        }
      });

      // Sample data
      const sampleData = [
        { id: '1', counsellorName: 'Dr. Sarah Johnson', counsellorId: 'GC001', school: 'HHS', email: 'sarah.johnson@school.edu', studentCount: 45, status: 'Active', lastSync: '2024-01-15 10:30' },
        { id: '2', counsellorName: 'Mr. Robert Davis', counsellorId: 'GC002', school: 'HHS', email: 'robert.davis@school.edu', studentCount: 38, status: 'Active', lastSync: '2024-01-14 15:45' },
        { id: '3', counsellorName: 'Ms. Lisa Wilson', counsellorId: 'GC003', school: 'CMS', email: 'lisa.wilson@school.edu', studentCount: 52, status: 'Active', lastSync: '2024-01-15 11:15' },
        { id: '4', counsellorName: 'Dr. Michael Brown', counsellorId: 'GC004', school: 'HHS', email: 'michael.brown@school.edu', studentCount: 0, status: 'Inactive', lastSync: '2024-01-10 09:20' },
      ];
      
      this.grid.data.parse(sampleData);
    } catch (error) {
      console.error('Error initializing guidance integration grid:', error);
    }
  }
} 