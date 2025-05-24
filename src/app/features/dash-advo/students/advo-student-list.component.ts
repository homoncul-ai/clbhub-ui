import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WireframeDataService } from '../../../from_java/services/wireframe-data.service';
import { DataSchoolSetupService } from '../../../from_java/services/data-school-setup.service';
import { UIStudentProfileList, UIStudentProfile } from '../../../from_java/models/ui.models';

declare const dhx: any;

@Component({
  selector: 'app-advo-student-list',
  template: `
    <div class="student-list-container">
      <h2>HHS Students</h2>
      <div #listContainer class="student-list"></div>
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
    .student-list {
      height: 600px;
      border: 1px solid #eee;
      border-radius: 4px;
    }
  `],
  styleUrls: ['./advo-student-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AdvoStudentListComponent implements OnInit, AfterViewInit {
  @ViewChild('listContainer') listContainer!: ElementRef;
  private list: any;
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
    // If DHTMLX is already loaded, initialize the list
    if (this.isDhtmlxLoaded) {
      this.initializeList();
    }
  }

  private checkDhtmlxLoaded() {
    if (typeof dhx !== 'undefined') {
      this.isDhtmlxLoaded = true;
      this.initializeList();
    } else {
      // If not loaded, wait for it
      const checkInterval = setInterval(() => {
        if (typeof dhx !== 'undefined') {
          this.isDhtmlxLoaded = true;
          this.initializeList();
          clearInterval(checkInterval);
        }
      }, 100);

      // Clear interval after 5 seconds to prevent infinite checking
      setTimeout(() => {
        clearInterval(checkInterval);
      }, 5000);
    }
  }

  private initializeList() {
    if (!this.listContainer?.nativeElement || !this.isDhtmlxLoaded) {
      return;
    }

    try {
      // Initialize DHTMLX list
      this.list = new dhx.List(this.listContainer.nativeElement, {
        template: (item: any) => `
          <div class="student-item">
            <div class="student-name">${item.student?.firstName || ''} ${item.student?.lastName || ''}</div>
            <div class="student-id">ID: ${item.profile?.studentPersonCode || ''}</div>
          </div>
        `,
        css: "student-list",
        height: 600,
        itemHeight: 60,
        templateBack: true,
        selection: true,
        drag: false,
        editable: false
      });

      // Get students and load them into the list
      const studentList = this.wireframeDataService.studentsInSchool('HHS');
      this.list.data.parse(studentList.students);
      console.log("size of students", studentList.students.length);
    } catch (error) {
      console.error('Error initializing DHTMLX list:', error);
    }
  }
} 