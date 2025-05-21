import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

// Components
import { DashBrokerComponent } from './dash-broker.component';
import { BrokerOverviewComponent } from './overview/broker-overview.component';
import { BrokerClientListComponent } from './clients/broker-client-list.component';



import { BrokerClientDetailsComponent } from './clients/broker-client-details.component';
import { BrokerAgreementListComponent } from './agreements/broker-agreement-list.component';
import { BrokerAgreementDetailsComponent } from './agreements/broker-agreement-details.component';

const routes: Routes = [
  {
    path: '',
    component: DashBrokerComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: BrokerOverviewComponent },
      { path: 'clients', component: BrokerClientListComponent },
      { path: 'clients/:id', component: BrokerClientDetailsComponent },
      { path: 'agreements', component: BrokerAgreementListComponent },
      { path: 'agreements/:id', component: BrokerAgreementDetailsComponent }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DashBrokerComponent,
    BrokerOverviewComponent,
    BrokerClientListComponent,
    BrokerClientDetailsComponent,
    BrokerAgreementListComponent,
    BrokerAgreementDetailsComponent
  ]
})
export class DashBrokerModule { } 