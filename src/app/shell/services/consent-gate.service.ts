import { Injectable, inject, signal } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  ConsentRequestPOSTData,
  HcclService,
  HcclUserContextGETData,
  MultiConsentRequestGETData,
  PContractParticipantPUTData,
} from '@app/restsvc/hccl.service';
import { Logger } from '@core/services';

const ECOADMIN_PROFILE_TYPES = new Set(['ECOADMIN', 'EDU_ECOADMIN']);

/**
 * TEMP: backend findAllUnsignedContract still returns null, so the GET often
 * has consents: null. Keep false so we do not open an empty modal.
 */
const TEMP_FORCE_SHOW_WHEN_EMPTY = false;

@Injectable({
  providedIn: 'root',
})
export class ConsentGateService {
  private hcclService = inject(HcclService);
  private logger = new Logger('ConsentGateService');

  /** When true, the blocking consent modal should be visible. */
  readonly isModalOpen = signal(false);

  /** True while unsigned-consent check is in flight. */
  readonly isChecking = signal(false);

  /** True while accept/submit is in flight. */
  readonly isSubmitting = signal(false);

  /** Unsigned consents for the active profile (shown in the modal). */
  readonly unsignedConsents = signal<MultiConsentRequestGETData | null>(null);

  private lastCheckedProfileId: string | null = null;

  /**
   * Called whenever an HCCLUserProfile becomes active (first resolve after login
   * or a later profile switch). Not keyed off Keycloak login itself.
   */
  onProfileActivated(context: HcclUserContextGETData | null): void {
    if (!context) {
      this.resetGateContent();
      return;
    }

    if (this.isPublicPath(window.location.pathname)) {
      this.logger.info('Skipping consent gate on public path');
      this.resetGateContent();
      return;
    }

    const profileId = (context.currentUserProfileId || '').trim();
    if (!profileId) {
      this.resetGateContent();
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
      this.resetGateContent();
      return;
    }

    if (profileId === this.lastCheckedProfileId && this.isModalOpen()) {
      return;
    }

    if (profileId === this.lastCheckedProfileId && !this.isModalOpen()) {
      return;
    }

    this.lastCheckedProfileId = profileId;
    this.isChecking.set(true);

    this.hcclService.getAfterChangeUserProfileGETData().subscribe({
      next: (result) => {
        // TEMP: inspect unsigned-consent payload from after-change-user-profile
        console.log('[ConsentGate] getAfterChangeUserProfileGETData response', result);
        console.log('[ConsentGate] unsigned consents', {
          profileId,
          contractCount: result?.consents?.contracts?.length ?? 0,
          contracts: result?.consents?.contracts ?? [],
          userProfileBirthMonthNotSet: result?.userProfileBirthMonthNotSet,
          userProfileId: result?.userProfile?.id,
          profileTypeCode: result?.userProfile?.profileTypeCode,
        });

        if (this.lastCheckedProfileId !== profileId) {
          return;
        }
        this.isChecking.set(false);

        const consents = result?.consents || null;
        const contracts = consents?.contracts || [];
        if (contracts.length > 0) {
          this.logger.info('Unsigned consents require gate', {
            profileId,
            count: contracts.length,
          });
          this.unsignedConsents.set(consents);
          this.isModalOpen.set(true);
        } else if (TEMP_FORCE_SHOW_WHEN_EMPTY) {
          // TEMP: open modal anyway so UI can be verified while backend returns null/empty.
          console.warn(
            '[ConsentGate] TEMP_FORCE_SHOW_WHEN_EMPTY: opening modal with no contracts (backend consents null/empty)',
          );
          this.unsignedConsents.set(consents ?? { contracts: [] });
          this.isModalOpen.set(true);
        } else {
          this.resetGateContent();
        }
      },
      error: (err) => {
        // TEMP: inspect failures from after-change-user-profile
        console.error('[ConsentGate] getAfterChangeUserProfileGETData failed', {
          profileId,
          err,
        });

        if (this.lastCheckedProfileId !== profileId) {
          return;
        }
        this.isChecking.set(false);
        this.logger.error('Consent gate check failed; leaving app usable', err);
        this.resetGateContent();
      },
    });
  }

