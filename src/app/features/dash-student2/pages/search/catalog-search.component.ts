import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StudentContextService } from '../../shared/student-context.service';
import { CatalogEntryGETData } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-catalog-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  styleUrls: ['../../dash-student2.styles.scss'],
  template: `
    <div class="sd-page">
      <!-- Header -->
      <div class="sd-mb-6">
        <h1 class="sd-page-title">
          <i class="fas fa-search icon"></i>
          Explore Opportunities
        </h1>
        <p class="sd-page-subtitle">
          Find jobs, courses, and events that match your interests
        </p>
      </div>

      <!-- Search Box -->
      <div class="sd-card sd-mb-6">
        <div class="sd-card-body">
          <div class="search-section">
            <div class="sd-search-box">
              <i class="fas fa-search sd-search-box__icon"></i>
              <input 
                type="text" 
                class="sd-search-box__input"
                [(ngModel)]="searchKeyword"
                (keyup.enter)="search()"
                placeholder="Search for jobs, courses, events...">
            </div>
            <button class="sd-btn sd-btn--primary" (click)="search()">
              <i class="fas fa-search"></i>
              Search
            </button>
          </div>

          <!-- Filters -->
          <div class="filters sd-mt-4">
            <div class="filter-group">
              <button 
                class="filter-chip" 
                [class.filter-chip--active]="selectedType() === ''"
                (click)="setType('')">
                All
              </button>
              <button 
                class="filter-chip filter-chip--job" 
                [class.filter-chip--active]="selectedType() === 'job'"
                (click)="setType('job')">
                <i class="fas fa-briefcase"></i>
                Jobs
              </button>
              <button 
                class="filter-chip filter-chip--course" 
                [class.filter-chip--active]="selectedType() === 'course'"
                (click)="setType('course')">
                <i class="fas fa-graduation-cap"></i>
                Courses
              </button>
              <button 
                class="filter-chip filter-chip--event" 
                [class.filter-chip--active]="selectedType() === 'event'"
                (click)="setType('event')">
                <i class="fas fa-calendar-alt"></i>
                Events
              </button>
            </div>
            <label class="availability-toggle">
              <input type="checkbox" [(ngModel)]="availableOnly" (change)="search()">
              <span>Show available only</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="isLoading()" class="sd-loading">
        <div class="sd-loading__spinner"></div>
        <p class="sd-loading__text">Searching opportunities...</p>
      </div>

      <!-- No Search Yet -->
      <div *ngIf="!hasSearched() && !isLoading()" class="sd-card">
        <div class="sd-empty-state">
          <i class="fas fa-compass sd-empty-state__icon"></i>
          <h3 class="sd-empty-state__title">Start Exploring</h3>
          <p class="sd-empty-state__description">
            Enter a keyword above to find jobs, courses, and events that match your interests.
          </p>
        </div>
      </div>

      <!-- No Results -->
      <div *ngIf="hasSearched() && !isLoading() && !results().length" class="sd-card">
        <div class="sd-empty-state">
          <i class="fas fa-search sd-empty-state__icon"></i>
          <h3 class="sd-empty-state__title">No Results Found</h3>
          <p class="sd-empty-state__description">
            Try different keywords or remove some filters.
          </p>
        </div>
      </div>

      <!-- Results Grid -->
      <div *ngIf="hasSearched() && !isLoading() && results().length" class="results-header sd-mb-4">
        <span class="sd-text-muted">Found {{ results().length }} opportunities</span>
      </div>

      <div *ngIf="hasSearched() && !isLoading() && results().length" class="sd-grid sd-grid--2-col">
        <div 
          *ngFor="let entry of results()" 
          class="sd-card sd-card--clickable"
          [class]="getCardAccentClass(entry)">
          <div class="sd-card-body">
            <div class="sd-flex sd-flex--between sd-flex--center sd-mb-2">
              <span class="sd-badge" [class]="getTypeBadgeClass(entry)">
                {{ getTypeLabel(entry) }}
              </span>
              <span class="sd-badge sd-badge--active" *ngIf="entry.available === 1">
                Available
              </span>
            </div>
            
            <h3 class="result-title">{{ entry.title }}</h3>
            
            <p class="result-description" *ngIf="entry.shortDescription">
              {{ truncate(entry.shortDescription, 120) }}
            </p>

            <div class="result-meta sd-mt-4">
              <span class="result-meta__item" *ngIf="entry.dateCreated">
                <i class="fas fa-calendar"></i>
                Posted {{ studentContext.formatDate(entry.dateCreated) }}
              </span>
              <span class="result-meta__item" *ngIf="entry.entryPrice">
                <i class="fas fa-tag"></i>
                \${{ entry.entryPrice }}
              </span>
            </div>
          </div>
          <div class="sd-card-footer">
            <div class="sd-flex sd-flex--between sd-flex--center">
              <a 
                *ngIf="entry.url" 
                [href]="entry.url" 
                target="_blank"
                class="sd-btn sd-btn--ghost sd-btn--sm"
                (click)="$event.stopPropagation()">
                <i class="fas fa-external-link-alt"></i>
                View Source
              </a>
              <button 
                class="sd-btn sd-btn--primary sd-btn--sm"
                (click)="saveInterest($event, entry)">
                <i class="fas fa-heart"></i>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-section {
      display: flex;
      gap: 1rem;
      align-items: center;

      .sd-search-box {
        flex: 1;
      }

      @media (max-width: 640px) {
        flex-direction: column;
        
        .sd-btn {
          width: 100%;
        }
      }
    }

    .filters {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .filter-group {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .filter-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #4B5563;
      background: #F3F4F6;
      border: 2px solid transparent;
      border-radius: 9999px;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        background: #E5E7EB;
      }

      &--active {
        background: #DBEAFE;
        color: #2563EB;
        border-color: #2563EB;
      }

      &--job.filter-chip--active {
        background: #FEF3C7;
        color: #D97706;
        border-color: #D97706;
      }

      &--course.filter-chip--active {
        background: #CFFAFE;
        color: #0891B2;
        border-color: #0891B2;
      }

      &--event.filter-chip--active {
        background: #F3E8FF;
        color: #9333EA;
        border-color: #9333EA;
      }
    }

    .availability-toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #4B5563;
      cursor: pointer;

      input {
        width: 18px;
        height: 18px;
        accent-color: #2563EB;
      }
    }

    .result-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1F2937;
      margin: 0.5rem 0;
    }

    .result-description {
      color: #6B7280;
      font-size: 0.9375rem;
      line-height: 1.5;
      margin: 0;
    }

    .result-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .result-meta__item {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.875rem;
      color: #6B7280;

      i {
        color: #9CA3AF;
      }
    }

    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `]
})
export class CatalogSearchComponent implements OnInit {
  studentContext = inject(StudentContextService);

