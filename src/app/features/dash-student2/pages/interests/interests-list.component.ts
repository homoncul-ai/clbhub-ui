import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentContextService } from '../../shared/student-context.service';
import { CatalogEntryInterestGETData } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-interests-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['../../dash-student2.styles.scss'],
  template: `
    <div class="sd-page">
      <!-- Header -->
      <div class="sd-flex sd-flex--between sd-flex--center sd-mb-6">
        <div>
          <h1 class="sd-page-title">
            <i class="fas fa-heart icon"></i>
            My Saved Interests
          </h1>
          <p class="sd-page-subtitle">
            Opportunities you've saved for later
          </p>
        </div>
        <a routerLink="../search" class="sd-btn sd-btn--primary">
          <i class="fas fa-search"></i>
          Explore More
        </a>
      </div>

      <!-- Loading -->
      <div *ngIf="isLoading()" class="sd-loading">
        <div class="sd-loading__spinner"></div>
        <p class="sd-loading__text">Loading your saved interests...</p>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading() && !interests().length" class="sd-card">
        <div class="sd-empty-state">
          <i class="fas fa-heart sd-empty-state__icon"></i>
          <h3 class="sd-empty-state__title">No saved interests yet</h3>
          <p class="sd-empty-state__description">
            When you find jobs, courses, or events you like, save them here so you can find them easily later.
          </p>
          <a routerLink="../search" class="sd-btn sd-btn--primary sd-btn--lg">
            <i class="fas fa-search"></i>
            Start Exploring
          </a>
        </div>
      </div>

      <!-- Interests Grid -->
      <div *ngIf="!isLoading() && interests().length" class="sd-grid sd-grid--3-col">
        <div 
          *ngFor="let interest of interests()" 
          class="sd-card sd-card--clickable"
          [class]="getCardAccentClass(interest)"
          [routerLink]="[interest.id]">
          <div class="sd-card-body">
            <div class="sd-flex sd-flex--gap-4">
              <div class="interest-icon" [ngStyle]="getIconStyle(interest)">
                <i [class]="getIcon(interest)"></i>
              </div>
              <div class="interest-content">
                <span class="sd-badge sd-badge--sm" [class]="getTypeBadgeClass(interest)">
                  {{ getTypeLabel(interest) }}
                </span>
                <h3 class="interest-title">
                  {{ interest.catalogEntry?.title || 'Opportunity' }}
                </h3>
                <p class="interest-description" *ngIf="interest.catalogEntry?.shortDescription">
                  {{ truncate(interest.catalogEntry?.shortDescription, 100) }}
                </p>
              </div>
            </div>
            <div class="sd-flex sd-flex--between sd-flex--center sd-mt-4">
              <span class="sd-text-muted sd-text-sm">
                Saved {{ studentContext.formatDate(interest.dateCreated) }}
              </span>
              <button 
                class="sd-btn sd-btn--ghost sd-btn--sm" 
                (click)="removeInterest($event, interest)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .interest-icon {
      width: 56px;
      height: 56px;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 1.5rem;
    }

    .interest-content {
      flex: 1;
      min-width: 0;
    }

    .interest-title {
      font-size: 1.0625rem;
      font-weight: 600;
      color: #1F2937;
      margin: 0.5rem 0;
    }

    .interest-description {
      color: #6B7280;
      font-size: 0.875rem;
      line-height: 1.5;
      margin: 0;
    }
  `]
})
export class InterestsListComponent implements OnInit {
  studentContext = inject(StudentContextService);

  interests = signal<CatalogEntryInterestGETData[]>([]);
  isLoading = signal(false);

  ngOnInit() {
    this.loadInterests();
  }

  loadInterests() {
    this.isLoading.set(true);
    this.studentContext.getInterests().subscribe({
      next: (data) => {
        this.interests.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  getType(interest: CatalogEntryInterestGETData): string {
    return interest.catalogEntry?.catalogTypeCode?.toLowerCase() || '';
  }

  getIcon(interest: CatalogEntryInterestGETData): string {
    const type = this.getType(interest);
    if (type.includes('job')) return 'fas fa-briefcase';
    if (type.includes('course')) return 'fas fa-graduation-cap';
    if (type.includes('event')) return 'fas fa-calendar-alt';
    return 'fas fa-star';
  }

  getIconStyle(interest: CatalogEntryInterestGETData): object {
    const type = this.getType(interest);
    if (type.includes('job')) return { background: '#FEF3C7', color: '#D97706' };
    if (type.includes('course')) return { background: '#CFFAFE', color: '#0891B2' };
    if (type.includes('event')) return { background: '#F3E8FF', color: '#9333EA' };
    return { background: '#DBEAFE', color: '#2563EB' };
  }

  getCardAccentClass(interest: CatalogEntryInterestGETData): string {
    const type = this.getType(interest);
    if (type.includes('job')) return 'sd-card--accent-business';
    if (type.includes('course')) return 'sd-card--accent-tech';
    if (type.includes('event')) return 'sd-card--accent-trades';
    return 'sd-card--accent-primary';
  }

  getTypeBadgeClass(interest: CatalogEntryInterestGETData): string {
    const type = this.getType(interest);
    if (type.includes('job')) return 'sd-badge--job';
    if (type.includes('course')) return 'sd-badge--course';
    if (type.includes('event')) return 'sd-badge--event';
    return 'sd-badge--active';
  }

  getTypeLabel(interest: CatalogEntryInterestGETData): string {
    const type = this.getType(interest);
    if (type.includes('job')) return 'Job';
    if (type.includes('course')) return 'Course';
    if (type.includes('event')) return 'Event';
    return interest.catalogEntry?.catalogTypeCode || 'Opportunity';
  }

  truncate(text: string | undefined, maxLength: number): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  removeInterest(event: Event, interest: CatalogEntryInterestGETData) {
    event.stopPropagation();
    if (!interest.id) return;

    if (confirm('Remove this from your saved interests?')) {
      this.studentContext.removeInterest(interest.id).subscribe({
        next: () => this.loadInterests()
      });
    }
  }
}

