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
];
