import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewWorkRequestComponent } from '../../../components/new-work-request/new-work-request.component';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [NewWorkRequestComponent],
  template: `
    <div class="create-ticket-container">
      <!-- Debug information -->
      <div class="debug-info" style="background-color: #f0f0f0; padding: 10px; margin-bottom: 20px; border: 1px solid #ccc; border-radius: 4px;">
        <h4>Debug Information:</h4>
        <p><strong>advocateUserProfileId:</strong> {{ advocateUserProfileId || 'undefined' }}</p>
        <p><strong>clientUserProfileId:</strong> {{ clientUserProfileId || 'undefined' }}</p>
      </div>
      
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
    
    .debug-info {
      font-family: monospace;
      font-size: 14px;
    }
  `]
})
export class CreateTicketComponent implements OnInit {
  @Input() advocateUserProfileId?: string;
  @Input() clientUserProfileId?: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.advocateUserProfileId = this.route.snapshot.paramMap.get('advocateId') || undefined;
    this.clientUserProfileId = this.route.snapshot.paramMap.get('clientId') || undefined;
  }

  // This component serves as a wrapper for the new-work-request component
  // It can be extended later with additional functionality if needed
} 