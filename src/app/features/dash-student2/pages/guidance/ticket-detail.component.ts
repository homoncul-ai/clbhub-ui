import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StudentContextService } from '../../shared/student-context.service';
import { WorkRequestGETData } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['../../dash-student2.styles.scss'],
  template: `
    <div class="sd-page">
      <!-- Breadcrumb -->
      <nav class="sd-breadcrumb">
        <a routerLink="../../" class="sd-breadcrumb__link">Guidance</a>
        <span class="sd-breadcrumb__separator">/</span>
        <span class="sd-breadcrumb__current">{{ ticket()?.businessCode || 'Ticket' }}</span>
      </nav>

      <!-- Loading -->
      <div *ngIf="isLoading()" class="sd-loading">
        <div class="sd-loading__spinner"></div>
        <p class="sd-loading__text">Loading ticket...</p>
      </div>

      <!-- Error -->
      <div *ngIf="error() && !isLoading()" class="sd-alert sd-alert--error">
        <i class="fas fa-exclamation-circle sd-alert__icon"></i>
        <div class="sd-alert__content">
          <div class="sd-alert__message">{{ error() }}</div>
        </div>
      </div>

      <!-- Content -->
      <div *ngIf="ticket() && !isLoading()">
        <!-- Header -->
        <div class="sd-flex sd-flex--between sd-flex--center sd-mb-6">
          <div>
            <div class="sd-flex sd-flex--gap-2 sd-mb-2">
              <span class="sd-badge" [class]="getStatusBadgeClass()">
                {{ ticket()?.currentStateCode }}
              </span>
            </div>
            <h1 class="sd-page-title">
              <i class="fas fa-ticket-alt icon"></i>
              {{ ticket()?.businessCode }}
            </h1>
            <p class="sd-text-muted">
              Created {{ studentContext.formatDate(ticket()?.dateCreated) }}
            </p>
          </div>
        </div>

        <!-- Ticket Details Card -->
        <div class="sd-card sd-mb-6">
          <div class="sd-card-header">
            <div class="sd-card-header__title">
              <i class="fas fa-info-circle"></i>
              Request Details
            </div>
          </div>
          <div class="sd-card-body">
            <div class="detail-row" *ngIf="ticket()?.name">
              <span class="sd-label">Title</span>
              <span class="sd-value">{{ ticket()?.name }}</span>
            </div>
            <div class="detail-row">
              <span class="sd-label">Description</span>
              <p class="sd-value" style="white-space: pre-wrap;">
                {{ ticket()?.description || 'No description provided.' }}
              </p>
            </div>
            <div class="detail-row" *ngIf="ticket()?.subjectEntityName">
              <span class="sd-label">Related To</span>
              <span class="sd-value">{{ ticket()?.subjectEntityName }}</span>
            </div>
          </div>
        </div>

        <!-- Status Timeline Placeholder -->
        <div class="sd-card">
          <div class="sd-card-header">
            <div class="sd-card-header__title">
              <i class="fas fa-history"></i>
              Activity
            </div>
          </div>
          <div class="sd-card-body">
            <div class="sd-alert sd-alert--info">
              <i class="fas fa-info-circle sd-alert__icon"></i>
              <div class="sd-alert__content">
                <div class="sd-alert__message">
                  Detailed activity timeline coming soon.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail-row {
      margin-bottom: 1.5rem;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .detail-row .sd-label {
      display: block;
      margin-bottom: 0.25rem;
    }

    .detail-row .sd-value {
      font-size: 1rem;
      color: #1F2937;
    }
  `]
})
export class TicketDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  studentContext = inject(StudentContextService);

  ticket = signal<WorkRequestGETData | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTicket(id);
    }
  }

  loadTicket(id: string) {
    this.isLoading.set(true);
    this.error.set(null);

    this.studentContext.getWorkRequestById(id).subscribe({
      next: (data) => {
        if (data) {
          this.ticket.set(data);
        } else {
          this.error.set('Ticket not found');
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load ticket');
        this.isLoading.set(false);
      }
    });
  }

  getStatusBadgeClass(): string {
    switch (this.ticket()?.currentStateCode) {
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
}

