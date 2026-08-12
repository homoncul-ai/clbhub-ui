import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dash-citizen',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="citizen">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .citizen {
      min-height: 100vh;
      background-color: #f8f9fa;
    }
  `]
})
export class DashCitizenComponent {
  constructor() {
    console.log('DashCitizenComponent initialized');
  }
}
