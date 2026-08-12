import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProviderContextService } from '../../../shared/provider-context.service';
import { WorkRequestGETData, WorkRequestCriteria } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-work-requests-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['../../../dash-provider2.styles.scss'],
  template: `
    <div>
      <h1 class="pd-page-title">
        <i class="fas fa-tasks icon"></i>
        Work Requests
      </h1>
      <p class="pd-page-subtitle">Manage and track work requests for your organization</p>

      <div class="pd-card">
        <div class="pd-card-header">
          <div class="pd-card-header__title">
            <i class="fas fa-tasks"></i>
            All Requests
          </div>
          <a routerLink="queues" class="pd-btn pd-btn--secondary pd-btn--sm">
            <i class="fas fa-list"></i>
            View Queues
          </a>
        </div>
        <div class="pd-card-body">
          <div *ngIf="isLoading()" class="pd-loading">
            <div class="pd-loading__spinner"></div>
            <p class="pd-loading__text">Loading work requests...</p>
          </div>

          <div *ngIf="!isLoading() && requests().length === 0" class="pd-empty-state">
            <i class="fas fa-tasks pd-empty-state__icon"></i>
            <h3 class="pd-empty-state__title">No Work Requests</h3>
            <p class="pd-empty-state__description">
              Work requests from citizens and other stakeholders will appear here.
            </p>
          </div>

          <ul class="pd-list" *ngIf="!isLoading() && requests().length > 0">
            <li class="pd-list-item" *ngFor="let request of requests()">
              <div class="pd-list-item__content">
                <div class="pd-list-item__title">{{ request.businessCode || 'N/A' }}</div>
                <div class="pd-list-item__subtitle">{{ request.description || 'No description' }}</div>
                <div class="pd-list-item__meta">
                  <span class="pd-badge" [class]="getStatusBadgeClass(request.currentStateCode)">
                    {{ request.currentStateCode || 'Unknown' }}
                  </span>
                  <span class="pd-text-muted pd-text-sm pd-mt-2">
                    Created: {{ providerContext.formatDate(request.dateCreated) }}
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class WorkRequestsListComponent implements OnInit {
  providerContext = inject(ProviderContextService);

  requests = signal<WorkRequestGETData[]>([]);
  isLoading = signal(false);

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.isLoading.set(true);
    const criteria: WorkRequestCriteria = {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };

    this.providerContext.findWorkRequests(criteria).subscribe({
      next: (data) => {
        this.requests.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  getStatusBadgeClass(status?: string): string {
    switch (status) {
      case 'Open': return 'pd-badge--open';
      case 'InProgress': return 'pd-badge--in-progress';
      case 'Completed': return 'pd-badge--completed';
      case 'Cancelled': return 'pd-badge--cancelled';
      default: return 'pd-badge--primary';
    }
  }
}

