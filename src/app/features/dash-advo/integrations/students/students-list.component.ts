import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HcclService } from '../../../../restsvc/hccl.service';
import { CLStudentGETData, CLStudentCriteria, CLStudentGETDataSearchResults } from '../../../../restsvc/hccl.interfaces';
import { forkJoin } from 'rxjs';

declare const dhx: any;

/**
 * Component for displaying and managing CLStudent data using HcclService
 * Uses CLStudentGETData interface for proper field mapping and labels
 */

@Component({
  selector: 'app-clstudents-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.css']
})
export class CLStudentsListComponent implements OnInit, AfterViewInit {
  @ViewChild('gridContainer') gridContainer!: ElementRef;
  private grid: any;
  private isDhtmlxLoaded = false;

  constructor(
    private hcclService: HcclService
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
          { id: 'select', header: [{ text: '' }], type: 'boolean', editorType: 'checkbox', editable: true, width: 50 },
          { id: 'schoolCode', header: [{ text: 'School', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
          { id: 'name', header: [{ text: 'Student Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
          { id: 'businessCode', header: [{ text: 'Student ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
          { id: 'firstName', header: [{ text: 'First Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
          { id: 'lastName', header: [{ text: 'Last Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
          { id: 'userEmail', header: [{ text: 'Email', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
          { id: 'cellPhoneNumber', header: [{ text: 'Cell Phone', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
          { id: 'workPhoneNumber', header: [{ text: 'Work Phone', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
          //{ id: 'available', header: [{ text: 'Sync Status', align: 'center' }, { content: 'selectFilter' }], minWidth: 100, adjust: true },
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
      this.loadStudentData();

    } catch (error) {
      console.error('Error initializing DHTMLX grid:', error);
    }
  }

  private loadStudentData(searchCriteria?: string) {
    const criteria: CLStudentCriteria = {
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
        //        criteria.businessCode = searchCriteria;
      }
    }

    this.hcclService.findCLStudents(criteria).subscribe({
      next: (response: CLStudentGETDataSearchResults) => {
        if (response.searchResults) {
          const students = response.searchResults;
          const uniqueSchoolIds = Array.from(new Set(students.map(s => s.schoolId).filter(Boolean)));

          if (uniqueSchoolIds.length === 0) {
            // No school IDs, just parse students with blank schoolCode
            const gridData = students.map(student => ({
              ...student,
              select: false,
              schoolCode: ''
            }));
            this.grid.data.parse(gridData);
            return;
          }

          // Fetch all schools in parallel
          forkJoin(
            uniqueSchoolIds.filter((id): id is string => !!id).map(id => this.hcclService.getCLSchoolById(id))
          ).subscribe({
            next: (schools) => {
              const schoolMap: { [id: string]: string } = {};
              schools.forEach(school => {
                if (school && school.id) {
                  schoolMap[school.id] = school.businessCode || '';
                }
              });
              const gridData = students.map(student => ({
                ...student,
                select: false,
                schoolCode: student.schoolId ? schoolMap[student.schoolId] || '' : ''
              }));
              this.grid.data.parse(gridData);
              console.log("Loaded students:", gridData.length);
            },
            error: (error) => {
              console.error('Error loading school data:', error);
              // Fallback: load students with blank schoolCode
              const gridData = students.map(student => ({
                ...student,
                select: false,
                schoolCode: ''
              }));
              this.grid.data.parse(gridData);
            }
          });
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

  public onPromoteStudents() {
    if (this.grid) {
      // Get all data from the grid
      const allData = this.grid.data.serialize();
      // Filter to get only selected rows (where select is true)
      const selectedStudents = allData.filter((row: any) => row.select === true);
      
      if (selectedStudents.length === 0) {
        alert('Please select at least one student to promote.');
        return;
      }
      
      // Extract the IDs of selected students
      const selectedIds = selectedStudents.map((student: any) => student.id);
      
      // Show alert with selected IDs
      alert(`Selected Student IDs: ${selectedIds.join(', ')}`);
      console.log('Selected student IDs for promotion:', selectedIds);
    }
  }

  public onSearch(query: string) {
    console.log('Search submitted:', query);
    this.loadStudentData(query);
  }

  public onAdvancedSearch() {
    // TODO: Implement advanced search logic
    console.log('Advanced search clicked');
  }

  public onImportStudents() {
    // TODO: Implement import functionality
    console.log('Import students clicked');
  }

  public onSyncStudents() {
    // TODO: Implement sync functionality
    console.log('Sync students clicked');
  }

  public onExportStudents() {
    // TODO: Implement export functionality
    console.log('Export students clicked');
  }
} 