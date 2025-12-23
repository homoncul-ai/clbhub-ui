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
                Your career search is in progress.  select a personal statement or create a new one <a href="/student-dashboard/personalstatements">here</a>
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

                      <!-- studentDashData.personalstatements listed here - using the app-personalstatement-crud component in a modeName=card -->
                      <div class="row mb-4" *ngFor="let personalStatement of dashUIData?.personalStatements || []">
                        <div class="col-12">
                          <div class="card">
                            <div class="card-header d-flex justify-content-between align-items-center">
                              <h5 class="mb-0">
                                <i class="fas fa-user me-2"></i>
                                {{ personalStatement.name }}
                              </h5>
                            </div>
                            <div class="card-body">
                            <table cellpadding="3" cellspacing="3" border="0" width="100%">
        <tr>
            <td  width="40%" valign="top">
            <app-personalstatement-crud [modeName]="CRUD_MODES.CARD" [id]="personalStatement.id"></app-personalstatement-crud>
              </td>

       
        <td valign="top">
 <!-- Career Search Progress Pie Chart -->
 <div class="career-progress-chart text-center my-2" valign="top">
                              <canvas 
                                *ngIf="personalStatement.progress?.progressPercent !== undefined"
                                [attr.data-progress]="personalStatement.progress?.progressPercent"
                                width="120" 
                                height="120"
                                style="max-width: 100px; max-height: 100px;"
                                #pieCanvas{{personalStatement.id}}>
                              </canvas>
                              <div *ngIf="personalStatement.progress?.progressPercent !== undefined" class="mt-1">
                                <strong>{{ personalStatement.progress?.progressPercent }}%</strong> complete
                              </div>
                              <div *ngIf="personalStatement.progress?.progressSummary">
                                <small class="text-muted">{{ personalStatement.progress?.progressSummary }}</small>
                              </div>
                              <div *ngIf="personalStatement.progress?.progressPercent === undefined">
                                <span class="text-muted">No progress data available.</span>
                              </div>
                            </div>
                            <script>
                              // Render pie chart using Canvas 2D for the progress
                              // This script will redraw pie charts after DOM updates
                              (function(){
                                setTimeout(function(){
                                  const list = document.querySelectorAll('canvas[data-progress]');
                                  list.forEach(canvas => {
                                    const percent = parseInt(canvas.dataset.progress, 10) || 0;
                                    const ctx = canvas.getContext('2d');
                                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                                    // Background circle
                                    ctx.beginPath();
                                    ctx.arc(60, 60, 50, 0, 2 * Math.PI);
                                    ctx.strokeStyle = '#e6e6e6';
                                    ctx.lineWidth = 14;
                                    ctx.stroke();
                                    // Progress arc
                                    ctx.beginPath();
                                    ctx.arc(60, 60, 50, -Math.PI/2, (-Math.PI/2 + (2 * Math.PI * percent / 100)));
                                    ctx.strokeStyle = '#4285f4';
                                    ctx.lineWidth = 14;
                                    ctx.stroke();
                                  });
                                }, 300);
                              })();
                            </script>
                            <div class="career-progress-description mt-2">
                              <ng-container *ngIf="personalStatement.progress?.progressPercent !== undefined">
                                <span>
                                  You have completed <strong>{{ personalStatement.progress?.progressPercent }}%</strong> of your career search personal statement.
                                 
                                </span>
                              </ng-container>
                              <ng-container *ngIf="personalStatement?.progress?.progressPercent === undefined">
                                <span class="text-muted">Get started to begin making progress!</span>
                              </ng-container>
                            </div>
                            SPAM
        </td>

        <td valign="top" width="40%">
        <span *ngIf="personalStatement.progress?.nextStep">
                                    Next: <em>{{ personalStatement.progress?.nextStep }}</em>
                                  </span>
                                  </td>
    </tr>
    
    </table>
                           
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
