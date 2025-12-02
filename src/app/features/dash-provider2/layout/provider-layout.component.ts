import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ProviderContextService } from '../shared/provider-context.service';

@Component({
  selector: 'app-provider-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  styleUrls: ['../dash-provider2.styles.scss'],
  template: `
    <div class="pd-page">
      <div class="pd-card">
        <div class="pd-card-header">
          <div class="pd-card-header__title">
            <i class="fas fa-building"></i>
            Provider Dashboard
          </div>
          <div>
            <span *ngIf="isLoading()" class="pd-loading__text">Loading...</span>
            <span *ngIf="error()" class="pd-alert pd-alert--error">
              {{ error() }}
            </span>
            <span *ngIf="organization()" class="pd-text-muted">
              {{ organization()?.name }}
            </span>
          </div>
        </div>
        <div class="pd-card-body" style="padding: 0;">
          <nav style="display: flex; gap: 1rem; padding: 1rem; border-bottom: 1px solid #E5E7EB; flex-wrap: wrap;">
            <a routerLink="dashboard" routerLinkActive="active" 
               [routerLinkActiveOptions]="{exact: false}"
               style="padding: 0.5rem 1rem; text-decoration: none; color: #4B5563; border-radius: 0.5rem; transition: all 0.2s;"
               [style.background-color]="isActive('dashboard') ? '#DBEAFE' : 'transparent'"
               [style.color]="isActive('dashboard') ? '#2563EB' : '#4B5563'">
              <i class="fas fa-tachometer-alt"></i> Dashboard
            </a>
            <a routerLink="organization/school" routerLinkActive="active"
               style="padding: 0.5rem 1rem; text-decoration: none; color: #4B5563; border-radius: 0.5rem; transition: all 0.2s;"
               [style.background-color]="isActive('organization') ? '#DBEAFE' : 'transparent'"
               [style.color]="isActive('organization') ? '#2563EB' : '#4B5563'">
              <i class="fas fa-building"></i> My Organization
            </a>
            <a routerLink="workrequests" routerLinkActive="active"
               style="padding: 0.5rem 1rem; text-decoration: none; color: #4B5563; border-radius: 0.5rem; transition: all 0.2s;"
               [style.background-color]="isActive('workrequests') ? '#DBEAFE' : 'transparent'"
               [style.color]="isActive('workrequests') ? '#2563EB' : '#4B5563'">
              <i class="fas fa-tasks"></i> Work Requests
            </a>
            <a routerLink="catalogs" routerLinkActive="active"
               style="padding: 0.5rem 1rem; text-decoration: none; color: #4B5563; border-radius: 0.5rem; transition: all 0.2s;"
               [style.background-color]="isActive('catalogs') ? '#DBEAFE' : 'transparent'"
               [style.color]="isActive('catalogs') ? '#2563EB' : '#4B5563'">
              <i class="fas fa-book"></i> Catalogs
            </a>
          </nav>
          <div style="padding: 1.5rem;">
            <router-outlet></router-outlet>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProviderLayoutComponent implements OnInit {
  private providerContext = inject(ProviderContextService);
  
  // Use computed signals from the service
  isLoading = this.providerContext.isLoading;
  error = this.providerContext.error;
  organization = this.providerContext.organization;

  ngOnInit() {
    this.providerContext.loadDashboardData().subscribe();
  }

  isActive(path: string): boolean {
    // Simple check - could be improved with Router service
    return window.location.pathname.includes(path);
  }
}

