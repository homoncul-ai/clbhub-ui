import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StudentContextService } from '../../shared/student-context.service';
import { PersonalStatementGETData } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-statements-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  styleUrls: ['../../dash-student2.styles.scss'],
  template: `
    <div class="sd-page">
      <!-- Header -->
      <div class="sd-flex sd-flex--between sd-flex--center sd-mb-6">
        <div>
          <h1 class="sd-page-title">
            <i class="fas fa-file-alt icon"></i>
            Personal Statements
          </h1>
          <p class="sd-page-subtitle">
            Write about your career dreams to find matching opportunities
          </p>
        </div>
        <button class="sd-btn sd-btn--primary" (click)="openCreateModal()">
          <i class="fas fa-plus"></i>
          New Statement
        </button>
      </div>

      <!-- Loading -->
      <div *ngIf="isLoading()" class="sd-loading">
        <div class="sd-loading__spinner"></div>
        <p class="sd-loading__text">Loading statements...</p>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading() && !statements().length" class="sd-card">
        <div class="sd-empty-state">
          <i class="fas fa-file-alt sd-empty-state__icon"></i>
          <h3 class="sd-empty-state__title">What are your career dreams?</h3>
          <p class="sd-empty-state__description">
            Personal statements help us find opportunities that match YOUR interests and goals.
            Write your first statement to get started!
          </p>
          <button class="sd-btn sd-btn--primary sd-btn--lg" (click)="openCreateModal()">
            <i class="fas fa-pen-fancy"></i>
            Write Your First Statement
          </button>
        </div>
      </div>

      <!-- Statements Grid -->
      <div *ngIf="!isLoading() && statements().length" class="sd-grid sd-grid--3-col">
        <div 
          *ngFor="let stmt of statements()" 
          class="sd-card sd-card--clickable sd-card--accent-primary"
          [routerLink]="[stmt.id]">
          <div class="sd-card-body">
            <h3 class="statement-title">{{ stmt.name || 'Untitled Statement' }}</h3>
            <p class="statement-preview" *ngIf="stmt.rawText">
              {{ truncateText(stmt.rawText, 100) }}
            </p>
            <div class="sd-flex sd-flex--between sd-flex--center sd-mt-4">
              <span class="sd-badge" [class]="getStatusClass(stmt.status)">
                {{ getStatusLabel(stmt.status) }}
              </span>
              <span class="sd-text-muted sd-text-sm">
                {{ studentContext.formatDate(stmt.dateCreated) }}
              </span>
            </div>
          </div>
          <div class="sd-card-footer">
            <div class="sd-flex sd-flex--gap-2">
              <button class="sd-btn sd-btn--sm sd-btn--secondary" (click)="searchJobs($event, stmt)">
                <i class="fas fa-briefcase"></i> Jobs
              </button>
              <button class="sd-btn sd-btn--sm sd-btn--secondary" (click)="searchCourses($event, stmt)">
                <i class="fas fa-graduation-cap"></i> Courses
              </button>
              <button class="sd-btn sd-btn--sm sd-btn--secondary" (click)="searchEvents($event, stmt)">
                <i class="fas fa-calendar-alt"></i> Events
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Modal -->
      <div *ngIf="showModal()" class="sd-modal-backdrop" (click)="closeModal()">
        <div class="sd-modal" (click)="$event.stopPropagation()">
          <div class="sd-modal__header">
            <h2 class="sd-modal__title">
              <i class="fas fa-pen-fancy"></i>
              Create New Statement
            </h2>
            <button class="sd-modal__close" (click)="closeModal()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="sd-modal__body">
            <div class="sd-form-group">
              <label class="sd-form-label">Statement Name *</label>
              <input 
                type="text" 
                class="sd-form-input" 
                [(ngModel)]="newStatement.name"
                placeholder="e.g., My Healthcare Career Goals"
                maxlength="255">
              <p class="sd-form-hint">
                💡 Name it after the career field you're exploring
              </p>
            </div>
            <div class="sd-form-group">
              <label class="sd-form-label">Describe Your Dreams *</label>
              <textarea 
                class="sd-form-textarea" 
                [(ngModel)]="newStatement.rawText"
                placeholder="Tell us about your career dreams and goals. What jobs interest you? What are you good at? What kind of workplace do you imagine?"
                rows="6"
                maxlength="2000"></textarea>
              <div class="sd-form-char-count">
                {{ newStatement.rawText.length }}/2000
              </div>
            </div>
          </div>
          <div class="sd-modal__footer">
            <button class="sd-btn sd-btn--secondary" (click)="closeModal()">
              Cancel
            </button>
            <button 
              class="sd-btn sd-btn--primary" 
              (click)="createStatement()"
              [disabled]="!canCreate() || isCreating()">
              <i *ngIf="isCreating()" class="fas fa-spinner fa-spin"></i>
              {{ isCreating() ? 'Creating...' : 'Create Statement' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .statement-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1F2937;
      margin-bottom: 0.5rem;
    }

    .statement-preview {
      color: #6B7280;
      font-size: 0.9375rem;
      line-height: 1.5;
      margin: 0;
    }
  `]
})
export class StatementsListComponent implements OnInit {
  studentContext = inject(StudentContextService);

  statements = signal<PersonalStatementGETData[]>([]);
  isLoading = signal(false);
  showModal = signal(false);
  isCreating = signal(false);

  newStatement = {
    name: '',
    rawText: ''
  };

  ngOnInit() {
    this.loadStatements();
  }

  loadStatements() {
    this.isLoading.set(true);
    this.studentContext.getPersonalStatements().subscribe({
      next: (data) => {
        this.statements.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  openCreateModal() {
    this.newStatement = { name: '', rawText: '' };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  canCreate(): boolean {
    return this.newStatement.name.trim().length > 0 && 
           this.newStatement.rawText.trim().length > 0;
  }

  createStatement() {
    if (!this.canCreate()) return;

    this.isCreating.set(true);
    this.studentContext.createPersonalStatement(this.newStatement).subscribe({
      next: () => {
        this.closeModal();
        this.loadStatements();
        this.isCreating.set(false);
      },
      error: () => this.isCreating.set(false)
    });
  }

  getStatusClass(status: number | undefined): string {
    return status === 1 || status === 2 ? 'sd-badge--active' : 'sd-badge--draft';
  }

  getStatusLabel(status: number | undefined): string {
    return status === 1 || status === 2 ? 'Active' : 'Draft';
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  searchJobs(event: Event, stmt: PersonalStatementGETData) {
    event.stopPropagation();
    // Navigate to search with job filter
    window.open(`/student-dashboard2/search?type=job&statement=${stmt.id}`, '_blank');
  }

  searchCourses(event: Event, stmt: PersonalStatementGETData) {
    event.stopPropagation();
    window.open(`/student-dashboard2/search?type=course&statement=${stmt.id}`, '_blank');
  }

  searchEvents(event: Event, stmt: PersonalStatementGETData) {
    event.stopPropagation();
    window.open(`/student-dashboard2/search?type=event&statement=${stmt.id}`, '_blank');
  }
}

