import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StudentContextService } from '../../shared/student-context.service';
import { CatalogEntryInterestGETData } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-interest-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['../../dash-student2.styles.scss'],
  template: `
    <div class="sd-page">
      <!-- Breadcrumb -->
      <nav class="sd-breadcrumb">
        <a routerLink="../" class="sd-breadcrumb__link">My Interests</a>
        <span class="sd-breadcrumb__separator">/</span>
        <span class="sd-breadcrumb__current">{{ interest()?.catalogEntry?.title || 'Details' }}</span>
      </nav>

      <!-- Loading -->
      <div *ngIf="isLoading()" class="sd-loading">
        <div class="sd-loading__spinner"></div>
        <p class="sd-loading__text">Loading details...</p>
      </div>

      <!-- Error -->
      <div *ngIf="error() && !isLoading()" class="sd-alert sd-alert--error">
        <i class="fas fa-exclamation-circle sd-alert__icon"></i>
        <div class="sd-alert__content">
          <div class="sd-alert__message">{{ error() }}</div>
        </div>
      </div>

      <!-- Content -->
      <div *ngIf="interest() && !isLoading()">
        <!-- Header -->
        <div class="sd-flex sd-flex--between sd-flex--center sd-mb-6">
          <div>
            <div class="sd-flex sd-flex--gap-2 sd-mb-2">
              <span class="sd-badge" [class]="getTypeBadgeClass()">
                {{ getTypeLabel() }}
              </span>
              <span class="sd-badge sd-badge--active" *ngIf="interest()?.catalogEntry?.available === 1">
                Available
              </span>
            </div>
            <h1 class="sd-page-title">
              <i [class]="getIcon() + ' icon'"></i>
              {{ interest()?.catalogEntry?.title }}
            </h1>
          </div>
          <div class="sd-flex sd-flex--gap-2">
            <button 
              *ngIf="canApply()" 
              class="sd-btn sd-btn--success">
              <i class="fas fa-paper-plane"></i>
              Apply Now
            </button>
            <button 
              *ngIf="canSignUp()" 
              class="sd-btn sd-btn--primary">
              <i class="fas fa-user-plus"></i>
              Sign Up
            </button>
          </div>
        </div>

        <!-- Main Card -->
        <div class="sd-card sd-mb-6">
          <div class="sd-card-body">
            <!-- Description -->
            <section class="detail-section">
              <h3 class="sd-section-title">
                <i class="fas fa-info-circle"></i>
                Description
              </h3>
              <p class="detail-text">
                {{ interest()?.catalogEntry?.description || interest()?.catalogEntry?.shortDescription || 'No description available.' }}
              </p>
            </section>

            <!-- Details Grid -->
            <section class="sd-mt-6">
              <h3 class="sd-section-title">
                <i class="fas fa-list"></i>
                Details
              </h3>
              <div class="sd-grid sd-grid--2-col">
                <div class="detail-item" *ngIf="interest()?.catalogEntry?.entryCode">
                  <span class="sd-label">Reference Code</span>
                  <span class="sd-value">{{ interest()?.catalogEntry?.entryCode }}</span>
                </div>
                <div class="detail-item" *ngIf="interest()?.catalogEntry?.dateCreated">
                  <span class="sd-label">Posted</span>
                  <span class="sd-value">{{ studentContext.formatDate(interest()?.catalogEntry?.dateCreated) }}</span>
                </div>
                <div class="detail-item" *ngIf="interest()?.catalogEntry?.dateLastUpdated">
                  <span class="sd-label">Last Updated</span>
                  <span class="sd-value">{{ studentContext.formatDate(interest()?.catalogEntry?.dateLastUpdated) }}</span>
                </div>
                <div class="detail-item" *ngIf="interest()?.catalogEntry?.entryPrice">
                  <span class="sd-label">Price</span>
                  <span class="sd-value">\${{ interest()?.catalogEntry?.entryPrice }}</span>
                </div>
              </div>
            </section>

            <!-- Source Link -->
            <section class="sd-mt-6" *ngIf="interest()?.catalogEntry?.url">
              <a 
                [href]="interest()?.catalogEntry?.url" 
                target="_blank" 
                class="sd-btn sd-btn--outline">
                <i class="fas fa-external-link-alt"></i>
                View Original Posting
              </a>
            </section>
          </div>
        </div>

        <!-- Notes Section -->
        <div class="sd-card">
          <div class="sd-card-header">
            <div class="sd-card-header__title">
              <i class="fas fa-sticky-note"></i>
              My Notes
            </div>
          </div>
          <div class="sd-card-body">
            <p *ngIf="interest()?.notes">{{ interest()?.notes }}</p>
            <p *ngIf="!interest()?.notes" class="sd-text-muted">
              No notes added yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail-section {
      margin-bottom: 1.5rem;
    }

    .detail-text {
      font-size: 1rem;
      line-height: 1.75;
      color: #374151;
      white-space: pre-wrap;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding: 1rem;
      background: #F9FAFB;
      border-radius: 0.5rem;
    }
  `]
})
export class InterestDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  studentContext = inject(StudentContextService);

  interest = signal<CatalogEntryInterestGETData | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadInterest(id);
    }
  }

  loadInterest(id: string) {
    this.isLoading.set(true);
    this.error.set(null);

    this.studentContext.getInterestById(id).subscribe({
      next: (data) => {
        if (data) {
          this.interest.set(data);
        } else {
          this.error.set('Interest not found');
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load interest details');
        this.isLoading.set(false);
      }
    });
  }

  getType(): string {
    return this.interest()?.catalogEntry?.catalogTypeCode?.toLowerCase() || '';
  }

  getIcon(): string {
    const type = this.getType();
    if (type.includes('job')) return 'fas fa-briefcase';
    if (type.includes('course')) return 'fas fa-graduation-cap';
    if (type.includes('event')) return 'fas fa-calendar-alt';
    return 'fas fa-star';
  }

  getTypeBadgeClass(): string {
    const type = this.getType();
    if (type.includes('job')) return 'sd-badge--job';
    if (type.includes('course')) return 'sd-badge--course';
    if (type.includes('event')) return 'sd-badge--event';
    return 'sd-badge--active';
  }

  getTypeLabel(): string {
    const type = this.getType();
    if (type.includes('job')) return 'Job';
    if (type.includes('course')) return 'Course';
    if (type.includes('event')) return 'Event';
    return this.interest()?.catalogEntry?.catalogTypeCode || 'Opportunity';
  }

  canApply(): boolean {
    const type = this.getType();
    return (type.includes('job') || type.includes('program')) && 
           this.interest()?.catalogEntry?.available === 1;
  }

  canSignUp(): boolean {
    const type = this.getType();
    return (type.includes('course') || type.includes('event')) && 
           this.interest()?.catalogEntry?.available === 1;
  }
}

