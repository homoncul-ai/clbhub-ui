import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { CatalogEntryUiComponent } from '@app/components/_crud/catalogentry-ui/catalogentry-ui.component';

/**
 * Modal wrapper used by the Experience UI "Details" tab to pop up the
 * catalog entry associated with the experience.
 *
 * Uses the lightweight display catalogentry-ui (components/_crud/catalogentry-ui)
 * rather than the full editor to avoid a circular dependency
 * (catalogentry editor -> experience-ui -> this modal -> catalogentry editor).
 */
@Component({
  selector: 'app-experience-catalogentry-modal',
  standalone: true,
  imports: [CommonModule, CatalogEntryUiComponent],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">{{ title }}</h5>
      <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <app-catalogentry-ui *ngIf="catalogEntryId" [catalogEntryId]="catalogEntryId"></app-catalogentry-ui>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="closeModal()">Close</button>
    </div>
  `,
})
export class ExperienceCatalogEntryModalComponent implements OnInit {
  catalogEntryId: string = '';
  title: string = 'Catalog Entry Details';

  constructor(public modalRef: MdbModalRef<ExperienceCatalogEntryModalComponent>) {}

  ngOnInit(): void {
    const data = (this.modalRef as any).data;
    if (data) {
      this.catalogEntryId = data.catalogEntryId || '';
      this.title = data.title || 'Catalog Entry Details';
    }
  }

  closeModal(): void {
    this.modalRef.close();
  }
}
