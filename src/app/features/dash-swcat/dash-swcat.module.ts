import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';

// Import components
import { DashSwcatComponent } from './dash-swcat.component';
import { DashSwcatHomeComponent } from './dash-swcat-home.component';

const routes: Routes = [
  {
    path: '',
    component: DashSwcatComponent,
    children: [
      { path: 'home', component: DashSwcatHomeComponent },
      { path: 'home/:tabId', component: DashSwcatHomeComponent },
      { path: 'home/:tabId/:childId', component: DashSwcatHomeComponent },
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
    DashSwcatHomeComponent,
  ],
  declarations: [
    // Non-standalone components would go here
  ]
})
export class DashSwcatModule { }
