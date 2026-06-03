import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface SurveyReportItem {
  /** Internal survey key used by the results viewer route. */
  key: string;
  title: string;
  subtitle: string;
  liveDate: string;
  badge: string;
  badgeClass: string;
}

@Component({
  selector: 'app-survey-reports-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './survey-reports-dashboard.component.html',
  styleUrl: './survey-reports-dashboard.component.scss',
})
export class SurveyReportsDashboardComponent {
  /** Base path for the internal results viewer. */
  readonly resultsBase = '/ecoadmin-dashboard/surveys';

  readonly surveys: SurveyReportItem[] = [
    {
      key: 'checkin',
      title: 'Event Check-in: JM Chamber AI Class',
      subtitle: 'CLBHub sign-ups and AI course registrations',
      liveDate: 'May 31, 2026',
      badge: 'New',
      badgeClass: 'text-bg-success',
    },
    {
      key: 'npo_job_finder',
      title: 'Non-profit job search assistance',
      subtitle: 'Survey: Do you have a job for me?',
      liveDate: 'Mar 10, 2025',
      badge: 'Open',
      badgeClass: 'text-bg-primary',
    },
    {
      key: 'register_interest',
      title: 'Register your interest in CLBHub',
      subtitle: "Pre-launch interest registration and email collection",
      liveDate: 'Apr 29, 2026',
      badge: 'New',
      badgeClass: 'text-bg-success',
    },
  ];
}
