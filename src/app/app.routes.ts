import { Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';

export const routes: Routes = [
 
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: 'advocate-dashboard',
        loadChildren: () => import('./features/dash-advo/dash-advo.module').then(m => m.DashAdvoModule)
      },
      {
        path: 'broker-dashboard',
        loadChildren: () => import('./features/dash-broker/dash-broker.module').then(m => m.DashBrokerModule)
      },
      {
        path: 'service-provider-dashboard',
        loadChildren: () => import('./features/dash-service/dash-service.module').then(m => m.DashServiceModule)
      },
      {
        path: 'provider-dashboard',
        loadChildren: () => import('./features/dash-provider/dash-provider.module').then(m => m.DashProviderModule)
      },
      {
        path: 'ecoadmin-dashboard',
        loadChildren: () => import('./features/dash-ecoadmin/dash-ecoadmin.module').then(m => m.DashEcoAdminModule)
      },
      {
        path: 'student-dashboard',
        loadChildren: () => import('./features/dash-student/dash-student.module').then(m => m.DashStudentModule)
      },
      {
        path: 'student-dashboard2',
        loadChildren: () => import('./features/dash-student2/dash-student2.routes').then(m => m.DASH_STUDENT2_ROUTES)
      },
      {
        path: 'swcat-dashboard',
        loadChildren: () => import('./features/dash-swcat/dash-swcat.module').then(m => m.DashSwcatModule)
      },
      {
        path: '',
        redirectTo: 'advocate-dashboard-bungabunga',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'advocate-dashboard-bungabunga2'
  }
];
