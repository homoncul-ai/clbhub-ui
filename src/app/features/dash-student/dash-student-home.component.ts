import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { StudentUiComponent } from '@app/components/_crud/hccluserprofile/student-ui.component';

@Component({
  selector: 'app-dash-student-home',
  standalone: true,
  imports: [CommonModule, StudentUiComponent],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <h1>Student Dashboard </h1>
          this needs to be more inspiring and less boring
          <!-- Loading State (context) -->
          <div *ngIf="loading" class="text-center py-5">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading student information...</p>
          </div>

          <!-- Error State -->
          <div *ngIf="error && !loading" class="alert alert-danger" role="alert">
            <i class="fas fa-exclamation-triangle me-2"></i>
            {{ error }}
          </div>

          <!-- Student UI Content -->
          <app-student-ui *ngIf="!loading && !error && userProfileId" [userProfileId]="userProfileId"></app-student-ui>
        </div>
      </div>
    </div>
  `,
})
export class DashStudentHomeComponent implements OnInit {
  private hcclContextService = inject(HcclContextService);

  loading = true;
  error: string | null = null;
  userProfileId: string | null = null;

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    this.error = null;

    this.hcclContextService.waitForReady$().subscribe({
      next: (context) => {
        if (!context || !context.currentUserProfileId) {
          this.error = 'User context not available';
          this.loading = false;
          return;
        }
        this.userProfileId = context.currentUserProfileId;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load user context';
        this.loading = false;
      },
    });
  }
}
