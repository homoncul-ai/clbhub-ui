import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-integrations-home',
  template: `
    <!-- <div class="integrations-container">
      <h2>Integrations</h2>
      <router-outlet></router-outlet>
    </div> -->
    <router-outlet></router-outlet>
    `,
  styles: [`
    .integrations-container {
      margin: 16px;
      padding: 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
    }
    h2 {
      margin: 0 0 16px 0;
      color: #333;
    }
    p {
      color: #666;
      margin-bottom: 20px;
    }
  `],
  standalone: true,
  imports: [CommonModule, RouterOutlet]
})
export class IntegrationsHomeComponent {
  constructor() {}
} 