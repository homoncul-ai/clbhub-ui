import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { StdMarkdownDisplayComponent } from '@app/components/_global/std-markdown-display/std-markdown-display.component';
import { getCohortMvpDocExplanation, CohortMvpDocSection } from './cohort-mvp-documentation';

@Component({
  selector: 'app-cohort-mvp-doc-modal',
  standalone: true,
  imports: [CommonModule, StdMarkdownDisplayComponent],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">
        <i class="fas fa-book-open me-2"></i>
        {{ modalHeading }}
      </h5>
      <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
    </div>
    <div class="modal-body cohort-mvp-doc-body">
      <div class="cohort-mvp-doc-meta mb-3">
        <span class="badge bg-secondary me-2">MVP §{{ doc?.sectionNumber }}</span>
        <span class="badge bg-light text-dark" *ngIf="contextLabel">{{ contextLabel }}</span>
      </div>

      <div class="cohort-mvp-doc-explanation mb-4" *ngIf="explanation">
        <h6 class="explanation-heading">{{ explanationHeading }}</h6>
        <p class="explanation-text mb-0">{{ explanation }}</p>
      </div>

      <div class="cohort-mvp-doc-requirements">
        <h6 class="requirements-heading">MVP requirements</h6>
        <app-std-markdown-display
          *ngIf="requirementsMarkdown"
          [markdown]="requirementsMarkdown"
          maxHeight="45vh">
        </app-std-markdown-display>
      </div>

      <p class="cohort-mvp-doc-source text-muted small mt-3 mb-0">
        Source: CLB Hub cohort MVP spec
      </p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="closeModal()">Close</button>
    </div>
  `,
  styles: [`
    .cohort-mvp-doc-body {
      padding: 1.25rem 1.5rem;
    }
    .modal-title {
      font-weight: 600;
    }
    .cohort-mvp-doc-explanation {
      background: #f0f7f1;
      border: 1px solid #c8dcc9;
      border-radius: 8px;
      padding: 1rem 1.15rem;
    }
    .explanation-heading {
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #3f7446;
      margin-bottom: 0.5rem;
    }
    .explanation-text {
      font-size: 0.95rem;
      line-height: 1.55;
      color: #1f2937;
    }
    .requirements-heading {
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #6b7280;
      margin-bottom: 0.75rem;
    }
    .cohort-mvp-doc-source {
      border-top: 1px solid #e5e7eb;
      padding-top: 0.75rem;
    }
  `],
})
export class CohortMvpDocModalComponent implements OnInit {
  doc: CohortMvpDocSection | null = null;
  contextLabel = '';
  explanation = '';
  requirementsMarkdown = '';

  constructor(public modalRef: MdbModalRef<CohortMvpDocModalComponent>) {}

  get modalHeading(): string {
    if (this.contextLabel && this.doc) {
      return `${this.doc.title} — ${this.contextLabel}`;
    }
    return this.doc?.title ?? 'Feature documentation';
  }

  get explanationHeading(): string {
    if (this.contextLabel && this.doc?.contexts?.[this.contextLabel]) {
      return `What “${this.contextLabel}” means`;
    }
    return 'What this feature is';
  }

  ngOnInit(): void {
    const data = (this.modalRef as MdbModalRef<CohortMvpDocModalComponent> & {
      data?: { doc?: CohortMvpDocSection; contextLabel?: string };
    }).data;

    this.doc = data?.doc ?? null;
    this.contextLabel = data?.contextLabel?.trim() ?? '';

    if (this.doc) {
      this.explanation = getCohortMvpDocExplanation(this.doc.id, this.contextLabel || undefined);
      this.requirementsMarkdown = this.stripRequirementsHeading(this.doc.markdown);
    }
  }

  /** The markdown field already includes a heading; strip it for the requirements sub-section. */
  private stripRequirementsHeading(markdown: string): string {
    return markdown.replace(/^\*\*MVP requirements\*\*\s*/i, '').trim();
  }

  closeModal(): void {
    this.modalRef.close();
  }
}
