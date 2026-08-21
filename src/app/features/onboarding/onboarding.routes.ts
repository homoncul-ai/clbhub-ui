import { Routes } from '@angular/router';

const loadCitizenOnboard = () =>
  import('./citizen-onboard/citizen-onboard.component').then((m) => m.CitizenOnboardComponent);

export const ONBOARDING_ROUTES: Routes = [
  {
    path: 'citizen',
    loadComponent: loadCitizenOnboard,
  },
];

/** Legacy / alternate invite-email landing URLs. */
export const ONBOARD_LEGACY_ROUTES: Routes = [
  {
    path: 'citizen',
    loadComponent: loadCitizenOnboard,
  },
  {
    path: 'colleague/complete',
    loadComponent: loadCitizenOnboard,
  },
  {
    path: 'student/onboard-complete',
    loadComponent: loadCitizenOnboard,
  },
];
