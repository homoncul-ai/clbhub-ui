import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

// Components
import { DashEcoAdminComponent } from './dash-ecoadmin.component';
import { EcoAdminDashboardComponent } from './ecoadmin-dashboard.component';
import { ProviderTypeRefListComponent } from '../../components/_crud/providertyperef/providertyperef-list.component';
import { ProviderTypeRefGroupComponent } from '../../components/_crud/providertyperef/providertyperef-group.component';
import { CLCourseListComponent } from '../../components/_crud/clcourse/clcourse-list.component';
import { CLCourseGroupComponent } from '../../components/_crud/clcourse/clcourse-group.component';

const routes: Routes = [
  {
    path: '',
    component: DashEcoAdminComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: EcoAdminDashboardComponent },
      
      { path: 'providertyperefs/create', component: ProviderTypeRefGroupComponent },
      { path: 'providertyperefs/:id/:tabId', component: ProviderTypeRefGroupComponent },
      { path: 'providertyperefs/:id', redirectTo: 'providertyperefs/:id/details', pathMatch: 'full' },
      { path: 'providertyperefs', component: ProviderTypeRefListComponent },
      { path: 'clcourses/create', component: CLCourseGroupComponent },
      { path: 'clcourses/:id/:tabId', component: CLCourseGroupComponent },
      { path: 'clcourses/:id', redirectTo: 'clcourses/:id/details', pathMatch: 'full' },
      { path: 'clcourses', component: CLCourseListComponent },
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
    ProviderTypeRefGroupComponent,
    CLCourseListComponent,
    CLCourseGroupComponent
  ]
})
export class DashEcoAdminModule { } 