  searchKeyword = '';
  selectedType = signal('');
  availableOnly = false;
  results = signal<CatalogEntryGETData[]>([]);
  isLoading = signal(false);
  hasSearched = signal(false);

  ngOnInit() {
    // Could load initial results or featured opportunities
  }

  setType(type: string) {
    this.selectedType.set(type);
    if (this.hasSearched()) {
      this.search();
    }
  }

  search() {
    this.isLoading.set(true);
    this.hasSearched.set(true);

    this.studentContext.searchCatalog({
      keyword: this.searchKeyword,
      catalogTypeCode: this.selectedType(),
      availableOnly: this.availableOnly
    }).subscribe({
      next: (data) => {
        this.results.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.results.set([]);
        this.isLoading.set(false);
      }
    });
  }

  getType(entry: CatalogEntryGETData): string {
    return entry.catalogTypeCode?.toLowerCase() || '';
  }

  getTypeBadgeClass(entry: CatalogEntryGETData): string {
    const type = this.getType(entry);
    if (type.includes('job')) return 'sd-badge--job';
    if (type.includes('course')) return 'sd-badge--course';
    if (type.includes('event')) return 'sd-badge--event';
    return 'sd-badge--active';
  }

  getTypeLabel(entry: CatalogEntryGETData): string {
    const type = this.getType(entry);
    if (type.includes('job')) return 'Job';
    if (type.includes('course')) return 'Course';
    if (type.includes('event')) return 'Event';
    return entry.catalogTypeCode || 'Opportunity';
  }

  getCardAccentClass(entry: CatalogEntryGETData): string {
    const type = this.getType(entry);
    if (type.includes('job')) return 'sd-card--accent-business';
    if (type.includes('course')) return 'sd-card--accent-tech';
    if (type.includes('event')) return 'sd-card--accent-trades';
    return 'sd-card--accent-primary';
  }

  truncate(text: string | undefined, maxLength: number): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  saveInterest(event: Event, entry: CatalogEntryGETData) {
    event.stopPropagation();
    // TODO: Implement save interest
    alert(`Saved "${entry.title}" to your interests!`);
  }
}

