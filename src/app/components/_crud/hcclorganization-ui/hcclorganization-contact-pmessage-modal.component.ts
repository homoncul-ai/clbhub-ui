import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { PMessageUiComponent } from '@app/components/_crud/pmessage-ui/pmessage-ui.component';

@Component({
  selector: 'app-hcclorganization-contact-pmessage-modal',
  standalone: true,
  imports: [CommonModule, PMessageUiComponent],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">{{ title }}</h5>
      <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <app-pmessage-ui *ngIf="messageId" [id]="messageId"></app-pmessage-ui>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="closeModal()">Close</button>
    </div>
  `,
})
export class HcclOrganizationContactPmessageModalComponent implements OnInit {
  messageId: string = '';
  title: string = 'Message';

  constructor(public modalRef: MdbModalRef<HcclOrganizationContactPmessageModalComponent>) {}

  ngOnInit(): void {
    const data = (this.modalRef as any).data;
    if (data) {
      this.messageId = data.messageId || '';
      this.title = data.title || 'Message';
    }
  }

  closeModal(): void {
    this.modalRef.close();
  }
}
