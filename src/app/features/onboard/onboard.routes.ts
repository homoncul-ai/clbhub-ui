import { Routes } from '@angular/router';

export const ONBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./onboard-dashboard/onboard-dashboard.component').then((m) => m.OnboardDashboardComponent),
  },
  {
    path: 'student/onboard-complete',
    loadComponent: () =>
      import('./onboard-student-complete/onboard-student-complete.component').then(
        (m) => m.OnboardStudentCompleteComponent
      ),
  },
  {
    path: 'student',
    loadComponent: () =>
      import('./onboard-student/onboard-student.component').then((m) => m.OnboardStudentComponent),
  },
  {
    path: 'business-user',
    loadComponent: () =>
      import('./onboard-business-user/onboard-business-user.component').then((m) => m.OnboardBusinessUserComponent),
  },
  {
    path: 'colleague/complete',
    loadComponent: () =>
      import('./onboard-invite/onboard-invite-colleague/onboard-invite-colleague.component').then(
        (m) => m.OnboardInviteColleagueComponent
      ),
  },
];
