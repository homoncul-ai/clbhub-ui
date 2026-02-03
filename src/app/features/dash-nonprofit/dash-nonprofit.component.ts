import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dash-nonprofit',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="nonprofit-dashboard">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .nonprofit-dashboard {
      min-height: 100vh;
      background-color: #f8f9fa;
    }
  `]
})
export class DashNonprofitComponent {
  constructor() {
    console.log('DashNonprofitComponent initialized');
  }
}
