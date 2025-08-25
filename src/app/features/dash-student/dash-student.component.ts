import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dash-student',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="student-dashboard">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .student-dashboard {
      min-height: 100vh;
      background-color: #f8f9fa;
    }
  `]
})
export class DashStudentComponent {
  constructor() {
    console.log('DashStudentComponent initialized');
  }
}
