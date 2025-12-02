import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProviderContextService } from '../../../shared/provider-context.service';
import { WorkQueueGETData } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-work-queues',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['../../../dash-provider2.styles.scss'],
  template: `
    <div>
      <h1 class="pd-page-title">
        <i class="fas fa-list icon"></i>
        Work Queues
      </h1>
      <p class="pd-page-subtitle">Manage work request queues for your organization</p>

      <div class="pd-card">
        <div class="pd-card-header">
          <div class="pd-card-header__title">
            <i class="fas fa-list"></i>
            Queues
          </div>
        </div>
        <div class="pd-card-body">
          <div *ngIf="isLoading()" class="pd-loading">
            <div class="pd-loading__spinner"></div>
            <p class="pd-loading__text">Loading work queues...</p>
          </div>

          <div *ngIf="!isLoading() && queues().length === 0" class="pd-empty-state">
            <i class="fas fa-list pd-empty-state__icon"></i>
            <h3 class="pd-empty-state__title">No Work Queues</h3>
            <p class="pd-empty-state__description">
              Work queues will appear here when configured for your organization.
            </p>
          </div>

          <ul class="pd-list" *ngIf="!isLoading() && queues().length > 0">
            <li class="pd-list-item" *ngFor="let queue of queues()">
              <div class="pd-list-item__content">
                <div class="pd-list-item__title">{{ queue.businessCode || 'N/A' }}</div>
                <div class="pd-list-item__subtitle">{{ queue.description || 'No description' }}</div>
                <div class="pd-list-item__meta">
                  <span class="pd-badge pd-badge--primary">
                    Active: {{ queue.stats?.openCount || 0 }}
                  </span>
                  <span class="pd-badge pd-badge--success pd-mt-2">
                    Created: {{ queue.stats?.createdCount || 0 }}
                  </span>
                </div>
              </div>
              <button class="pd-btn pd-btn--primary pd-btn--sm">
                <i class="fas fa-eye"></i>
                View
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class WorkQueuesComponent implements OnInit {
  providerContext = inject(ProviderContextService);

  queues = signal<WorkQueueGETData[]>([]);
  isLoading = signal(false);

  ngOnInit() {
    this.loadQueues();
  }

  loadQueues() {
    this.isLoading.set(true);
    this.providerContext.getWorkQueues().subscribe({
      next: (data) => {
        this.queues.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}

