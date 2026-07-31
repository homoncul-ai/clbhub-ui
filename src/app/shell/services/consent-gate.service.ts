import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HcclUserContextGETData } from '@app/restsvc/hccl.service';
import { Logger } from '@core/services';

/**
 * Temporary stub until backend unsigned-consent APIs are available.
 * Set STUB_HAS_UNSIGNED to false to hide the modal while developing locally.
 * Do not call through hccl.service.ts yet — wire a dedicated HTTP call here later.
 */
const USE_STUB_UNSIGNED_CONSENTS = true;
const STUB_HAS_UNSIGNED = true;

const ECOADMIN_PROFILE_TYPES = new Set(['ECOADMIN', 'EDU_ECOADMIN']);

export interface UnsignedConsentsCheckResult {
  hasUnsigned: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ConsentGateService {
  private logger = new Logger('ConsentGateService');

  /** When true, the blocking consent modal should be visible. */
  readonly isModalOpen = signal(false);

  /** True while a stub/real unsigned-consent check is in flight. */
  readonly isChecking = signal(false);

  private lastCheckedProfileId: string | null = null;

  /**
   * Called whenever an HCCLUserProfile becomes active (first resolve after login
   * or a later profile switch). Not keyed off Keycloak login itself.
   */
  onProfileActivated(context: HcclUserContextGETData | null): void {
    if (!context) {
      this.closeModal();
      return;
    }

    if (this.isPublicPath(window.location.pathname)) {
      this.logger.info('Skipping consent gate on public path');
      this.closeModal();
      return;
    }

    const profileId = (context.currentUserProfileId || '').trim();
    if (!profileId) {
      this.closeModal();
      return;
    }

    const profileType = (
      context.currentUserProfile?.profileTypeCode || ''
    ).toUpperCase();
    if (ECOADMIN_PROFILE_TYPES.has(profileType)) {
      this.logger.info('Skipping consent gate for ecoadmin profile', {
        profileId,
        profileType,
      });
      this.lastCheckedProfileId = profileId;
      this.closeModal();
      return;
    }

    if (profileId === this.lastCheckedProfileId && this.isModalOpen()) {
      // Same profile still gated — keep modal open.
      return;
    }

    if (profileId === this.lastCheckedProfileId && !this.isModalOpen()) {
      // Already evaluated this profile and it was clear (or stub said no).
      return;
    }

    this.lastCheckedProfileId = profileId;
    this.isChecking.set(true);

    this.checkUnsignedConsents(profileId).subscribe({
      next: (result) => {
        // Ignore stale responses if the user switched profiles mid-check.
        if (this.lastCheckedProfileId !== profileId) {
          return;
        }
        this.isChecking.set(false);
        if (result.hasUnsigned) {
          this.logger.info('Unsigned consents require gate', { profileId });
          this.isModalOpen.set(true);
        } else {
          this.closeModal();
        }
      },
      error: (err) => {
        if (this.lastCheckedProfileId !== profileId) {
          return;
        }
        this.isChecking.set(false);
        this.logger.error('Consent gate check failed; leaving app usable', err);
        this.closeModal();
      },
    });
  }

  /** Clear gate state on logout. */
  reset(): void {
    this.lastCheckedProfileId = null;
    this.isChecking.set(false);
    this.closeModal();
  }

  /**
   * Placeholder for future accept flow. Call after backend accept succeeds.
   */
  markConsentsAccepted(): void {
    this.closeModal();
  }

  /**
   * Stubbed check. Replace body with real HTTP when supervisor APIs land
   * (without requiring edits to hccl.service.ts if calling HttpClient here).
   */
  checkUnsignedConsents(userProfileId: string): Observable<UnsignedConsentsCheckResult> {
    if (USE_STUB_UNSIGNED_CONSENTS) {
      this.logger.info('Using stub unsigned-consent check', {
        userProfileId,
        hasUnsigned: STUB_HAS_UNSIGNED,
      });
      return of({ hasUnsigned: STUB_HAS_UNSIGNED }).pipe(delay(0));
    }

    // Future: call backend findAllUnsignedContract (or equivalent) here.
    return of({ hasUnsigned: false });
  }

  private closeModal(): void {
    this.isModalOpen.set(false);
  }

  private isPublicPath(pathname: string): boolean {
    const cleanPath = (pathname || '').split('?')[0].split('#')[0];
    const segments = cleanPath.split('/').filter(Boolean);
    return segments.includes('public');
  }
}
