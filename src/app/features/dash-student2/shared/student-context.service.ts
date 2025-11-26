import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, forkJoin, of, BehaviorSubject } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  HcclService,
  HcclUserProfileGETData,
  CLStudentGETData,
  CLSchoolGETData,
  CLStudentCriteria,
  PersonalStatementGETData,
  PersonalStatementCriteria,
  PersonalStatementPOSTData,
  CatalogEntryInterestGETData,
  CatalogEntryInterestCriteria,
  PMessageGETData,
  PMessageCriteria,
  WorkRequestDashboardUIGETData,
  HcclTeamGETData,
  HcclTeamCriteria,
  WorkRequestGETData,
  CatalogEntryCriteria,
  CatalogEntryGETData,
  CreateTicketPOSTData
} from '@app/restsvc/hccl.service';
import { HcclContextService } from '@app/shell/services/hccl-context.service';

/**
 * Student Dashboard data state
 */
export interface StudentDashboardState {
  isLoading: boolean;
  error: string | null;
  userProfile: HcclUserProfileGETData | null;
  student: CLStudentGETData | null;
  school: CLSchoolGETData | null;
  guidanceTeam: HcclTeamGETData | null;
}

/**
 * StudentContextService - Centralized data loading for student dashboard
 * Provides clean access to all student-related data without CRUD component dependencies
 */
@Injectable({
  providedIn: 'root'
})
export class StudentContextService {
  private hcclService = inject(HcclService);
  private hcclContextService = inject(HcclContextService);

  // State signal for reactive updates
  private _state = signal<StudentDashboardState>({
    isLoading: false,
    error: null,
    userProfile: null,
    student: null,
    school: null,
    guidanceTeam: null
  });

  public readonly state = this._state.asReadonly();
  public readonly isLoading = computed(() => this.state().isLoading);
  public readonly error = computed(() => this.state().error);
  public readonly userProfile = computed(() => this.state().userProfile);
  public readonly student = computed(() => this.state().student);
  public readonly school = computed(() => this.state().school);
  public readonly guidanceTeam = computed(() => this.state().guidanceTeam);

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  /**
   * Initialize student dashboard data
   * Loads user profile, student record, school, and guidance team
   */
  loadDashboardData(): Observable<StudentDashboardState> {
    this._state.update(s => ({ ...s, isLoading: true, error: null }));

    return this.hcclContextService.waitForReady$().pipe(
      switchMap(context => {
        if (!context?.currentUserProfileId) {
          throw new Error('User context not available');
        }

        const userProfileId = context.currentUserProfileId;
        const userProfile = context.currentUserProfile;

        // Load student data
        const studentCriteria: CLStudentCriteria = {
          userProfileId: userProfileId,
          pageNumber: 1,
          pageSize: 1,
          isPaging: true
        };

        return this.hcclService.findCLStudents(studentCriteria).pipe(
          switchMap(studentResults => {
            const student = studentResults.searchResults?.[0] || null;
            
            // If we have a student with a schoolId, load school and guidance team
            if (student?.schoolId) {
              return forkJoin({
                school: this.hcclService.getCLSchoolById(student.schoolId).pipe(
                  catchError(() => of(null))
                ),
                guidanceTeam: this.loadGuidanceTeam(student.schoolId)
              }).pipe(
                map(({ school, guidanceTeam }) => ({
                  isLoading: false,
                  error: null,
                  userProfile,
                  student,
                  school,
                  guidanceTeam
                }))
              );
            }

            return of({
              isLoading: false,
              error: null,
              userProfile,
              student,
              school: null,
              guidanceTeam: null
            });
          })
        );
      }),
      tap(state => this._state.set(state)),
      catchError(error => {
        const errorState: StudentDashboardState = {
          isLoading: false,
          error: error.message || 'Failed to load dashboard data',
          userProfile: null,
          student: null,
          school: null,
          guidanceTeam: null
        };
        this._state.set(errorState);
        return of(errorState);
      })
    );
  }

  private loadGuidanceTeam(schoolId: string): Observable<HcclTeamGETData | null> {
    const teamCriteria: HcclTeamCriteria = {
      teamParentId: schoolId,
      teamParentEntityType: 'CLSchool',
      pageNumber: 1,
      pageSize: 1,
      isPaging: true,
      optionalDataHint: 'members'
    };

    return this.hcclService.findHcclTeams(teamCriteria).pipe(
      map(results => results.searchResults?.[0] || null),
      catchError(() => of(null))
    );
  }

  // ============================================================================
  // PERSONAL STATEMENTS
  // ============================================================================

  /**
   * Get all personal statements for current user
   */
  getPersonalStatements(): Observable<PersonalStatementGETData[]> {
    return this.hcclContextService.waitForReady$().pipe(
      switchMap(context => {
        const criteria: PersonalStatementCriteria = {
          parentEntityId: context.currentUserProfileId,
          isPaging: false,
          maxResults: 100
        };
        return this.hcclService.findPersonalStatements(criteria);
      }),
      map(results => results.searchResults || []),
      catchError(() => of([]))
    );
  }

  /**
   * Get a single personal statement by ID
   */
  getPersonalStatementById(id: string): Observable<PersonalStatementGETData | null> {
    return this.hcclService.getPersonalStatementById(id).pipe(
      catchError(() => of(null))
    );
  }

