import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { SignupPacketEditComponent } from './signuppacket-edit.component';

/**
 * Modal wrapper that hosts the editable signup packet form.
 * Closes with `true` once a save completes so the opener can refresh.
 */
@Component({
  selector: 'app-signuppacket-edit-modal',
  standalone: true,
  imports: [CommonModule, SignupPacketEditComponent],
  template: `
    <div class="modal-header">
      <h5 class="modal-title"><i class="fas fa-pen me-2"></i>{{ title }}</h5>
      <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <app-signuppacket-edit
        *ngIf="id"
        [id]="id"
        (saved)="onSaved()">
      </app-signuppacket-edit>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="closeModal()">Close</button>
    </div>
  `,
})
export class SignupPacketEditModalComponent implements OnInit {
  id: string = '';
  title: string = 'Edit Signup Packet';

  private didSave = false;

  constructor(public modalRef: MdbModalRef<SignupPacketEditModalComponent>) {}

  ngOnInit(): void {
    const data = (this.modalRef as any).data;
    if (data) {
      this.id = data.id || '';
      this.title = data.title || this.title;
    }
  }

  onSaved(): void {
    this.didSave = true;
  }

  closeModal(): void {
    this.modalRef.close(this.didSave);
  }
}
