import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const dhx: any;

@Component({
  selector: 'app-clstudents-list',
  template: `
    <div class="students-integration-container">
      <h3>CLStudents Integration</h3>
      <div class="students-actions">
        <button class="btn btn-primary">Import Students</button>
        <button class="btn btn-secondary">Sync Students</button>
        <button class="btn btn-info">Export Students</button>
      </div>
      <div #gridContainer class="students-integration-grid"></div>
    </div>
  `,
  styles: [`
    .students-integration-container {
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
    .students-actions {
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
    .btn-info {
      background-color: #17a2b8;
      color: white;
    }
    .students-integration-grid {
      height: 500px;
      border: 1px solid #eee;
      border-radius: 4px;
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class CLStudentsListComponent implements OnInit, AfterViewInit {
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
          { id: 'studentName', header: [{ text: 'Student Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
          { id: 'studentId', header: [{ text: 'Student ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
          { id: 'school', header: [{ text: 'School', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
          { id: 'grade', header: [{ text: 'Grade', align: 'center' }, { content: 'selectFilter' }], minWidth: 100, adjust: true },
          { id: 'syncStatus', header: [{ text: 'Sync Status', align: 'center' }, { content: 'selectFilter' }], minWidth: 120, adjust: true },
          { id: 'lastSync', header: [{ text: 'Last Sync', align: 'center' }], minWidth: 150, adjust: true },
        ],
        css: "students-integration-grid",
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
        { id: '1', studentName: 'John Smith', studentId: 'STU001', school: 'HHS', grade: '12', syncStatus: 'Synced', lastSync: '2024-01-15 10:30' },
        { id: '2', studentName: 'Jane Doe', studentId: 'STU002', school: 'HHS', grade: '11', syncStatus: 'Pending', lastSync: '2024-01-14 15:45' },
        { id: '3', studentName: 'Mike Johnson', studentId: 'STU003', school: 'CMS', grade: '8', syncStatus: 'Error', lastSync: '2024-01-10 09:20' },
        { id: '4', studentName: 'Sarah Wilson', studentId: 'STU004', school: 'HHS', grade: '12', syncStatus: 'Synced', lastSync: '2024-01-15 11:15' },
      ];
      
      this.grid.data.parse(sampleData);
    } catch (error) {
      console.error('Error initializing students integration grid:', error);
    }
  }
} 