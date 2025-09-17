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

const routes: Routes = [
  {
    path: '',
    component: DashProviderComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: ProviderDashboardGroupComponent },
      { path: 'details/:tabId/:childId', component: ProviderDetailsGroupComponent },
      { path: 'details/:tabId', component: ProviderDetailsGroupComponent },
      { path: 'details', component: ProviderDetailsGroupComponent },
      { path: 'workrequest/:tabId/:childId', component: ProviderWorkrequestGroupComponent },
      { path: 'workrequest/:tabId', component: ProviderWorkrequestGroupComponent },
      { path: 'workrequest', component: ProviderWorkrequestGroupComponent },
      { path: 'catalog/:tabId/:childId', component: ProviderCatalogGroupComponent },
      { path: 'catalog/:tabId', component: ProviderCatalogGroupComponent },
      { path: 'catalog', component: ProviderCatalogGroupComponent },
     
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DashProviderComponent,
    ProviderDashboardGroupComponent,
    ProviderDetailsGroupComponent,
    ProviderWorkrequestGroupComponent,
    ProviderCatalogGroupComponent
  ]
})
export class DashProviderModule { }
