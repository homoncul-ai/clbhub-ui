import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

// Components
import { DashEcoAdminComponent } from './dash-ecoadmin.component';
import { EcoAdminDashboardComponent } from './ecoadmin-dashboard.component';
import { ProviderTypeRefListComponent } from '../../components/_crud/providertyperef/providertyperef-list.component';
import { ProviderTypeRefGroupComponent } from '../../components/_crud/providertyperef/providertyperef-group.component';

const routes: Routes = [
  {
    path: '',
    component: DashEcoAdminComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: EcoAdminDashboardComponent },
      { path: 'providertyperefs/:id/:tabId', component: ProviderTypeRefGroupComponent },
      { path: 'providertyperefs/:id', redirectTo: 'providertyperefs/:id/details', pathMatch: 'full' },
      { path: 'providertyperefs', component: ProviderTypeRefListComponent }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DashEcoAdminComponent,
    EcoAdminDashboardComponent,
    ProviderTypeRefListComponent,
    ProviderTypeRefGroupComponent
  ]
})
export class DashEcoAdminModule { } 