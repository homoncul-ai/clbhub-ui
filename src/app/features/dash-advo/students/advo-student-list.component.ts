import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WireframeDataService } from '../../../from_java/services/wireframe-data.service';
import { DataSchoolSetupService } from '../../../from_java/services/data-school-setup.service';
import { UIStudentProfileList, UIStudentProfile } from '../../../from_java/models/ui.models';

@Component({
  selector: 'app-advo-student-list',
  template: `
    <div class="student-list-container">
      <h2>HHS Students</h2>
      <div class="student-list">
        @if (students.length > 0) {
          @for (student of students; track student.profile!.studentPersonCode) {
            <div class="student-item">
              <div class="student-name">{{ student.student?.firstName || '' }} {{ student.student?.lastName || '' }}</div>
              <div class="student-id">ID: {{ student.profile!.studentPersonCode }}</div>
            </div>
          }
        } @else {
          <div class="loading-message">Loading students...</div>
        }
      </div>
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
      max-height: 600px;
      overflow-y: auto;
      border: 1px solid #eee;
      border-radius: 4px;
    }
    .student-item {
      padding: 12px 16px;
      border-bottom: 1px solid #eee;
    }
    .student-item:last-child {
      border-bottom: none;
    }
    .student-name {
      font-weight: 500;
      color: #333;
    }
    .student-id {
      font-size: 0.9em;
      color: #666;
      margin-top: 4px;
    }
    .loading-message {
      padding: 16px;
      text-align: center;
      color: #666;
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class AdvoStudentListComponent implements OnInit {
  private _studentList: UIStudentProfileList = new UIStudentProfileList();

  get students(): UIStudentProfile[] {
    return this._studentList.students || [];
  }

  constructor(
    private dataSchoolSetupService: DataSchoolSetupService,
    private wireframeDataService: WireframeDataService
  ) {}

  async ngOnInit() {
    // Wait for the data to be loaded
    await this.dataSchoolSetupService.loadFromYaml();
    // Now get the students using the injected service
    this._studentList = this.wireframeDataService.studentsInSchool('HHS');
    console.log("size of students", this._studentList.students.length);
  }
} 