  /**
   * Create a new personal statement
   */
  createPersonalStatement(data: { name: string; rawText: string }): Observable<PersonalStatementGETData> {
    return this.hcclContextService.waitForReady$().pipe(
      switchMap(context => {
        const postData: PersonalStatementPOSTData = {
          name: data.name,
          businessCode: 'autocalc',
          description: '',
          statementTypeCode: 'student_vocation',
          parentEntityId: context.currentUserProfileId,
          parentEntityType: 'HcclUserProfile',
          parentEntityName: 'Student',
          rawText: data.rawText,
          encodingText: '',
          status: 0
        };
        return this.hcclService.createPersonalStatement(postData);
      })
    );
  }

  /**
   * Update a personal statement
   */
  updatePersonalStatement(id: string, data: { name?: string; rawText?: string }): Observable<any> {
    return this.getPersonalStatementById(id).pipe(
      switchMap(existing => {
        if (!existing) throw new Error('Statement not found');
        return this.hcclService.updatePersonalStatementById(id, {
          name: data.name || existing.name || '',
          businessCode: existing.businessCode || 'autocalc',
          parentEntityId: existing.parentEntityId || '',
          rawText: data.rawText || existing.rawText || '',
          encodingText: existing.encodingText || ''
        });
      })
    );
  }

  /**
   * Delete a personal statement
   */
  deletePersonalStatement(id: string): Observable<any> {
    return this.hcclService.deletePersonalStatementById(id);
  }

  // ============================================================================
  // INTERESTS
  // ============================================================================

  /**
   * Get all interests for current user
   */
  getInterests(): Observable<CatalogEntryInterestGETData[]> {
    return this.hcclContextService.waitForReady$().pipe(
      switchMap(context => {
        const criteria: CatalogEntryInterestCriteria = {
          userProfileId: context.currentUserProfileId,
          pageNumber: 1,
          pageSize: 100,
          isPaging: true
        };
        return this.hcclService.findCatalogEntryInterests(criteria);
      }),
      map(results => results.searchResults || []),
      catchError(() => of([]))
    );
  }

  /**
   * Get a single interest by ID
   */
  getInterestById(id: string): Observable<CatalogEntryInterestGETData | null> {
    return this.hcclService.getCatalogEntryInterestById(id).pipe(
      catchError(() => of(null))
    );
  }

  /**
   * Remove an interest
   */
  removeInterest(id: string): Observable<any> {
    return this.hcclService.deleteCatalogEntryInterestById(id);
  }

  // ============================================================================
  // MESSAGES
  // ============================================================================

  /**
   * Get all messages for current user
   */
  getMessages(): Observable<PMessageGETData[]> {
    return this.hcclContextService.waitForReady$().pipe(
      switchMap(context => {
        const criteria: PMessageCriteria = {
          pageNumber: 1,
          pageSize: 100,
          isPaging: true
        };
        return this.hcclService.findPMessages(criteria);
      }),
      map(results => results.searchResults || []),
      catchError(() => of([]))
    );
  }

  /**
   * Get a single message by ID
   */
  getMessageById(id: string): Observable<PMessageGETData | null> {
    return this.hcclService.getPMessageById(id).pipe(
      catchError(() => of(null))
    );
  }

  // ============================================================================
  // GUIDANCE & SUPPORT
  // ============================================================================

  /**
   * Get guidance dashboard data (stats + recent tickets)
   */
  getGuidanceData(): Observable<WorkRequestDashboardUIGETData | null> {
    return this.hcclService.resolveGuidanceUIData().pipe(
      catchError(() => of(null))
    );
  }

  /**
   * Get a work request by ID
   */
  getWorkRequestById(id: string): Observable<WorkRequestGETData | null> {
    return this.hcclService.getWorkRequestById(id).pipe(
      catchError(() => of(null))
    );
  }

  /**
   * Create a guidance ticket
   */
  createGuidanceTicket(data: {
    title: string;
    description: string;
    personalStatementId?: string;
  }): Observable<any> {
    return this.hcclContextService.waitForReady$().pipe(
      switchMap(context => {
        return this.hcclService.callCreateTicket({
          studentUserProfileId: context.currentUserProfileId,
          title: data.title,
          rawText: data.description
        });
      })
    );
  }

  // ============================================================================
  // CATALOG SEARCH
  // ============================================================================

  /**
   * Search catalog entries
   */
  searchCatalog(params: {
    keyword?: string;
    catalogTypeCode?: string;
    availableOnly?: boolean;
  }): Observable<CatalogEntryGETData[]> {
    const criteria: CatalogEntryCriteria = {
      searchByText: params.keyword,
      catalogTypeCode: params.catalogTypeCode,
      available: params.availableOnly ? 1 : undefined,
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };

    return this.hcclService.findCatalogEntrys(criteria).pipe(
      map(results => results.searchResults || []),
      catchError(() => of([]))
    );
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Get current user profile ID
   */
  getCurrentUserProfileId(): string {
    return this.hcclContextService.getCurrentUserProfileId();
  }

  /**
   * Format date for display
   */
  formatDate(dateData: any): string {
    if (!dateData) return 'N/A';
    return dateData.formattedDate || dateData.date || 'N/A';
  }

  /**
   * Get display name for current user
   */
  getDisplayName(): string {
    const profile = this.userProfile();
    if (profile?.theUser?.name) return profile.theUser.name;
    return profile?.userEmail || 'Student';
  }

  /**
   * Get initials for avatar
   */
  getInitials(): string {
    const name = this.getDisplayName();
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
}

