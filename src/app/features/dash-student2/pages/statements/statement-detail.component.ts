import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StudentContextService } from '../../shared/student-context.service';
import { PersonalStatementGETData } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-statement-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  styleUrls: ['../../dash-student2.styles.scss'],
  template: `
    <div class="sd-page">
      <!-- Breadcrumb -->
      <nav class="sd-breadcrumb">
        <a routerLink="../" class="sd-breadcrumb__link">Statements</a>
        <span class="sd-breadcrumb__separator">/</span>
        <span class="sd-breadcrumb__current">{{ statement()?.name || 'Details' }}</span>
      </nav>

      <!-- Loading -->
      <div *ngIf="isLoading()" class="sd-loading">
        <div class="sd-loading__spinner"></div>
        <p class="sd-loading__text">Loading statement...</p>
      </div>

      <!-- Error -->
      <div *ngIf="error() && !isLoading()" class="sd-alert sd-alert--error">
        <i class="fas fa-exclamation-circle sd-alert__icon"></i>
        <div class="sd-alert__content">
          <div class="sd-alert__message">{{ error() }}</div>
        </div>
      </div>

      <!-- Content -->
      <div *ngIf="statement() && !isLoading()">
        <!-- Header -->
        <div class="sd-flex sd-flex--between sd-flex--center sd-mb-6">
          <div>
            <h1 class="sd-page-title">
              <i class="fas fa-file-alt icon"></i>
              {{ statement()?.name }}
            </h1>
            <div class="sd-flex sd-flex--gap-4 sd-flex--center">
              <span class="sd-badge" [class]="getStatusClass(statement()?.status)">
                {{ getStatusLabel(statement()?.status) }}
              </span>
              <span class="sd-text-muted">
                Created {{ studentContext.formatDate(statement()?.dateCreated) }}
              </span>
            </div>
          </div>
          <div class="sd-flex sd-flex--gap-2">
            <button class="sd-btn sd-btn--secondary" (click)="toggleEdit()">
              <i class="fas fa-edit"></i>
              {{ isEditing() ? 'Cancel' : 'Edit' }}
            </button>
            <button class="sd-btn sd-btn--danger sd-btn--ghost" (click)="confirmDelete()">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>

        <!-- Statement Content -->
        <div class="sd-card sd-mb-6">
          <div class="sd-card-header">
            <div class="sd-card-header__title">
              <i class="fas fa-pen-fancy"></i>
              My Career Dreams
            </div>
          </div>
          <div class="sd-card-body">
            <!-- View Mode -->
            <div *ngIf="!isEditing()">
              <p class="statement-text">{{ statement()?.rawText || 'No content yet.' }}</p>
            </div>

            <!-- Edit Mode -->
            <div *ngIf="isEditing()">
              <div class="sd-form-group">
                <label class="sd-form-label">Statement Name</label>
                <input 
                  type="text" 
                  class="sd-form-input" 
                  [(ngModel)]="editData.name"
                  maxlength="255">
              </div>
              <div class="sd-form-group">
                <label class="sd-form-label">Your Dreams & Goals</label>
                <textarea 
                  class="sd-form-textarea" 
                  [(ngModel)]="editData.rawText"
                  rows="8"
                  maxlength="2000"></textarea>
                <div class="sd-form-char-count">
                  {{ editData.rawText.length }}/2000
                </div>
              </div>
              <div class="sd-flex sd-flex--gap-2">
                <button class="sd-btn sd-btn--primary" (click)="saveChanges()" [disabled]="isSaving()">
                  <i *ngIf="isSaving()" class="fas fa-spinner fa-spin"></i>
                  {{ isSaving() ? 'Saving...' : 'Save Changes' }}
                </button>
                <button class="sd-btn sd-btn--secondary" (click)="toggleEdit()">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Find Opportunities -->
        <div class="sd-card">
          <div class="sd-card-header">
            <div class="sd-card-header__title">
              <i class="fas fa-search"></i>
              Find Matching Opportunities
            </div>
          </div>
          <div class="sd-card-body">
            <p class="sd-text-muted sd-mb-4">
              Based on your career statement, we can help you find opportunities that match your interests.
            </p>
            <div class="sd-grid sd-grid--3-col">
              <button class="sd-action-card" (click)="searchJobs()">
                <div class="sd-action-card__icon" style="background: #FEF3C7; color: #D97706;">
                  <i class="fas fa-briefcase"></i>
                </div>
                <div class="sd-action-card__title">Find Jobs</div>
                <div class="sd-action-card__description">
                  Discover job opportunities
                </div>
              </button>
              <button class="sd-action-card" (click)="searchCourses()">
                <div class="sd-action-card__icon" style="background: #CFFAFE; color: #0891B2;">
                  <i class="fas fa-graduation-cap"></i>
                </div>
                <div class="sd-action-card__title">Find Courses</div>
                <div class="sd-action-card__description">
                  Learn new skills
                </div>
              </button>
              <button class="sd-action-card" (click)="searchEvents()">
                <div class="sd-action-card__icon" style="background: #F3E8FF; color: #9333EA;">
                  <i class="fas fa-calendar-alt"></i>
                </div>
                <div class="sd-action-card__title">Find Events</div>
                <div class="sd-action-card__description">
                  Attend career events
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div *ngIf="showDeleteModal()" class="sd-modal-backdrop" (click)="showDeleteModal.set(false)">
        <div class="sd-modal" (click)="$event.stopPropagation()">
          <div class="sd-modal__header">
            <h2 class="sd-modal__title">Delete Statement?</h2>
            <button class="sd-modal__close" (click)="showDeleteModal.set(false)">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="sd-modal__body">
            <p>"{{ statement()?.name }}" will be permanently deleted. This cannot be undone.</p>
          </div>
          <div class="sd-modal__footer">
            <button class="sd-btn sd-btn--secondary" (click)="showDeleteModal.set(false)">
              Cancel
            </button>
            <button class="sd-btn sd-btn--danger" (click)="deleteStatement()" [disabled]="isDeleting()">
              <i *ngIf="isDeleting()" class="fas fa-spinner fa-spin"></i>
              {{ isDeleting() ? 'Deleting...' : 'Delete Statement' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .statement-text {
      font-size: 1.0625rem;
      line-height: 1.75;
      color: #374151;
      white-space: pre-wrap;
    }
  `]
})
export class StatementDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  studentContext = inject(StudentContextService);

  statement = signal<PersonalStatementGETData | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);
  isEditing = signal(false);
  isSaving = signal(false);
  showDeleteModal = signal(false);
  isDeleting = signal(false);

  editData = { name: '', rawText: '' };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadStatement(id);
    }
  }

  loadStatement(id: string) {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.studentContext.getPersonalStatementById(id).subscribe({
      next: (data) => {
        if (data) {
          this.statement.set(data);
          this.editData = { 
            name: data.name || '', 
            rawText: data.rawText || '' 
          };
        } else {
          this.error.set('Statement not found');
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load statement');
        this.isLoading.set(false);
      }
    });
  }

  toggleEdit() {
    if (this.isEditing()) {
      // Reset edit data when canceling
      this.editData = {
        name: this.statement()?.name || '',
        rawText: this.statement()?.rawText || ''
      };
    }
    this.isEditing.set(!this.isEditing());
  }

  saveChanges() {
    const id = this.statement()?.id;
    if (!id) return;

    this.isSaving.set(true);
    this.studentContext.updatePersonalStatement(id, this.editData).subscribe({
      next: () => {
        this.loadStatement(id);
        this.isEditing.set(false);
        this.isSaving.set(false);
      },
      error: () => this.isSaving.set(false)
    });
  }

  confirmDelete() {
    this.showDeleteModal.set(true);
  }

  deleteStatement() {
    const id = this.statement()?.id;
    if (!id) return;

    this.isDeleting.set(true);
    this.studentContext.deletePersonalStatement(id).subscribe({
      next: () => {
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: () => this.isDeleting.set(false)
    });
  }

  getStatusClass(status: number | undefined): string {
    return status === 1 || status === 2 ? 'sd-badge--active' : 'sd-badge--draft';
  }

  getStatusLabel(status: number | undefined): string {
    return status === 1 || status === 2 ? 'Active' : 'Draft';
  }

  searchJobs() {
    window.open(`/student-dashboard2/search?type=job&statement=${this.statement()?.id}`, '_blank');
  }

  searchCourses() {
    window.open(`/student-dashboard2/search?type=course&statement=${this.statement()?.id}`, '_blank');
  }

  searchEvents() {
    window.open(`/student-dashboard2/search?type=event&statement=${this.statement()?.id}`, '_blank');
  }
}

