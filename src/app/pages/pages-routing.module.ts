import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from '@app/shell/services/shell.service';


const routes: Routes = [
  Shell.childRoutes([    
    {
      path: 'advocate-dashboard',
      loadComponent: () => import('./advocate-dashboard/advocate-dashboard.component').then(m => m.AdvocateDashboardComponent),
    },
    {
      path: 'broker-dashboard',
      loadComponent: () => import('./broker-dashboard/broker-dashboard.component').then(m => m.BrokerDashboardComponent),
    },
    {
      path: 'service-provider-dashboard',
      loadComponent: () => import('./service-provider-dashboard/service-provider-dashboard.component').then(m => m.ServiceProviderDashboardComponent),
    },
    {
      path: 'users',
      loadChildren: () => import('./users/users.module').then((m) => m.UsersModule),
    },

    // Fallback when no prior route is matched
    { path: '**', redirectTo: '/advocate-dashboard', pathMatch: 'full' },
  ]),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
