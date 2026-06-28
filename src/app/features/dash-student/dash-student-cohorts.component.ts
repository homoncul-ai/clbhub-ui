import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { COHORT_PARTICIPANT_PRESET_LIST } from './cohorts/cohort-participant-mock-presets';

@Component({
  selector: 'app-dash-student-cohorts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dash-student-cohorts.component.html',
  styleUrl: './dash-student-cohorts.component.scss',
})
export class DashStudentCohortsComponent {
  cohortSpecs = COHORT_PARTICIPANT_PRESET_LIST.map((preset) => ({
    key: preset.key,
    label: preset.label,
    description: preset.description,
    leader: preset.mockCohort.leader,
    schedule: `${preset.mockCohort.startDate} – ${preset.mockCohort.endDate}`,
    route: preset.key === 'healthcare' ? 'healthcare-ui-example' : 'ai-exploration-ui-example',
  }));
}
