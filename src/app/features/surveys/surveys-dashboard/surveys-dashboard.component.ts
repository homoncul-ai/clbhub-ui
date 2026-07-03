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
      route: '/public/surveys/ai-workplace-skill-summary',
      title: 'AI Workplace Skill Summary — Jun 10, 2026',
      subtitle: 'Employer perspectives on AI-era graduate readiness',
      liveDate: 'Jun 10, 2026',
      badge: 'New',
      badgeClass: 'text-bg-success',
    },
    {
      route: '/public/surveys/youth-career-check',
      title: 'Youth Career Check — Jul 03, 2026',
      subtitle: 'Understand how young people explore careers and use AI resources',
      liveDate: 'Jul 03, 2026',
      badge: 'New',
      badgeClass: 'text-bg-success',
    },
    {
      route: '/public/surveys/parent-career-support-check',
      title: 'Parent Career Support Check — Jul 03, 2026',
      subtitle: 'Understand how families support young people’s career exploration',
      liveDate: 'Jul 03, 2026',
      badge: 'New',
      badgeClass: 'text-bg-success',
    },
    {
      route: '/public/surveys/ai-summit-signin',
      title: 'AI Summit Sign-in — Jun 10, 2026',
      subtitle: 'Sign in and explore AI-enabled career paths',
      liveDate: 'Jun 10, 2026',
      badge: 'New',
      badgeClass: 'text-bg-success',
    },
    {
      route: '/public/surveys/checkin',
      title: 'Event Check-in: JM Chamber AI Class — May 31, 2026',
      subtitle: 'Sign up for CLBHub and register for an AI course',
      liveDate: 'May 31, 2026',
      badge: 'New',
      badgeClass: 'text-bg-success',
    },
    {
      route: '/public/surveys/npo_job_finder',
      title: 'Non-profit job search assistance — Mar 10, 2025',
      subtitle: 'Survey: Do you have a job for me?',
      liveDate: 'Mar 10, 2025',
      badge: 'Open',
      badgeClass: 'text-bg-primary',
    },
    {
      route: '/public/surveys/register-interest',
      title: 'Register your interest in CLBHub — Apr 29, 2026',
      subtitle: "We haven't launched yet — let us know you're interested!",
      liveDate: 'Apr 29, 2026',
      badge: 'New',
      badgeClass: 'text-bg-success',
    },
  ];
}
