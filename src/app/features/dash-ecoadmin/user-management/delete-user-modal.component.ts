import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

/**
 * Destructive confirmation modal for "Delete User". Requires the admin to type
 * the user's username (businessCode) exactly to enable the delete button.
 * Closes with `true` on confirm, `false`/`null` otherwise.
 */
@Component({
  selector: 'app-delete-user-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './delete-user-modal.component.html',
})
export class DeleteUserModalComponent implements OnInit {
  username = '';
  displayName = '';
  typedConfirmation = '';

  constructor(public modalRef: MdbModalRef<DeleteUserModalComponent>) {}

  ngOnInit(): void {
    if (this.modalRef && (this.modalRef as any).data) {
      const data = (this.modalRef as any).data;
      this.username = data.username || '';
      this.displayName = data.displayName || this.username;
    }
  }

  get canDelete(): boolean {
    return (
      this.username.length > 0 && this.typedConfirmation.trim() === this.username
    );
  }

  onConfirm(): void {
    if (this.canDelete) {
      this.modalRef.close(true);
    }
  }

  onCancel(): void {
    this.modalRef.close(false);
  }
}
