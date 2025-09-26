import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';

// Import components
import { DashSwcatComponent } from './dash-swcat.component';
import { DashSwcatHomeGroupComponent } from './dash-swcat-home-group.component';

const routes: Routes = [
  {
    path: '',
    component: DashSwcatComponent,
    children: [
      { path: 'home', component: DashSwcatHomeGroupComponent },
      { path: 'home/:tabId', component: DashSwcatHomeGroupComponent },
      { path: 'home/:tabId/:childId', component: DashSwcatHomeGroupComponent },
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
  ],
  declarations: [
    // Non-standalone components would go here
  ]
})
export class DashSwcatModule { }
