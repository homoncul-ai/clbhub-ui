import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

// Components
import { DashAdvoComponent } from './dash-advo.component';
import { AdvoDashGroupComponent } from './advo-dash-group/advo-dash-group.component';
import { AdvoMessagesComponent } from './messages/advo-messages.component';
import { AdvoStudentListComponent } from './students/advo-student-list.component';
import { AdvoStudentDetailsComponent } from './students/advo-student-details.component';
import { AdvoTicketListComponent } from './tickets/advo-ticket-list.component';
import { AdvoTicketDetailsComponent } from './tickets/advo-ticket-details.component';
import { CreateTicketComponent } from './tickets/create-ticket.component';
import { UistarterHomeComponent } from '../../views/uistarter/uistarter-home.component';
import { ListSearchStarterComponent } from '../../views/uistarter/list-search-starter.component';
import { OrgQueueListComponent } from '../../components/org-queue-list/org-queue-list.component';
import { OrgQueueTixListComponent } from '../../components/org-queue-tix-list/org-queue-tix-list.component';

// Integration Components 
import { IntegrationsHomeComponent } from './integrations/integrations-home.component';
import { CLSchoolListComponent } from '../../components/_crud/clschool/clschool-list.component';
import { CLStudentListComponent } from '../../components/_crud/clstudent/clstudent-list.component';
import { CLGuidanceListComponent } from './integrations/guidance/guidance-list.component';

// CRUD Components
import { CLStudentCrudComponent } from '../../components/_crud/clstudent/clstudent-crud.component';
import { WorkRequestCrudComponent } from '../../components/_crud/workrequest/workrequest-crud.component';
import { WorkrequesttypeCrudComponent } from '../../components/_crud/workrequesttype/workrequesttype-crud.component';
import { WorkqueueCrudComponent } from '../../components/_crud/workqueue/workqueue-crud.component';
import { CLStudentGroupComponent } from '../../components/_crud/clstudent/clstudent-group.component';
import { WorkRequestGroupComponent } from '../../components/_crud/workrequest/workrequest-group.component';
import { CLSchoolGroupComponent } from '../../components/_crud/clschool/clschool-group.component';
import { ProviderRequestTypeRefListComponent } from '../../components/_crud/providerrequesttyperef/providerrequesttyperef-list.component';
import { ProviderRequestTypeRefGroupComponent } from '../../components/_crud/providerrequesttyperef/providerrequesttyperef-group.component';
import { ProviderRequestListComponent } from '../../components/_crud/providerrequest/providerrequest-list.component';
import { ProviderRequestGroupComponent } from '../../components/_crud/providerrequest/providerrequest-group.component';

const routes: Routes = [
  {
    path: '',
    component: DashAdvoComponent,
    children: [
      { path: 'home', component: AdvoDashGroupComponent },
      { path: 'home/:tabId', component: AdvoDashGroupComponent },
      
      { path: 'messages', component: AdvoMessagesComponent },
      { path: 'students', component: AdvoStudentListComponent },
      { path: 'tickets', component: AdvoTicketListComponent },
      { path: 'tickets/create/:advocateId/:clientId', component: CreateTicketComponent },
      { path: 'tickets/:id', component: WorkRequestGroupComponent },
      { path: 'tickets/:id/:tabId', component: WorkRequestGroupComponent },
      { path: 'uistarter', component: UistarterHomeComponent },
      { path: 'uistarter/list-search-starter', component: ListSearchStarterComponent },
      { path: 'org-queue-list', component: OrgQueueListComponent },
      { path: 'org-queue-tix/:workQueueId', component: OrgQueueTixListComponent },
      { 
        path: 'integrations', 
        component: IntegrationsHomeComponent,
        children: [
          { path: 'schools/:id/:tabId', component: CLSchoolGroupComponent },
          { path: 'schools/:id', redirectTo: 'schools/:id/details', pathMatch: 'full' },
          { path: 'schools', component: CLSchoolListComponent },
          { path: 'students/:id/:tabId', component: CLStudentGroupComponent },
          { path: 'students/:id', redirectTo: 'students/:id/details', pathMatch: 'full' },
          { path: 'students', component: CLStudentListComponent },
          { path: 'workrequests/:id/:tabId', component: WorkRequestGroupComponent },
          { path: 'workrequests/:id', redirectTo: 'workrequests/:id/details', pathMatch: 'full' },
          { path: 'workrequests', component: AdvoTicketListComponent },
          { path: 'workrequesttypes/:id/:tabId', component: WorkrequesttypeCrudComponent },
          { path: 'workrequesttypes/:id', redirectTo: 'workrequesttypes/:id/details', pathMatch: 'full' },
          { path: 'workrequesttypes', component: WorkrequesttypeCrudComponent },
          { path: 'workqueues/:id/:tabId', component: WorkqueueCrudComponent },
          { path: 'workqueues/:id', redirectTo: 'workqueues/:id/details', pathMatch: 'full' },
          { path: 'workqueues', component: WorkqueueCrudComponent },
          { path: 'providerrequesttyperefs/:id/:tabId', component: ProviderRequestTypeRefGroupComponent },
          { path: 'providerrequesttyperefs/:id', redirectTo: 'providerrequesttyperefs/:id/details', pathMatch: 'full' },
          { path: 'providerrequesttyperefs', component: ProviderRequestTypeRefListComponent },
          { path: 'providerrequests/:id/:tabId', component: ProviderRequestGroupComponent },
          { path: 'providerrequests/:id', redirectTo: 'providerrequests/:id/details', pathMatch: 'full' },
          { path: 'providerrequests', component: ProviderRequestListComponent },
          { path: 'guidance', component: CLGuidanceListComponent },


          { path: '', redirectTo: 'schools', pathMatch: 'full' }
        ]
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    // Standalone components
    DashAdvoComponent,
    AdvoDashGroupComponent,
    AdvoMessagesComponent,
    AdvoStudentListComponent,
    AdvoStudentDetailsComponent,
    AdvoTicketListComponent,
    AdvoTicketDetailsComponent,
    CreateTicketComponent,
    UistarterHomeComponent,
    ListSearchStarterComponent,
    OrgQueueListComponent,
    OrgQueueTixListComponent, 
    IntegrationsHomeComponent,
    CLSchoolListComponent,  
    CLStudentListComponent,
    CLGuidanceListComponent,
    CLStudentCrudComponent,
    CLStudentGroupComponent,
    WorkRequestCrudComponent,
    WorkrequesttypeCrudComponent,
    WorkqueueCrudComponent,
    CLSchoolGroupComponent,
    WorkRequestGroupComponent,
    ProviderRequestTypeRefListComponent,
    ProviderRequestTypeRefGroupComponent,
    ProviderRequestListComponent,
    ProviderRequestGroupComponent
  ],
  declarations: [
    // Non-standalone components would go here
  ]
})
export class DashAdvoModule { 
  constructor() {
    console.log('DashAdvoModule');
  }
} 