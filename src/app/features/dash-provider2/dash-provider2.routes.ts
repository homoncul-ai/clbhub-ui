import { Routes } from '@angular/router';
import { ProviderLayoutComponent } from './layout/provider-layout.component';
import { DashboardHomeComponent } from './pages/dashboard/dashboard-home.component';
import { SchoolInfoComponent } from './pages/organization/school/school-info.component';
import { TeamMembersComponent } from './pages/organization/team/team-members.component';
import { WorkRequestsListComponent } from './pages/workrequests/list/work-requests-list.component';
import { WorkQueuesComponent } from './pages/workrequests/queues/work-queues.component';
import { CatalogsListComponent } from './pages/catalogs/list/catalogs-list.component';
import { CatalogDetailComponent } from './pages/catalogs/detail/catalog-detail.component';

export const PROVIDER2_ROUTES: Routes = [
  {
    path: '',
    component: ProviderLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardHomeComponent, title: 'Provider Dashboard - Home' },
      { path: 'organization/school', component: SchoolInfoComponent, title: 'Provider Dashboard - School Information' },
      { path: 'organization/team', component: TeamMembersComponent, title: 'Provider Dashboard - Team Members' },
      { path: 'workrequests', component: WorkRequestsListComponent, title: 'Provider Dashboard - Work Requests' },
      { path: 'workrequests/queues', component: WorkQueuesComponent, title: 'Provider Dashboard - Work Queues' },
      { path: 'catalogs', component: CatalogsListComponent, title: 'Provider Dashboard - Catalogs' },
      { path: 'catalogs/:id', component: CatalogDetailComponent, title: 'Provider Dashboard - Catalog Detail' },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

