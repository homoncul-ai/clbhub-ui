import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WireframeDataService } from '../../from_java/services/wireframe-data.service';
import { DataSchoolSetupService } from '../../from_java/services/data-school-setup.service';
import { UIStudentProfileList, UIStudentProfile } from '../../from_java/models/ui.models';

declare const dhx: any;

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
          { id: 'firstName', header: [{ text: 'First Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
          { id: 'lastName', header: [{ text: 'Last Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
          { id: 'studentId', header: [{ text: 'Student ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
          { id: 'year', header: [{ text: 'Year', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
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
            { text: '' }, // Empty footer for the first name column
            { text: '' }, // Empty footer for the last name column
            { text: '' }, // Empty footer for the student ID column
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

      // Get students and load them into the grid
      const studentList = this.wireframeDataService.studentsInSchool('HHS');
      // Map the student data to match grid column IDs
      const gridData = studentList.students.map(studentProfile => ({
        id: studentProfile.profile?.studentPersonCode,
        firstName: studentProfile.student?.firstName,
        lastName: studentProfile.student?.lastName,
        studentId: studentProfile.profile?.studentPersonCode,
        year: studentProfile.profile?.graduationYear,
      }));
      this.grid.data.parse(gridData);
      console.log("size of students", gridData.length);
    } catch (error) {
      console.error('Error initializing DHTMLX grid:', error);
    }
  }
} 