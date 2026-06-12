import { Routes } from '@angular/router';

export const SURVEYS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./surveys-dashboard/surveys-dashboard.component').then((m) => m.SurveysDashboardComponent),
  },
  {
    path: 'npo_job_finder',
    loadComponent: () =>
      import('./survey-job-finder/survey-job-finder.component').then((m) => m.SurveyJobFinderComponent),
  },
  {
    path: 'register-interest',
    loadComponent: () =>
      import('./survey-register-interest/survey-register-interest.component').then(
        (m) => m.SurveyRegisterInterestComponent,
      ),
  },
  {
    path: 'checkin',
    loadComponent: () =>
      import('./survey-checkin/survey-checkin.component').then((m) => m.SurveyCheckinComponent),
  },
  {
    path: 'ai-summit-signin',
    loadComponent: () =>
      import('./survey-ai-summit-signin/survey-ai-summit-signin.component').then(
        (m) => m.SurveyAiSummitSigninComponent,
      ),
  },
  {
    path: 'ai-workplace-skill-summary',
    loadComponent: () =>
      import('./survey-ai-workplace-skill-summary/survey-ai-workplace-skill-summary.component').then(
        (m) => m.SurveyAiWorkplaceSkillSummaryComponent,
      ),
  },
];
