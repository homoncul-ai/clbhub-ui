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
      { path: '', redirectTo: '/advocate-dashboard', pathMatch: 'full' }
      
    ]
  },
  { path: '**', redirectTo: '/advocate-dashboard', pathMatch: 'full' }
];
