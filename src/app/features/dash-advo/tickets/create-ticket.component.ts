import { Component, Input } from '@angular/core';
import { NewWorkRequestComponent } from '../../../components/new-work-request/new-work-request.component';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [NewWorkRequestComponent],
  template: `
    <div class="create-ticket-container">
      <app-new-work-request 
        [advocateUserProfileId]="advocateUserProfileId"
        [clientUserProfileId]="clientUserProfileId">
      </app-new-work-request>
    </div>
  `,
  styles: [`
    .create-ticket-container {
      padding: 20px;
    }
  `]
})
export class CreateTicketComponent {
  @Input() advocateUserProfileId?: string;
  @Input() clientUserProfileId?: string;
  
  // This component serves as a wrapper for the new-work-request component
  // It can be extended later with additional functionality if needed
} 