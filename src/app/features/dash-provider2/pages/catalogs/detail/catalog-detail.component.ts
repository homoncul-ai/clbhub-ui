import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProviderContextService } from '../../../shared/provider-context.service';
import { CatalogGETData, CatalogEntryGETData } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-catalog-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['../../../dash-provider2.styles.scss'],
  template: `
    <div>
      <div style="margin-bottom: 1rem;">
        <a routerLink="../" class="pd-btn pd-btn--ghost pd-btn--sm">
          <i class="fas fa-arrow-left"></i>
          Back to Catalogs
        </a>
      </div>

      <div *ngIf="loading()" class="pd-loading">
        <div class="pd-loading__spinner"></div>
        <p class="pd-loading__text">Loading catalog details...</p>
      </div>

      <div *ngIf="error() && !loading()" class="pd-alert pd-alert--error">
        <i class="fas fa-exclamation-circle pd-alert__icon"></i>
        <div class="pd-alert__content">
          <div class="pd-alert__title">Error</div>
          <div class="pd-alert__message">{{ error() }}</div>
        </div>
      </div>

      <div *ngIf="!loading() && !error() && catalog()">
        <h1 class="pd-page-title">
          <i class="fas fa-book icon"></i>
          {{ catalog()?.name }}
        </h1>
        <p class="pd-page-subtitle">{{ catalog()?.description || 'No description' }}</p>

        <div class="pd-card pd-mb-6">
          <div class="pd-card-header">
            <div class="pd-card-header__title">
              <i class="fas fa-info-circle"></i>
              Catalog Information
            </div>
            <button class="pd-btn pd-btn--secondary pd-btn--sm">
              <i class="fas fa-edit"></i>
              Edit Catalog
            </button>
          </div>
          <div class="pd-card-body">
            <div class="pd-grid pd-grid--2-col">
              <div>
                <dl>
                  <dt class="pd-form-label">Business Code</dt>
                  <dd class="pd-mb-4">{{ catalog()?.businessCode || 'N/A' }}</dd>
                  <dt class="pd-form-label">Entry Count</dt>
                  <dd class="pd-mb-4">{{ catalog()?.stats?.entryCount || 0 }}</dd>
                </dl>
              </div>
              <div>
                <dl>
                  <dt class="pd-form-label">Interest Count</dt>
                  <dd class="pd-mb-4">{{ catalog()?.stats?.interestCount || 0 }}</dd>
                  <dt class="pd-form-label">Last Updated</dt>
                  <dd class="pd-mb-4">{{ providerContext.formatDate(catalog()?.dateLastUpdated) }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="pd-card">
          <div class="pd-card-header">
            <div class="pd-card-header__title">
              <i class="fas fa-list"></i>
              Catalog Entries
            </div>
            <button class="pd-btn pd-btn--primary pd-btn--sm">
              <i class="fas fa-plus"></i>
              Add Entry
            </button>
          </div>
          <div class="pd-card-body">
            <div *ngIf="entries().length === 0" class="pd-empty-state">
              <i class="fas fa-list pd-empty-state__icon"></i>
              <h3 class="pd-empty-state__title">No Entries</h3>
              <p class="pd-empty-state__description">
                Add entries to this catalog to make them available to students.
              </p>
              <button class="pd-btn pd-btn--primary">
                <i class="fas fa-plus"></i>
                Add First Entry
              </button>
            </div>
            <ul class="pd-list" *ngIf="entries().length > 0">
              <li class="pd-list-item" *ngFor="let entry of entries()">
                <div class="pd-list-item__content">
                  <div class="pd-list-item__title">{{ entry.title || 'Untitled Entry' }}</div>
                  <div class="pd-list-item__subtitle">{{ entry.shortDescription || 'No description' }}</div>
                  <div class="pd-list-item__meta">
                    <span class="pd-badge" [class.pd-badge--success]="entry.available === 1" 
                          [class.pd-badge--cancelled]="entry.available !== 1">
                      {{ entry.available === 1 ? 'Available' : 'Not Available' }}
                    </span>
                  </div>
                </div>
                <button class="pd-btn pd-btn--ghost pd-btn--sm">
                  <i class="fas fa-edit"></i>
                  Edit
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CatalogDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  providerContext = inject(ProviderContextService);

  catalogId: string | null = null;
  catalog = signal<CatalogGETData | null>(null);
  entries = signal<CatalogEntryGETData[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.catalogId = this.route.snapshot.paramMap.get('id');
    if (this.catalogId) {
      this.loadCatalog();
      this.loadEntries();
    } else {
      this.error.set('No catalog ID provided');
    }
  }

  loadCatalog() {
    this.loading.set(true);
    this.providerContext.getCatalogs(true).subscribe({
      next: (catalogs) => {
        const found = catalogs.find(c => c.id === this.catalogId);
        if (found) {
          this.catalog.set(found);
        } else {
          this.error.set('Catalog not found');
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load catalog');
        this.loading.set(false);
      }
    });
  }

  loadEntries() {
    if (!this.catalogId) return;
    this.providerContext.getCatalogEntries(this.catalogId).subscribe({
      next: (data) => {
        this.entries.set(data);
      }
    });
  }
}

