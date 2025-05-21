import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dash-service',
  template: `
    <div class="container-fluid">
      <router-outlet></router-outlet>
    </div>
  `,
  standalone: true,
  imports: [RouterModule]
})
export class DashServiceComponent {}
