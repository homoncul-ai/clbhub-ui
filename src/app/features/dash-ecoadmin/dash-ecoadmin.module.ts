
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
import { HcclOrganizationListComponent } from '../../components/_crud/hcclorganization/hcclorganization-list.component';
import { HcclOrganizationGroupComponent } from '../../components/_crud/hcclorganization/hcclorganization-group.component';
import { HcclOrganizationTypeRefListComponent } from '../../components/_crud/hcclorganizationtyperef/hcclorganizationtyperef-list.component';
import { HcclOrganizationTypeRefGroupComponent } from '../../components/_crud/hcclorganizationtyperef/hcclorganizationtyperef-group.component';
import { HcclUserListComponent } from '../../components/_crud/hccluser/hccluser-list.component';
import { HcclUserGroupComponent } from '../../components/_crud/hccluser/hccluser-group.component';
import { WorkQueueTypeRefListComponent } from '../../components/_crud/workqueuetyperef/workqueuetyperef-list.component';
import { WorkQueueTypeRefGroupComponent } from '../../components/_crud/workqueuetyperef/workqueuetyperef-group.component';
import { WorkRequestTypeRefListComponent } from '../../components/_crud/workrequesttyperef/workrequesttyperef-list.component';
import { WorkRequestTypeRefGroupComponent } from '../../components/_crud/workrequesttyperef/workrequesttyperef-group.component';
import { WorkQueueListComponent } from '../../components/_crud/workqueue/workqueue-list.component';
import { WorkQueueGroupComponent } from '../../components/_crud/workqueue/workqueue-group.component';
import { WorkRequestListComponent } from '../../components/_crud/workrequest/workrequest-list.component';
import { WorkRequestGroupComponent } from '../../components/_crud/workrequest/workrequest-group.component';
import { WorkRequestItemListComponent } from '../../components/_crud/workrequestitem/workrequestitem-list.component';
import { WorkRequestItemGroupComponent } from '../../components/_crud/workrequestitem/workrequestitem-group.component';
import { HcclUserProfileGroupComponent } from '../../components/_crud/hccluserprofile/hccluserprofile-group.component';
import { HcclUserProfileCrudComponent } from '../../components/_crud/hccluserprofile/hccluserprofile-crud.component';

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
      { path: 'hcclorganizations/create', component: HcclOrganizationGroupComponent },
      { path: 'hcclorganizations/:id/:tabId', component: HcclOrganizationGroupComponent },
      { path: 'hcclorganizations/:id', redirectTo: 'hcclorganizations/:id/details', pathMatch: 'full' },
      { path: 'hcclorganizations', component: HcclOrganizationListComponent },

      { path: 'hcclorganizationtyperefs/create', component: HcclOrganizationTypeRefGroupComponent },
      { path: 'hcclorganizationtyperefs/:id/:tabId', component: HcclOrganizationTypeRefGroupComponent },
      { path: 'hcclorganizationtyperefs/:id', redirectTo: 'hcclorganizationtyperefs/:id/details', pathMatch: 'full' },
      { path: 'hcclorganizationtyperefs', component: HcclOrganizationTypeRefListComponent },
      { path: 'hcclusers/create', component: HcclUserGroupComponent },
      { path: 'hcclusers/:id/:tabId', component: HcclUserGroupComponent },
      { path: 'hcclusers/:id', redirectTo: 'hcclusers/:id/details', pathMatch: 'full' },
      { path: 'hcclusers', component: HcclUserListComponent },

      { path: 'hccluserprofiles/create', component: HcclUserProfileGroupComponent },
      { path: 'hccluserprofiles/:id/:tabId', component: HcclUserProfileGroupComponent },
      { path: 'hccluserprofiles/:id', redirectTo: 'hccluserprofiles/:id/details', pathMatch: 'full' },
      { path: 'hccluserprofiles', component: HcclUserProfileGroupComponent },

      { path: 'workqueuetyperefs/create', component: WorkQueueTypeRefGroupComponent },
      { path: 'workqueuetyperefs/:id/:tabId', component: WorkQueueTypeRefGroupComponent },
      { path: 'workqueuetyperefs/:id', redirectTo: 'workqueuetyperefs/:id/details', pathMatch: 'full' },
      { path: 'workqueuetyperefs', component: WorkQueueTypeRefListComponent },
      
      { path: 'workqueues/create', component: WorkQueueGroupComponent },
      { path: 'workqueues/:id/:tabId', component: WorkQueueGroupComponent },
      { path: 'workqueues/:id', redirectTo: 'workqueues/:id/details', pathMatch: 'full' },
      { path: 'workqueues', component: WorkQueueListComponent },
      { path: 'workrequests/create', component: WorkRequestGroupComponent },
      { path: 'workrequests/:id/:tabId', component: WorkRequestGroupComponent },
      { path: 'workrequests/:id', redirectTo: 'workrequests/:id/details', pathMatch: 'full' },
      { path: 'workrequests', component: WorkRequestListComponent },
      { path: 'workrequestitems/create', component: WorkRequestItemGroupComponent },
      { path: 'workrequestitems/:id/:tabId', component: WorkRequestItemGroupComponent },
      { path: 'workrequestitems/:id', redirectTo: 'workrequestitems/:id/details', pathMatch: 'full' },
      { path: 'workrequestitems', component: WorkRequestItemListComponent },
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
    CLSchoolGroupComponent,
    HcclOrganizationListComponent,
    HcclOrganizationGroupComponent,
    HcclOrganizationTypeRefListComponent,
    HcclOrganizationTypeRefGroupComponent,
    HcclUserListComponent,
    HcclUserGroupComponent,
    WorkQueueTypeRefListComponent,
    WorkQueueTypeRefGroupComponent,
    WorkRequestTypeRefListComponent,
    WorkRequestTypeRefGroupComponent,
    WorkQueueListComponent,
    WorkQueueGroupComponent,
    WorkRequestListComponent,
    WorkRequestGroupComponent,
    WorkRequestItemListComponent,
    WorkRequestItemGroupComponent,
    HcclUserProfileGroupComponent,
    HcclUserProfileCrudComponent
  ]
})
export class DashEcoAdminModule { } 