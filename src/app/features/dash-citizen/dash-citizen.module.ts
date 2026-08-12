import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';

// Components
import { DashCitizenComponent } from './dash-citizen.component';
import { DashCitizenHomeComponent } from './dash-citizen-home.component';
import { DashCitizenPersonalStatementsComponent } from './dash-citizen-personalstatements.component';
import { DashCitizenProgressComponent } from './dash-citizen-progress.component';
import { DashCitizenGuidanceComponent } from './dash-citizen-guidance.component';
import { DashCitizenScheduleComponent } from './dash-citizen-schedule.component';
import { CitizenPersonalStatementGroupComponent } from './citizen-personalstatement-group.component';
import { CitizenResumeEntryGroupComponent } from './citizen-resumeentry-group.component';
import { CatalogEntryModalComponent } from './catalog-entry-modal.component';  
import { DashCitizenMessagesComponent } from './dash-citizen-messages.component';
import { DashCitizenInterestsComponent } from './dash-citizen-interests.component';
import { DashCitizenInterestComponent } from './dash-citizen-interest.component';
import { DashCitizenResumesComponent } from './dash-citizen-resumes.component';
import { DashCitizenResumesGroupComponent } from './dash-citizen-resumes-group.component';
import { CitizenWorkRequestsComponent } from './workrequests/citizen-workrequests.component';
import { UistarterHomeComponent } from '../../views/uistarter/uistarter-home.component';
import { CLCatalogSearchComponent } from './clcatalog-search/clcatalog-search.component';
import { CitizenEngageComponent } from './citizen-engage.component';
import { CitizenCatalogComponent } from './citizen-catalog/citizen-catalog.component';
import { CitizenResearchComponent } from './citizen-research/citizen-research.component';
import { CitizenResearchCareersComponent } from './citizen-research-careers/citizen-research-careers.component';
import { CitizenResearchOrgsComponent } from './citizen-research-orgs/citizen-research-orgs.component';
import { CitizenResearchItemsComponent } from './citizen-research-items/citizen-research-items.component';
import { CitizenResearchCareerLaddersComponent } from './citizen-research-career-ladders/citizen-research-career-ladders.component';
import { CitizenResumeBuilderComponent } from './citizen-resumebuilder/citizen-resumebuilder.component';
import { CitizenPersonalStatementDetailsComponent } from './citizen-personalstatement-details.component';
import { StdEntityUiComponent } from '@app/components/_global/std-entity-ui/std-entity-ui.component';
import { DashCitizenCalendarComponent } from './dash-citizen-calendar.component';
import { DashCitizenFeedComponent } from './dash-citizen-feed.component';
import { CitizenProfileUiComponent } from './citizen-profile-ui/citizen-profile-ui.component';
import { DashCitizenMyOrganizationsComponent } from './dash-citizen-my-organizations.component';
import { DashCitizenMyParticipationComponent } from './dash-citizen-my-participation.component';
import { DashCitizenCohortsComponent } from './dash-citizen-cohorts.component';
import { CohortParticipantUiExampleComponent } from './cohorts/cohort-participant-ui-example.component';
const routes: Routes = [
  {
    path: '',
    component: DashCitizenComponent,
    children: [
      {
        path: 'profile',
        component: CitizenProfileUiComponent,
        data: {
          pageTitle: 'My Profile',
          pageSubtitle: 'Manage your personal details, family, address, and feed settings',
          pageIcon: 'fas fa-user',
        }
      },
      {
        path: 'home',
        component: DashCitizenHomeComponent,
        data: {
          pageTitle: 'My Dashboard',
          pageSubtitle: 'Welcome back — here’s what’s new',
          pageIcon: 'fas fa-tachometer-alt',
        }
      },
      
      {
        path: 'personalstatements',
        component: DashCitizenPersonalStatementsComponent,
        data: {
          pageTitle: 'My Pursuits',
          pageSubtitle: 'Track and manage your pursuits',
          pageIcon: 'fas fa-bullseye',
        }
      },
      { path: 'personalstatement-details/:id', component: CitizenPersonalStatementDetailsComponent },
      { path: 'personalstatements/:id/:tabId/:childId', component: CitizenPersonalStatementGroupComponent },
      { path: 'personalstatements/:id/:tabId', component: CitizenPersonalStatementGroupComponent },
      { path: 'personalstatements/:id', component: CitizenPersonalStatementGroupComponent },


      { path: 'resumeentries/:id/:tabId', component: CitizenResumeEntryGroupComponent },
      { path: 'resumeentries/:id', redirectTo: 'resumeentries/:id/details', pathMatch: 'full' },
      { path: 'resumeentries', component: CitizenResumeEntryGroupComponent },

      { path: 'progress', component: DashCitizenProgressComponent },
      { path: 'guidance', component: DashCitizenGuidanceComponent },
      {
        path: 'research',
        component: CitizenResearchComponent,
        data: {
          pageTitle: 'Research',
          pageSubtitle: 'Explore careers, organizations, and opportunities',
          pageIcon: 'fas fa-search',
        }
      },
      {
        path: 'research/careers/:vocationEncodingRefId',
        component: CitizenResearchCareersComponent,
        data: { pageTitle: 'Research Careers', pageSubtitle: 'Explore career opportunities', pageIcon: 'fas fa-briefcase' }
      },
      {
        path: 'research/careers',
        component: CitizenResearchCareersComponent,
        data: { pageTitle: 'Research Careers', pageSubtitle: 'Explore career opportunities', pageIcon: 'fas fa-briefcase' }
      },
      {
        path: 'research/orgs',
        component: CitizenResearchOrgsComponent,
        data: { pageTitle: 'Research Organizations', pageSubtitle: 'Explore organizations', pageIcon: 'fas fa-building' }
      },
      {
        path: 'research/items',
        component: CitizenResearchItemsComponent,
        data: { pageTitle: 'Research Items', pageSubtitle: 'Explore listings and opportunities', pageIcon: 'fas fa-clipboard-list' }
      },
      {
        path: 'research/career-ladders',
        component: CitizenResearchCareerLaddersComponent,
        data: {
          pageTitle: 'Career Ladders',
          pageSubtitle: 'Explore Massachusetts career ladders',
          pageIcon: 'fas fa-layer-group',
        }
      },
      { path: 'research/:vocationEncodingRefId', redirectTo: 'research/careers/:vocationEncodingRefId', pathMatch: 'full' },
      {
        path: 'resumebuilder',
        component: CitizenResumeBuilderComponent,
        data: { pageTitle: 'Resume Builder', pageSubtitle: 'Build and manage your professional resumes', pageIcon: 'fas fa-file-alt' }
      },
      { path: 'catalogs', component: CitizenCatalogComponent },
      { path: 'interests', component: DashCitizenInterestsComponent },

      { path: 'guidance/workrequests/:ticketId/:tabId', component:CitizenWorkRequestsComponent },
      { path: 'guidance/workrequests/:ticketId', redirectTo: 'guidance/workrequests/:ticketId/ticket', pathMatch: 'full' },
      { path: 'guidance/workrequests', component:CitizenWorkRequestsComponent },
  
      { path: 'messages/:messageId/:tabId', component:DashCitizenMessagesComponent },
      { path: 'messages/:messageId', redirectTo: 'messages/:messageId/message', pathMatch: 'full' },
      {
        path: 'messages',
        component: DashCitizenMessagesComponent,
        data: {
          pageTitle: 'Communications',
          pageSubtitle: 'Message information',
          pageIcon: 'fas fa-envelope',
        }
      },

      {
        path: 'my-organizations',
        component: DashCitizenMyOrganizationsComponent,
        data: {
          pageTitle: 'My Organizations',
          pageSubtitle: 'Track organizations you are interested in',
          pageIcon: 'fas fa-building',
        }
      },

      {
        path: 'calendar',
        component: DashCitizenCalendarComponent,
        data: {
          pageTitle: 'My Calendar',
          pageSubtitle: 'Track your appointments, deadlines, and important events',
          pageIcon: 'fas fa-calendar-alt',

        }
      },

      {
        path: 'feed',
        component: DashCitizenFeedComponent,
        data: {
          pageTitle: 'My Feed',
          pageSubtitle: 'Stay updated with the latest posts and announcements',
          pageIcon: 'fas fa-stream',
        }
      },

      {
        path: 'participation',
        component: DashCitizenMyParticipationComponent,
        data: {
          pageTitle: 'My Participation',
          pageSubtitle: '',
          pageIcon: 'fas fa-people-group',
        }
      },

      {
        path: 'cohorts/healthcare-ui-example',
        component: CohortParticipantUiExampleComponent,
        data: {
          presetKey: 'healthcare',
          showBackLink: true,
          pageTitle: 'Healthcare Careers Pathway',
          pageSubtitle: 'Participant UI spec — static mock',
          pageIcon: 'fas fa-users',
        },
      },
      {
        path: 'cohorts/ai-exploration-ui-example',
        component: CohortParticipantUiExampleComponent,
        data: {
          presetKey: 'ai-exploration',
          showBackLink: true,
          pageTitle: 'AI Exploration Cohort',
          pageSubtitle: 'Participant UI spec — static mock',
          pageIcon: 'fas fa-users',
        },
      },
      {
        path: 'cohorts',
        component: DashCitizenCohortsComponent,
        data: {
          pageTitle: 'My Cohorts',
          pageSubtitle: 'Participant view — MVP UI specs with documentation links',
          pageIcon: 'fas fa-users',
        },
      },

      { path: 'interests/:interestId/interest', component:DashCitizenInterestComponent },
      { path: 'interests/:interestId/:tabId', component:DashCitizenInterestsComponent },
      { path: 'interests/:interestId', redirectTo: 'interests/:interestId/interest', pathMatch: 'full' },
      { path: 'interests', component:DashCitizenInterestsComponent },

      { path: 'engage', component: CitizenEngageComponent },

      { path: 'resumes/:resumeId/resume', component:DashCitizenResumesGroupComponent },
      { path: 'resumes/:resumeId/:tabId', component:DashCitizenResumesGroupComponent },
      { path: 'resumes/:resumeId', redirectTo: 'resumes/:resumeId/resume', pathMatch: 'full' },
      { path: 'resumes', component:DashCitizenResumesGroupComponent },

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
    DashCitizenComponent,
    DashCitizenHomeComponent,
    DashCitizenPersonalStatementsComponent,
    DashCitizenProgressComponent,
    DashCitizenGuidanceComponent,
    DashCitizenMessagesComponent,
    DashCitizenInterestsComponent,
    DashCitizenInterestComponent,
    DashCitizenResumesComponent,
    DashCitizenResumesGroupComponent,
    CatalogEntryModalComponent,
    UistarterHomeComponent,
    CitizenResumeEntryGroupComponent,
    CLCatalogSearchComponent,
    CitizenEngageComponent,
    CitizenCatalogComponent,
    CitizenResearchComponent,
    CitizenResearchCareersComponent,
    CitizenResearchOrgsComponent,
    CitizenResearchItemsComponent,
    CitizenResumeBuilderComponent,
    CitizenPersonalStatementDetailsComponent,
    DashCitizenCalendarComponent,
    DashCitizenFeedComponent,
    CitizenProfileUiComponent,
    DashCitizenMyOrganizationsComponent,
    DashCitizenMyParticipationComponent,
    DashCitizenCohortsComponent,
    CohortParticipantUiExampleComponent,
  ],
  declarations: [
    // Non-standalone components would go here
  ]
})
export class DashCitizenModule { 
  constructor() {
    console.log('DashCitizenModule');
  }
}
