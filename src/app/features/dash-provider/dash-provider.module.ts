import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

// Components
import { DashProviderComponent } from './dash-provider.component';

// Group Components
import { ProviderDashboardGroupComponent } from './dashboard/provider-dashboard-group.component';
import { ProviderDetailsGroupComponent } from './details/provider-details-group.component';
import { ProviderWorkrequestGroupComponent } from './workrequest/provider-workrequest-group.component';
import { ProviderCatalogGroupComponent } from './catalog/provider-catalog-group.component';
import { ProviderWorkqueueGroupComponent } from './workqueues/provider-workqueue-group.component';
import { ProviderCatalogTabDashComponent } from './catalog/provider-catalog-tab-dash.component';
import { CatalogEntrySignupPacketListComponent } from '../../components/_crud/catalogentrysignuppacket/catalogentrysignuppacket-list.component';
import { CatalogEntrySignupPacketGroupComponent } from '../../components/_crud/catalogentrysignuppacket/catalogentrysignuppacket-group.component';
import { StdEntityUiComponent } from '@app/components/_global';
import { DashProviderMessagesComponent } from './dash-provider-messages.component';
import { DashProviderSignupPacketsComponent } from './dash-provider-signuppackets.component';
import { ProviderExperiencesComponent } from './experiences/provider-experiences.component';

// Shared page-header data so the shell renders a consistent title banner on
// every menu-reachable provider page (shell reads the deepest child route's data).
const HDR_DASHBOARD = { pageTitle: 'Dashboard', pageSubtitle: 'Your provider overview', pageIcon: 'fas fa-tachometer-alt' };
const HDR_MESSAGES = { pageTitle: 'My Communications', pageSubtitle: 'Messages and announcements', pageIcon: 'fas fa-envelope' };
const HDR_DETAILS = { pageTitle: 'My School', pageSubtitle: 'Provider details and colleagues', pageIcon: 'fas fa-school' };
const HDR_WORKREQUEST = { pageTitle: 'Work Requests', pageSubtitle: 'Manage work requests', pageIcon: 'fas fa-clipboard-check' };
const HDR_WORKQUEUE = { pageTitle: 'Work Queue', pageSubtitle: 'Manage your work queue', pageIcon: 'fas fa-list-check' };
const HDR_CATALOGS = { pageTitle: 'Catalogs', pageSubtitle: 'Manage your catalogs and entries', pageIcon: 'fas fa-book' };
const HDR_CATALOG = { pageTitle: 'Catalog', pageSubtitle: 'Manage this catalog', pageIcon: 'fas fa-book' };
const HDR_EXPERIENCES = { pageTitle: 'Experiences', pageSubtitle: 'Search and manage experiences', pageIcon: 'fas fa-compass' };
const HDR_SIGNUPPACKETS = { pageTitle: 'Signup Packets', pageSubtitle: 'Manage signup packets', pageIcon: 'fas fa-clipboard-list' };

const routes: Routes = [
  {
    path: '',
    component: DashProviderComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard/:tabId', component: ProviderDashboardGroupComponent, data: HDR_DASHBOARD },
      { path: 'dashboard', component: ProviderDashboardGroupComponent, data: HDR_DASHBOARD },

      { path: 'messages/:messageId/:tabId', component: DashProviderMessagesComponent, data: HDR_MESSAGES },
      { path: 'messages/:messageId', redirectTo: 'messages/:messageId/message', pathMatch: 'full' },
      { path: 'messages', component: DashProviderMessagesComponent, data: HDR_MESSAGES },
      { path: 'details/:tabId/:childId', component: ProviderDetailsGroupComponent, data: HDR_DETAILS },
      { path: 'details/:tabId', component: ProviderDetailsGroupComponent, data: HDR_DETAILS },
      { path: 'details', component: ProviderDetailsGroupComponent, data: HDR_DETAILS },

      { path: 'workrequest/:tabId/:childId', component: ProviderWorkrequestGroupComponent, data: HDR_WORKREQUEST },
      { path: 'workrequest/:tabId', component: ProviderWorkrequestGroupComponent, data: HDR_WORKREQUEST },
      { path: 'workrequest', component: ProviderWorkrequestGroupComponent, data: HDR_WORKREQUEST },
      { path: 'workqueues/:queueId/:ticketId/:tabId/:workRequestItemId', component: ProviderWorkqueueGroupComponent, data: HDR_WORKQUEUE },
      { path: 'workqueues/:queueId/:ticketId/:tabId', component: ProviderWorkqueueGroupComponent, data: HDR_WORKQUEUE },
      { path: 'workqueues/:queueId/:ticketId', redirectTo: 'workqueues/:queueId/:ticketId/ticket', pathMatch: 'full' },
      { path: 'workqueues/:queueId', component: ProviderWorkqueueGroupComponent, data: HDR_WORKQUEUE },

      { path: 'workqueues', component: ProviderWorkqueueGroupComponent, data: HDR_WORKQUEUE },

      { path: 'catalogs', component: ProviderCatalogTabDashComponent, data: HDR_CATALOGS },
      { path: 'catalogs/:id', redirectTo: 'catalogs/:id/dash', pathMatch: 'full'  },
      { path: 'catalogs/:id/:tabId', component: ProviderCatalogGroupComponent, data: HDR_CATALOG },

      { path: 'experiences', component: ProviderExperiencesComponent, data: HDR_EXPERIENCES },

      // CatalogEntrySignupPacket routes
      { path: 'catalogentrysignuppackets/create', component: CatalogEntrySignupPacketGroupComponent, data: HDR_SIGNUPPACKETS },
      { path: 'catalogentrysignuppackets/:id/:tabId', component: CatalogEntrySignupPacketGroupComponent, data: HDR_SIGNUPPACKETS },
      { path: 'catalogentrysignuppackets/:id', redirectTo: 'catalogentrysignuppackets/:id/details', pathMatch: 'full' },
      { path: 'catalogentrysignuppackets', component: DashProviderSignupPacketsComponent, data: HDR_SIGNUPPACKETS },
     

      { path: 'e/:entityType/:entityId/:tabId/:childId/:childTabId', component: StdEntityUiComponent   },
      { path: 'e/:entityType/:entityId/:tabId/:childId', component: StdEntityUiComponent },
      { path: 'e/:entityType/:entityId/:tabId', component: StdEntityUiComponent },
      { path: 'e/:entityType/:entityId', component: StdEntityUiComponent },

    ]
  }
];
// { path: 'workrequests/:id', redirectTo: 'workrequests/:id/details', pathMatch: 'full' },
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DashProviderComponent,
    ProviderDashboardGroupComponent,
    ProviderDetailsGroupComponent,
    ProviderWorkrequestGroupComponent,
    ProviderCatalogGroupComponent,
    CatalogEntrySignupPacketListComponent,
    CatalogEntrySignupPacketGroupComponent,
    DashProviderMessagesComponent,
    DashProviderSignupPacketsComponent,
    ProviderExperiencesComponent
  ]
})
export class DashProviderModule { }
