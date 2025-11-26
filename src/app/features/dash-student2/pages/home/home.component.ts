import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentContextService } from '../../shared/student-context.service';
import { PersonalStatementGETData, CatalogEntryInterestGETData } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['../../dash-student2.styles.scss'],
  template: `
    <div class="sd-page">
      <!-- Loading State -->
      <div *ngIf="studentContext.isLoading()" class="sd-loading">
        <div class="sd-loading__spinner"></div>
        <p class="sd-loading__text">Loading your dashboard...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="studentContext.error() && !studentContext.isLoading()" class="sd-alert sd-alert--error sd-mb-6">
        <i class="fas fa-exclamation-circle sd-alert__icon"></i>
        <div class="sd-alert__content">
          <div class="sd-alert__title">Something went wrong</div>
          <div class="sd-alert__message">{{ studentContext.error() }}</div>
        </div>
      </div>

      <!-- Main Content -->
      <div *ngIf="!studentContext.isLoading() && !studentContext.error()">
        
        <!-- Quick Actions -->
        <section class="sd-mb-8">
          <h2 class="sd-section-title">
            <i class="fas fa-bolt"></i>
            Quick Actions
          </h2>
          <div class="sd-grid sd-grid--3-col">
            <a routerLink="../statements" class="sd-action-card">
              <div class="sd-action-card__icon">
                <i class="fas fa-pen-fancy"></i>
              </div>
              <div class="sd-action-card__title">Write a Statement</div>
              <div class="sd-action-card__description">
                Describe your career dreams
              </div>
            </a>
            <a routerLink="../search" class="sd-action-card">
              <div class="sd-action-card__icon" style="background: #DBEAFE; color: #2563EB;">
                <i class="fas fa-search"></i>
              </div>
              <div class="sd-action-card__title">Explore Careers</div>
              <div class="sd-action-card__description">
                Find jobs, courses & events
              </div>
            </a>
            <a routerLink="../guidance" class="sd-action-card">
              <div class="sd-action-card__icon" style="background: #D1FAE5; color: #059669;">
                <i class="fas fa-hands-helping"></i>
              </div>
              <div class="sd-action-card__title">Get Help</div>
              <div class="sd-action-card__description">
                Talk to your guidance team
              </div>
            </a>
          </div>
        </section>

        <!-- Two Column Layout -->
        <div class="sd-grid sd-grid--2-col">
          
          <!-- Left Column -->
          <div>
            <!-- My School Card -->
            <section class="sd-card sd-mb-6">
              <div class="sd-card-header">
                <div class="sd-card-header__title">
                  <i class="fas fa-school"></i>
                  My School
                </div>
              </div>
              <div class="sd-card-body">
                <div *ngIf="studentContext.school()">
                  <h3 class="sd-mb-2" style="font-size: 1.125rem; color: #1F2937; font-weight: 600;">
                    {{ studentContext.school()?.name || 'N/A' }}
                  </h3>
                  <p class="sd-text-muted sd-mb-2" *ngIf="studentContext.school()?.organizationName">
                    {{ studentContext.school()?.organizationName }}
                  </p>
                  <p class="sd-text-muted" *ngIf="studentContext.school()?.districtCode">
                    District: {{ studentContext.school()?.districtCode }}
                  </p>
                </div>
                <div *ngIf="!studentContext.school()" class="sd-text-muted">
                  School information not available
                </div>
              </div>
            </section>

            <!-- My Guidance Team -->
            <section class="sd-card">
              <div class="sd-card-header">
                <div class="sd-card-header__title">
                  <i class="fas fa-users"></i>
                  My Guidance Team
                </div>
              </div>
              <div class="sd-card-body" style="padding: 0;">
                <ul class="sd-list" *ngIf="studentContext.guidanceTeam()?.teamMembers?.length">
                  <li 
                    class="sd-list-item" 
                    *ngFor="let member of studentContext.guidanceTeam()?.teamMembers">
                    <div class="sd-avatar">
                      {{ getInitials(member.name) }}
                    </div>
                    <div class="sd-list-item__content">
                      <div class="sd-list-item__title">{{ member.name || 'Team Member' }}</div>
                      <div class="sd-list-item__subtitle" *ngIf="member.userProfile?.userEmail">
                        {{ member.userProfile?.userEmail }}
                      </div>
                    </div>
                    <div class="sd-list-item__actions">
                      <button class="sd-btn sd-btn--outline sd-btn--sm">
                        <i class="fas fa-envelope"></i>
                        Message
                      </button>
                    </div>
                  </li>
                </ul>
                <div *ngIf="!studentContext.guidanceTeam()?.teamMembers?.length" class="sd-p-6 sd-text-muted sd-text-center">
                  No guidance team members assigned yet
                </div>
              </div>
            </section>
          </div>

          <!-- Right Column -->
          <div>
            <!-- Recent Statements -->
            <section class="sd-card sd-mb-6">
              <div class="sd-card-header">
                <div class="sd-card-header__title">
                  <i class="fas fa-file-alt"></i>
                  My Statements
                </div>
                <a routerLink="../statements" class="sd-btn sd-btn--ghost sd-btn--sm">
                  View All <i class="fas fa-arrow-right"></i>
                </a>
              </div>
              <div class="sd-card-body" style="padding: 0;">
                <div *ngIf="isLoadingStatements()" class="sd-loading">
                  <div class="sd-loading__spinner"></div>
                </div>
                <ul class="sd-list" *ngIf="!isLoadingStatements() && statements().length">
                  <li 
                    class="sd-list-item sd-list-item--clickable" 
                    *ngFor="let stmt of statements().slice(0, 3)"
                    [routerLink]="['../statements', stmt.id]">
                    <div class="sd-list-item__icon">
                      <i class="fas fa-file-alt"></i>
                    </div>
                    <div class="sd-list-item__content">
                      <div class="sd-list-item__title">{{ stmt.name || 'Untitled' }}</div>
                      <div class="sd-list-item__meta">
                        {{ studentContext.formatDate(stmt.dateCreated) }}
                      </div>
                    </div>
                    <span class="sd-badge" [class]="getStatusBadgeClass(stmt.status)">
                      {{ getStatusLabel(stmt.status) }}
                    </span>
                  </li>
                </ul>
                <div *ngIf="!isLoadingStatements() && !statements().length" class="sd-empty-state">
                  <i class="fas fa-file-alt sd-empty-state__icon"></i>
                  <h3 class="sd-empty-state__title">No statements yet</h3>
                  <p class="sd-empty-state__description">
                    Write your first career statement to get personalized opportunities
                  </p>
                  <a routerLink="../statements" class="sd-btn sd-btn--primary">
                    <i class="fas fa-plus"></i>
                    Write Statement
                  </a>
                </div>
              </div>
            </section>

            <!-- Saved Interests -->
            <section class="sd-card">
              <div class="sd-card-header">
                <div class="sd-card-header__title">
                  <i class="fas fa-heart"></i>
                  Saved Interests
                </div>
                <a routerLink="../interests" class="sd-btn sd-btn--ghost sd-btn--sm">
                  View All <i class="fas fa-arrow-right"></i>
                </a>
              </div>
              <div class="sd-card-body" style="padding: 0;">
                <div *ngIf="isLoadingInterests()" class="sd-loading">
                  <div class="sd-loading__spinner"></div>
                </div>
                <ul class="sd-list" *ngIf="!isLoadingInterests() && interests().length">
                  <li 
                    class="sd-list-item sd-list-item--clickable" 
                    *ngFor="let interest of interests().slice(0, 3)"
                    [routerLink]="['../interests', interest.id]">
                    <div class="sd-list-item__icon" [ngStyle]="getInterestIconStyle(interest)">
                      <i [class]="getInterestIcon(interest)"></i>
                    </div>
                    <div class="sd-list-item__content">
                      <div class="sd-list-item__title">
                        {{ interest.catalogEntry?.title || 'Opportunity' }}
                      </div>
                      <div class="sd-list-item__subtitle">
                        {{ interest.catalogEntry?.catalogTypeCode | titlecase }}
                      </div>
                    </div>
                  </li>
                </ul>
                <div *ngIf="!isLoadingInterests() && !interests().length" class="sd-empty-state">
                  <i class="fas fa-heart sd-empty-state__icon"></i>
                  <h3 class="sd-empty-state__title">No saved interests</h3>
                  <p class="sd-empty-state__description">
                    Explore opportunities and save the ones you like
                  </p>
                  <a routerLink="../search" class="sd-btn sd-btn--primary">
                    <i class="fas fa-search"></i>
                    Explore Now
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit {
  studentContext = inject(StudentContextService);

  statements = signal<PersonalStatementGETData[]>([]);
  interests = signal<CatalogEntryInterestGETData[]>([]);
  isLoadingStatements = signal(false);
  isLoadingInterests = signal(false);

  ngOnInit() {
    this.loadStatements();
    this.loadInterests();
  }

  loadStatements() {
    this.isLoadingStatements.set(true);
    this.studentContext.getPersonalStatements().subscribe({
      next: (data) => {
        this.statements.set(data);
        this.isLoadingStatements.set(false);
      },
      error: () => this.isLoadingStatements.set(false)
    });
  }

  loadInterests() {
    this.isLoadingInterests.set(true);
    this.studentContext.getInterests().subscribe({
      next: (data) => {
        this.interests.set(data);
        this.isLoadingInterests.set(false);
      },
      error: () => this.isLoadingInterests.set(false)
    });
  }

  getInitials(name: string | undefined): string {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  getStatusBadgeClass(status: number | undefined): string {
    switch (status) {
      case 1:
      case 2:
        return 'sd-badge--active';
      case 0:
        return 'sd-badge--draft';
      default:
        return 'sd-badge--draft';
    }
  }

  getStatusLabel(status: number | undefined): string {
    switch (status) {
      case 1:
      case 2:
        return 'Active';
      case 0:
        return 'Draft';
      default:
        return 'Draft';
    }
  }

  getInterestIcon(interest: CatalogEntryInterestGETData): string {
    const type = interest.catalogEntry?.catalogTypeCode?.toLowerCase() || '';
    if (type.includes('job')) return 'fas fa-briefcase';
    if (type.includes('course')) return 'fas fa-graduation-cap';
    if (type.includes('event')) return 'fas fa-calendar-alt';
    return 'fas fa-star';
  }

  getInterestIconStyle(interest: CatalogEntryInterestGETData): object {
    const type = interest.catalogEntry?.catalogTypeCode?.toLowerCase() || '';
    if (type.includes('job')) return { background: '#FEF3C7', color: '#D97706' };
    if (type.includes('course')) return { background: '#CFFAFE', color: '#0891B2' };
    if (type.includes('event')) return { background: '#F3E8FF', color: '#9333EA' };
    return { background: '#DBEAFE', color: '#2563EB' };
  }
}

