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

// Integration Components
import { IntegrationsHomeComponent } from './integrations/integrations-home.component';
import { CLSchoolsListComponent } from './integrations/schools/schools-list.component';
import { CLStudentsListComponent } from './integrations/students/students-list.component';
import { CLGuidanceListComponent } from './integrations/guidance/guidance-list.component';

const routes: Routes = [
  {
    path: '',
    component: DashAdvoComponent,
    children: [
      { path: 'messages', component: AdvoMessagesComponent },
      { path: 'students', component: AdvoStudentListComponent },
      { path: 'students/:id', component: AdvoStudentDetailsComponent },
      { path: 'tickets', component: AdvoTicketListComponent },
      { path: 'tickets/create', component: CreateTicketComponent },
      { path: 'tickets/:id', component: AdvoTicketDetailsComponent },
      { path: 'uistarter', component: UistarterHomeComponent },
      { path: 'uistarter/list-search-starter', component: ListSearchStarterComponent },
      { 
        path: 'integrations', 
        component: IntegrationsHomeComponent,
        children: [
          { path: 'schools', component: CLSchoolsListComponent },
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
    DashAdvoComponent,
    AdvoMessagesComponent,
    AdvoStudentListComponent,
    AdvoStudentDetailsComponent,
    AdvoTicketListComponent,
    AdvoTicketDetailsComponent,
    CreateTicketComponent,
    UistarterHomeComponent,
    ListSearchStarterComponent,
    IntegrationsHomeComponent,
    CLSchoolsListComponent,
    CLStudentsListComponent,
    CLGuidanceListComponent
  ]
})
export class DashAdvoModule { 
  constructor() {
    console.log('DashAdvoModule');
  }
} 