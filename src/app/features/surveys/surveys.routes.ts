import { Routes } from '@angular/router';

export const SURVEYS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'npo_job_finder',
    pathMatch: 'full',
  },
  {
    path: 'npo_job_finder',
    loadComponent: () =>
      import('./survey-job-finder/survey-job-finder.component').then((m) => m.SurveyJobFinderComponent),
  },
];
