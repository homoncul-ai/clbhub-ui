import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { HcclService, FamilyParentDashUIGETData } from '@app/restsvc/hccl.service';
import { FamilyunitComponent } from '@app/components/_crud/hccluserprofile/familyunit-component';

@Component({
  selector: 'app-dash-parent-home',
  standalone: true,
  imports: [CommonModule, FamilyunitComponent],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h4 class="mb-0">
                <i class="fas fa-tachometer-alt me-2"></i>
                Parent Dashboard
              </h4>
            </div>
            <div class="card-body">
              <!-- Loading state -->
              <div *ngIf="loading" class="text-center py-5">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading parent dashboard...</p>
              </div>

              <!-- Error state -->
              <div *ngIf="error && !loading" class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ error }}
              </div>

              <!-- Content -->
              <div *ngIf="!loading && !error && dashData">
                <div class="mb-4" *ngIf="dashData.family">
                  <h5 class="mb-3">
                    <i class="fas fa-users me-2"></i>
                    Family Unit
                  </h5>
                  <app-familyunit-component
                    [familyUnitGETData]="dashData.family"
                    profileTypeCode="Parent">
                  </app-familyunit-component>
                </div>
                <div *ngIf="!dashData.family" class="text-center py-4">
                  <i class="fas fa-users fa-3x text-muted mb-3"></i>
                  <p class="text-muted">No family unit found. Contact support if you need assistance.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
      border: 1px solid rgba(0, 0, 0, 0.125);
    }
    
    .card-header {
      background-color: #f8f9fa;
      border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    }
  `]
})
export class DashParentHomeComponent implements OnInit {
  private hcclContextService = inject(HcclContextService);
  private hcclService = inject(HcclService);

  loading = true;
  error: string | null = null;
  dashData: FamilyParentDashUIGETData | null = null;

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    this.error = null;

    this.hcclContextService.waitForReady$().subscribe({
      next: () => {
        this.hcclService.resolveParentUIData().subscribe({
          next: (data) => {
            this.dashData = data;
            this.loading = false;
          },
          error: (err) => {
            this.error = err?.message || 'Failed to load parent dashboard';
            this.loading = false;
          },
        });
      },
      error: (err) => {
        this.error = 'User context not available';
        this.loading = false;
      },
    });
  }
}
