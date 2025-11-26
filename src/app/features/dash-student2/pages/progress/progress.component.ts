import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentContextService } from '../../shared/student-context.service';
import { PersonalStatementGETData, CatalogEntryInterestGETData } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['../../dash-student2.styles.scss'],
  template: `
    <div class="sd-page">
      <!-- Header -->
      <div class="sd-mb-6">
        <h1 class="sd-page-title">
          <i class="fas fa-chart-line icon"></i>
          My Progress
        </h1>
        <p class="sd-page-subtitle">
          Track your career preparation journey
        </p>
      </div>

      <!-- Career Readiness Score -->
      <div class="sd-card sd-mb-6">
        <div class="sd-card-body">
          <div class="readiness-score">
            <div class="readiness-score__ring">
              <svg viewBox="0 0 120 120" width="160" height="160">
                <circle
                  class="readiness-score__bg"
                  cx="60" cy="60" r="52"
                  fill="none"
                  stroke="#E5E7EB"
                  stroke-width="12"
                />
                <circle
                  class="readiness-score__fill"
                  cx="60" cy="60" r="52"
                  fill="none"
                  stroke="#2563EB"
                  stroke-width="12"
                  stroke-linecap="round"
                  [attr.stroke-dasharray]="getCircumference()"
                  [attr.stroke-dashoffset]="getDashOffset()"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div class="readiness-score__value">
                {{ readinessScore() }}%
              </div>
            </div>
            <div class="readiness-score__info">
              <h2 class="readiness-score__title">Career Readiness Score</h2>
              <p class="readiness-score__description">
                {{ getReadinessMessage() }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Breakdown -->
      <div class="sd-grid sd-grid--2-col sd-mb-6">
        <!-- Completion Checklist -->
        <div class="sd-card">
          <div class="sd-card-header">
            <div class="sd-card-header__title">
              <i class="fas fa-tasks"></i>
              Your Journey
            </div>
          </div>
          <div class="sd-card-body">
            <div class="checklist">
              <div class="checklist-item" [class.checklist-item--complete]="hasProfile()">
                <div class="checklist-item__check">
                  <i *ngIf="hasProfile()" class="fas fa-check"></i>
                </div>
                <div class="checklist-item__content">
                  <span class="checklist-item__title">Complete Your Profile</span>
                  <span class="checklist-item__subtitle">Add your contact information</span>
                </div>
              </div>

              <div class="checklist-item" [class.checklist-item--complete]="hasStatements()">
                <div class="checklist-item__check">
                  <i *ngIf="hasStatements()" class="fas fa-check"></i>
                </div>
                <div class="checklist-item__content">
                  <span class="checklist-item__title">Write a Career Statement</span>
                  <span class="checklist-item__subtitle">Describe your career dreams</span>
                </div>
                <a *ngIf="!hasStatements()" routerLink="../statements" class="sd-btn sd-btn--sm sd-btn--primary">
                  Start
                </a>
              </div>

              <div class="checklist-item" [class.checklist-item--complete]="hasInterests()">
                <div class="checklist-item__check">
                  <i *ngIf="hasInterests()" class="fas fa-check"></i>
                </div>
                <div class="checklist-item__content">
                  <span class="checklist-item__title">Explore Opportunities</span>
                  <span class="checklist-item__subtitle">Save at least 3 interests</span>
                </div>
                <a *ngIf="!hasInterests()" routerLink="../search" class="sd-btn sd-btn--sm sd-btn--primary">
                  Explore
                </a>
              </div>

              <div class="checklist-item" [class.checklist-item--complete]="false">
                <div class="checklist-item__check">
                </div>
                <div class="checklist-item__content">
                  <span class="checklist-item__title">Build Your Resume</span>
                  <span class="checklist-item__subtitle">Create a professional resume</span>
                </div>
                <span class="sd-badge sd-badge--pending">Coming Soon</span>
              </div>

              <div class="checklist-item" [class.checklist-item--complete]="false">
                <div class="checklist-item__check">
                </div>
                <div class="checklist-item__content">
                  <span class="checklist-item__title">Apply to Opportunities</span>
                  <span class="checklist-item__subtitle">Submit your first application</span>
                </div>
                <span class="sd-badge sd-badge--pending">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Summary -->
        <div>
          <div class="sd-card sd-mb-4">
            <div class="sd-card-header">
              <div class="sd-card-header__title">
                <i class="fas fa-trophy"></i>
                Your Stats
              </div>
            </div>
            <div class="sd-card-body">
              <div class="stat-row">
                <span class="stat-row__label">Career Statements</span>
                <span class="stat-row__value">{{ statementsCount() }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-row__label">Saved Interests</span>
                <span class="stat-row__value">{{ interestsCount() }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-row__label">Support Requests</span>
                <span class="stat-row__value">-</span>
              </div>
              <div class="stat-row">
                <span class="stat-row__label">Applications</span>
                <span class="stat-row__value">-</span>
              </div>
            </div>
          </div>

          <!-- Encouragement Card -->
          <div class="sd-card encouragement-card">
            <div class="sd-card-body">
              <div class="encouragement-icon">
                {{ getEncouragementEmoji() }}
              </div>
              <h3 class="encouragement-title">{{ getEncouragementTitle() }}</h3>
              <p class="encouragement-text">{{ getEncouragementText() }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .readiness-score {
      display: flex;
      align-items: center;
      gap: 2rem;
      flex-wrap: wrap;
      justify-content: center;

      @media (min-width: 640px) {
        justify-content: flex-start;
      }
    }

    .readiness-score__ring {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .readiness-score__fill {
      transition: stroke-dashoffset 0.5s ease;
    }

    .readiness-score__value {
      position: absolute;
      font-family: 'DM Sans', sans-serif;
      font-size: 2.5rem;
      font-weight: 700;
      color: #1F2937;
    }

    .readiness-score__info {
      flex: 1;
      min-width: 200px;
    }

    .readiness-score__title {
      font-family: 'DM Sans', sans-serif;
      font-size: 1.5rem;
      font-weight: 600;
      color: #1F2937;
      margin: 0 0 0.5rem 0;
    }

    .readiness-score__description {
      color: #6B7280;
      font-size: 1rem;
      margin: 0;
    }

    .checklist {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .checklist-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #F9FAFB;
      border-radius: 0.75rem;
      transition: all 0.15s ease;
    }

    .checklist-item--complete {
      background: #ECFDF5;
    }

    .checklist-item__check {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid #D1D5DB;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: #9CA3AF;
    }

    .checklist-item--complete .checklist-item__check {
      background: #10B981;
      border-color: #10B981;
      color: white;
    }

    .checklist-item__content {
      flex: 1;
    }

    .checklist-item__title {
      display: block;
      font-weight: 600;
      color: #1F2937;
    }

    .checklist-item__subtitle {
      display: block;
      font-size: 0.875rem;
      color: #6B7280;
    }

    .stat-row {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid #E5E7EB;

      &:last-child {
        border-bottom: none;
      }
    }

    .stat-row__label {
      color: #6B7280;
    }

    .stat-row__value {
      font-weight: 600;
      color: #1F2937;
    }

    .encouragement-card {
      background: linear-gradient(135deg, #DBEAFE 0%, #EDE9FE 100%);
      border: none;
      text-align: center;
    }

    .encouragement-icon {
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }

    .encouragement-title {
      font-family: 'DM Sans', sans-serif;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1F2937;
      margin: 0 0 0.5rem 0;
    }

    .encouragement-text {
      color: #4B5563;
      margin: 0;
    }
  `]
})
export class ProgressComponent implements OnInit {
  studentContext = inject(StudentContextService);

