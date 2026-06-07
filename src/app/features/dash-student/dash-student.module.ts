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
import { CLCatalogSearchComponent } from './clcatalog-search/clcatalog-search.component';
import { StudentEngageComponent } from './student-engage.component';
import { StudentCatalogComponent } from './student-catalog/student-catalog.component';
import { StudentResearchComponent } from './student-research/student-research.component';
import { StudentResearchCareersComponent } from './student-research-careers/student-research-careers.component';
import { StudentResearchOrgsComponent } from './student-research-orgs/student-research-orgs.component';
import { StudentResearchItemsComponent } from './student-research-items/student-research-items.component';
import { StudentResumeBuilderComponent } from './student-resumebuilder/student-resumebuilder.component';
import { StudentPersonalStatementDetailsComponent } from './student-personalstatement-details.component';
import { StdEntityUiComponent } from '@app/components/_global/std-entity-ui/std-entity-ui.component';
import { DashStudentCalendarComponent } from './dash-student-calendar.component';
import { DashStudentFeedComponent } from './dash-student-feed.component';
import { StudentProfileUiComponent } from './student-profile-ui/student-profile-ui.component';
import { DashStudentMyOrganizationsComponent } from './dash-student-my-organizations.component';
import { DashStudentMyParticipationComponent } from './dash-student-my-participation.component';
const routes: Routes = [
  {
    path: '',
    component: DashStudentComponent,
    children: [
      {
        path: 'profile',
        component: StudentProfileUiComponent,
        data: {
          pageTitle: 'My Profile',
          pageSubtitle: 'Manage your personal details, family, address, and feed settings',
          pageIcon: 'fas fa-user',
        }
      },
      {
        path: 'home',
        component: DashStudentHomeComponent,
        data: {
          pageTitle: 'My Dashboard',
          pageSubtitle: 'Welcome back — here’s what’s new',
          pageIcon: 'fas fa-tachometer-alt',
        }
      },
      
      { path: 'personalstatements', component: DashStudentPersonalStatementsComponent },
      { path: 'personalstatement-details/:id', component: StudentPersonalStatementDetailsComponent },
      { path: 'personalstatements/:id/:tabId/:childId', component: StudentPersonalStatementGroupComponent },
      { path: 'personalstatements/:id/:tabId', component: StudentPersonalStatementGroupComponent },
      { path: 'personalstatements/:id', component: StudentPersonalStatementGroupComponent },


      { path: 'resumeentries/:id/:tabId', component: StudentResumeEntryGroupComponent },
      { path: 'resumeentries/:id', redirectTo: 'resumeentries/:id/details', pathMatch: 'full' },
      { path: 'resumeentries', component: StudentResumeEntryGroupComponent },

      { path: 'progress', component: DashStudentProgressComponent },
      { path: 'guidance', component: DashStudentGuidanceComponent },
      {
        path: 'research',
        component: StudentResearchComponent,
        data: {
          pageTitle: 'Research',
          pageSubtitle: 'Explore careers, organizations, and opportunities',
          pageIcon: 'fas fa-search',
        }
      },
      { path: 'research/careers/:vocationEncodingRefId', component: StudentResearchCareersComponent },
      { path: 'research/careers', component: StudentResearchCareersComponent },
      { path: 'research/orgs', component: StudentResearchOrgsComponent },
      { path: 'research/items', component: StudentResearchItemsComponent },
      { path: 'research/:vocationEncodingRefId', redirectTo: 'research/careers/:vocationEncodingRefId', pathMatch: 'full' },
      { path: 'resumebuilder', component: StudentResumeBuilderComponent },
      { path: 'catalogs', component: StudentCatalogComponent },
      { path: 'interests', component: DashStudentInterestsComponent },

      { path: 'guidance/workrequests/:ticketId/:tabId', component:StudentWorkRequestsComponent },
      { path: 'guidance/workrequests/:ticketId', redirectTo: 'guidance/workrequests/:ticketId/ticket', pathMatch: 'full' },
      { path: 'guidance/workrequests', component:StudentWorkRequestsComponent },
  
      { path: 'messages/:messageId/:tabId', component:DashStudentMessagesComponent },
      { path: 'messages/:messageId', redirectTo: 'messages/:messageId/message', pathMatch: 'full' },
      {
        path: 'messages',
        component: DashStudentMessagesComponent,
        data: {
          pageTitle: 'Communications',
          pageSubtitle: 'Message information',
          pageIcon: 'fas fa-envelope',
        }
      },

      {
        path: 'my-organizations',
        component: DashStudentMyOrganizationsComponent,
        data: {
          pageTitle: 'My Organizations',
          pageSubtitle: 'Track organizations you are interested in',
          pageIcon: 'fas fa-building',
        }
      },

      {
        path: 'calendar',
        component: DashStudentCalendarComponent,
        data: {
          pageTitle: 'My Calendar',
          pageSubtitle: 'Track your appointments, deadlines, and important events',
          pageIcon: 'fas fa-calendar-alt',

        }
      },

      {
        path: 'feed', component: DashStudentFeedComponent,
      },

      {
        path: 'participation',
        component: DashStudentMyParticipationComponent,
        data: {
          pageTitle: 'My Participation',
          pageSubtitle: '',
          pageIcon: 'fas fa-people-group',
        }
      },

      { path: 'interests/:interestId/interest', component:DashStudentInterestComponent },
      { path: 'interests/:interestId/:tabId', component:DashStudentInterestsComponent },
      { path: 'interests/:interestId', redirectTo: 'interests/:interestId/interest', pathMatch: 'full' },
      { path: 'interests', component:DashStudentInterestsComponent },

      { path: 'engage', component: StudentEngageComponent },

      { path: 'resumes/:resumeId/resume', component:DashStudentResumesGroupComponent },
      { path: 'resumes/:resumeId/:tabId', component:DashStudentResumesGroupComponent },
      { path: 'resumes/:resumeId', redirectTo: 'resumes/:resumeId/resume', pathMatch: 'full' },
      { path: 'resumes', component:DashStudentResumesGroupComponent },

      { path: 'uistarter', component: UistarterHomeComponent },

      { path: 'e/:entityType/:entityId/:tabId/:childId/:childTabId', component: StdEntityUiComponent },
      { path: 'e/:entityType/:entityId/:tabId/:childId', component: StdEntityUiComponent },
      { path: 'e/:entityType/:entityId/:tabId', component: StdEntityUiComponent },
      { path: 'e/:entityType/:entityId', component: StdEntityUiComponent },
//      { path: 'e/:entityType/:entityId', component: StdEntityUiComponent  },


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
    CLCatalogSearchComponent,
    StudentEngageComponent,
    StudentCatalogComponent,
    StudentResearchComponent,
    StudentResearchCareersComponent,
    StudentResearchOrgsComponent,
    StudentResearchItemsComponent,
    StudentResumeBuilderComponent,
    StudentPersonalStatementDetailsComponent,
    DashStudentCalendarComponent,
    DashStudentFeedComponent,
    StudentProfileUiComponent,
    DashStudentMyOrganizationsComponent,
    DashStudentMyParticipationComponent,
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
