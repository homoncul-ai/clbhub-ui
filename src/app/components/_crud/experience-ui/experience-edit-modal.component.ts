import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { CatalogEntryGETData } from '@app/restsvc/hccl.service';
import { ExperienceEditComponent } from './experience-edit.component';

/**
 * Modal wrapper that hosts the editable experience form.
 * Closes with `true` once a save completes so the opener can refresh.
 */
@Component({
  selector: 'app-experience-edit-modal',
  standalone: true,
  imports: [CommonModule, ExperienceEditComponent],
  template: `
    <div class="modal-header">
      <h5 class="modal-title"><i class="fas fa-pen me-2"></i>{{ title }}</h5>
      <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <app-experience-edit
        *ngIf="experienceId"
        [experienceId]="experienceId"
        [catalogEntry]="catalogEntry"
        (saved)="onSaved()">
      </app-experience-edit>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="closeModal()">Close</button>
    </div>
  `,
})
export class ExperienceEditModalComponent implements OnInit {
  experienceId: string = '';
  catalogEntry: CatalogEntryGETData | null = null;
  title: string = 'Edit Experience';

  private didSave = false;

  constructor(public modalRef: MdbModalRef<ExperienceEditModalComponent>) {}

  ngOnInit(): void {
    const data = (this.modalRef as any).data;
    if (data) {
      this.experienceId = data.experienceId || '';
      this.catalogEntry = data.catalogEntry || null;
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
