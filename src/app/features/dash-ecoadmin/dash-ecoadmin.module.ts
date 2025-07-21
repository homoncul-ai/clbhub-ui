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
import { CatalogListComponent } from '../../components/_crud/catalog/catalog-list.component';
import { CatalogGroupComponent } from '../../components/_crud/catalog/catalog-group.component';
import { CatalogEntryListComponent } from '../../components/_crud/catalogentry/catalogentry-list.component';
import { CatalogEntryGroupComponent } from '../../components/_crud/catalogentry/catalogentry-group.component';
import { CLSchoolListComponent } from '../../components/_crud/clschool/clschool-list.component';
import { CLSchoolGroupComponent } from '../../components/_crud/clschool/clschool-group.component';

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
      { path: 'catalogs/create', component: CatalogGroupComponent },
      { path: 'catalogs/:id/:tabId', component: CatalogGroupComponent },
      { path: 'catalogs/:id', redirectTo: 'catalogs/:id/details', pathMatch: 'full' },
      { path: 'catalogs', component: CatalogListComponent },
      { path: 'catalogentries/create', component: CatalogEntryGroupComponent },
      { path: 'catalogentries/:id/:tabId', component: CatalogEntryGroupComponent },
      { path: 'catalogentries/:id', redirectTo: 'catalogentries/:id/details', pathMatch: 'full' },
      { path: 'catalogentries', component: CatalogEntryListComponent },
      { path: 'clschools/create', component: CLSchoolGroupComponent },
      { path: 'clschools/:id/:tabId', component: CLSchoolGroupComponent },
      { path: 'clschools/:id', redirectTo: 'clschools/:id/details', pathMatch: 'full' },
      { path: 'clschools', component: CLSchoolListComponent },
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
    CLCourseGroupComponent,
    CatalogListComponent,
    CatalogGroupComponent,
    CatalogEntryListComponent,
    CatalogEntryGroupComponent,
    CLSchoolListComponent,
    CLSchoolGroupComponent
  ]
})
export class DashEcoAdminModule { } 