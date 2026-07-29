import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

export interface FeedDateRangeModalData {
  dateStart?: string;
  dateEnd?: string;
}

export interface FeedDateRangeModalResult {
  dateStart: string;
  dateEnd: string;
}

@Component({
  selector: 'app-feed-date-range-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="feed-date-range-modal">
      <div class="modal-header">
        <h5 class="modal-title">Custom date range</h5>
        <button type="button" class="btn-close" (click)="cancel()" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <p class="modal-help">Choose a specific date range to filter feed items by when they were created.</p>

        <label class="date-field">
          <span>From</span>
          <input type="date" [(ngModel)]="dateStart" [max]="dateEnd || undefined" />
        </label>

        <label class="date-field">
          <span>To</span>
          <input type="date" [(ngModel)]="dateEnd" [min]="dateStart || undefined" />
        </label>

        <p class="date-error" *ngIf="hasInvalidRange">End date must be on or after the start date.</p>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" (click)="clearRange()">Clear range</button>
        <div class="modal-footer-actions">
          <button type="button" class="btn btn-secondary" (click)="cancel()">Cancel</button>
          <button type="button" class="btn btn-primary" [disabled]="hasInvalidRange" (click)="apply()">
            Apply
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .feed-date-range-modal {
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid rgba(148, 163, 184, 0.25);
    }

    .modal-title {
      margin: 0;
      font-size: 1.05rem;
      font-weight: 700;
      color: #0f172a;
    }

    .modal-body {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .modal-help {
      margin: 0;
      font-size: 0.875rem;
      color: #64748b;
      line-height: 1.5;
    }

    .date-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin: 0;

      span {
        font-size: 0.8rem;
        font-weight: 600;
        color: #475569;
      }

      input {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #d1d5db;
        border-radius: 10px;
        font-size: 0.875rem;
        color: #0f172a;

        &:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.12);
        }
      }
    }

    .date-error {
      margin: 0;
      font-size: 0.8rem;
      color: #dc2626;
    }

    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 1rem 1.25rem;
      border-top: 1px solid rgba(148, 163, 184, 0.25);
    }

    .modal-footer-actions {
      display: flex;
      gap: 8px;
    }
  `]
})
export class FeedDateRangeModalComponent implements OnInit {
  dateStart = '';
  dateEnd = '';

  constructor(public modalRef: MdbModalRef<FeedDateRangeModalComponent>) {}

  ngOnInit(): void {
    const data = (this.modalRef as any).data as FeedDateRangeModalData | undefined;
    this.dateStart = data?.dateStart || '';
    this.dateEnd = data?.dateEnd || '';
  }

  get hasInvalidRange(): boolean {
    return !!this.dateStart && !!this.dateEnd && this.dateStart > this.dateEnd;
  }

  apply(): void {
    if (this.hasInvalidRange) {
      return;
    }

    this.modalRef.close({
      dateStart: this.dateStart,
      dateEnd: this.dateEnd
    } satisfies FeedDateRangeModalResult);
  }

  clearRange(): void {
    this.dateStart = '';
    this.dateEnd = '';
  }

  cancel(): void {
    this.modalRef.close();
  }
}
