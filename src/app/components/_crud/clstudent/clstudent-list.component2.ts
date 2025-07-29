import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclService } from '../../../restsvc/hccl.service';
import { CLStudentGETData, CLStudentCriteria, CLStudentGETDataSearchResults, SimpleRestActionResponse } from '../../../restsvc/hccl.service';
import { forkJoin } from 'rxjs';    
import { CLStudentCrudComponent } from './clstudent-crud.component';
import { SimpleTabsetComponent, SimpleTab } from '@app/components/_global/simple-tabset/simple-tabset.component';

declare const dhx: any;

/**
 * Component for displaying and managing CLStudent data using HcclService
 * Uses CLStudentGETData interface for proper field mapping and labels
 */

@Component({
  selector: 'app-clstudent-list',
  templateUrl: './clstudent-list.component.html',
  styleUrls: ['../list-search-starter.component.css'],
  imports: [CommonModule]
})
export class CLStudentListComponent2 implements OnInit, AfterViewInit {
  @ViewChild('gridContainer') gridContainer!: ElementRef;
  private grid: any;
  private isDhtmlxLoaded = false;

 
  public selectedStudentId: string | null = null;
  

  constructor(
    private hcclService: HcclService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
 
  ngOnInit() {
    // Check for ID parameter in route
    this.route.params.subscribe(params => {
      const studentId = params['id'];
      if (studentId) {
        alert('Student ID found: ' + studentId);
        this.selectedStudentId = studentId;
      } else {
        this.selectedStudentId = null;
        
      }
    });

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
      console.log('Grid initialization skipped - container or DHTMLX not ready');
      return;
    }

    // Check if the grid container is visible
    const container = this.gridContainer.nativeElement;
    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      console.log('Grid container not visible, retrying in 100ms');
      setTimeout(() => this.initializeGrid(), 100);
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

      // Add row click event listener
      this.grid.events.on('cellClick', (row: any, col: any, e: any) => {
        console.log('Cell clicked:', row, col);
       // alert('Cell clicked:' + row.id + ' ' + col.id);
        // Don't trigger on checkbox column or if no row data
        if (col && col.id !== 'select' && row && row.id) {
          console.log('Calling onRowClick with studentId:', row.id);
          //alert('Calling onRowClick with studentId:' + row.id);
          this.onRowClick(row.id);
        }
      });

      // Load initial data
      this.loadStudentData();

    } catch (error) {
      console.error('Error initializing DHTMLX grid:', error);
    }
  }

  /**
   * Handle row click to show student details
   * @param studentId The ID of the clicked student
   */
  public onRowClick(studentId: string): void {
    console.log('onRowClick1 called with studentId:', studentId); 
    this.router.navigate(['/advocate-dashboard/integrations/students', studentId, 'details']);
  }
 
  /**
   * Refresh the grid by reinitializing it
   */
  private refreshGrid(): void {
    console.log('Refreshing grid...');
    if (this.grid) {
      // Destroy the existing grid
      this.grid.destructor();
      this.grid = null;
    }
    // Reinitialize the grid
    this.initializeGrid();
  }


  private loadStudentData(searchCriteria?: string) {
    const criteria: CLStudentCriteria = {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };

    // Add search criteria if provided
    if (searchCriteria && searchCriteria.trim() !== '') {
      criteria.searchByText = searchCriteria;
    }
    if (this.selectedStudentId) {
      criteria.ids = [this.selectedStudentId];
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
    alert('onGoClick called');
    // if (this.grid) {
    //   // DHTMLX Suite 8: get checked rows by 'select' column (checkbox)
    //   // The checked state is stored in the 'select' property of each row
    //   const allData = this.grid.data.serialize();
    //   const checkedRows = allData.filter((row: any) => row.select === true);
    //   console.log('Checked rows:', checkedRows);
      
    //   if (checkedRows.length > 0) {
    //     // Route to the first selected student's details
    //     const firstStudent = checkedRows[0];
    //     const studentId = firstStudent.businessCode || firstStudent.id;
    //     this.router.navigate(['/advocate-dashboard/integrations/students', studentId, 'details']);
    //   } else {
    //     alert('No students selected');
    //   }
    // }
  }

  public onPromoteStudents() {
    if (this.grid) {
      const allData = this.grid.data.serialize();
      const checkedRows = allData.filter((row: any) => row.select === true);
      
      if (checkedRows.length === 0) {
        alert('Please select at least one student to promote');
        return;
      }

      const studentIds = checkedRows.map((row: any) => row.id);
      console.log('Promoting students:', studentIds);


      // TODO: Implement promotion logic
      //alert(`Promoting ${checkedRows.length} student(s)` + ' ' + studentIds.join(', '));
      var criteria: CLStudentCriteria = {
        ids: studentIds,
        pageNumber: 1,
        pageSize: 50,
        isPaging: true
      };
      this.hcclService.promoteStudentsToUsers(criteria).subscribe({
        next: (response: SimpleRestActionResponse) => {
          alert('Promotion successful');
        },
        error: (error: any) => {
          alert('Promotion failed');
        }
      });
    }
  }

  public onRefresh() {
    this.loadStudentData();
  }

  public onSearch(query: string) {
    this.loadStudentData(query);
  }

  public onAdvancedSearch() {
    // TODO: Implement advanced search functionality
    alert('Advanced search functionality not yet implemented');
  }

  public onImportStudents() {
    // TODO: Implement import functionality
    alert('Import functionality not yet implemented');
  }

  public onSyncStudents() {
    // TODO: Implement sync functionality
    alert('Sync functionality not yet implemented');
  }

  public onExportStudents() {
    // TODO: Implement export functionality
    alert('Export functionality not yet implemented');
  }
} 