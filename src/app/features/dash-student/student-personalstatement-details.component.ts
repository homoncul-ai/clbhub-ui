import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { HcclService, HcclUserProfileGETData, PersonalStatementUIGETData, PersonalStatementGETData,
  CatalogEntryInterestGETData, CatalogEntryInterestCriteria,
  PersonalStatementResumeGETData, PersonalStatementResumeCriteria } from '@app/restsvc/hccl.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PersonalStatementCrudComponent } from '@app/components/_crud/personalstatement/personalstatement-crud.component';
import { CatalogEntryCrudComponent } from '@app/components/_crud/catalogentry/catalogentry-crud.component';
import { CRUD_MODES } from '@app/@core/constants';
import { VocationEncodingDisplayComponent } from '@app/components/_crud/vocationencoding/vocationencoding-display.component';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';

@Component({
  selector: 'app-student-personalstatement-details',
  standalone: true,
  imports: [CommonModule, PersonalStatementCrudComponent, 
    CatalogEntryCrudComponent, VocationEncodingDisplayComponent, MdbAccordionModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
          
            <div class="card-body">
              <!-- Loading State -->
              <div *ngIf="loading" class="text-center py-5">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading personal statement...</p>
              </div>

              <!-- Error State -->
              <div *ngIf="error && !loading" class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ error }}
              </div>

              <!-- Content -->
              <div *ngIf="!loading && !error">
                <!-- Back Button -->
                <div class="mb-3">
                  <a href="/student-dashboard/home" class="btn btn-outline-secondary btn-sm">
                    <i class="fas fa-arrow-left me-1"></i> Back to Dashboard
                  </a>
                </div>

                <mdb-accordion [multiple]="false" class="mb-4">
                  <mdb-accordion-item
                    [collapsed]="isAccordionCollapsed('personalGoal')"
                    (itemShow)="openAccordion('personalGoal')">
                    <ng-template mdbAccordionItemHeader>
                      <i class="fas fa-compass me-2"></i>
                      Personal Goal : {{ personalStatement?.name }}
                    </ng-template>
                    <ng-template mdbAccordionItemBody>
                      <div class="accordion-body-content">
                        <div class="personal-statement-card" *ngIf="personalStatement">
                          <div class="card statement-card">
                            <div class="card-body">
                              <div class="row">
                                <!-- Left: Personal Statement Card -->
                                <div class="col-md-4">
                                  <app-personalstatement-crud [modeName]="CRUD_MODES.CARD" [id]="personalStatementId"></app-personalstatement-crud>
                                </div>

                                <!-- Center: Progress Ring -->
                                <div class="col-md-3 text-center">
                                  <div class="progress-ring-container">
                                    <div class="progress-ring"
                                         [style.--progress]="personalStatement.progress?.progressPercent || 0">
                                      <div class="progress-ring-inner">
                                        <span class="progress-percent">{{ personalStatement.progress?.progressPercent || 0 }}%</span>
                                        <span class="progress-label">Complete</span>
                                      </div>
                                    </div>
                                    <div class="mt-2" *ngIf="personalStatement.progress?.progressSummary">
                                      <small class="text-muted">{{ personalStatement.progress?.progressSummary }}</small>
                                    </div>
                                  </div>
                                </div>

                                <!-- Right: Milestones Checklist -->
                                <div class="col-md-5">
                                  <div class="milestones-section">
                                    <h6 class="milestones-title mb-3">
                                      <i class="fas fa-tasks me-2"></i>Career Milestones
                                    </h6>
                                    <div class="milestone-list">
                                      <div class="milestone-item" [class.completed]="personalStatement.progress?.completedResume">
                                        <i class="fas" [class.fa-check-circle]="personalStatement.progress?.completedResume"
                                           [class.fa-circle]="!personalStatement.progress?.completedResume"></i>
                                        <span>Resume Completed</span>
                                      </div>
                                      <div class="milestone-item" [class.completed]="personalStatement.progress?.showedInterestForJob">
                                        <i class="fas" [class.fa-check-circle]="personalStatement.progress?.showedInterestForJob"
                                           [class.fa-circle]="!personalStatement.progress?.showedInterestForJob"></i>
                                        <span>Expressed Interest in Job</span>
                                      </div>
                                      <div class="milestone-item" [class.completed]="personalStatement.progress?.showedInterestForCourse">
                                        <i class="fas" [class.fa-check-circle]="personalStatement.progress?.showedInterestForCourse"
                                           [class.fa-circle]="!personalStatement.progress?.showedInterestForCourse"></i>
                                        <span>Expressed Interest in Course</span>
                                      </div>
                                      <div class="milestone-item" [class.completed]="personalStatement.progress?.completedSignupForJob">
                                        <i class="fas" [class.fa-check-circle]="personalStatement.progress?.completedSignupForJob"
                                           [class.fa-circle]="!personalStatement.progress?.completedSignupForJob"></i>
                                        <span>Applied for Job</span>
                                      </div>
                                      <div class="milestone-item" [class.completed]="personalStatement.progress?.completedSignupForCourse">
                                        <i class="fas" [class.fa-check-circle]="personalStatement.progress?.completedSignupForCourse"
                                           [class.fa-circle]="!personalStatement.progress?.completedSignupForCourse"></i>
                                        <span>Enrolled in Course</span>
                                      </div>
                                      <div class="milestone-item" [class.completed]="personalStatement.progress?.contactedProvider">
                                        <i class="fas" [class.fa-check-circle]="personalStatement.progress?.contactedProvider"
                                           [class.fa-circle]="!personalStatement.progress?.contactedProvider"></i>
                                        <span>Contacted Provider</span>
                                      </div>
                                      <div class="milestone-item" [class.completed]="personalStatement.progress?.acceptedForJob">
                                        <i class="fas" [class.fa-check-circle]="personalStatement.progress?.acceptedForJob"
                                           [class.fa-circle]="!personalStatement.progress?.acceptedForJob"></i>
                                        <span>Accepted for Job</span>
                                      </div>
                                      <div class="milestone-item" [class.completed]="personalStatement.progress?.acceptedForCourse">
                                        <i class="fas" [class.fa-check-circle]="personalStatement.progress?.acceptedForCourse"
                                           [class.fa-circle]="!personalStatement.progress?.acceptedForCourse"></i>
                                        <span>Accepted for Course</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div class="next-step-banner mt-3" *ngIf="personalStatement.progress?.nextStep">
                                <div class="d-flex align-items-center">
                                  <i class="fas fa-lightbulb text-warning me-2"></i>
                                  <strong>Next Step:</strong>
                                  <span class="ms-2">{{ personalStatement.progress?.nextStep }}</span>
                                </div>
                              </div>

                              <div class="no-progress-state text-center py-3" *ngIf="!personalStatement.progress">
                                <i class="fas fa-rocket fa-2x text-muted mb-2"></i>
                                <p class="text-muted mb-0">Start your career journey to track your progress!</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ng-template>
                  </mdb-accordion-item>

                  <mdb-accordion-item
                    [collapsed]="isAccordionCollapsed('resumes')"
                    (itemShow)="openAccordion('resumes')">
                    <ng-template mdbAccordionItemHeader>
                      <i class="fas fa-file-alt me-2"></i>
                      Resumes
                    </ng-template>
                    <ng-template mdbAccordionItemBody>
                      <div class="accordion-body-content">
                        <div class="mb-3">
                          <a [href]="'/student-dashboard/personalstatements/' + personalStatementId + '/resumes'" class="btn btn-sm btn-outline-primary">
                            <i class="fas fa-plus me-1"></i> Manage Resumes
                          </a>
                        </div>
                        <div *ngIf="resumes.length === 0" class="text-center py-4">
                          <i class="fas fa-file-alt fa-3x text-muted mb-3"></i>
                          <p class="text-muted">No resumes have been created yet for this personal statement.</p>
                          <a [href]="'/student-dashboard/personalstatements/' + personalStatementId + '/resumes'" class="btn btn-primary">
                            <i class="fas fa-plus me-1"></i> Create a Resume
                          </a>
                        </div>
                        <div *ngIf="resumes.length > 0" class="resumes-list">
                          <div class="row">
                            <div class="col-md-6 col-lg-4 mb-3" *ngFor="let resume of resumes">
                              <div class="card resume-card h-100">
                                <div class="card-body">
                                  <div class="d-flex align-items-start justify-content-between">
                                    <div>
                                      <h6 class="card-title mb-1">
                                        <i class="fas fa-file-alt text-primary me-2"></i>
                                        {{ resume.title || 'Untitled Resume' }}
                                      </h6>
                                      <small class="text-muted">
                                        Created: {{ resume.dateCreated?.formattedDate || '-' }}
                                      </small>
                                    </div>
                                    <span class="badge" [ngClass]="resume.available === 1 ? 'bg-success' : 'bg-secondary'">
                                      {{ resume.available === 1 ? 'Available' : 'Draft' }}
                                    </span>
                                  </div>
                                </div>
                                <div class="card-footer bg-transparent">
                                  <a [href]="'/student-dashboard/personalstatements/' + personalStatementId + '/resume/' + resume.id"
                                     class="btn btn-sm btn-outline-primary w-100">
                                    <i class="fas fa-eye me-1"></i> View Resume
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ng-template>
                  </mdb-accordion-item>

                  <mdb-accordion-item
                    [collapsed]="isAccordionCollapsed('vocationEncoding')"
                    (itemShow)="openAccordion('vocationEncoding')">
                    <ng-template mdbAccordionItemHeader>
                      <i class="fas fa-briefcase me-2"></i>
                      Vocation Encoding Matches
                    </ng-template>
                    <ng-template mdbAccordionItemBody>
                      <div class="accordion-body-content">
                        <app-vocationencoding-display [id]="personalStatement?.vocationEncodingId || ''"></app-vocationencoding-display>
                      </div>
                    </ng-template>
                  </mdb-accordion-item>

                  <mdb-accordion-item
                    [collapsed]="isAccordionCollapsed('interests')"
                    (itemShow)="openAccordion('interests')">
                    <ng-template mdbAccordionItemHeader>
                      <i class="fas fa-star me-2"></i>
                      Your Interests for this Personal Statement
                    </ng-template>
                    <ng-template mdbAccordionItemBody>
                      <div class="accordion-body-content">
                        <div *ngIf="catalogEntryInterests.length === 0" class="text-center py-4">
                          <i class="fas fa-search fa-3x text-muted mb-3"></i>
                          <p class="text-muted">No interests have been expressed yet for this personal statement.</p>
                          <a [href]="'/student-dashboard/personalstatements/' + personalStatementId + '/search'" class="btn btn-primary">
                            <i class="fas fa-search me-1"></i> Search for Opportunities
                          </a>
                        </div>
                        <div *ngIf="catalogEntryInterests.length > 0" class="interests-list">
                          <div class="table-responsive">
                            <table class="table table-hover">
                              <thead>
                                <tr>
                                  <th>Opportunity</th>
                                  <th>Interest Level</th>
                                  <th>Status</th>
                                  <th>Notes</th>
                                  <th>Date Added</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr *ngFor="let interest of catalogEntryInterests" class="interest-row">
                                  <td>
                                    <app-catalogentry-crud [id]="interest.catalogEntryId" [modeName]="CRUD_MODES.FK"></app-catalogentry-crud>
                                  </td>
                                  <td>
                                    <div class="interest-level">
                                      <span class="badge" [ngClass]="{
                                        'bg-success': interest.interest && interest.interest >= 8,
                                        'bg-primary': interest.interest && interest.interest >= 5 && interest.interest < 8,
                                        'bg-warning': interest.interest && interest.interest >= 3 && interest.interest < 5,
                                        'bg-secondary': !interest.interest || interest.interest < 3
                                      }">
                                        {{ interest.interest || 0 }}/10
                                      </span>
                                    </div>
                                  </td>
                                  <td>
                                    <span class="badge bg-info">{{ interest.currentStateCode || 'New' }}</span>
                                  </td>
                                  <td>
                                    <span class="notes-text">{{ interest.notes || '-' }}</span>
                                  </td>
                                  <td>
                                    <small class="text-muted">{{ interest.dateCreated?.formattedDate || '-' }}</small>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </ng-template>
                  </mdb-accordion-item>
                </mdb-accordion>

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

    /* Statement Card Styles */
    .statement-card {
      border-left: 4px solid #4285f4;
      transition: box-shadow 0.2s ease;
    }
    
    .statement-card:hover {
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }

    /* Progress Ring Styles */
    .progress-ring-container {
      padding: 1rem;
    }

    .progress-ring {
      --progress: 0;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: conic-gradient(
        #4285f4 calc(var(--progress) * 3.6deg),
        #e9ecef calc(var(--progress) * 3.6deg)
      );
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      position: relative;
    }

    .progress-ring-inner {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      background: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .progress-percent {
      font-size: 1.5rem;
      font-weight: 700;
      color: #4285f4;
      line-height: 1;
    }

    .progress-label {
      font-size: 0.7rem;
      color: #6c757d;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Milestones Styles */
    .milestones-section {
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
      border-radius: 8px;
      padding: 1rem;
      border: 1px solid #e9ecef;
    }

    .milestones-title {
      color: #495057;
      font-size: 0.9rem;
      font-weight: 600;
      border-bottom: 2px solid #4285f4;
      padding-bottom: 0.5rem;
    }

    .milestone-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
    }

    .milestone-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 0.6rem;
      border-radius: 4px;
      font-size: 0.8rem;
      color: #6c757d;
      background: white;
      border: 1px solid #e9ecef;
      transition: all 0.2s ease;
    }

    .milestone-item i {
      font-size: 0.9rem;
      color: #dee2e6;
    }

    .milestone-item.completed {
      color: #28a745;
      background: #d4edda;
      border-color: #c3e6cb;
    }

    .milestone-item.completed i {
      color: #28a745;
    }

    /* Next Step Banner */
    .next-step-banner {
      background: linear-gradient(90deg, #fff3cd 0%, #ffeeba 100%);
      border: 1px solid #ffc107;
      border-radius: 8px;
      padding: 0.75rem 1rem;
      font-size: 0.9rem;
    }

    .next-step-banner i {
      font-size: 1.1rem;
    }

    /* No Progress State */
    .no-progress-state i {
      display: block;
    }

    /* Resume Card Styles */
    .resume-card {
      border: 1px solid #e9ecef;
      transition: all 0.2s ease;
    }

    .resume-card:hover {
      border-color: #4285f4;
      box-shadow: 0 0.25rem 0.5rem rgba(66, 133, 244, 0.15);
    }

    .resume-card .card-title {
      font-size: 0.95rem;
      font-weight: 600;
    }

    .resume-card .card-footer {
      border-top: 1px solid #e9ecef;
      padding: 0.75rem;
    }

    /* Interests Table Styles */
    .interests-list {
      margin-top: 0.5rem;
    }

    .interest-row:hover {
      background-color: #f8f9fa;
    }

    .interest-level .badge {
      font-size: 0.85rem;
      padding: 0.4rem 0.6rem;
    }

    .notes-text {
      max-width: 200px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    @media (max-width: 768px) {
      .milestone-list {
        grid-template-columns: 1fr;
      }
      
      .progress-ring {
        width: 100px;
        height: 100px;
      }
      
      .progress-ring-inner {
        width: 75px;
        height: 75px;
      }
      
      .progress-percent {
        font-size: 1.2rem;
      }

      .notes-text {
        max-width: 100px;
      }
    }
  `]
})
export class StudentPersonalStatementDetailsComponent implements OnInit {
  private hcclContextService = inject(HcclContextService);
  private hcclService = inject(HcclService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  CRUD_MODES = CRUD_MODES;
  loading: boolean = false;
  error: string | null = null;
  userProfile: HcclUserProfileGETData | null = null;
  personalStatementUIData: PersonalStatementUIGETData | null = null;
  personalStatement: PersonalStatementGETData | null = null;
  personalStatementId: string = '';
  catalogEntryInterests: CatalogEntryInterestGETData[] = [];
  resumes: PersonalStatementResumeGETData[] = [];
  accordionId = 'personalGoal';

  constructor() {
    console.log('StudentPersonalStatementDetailsComponent initialized');
  }

  ngOnInit(): void {
    // Get personal statement ID from route params
    this.route.params.subscribe(params => {
      this.personalStatementId = params['id'] || '';
      if (this.personalStatementId) {
        this.loadData();
      } else {
        this.error = 'No personal statement ID provided';
      }
    });
  }

  openAccordion(id: string): void {
    this.accordionId = id;
  }

  isAccordionCollapsed(id: string): boolean {
    return this.accordionId !== id;
  }

  /**
   * Load all required data
   */
  private loadData(): void {
    this.loading = true;
    this.error = null;

    // Wait for context to be ready
    this.hcclContextService.waitForReady$().subscribe({
      next: (context) => {
        if (!context || !context.currentUserProfileId) {
          this.error = 'User context not available';
          this.loading = false;
          return;
        }

        this.userProfile = context.currentUserProfile || null;

        // Load personal statement UI data, catalog entry interests, and resumes
        forkJoin({
          psUIData: this.hcclService.resolvePersonalStatementUIData(this.personalStatementId).pipe(
            catchError(err => {
              console.warn('Error loading personal statement UI data:', err);
              return of(null);
            })
          ),
          interests: this.hcclService.findCatalogEntryInterests({
            personalStatementId: this.personalStatementId,
            pageNumber: 1,
            pageSize: 100,
            isPaging: true
          } as CatalogEntryInterestCriteria).pipe(
            catchError(err => {
              console.warn('Error loading catalog entry interests:', err);
              return of({ searchResults: [] });
            })
          ),
          resumes: this.hcclService.findPersonalStatementResumes({
            personalStatmentId: this.personalStatementId,
            pageNumber: 1,
            pageSize: 100,
            isPaging: true
          } as PersonalStatementResumeCriteria).pipe(
            catchError(err => {
              console.warn('Error loading resumes:', err);
              return of({ searchResults: [] });
            })
          )
        }).subscribe({
          next: (results) => {
            this.personalStatementUIData = results.psUIData;
            this.personalStatement = results.psUIData?.personalStatement || null;
            this.catalogEntryInterests = results.interests?.searchResults || [];
            this.resumes = results.resumes?.searchResults || [];

            // If personal statement not found, create minimal object
            if (!this.personalStatement) {
              this.personalStatement = {
                id: this.personalStatementId,
                name: 'Personal Statement'
              };
            }

            this.loading = false;
          },
          error: (err) => {
            console.error('Error loading data:', err);
            this.error = 'Failed to load personal statement data';
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error waiting for context:', err);
        this.error = 'Failed to load user context';
        this.loading = false;
      }
    });
  }
}

