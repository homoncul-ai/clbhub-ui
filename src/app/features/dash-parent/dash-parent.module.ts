import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

// Components
import { DashParentComponent } from './dash-parent.component';
import { DashParentHomeComponent } from './dash-parent-home.component';

const routes: Routes = [
  {
    path: '',
    component: DashParentComponent,
    children: [
      { path: 'home', component: DashParentHomeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    // Standalone components
    DashParentComponent,
    DashParentHomeComponent,
  ],
  declarations: [
    // Non-standalone components would go here
  ]
})
export class DashParentModule { 
  constructor() {
    console.log('DashParentModule');
  }
}
