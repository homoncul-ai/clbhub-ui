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

const routes: Routes = [
  {
    path: '',
    component: DashProviderComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard/:tabId', component: ProviderDashboardGroupComponent },
      { path: 'dashboard', component: ProviderDashboardGroupComponent },
      { path: 'details/:tabId/:childId', component: ProviderDetailsGroupComponent },
      { path: 'details/:tabId', component: ProviderDetailsGroupComponent },
      { path: 'details', component: ProviderDetailsGroupComponent },

      { path: 'workrequest/:tabId/:childId', component: ProviderWorkrequestGroupComponent },
      { path: 'workrequest/:tabId', component: ProviderWorkrequestGroupComponent },
      { path: 'workrequest', component: ProviderWorkrequestGroupComponent },
      { path: 'workqueues/:queueId/:ticketId/:tabId/:workRequestItemId', component: ProviderWorkqueueGroupComponent },
      { path: 'workqueues/:queueId/:ticketId/:tabId', component: ProviderWorkqueueGroupComponent },
      { path: 'workqueues/:queueId/:ticketId', redirectTo: 'workqueues/:queueId/:ticketId/ticket', pathMatch: 'full' },
      { path: 'workqueues/:queueId', component: ProviderWorkqueueGroupComponent },

      { path: 'workqueues', component: ProviderWorkqueueGroupComponent },

      { path: 'catalogs', component: ProviderCatalogTabDashComponent },
      { path: 'catalogs/:id', redirectTo: 'catalogs/:id/dash', pathMatch: 'full'  },
      { path: 'catalogs/:id/:tabId', component: ProviderCatalogGroupComponent },

      // CatalogEntrySignupPacket routes
      { path: 'catalogentrysignuppackets/create', component: CatalogEntrySignupPacketGroupComponent },
      { path: 'catalogentrysignuppackets/:id/:tabId', component: CatalogEntrySignupPacketGroupComponent },
      { path: 'catalogentrysignuppackets/:id', redirectTo: 'catalogentrysignuppackets/:id/details', pathMatch: 'full' },
      { path: 'catalogentrysignuppackets', component: CatalogEntrySignupPacketListComponent },
     


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
    CatalogEntrySignupPacketGroupComponent
  ]
})
export class DashProviderModule { }
