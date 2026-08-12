import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProviderContextService } from '../../shared/provider-context.service';
import { CatalogGETData, WorkRequestDashboardUIGETData, EntityStateStatGETData } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['../../dash-provider2.styles.scss'],
  template: `
    <div>
      <h1 class="pd-page-title">
        <i class="fas fa-tachometer-alt icon"></i>
        Provider Dashboard
      </h1>
      <p class="pd-page-subtitle">Overview of your organization's activity and metrics</p>

      <div *ngIf="providerContext.isLoading()" class="pd-loading">
        <div class="pd-loading__spinner"></div>
        <p class="pd-loading__text">Loading dashboard data...</p>
      </div>

      <div *ngIf="providerContext.error() && !providerContext.isLoading()" class="pd-alert pd-alert--error">
        <i class="fas fa-exclamation-circle pd-alert__icon"></i>
        <div class="pd-alert__content">
          <div class="pd-alert__title">Error</div>
          <div class="pd-alert__message">{{ providerContext.error() }}</div>
        </div>
      </div>

      <div *ngIf="!providerContext.isLoading() && !providerContext.error()">
        <!-- Statistics Cards -->
        <div class="pd-grid pd-grid--4-col pd-mb-6">
          <div class="pd-stat-card">
            <div class="pd-stat-card__value pd-stat-card__value--primary">
              {{ getProviderRequestStats('New')?.itemCount || 0 }}
            </div>
            <div class="pd-stat-card__label">New Requests</div>
          </div>
          <div class="pd-stat-card">
            <div class="pd-stat-card__value pd-stat-card__value--warning">
              {{ getProviderRequestStats('InProgress')?.itemCount || 0 }}
            </div>
            <div class="pd-stat-card__label">In Progress</div>
          </div>
          <div class="pd-stat-card">
            <div class="pd-stat-card__value pd-stat-card__value--success">
              {{ getProviderRequestStats('Completed')?.itemCount || 0 }}
            </div>
            <div class="pd-stat-card__label">Completed</div>
          </div>
          <div class="pd-stat-card">
            <div class="pd-stat-card__value" style="color: #3B82F6;">
              {{ catalogs().length }}
            </div>
            <div class="pd-stat-card__label">Total Catalogs</div>
          </div>
        </div>

        <!-- Two Column Layout -->
        <div class="pd-grid pd-grid--2-col">
          <!-- Catalog Interests Chart Placeholder -->
          <div class="pd-card">
            <div class="pd-card-header">
              <div class="pd-card-header__title">
                <i class="fas fa-chart-bar"></i>
                Catalog Performance
              </div>
            </div>
            <div class="pd-card-body">
              <div *ngIf="catalogs().length === 0" class="pd-empty-state">
                <i class="fas fa-chart-bar pd-empty-state__icon"></i>
                <h3 class="pd-empty-state__title">No Catalogs Yet</h3>
                <p class="pd-empty-state__description">
                  Create your first catalog to see performance metrics here.
                </p>
                <a routerLink="../catalogs" class="pd-btn pd-btn--primary">
                  <i class="fas fa-plus"></i>
                  Create Catalog
                </a>
              </div>
              <div *ngIf="catalogs().length > 0">
                <p class="pd-text-muted">Chart visualization coming soon</p>
                <div class="pd-list">
                  <div class="pd-list-item" *ngFor="let catalog of catalogs().slice(0, 5)">
                    <div class="pd-list-item__content">
                      <div class="pd-list-item__title">{{ catalog.name }}</div>
                      <div class="pd-list-item__subtitle">
                        {{ catalog.stats?.entryCount || 0 }} entries, 
                        {{ catalog.stats?.interestCount || 0 }} interests
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Available Catalogs -->
          <div class="pd-card">
            <div class="pd-card-header">
              <div class="pd-card-header__title">
                <i class="fas fa-book"></i>
                Available Catalogs
              </div>
              <a routerLink="../catalogs" class="pd-btn pd-btn--ghost pd-btn--sm">
                View All <i class="fas fa-arrow-right"></i>
              </a>
            </div>
            <div class="pd-card-body" style="padding: 0;">
              <div *ngIf="catalogs().length === 0" class="pd-empty-state">
                <i class="fas fa-book pd-empty-state__icon"></i>
                <h3 class="pd-empty-state__title">No Catalogs</h3>
                <p class="pd-empty-state__description">
                  Create your first catalog to start offering opportunities to citizens.
                </p>
                <a routerLink="../catalogs" class="pd-btn pd-btn--primary">
                  <i class="fas fa-plus"></i>
                  Create Catalog
                </a>
              </div>
              <ul class="pd-list" *ngIf="catalogs().length > 0">
                <li class="pd-list-item pd-list-item--clickable" 
                    *ngFor="let catalog of catalogs().slice(0, 5)"
                    [routerLink]="['../catalogs', catalog.id]">
                  <div class="pd-list-item__content">
                    <div class="pd-list-item__title">{{ catalog.name }}</div>
                    <div class="pd-list-item__subtitle">{{ catalog.description || 'No description' }}</div>
                    <div class="pd-list-item__meta">
                      <span class="pd-badge pd-badge--primary">{{ catalog.stats?.entryCount || 0 }} entries</span>
                    </div>
                  </div>
                  <i class="fas fa-chevron-right pd-text-muted"></i>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardHomeComponent implements OnInit {
  providerContext = inject(ProviderContextService);

  catalogs = signal<CatalogGETData[]>([]);
  workRequestData = signal<WorkRequestDashboardUIGETData | null>(null);
  isLoadingCatalogs = signal(false);

  ngOnInit() {
    this.loadCatalogs();
    this.loadWorkRequestData();
  }

  loadCatalogs() {
    this.isLoadingCatalogs.set(true);
    this.providerContext.getCatalogs(true).subscribe({
      next: (data) => {
        this.catalogs.set(data);
        this.isLoadingCatalogs.set(false);
      },
      error: () => this.isLoadingCatalogs.set(false)
    });
  }

  loadWorkRequestData() {
    this.providerContext.getWorkRequestDashboardData().subscribe({
      next: (data) => {
        this.workRequestData.set(data);
      }
    });
  }

  getProviderRequestStats(stateCode: string): EntityStateStatGETData | null {
    const data = this.workRequestData();
    if (!data?.mapStats) return { itemCount: 0, stateCode, stateLabel: stateCode };
    return data.mapStats[stateCode] || { itemCount: 0, stateCode, stateLabel: stateCode };
  }
}

