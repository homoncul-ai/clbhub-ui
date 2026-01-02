import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbModalService, MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { HcclService, HcclUserContextGETData, HcclUserProfileGETData, CLStudentGETData, CLStudentCriteria,
   CLSchoolGETData, CLGuidanceGETData, CLGuidanceCriteria, WorkRequestDashboardUIGETData, StudentDashUIGETData, 
   HcclTeamGETData} from '@app/restsvc/hccl.service';
import { UserProfileEditModalComponent } from './user-profile-edit-modal.component';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PersonalStatementCrudComponent } from '@app/components/_crud/personalstatement/personalstatement-crud.component';
import { CRUD_MODES } from '@app/@core/constants';

@Component({
  selector: 'app-dash-student-home',
  standalone: true,
  imports: [CommonModule, PersonalStatementCrudComponent],
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
                <p class="mt-2">Loading student information...</p>
              </div>

              <!-- Error State -->
              <div *ngIf="error && !loading" class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ error }}
              </div>
              <!-- Content -->
              <div *ngIf="!loading && !error">
                <h3>Welcome {{ userProfile?.theUser?.name || 'N/A' }}</h3>
                <!-- messages section from student from dashUIData  --> 
                <div class="row mb-4">
                  <div class="col-12">
                    <div class="card">
                      <div class="card-header">
                        <h5 class="mb-0">
                          <i class="fas fa-envelope me-2"></i>
                          Messages
                        </h5>
                      </div>
                      <div class="card-body">
                        <div class="list-group list-group-flush">
                          <div class="list-group-item" *ngFor="let message of dashUIData?.messages">
                            <h6 class="mb-1">{{ message.message?.title }}</h6>
                            <p class="mb-1 text-muted small">{{ message.message?.description || 'No description' }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!--List all the personal statements  -->
                <div class="row mb-4">
                  <div class="col-12">
                    <div class="card">
                      <!-- <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">
                          <i class="fas fa-user me-2"></i>
                          Career Search Progress
                        </h5>
                        yadda yadda yadda
                      </div> -->

                      <!-- Personal Statements with Progress Tracker -->
                      <div class="personal-statement-card mb-4" *ngFor="let personalStatement of dashUIData?.personalStatements || []">
                        <div class="card statement-card">
                          <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">
                              <i class="fas fa-compass me-2"></i>
                              {{ personalStatement.name }}
                            </h5>
                            <a [href]="'/student-dashboard/personalstatements/' + personalStatement.id" class="btn btn-sm btn-outline-primary">
                              <i class="fas fa-arrow-right me-1"></i> View Details
                            </a>
                          </div>
                          <div class="card-body">
                            <div class="row">
                              <!-- Left: Personal Statement Card -->
                              <div class="col-md-4">
                                <app-personalstatement-crud [modeName]="CRUD_MODES.CARD" [id]="personalStatement.id"></app-personalstatement-crud>
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
                                    <!-- Resume -->
                                    <div class="milestone-item" [class.completed]="personalStatement.progress?.completedResume">
                                      <i class="fas" [class.fa-check-circle]="personalStatement.progress?.completedResume" 
                                         [class.fa-circle]="!personalStatement.progress?.completedResume"></i>
                                      <span>Resume Completed</span>
                                    </div>
                                    <!-- Showed Interest Job -->
                                    <div class="milestone-item" [class.completed]="personalStatement.progress?.showedInterestForJob">
                                      <i class="fas" [class.fa-check-circle]="personalStatement.progress?.showedInterestForJob" 
                                         [class.fa-circle]="!personalStatement.progress?.showedInterestForJob"></i>
                                      <span>Expressed Interest in Job</span>
                                    </div>
                                    <!-- Showed Interest Course -->
                                    <div class="milestone-item" [class.completed]="personalStatement.progress?.showedInterestForCourse">
                                      <i class="fas" [class.fa-check-circle]="personalStatement.progress?.showedInterestForCourse" 
                                         [class.fa-circle]="!personalStatement.progress?.showedInterestForCourse"></i>
                                      <span>Expressed Interest in Course</span>
                                    </div>
                                    <!-- Signed Up Job -->
                                    <div class="milestone-item" [class.completed]="personalStatement.progress?.completedSignupForJob">
                                      <i class="fas" [class.fa-check-circle]="personalStatement.progress?.completedSignupForJob" 
                                         [class.fa-circle]="!personalStatement.progress?.completedSignupForJob"></i>
                                      <span>Applied for Job</span>
                                    </div>
                                    <!-- Signed Up Course -->
                                    <div class="milestone-item" [class.completed]="personalStatement.progress?.completedSignupForCourse">
                                      <i class="fas" [class.fa-check-circle]="personalStatement.progress?.completedSignupForCourse" 
                                         [class.fa-circle]="!personalStatement.progress?.completedSignupForCourse"></i>
                                      <span>Enrolled in Course</span>
                                    </div>
                                    <!-- Contacted Provider -->
                                    <div class="milestone-item" [class.completed]="personalStatement.progress?.contactedProvider">
                                      <i class="fas" [class.fa-check-circle]="personalStatement.progress?.contactedProvider" 
                                         [class.fa-circle]="!personalStatement.progress?.contactedProvider"></i>
                                      <span>Contacted Provider</span>
                                    </div>
                                    <!-- Accepted Job -->
                                    <div class="milestone-item" [class.completed]="personalStatement.progress?.acceptedForJob">
                                      <i class="fas" [class.fa-check-circle]="personalStatement.progress?.acceptedForJob" 
                                         [class.fa-circle]="!personalStatement.progress?.acceptedForJob"></i>
                                      <span>Accepted for Job</span>
                                    </div>
                                    <!-- Accepted Course -->
                                    <div class="milestone-item" [class.completed]="personalStatement.progress?.acceptedForCourse">
                                      <i class="fas" [class.fa-check-circle]="personalStatement.progress?.acceptedForCourse" 
                                         [class.fa-circle]="!personalStatement.progress?.acceptedForCourse"></i>
                                      <span>Accepted for Course</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <!-- Next Step Banner -->
                            <div class="next-step-banner mt-3" *ngIf="personalStatement.progress?.nextStep">
                              <div class="d-flex align-items-center">
                                <i class="fas fa-lightbulb text-warning me-2"></i>
                                <strong>Next Step:</strong>
                                <span class="ms-2">{{ personalStatement.progress?.nextStep }}</span>
                              </div>
                            </div>

                            <!-- No Progress State -->
                            <div class="no-progress-state text-center py-3" *ngIf="!personalStatement.progress">
                              <i class="fas fa-rocket fa-2x text-muted mb-2"></i>
                              <p class="text-muted mb-0">Start your career journey to track your progress!</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
 
                <!-- School and Guidance Team Section -->
                <div class="row">
                  <!-- School Information -->
                  <div class="col-md-6 mb-4">
                    <div class="card">
                      <div class="card-header">
                        <h5 class="mb-0">
                          <i class="fas fa-school me-2"></i>
                          School
                        </h5>
                      </div>
                      <div class="card-body" *ngIf="school">
                        <h6>{{ school.name || 'N/A' }}</h6>
                        <p class="text-muted mb-1">
                          <strong>Code:</strong> {{ school.businessCode || 'N/A' }}
                        </p>
                        <p class="text-muted mb-1" *ngIf="school.organizationName">
                          <strong>Organization:</strong> {{ school.organizationName }}
                        </p>
                        <p class="text-muted mb-0" *ngIf="school.districtCode">
                          <strong>District:</strong> {{ school.districtCode }}
                        </p>
                      </div>
                      <div class="card-body" *ngIf="!school && student">
                        <p class="text-muted">School information not available</p>
                      </div>
                      <div class="card-body" *ngIf="!student">
                        <p class="text-muted">Student record not found</p>
                      </div>
                    </div>
                  </div>

                  <!-- Guidance Team -->
                  <div class="col-md-6 mb-4">
                    <div class="card">
                      <div class="card-header">
                        <h5 class="mb-0">
                          <i class="fas fa-users me-2"></i>
                          Guidance Team 
                        </h5>
                      </div>
                      <div class="card-body">
                        <div *ngIf="guidanceTeam ">
                          <div class="list-group list-group-flush">
                            <div class="list-group-item px-0" *ngFor="let member of guidanceTeam.teamMembers">
                              <h6 class="mb-1">{{ member.name || 'N/A' }}</h6>                            
                              <p class="mb-1 text-muted small" *ngIf="member.userProfile?.userEmail">
                                <strong>Email:</strong> {{ member.userProfile?.userEmail }}
                              </p>
                              <!-- <p class="mb-0 text-muted small" *ngIf="member.userProfile?.cellPhoneNumber">
                                <strong>Phone:</strong> {{ member.cellPhoneNumber }}
                              </p> -->
                            </div>
                          </div>
                        </div>
                        <div *ngIf="!guidanceTeam || guidanceTeam.teamMembers?.length === 0">
                          <p class="text-muted mb-0">No guidance team members found</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Dashboard UI Data Section 
                <div class="row" *ngIf="dashUIData">
                  <div class="col-12">
                    <div class="card">
                      <div class="card-header">
                        <h5 class="mb-0">
                          <i class="fas fa-chart-line me-2"></i>
                          Dashboard Statistics
                        </h5>
                      </div>
                      <div class="card-body">
                        <p class="text-muted">Dashboard UI data loaded successfully</p>
                         
                      </div>
                    </div>
                  </div>
                </div>
                -->
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
    
    dt {
      font-weight: 600;
      color: #495057;
    }
    
    .list-group-item {
      border-left: none;
      border-right: none;
      border-top: 1px solid rgba(0, 0, 0, 0.125);
    }
    
    .list-group-item:first-child {
      border-top: none;
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
    }
  `]
})
export class DashStudentHomeComponent implements OnInit {
  private hcclContextService = inject(HcclContextService);
  private hcclService = inject(HcclService);
  private modalService = inject(MdbModalService);
  
  private modalRef: MdbModalRef<UserProfileEditModalComponent> | null = null;
  CRUD_MODES = CRUD_MODES;
  CRUD_MODE_CARD = CRUD_MODES.CARD;
  loading: boolean = false;
  error: string | null = null;
  userProfile: HcclUserProfileGETData | null = null;
  student: CLStudentGETData | null = null;
  school: CLSchoolGETData | null = null;
  teams: HcclTeamGETData[] = [];
  guidanceTeam: HcclTeamGETData | null =null;
  dashUIData: StudentDashUIGETData | null = null;
  guidance: CLGuidanceGETData[] = [];

  constructor() {
    console.log('DashStudentHomeComponent initialized');
  }

  ngOnInit(): void {
    this.loadData();
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

        // Load student data, school, guidance team, and dashboard UI data
        const userProfileId = context.currentUserProfileId;
        
        // Find student by userProfileId
        const studentCriteria = {
          userProfileId: userProfileId,
          pageNumber: 1,
          pageSize: 1,
          isPaging: true
        };

        forkJoin({
          student: this.hcclService.findCLStudents(studentCriteria).pipe(
            catchError(err => {
              console.warn('Error loading student:', err);
              return of(null);
            })
          ),
          dashUI: this.hcclService.resolveStudentDashData().pipe(
            catchError(err => {
              console.warn('Error loading dashboard UI data:', err);
              return of(null);
            })
          ),
          studentDashData: this.hcclService.resolveStudentDashData().pipe(
            catchError(err => {
              console.warn('Error loading student dashboard data:', err);
              return of(null);
            })
          )
        }).subscribe({
          next: (results) => {
            const students = results.student?.searchResults || [];
            this.student = students.length > 0 ? students[0] : null;
            this.dashUIData = results.dashUI;

            // Load school and guidance team if student exists
            if (this.student?.schoolId) {
              this.loadSchoolAndGuidanceTeam(this.student.schoolId);
            } else {
              this.loading = false;
            }
            this.dashUIData = results.studentDashData;
            console.log('Student dashboard data:', JSON.stringify(this.dashUIData, null, 2));
            if (this.dashUIData) {
              this.guidanceTeam = this.dashUIData.guidanceTeam || null;
              this.school = this.dashUIData.school || null;
            }
          },
          error: (err) => {
            console.error('Error loading data:', err);
            this.error = 'Failed to load student data';
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

  /**
   * Load school and guidance team data
   */
  private loadSchoolAndGuidanceTeam(schoolId: string): void {
    forkJoin({
      school: this.hcclService.getCLSchoolById(schoolId).pipe(
        catchError(err => {
          console.warn('Error loading school:', err);
          return of(null);
        })
      ),
      guidance: this.hcclService.findCLGuidances({
        schoolId: schoolId,
        pageNumber: 1,
        pageSize: 50,
        isPaging: true
      }).pipe(
        catchError(err => {
          console.warn('Error loading guidance team:', err);
          return of({ searchResults: [] });
        })
      ), 
      studentDashData: this.hcclService.resolveStudentDashData().pipe(
        catchError(err => {
          console.warn('Error loading student dashboard data:', err);
          return of(null);
        })
      )
    }).subscribe({
      next: (results) => {
        this.school = results.school;
        this.guidance = results.guidance?.searchResults || [];
        this.loading = false;
        this.dashUIData = results.studentDashData;
        console.log('Student dashboard data:', JSON.stringify(this.dashUIData, null, 2));
        if (this.dashUIData) {
          this.guidanceTeam = this.dashUIData.guidanceTeam || null;
          this.school = this.dashUIData.school || null;
        }

      },
      error: (err) => {
        console.error('Error loading school/guidance data:', err);
        this.loading = false;
      }
    });
  }

  /**
   * Open edit modal for user profile
   */
  openEditModal(): void {
    if (!this.userProfile?.id) {
      console.warn('User profile ID not available');
      return;
    }

    this.modalRef = this.modalService.open(UserProfileEditModalComponent, {
      modalClass: 'modal-lg',
      data: {
        userProfileId: this.userProfile.id
      }
    }) as MdbModalRef<UserProfileEditModalComponent>;
    
    // Handle modal close
    if (this.modalRef?.onClose) {
      this.modalRef.onClose.subscribe((result) => {
        console.log('Edit modal closed:', result);
        // Reload data if needed after edit
        if (result === 'saved') {
          this.refreshUserProfile();
        }
        this.modalRef = null;
      });
    }
  }

  /**
   * Refresh user profile data after edit
   */
  private refreshUserProfile(): void {
    const userProfileId = this.userProfile?.id;
    if (!userProfileId) {
      return;
    }

    // Refresh the HCCL context to get updated user profile
    this.hcclContextService.refreshContext().subscribe({
      next: (context) => {
        // Update local user profile from refreshed context
        if (context?.currentUserProfile) {
          this.userProfile = context.currentUserProfile;
          console.log('User profile refreshed from context:', this.userProfile);
        } else {
          // Fallback: reload user profile directly if context doesn't have it
          this.hcclService.getHcclUserProfileById(userProfileId).subscribe({
            next: (updatedProfile) => {
              this.userProfile = updatedProfile;
              console.log('User profile refreshed directly:', updatedProfile);
            },
            error: (err) => {
              console.error('Error refreshing user profile:', err);
            }
          });
        }
      },
      error: (err) => {
        console.error('Error refreshing context:', err);
        // Fallback: reload user profile directly
        this.hcclService.getHcclUserProfileById(userProfileId).subscribe({
          next: (updatedProfile) => {
            this.userProfile = updatedProfile;
            console.log('User profile refreshed directly:', updatedProfile);
          },
          error: (err2) => {
            console.error('Error refreshing user profile:', err2);
          }
        });
      }
    });
  }
}
