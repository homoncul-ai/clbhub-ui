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

const routes: Routes = [
  {
    path: '',
    component: DashAdvoComponent,
    children: [
      { path: '', redirectTo: 'messages', pathMatch: 'full' },
      { path: 'messages', component: AdvoMessagesComponent },
      { path: 'students', component: AdvoStudentListComponent },
      { path: 'students/:id', component: AdvoStudentDetailsComponent },
      { path: 'tickets', component: AdvoTicketListComponent },
      { path: 'tickets/:id', component: AdvoTicketDetailsComponent }
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
    AdvoTicketDetailsComponent
  ]
})
export class DashAdvoModule { 
  constructor() {
    console.log('DashAdvoModule');
  }
} 