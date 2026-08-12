import { Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';

export const routes: Routes = [
  {
    path: 'public',
    children: [
      {
        path: '',
        redirectTo: 'surveys',
        pathMatch: 'full',
      },
      {
        path: 'surveys',
        loadChildren: () => import('./features/surveys/surveys.routes').then(m => m.SURVEYS_ROUTES)
      },
      {
        path: '**',
        redirectTo: 'surveys',
      },
    ],
  },
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
        path: 'employee-dashboard',
        loadChildren: () => import('./features/dash-employee/dash-employee.module').then(m => m.DashEmployeeModule)
      },
      {
        path: 'provider-dashboard2',
        loadChildren: () => import('./features/dash-provider2/dash-provider2.routes').then(m => m.PROVIDER2_ROUTES)
      },
      {
        path: 'ecoadmin-dashboard',
        loadChildren: () => import('./features/dash-ecoadmin/dash-ecoadmin.module').then(m => m.DashEcoAdminModule)
      },
      {
        path: 'student-dashboard',
        redirectTo: 'citizen',
        pathMatch: 'prefix'
      },
      {
        path: 'citizen',
        loadChildren: () => import('./features/dash-citizen/dash-citizen.module').then(m => m.DashCitizenModule)
      },
      {
        path: 'swcat-dashboard',
        loadChildren: () => import('./features/dash-swcat/dash-swcat.module').then(m => m.DashSwcatModule)
      },
      {
        path: 'nonprofit-dashboard',
        loadChildren: () => import('./features/dash-nonprofit/dash-nonprofit.module').then(m => m.DashNonprofitModule)
      },
      {
        path: 'parent-dashboard',
        loadChildren: () => import('./features/dash-parent/dash-parent.module').then(m => m.DashParentModule)
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
