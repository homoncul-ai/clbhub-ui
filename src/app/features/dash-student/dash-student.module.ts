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
import { StudentResumeEntryGroupComponent } from './student-resumeentry-group.component';
import { CatalogEntryModalComponent } from './catalog-entry-modal.component';  
import { DashStudentMessagesComponent } from './dash-student-messages.component';
import { DashStudentInterestsComponent } from './dash-student-interests.component';
import { DashStudentInterestComponent } from './dash-student-interest.component';
import { DashStudentResumesComponent } from './dash-student-resumes.component';
import { DashStudentResumesGroupComponent } from './dash-student-resumes-group.component';
import { StudentWorkRequestsComponent } from './workrequests/student-workrequests.component';
import { UistarterHomeComponent } from '../../views/uistarter/uistarter-home.component';
const routes: Routes = [
  {
    path: '',
    component: DashStudentComponent,
    children: [
      { path: 'home', component: DashStudentHomeComponent },
      { path: 'personalstatements', component: DashStudentPersonalStatementsComponent },
      { path: 'personalstatements/:id/:tabId/:childId', component: StudentPersonalStatementGroupComponent },
      { path: 'personalstatements/:id/:tabId', component: StudentPersonalStatementGroupComponent },
      { path: 'personalstatements/:id', component: StudentPersonalStatementGroupComponent },


      { path: 'resumeentries/:id/:tabId', component: StudentResumeEntryGroupComponent },
      { path: 'resumeentries/:id', redirectTo: 'resumeentries/:id/details', pathMatch: 'full' },
      { path: 'resumeentries', component: StudentResumeEntryGroupComponent },

      { path: 'progress', component: DashStudentProgressComponent },
      { path: 'guidance', component: DashStudentGuidanceComponent },
      { path: 'interests', component: DashStudentInterestsComponent },

      { path: 'guidance/workrequests/:ticketId/:tabId', component:StudentWorkRequestsComponent },
      { path: 'guidance/workrequests/:ticketId', redirectTo: 'guidance/workrequests/:ticketId/ticket', pathMatch: 'full' },
      { path: 'guidance/workrequests', component:StudentWorkRequestsComponent },
  
      { path: 'messages/:messageId/:tabId', component:DashStudentMessagesComponent },
      { path: 'messages/:messageId', redirectTo: 'messages/:messageId/message', pathMatch: 'full' },
      { path: 'messages', component:DashStudentMessagesComponent },

      { path: 'interests/:interestId/interest', component:DashStudentInterestComponent },
      { path: 'interests/:interestId/:tabId', component:DashStudentInterestsComponent },
      { path: 'interests/:interestId', redirectTo: 'interests/:interestId/interest', pathMatch: 'full' },
      { path: 'interests', component:DashStudentInterestsComponent },

      { path: 'resumes/:resumeId/resume', component:DashStudentResumesGroupComponent },
      { path: 'resumes/:resumeId/:tabId', component:DashStudentResumesGroupComponent },
      { path: 'resumes/:resumeId', redirectTo: 'resumes/:resumeId/resume', pathMatch: 'full' },
      { path: 'resumes', component:DashStudentResumesGroupComponent },

      { path: 'uistarter', component: UistarterHomeComponent },

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
    DashStudentMessagesComponent,
    DashStudentInterestsComponent,
    DashStudentInterestComponent,
    DashStudentResumesComponent,
    DashStudentResumesGroupComponent,
    CatalogEntryModalComponent,
    UistarterHomeComponent,
    StudentResumeEntryGroupComponent,
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
