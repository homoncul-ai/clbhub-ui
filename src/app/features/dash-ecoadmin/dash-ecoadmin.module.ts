import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

// Components
import { DashEcoAdminComponent } from './dash-ecoadmin.component';
import { EcoAdminDashboardComponent } from './ecoadmin-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashEcoAdminComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: EcoAdminDashboardComponent }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DashEcoAdminComponent,
    EcoAdminDashboardComponent
  ]
})
export class DashEcoAdminModule { } 