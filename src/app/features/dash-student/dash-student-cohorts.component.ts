import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CohortParticipantUiExampleComponent } from './cohorts/cohort-participant-ui-example.component';

@Component({
  selector: 'app-dash-student-cohorts',
  standalone: true,
  imports: [CommonModule, CohortParticipantUiExampleComponent],
  template: `
    <div class="container-fluid">
      <app-cohort-participant-ui-example></app-cohort-participant-ui-example>
    </div>
  `,
})
export class DashStudentCohortsComponent {}
