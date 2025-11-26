import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StudentContextService } from '../../shared/student-context.service';
import { WorkRequestDashboardUIGETData, WorkRequestGETData } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-guidance',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  styleUrls: ['../../dash-student2.styles.scss'],
  template: `
    <div class="sd-page">
      <!-- Header -->
      <div class="sd-flex sd-flex--between sd-flex--center sd-mb-6">
        <div>
          <h1 class="sd-page-title">
            <i class="fas fa-life-ring icon"></i>
            Guidance & Support
          </h1>
          <p class="sd-page-subtitle">
            Get help from your guidance team
          </p>
        </div>
        <button class="sd-btn sd-btn--primary" (click)="openRequestModal()">
          <i class="fas fa-plus"></i>
          Request Help
        </button>
      </div>

      <!-- Loading -->
      <div *ngIf="isLoading()" class="sd-loading">
        <div class="sd-loading__spinner"></div>
        <p class="sd-loading__text">Loading support data...</p>
      </div>

      <div *ngIf="!isLoading()">
        <!-- Stats Cards -->
        <div class="sd-grid sd-grid--4-col sd-mb-6">
          <div class="sd-stat-card">
            <div class="sd-stat-card__value sd-stat-card__value--warning">
              {{ getStatCount('Open') }}
            </div>
            <div class="sd-stat-card__label">Open Requests</div>
          </div>
          <div class="sd-stat-card">
            <div class="sd-stat-card__value sd-stat-card__value--primary">
              {{ getStatCount('InProgress') }}
            </div>
            <div class="sd-stat-card__label">In Progress</div>
          </div>
          <div class="sd-stat-card">
            <div class="sd-stat-card__value sd-stat-card__value--success">
              {{ getStatCount('Completed') }}
            </div>
            <div class="sd-stat-card__label">Completed</div>
          </div>
          <div class="sd-stat-card">
            <div class="sd-stat-card__value" style="color: #6B7280;">
              {{ getStatCount('Cancelled') }}
            </div>
            <div class="sd-stat-card__label">Cancelled</div>
          </div>
        </div>

        <!-- Two Column Layout -->
        <div class="sd-grid sd-grid--2-col">
          <!-- Recent Tickets -->
          <div class="sd-card">
            <div class="sd-card-header">
              <div class="sd-card-header__title">
                <i class="fas fa-ticket-alt"></i>
                Recent Requests
              </div>
            </div>
            <div class="sd-card-body" style="padding: 0;">
              <ul class="sd-list" *ngIf="recentTickets().length">
                <li 
                  *ngFor="let ticket of recentTickets()" 
                  class="sd-list-item sd-list-item--clickable"
                  [routerLink]="['tickets', ticket.id]">
                  <div class="sd-list-item__content">
                    <div class="sd-flex sd-flex--between sd-flex--center">
                      <span class="sd-list-item__title">{{ ticket.businessCode }}</span>
                      <span class="sd-badge" [class]="getTicketBadgeClass(ticket)">
                        {{ ticket.currentStateCode }}
                      </span>
                    </div>
                    <div class="sd-list-item__subtitle">
                      {{ truncate(ticket.description, 60) }}
                    </div>
                    <div class="sd-list-item__meta">
                      Created {{ studentContext.formatDate(ticket.dateCreated) }}
                    </div>
                  </div>
                  <i class="fas fa-chevron-right sd-text-muted"></i>
                </li>
              </ul>
              <div *ngIf="!recentTickets().length" class="sd-p-6 sd-text-center sd-text-muted">
                No support requests yet
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="sd-card">
            <div class="sd-card-header">
              <div class="sd-card-header__title">
                <i class="fas fa-bolt"></i>
                How Can We Help?
              </div>
            </div>
            <div class="sd-card-body">
              <div class="help-option" (click)="openRequestModal('career')">
                <div class="help-option__icon" style="background: #DBEAFE; color: #2563EB;">
                  <i class="fas fa-compass"></i>
                </div>
                <div class="help-option__content">
                  <h4 class="help-option__title">Career Advice</h4>
                  <p class="help-option__description">
                    Get guidance on career paths and opportunities
                  </p>
                </div>
                <i class="fas fa-chevron-right sd-text-muted"></i>
              </div>
              
              <div class="help-option" (click)="openRequestModal('resume')">
                <div class="help-option__icon" style="background: #D1FAE5; color: #059669;">
                  <i class="fas fa-file-alt"></i>
                </div>
                <div class="help-option__content">
                  <h4 class="help-option__title">Resume Review</h4>
                  <p class="help-option__description">
                    Get feedback on your resume
                  </p>
                </div>
                <i class="fas fa-chevron-right sd-text-muted"></i>
              </div>
              
              <div class="help-option" (click)="openRequestModal('general')">
                <div class="help-option__icon" style="background: #FEF3C7; color: #D97706;">
                  <i class="fas fa-question-circle"></i>
                </div>
                <div class="help-option__content">
                  <h4 class="help-option__title">General Question</h4>
                  <p class="help-option__description">
                    Ask anything else
                  </p>
                </div>
                <i class="fas fa-chevron-right sd-text-muted"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Request Help Modal -->
      <div *ngIf="showModal()" class="sd-modal-backdrop" (click)="closeModal()">
        <div class="sd-modal" (click)="$event.stopPropagation()">
          <div class="sd-modal__header">
            <h2 class="sd-modal__title">
              <i class="fas fa-hands-helping"></i>
              Request Help
            </h2>
            <button class="sd-modal__close" (click)="closeModal()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="sd-modal__body">
            <div class="sd-form-group">
              <label class="sd-form-label">What do you need help with? *</label>
              <input 
                type="text" 
                class="sd-form-input" 
                [(ngModel)]="newRequest.title"
                placeholder="e.g., Career advice for electrician path"
                maxlength="255">
            </div>
            <div class="sd-form-group">
              <label class="sd-form-label">Tell us more *</label>
              <textarea 
                class="sd-form-textarea" 
                [(ngModel)]="newRequest.description"
                placeholder="Describe what you need help with. The more details you provide, the better we can assist you."
                rows="5"
                maxlength="2000"></textarea>
              <div class="sd-form-char-count">
                {{ newRequest.description.length }}/2000
              </div>
            </div>
          </div>
          <div class="sd-modal__footer">
            <button class="sd-btn sd-btn--secondary" (click)="closeModal()">
              Cancel
            </button>
            <button 
              class="sd-btn sd-btn--primary" 
              (click)="submitRequest()"
              [disabled]="!canSubmit() || isSubmitting()">
              <i *ngIf="isSubmitting()" class="fas fa-spinner fa-spin"></i>
              {{ isSubmitting() ? 'Sending...' : 'Send Request' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .help-option {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      margin-bottom: 0.75rem;
      background: #F9FAFB;
      border-radius: 0.75rem;
      cursor: pointer;
      transition: all 0.15s ease;

      &:last-child {
        margin-bottom: 0;
      }

      &:hover {
        background: #F3F4F6;
      }
    }

    .help-option__icon {
      width: 48px;
      height: 48px;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .help-option__content {
      flex: 1;
    }

    .help-option__title {
      font-weight: 600;
      color: #1F2937;
      margin: 0 0 0.25rem 0;
    }

    .help-option__description {
      font-size: 0.875rem;
      color: #6B7280;
      margin: 0;
    }
  `]
})
export class GuidanceComponent implements OnInit {
  studentContext = inject(StudentContextService);

