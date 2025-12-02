import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  HcclService,
  HcclUserProfileGETData,
  HcclOrganizationGETData,
  CatalogGETData,
  CatalogCriteria,
  WorkQueueGETData,
  WorkQueueCriteria,
  WorkRequestDashboardUIGETData,
  WorkRequestGETData,
  WorkRequestCriteria,
  CatalogEntryGETData,
  CatalogEntryCriteria
} from '@app/restsvc/hccl.service';
import { HcclContextService } from '@app/shell/services/hccl-context.service';

/**
 * Provider Dashboard data state
 */
export interface ProviderDashboardState {
  isLoading: boolean;
  error: string | null;
  userProfile: HcclUserProfileGETData | null;
  organization: HcclOrganizationGETData | null;
  organizationId: string | null;
}

/**
 * ProviderContextService - Centralized data loading for provider dashboard
 * Provides clean access to all provider-related data without CRUD component dependencies
 */
@Injectable({
  providedIn: 'root'
})
export class ProviderContextService {
  private hcclService = inject(HcclService);
  private hcclContextService = inject(HcclContextService);

  // State signal for reactive updates
  private _state = signal<ProviderDashboardState>({
    isLoading: false,
    error: null,
    userProfile: null,
    organization: null,
    organizationId: null
  });

  public readonly state = this._state.asReadonly();
  public readonly isLoading = computed(() => this.state().isLoading);
  public readonly error = computed(() => this.state().error);
  public readonly userProfile = computed(() => this.state().userProfile);
  public readonly organization = computed(() => this.state().organization);
  public readonly organizationId = computed(() => this.state().organizationId);

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  /**
   * Initialize provider dashboard data
   * Loads user profile and organization data
   */
  loadDashboardData(): Observable<ProviderDashboardState> {
    this._state.update(s => ({ ...s, isLoading: true, error: null }));

    return this.hcclContextService.waitForReady$().pipe(
      switchMap(context => {
        if (!context?.currentUserProfileId) {
          throw new Error('User context not available');
        }

        const userProfileId = context.currentUserProfileId;
        const userProfile = context.currentUserProfile;
        const organizationId = userProfile?.organizationId;

        if (!organizationId) {
          const errorState: ProviderDashboardState = {
            isLoading: false,
            error: 'Organization ID not found in user profile',
            userProfile,
            organization: null,
            organizationId: null
          };
          this._state.set(errorState);
          return of(errorState);
        }

        return this.hcclService.getHcclOrganizationById(organizationId).pipe(
          map(organization => ({
            isLoading: false,
            error: null,
            userProfile,
            organization,
            organizationId
          })),
          tap(state => this._state.set(state)),
          catchError(error => {
            const errorState: ProviderDashboardState = {
              isLoading: false,
              error: error.message || 'Failed to load organization data',
              userProfile,
              organization: null,
              organizationId
            };
            this._state.set(errorState);
            return of(errorState);
          })
        );
      }),
      catchError(error => {
        const errorState: ProviderDashboardState = {
          isLoading: false,
          error: error.message || 'Failed to load dashboard data',
          userProfile: null,
          organization: null,
          organizationId: null
        };
        this._state.set(errorState);
        return of(errorState);
      })
    );
  }

  // ============================================================================
  // CATALOGS
  // ============================================================================

  /**
   * Get all catalogs for current organization
   */
  getCatalogs(includeStats: boolean = true): Observable<CatalogGETData[]> {
    return this.hcclContextService.waitForReady$().pipe(
      switchMap(context => {
        const organizationId = context.currentUserProfile?.organizationId;
        if (!organizationId) {
          return of([]);
        }

        const criteria: CatalogCriteria = {
          organizationId: organizationId,
          includingCatalogStats: includeStats,
          available: 1,
          pageNumber: 1,
          pageSize: 100,
          isPaging: true
        };

        return this.hcclService.findCatalogs(criteria).pipe(
          map(results => results.searchResults || []),
          catchError(() => of([]))
        );
      })
    );
  }

  /**
   * Get catalog entries for a specific catalog
   */
  getCatalogEntries(catalogId: string): Observable<CatalogEntryGETData[]> {
    const criteria: CatalogEntryCriteria = {
      catalogId: catalogId,
      pageNumber: 1,
      pageSize: 100,
      isPaging: true
    };

    return this.hcclService.findCatalogEntrys(criteria).pipe(
      map(results => results.searchResults || []),
      catchError(() => of([]))
    );
  }

  // ============================================================================
  // WORK QUEUES
  // ============================================================================

  /**
   * Get work queues for current organization
   */
  getWorkQueues(): Observable<WorkQueueGETData[]> {
    return this.hcclContextService.waitForReady$().pipe(
      switchMap(context => {
        const organizationId = context.currentUserProfile?.organizationId;
        if (!organizationId) {
          return of([]);
        }

        const criteria: WorkQueueCriteria = {
          organizationId: organizationId,
          externalQueue: 1,
          includingStats: true,
          pageNumber: 1,
          pageSize: 50,
          isPaging: true
        };

        return this.hcclService.findWorkQueues(criteria).pipe(
          map(results => results.searchResults || []),
          catchError(() => of([]))
        );
      })
    );
  }

  // ============================================================================
  // WORK REQUESTS
  // ============================================================================

  /**
   * Get work request dashboard data
   */
  getWorkRequestDashboardData(): Observable<WorkRequestDashboardUIGETData | null> {
    return this.hcclService.resolveGuidanceUIData().pipe(
      catchError(() => of(null))
    );
  }

  /**
   * Find work requests by criteria
   */
  findWorkRequests(criteria: WorkRequestCriteria): Observable<WorkRequestGETData[]> {
    return this.hcclService.findWorkRequests(criteria).pipe(
      map(results => results.searchResults || []),
      catchError(() => of([]))
    );
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Get current organization ID
   */
  getCurrentOrganizationId(): string | null {
    return this.organizationId();
  }

  /**
   * Format date for display
   */
  formatDate(dateData: any): string {
    if (!dateData) return 'N/A';
    return dateData.formattedDate || dateData.date || 'N/A';
  }

  /**
   * Get display name for current organization
   */
  getOrganizationDisplayName(): string {
    const org = this.organization();
    return org?.name || org?.businessCode || 'Organization';
  }
}

