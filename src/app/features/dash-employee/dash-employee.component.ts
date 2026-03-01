import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dash-employee',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="employee-dashboard">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .employee-dashboard {
      min-height: 100vh;
      background-color: #f8f9fa;
    }
  `]
})
export class DashEmployeeComponent {
  constructor() {
    console.log('DashEmployeeComponent initialized');
  }
}
