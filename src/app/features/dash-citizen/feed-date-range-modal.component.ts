import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

export interface FeedDateRangeModalData {
  dateStart?: string;
  dateEnd?: string;
  title?: string;
  helpText?: string;
}

export interface FeedDateRangeModalResult {
  dateStart: string;
  dateEnd: string;
}

export type FeedDateRangeQuickOption = 'lastWeek' | 'last2Weeks' | 'lastMonth' | 'last3Months';

@Component({
  selector: 'app-feed-date-range-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="feed-date-range-modal">
      <div class="modal-header">
        <h5 class="modal-title">{{ title }}</h5>
        <button type="button" class="btn-close" (click)="cancel()" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <p class="modal-help">{{ helpText }}</p>

        <div class="quick-options">
          <span class="quick-options-label">Quick options</span>
          <div class="quick-option-list">
            <button
              type="button"
              class="quick-option-btn"
              *ngFor="let option of quickOptions"
              [class.active]="activeQuickOption === option.code"
              (click)="applyQuickOption(option.code)"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

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

    .quick-options {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .quick-options-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #475569;
    }

    .quick-option-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .quick-option-btn {
      display: inline-flex;
      align-items: center;
      padding: 8px 12px;
      background: #f9fafb;
      color: #374151;
      border: 1px solid #e5e7eb;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #f3f4f6;
        border-color: #d1d5db;
      }

      &.active {
        background: rgba(102, 126, 234, 0.08);
        color: #667eea;
        border-color: #667eea;
      }
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
  title = 'Custom date range';
  helpText = 'Choose a specific date range to filter feed items by when they were created.';

  readonly quickOptions: Array<{ code: FeedDateRangeQuickOption; label: string }> = [
    { code: 'lastWeek', label: 'Last week' },
    { code: 'last2Weeks', label: 'Last 2 weeks' },
    { code: 'lastMonth', label: 'Last month' },
    { code: 'last3Months', label: 'Last 3 months' },
  ];

  constructor(public modalRef: MdbModalRef<FeedDateRangeModalComponent>) {}

  ngOnInit(): void {
    const data = (this.modalRef as any).data as FeedDateRangeModalData | undefined;
    this.dateStart = data?.dateStart || '';
    this.dateEnd = data?.dateEnd || '';
    if (data?.title) {
      this.title = data.title;
    }
    if (data?.helpText) {
      this.helpText = data.helpText;
    }
  }

  get hasInvalidRange(): boolean {
    return !!this.dateStart && !!this.dateEnd && this.dateStart > this.dateEnd;
  }

  get activeQuickOption(): FeedDateRangeQuickOption | null {
    if (!this.dateStart || !this.dateEnd) {
      return null;
    }
    for (const option of this.quickOptions) {
      const range = this.getQuickOptionRange(option.code);
      if (this.dateStart === range.start && this.dateEnd === range.end) {
        return option.code;
      }
    }
    return null;
  }

  applyQuickOption(option: FeedDateRangeQuickOption): void {
    const range = this.getQuickOptionRange(option);
    this.dateStart = range.start;
    this.dateEnd = range.end;
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

  private getQuickOptionRange(option: FeedDateRangeQuickOption): { start: string; end: string } {
    const today = this.formatDateString(new Date());
    switch (option) {
      case 'lastWeek':
        return { start: this.addDays(today, -6), end: today };
      case 'last2Weeks':
        return { start: this.addDays(today, -13), end: today };
      case 'lastMonth':
        return { start: this.addMonths(today, -1), end: today };
      case 'last3Months':
        return { start: this.addMonths(today, -3), end: today };
    }
  }

  private addDays(dateValue: string, days: number): string {
    const [year, month, day] = dateValue.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + days);
    return this.formatDateString(date);
  }

  private addMonths(dateValue: string, months: number): string {
    const [year, month, day] = dateValue.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setMonth(date.getMonth() + months);
    return this.formatDateString(date);
  }

  private formatDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
