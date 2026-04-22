import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-hcclorganization-contact-message-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">Send Message</h5>
      <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <p class="text-muted">Message composition coming soon.</p>
      <p *ngIf="userProfileId"><small>Contact profile: {{ userProfileId }}</small></p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="closeModal()">Close</button>
    </div>
  `,
})
export class HcclOrganizationContactMessageModalComponent implements OnInit {
  userProfileId: string = '';

  constructor(public modalRef: MdbModalRef<HcclOrganizationContactMessageModalComponent>) {}

  ngOnInit(): void {
    const data = (this.modalRef as any).data;
    if (data) {
      this.userProfileId = data.userProfileId || '';
    }
  }

  closeModal(): void {
    this.modalRef.close();
  }
}
