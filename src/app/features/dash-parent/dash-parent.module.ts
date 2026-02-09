import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

// Components
import { DashParentComponent } from './dash-parent.component';
import { DashParentHomeComponent } from './dash-parent-home.component';
import { StdEntityUiComponent } from '@app/components/_global/std-entity-ui/std-entity-ui.component';

const routes: Routes = [
  {
    path: '',
    component: DashParentComponent,
    children: [
      { path: 'home', component: DashParentHomeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      { path: 'e/:entityType/:entityId/:tabId/:childId/:childTabId', component: StdEntityUiComponent   },
      { path: 'e/:entityType/:entityId/:tabId/:childId', component: StdEntityUiComponent },
      { path: 'e/:entityType/:entityId/:tabId', component: StdEntityUiComponent },
      { path: 'e/:entityType/:entityId', component: StdEntityUiComponent },
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
