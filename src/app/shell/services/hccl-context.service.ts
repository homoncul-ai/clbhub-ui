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
    this.initializeContext();
  }

  /**
   * Cookie name for storing userProfileId
   */
  private static readonly USER_PROFILE_ID_COOKIE = 'hccl_user_profile_id';

  /**
   * Set userProfileId in browser cookie
   * @param userProfileId - The user profile ID to store
   */
  public setUserProfileIdCookie(userProfileId: string): void {
    if (userProfileId && userProfileId.trim() !== '') {
      // Set cookie with 30 days expiration
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);
      
      document.cookie = `${HcclContextService.USER_PROFILE_ID_COOKIE}=${userProfileId}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`;
      this.logger.info('User profile ID cookie set', { userProfileId });
    } else {
      this.logger.warn('Attempted to set empty userProfileId cookie');
    }
  }

  /**
   * Get userProfileId from browser cookie
   * @returns The user profile ID from cookie or empty string if not found
   */
  public getUserProfileIdFromCookie(): string {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === HcclContextService.USER_PROFILE_ID_COOKIE) {
        this.logger.info('User profile ID retrieved from cookie', { userProfileId: value });
        return value || '';
      }
    }
    this.logger.info('No user profile ID cookie found');
    return '';
  }

  /**
   * Clear userProfileId cookie
   */
  public clearUserProfileIdCookie(): void {
    document.cookie = `${HcclContextService.USER_PROFILE_ID_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    this.logger.info('User profile ID cookie cleared');
  }

  /**
   * Static method to get userProfileId from cookie
   * @returns The user profile ID from cookie or empty string if not found
   */
  public static getUserProfileIdFromCookie(): string {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === HcclContextService.USER_PROFILE_ID_COOKIE) {
        return value || '';
      }
    }
    return '';
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

    // If no userProfileId provided, try to get it from cookie
    if (!userProfileId || userProfileId.trim() === '') {
      userProfileId = this.getUserProfileIdFromCookie();
      if (userProfileId) {
        this.logger.info('Using userProfileId from cookie for initialization', { userProfileId });
      }
    }

    this.logger.info('Initializing HCCL context', { userProfileId });

    return this.hcclService.resolveTicketContext(userProfileId).pipe(
      tap((context: HcclUserContextGETData) => {
        this.logger.info('hccl-context.service.ts: HCCL context loaded successfully', { context });
        
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
  public refreshContext(): Observable<HcclUserContextGETData> {
    this.logger.info('Refreshing HCCL context');
    var userProfileId: string | null = this.getCurrentUserProfileId();
    if(userProfileId == null) {
      userProfileId = '';
    }
    return this.initializeContext(userProfileId);
  }

  /**
   * Get the current context data
   * @returns Current context data or empty object if not initialized
   */
  public getContext(): HcclUserContextGETData {
    // Check if context is ready before returning data
    if (!this.isReady()) {
      this.logger.warn('Attempting to get context before it is ready');
      return {
        currentUserProfileId: '',
        currentUserProfile: {},
        messages: {
          messages: []
        },
        userProfileMenu: {
          applicationName: '',
          clientId: '',
          menuId: '',
          menuName: '',
          label: '',
        },
        dashQueues: []
      };
    }

    return this.context()!;
  }

  /**
   * Get the current context data (async version that waits for ready)
   * @returns Promise that resolves with context data when ready
   */
  public async getContextAsync(): Promise<HcclUserContextGETData> {
    if (this.isReady()) {
      return this.context()!;
    }
    return this.waitForReady();
  }

  public getContextWrapper() : HcclContextWrapper {
    var x = new HcclContextWrapper();
    x.data = this.getContext();
    return x as HcclContextWrapper;
  }

  public getContextWrapperAsync() : Promise<HcclContextWrapper> {
    var x = new HcclContextWrapper();
    x.data = this.getContext();
    return Promise.resolve(x);

  }

  /**
   * Get the current user profile ID
   * @returns Current user profile ID or empty string if not available
   */
  public getCurrentUserProfileId(): string {
    if (!this.isReady()) {
      this.logger.warn('Attempting to get user profile ID before context is ready');
      return '--not-set--';
    }
    return this.context()?.currentUserProfileId || '';
  }

  /**
   * Get the current user profile ID (async version that waits for ready)
   * @returns Promise that resolves with user profile ID when ready
   */
  public async getCurrentUserProfileIdAsync(): Promise<string> {
    if (this.isReady()) {
      return this.context()?.currentUserProfileId || '';
    }
    const context = await this.waitForReady();
    return context.currentUserProfileId || '';
  }

  /**
   * Get the current user profile
   * @returns Current user profile or null if not available
   */
  public getCurrentUserProfile(): any {
    if (!this.isReady()) {
      this.logger.warn('Attempting to get user profile before context is ready');
      return null;
    }
    return this.context()?.currentUserProfile || null;
  }

  /**
   * Get the current user profile (async version that waits for ready)
   * @returns Promise that resolves with user profile when ready
   */
  public async getCurrentUserProfileAsync(): Promise<any> {
    if (this.isReady()) {
      return this.context()?.currentUserProfile || null;
    }
    const context = await this.waitForReady();
    return context.currentUserProfile || null;
  }

  /**
   * Get user profile menu
   * @returns User profile menu or null if not available
   */
  public getUserProfileMenu(): any {
    if (!this.isReady()) {
      this.logger.warn('Attempting to get user profile menu before context is ready');
      return null;
    }
    return this.context()?.userProfileMenu || null;
  }

  /**
   * Get user profile menu (async version that waits for ready)
   * @returns Promise that resolves with user profile menu when ready
   */
  public async getUserProfileMenuAsync(): Promise<any> {
    if (this.isReady()) {
      return this.context()?.userProfileMenu || null;
    }
    const context = await this.waitForReady();
    return context.userProfileMenu || null;
  }

  /**
   * Get messages
   * @returns Messages or null if not available
   */
  public getMessages(): any {
    if (!this.isReady()) {
      this.logger.warn('Attempting to get messages before context is ready');
      return null;
    }
    return this.context()?.messages || null;
  }

  /**
   * Get messages (async version that waits for ready)
   * @returns Promise that resolves with messages when ready
   */
  public async getMessagesAsync(): Promise<any> {
    if (this.isReady()) {
      return this.context()?.messages || null;
    }
    const context = await this.waitForReady();
    return context.messages || null;
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
      // If already ready, resolve immediately
      if (this.isReady()) {
        resolve(this.getContext()!);
        return;
      }

      // If there's an error, reject immediately
      if (this.error()) {
        reject(new Error(this.error() || 'Failed to initialize HCCL context'));
        return;
      }

      const timeoutId = setTimeout(() => {
        reject(new Error('Timeout waiting for HCCL context to be ready'));
      }, timeout);

      // Use a more efficient approach that checks loading state
      const checkReady = () => {
        // If loading is complete and we have context, resolve
        if (!this.isLoading() && this.isReady()) {
          clearTimeout(timeoutId);
          resolve(this.getContext()!);
          return;
        }
        
        // If there's an error, reject
        if (this.error()) {
          clearTimeout(timeoutId);
          reject(new Error(this.error() || 'Failed to initialize HCCL context'));
          return;
        }

        // If still loading, check again in a shorter interval
        if (this.isLoading()) {
          setTimeout(checkReady, 50); // Check more frequently when loading
        } else {
          setTimeout(checkReady, 100); // Check less frequently when not loading
        }
      };

      // Start checking
      checkReady();
    });
  }

  /**
   * Get an observable that emits when context is ready
   * @returns Observable that emits the context data when ready
   */
  public waitForReady$(): Observable<HcclUserContextGETData> {
    return new Observable(observer => {
      // If already ready, emit immediately
      if (this.isReady()) {
        observer.next(this.getContext()!);
        observer.complete();
        return;
      }

      // If there's an error, emit error immediately
      if (this.error()) {
        observer.error(new Error(this.error() || 'Failed to initialize HCCL context'));
        return;
      }

      // Use polling approach but more efficiently
      const checkInterval = setInterval(() => {
        const currentState = this.state();
        
        // If loading is complete and we have context, emit
        if (!currentState.isLoading && currentState.isInitialized && currentState.context) {
          clearInterval(checkInterval);
          observer.next(currentState.context);
          observer.complete();
          return;
        }
        
        // If there's an error, emit error
        if (currentState.error) {
          clearInterval(checkInterval);
          observer.error(new Error(currentState.error));
          return;
        }
      }, 50); // Check more frequently

      // Return cleanup function
      return () => clearInterval(checkInterval);
    });
  }
} 

export class HcclContextWrapper {
  public data: HcclUserContextGETData = {
    currentUserProfileId: '',
    currentUserProfile: {},
    messages: {
      messages: []
    },
    userProfileMenu: {
      applicationName: '',
      clientId: '',
      menuId: '',
      menuName: '',
      label: '',
    },
    dashQueues: []
  };

  public hasRole(roleCode: string) : boolean {
    return true;
  }
}


