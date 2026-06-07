import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HcclService,
  CatalogEntryGETData,
  CatalogEntryInterestGETData,
  CatalogEntryInterestPOSTData,
} from '@app/restsvc/hccl.service';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { StdBubaComponent } from '@app/components/_global/std-buba/std-buba.component';

/**
 * Displays the details for a single CatalogEntry, mirroring the layout used by
 * the Personal Statement search results (image on the left, attributes on the
 * right, including the interest thumbs up/down controls).
 */
@Component({
  selector: 'app-catalogentry-ui',
  standalone: true,
  imports: [CommonModule, StdBubaComponent],
  template: `
    <div *ngIf="loading" class="ce-loading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div *ngIf="error && !loading" class="alert alert-danger" role="alert">
      <i class="fas fa-exclamation-triangle me-2"></i>
      {{ error }}
    </div>

    <div class="details-section" *ngIf="result && !loading">
      <!-- Image on the left -->
      <div class="image-container">
        <img [src]="getCatalogEntryImageUrl()" alt="Catalog Entry Image" />
      </div>

      <!-- Attributes on the right -->
      <div class="attributes-container">
        <div class="detail-group">
          <label>
            <span>
              <app-std-buba entityName="CatalogEntry" [entityId]="result.id || ''"
                [showLink]="false" [showName]="false"></app-std-buba>
              {{ result.entryCode }}
            </span>
          </label>
          <div class="interest-icons">
            <!-- No interest recorded yet - show both icons -->
            <ng-container *ngIf="!result.catalogEntryInterest">
              <button class="interest-icon-btn thumbs-down" (click)="markNotInterested(result)" title="Not Interested">
                <i class="fas fa-thumbs-down"></i>
              </button>
              <button class="interest-icon-btn thumbs-up" (click)="markInterested(result)" title="Interested">
                <i class="fas fa-thumbs-up"></i>
              </button>
            </ng-container>

            <!-- Interest recorded - show appropriate icon -->
            <ng-container *ngIf="result.catalogEntryInterest">
              <button class="interest-icon-btn thumbs-up active"
                *ngIf="result.catalogEntryInterest.interest && result.catalogEntryInterest.interest > 0"
                (click)="toggleInterest(result)"
                title="You're Interested - Click to remove">
                <i class="fas fa-thumbs-up"></i>
              </button>
              <button class="interest-icon-btn thumbs-down active"
                *ngIf="result.catalogEntryInterest.interest === 0"
                (click)="toggleInterest(result)"
                title="Not Interested - Click to remove">
                <i class="fas fa-thumbs-down"></i>
              </button>
            </ng-container>
          </div>
        </div>

        <div class="detail-group">
          <span>{{ result.title }}</span>
        </div>
        <div *ngIf="result.shortDescription && result.shortDescription !== result.description" class="detail-group">
          <span>{{ result.shortDescription }}</span>
        </div>
        <div class="detail-group">
          <span>{{ result.description }}</span>
        </div>
        <div *ngIf="result.notes" class="detail-group">
          <label>Notes:</label>
          <span>{{ result.notes }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ce-loading {
      display: flex;
      justify-content: center;
      padding: 24px;
    }

    .details-section {
      display: flex;
      gap: 20px;
      align-items: flex-start;
    }

    .image-container {
      flex-shrink: 0;

      img {
        max-width: 200px;
        max-height: 200px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    }

    .attributes-container {
      flex: 1;
    }

    .detail-group {
      margin-bottom: 8px;

      label {
        font-weight: 600;
        color: #374151;
        margin-right: 8px;
      }

      span {
        color: #4b5563;
      }
    }

    .interest-icons {
      display: flex;
      gap: 8px;
    }

    .interest-icon-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      background: #fff;

      i {
        font-size: 14px;
      }

      &.thumbs-up {
        color: #9ca3af;
        border-color: #e5e7eb;

        &:hover {
          color: #10b981;
          border-color: #10b981;
          background: #ecfdf5;
          transform: scale(1.1);
        }

        &.active {
          color: #fff;
          background: #10b981;
          border-color: #10b981;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);

          &:hover {
            background: #059669;
            border-color: #059669;
            transform: scale(1.1);
          }
        }
      }

      &.thumbs-down {
        color: #9ca3af;
        border-color: #e5e7eb;

        &:hover {
          color: #ef4444;
          border-color: #ef4444;
          background: #fef2f2;
          transform: scale(1.1);
        }

        &.active {
          color: #fff;
          background: #ef4444;
          border-color: #ef4444;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);

          &:hover {
            background: #dc2626;
            border-color: #dc2626;
            transform: scale(1.1);
          }
        }
      }
    }
  `],
})
export class CatalogEntryUiComponent implements OnChanges {
  @Input() catalogEntryId: string = '';
  @Input() personalStatementId: string = '';

  private hcclService = inject(HcclService);
  private hcclContextService = inject(HcclContextService);

  result: CatalogEntryGETData | null = null;
  loading = false;
  error = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['catalogEntryId']) {
      this.loadCatalogEntry();
    }
  }

  private loadCatalogEntry(): void {
    if (!this.catalogEntryId) {
      this.result = null;
      return;
    }

    this.loading = true;
    this.error = '';

    this.hcclService.getCatalogEntryByIdWithHint(this.catalogEntryId, 'all').subscribe({
      next: (entry) => {
        this.result = entry;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load catalog entry:', err);
        this.error = 'Unable to load catalog entry details.';
        this.loading = false;
      },
    });
  }

  getCatalogEntryImageUrl(): string {
    return 'public/imgs/TAROT-HR.png';
  }

  markInterested(result: CatalogEntryGETData): void {
    this.recordInterest(result, 10);
  }

  markNotInterested(result: CatalogEntryGETData): void {
    this.recordInterest(result, 0);
  }

  toggleInterest(result: CatalogEntryGETData): void {
    const currentInterest = result.catalogEntryInterest?.interest || 0;
    this.recordInterest(result, currentInterest > 0 ? 0 : 10);
  }

  private recordInterest(result: CatalogEntryGETData, interest: number): void {
    const userProfileId = this.hcclContextService.getCurrentUserProfileId() || '';
    const personalStatementId = this.personalStatementId == ''?  '00000000-0000-0000-0000-000000000000': this.personalStatementId;
    
    const interestData: CatalogEntryInterestPOSTData = {
      catalogId: result.catalogId || '',
      catalogEntryId: result.id || '',
      personalStatementId: personalStatementId,
      userProfileId: userProfileId,
      interest: interest,
      currentStateCode: '--ChangedOnEntry--',
    };

    this.hcclService.showInterest(interestData).subscribe({
      next: (response) => {
        if (!result.catalogEntryInterest) {
          result.catalogEntryInterest = {} as CatalogEntryInterestGETData;
        }
        result.catalogEntryInterest.interest = interest;
        if (response?.id) {
          result.catalogEntryInterest.id = response.id;
        }
      },
      error: (error) => {
        console.error('Error recording interest:', error);
      },
    });
  }
}
