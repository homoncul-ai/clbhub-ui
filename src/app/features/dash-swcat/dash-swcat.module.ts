import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';

// Import components
import { DashSwcatComponent } from './dash-swcat.component';
import { DashSwcatHomeGroupComponent } from './dash-swcat-home-group.component';
import { DashSwcatAssetsGroupComponent } from './dash-swcat-assets-group.component';
import { DashSwcatTrutestaGroupComponent } from './dash-swcat-trutesta-group.component';
import { DashSwcatSematreeGroupComponent } from './dash-swcat-sematree-group.component';
import { DashSwcatAssetsTabOverviewComponent } from './dash-swcat-assets-tab-overview.component';
import { DashSwcatAssetsTabGraphsComponent } from './dash-swcat-assets-tab-graphs.component';
import { DashSwcatAssetsTabContractsComponent } from './dash-swcat-assets-tab-contracts.component';
import { DashSwcatTrutestaTabOverviewComponent } from './dash-swcat-trutesta-tab-overview.component';
import { DashSwcatTrutestaTabUsageComponent } from './dash-swcat-trutesta-tab-usage.component';
import { DashSwcatTrutestaTabUsageorgComponent } from './dash-swcat-trutesta-tab-usageorg.component';
import { DashSwcatSematreeTabOverviewComponent } from './dash-swcat-sematree-tab-overview.component';
import { DashSwcatSematreeTabUsageComponent } from './dash-swcat-sematree-tab-usage.component';
import { SwcatEntryModalComponent } from './modals/swcat-entry-modal.component';
import { SwcatEntryCrudComponent } from './modals/swcatentry-crud.component';

const routes: Routes = [
  {
    path: '',
    component: DashSwcatComponent,
    children: [
      { path: 'home', component: DashSwcatHomeGroupComponent },
      { path: 'home/:tabId', component: DashSwcatHomeGroupComponent },
      { path: 'home/:tabId/:childId', component: DashSwcatHomeGroupComponent },
      
      { path: 'assets', component: DashSwcatAssetsGroupComponent },
      { path: 'assets/:tabId', component: DashSwcatAssetsGroupComponent },
      { path: 'assets/:tabId/:childId', component: DashSwcatAssetsGroupComponent },
      
      { path: 'trutesta', component: DashSwcatTrutestaGroupComponent },
      { path: 'trutesta/:tabId', component: DashSwcatTrutestaGroupComponent },
      { path: 'trutesta/:tabId/:childId', component: DashSwcatTrutestaGroupComponent },
      
      { path: 'sematree', component: DashSwcatSematreeGroupComponent },
      { path: 'sematree/:tabId', component: DashSwcatSematreeGroupComponent },
      { path: 'sematree/:tabId/:childId', component: DashSwcatSematreeGroupComponent },
      
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
    DashSwcatComponent,
    DashSwcatHomeGroupComponent,
    DashSwcatAssetsGroupComponent,
    DashSwcatTrutestaGroupComponent,
    DashSwcatSematreeGroupComponent,
    DashSwcatAssetsTabOverviewComponent,
    DashSwcatAssetsTabGraphsComponent,
    DashSwcatAssetsTabContractsComponent,
    DashSwcatTrutestaTabOverviewComponent,
    DashSwcatTrutestaTabUsageComponent,
    DashSwcatTrutestaTabUsageorgComponent,
    DashSwcatSematreeTabOverviewComponent,
    DashSwcatSematreeTabUsageComponent,
    SwcatEntryModalComponent,
    SwcatEntryCrudComponent,
  ],
  declarations: [
    // Non-standalone components would go here
  ]
})
export class DashSwcatModule { }
