import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

// Components
import { DashNonprofitComponent } from './dash-nonprofit.component';
import { DashNonprofitHomeComponent } from './dash-nonprofit-home.component';

const routes: Routes = [
  {
    path: '',
    component: DashNonprofitComponent,
    children: [
      { path: 'home', component: DashNonprofitHomeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    // Standalone components
    DashNonprofitComponent,
    DashNonprofitHomeComponent,
  ],
  declarations: [
    // Non-standalone components would go here
  ]
})
export class DashNonprofitModule { 
  constructor() {
    console.log('DashNonprofitModule');
  }
}
