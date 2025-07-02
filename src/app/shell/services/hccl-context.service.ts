import { Injectable, inject, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HcclService, HcclUserContextGETData } from '@app/restsvc/hccl.service';
import { Logger } from '@core/services';

export interface HcclContextState {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  context: HcclUserContextGETData | null;
  lastUpdated: Date | null;
}

@Injectable({
  providedIn: 'root'
})
export class HcclContextService {
  private hcclService = inject(HcclService);
  private logger = new Logger('HcclContextService');

  // Private state using signals for reactive updates
  private _state = signal<HcclContextState>({
    isInitialized: false,
    isLoading: false,
    error: null,
    context: null,
    lastUpdated: null
  });

  // Public readonly state
  public readonly state = this._state.asReadonly();

  // Computed values for easy access
  public readonly isInitialized = computed(() => this.state().isInitialized);
  public readonly isLoading = computed(() => this.state().isLoading);
  public readonly error = computed(() => this.state().error);
  public readonly context = computed(() => this.state().context);
  public readonly lastUpdated = computed(() => this.state().lastUpdated);

  // BehaviorSubject for backward compatibility with existing code
  private _contextSubject = new BehaviorSubject<HcclUserContextGETData | null>(null);
  public context$ = this._contextSubject.asObservable();

  constructor() {
    // Log service initialization
    this.logger.info('HcclContextService initialized');
  }

  /**
   * Initialize the HCCL context after Keycloak authentication is complete
   * @param userProfileId - Optional user profile ID, defaults to empty string
   * @returns Observable of the context data
   */
  public initializeContext(userProfileId: string = ''): Observable<HcclUserContextGETData> {
    // Set loading state
    this._state.update(state => ({
      ...state,
      isLoading: true,
      error: null
    }));

    this.logger.info('Initializing HCCL context', { userProfileId });

    return this.hcclService.resolveTicketContext(userProfileId).pipe(
      tap((context: HcclUserContextGETData) => {
        this.logger.info('HCCL context loaded successfully', { context });
        
        // Update state
        this._state.update(state => ({
          ...state,
          isInitialized: true,
          isLoading: false,
          error: null,
          context: context,
          lastUpdated: new Date()
        }));

        // Update BehaviorSubject for backward compatibility
        this._contextSubject.next(context);
      }),
      catchError((error: any) => {
        this.logger.error('Failed to initialize HCCL context', error);
        
        // Update state with error
        this._state.update(state => ({
          ...state,
          isInitialized: false,
          isLoading: false,
          error: error?.message || 'Failed to initialize HCCL context',
          context: null,
          lastUpdated: null
        }));

        // Update BehaviorSubject
        this._contextSubject.next(null);
        
        return of(null as any);
      })
    );
  }

  /**
   * Refresh the context data
   * @param userProfileId - Optional user profile ID
   * @returns Observable of the refreshed context data
   */
  public refreshContext(userProfileId: string = ''): Observable<HcclUserContextGETData> {
    this.logger.info('Refreshing HCCL context');
    return this.initializeContext(userProfileId);
  }

  /**
   * Get the current context data
   * @returns Current context data or null if not initialized
   */
  public getContext(): HcclUserContextGETData | null {
    return this.context();
  }

  /**
   * Get the current user profile ID
   * @returns Current user profile ID or null if not available
   */
  public getCurrentUserProfileId(): string | null {
    return this.context()?.currentUserProfileId || null;
  }

  /**
   * Get the current user profile
   * @returns Current user profile or null if not available
   */
  public getCurrentUserProfile(): any {
    return this.context()?.currentUserProfile || null;
  }

  /**
   * Get user profile menu
   * @returns User profile menu or null if not available
   */
  public getUserProfileMenu(): any {
    return this.context()?.userProfileMenu || null;
  }

  /**
   * Get messages
   * @returns Messages or null if not available
   */
  public getMessages(): any {
    return this.context()?.messages || null;
  }

  /**
   * Check if context is ready for use
   * @returns True if context is initialized and has data
   */
  public isReady(): boolean {
    return this.isInitialized() && this.context() !== null;
  }

  /**
   * Clear the context (useful for logout)
   */
  public clearContext(): void {
    this.logger.info('Clearing HCCL context');
    
    this._state.update(state => ({
      ...state,
      isInitialized: false,
      isLoading: false,
      error: null,
      context: null,
      lastUpdated: null
    }));

    this._contextSubject.next(null);
  }

  /**
   * Get context state for debugging
   * @returns Current state object
   */
  public getState(): HcclContextState {
    return this.state();
  }

  /**
   * Wait for context to be ready
   * @param timeout - Timeout in milliseconds (default: 30000ms)
   * @returns Promise that resolves when context is ready or rejects on timeout
   */
  public waitForReady(timeout: number = 30000): Promise<HcclUserContextGETData> {
    return new Promise((resolve, reject) => {
      if (this.isReady()) {
        resolve(this.getContext()!);
        return;
      }

      const timeoutId = setTimeout(() => {
        reject(new Error('Timeout waiting for HCCL context to be ready'));
      }, timeout);

      // Check every 100ms
      const intervalId = setInterval(() => {
        if (this.isReady()) {
          clearTimeout(timeoutId);
          clearInterval(intervalId);
          resolve(this.getContext()!);
        } else if (this.error()) {
          clearTimeout(timeoutId);
          clearInterval(intervalId);
          reject(new Error(this.error() || 'Failed to initialize HCCL context'));
        }
      }, 100);
    });
  }
} 