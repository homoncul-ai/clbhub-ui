import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';

// Components
import { DashStudentComponent } from './dash-student.component';
import { DashStudentHomeComponent } from './dash-student-home.component';
import { DashStudentPersonalStatementsComponent } from './dash-student-personalstatements.component';
import { DashStudentProgressComponent } from './dash-student-progress.component';
import { DashStudentGuidanceComponent } from './dash-student-guidance.component';
import { DashStudentScheduleComponent } from './dash-student-schedule.component';
import { StudentPersonalStatementGroupComponent } from './student-personalstatement-group.component';
import { CatalogEntryModalComponent } from './catalog-entry-modal.component';  
import { StudentWorkRequestsComponent } from './workrequests/student-workrequests.component';
const routes: Routes = [
  {
    path: '',
    component: DashStudentComponent,
    children: [
      { path: 'home', component: DashStudentHomeComponent },
      { path: 'personalstatements', component: DashStudentPersonalStatementsComponent },
      { path: 'personalstatements/:id/:tabId', component: StudentPersonalStatementGroupComponent },
      { path: 'personalstatements/:id', component: StudentPersonalStatementGroupComponent },
      { path: 'progress', component: DashStudentProgressComponent },
      { path: 'guidance', component: DashStudentGuidanceComponent },
      { path: 'schedule', component: DashStudentScheduleComponent },

      { path: 'guidance/workrequests/:ticketId/:tabId', component:StudentWorkRequestsComponent },
      { path: 'guidance/workrequests/:ticketId', redirectTo: 'guidance/workrequests/:ticketId/ticket', pathMatch: 'full' },
      { path: 'guidance/workrequests', component:StudentWorkRequestsComponent },
     
      // { path: 'workrequest', component: ProviderWorkrequestGroupComponent },
      // { path: 'workqueues/:queueId/:ticketId/:tabId/:workRequestItemId', component: ProviderWorkqueueGroupComponent },
      // { path: 'workqueues/:queueId/:ticketId/:tabId', component: ProviderWorkqueueGroupComponent },
      // { path: 'workqueues/:queueId/:ticketId', redirectTo: 'workqueues/:queueId/:ticketId/ticket', pathMatch: 'full' },
      // { path: 'workqueues/:queueId', component: ProviderWorkqueueGroupComponent },
      // { path: 'workqueues', component: ProviderWorkqueueGroupComponent },
        
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MdbModalModule,
    // Standalone components
    DashStudentComponent,
    DashStudentHomeComponent,
    DashStudentPersonalStatementsComponent,
    DashStudentProgressComponent,
    DashStudentGuidanceComponent,
    DashStudentScheduleComponent,
    CatalogEntryModalComponent,
  ],
  declarations: [
    // Non-standalone components would go here
  ]
})
export class DashStudentModule { 
  constructor() {
    console.log('DashStudentModule');
  }
}
