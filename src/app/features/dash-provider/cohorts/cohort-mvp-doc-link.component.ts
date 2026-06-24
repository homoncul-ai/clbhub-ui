import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbModalModule, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { getCohortMvpDoc } from './cohort-mvp-documentation';
import { CohortMvpDocModalComponent } from './cohort-mvp-doc-modal.component';

@Component({
  selector: 'app-cohort-mvp-doc-link',
  standalone: true,
  imports: [CommonModule, MdbModalModule],
  template: `
    <button
      type="button"
      class="btn btn-link btn-sm cohort-mvp-doc-link p-0 align-baseline"
      [title]="tooltip"
      (click)="openDoc($event)">
      <i class="fas fa-book-open"></i>
    </button>
  `,
  styles: [`
    .cohort-mvp-doc-link {
      color: #3f7446;
      text-decoration: none;
      line-height: 1;
      vertical-align: middle;
    }
    .cohort-mvp-doc-link:hover {
      color: #2d5533;
    }
  `],
})
export class CohortMvpDocLinkComponent {
  @Input({ required: true }) docId = '';
  @Input() label = '';

  private modalService = inject(MdbModalService);

  get tooltip(): string {
    const doc = getCohortMvpDoc(this.docId);
    if (!doc) {
      return 'View feature documentation';
    }
    const prefix = this.label ? `${this.label} — ` : '';
    return `${prefix}${doc.title}: click for explanation`;
  }

  openDoc(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const doc = getCohortMvpDoc(this.docId);
    if (!doc) {
      return;
    }

    this.modalService.open(CohortMvpDocModalComponent, {
      modalClass: 'modal-lg modal-dialog-scrollable modal-dialog-centered',
      data: {
        doc,
        docId: this.docId,
        contextLabel: this.label?.trim() || '',
      },
    });
  }
}