  guidanceData = signal<WorkRequestDashboardUIGETData | null>(null);
  isLoading = signal(false);
  showModal = signal(false);
  isSubmitting = signal(false);

  newRequest = {
    title: '',
    description: ''
  };

  ngOnInit() {
    this.loadGuidanceData();
  }

  loadGuidanceData() {
    this.isLoading.set(true);
    this.studentContext.getGuidanceData().subscribe({
      next: (data) => {
        this.guidanceData.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  getStatCount(stateCode: string): number {
    const stats = this.guidanceData()?.mapStats;
    if (!stats) return 0;
    return stats[stateCode]?.itemCount || 0;
  }

  recentTickets(): WorkRequestGETData[] {
    return this.guidanceData()?.recentWorkRequests?.searchResults || [];
  }

  getTicketBadgeClass(ticket: WorkRequestGETData): string {
    switch (ticket.currentStateCode) {
      case 'Open':
        return 'sd-badge--open';
      case 'InProgress':
        return 'sd-badge--pending';
      case 'Completed':
        return 'sd-badge--completed';
      case 'Cancelled':
        return 'sd-badge--cancelled';
      default:
        return 'sd-badge--draft';
    }
  }

  truncate(text: string | undefined, maxLength: number): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  openRequestModal(type?: string) {
    this.newRequest = { title: '', description: '' };
    
    // Pre-fill based on type
    if (type === 'career') {
      this.newRequest.title = 'Career Advice Request';
    } else if (type === 'resume') {
      this.newRequest.title = 'Resume Review Request';
    }
    
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  canSubmit(): boolean {
    return this.newRequest.title.trim().length > 0 && 
           this.newRequest.description.trim().length > 0;
  }

  submitRequest() {
    if (!this.canSubmit()) return;

    this.isSubmitting.set(true);
    this.studentContext.createGuidanceTicket(this.newRequest).subscribe({
      next: () => {
        this.closeModal();
        this.loadGuidanceData();
        this.isSubmitting.set(false);
      },
      error: () => this.isSubmitting.set(false)
    });
  }
}

