import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProviderContextService } from '../../../shared/provider-context.service';
import { CatalogGETData } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-catalogs-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['../../../dash-provider2.styles.scss'],
  template: `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <div>
          <h1 class="pd-page-title">
            <i class="fas fa-book icon"></i>
            My Catalogs
          </h1>
          <p class="pd-page-subtitle">Manage your course, job, and event catalogs</p>
        </div>
        <button class="pd-btn pd-btn--primary">
          <i class="fas fa-plus"></i>
          New Catalog
        </button>
      </div>

      <div *ngIf="isLoading()" class="pd-loading">
        <div class="pd-loading__spinner"></div>
        <p class="pd-loading__text">Loading catalogs...</p>
      </div>

      <div *ngIf="!isLoading() && catalogs().length === 0" class="pd-card">
        <div class="pd-empty-state">
          <i class="fas fa-book pd-empty-state__icon"></i>
          <h3 class="pd-empty-state__title">No Catalogs Yet</h3>
          <p class="pd-empty-state__description">
            Create your first catalog to start offering opportunities to citizens.
          </p>
          <button class="pd-btn pd-btn--primary pd-btn--lg">
            <i class="fas fa-plus"></i>
            Create Your First Catalog
          </button>
        </div>
      </div>

      <div class="pd-grid pd-grid--3-col" *ngIf="!isLoading() && catalogs().length > 0">
        <div class="pd-card pd-card--clickable" 
             *ngFor="let catalog of catalogs()"
             [routerLink]="[catalog.id]">
          <div class="pd-card-header">
            <div class="pd-card-header__title">
              <i class="fas fa-book"></i>
              {{ catalog.name }}
            </div>
          </div>
          <div class="pd-card-body">
            <p class="pd-text-muted pd-mb-4">{{ catalog.description || 'No description' }}</p>
            <div class="pd-grid pd-grid--2-col">
              <div style="text-align: center;">
                <div style="font-size: 2rem; font-weight: 700; color: #2563EB;">
                  {{ catalog.stats?.entryCount || 0 }}
                </div>
                <div class="pd-text-muted pd-text-sm">Entries</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 2rem; font-weight: 700; color: #059669;">
                  {{ catalog.stats?.interestCount || 0 }}
                </div>
                <div class="pd-text-muted pd-text-sm">Interests</div>
              </div>
            </div>
          </div>
          <div class="pd-card-footer">
            <small class="pd-text-muted">
              Updated: {{ providerContext.formatDate(catalog.dateLastUpdated) }}
            </small>
            <div>
              <button class="pd-btn pd-btn--ghost pd-btn--sm" (click)="$event.stopPropagation()">
                <i class="fas fa-edit"></i>
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CatalogsListComponent implements OnInit {
  providerContext = inject(ProviderContextService);

  catalogs = signal<CatalogGETData[]>([]);
  isLoading = signal(false);

  ngOnInit() {
    this.loadCatalogs();
  }

  loadCatalogs() {
    this.isLoading.set(true);
    this.providerContext.getCatalogs(true).subscribe({
      next: (data) => {
        this.catalogs.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}

