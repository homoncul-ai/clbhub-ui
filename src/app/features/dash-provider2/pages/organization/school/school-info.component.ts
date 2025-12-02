import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderContextService } from '../../../shared/provider-context.service';

@Component({
  selector: 'app-school-info',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['../../../dash-provider2.styles.scss'],
  template: `
    <div>
      <h1 class="pd-page-title">
        <i class="fas fa-school icon"></i>
        My School Information
      </h1>

      <div *ngIf="providerContext.isLoading()" class="pd-loading">
        <div class="pd-loading__spinner"></div>
        <p class="pd-loading__text">Loading school information...</p>
      </div>

      <div *ngIf="providerContext.error() && !providerContext.isLoading()" class="pd-alert pd-alert--error">
        <i class="fas fa-exclamation-circle pd-alert__icon"></i>
        <div class="pd-alert__content">
          <div class="pd-alert__title">Error</div>
          <div class="pd-alert__message">{{ providerContext.error() }}</div>
        </div>
      </div>

      <div *ngIf="!providerContext.isLoading() && !providerContext.error()">
        <div class="pd-card">
          <div class="pd-card-header">
            <div class="pd-card-header__title">
              <i class="fas fa-building"></i>
              School Details
            </div>
            <button class="pd-btn pd-btn--secondary pd-btn--sm">
              <i class="fas fa-edit"></i>
              Edit
            </button>
          </div>
          <div class="pd-card-body">
            <div class="pd-grid pd-grid--2-col">
              <div>
                <dl>
                  <dt class="pd-form-label">School Name</dt>
                  <dd class="pd-mb-4">{{ providerContext.organization()?.name || 'N/A' }}</dd>

                  <dt class="pd-form-label">Business Code</dt>
                  <dd class="pd-mb-4">{{ providerContext.organization()?.businessCode || 'N/A' }}</dd>

                  <dt class="pd-form-label">Organization Type</dt>
                  <dd class="pd-mb-4">{{ providerContext.organization()?.organizationTypeId || 'N/A' }}</dd>
                </dl>
              </div>
              <div>
                <dl>
                  <dt class="pd-form-label">Website</dt>
                  <dd class="pd-mb-4">
                    <a *ngIf="providerContext.organization()?.websiteUrl" 
                       [href]="providerContext.organization()?.websiteUrl" 
                       target="_blank"
                       class="pd-btn pd-btn--ghost pd-btn--sm">
                      {{ providerContext.organization()?.websiteUrl }}
                      <i class="fas fa-external-link-alt"></i>
                    </a>
                    <span *ngIf="!providerContext.organization()?.websiteUrl">N/A</span>
                  </dd>

                  <dt class="pd-form-label">Description</dt>
                  <dd class="pd-mb-4 pd-text-muted">
                    {{ providerContext.organization()?.description || 'No description provided' }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SchoolInfoComponent {
  providerContext = inject(ProviderContextService);
}

