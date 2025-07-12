import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

// Components
import { DashAdvoComponent } from './dash-advo.component';
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
import { CLSchoolsListComponent } from './integrations/schools/schools-list.component';
import { CLStudentsListComponent } from './integrations/students/students-list.component';
import { CLGuidanceListComponent } from './integrations/guidance/guidance-list.component';

// CRUD Components
import { ClstudentCrudComponent } from '../../components/_crud/clstudent-crud/clstudent-crud.component';
import { CLStudentGroupComponent } from './integrations/clstudent-group/clstudent-group.component';
import { ClschoolGroupComponent } from './integrations/clschool-group/clschool-group.component';

const routes: Routes = [
  {
    path: '',
    component: DashAdvoComponent,
    children: [
      { path: 'messages', component: AdvoMessagesComponent },
      { path: 'students', component: AdvoStudentListComponent },
      { path: 'tickets', component: AdvoTicketListComponent },
      { path: 'tickets/create/:advocateId/:clientId', component: CreateTicketComponent },
      { path: 'tickets/:id', component: AdvoTicketDetailsComponent },
      { path: 'uistarter', component: UistarterHomeComponent },
      { path: 'uistarter/list-search-starter', component: ListSearchStarterComponent },
      { path: 'org-queue-list', component: OrgQueueListComponent },
      { path: 'org-queue-tix/:workQueueId', component: OrgQueueTixListComponent },
      { 
        path: 'integrations', 
        component: IntegrationsHomeComponent,
        children: [
          { path: 'schools/:id/:tabId', component: ClschoolGroupComponent },
          { path: 'schools/:id', redirectTo: 'schools/:id/details', pathMatch: 'full' },
          { path: 'schools', component: CLSchoolsListComponent },
          { path: 'students/:id/:tabId', component: CLStudentGroupComponent },
          { path: 'students/:id', redirectTo: 'students/:id/details', pathMatch: 'full' },
          { path: 'students', component: CLStudentsListComponent },
          { path: 'guidance', component: CLGuidanceListComponent },
          { path: '', redirectTo: 'schools', pathMatch: 'full' }
        ]
      },
      { path: '', redirectTo: 'messages', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    // Standalone components
    DashAdvoComponent,
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
    CLSchoolsListComponent,
    CLStudentsListComponent,
    CLGuidanceListComponent,
    ClstudentCrudComponent,
    CLStudentGroupComponent,
    ClschoolGroupComponent
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