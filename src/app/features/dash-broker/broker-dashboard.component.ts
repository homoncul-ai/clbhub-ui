import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-broker-dashboard',
  template: `
    <div class="container-fluid">
      <router-outlet></router-outlet>
    </div>
  `,
  standalone: true,
  imports: [RouterModule]
})
export class BrokerDashboardComponent {}
