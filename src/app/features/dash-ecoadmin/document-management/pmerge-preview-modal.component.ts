import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { StdMarkdownDisplayComponent } from '@app/components/_global/std-markdown-display/std-markdown-display.component';

/**
 * Read-only preview of a merge run against sample/default context.
 */
@Component({
  selector: 'app-pmerge-preview-modal',
  standalone: true,
  imports: [CommonModule, StdMarkdownDisplayComponent],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">
        <i class="fas fa-eye me-2"></i>{{ title }}
      </h5>
      <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <div *ngIf="errorText" class="alert alert-danger" role="alert">
        <i class="fas fa-exclamation-triangle me-2"></i>
        {{ errorText }}
      </div>
      <div *ngIf="subject" class="mb-3 text-muted">
        <strong>Subject:</strong> {{ subject }}
      </div>
      <div *ngIf="fileName" class="mb-3 text-muted">
        <strong>File name:</strong> {{ fileName }}
      </div>
      <app-std-markdown-display
        *ngIf="contents"
        [markdown]="contents"
        dialect="common"
        modeName="display">
      </app-std-markdown-display>
      <p *ngIf="!contents && !errorText" class="text-muted mb-0">No merged content returned.</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="closeModal()">Close</button>
    </div>
  `,
})
export class PMergePreviewModalComponent implements OnInit {
  title = 'Preview with defaults';
  contents = '';
  subject = '';
  fileName = '';
  errorText = '';

  constructor(public modalRef: MdbModalRef<PMergePreviewModalComponent>) {}

  ngOnInit(): void {
    const data = (this.modalRef as any).data;
    if (data) {
      this.title = data.title || this.title;
      this.contents = data.contents || '';
      this.subject = data.subject || '';
      this.fileName = data.fileName || '';
      this.errorText = data.errorText || '';
    }
  }

  closeModal(): void {
    this.modalRef.close();
  }
}
