import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const dhx: any;

@Component({
  selector: 'app-clschools-list',
  template: `
    <div class="schools-list-container">
      <h3>CLSchools Integration</h3>
      <div class="schools-actions">
        <button class="btn btn-primary">Add School</button>
        <button class="btn btn-secondary">Sync Schools</button>
      </div>
      <div #gridContainer class="schools-grid"></div>
    </div>
  `,
  styles: [`
    .schools-list-container {
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
    .schools-actions {
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
    .schools-grid {
      height: 500px;
      border: 1px solid #eee;
      border-radius: 4px;
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class CLSchoolsListComponent implements OnInit, AfterViewInit {
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
          { id: 'schoolName', header: [{ text: 'School Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
          { id: 'schoolCode', header: [{ text: 'School Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
          { id: 'status', header: [{ text: 'Status', align: 'center' }, { content: 'selectFilter' }], minWidth: 120, adjust: true },
          { id: 'lastSync', header: [{ text: 'Last Sync', align: 'center' }], minWidth: 150, adjust: true },
        ],
        css: "schools-grid",
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
        { id: '1', schoolName: 'Highland High School', schoolCode: 'HHS', status: 'Active', lastSync: '2024-01-15 10:30' },
        { id: '2', schoolName: 'Central Middle School', schoolCode: 'CMS', status: 'Active', lastSync: '2024-01-14 15:45' },
        { id: '3', schoolName: 'Elementary Academy', schoolCode: 'EA', status: 'Inactive', lastSync: '2024-01-10 09:20' },
      ];
      
      this.grid.data.parse(sampleData);
    } catch (error) {
      console.error('Error initializing schools grid:', error);
    }
  }
} 