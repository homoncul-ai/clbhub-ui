import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { FeedEntryGETData, FeedEntryInstanceGETData } from '@app/restsvc/hccl.service';
import { StdMarkdownDisplayComponent } from '@app/components/_global/std-markdown-display/std-markdown-display.component';
import { CatalogEntryUiComponent } from '@app/components/_crud/catalogentry/catalogentry-ui.component';

export interface FeedListingDetailsModalData {
  feedEntry?: FeedEntryGETData;
  feedInstance?: FeedEntryInstanceGETData;
}

@Component({
  selector: 'app-feed-listing-details-modal',
  standalone: true,
  imports: [CommonModule, StdMarkdownDisplayComponent, CatalogEntryUiComponent],
  template: `
    <div class="feed-details-modal">
      <div class="feed-details-header">
        <div class="feed-details-heading">
          <h4 class="feed-details-title">{{ feedEntry?.title || 'Listing details' }}</h4>
          <p class="feed-details-org" *ngIf="feedEntry?.postedByEntityName">
            {{ feedEntry?.postedByEntityName }}
            <span *ngIf="feedEntry?.postedByEntityExtra"> · {{ feedEntry?.postedByEntityExtra }}</span>
          </p>
        </div>
        <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
      </div>

      <div class="feed-details-body">
        <div class="feed-details-meta" *ngIf="hasMeta">
          <span class="meta-chip" *ngIf="feedEntry?.feedSubTypeCode">
            {{ feedEntry?.feedSubTypeCode | uppercase }}
          </span>
          <span class="meta-chip" *ngIf="feedEntry?.subjectEntityName">
            {{ feedEntry?.subjectEntityName }}
          </span>
          <span class="meta-chip" *ngIf="feedInstance?.score != null">
            Score: {{ feedInstance?.score }}
          </span>
        </div>

        <div class="feed-details-section" *ngIf="sourceUrl">
          <h6>Source</h6>
          <p class="mb-0">
            <span class="text-muted">Source Url:</span>
            <a [href]="sourceUrl" target="_blank" rel="noreferrer">{{ sourceUrl }}</a>
          </p>
        </div>

        <div class="feed-details-section" *ngIf="feedEntry?.mdContents">
          <h6>Description</h6>
          <app-std-markdown-display
            [markdown]="combinedMarkdown"
            modeName="display"
            dialect="common">
          </app-std-markdown-display>
        </div>

        <div class="feed-details-section" *ngIf="feedInstance?.calcReasonJson">
          <h6>Match details</h6>
          <pre class="calc-reason-json">{{ feedInstance?.calcReasonJson }}</pre>
        </div>

        <div class="feed-details-section" *ngIf="feedEntry?.subjectEntityId">
          <h6>Catalog entry</h6>
          <app-catalogentry-ui
            [id]="feedEntry!.subjectEntityId!"
            [readonly]="true">
          </app-catalogentry-ui>
        </div>

        <div class="feed-details-section feed-details-placeholder" *ngIf="!feedEntry?.mdContents && !feedEntry?.subjectEntityId">
          <p class="text-muted mb-0">Full listing details will appear here as the feed card matures.</p>
        </div>
      </div>

      <div class="feed-details-footer">
        <button type="button" class="btn btn-secondary" (click)="closeModal()">Close</button>
      </div>
    </div>
  `,
  styles: [`
    .feed-details-modal {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: #fff;
    }

    .feed-details-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      padding: 20px 24px;
      border-bottom: 1px solid rgba(148, 163, 184, 0.25);
      flex-shrink: 0;
    }

    .feed-details-heading {
      min-width: 0;
    }

    .feed-details-title {
      margin: 0 0 6px;
      font-size: 1.35rem;
      font-weight: 700;
      color: #0f172a;
    }

    .feed-details-org {
      margin: 0;
      color: #64748b;
      font-size: 0.875rem;
    }

    .feed-details-body {
      flex: 1;
      overflow: auto;
      padding: 20px 24px 32px;
    }

    .feed-details-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 20px;
    }

    .meta-chip {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 999px;
      background: #f1f5f9;
      color: #334155;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    .feed-details-section {
      margin-bottom: 24px;
    }

    .feed-details-section h6 {
      margin: 0 0 10px;
      font-size: 0.8rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: #64748b;
    }

    .calc-reason-json {
      margin: 0;
      padding: 12px;
      border-radius: 10px;
      background: #f8fafc;
      border: 1px solid rgba(148, 163, 184, 0.25);
      font-size: 0.8rem;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .feed-details-footer {
      padding: 16px 24px;
      border-top: 1px solid rgba(148, 163, 184, 0.25);
      flex-shrink: 0;
    }
  `]
})
export class FeedListingDetailsModalComponent implements OnInit {
  feedEntry?: FeedEntryGETData;
  feedInstance?: FeedEntryInstanceGETData;

  constructor(public modalRef: MdbModalRef<FeedListingDetailsModalComponent>) {}

  ngOnInit(): void {
    const data = (this.modalRef as any).data as FeedListingDetailsModalData | undefined;
    this.feedEntry = data?.feedEntry;
    this.feedInstance = data?.feedInstance;
  }

  get combinedMarkdown(): string {
    const base = this.feedEntry?.mdContents || '';
    const more = this.feedEntry?.mdMore || '';
    return more ? `${base}\n\n${more}` : base;
  }

  get sourceUrl(): string {
    return this.feedInstance?.catalogEntry?.url?.trim() || '';
  }

  get hasMeta(): boolean {
    return !!(this.feedEntry?.feedSubTypeCode || this.feedEntry?.subjectEntityName || this.feedInstance?.score != null);
  }

  closeModal(): void {
    this.modalRef.close();
  }
}
