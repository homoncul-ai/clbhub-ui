import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dash-student-my-participation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <h1>My Participation</h1>
        </div>
      </div>
    </div>
  `,
})
export class DashStudentMyParticipationComponent {}
