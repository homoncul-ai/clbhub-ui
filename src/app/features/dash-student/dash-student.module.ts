import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

// Components
import { DashStudentComponent } from './dash-student.component';
import { DashStudentHomeComponent } from './dash-student-home.component';
import { DashStudentCoursesComponent } from './dash-student-courses.component';
import { DashStudentProgressComponent } from './dash-student-progress.component';
import { DashStudentScheduleComponent } from './dash-student-schedule.component';

const routes: Routes = [
  {
    path: '',
    component: DashStudentComponent,
    children: [
      { path: 'home', component: DashStudentHomeComponent },
      { path: 'courses', component: DashStudentCoursesComponent },
      { path: 'progress', component: DashStudentProgressComponent },
      { path: 'schedule', component: DashStudentScheduleComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    // Standalone components
    DashStudentComponent,
    DashStudentHomeComponent,
    DashStudentCoursesComponent,
    DashStudentProgressComponent,
    DashStudentScheduleComponent,
  ],
  declarations: [
    // Non-standalone components would go here
  ]
})
export class DashStudentModule { 
  constructor() {
    console.log('DashStudentModule');
  }
}
