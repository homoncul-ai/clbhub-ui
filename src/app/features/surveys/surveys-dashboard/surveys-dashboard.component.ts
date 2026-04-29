import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SurveysPublicHeaderComponent } from '../components/surveys-public-header.component';

interface SurveyListItem {
  route: string;
  title: string;
  subtitle: string;
  liveDate: string;
  badge: string;
  badgeClass: string;
}

@Component({
  selector: 'app-surveys-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SurveysPublicHeaderComponent],
  templateUrl: './surveys-dashboard.component.html',
  styleUrl: './surveys-dashboard.component.scss',
})
export class SurveysDashboardComponent {
  readonly surveys: SurveyListItem[] = [
    {
      route: '/public/surveys/npo_job_finder',
      title: 'Non-profit job search assistance',
      subtitle: 'Survey: Do you have a job for me?',
      liveDate: 'Mar 10, 2025',
      badge: 'Open',
      badgeClass: 'text-bg-primary',
    },
    {
      route: '/public/surveys/register-interest',
      title: 'Register your interest in CLBHub',
      subtitle: "We haven't launched yet — let us know you're interested!",
      liveDate: 'Apr 29, 2026',
      badge: 'New',
      badgeClass: 'text-bg-success',
    },
  ];
}
