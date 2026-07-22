import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SurveysPublicHeaderComponent } from '../components/surveys-public-header.component';

interface SurveyListItem {
  route: string;
  title: string;
  subtitle: string;
  liveDate: string;
  dateCreated: string;
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
  private readonly allSurveys: SurveyListItem[] = [
    {
      route: '/public/surveys/parent-career-support-check',
      title: 'Parent Career Support Check — Jul 03, 2026',
      subtitle: 'Understand how families support young people’s career exploration',
      liveDate: 'Jul 03, 2026',
      dateCreated: '2026-07-03T11:25:25-04:00',
      badge: 'New',
      badgeClass: 'text-bg-success',
    },
    {
      route: '/public/surveys/youth-career-check',
      title: 'Youth Career Check — Jul 03, 2026',
      subtitle: 'Understand how young people explore careers and use AI resources',
      liveDate: 'Jul 03, 2026',
      dateCreated: '2026-07-03T11:03:52-04:00',
      badge: 'New',
      badgeClass: 'text-bg-success',
    },
    {
      route: '/public/surveys/ai-workplace-skill-summary',
      title: 'AI Workplace Skill Summary — Jun 10, 2026',
      subtitle: 'Employer perspectives on AI-era graduate readiness',
      liveDate: 'Jun 10, 2026',
      dateCreated: '2026-06-12T11:04:06-04:00',
      badge: 'New',
      badgeClass: 'text-bg-success',
    },
    {
      route: '/public/surveys/ai-summit-signin',
      title: 'AI Summit Sign-in — Jun 10, 2026',
      subtitle: 'Sign in and explore AI-enabled career paths',
      liveDate: 'Jun 10, 2026',
      dateCreated: '2026-06-11T17:36:55-04:00',
      badge: 'New',
      badgeClass: 'text-bg-success',
    },
    {
      route: '/public/surveys/checkin',
      title: 'Event Check-in: JM Chamber AI Class — May 31, 2026',
      subtitle: 'Sign up for CLBHub and register for an AI course',
      liveDate: 'May 31, 2026',
      dateCreated: '2026-06-01T08:04:17-04:00',
      badge: 'New',
      badgeClass: 'text-bg-success',
    },
    {
      route: '/public/surveys/register-interest',
      title: 'Register your interest in CLBHub — Apr 29, 2026',
      subtitle: "We haven't launched yet — let us know you're interested!",
      liveDate: 'Apr 29, 2026',
      dateCreated: '2026-04-29T09:58:54-04:00',
      badge: 'New',
      badgeClass: 'text-bg-success',
    },
    {
      route: '/public/surveys/npo_job_finder',
      title: 'Non-profit job search assistance — Mar 10, 2025',
      subtitle: 'Survey: Do you have a job for me?',
      liveDate: 'Mar 10, 2025',
      dateCreated: '2026-04-13T22:28:15-04:00',
      badge: 'Open',
      badgeClass: 'text-bg-primary',
    },
  ].sort((a, b) => Date.parse(b.dateCreated) - Date.parse(a.dateCreated));

  private readonly oneMonthAgoMs = (() => {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - 1);
    return cutoff.getTime();
  })();

  readonly recentSurveys = this.allSurveys.filter(
    (survey) => Date.parse(survey.dateCreated) >= this.oneMonthAgoMs,
  );

  readonly olderSurveys = this.allSurveys.filter(
    (survey) => Date.parse(survey.dateCreated) < this.oneMonthAgoMs,
  );
}
