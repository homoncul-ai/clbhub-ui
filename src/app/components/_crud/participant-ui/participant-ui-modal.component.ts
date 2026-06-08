import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { ParticipantUiComponent } from './participant-ui.component';

@Component({
  selector: 'app-participant-ui-modal',
  standalone: true,
  imports: [CommonModule, ParticipantUiComponent],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">{{ title }}</h5>
      <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <app-participant-ui *ngIf="participantId" [participantId]="participantId"></app-participant-ui>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="closeModal()">Close</button>
    </div>
  `,
})
export class ParticipantUiModalComponent implements OnInit {
  participantId: string = '';
  title: string = 'Participant Details';

  constructor(public modalRef: MdbModalRef<ParticipantUiModalComponent>) {}

  ngOnInit(): void {
    const data = (this.modalRef as any).data;
    if (data) {
      this.participantId = data.participantId || '';
      this.title = data.title || 'Participant Details';
    }
  }

  closeModal(): void {
    this.modalRef.close();
  }
}
