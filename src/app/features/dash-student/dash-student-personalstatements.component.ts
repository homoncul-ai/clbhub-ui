import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HcclService, PersonalStatementGETData, PersonalStatementCriteria } from '@app/restsvc/hccl.service';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { Observable } from 'rxjs';
import { DategetdataDisplayComponent } from "../../components/_global/dategetdata-display/dategetdata-display.component";

@Component({
  selector: 'app-dash-student-courses',
  standalone: true,
  imports: [CommonModule, DategetdataDisplayComponent],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                <i class="fas fa-file-alt me-2"></i>
                My Personal Statements
              </h3>
            </div>
            <div class="card-body">
              <!-- Loading state -->
              <div *ngIf="loading" class="text-center py-4">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading personal statements...</p>
              </div>

              <!-- Error state -->
              <div *ngIf="error" class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ error }}
              </div>

              <!-- Personal statements list -->
              <div *ngIf="!loading && !error && personalStatements.length > 0" class="row">
                <div *ngFor="let statement of personalStatements" class="col-md-6 col-lg-4 mb-4">
                  <div class="card statement-card">
                    <div class="card-body">
                      <h5 class="card-title">{{ statement.name || 'Untitled Statement' }}</h5>
                      <p class="card-text">{{ statement.description || 'No description available' }}</p>
                      <div class="status-badge mb-3">
                        <span class="badge" [ngClass]="getStatusClass(statement.status)">
                          {{ getStatusText(statement.status) }}
                        </span>
                      </div>
                      <small class="text-muted mb-3 d-block">
                        <i class="fas fa-calendar me-1"></i>
                        Created: <app-dategetdata-display [data]="statement.dateCreated"></app-dategetdata-display>
                      </small>
                      
                      <!-- Action buttons for each card -->
                      <div class="card-actions">
                        <button class="btn btn-xs btn-primary me-1" (click)="findMatchingJobs(statement)" title="Search Jobs">
                          <i class="fas fa-briefcase me-1"></i>
                          
                        </button>
                        <button class="btn btn-xs btn-success me-1" (click)="findMatchingCourses(statement)" title="Search Courses">
                          <i class="fas fa-graduation-cap me-1"></i>
                  
                        </button>
                        <button class="btn btn-xs btn-info" (click)="findMatchingEvents(statement)" title="Search Events">
                          <i class="fas fa-calendar-alt me-1"></i>
                          
                        </button>
                      </div>
                    </div>
                    <div class="card-footer">
                      <button class="btn btn-outline-secondary btn-sm w-100" (click)="openStatementDetails(statement.id!)">
                        <i class="fas fa-eye me-1"></i>
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty state -->
              <div *ngIf="!loading && !error && personalStatements.length === 0" class="text-center py-4">
                <i class="fas fa-file-alt fa-3x text-muted mb-3"></i>
                <h5>No Personal Statements Found</h5>
                <p class="text-muted">You haven't created any personal statements yet.</p>
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

    .statement-card {
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }

    .statement-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }

    .card-actions {
      margin-top: 1rem;
    }

    .card-actions .btn {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      margin-right: 0.25rem;
    }

    .card-actions .btn:last-child {
      margin-right: 0;
    }

    .card-footer {
      background-color: #f8f9fa;
      border-top: 1px solid rgba(0, 0, 0, 0.125);
      padding: 0.75rem;
    }

    .status-badge .badge {
      font-size: 0.875rem;
      padding: 0.5rem 0.75rem;
    }

    .badge-active {
      background-color: #28a745;
      color: white;
    }

    .badge-draft {
      background-color: #6c757d;
      color: white;
    }

    .badge-archived {
      background-color: #dc3545;
      color: white;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      font-weight: 500;
    }
  `]
})
export class DashStudentPersonalStatementsComponent implements OnInit {
  personalStatements: PersonalStatementGETData[] = [];
  loading = false;
  error = '';

  constructor(
    private hcclService: HcclService,
    private hcclContextService: HcclContextService,
    private router: Router
  ) {
    console.log('DashStudentCoursesComponent initialized');
  }

  ngOnInit(): void {
    this.loadPersonalStatements();
  }

  async loadPersonalStatements(): Promise<void> {
    this.loading = true;
    this.error = '';

    try {
      // Wait for context to be ready
      await this.hcclContextService.waitForReady();
      
      const currentUserId = this.hcclContextService.getCurrentUserProfileId();
      
      if (!currentUserId) {
        this.error = 'Unable to determine current user. Please try logging in again.';
        this.loading = false;
        return;
      }

      const criteria: PersonalStatementCriteria = {
        parentEntityId: currentUserId,
        isPaging: false,
        maxResults: 50
      };

      this.hcclService.findPersonalStatements(criteria).subscribe({
        next: (results) => {
          this.personalStatements = results.searchResults || [];
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading personal statements:', err);
          this.error = 'Failed to load personal statements. Please try again.';
          this.loading = false;
        }
      });
    } catch (err) {
      console.error('Error in loadPersonalStatements:', err);
      this.error = 'An unexpected error occurred. Please try again.';
      this.loading = false;
    }
  }

  openStatementDetails(statementId: string): void {
    const url = `/student-dashboard/personalstatements/${statementId}`;
    window.open(url, '_blank');
  }

  getStatusClass(status?: number): string {
    switch (status) {
      case 1:
        return 'badge-active';
      case 0:
        return 'badge-draft';
      case 2:
        return 'badge-archived';
      default:
        return 'badge-draft';
    }
  }

  getStatusText(status?: number): string {
    switch (status) {
      case 1:
        return 'Active';
      case 0:
        return 'Draft';
      case 2:
        return 'Archived';
      default:
        return 'Unknown';
    }
  }

  findMatchingJobs(statement: PersonalStatementGETData): void {
    if (statement.id) {
      const url = `/student-dashboard/personalstatements/${statement.id}/search?searchType=jobs`;
      window.open(url, '_blank');
    }
  }

  findMatchingCourses(statement: PersonalStatementGETData): void {
    if (statement.id) {
      const url = `/student-dashboard/personalstatements/${statement.id}/search?searchType=courses`;
      window.open(url, '_blank');
    }
  }

  findMatchingEvents(statement: PersonalStatementGETData): void {
    if (statement.id) {
      const url = `/student-dashboard/personalstatements/${statement.id}/search?searchType=events`;
      window.open(url, '_blank');
    }
  }
}
