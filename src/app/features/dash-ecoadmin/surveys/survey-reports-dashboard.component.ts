import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ADMIN_SURVEYS_BASE,
  getOlderSurveys,
  getRecentSurveys,
} from '@app/features/surveys/survey-registry';

@Component({
  selector: 'app-survey-reports-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './survey-reports-dashboard.component.html',
  styleUrl: './survey-reports-dashboard.component.scss',
})
export class SurveyReportsDashboardComponent {
  /** Base path for the internal results viewer. */
  readonly resultsBase = ADMIN_SURVEYS_BASE;

  readonly recentSurveys = getRecentSurveys();
  readonly olderSurveys = getOlderSurveys();
}
