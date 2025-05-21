import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

// Components
import { DashServiceComponent } from './dash-service.component';




import { ServiceOverviewComponent } from './overview/service-overview.component';
import { ServiceRequestDetailsComponent } from './requests/service-request-details.component';
import { ServiceRequestListComponent } from './requests/service-request-list.component';
import { ServiceDetailsComponent } from './services/service-details.component';
import { ServiceListComponent } from './services/service-list.component';

const routes: Routes = [
  {
    path: '',
    component: DashServiceComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: ServiceOverviewComponent },
      { path: 'services', component: ServiceListComponent },
      { path: 'services/:id', component: ServiceDetailsComponent },
      { path: 'requests', component: ServiceRequestListComponent },
      { path: 'requests/:id', component: ServiceRequestDetailsComponent }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DashServiceComponent,
    ServiceOverviewComponent,
    ServiceListComponent,
    ServiceDetailsComponent,
    ServiceRequestListComponent,
    ServiceRequestDetailsComponent
  ]
})
export class DashServiceModule { } 