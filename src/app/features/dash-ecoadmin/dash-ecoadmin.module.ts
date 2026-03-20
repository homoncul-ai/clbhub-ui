
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
import { TeamMemberRoleRefListComponent } from '../../components/_crud/teammemberroleref/teammemberroleref-list.component';
import { TeamMemberRoleRefGroupComponent } from '../../components/_crud/teammemberroleref/teammemberroleref-group.component';
import { TeamTypeRefListComponent } from '../../components/_crud/teamtyperef/teamtyperef-list.component';
import { TeamTypeRefGroupComponent } from '../../components/_crud/teamtyperef/teamtyperef-group.component';
import { HcclTeamListComponent } from '../../components/_crud/hcclteam/hcclteam-list.component';
import { HcclTeamGroupComponent } from '../../components/_crud/hcclteam/hcclteam-group.component';
import { TeamMemberListComponent } from '../../components/_crud/teammember/teammember-list.component';
import { TeamMemberGroupComponent } from '../../components/_crud/teammember/teammember-group.component';
import { HcclTeamLogListComponent } from '../../components/_crud/hcclteamlog/hcclteamlog-list.component';
import { HcclTeamLogGroupComponent } from '../../components/_crud/hcclteamlog/hcclteamlog-group.component';
import { CatalogSearchResultListComponent } from '../../components/_crud/catalogsearchresult/catalogsearchresult-list.component';
import { CatalogSearchResultGroupComponent } from '../../components/_crud/catalogsearchresult/catalogsearchresult-group.component';
import { CatalogSearchResultEntryListComponent } from '../../components/_crud/catalogsearchresultentry/catalogsearchresultentry-list.component';
import { CatalogSearchResultEntryGroupComponent } from '../../components/_crud/catalogsearchresultentry/catalogsearchresultentry-group.component';
import { ProviderListComponent } from '../../components/_crud/provider/provider-list.component';
import { ProviderGroupComponent } from '../../components/_crud/provider/provider-group.component';
import { ProviderRequestListComponent } from '../../components/_crud/providerrequest/providerrequest-list.component';
import { ProviderRequestGroupComponent } from '../../components/_crud/providerrequest/providerrequest-group.component';
import { ProviderRequestTypeRefListComponent } from '../../components/_crud/providerrequesttyperef/providerrequesttyperef-list.component';
import { ProviderRequestTypeRefGroupComponent } from '../../components/_crud/providerrequesttyperef/providerrequesttyperef-group.component';
import { HcclUserProfileListComponent } from '@app/components/_crud/hccluserprofile/hccluserprofile-list.component';
import { WorkRequestLogListComponent } from '@app/components/_crud/workrequestlog/workrequestlog-list.component';
import { WorkRequestLogGroupComponent } from '@app/components/_crud/workrequestlog/workrequestlog-group.component';
import { OrgSchoolsGroupComponent } from './orgs/org-schools-group.component';
import { OrgNonprofitGroupComponent } from './orgs/org-nonprofit-group.component';
import { OrgBusinessGroupComponent } from './orgs/org-business-group.component';
import { PersonalStatementListComponent } from '../../components/_crud/personalstatement/personalstatement-list.component';
import { PersonalStatementGroupComponent } from '../../components/_crud/personalstatement/personalstatement-group.component';
import { CatalogEntryInterestListComponent } from '../../components/_crud/catalogentryinterest/catalogentryinterest-list.component';
import { CatalogEntryInterestGroupComponent } from '../../components/_crud/catalogentryinterest/catalogentryinterest-group.component';
import { HcclOrganizationInterestListComponent } from '../../components/_crud/hcclorganizationinterest/hcclorganizationinterest-list.component';
import { HcclOrganizationInterestGroupComponent } from '../../components/_crud/hcclorganizationinterest/hcclorganizationinterest-group.component';
import { CatalogTypeRefListComponent } from '../../components/_crud/catalogtyperef/catalogtyperef-list.component';
import { CatalogTypeRefGroupComponent } from '../../components/_crud/catalogtyperef/catalogtyperef-group.component';
import { VocationEncodingRefListComponent } from '../../components/_crud/vocationencodingref/vocationencodingref-list.component';
import { VocationEncodingRefGroupComponent } from '../../components/_crud/vocationencodingref/vocationencodingref-group.component';
import { PersonalStatementResumeListComponent } from '../../components/_crud/personalstatementresume/personalstatementresume-list.component';
import { PersonalStatementResumeGroupComponent } from '../../components/_crud/personalstatementresume/personalstatementresume-group.component';
import { CatalogEntrySignupPacketListComponent } from '../../components/_crud/catalogentrysignuppacket/catalogentrysignuppacket-list.component';
import { CatalogEntrySignupPacketGroupComponent } from '../../components/_crud/catalogentrysignuppacket/catalogentrysignuppacket-group.component';
import { PAIPromptRefGroupComponent } from '../../components/_crud/paiprompt/paipromptref-group.component';
import { PAIPromptRefListComponent } from '../../components/_crud/paiprompt/paipromptref-list.component';
import { UistarterHomeComponent } from '../../views/uistarter/uistarter-home.component';

