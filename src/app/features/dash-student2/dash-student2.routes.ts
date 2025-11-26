import { Routes } from '@angular/router';

export const DASH_STUDENT2_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/student-layout.component').then(m => m.StudentLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
        data: { title: 'My Dashboard' }
      },
      {
        path: 'statements',
        loadComponent: () => import('./pages/statements/statements-list.component').then(m => m.StatementsListComponent),
        data: { title: 'Personal Statements' }
      },
      {
        path: 'statements/:id',
        loadComponent: () => import('./pages/statements/statement-detail.component').then(m => m.StatementDetailComponent),
        data: { title: 'Statement Details' }
      },
      {
        path: 'interests',
        loadComponent: () => import('./pages/interests/interests-list.component').then(m => m.InterestsListComponent),
        data: { title: 'My Interests' }
      },
      {
        path: 'interests/:id',
        loadComponent: () => import('./pages/interests/interest-detail.component').then(m => m.InterestDetailComponent),
        data: { title: 'Interest Details' }
      },
      {
        path: 'messages',
        loadComponent: () => import('./pages/messages/messages-list.component').then(m => m.MessagesListComponent),
        data: { title: 'My Messages' }
      },
      {
        path: 'messages/:id',
        loadComponent: () => import('./pages/messages/message-detail.component').then(m => m.MessageDetailComponent),
        data: { title: 'Message' }
      },
      {
        path: 'guidance',
        loadComponent: () => import('./pages/guidance/guidance.component').then(m => m.GuidanceComponent),
        data: { title: 'Guidance & Support' }
      },
      {
        path: 'guidance/tickets/:id',
        loadComponent: () => import('./pages/guidance/ticket-detail.component').then(m => m.TicketDetailComponent),
        data: { title: 'Support Ticket' }
      },
      {
        path: 'progress',
        loadComponent: () => import('./pages/progress/progress.component').then(m => m.ProgressComponent),
        data: { title: 'My Progress' }
      },
      {
        path: 'search',
        loadComponent: () => import('./pages/search/catalog-search.component').then(m => m.CatalogSearchComponent),
        data: { title: 'Explore Opportunities' }
      }
    ]
  }
];

