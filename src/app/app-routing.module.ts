import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      // Advocate Dashboard Routes
      {
        path: 'advocate-dashboard',
        loadChildren: () => import('./features/dash-advo/dash-advo.module').then(m => m.DashAdvoModule)
      },
      // Broker Dashboard Routes
      {
        path: 'broker-dashboard',
        loadChildren: () => import('./features/dash-broker/dash-broker.module').then(m => m.DashBrokerModule)
      },
      // Service Provider Dashboard Routes
      {
        path: 'service-provider-dashboard',
        loadChildren: () => import('./features/dash-service/dash-service.module').then(m => m.DashServiceModule)
      },
      // Default redirect
      { path: '', redirectTo: 'advocate-dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 