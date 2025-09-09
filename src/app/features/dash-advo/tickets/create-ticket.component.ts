import { Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { GuidanceTicketModalComponent } from '../../dash-student/guidance-ticket-modal.component';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [],
  template: `
    <div class="create-ticket-container">
      <!-- Debug information 
      <div class="debug-info" style="background-color: #f0f0f0; padding: 10px; margin-bottom: 20px; border: 1px solid #ccc; border-radius: 4px;">
        <h4>Debug Information:</h4>
        <p><strong>advocateUserProfileId:</strong> {{ advocateUserProfileId || 'undefined' }}</p>
        <p><strong>clientUserProfileId:</strong> {{ clientUserProfileId || 'undefined' }}</p>
      </div>
	  -->
      
      <div class="d-flex justify-content-center align-items-center" style="min-height: 200px;">
        <button 
          type="button" 
          class="btn btn-primary btn-lg"
          (click)="openGuidanceTicketModal()">
          <i class="fas fa-life-ring me-2"></i>
          Request Help from Guidance
        </button>
      </div>
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

  // Inject modal service
  private modalService = inject(MdbModalService);

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.advocateUserProfileId = this.route.snapshot.paramMap.get('advocateId') || undefined;
    this.clientUserProfileId = this.route.snapshot.paramMap.get('clientId') || undefined;
  }

  /**
   * Open the guidance ticket modal
   */
  openGuidanceTicketModal(): void {
    const modalData = {
      userProfileId: this.clientUserProfileId || this.advocateUserProfileId || '',
      // Pass any additional data needed for the modal
    };

    const modalRef: MdbModalRef<GuidanceTicketModalComponent> = this.modalService.open(
      GuidanceTicketModalComponent,
      {
        data: modalData,
        modalClass: 'modal-lg',
        backdrop: true,
        keyboard: true,
        ignoreBackdropClick: false
      }
    );

    // Handle modal result
    modalRef.onClose.subscribe((result) => {
      if (result) {
        console.log('Modal closed with result:', result);
        if (result.success) {
          // Handle successful ticket creation
          console.log('Guidance ticket created successfully:', result.ticketId);
          // You can add additional success handling here (e.g., show toast notification)
        }
      } else {
        console.log('Modal closed without result');
      }
    });
  }
} 