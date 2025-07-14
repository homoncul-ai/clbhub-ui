import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dash-ecoadmin',
  template: `
    <div class="container-fluid">
      <router-outlet></router-outlet>
    </div>
  `,
  standalone: true,
  imports: [RouterModule]
})
export class DashEcoAdminComponent {} 