const routes: Routes = [
  {
    path: '',
    component: DashEcoAdminComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      { path: 'orgs/schools/:id/:tabId/:childId', component: OrgSchoolsGroupComponent },
      { path: 'orgs/schools/:id/:tabId', component: OrgSchoolsGroupComponent },
      { path: 'orgs/schools/:id', redirectTo: 'orgs/schools/:id/details', pathMatch: 'full' },
      { path: 'orgs/schools', component: OrgSchoolsGroupComponent },

      { path: 'orgs/nonprofits/:id/:tabId/:childId', component: OrgNonprofitGroupComponent },
      { path: 'orgs/nonprofits/:id/:tabId', component: OrgNonprofitGroupComponent },
      { path: 'orgs/nonprofits/:id', redirectTo: 'orgs/nonprofits/:id/details', pathMatch: 'full' },
      { path: 'orgs/nonprofits', component: OrgNonprofitGroupComponent },

      { path: 'orgs/businesses/:id/:tabId/:childId', component: OrgBusinessGroupComponent },
      { path: 'orgs/businesses/:id/:tabId', component: OrgBusinessGroupComponent },
      { path: 'orgs/businesses/:id', redirectTo: 'orgs/businesses/:id/details', pathMatch: 'full' },
      { path: 'orgs/businesses', component: OrgBusinessGroupComponent },

      { path: 'dashboard', component: EcoAdminDashboardComponent },
      
      { path: 'providertyperefs/create', component: ProviderTypeRefGroupComponent },
      { path: 'providertyperefs/:id/:tabId', component: ProviderTypeRefGroupComponent },
      { path: 'providertyperefs/:id', redirectTo: 'providertyperefs/:id/details', pathMatch: 'full' },
      { path: 'providertyperefs', component: ProviderTypeRefListComponent },
      
      { path: 'providers/create', component: ProviderGroupComponent },
      { path: 'providers/:id/:tabId', component: ProviderGroupComponent },
      { path: 'providers/:id', redirectTo: 'providers/:id/details', pathMatch: 'full' },
      { path: 'providers', component: ProviderListComponent },
      
      { path: 'providerrequests/create', component: ProviderRequestGroupComponent },
      { path: 'providerrequests/:id/:tabId', component: ProviderRequestGroupComponent },
      { path: 'providerrequests/:id', redirectTo: 'providerrequests/:id/details', pathMatch: 'full' },
      { path: 'providerrequests', component: ProviderRequestListComponent },
      
      { path: 'providerrequesttyperefs/create', component: ProviderRequestTypeRefGroupComponent },
      { path: 'providerrequesttyperefs/:id/:tabId', component: ProviderRequestTypeRefGroupComponent },
      { path: 'providerrequesttyperefs/:id', redirectTo: 'providerrequesttyperefs/:id/details', pathMatch: 'full' },
      { path: 'providerrequesttyperefs', component: ProviderRequestTypeRefListComponent },
      
      { path: 'clcourses/create', component: CLCourseGroupComponent },
      { path: 'clcourses/:id/:tabId', component: CLCourseGroupComponent },
      { path: 'clcourses/:id', redirectTo: 'clcourses/:id/details', pathMatch: 'full' },
      { path: 'clcourses', component: CLCourseListComponent },
  
      { path: 'catalogs/create', component: CatalogGroupComponent },
      { path: 'catalogs/:id/:tabId/:childId', component: CatalogGroupComponent },
      { path: 'catalogs/:id/:tabId', component: CatalogGroupComponent },
      { path: 'catalogs/:id', redirectTo: 'catalogs/:id/details', pathMatch: 'full' },
      { path: 'catalogs', component: CatalogListComponent },

  
      { path: 'catalogentries/create', component: CatalogEntryGroupComponent },
      { path: 'catalogentries/:id/:tabId', component: CatalogEntryGroupComponent },
      { path: 'catalogentries/:id', redirectTo: 'catalogentries/:id/details', pathMatch: 'full' },
      { path: 'catalogentries', component: CatalogEntryListComponent },

      { path: 'catalogtyperefs/create', component: CatalogTypeRefGroupComponent },
      { path: 'catalogtyperefs/:id/:tabId', component: CatalogTypeRefGroupComponent },
      { path: 'catalogtyperefs/:id', redirectTo: 'catalogtyperefs/:id/details', pathMatch: 'full' },
      { path: 'catalogtyperefs', component: CatalogTypeRefListComponent },

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
      { path: 'hccluserprofiles', component: HcclUserProfileListComponent },

      { path: 'workqueuetyperefs/create', component: WorkQueueTypeRefGroupComponent },
      { path: 'workqueuetyperefs/:id/:tabId', component: WorkQueueTypeRefGroupComponent },
      { path: 'workqueuetyperefs/:id', redirectTo: 'workqueuetyperefs/:id/details', pathMatch: 'full' },
      { path: 'workqueuetyperefs', component: WorkQueueTypeRefListComponent },
      
      { path: 'workqueues/create', component: WorkQueueGroupComponent },
      { path: 'workqueues/:id/:tabId', component: WorkQueueGroupComponent },
      { path: 'workqueues/:id', redirectTo: 'workqueues/:id/details', pathMatch: 'full' },
      { path: 'workqueues', component: WorkQueueListComponent },
      
      { path: 'workrequests/create', component: WorkRequestGroupComponent },
      { path: 'workrequests/:id/:tabId/:childId', component: WorkRequestGroupComponent },
      { path: 'workrequests/:id/:tabId', component: WorkRequestGroupComponent },
      { path: 'workrequests/:id', redirectTo: 'workrequests/:id/details', pathMatch: 'full' },
      { path: 'workrequests', component: WorkRequestListComponent },

      { path: 'workrequestitems/create', component: WorkRequestItemGroupComponent },
      { path: 'workrequestitems/:id/:tabId', component: WorkRequestItemGroupComponent },
      { path: 'workrequestitems/:id', redirectTo: 'workrequestitems/:id/details', pathMatch: 'full' },
      { path: 'workrequestitems', component: WorkRequestItemListComponent },

      { path: 'workrequestlogs/create', component: WorkRequestLogGroupComponent },
      { path: 'workrequestlogs/:id/:tabId', component: WorkRequestLogGroupComponent },
      { path: 'workrequestlogs/:id', redirectTo: 'workrequestlogs/:id/details', pathMatch: 'full' },
      { path: 'workrequestlogs', component: WorkRequestLogListComponent },

      { path: 'teamMemberRoleRefs/create', component: TeamMemberRoleRefGroupComponent },
      { path: 'teamMemberRoleRefs/:id/:tabId', component: TeamMemberRoleRefGroupComponent },
      { path: 'teamMemberRoleRefs/:id', redirectTo: 'teamMemberRoleRefs/:id/details', pathMatch: 'full' },
      { path: 'teamMemberRoleRefs', component: TeamMemberRoleRefListComponent },

      { path: 'teamTypeRefs/create', component: TeamTypeRefGroupComponent },
      { path: 'teamTypeRefs/:id/:tabId', component: TeamTypeRefGroupComponent },
      { path: 'teamTypeRefs/:id', redirectTo: 'teamTypeRefs/:id/details', pathMatch: 'full' },
      { path: 'teamTypeRefs', component: TeamTypeRefListComponent },

      { path: 'hcclTeams/create', component: HcclTeamGroupComponent },
      { path: 'hcclTeams/:id/:tabId', component: HcclTeamGroupComponent },
      { path: 'hcclTeams/:id', redirectTo: 'hcclTeams/:id/details', pathMatch: 'full' },
      { path: 'hcclTeams', component: HcclTeamListComponent },

      { path: 'teamMembers/create', component: TeamMemberGroupComponent },
      { path: 'teamMembers/:id/:tabId', component: TeamMemberGroupComponent },
      { path: 'teamMembers/:id', redirectTo: 'teamMembers/:id/details', pathMatch: 'full' },
      { path: 'teamMembers', component: TeamMemberListComponent },

      { path: 'hcclteamlogs/create', component: HcclTeamLogGroupComponent },
      { path: 'hcclteamlogs/:id/:tabId', component: HcclTeamLogGroupComponent },
      { path: 'hcclteamlogs/:id', redirectTo: 'hcclteamlogs/:id/details', pathMatch: 'full' },
      { path: 'hcclteamlogs', component: HcclTeamLogListComponent },

      { path: 'catalogsearchresults/create', component: CatalogSearchResultGroupComponent },
      { path: 'catalogsearchresults/:id/:tabId', component: CatalogSearchResultGroupComponent },
      { path: 'catalogsearchresults/:id', redirectTo: 'catalogsearchresults/:id/details', pathMatch: 'full' },
      { path: 'catalogsearchresults', component: CatalogSearchResultListComponent },

      { path: 'catalogsearchresultentries/create', component: CatalogSearchResultEntryGroupComponent },
      { path: 'catalogsearchresultentries/:id/:tabId', component: CatalogSearchResultEntryGroupComponent },
      { path: 'catalogsearchresultentries/:id', redirectTo: 'catalogsearchresultentries/:id/details', pathMatch: 'full' },
      { path: 'catalogsearchresultentries', component: CatalogSearchResultEntryListComponent },
      
      // PersonalStatement routes
      { path: 'personalstatements/create', component: PersonalStatementGroupComponent },
      { path: 'personalstatements/:id/:tabId', component: PersonalStatementGroupComponent },
      { path: 'personalstatements/:id', redirectTo: 'personalstatements/:id/details', pathMatch: 'full' },
      { path: 'personalstatements', component: PersonalStatementListComponent },
      
      // CatalogEntryInterest routes
      { path: 'catalogentryinterests/create', component: CatalogEntryInterestGroupComponent },
      { path: 'catalogentryinterests/:id/:tabId', component: CatalogEntryInterestGroupComponent },
      { path: 'catalogentryinterests/:id', redirectTo: 'catalogentryinterests/:id/details', pathMatch: 'full' },
      { path: 'catalogentryinterests', component: CatalogEntryInterestListComponent },

      // HcclOrganizationInterest routes
      { path: 'hcclorganizationinterests/create', component: HcclOrganizationInterestGroupComponent },
      { path: 'hcclorganizationinterests/:id/:tabId', component: HcclOrganizationInterestGroupComponent },
      { path: 'hcclorganizationinterests/:id', redirectTo: 'hcclorganizationinterests/:id/details', pathMatch: 'full' },
      { path: 'hcclorganizationinterests', component: HcclOrganizationInterestListComponent },

      // VocationEncodingRef routes
      { path: 'vocationencodingrefs/create', component: VocationEncodingRefGroupComponent },
      { path: 'vocationencodingrefs/:id/:tabId', component: VocationEncodingRefGroupComponent },
      { path: 'vocationencodingrefs/:id', redirectTo: 'vocationencodingrefs/:id/details', pathMatch: 'full' },
      { path: 'vocationencodingrefs', component: VocationEncodingRefListComponent },

      // PersonalStatementResume routes
      { path: 'personalstatementresumes/create', component: PersonalStatementResumeGroupComponent },
      { path: 'personalstatementresumes/:id/:tabId', component: PersonalStatementResumeGroupComponent },
      { path: 'personalstatementresumes/:id', redirectTo: 'personalstatementresumes/:id/details', pathMatch: 'full' },
      { path: 'personalstatementresumes', component: PersonalStatementResumeListComponent },

      // CatalogEntrySignupPacket routes
      { path: 'catalogentrysignuppackets/create', component: CatalogEntrySignupPacketGroupComponent },
      { path: 'catalogentrysignuppackets/:id/:tabId', component: CatalogEntrySignupPacketGroupComponent },
      { path: 'catalogentrysignuppackets/:id', redirectTo: 'catalogentrysignuppackets/:id/details', pathMatch: 'full' },
      { path: 'catalogentrysignuppackets', component: CatalogEntrySignupPacketListComponent },

      // PAiPromptRef routes
      { path: 'paipromptrefs/create', component: PAIPromptRefGroupComponent },
      { path: 'paipromptrefs/:id/:tabId', component: PAIPromptRefGroupComponent },
      { path: 'paipromptrefs/:id', redirectTo: 'paipromptrefs/:id/details', pathMatch: 'full' },
      { path: 'paipromptrefs', component: PAIPromptRefListComponent },

      // UI starter route
      { path: 'uistarter', component: UistarterHomeComponent },
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
    ProviderListComponent,
    ProviderGroupComponent,
    ProviderRequestListComponent,
    ProviderRequestGroupComponent,
    ProviderRequestTypeRefListComponent,
    ProviderRequestTypeRefGroupComponent,
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
    WorkRequestLogListComponent,
    WorkRequestLogGroupComponent,
    HcclUserProfileGroupComponent,
    HcclUserProfileCrudComponent,
    TeamMemberRoleRefListComponent,
    TeamMemberRoleRefGroupComponent,
    TeamTypeRefListComponent,
    TeamTypeRefGroupComponent,
    HcclTeamListComponent,
    HcclTeamGroupComponent,
    TeamMemberListComponent,
    TeamMemberGroupComponent,
    HcclTeamLogListComponent,
    HcclTeamLogGroupComponent,
    CatalogSearchResultListComponent,
    CatalogSearchResultGroupComponent,
    CatalogSearchResultEntryListComponent,
    CatalogSearchResultEntryGroupComponent,
    PersonalStatementListComponent,
    PersonalStatementGroupComponent,
    CatalogEntryInterestListComponent,
    CatalogEntryInterestGroupComponent,
    HcclOrganizationInterestListComponent,
    HcclOrganizationInterestGroupComponent,
    CatalogTypeRefListComponent,
    CatalogTypeRefGroupComponent,
    VocationEncodingRefListComponent,
    VocationEncodingRefGroupComponent,
    PersonalStatementResumeListComponent,
    PersonalStatementResumeGroupComponent,
    CatalogEntrySignupPacketListComponent,
    CatalogEntrySignupPacketGroupComponent,
    PAIPromptRefGroupComponent,
    PAIPromptRefListComponent,
    OrgSchoolsGroupComponent,
    UistarterHomeComponent
  ]
})
export class DashEcoAdminModule { } 