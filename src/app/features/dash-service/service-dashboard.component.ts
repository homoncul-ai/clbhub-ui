import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-service-dashboard',
  template: `
    <div class="container-fluid">
      <router-outlet></router-outlet>
    </div>
  `,
  standalone: true,
  imports: [RouterModule]
})
export class ServiceDashboardComponent {} 