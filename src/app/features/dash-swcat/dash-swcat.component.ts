import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dash-swcat',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="swcat-dashboard">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .swcat-dashboard {
      min-height: 100vh;
      background-color: #f8f9fa;
    }
  `]
})
export class DashSwcatComponent {
  constructor() {
    console.log('DashSwcatComponent initialized');
  }
}
