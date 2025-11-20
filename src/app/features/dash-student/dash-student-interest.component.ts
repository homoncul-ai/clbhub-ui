import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclService, CatalogEntryInterestGETData } from '@app/restsvc/hccl.service';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { CatalogEntryCrudComponent } from '@app/components/_crud/catalogentry/catalogentry-crud.component';
import { MdbModalService, MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-dash-student-interest',
  standalone: true,
  imports: [CommonModule, CatalogEntryCrudComponent],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
              <h3 class="card-title" style="margin: 0;">
                <i class="fas fa-heart me-2"></i>
                {{ catalogEntryInterest?.catalogEntry?.catalogTypeCode | titlecase }} Interest
              </h3>
              <div class="button-bar" style="display: flex; gap: 10px; align-items: center;">
                <button 
                  *ngIf="canSignUp()" 
                  class="btn btn-primary btn-sm" 
                  (click)="openSignUpModal()" 
                  title="Sign Up">
                  <i class="fas fa-user-plus me-1"></i>
                  Sign Up
                </button>
                <button 
                  *ngIf="canApply()" 
                  class="btn btn-success btn-sm" 
                  (click)="openApplyModal()" 
                  title="Apply">
                  <i class="fas fa-paper-plane me-1"></i>
                  Apply
                </button>
              </div>
            </div>
            <div class="card-body">
              <!-- Loading state -->
              <div *ngIf="loading" class="text-center py-4">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading catalog entry interest...</p>
              </div>

              <!-- Error state -->
              <div *ngIf="error" class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ error }}
              </div>

              <!-- Catalog Entry Interest Details -->
              <div *ngIf="!loading && !error && catalogEntryInterest">
                <!-- Display Catalog Entry Information -->
                <div *ngIf="catalogEntryInterest.catalogEntry" class="catalog-entry-section mb-4">
                  <app-catalogentry-crud 
                    [id]="catalogEntryInterest.catalogEntry.id" 
                    [modeName]="'section'">
                  </app-catalogentry-crud>
                </div>

                <!-- More Information Section -->
                <div class="more-information-section mt-4">
                  <h4 class="mb-3">
                    <i class="fas fa-info-circle me-2"></i>
                    More Information
                  </h4>
                  <div class="alert alert-info">
                    <p><strong>This section is under development.</strong></p>
                    <p>Additional information about the catalog entry will be displayed here.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sign Up Modal -->
    <div *ngIf="showSignUpModal" class="modal fade show" style="display: block;" tabindex="-1" aria-labelledby="signUpModalLabel" aria-hidden="false">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="signUpModalLabel">
              <i class="fas fa-user-plus me-2"></i>
              Sign Up
            </h5>
            <button type="button" class="btn-close" (click)="closeSignUpModal()" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- TODO: Implement sign up form -->
            <!-- This modal will allow users to sign up for courses, jobs, events, etc. -->
            <!-- 
              Features to implement:
              - Form fields for sign up information
              - Validation
              - Submit to backend API
              - Success/error handling
            -->
            <p>Sign up functionality will be implemented here.</p>
            <p>This will allow users to register for:</p>
            <ul>
              <li>Courses</li>
              <li>Jobs</li>
              <li>Events</li>
              <li>Other catalog entries</li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="closeSignUpModal()">Cancel</button>
            <button type="button" class="btn btn-primary" disabled>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
    <div *ngIf="showSignUpModal" class="modal-backdrop fade show"></div>

    <!-- Apply Modal -->
    <div *ngIf="showApplyModal" class="modal fade show" style="display: block;" tabindex="-1" aria-labelledby="applyModalLabel" aria-hidden="false">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="applyModalLabel">
              <i class="fas fa-paper-plane me-2"></i>
              Apply
            </h5>
            <button type="button" class="btn-close" (click)="closeApplyModal()" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- TODO: Implement application form -->
            <!-- This modal will allow users to create an application for jobs, courses, etc. -->
            <!-- 
              Features to implement:
              - Application form fields
              - Resume/portfolio attachment
              - Personal statement selection
              - Validation
              - Submit to backend API
              - Success/error handling
            -->
            <p>Application functionality will be implemented here.</p>
            <p>This will allow users to create applications for:</p>
            <ul>
              <li>Job positions</li>
              <li>Course enrollments</li>
              <li>Program admissions</li>
              <li>Other opportunities</li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="closeApplyModal()">Cancel</button>
            <button type="button" class="btn btn-success" disabled>
              Submit Application
            </button>
          </div>
        </div>
      </div>
    </div>
    <div *ngIf="showApplyModal" class="modal-backdrop fade show"></div>
  `
})
export class DashStudentInterestComponent implements OnInit {
  catalogEntryInterest: CatalogEntryInterestGETData | null = null;
  loading = false;
  error = '';
  interestId: string = '';
  
  // Modal state
  showSignUpModal = false;
  showApplyModal = false;

  private modalService = inject(MdbModalService);

  constructor(
    private hcclService: HcclService,
    private hcclContextService: HcclContextService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    console.log('DashStudentInterestComponent initialized');
  }

  ngOnInit(): void {
    // Get interest ID from route parameters
    this.interestId = this.route.snapshot.params['interestId'] || '';
    
    if (this.interestId) {
      this.loadCatalogEntryInterest();
    } else {
      this.error = 'No interest ID provided in the route.';
    }
  }

  async loadCatalogEntryInterest(): Promise<void> {
    this.loading = true;
    this.error = '';

    try {
      // Wait for context to be ready
      await this.hcclContextService.waitForReady();
      
      this.hcclService.getCatalogEntryInterestById(this.interestId).subscribe({
        next: (data) => {
          this.catalogEntryInterest = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading catalog entry interest:', err);
          this.error = 'Failed to load catalog entry interest. Please try again.';
          this.loading = false;
        }
      });
    } catch (err) {
      console.error('Error in loadCatalogEntryInterest:', err);
      this.error = 'An unexpected error occurred. Please try again.';
      this.loading = false;
    }
  }

  /**
   * Determine if the Sign Up button should be shown
   * This will check various conditions like catalog entry type, availability, etc.
   */
  canSignUp(): boolean {
    if (!this.catalogEntryInterest?.catalogEntry) {
      return false;
    }

    const catalogEntry = this.catalogEntryInterest.catalogEntry;
    
    // Example logic - adjust based on business requirements
    // Sign up might be available for courses, events, etc.
    const catalogTypeCode = catalogEntry.catalogTypeCode?.toLowerCase() || '';
    const canSignUpTypes = ['course', 'event', 'program'];
    
    return canSignUpTypes.some(type => catalogTypeCode.includes(type)) && 
           catalogEntry.available === 1;
  }

  /**
   * Determine if the Apply button should be shown
   * This will check various conditions like catalog entry type, availability, etc.
   */
  canApply(): boolean {
    if (!this.catalogEntryInterest?.catalogEntry) {
      return false;
    }

    const catalogEntry = this.catalogEntryInterest.catalogEntry;
    
    // Example logic - adjust based on business requirements
    // Apply might be available for jobs, programs, etc.
    const catalogTypeCode = catalogEntry.catalogTypeCode?.toLowerCase() || '';
    const canApplyTypes = ['job', 'position', 'program', 'admission'];
    
    return canApplyTypes.some(type => catalogTypeCode.includes(type)) && 
           catalogEntry.available === 1;
  }

  /**
   * Open the Sign Up modal
   */
  openSignUpModal(): void {
    this.showSignUpModal = true;
  }

  /**
   * Close the Sign Up modal
   */
  closeSignUpModal(): void {
    this.showSignUpModal = false;
  }

  /**
   * Open the Apply modal
   */
  openApplyModal(): void {
    this.showApplyModal = true;
  }

  /**
   * Close the Apply modal
   */
  closeApplyModal(): void {
    this.showApplyModal = false;
  }
}

