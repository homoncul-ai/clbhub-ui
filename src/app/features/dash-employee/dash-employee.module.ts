import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

// Components
import { DashEmployeeComponent } from './dash-employee.component';
import { DashEmployeeHomeComponent } from './dash-employee-home.component';

const routes: Routes = [
  {
    path: '',
    component: DashEmployeeComponent,
    children: [
      { path: 'home', component: DashEmployeeHomeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    // Standalone components
    DashEmployeeComponent,
    DashEmployeeHomeComponent,
  ],
  declarations: [
    // Non-standalone components would go here
  ]
})
export class DashEmployeeModule {
  constructor() {
    console.log('DashEmployeeModule');
  }
}