  /** Clear gate state on logout. */
  reset(): void {
    this.lastCheckedProfileId = null;
    this.isChecking.set(false);
    this.isSubmitting.set(false);
    this.resetGateContent();
  }

  /**
   * TEMP: remove when real accept flow is fully trusted end-to-end.
   */
  markConsentsAccepted(): void {
    this.resetGateContent();
  }

  /**
   * Persist accepted consents by updating each unsigned PContractParticipant,
   * then close the modal. Replace with a dedicated accept endpoint when available.
   */
  submitAcceptedConsents(
    selected: ConsentRequestPOSTData[],
  ): Observable<boolean> {
    const pendingContracts = this.unsignedConsents()?.contracts || [];

    // Nothing to sign (e.g. TEMP_FORCE_SHOW_WHEN_EMPTY with null backend consents).
    if (!pendingContracts.length) {
      console.warn(
        '[ConsentGate] Accept with no contracts — closing modal (temp empty-force path)',
      );
      this.resetGateContent();
      return of(true);
    }

    const updates = selected
      .map((consent) => consent.contractParticipantId)
      .filter((id): id is string => !!id && id.trim() !== '');

    if (!updates.length) {
      this.logger.warn('No contractParticipantId values on accepted consents');
      console.warn(
        '[ConsentGate] Accept blocked: contracts exist but no contractParticipantId on selection',
        { selected, pendingContracts },
      );
      return of(false);
    }

    this.isSubmitting.set(true);

    return forkJoin(
      updates.map((participantId) => this.signParticipant(participantId)),
    ).pipe(
      map((results) => results.every(Boolean)),
      map((ok) => {
        this.isSubmitting.set(false);
        if (ok) {
          this.resetGateContent();
        } else {
          console.warn('[ConsentGate] Accept failed for one or more participants');
        }
        return ok;
      }),
      catchError((err) => {
        this.isSubmitting.set(false);
        this.logger.error('Failed to submit consents', err);
        console.error('[ConsentGate] Accept submit error', err);
        return of(false);
      }),
    );
  }

  private signParticipant(participantId: string): Observable<boolean> {
    return this.hcclService.getPContractParticipantById(participantId).pipe(
      switchMap((existing) => {
        if (!existing) {
          return of(false);
        }
        const body: PContractParticipantPUTData = {
          userProfileUsername: existing.userProfileUsername || '',
          contractVersionInstanceId: existing.contractVersionInstanceId || '',
          contractVersionId: existing.contractVersionId || '',
          contractCode: existing.contractCode || '',
          userProfileId: existing.userProfileId || '',
          dateSigned: new Date().toISOString(),
          loginSessionId: existing.loginSessionId || '',
          digitalHash: existing.digitalHash === 'unsigned' ? 'signed' : existing.digitalHash || 'signed',
          agreeData: 'true',
        };
        return this.hcclService
          .updatePContractParticipantById(participantId, body)
          .pipe(
            map(() => true),
            catchError((err) => {
              this.logger.error('Failed to sign participant', {
                participantId,
                err,
              });
              return of(false);
            }),
          );
      }),
      catchError((err) => {
        this.logger.error('Failed to load participant for signing', {
          participantId,
          err,
        });
        return of(false);
      }),
    );
  }

  private resetGateContent(): void {
    this.unsignedConsents.set(null);
    this.isModalOpen.set(false);
  }

  private isPublicPath(pathname: string): boolean {
    const cleanPath = (pathname || '').split('?')[0].split('#')[0];
    const segments = cleanPath.split('/').filter(Boolean);
    return segments.includes('public');
  }
}