  statementsCount = signal(0);
  interestsCount = signal(0);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.studentContext.getPersonalStatements().subscribe({
      next: (data) => this.statementsCount.set(data.length)
    });

    this.studentContext.getInterests().subscribe({
      next: (data) => this.interestsCount.set(data.length)
    });
  }

  hasProfile(): boolean {
    return !!this.studentContext.userProfile();
  }

  hasStatements(): boolean {
    return this.statementsCount() > 0;
  }

  hasInterests(): boolean {
    return this.interestsCount() >= 3;
  }

  readinessScore(): number {
    let score = 0;
    if (this.hasProfile()) score += 25;
    if (this.hasStatements()) score += 25;
    if (this.hasInterests()) score += 25;
    // Future: resume = 15, applications = 10
    return score;
  }

  getCircumference(): number {
    return 2 * Math.PI * 52; // r = 52
  }

  getDashOffset(): number {
    const circumference = this.getCircumference();
    const progress = this.readinessScore() / 100;
    return circumference * (1 - progress);
  }

  getReadinessMessage(): string {
    const score = this.readinessScore();
    if (score >= 75) return "Excellent! You're well prepared for your career journey.";
    if (score >= 50) return "Great progress! Keep building your profile.";
    if (score >= 25) return "Good start! Complete more steps to boost your readiness.";
    return "Welcome! Let's start building your career profile.";
  }

  getEncouragementEmoji(): string {
    const score = this.readinessScore();
    if (score >= 75) return "🌟";
    if (score >= 50) return "💪";
    if (score >= 25) return "🚀";
    return "👋";
  }

  getEncouragementTitle(): string {
    const score = this.readinessScore();
    if (score >= 75) return "You're a Star!";
    if (score >= 50) return "Keep Going!";
    if (score >= 25) return "Great Start!";
    return "Welcome!";
  }

  getEncouragementText(): string {
    const score = this.readinessScore();
    if (score >= 75) return "Your dedication is paying off. Keep exploring opportunities!";
    if (score >= 50) return "You're making great progress on your career journey.";
    if (score >= 25) return "Every step counts. You're building a strong foundation.";
    return "Your career adventure starts here. Let's explore together!";
  }
}

