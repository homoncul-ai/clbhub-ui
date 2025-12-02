import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderContextService } from '../../../shared/provider-context.service';

@Component({
  selector: 'app-team-members',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['../../../dash-provider2.styles.scss'],
  template: `
    <div>
      <h1 class="pd-page-title">
        <i class="fas fa-users icon"></i>
        Team Members
      </h1>

      <div class="pd-card">
        <div class="pd-card-header">
          <div class="pd-card-header__title">
            <i class="fas fa-users"></i>
            School Staff
          </div>
          <button class="pd-btn pd-btn--primary pd-btn--sm">
            <i class="fas fa-plus"></i>
            Add Member
          </button>
        </div>
        <div class="pd-card-body" style="padding: 0;">
          <div class="pd-empty-state">
            <i class="fas fa-users pd-empty-state__icon"></i>
            <h3 class="pd-empty-state__title">Team Member Management</h3>
            <p class="pd-empty-state__description">
              Team member functionality will be available soon. This will allow you to view and manage your school's staff members.
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TeamMembersComponent {
  providerContext = inject(ProviderContextService);
}

