import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dash-parent',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="parent-dashboard">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .parent-dashboard {
      min-height: 100vh;
      background-color: #f8f9fa;
    }
  `]
})
export class DashParentComponent {
  constructor() {
    console.log('DashParentComponent initialized');
  }
}
