import {
  Component,
  DestroyRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  effect,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TourGuideClient } from '@sjmc11/tourguidejs';
import { ConsentGateService } from '@app/shell/services/consent-gate.service';
import { MenuService } from '@app/shell/services/menu.service';
import {
  ONBOARD_STUDENT_TOUR_KEY,
  STUDENT_DASHBOARD_HOME,
  TOUR_QUERY,
} from '@app/features/dash-ecoadmin/miscellaneous/tour-registry';
import { Logger } from '@core/services';

interface OnboardTourStepDef {
  title: string;
  content: string;
  /** DHTMLX tree node id (usually the menu label). */
  menuId?: string;
}

const ONBOARD_STUDENT_STEPS: OnboardTourStepDef[] = [
  {
    title: 'Welcome',
    content:
      'Quick tour of your student dashboard. Use Next to walk through the left menu.',
  },
  {
    title: 'My Dashboard',
    content: 'Your home base — overview and what’s new.',
    menuId: 'My Dashboard',
  },
  {
    title: 'My Feed',
    content: 'Updates and activity relevant to you.',
    menuId: 'My Feed',
  },
  {
    title: 'My Participation',
    content: 'Track cohorts and programs you are part of.',
    menuId: 'My Participation',
  },
  {
    title: 'My Pursuits',
    content: 'Career goals and pursuits you are exploring.',
    menuId: 'My Pursuits',
  },
  {
    title: 'Research',
    content: 'Explore careers, organizations, and opportunities.',
    menuId: 'Research',
  },
  {
    title: 'My Profile',
    content: 'Your profile settings and personal details.',
    menuId: 'My Profile',
  },
];

@Component({
  selector: 'app-onboard-student-tour',
  standalone: true,
  template: '',
  styleUrl: './onboard-student-tour.component.scss',
  // Dialog/backdrop are appended to document.body by TourGuide JS.
  encapsulation: ViewEncapsulation.None,
})
export class OnboardStudentTourComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly consentGate = inject(ConsentGateService);
  private readonly menuService = inject(MenuService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ngZone = inject(NgZone);
  private readonly logger = new Logger('OnboardStudentTour');

  private client: TourGuideClient | null = null;
  private starting = false;
  private finishing = false;
  private activeTourKey: string | null = null;
  private waitTimer: ReturnType<typeof setTimeout> | null = null;
  private usedStudentMenuPreview = false;

  constructor() {
    // When consent modal closes while a tour is pending in the URL, try start.
    effect(() => {
      const modalOpen = this.consentGate.isModalOpen();
      const checking = this.consentGate.isChecking();
      if (!modalOpen && !checking) {
        this.maybeStartFromUrl();
      }
    });
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.maybeStartFromUrl());

    this.maybeStartFromUrl();
  }

  ngOnDestroy(): void {
    this.clearWaitTimer();
    // Prevent exit callbacks from navigating away during teardown.
    this.finishing = true;
    this.destroyClient();
    this.endStudentMenuPreview();
  }

  private maybeStartFromUrl(): void {
    const params = this.readTourQueryParams();
    const tourKey = params.tour;
    if (tourKey !== ONBOARD_STUDENT_TOUR_KEY) {
      return;
    }
    if (this.consentGate.isModalOpen() || this.consentGate.isChecking()) {
      return;
    }
    if (this.starting || this.client?.isVisible) {
      return;
    }
    if (this.activeTourKey === tourKey && this.client) {
      return;
    }

    // Ecoadmin (or any non-citizen shell) must land on the citizen dashboard
    // route so the main pane + tour targets match the walkthrough.
    if (!this.isOnCitizenDashboard()) {
      const tree = this.router.parseUrl(this.router.url);
      void this.router.navigateByUrl(
        this.router.createUrlTree(['/citizen', 'home'], {
          queryParams: tree.queryParams,
        }),
      );
      return;
    }

    this.scheduleStart(tourKey);
  }

  private isOnCitizenDashboard(): boolean {
    const path = (this.router.url || '').split('?')[0].split('#')[0];
    return (
      path === STUDENT_DASHBOARD_HOME ||
      path === '/citizen' ||
      path.startsWith('/citizen/') ||
      // Legacy redirect target still accepted if hit before redirect settles.
      path.startsWith('/student-dashboard/')
    );
  }

  private scheduleStart(tourKey: string): void {
    this.clearWaitTimer();
    this.starting = true;

    // Swap ecoadmin (etc.) sidebar to student menu so tour can highlight items.
    if (!this.findMenuTarget('My Dashboard')) {
      this.usedStudentMenuPreview = true;
      this.menuService.beginTourPreview('citizen');
    }

    const attempt = (remaining: number) => {
      if (this.consentGate.isModalOpen() || this.consentGate.isChecking()) {
        this.starting = false;
        return;
      }

      // Tree may still be painting after navigation / menu preview.
      const ready =
        !!this.findMenuTarget('My Dashboard') || remaining <= 0;
      if (!ready) {
        this.waitTimer = setTimeout(() => attempt(remaining - 1), 150);
        return;
      }

      this.clearWaitTimer();
      this.ngZone.runOutsideAngular(() => {
        void this.startTour(tourKey).finally(() => {
          this.ngZone.run(() => {
            this.starting = false;
          });
        });
      });
    };

    attempt(40);
  }

  private async startTour(tourKey: string): Promise<void> {
    this.finishing = true;
    this.destroyClient();
    this.finishing = false;
    this.activeTourKey = tourKey;

    const steps = this.buildSteps();
    const client = new TourGuideClient({
      steps,
      completeOnFinish: false,
      rememberStep: false,
      exitOnClickOutside: false,
      dialogAnimate: false,
      debug: false,
      // Sidebar targets sit on the left; auto-placement often puts the dialog
      // further left and clips it off-screen (esp. My Profile near the bottom).
      dialogPlacement: 'right',
      allowDialogOverlap: true,
      // Auto-scroll retriggers TourGuide's scroll listener, which repositions
      // the dialog with absolute coords and undoes our viewport pin.
      autoScroll: false,
      dialogClass: 'onboard-student-tour-dialog',
      backdropClass: 'onboard-student-tour-backdrop',
      nextLabel: 'Next',
      prevLabel: 'Back',
      finishLabel: 'Done',
    });

    // Hide until pinned — prevents the buried-corner flash on step changes.
    this.hideTourDialog(client);
    this.wrapPositionUpdates(client);

    client.onFinish(() => {
      this.handleTourEnded();
    });
    client.onAfterExit(() => {
      this.handleTourEnded();
    });
    client.onBeforeStepChange(() => {
      this.hideTourDialog(client);
    });
    client.onAfterStepChange(() => {
      this.ensureMenuStepVisible(client);
      this.pinDialogInViewport(client);
    });

    this.client = client;

    try {
      await client.start(tourKey);
      // TourGuide can paint an empty first dialog if DOM ids collide with a
      // previous instance; force a content refresh on step 0.
      this.hideTourDialog(client);
      await client.refreshDialog();
      await client.visitStep(0);
      this.pinDialogInViewport(client);
      this.logger.info('Started onboard student tour');
    } catch (err) {
      this.logger.error('Failed to start onboard student tour', err);
      this.finishing = true;
      this.destroyClient();
      this.activeTourKey = null;
      this.finishing = false;
      this.endStudentMenuPreview();
    }
  }

  /** Keep TourGuide's own position updates from flashing the wrong spot. */
  private wrapPositionUpdates(client: TourGuideClient): void {
    const original = client.updatePositions.bind(client);
    client.updatePositions = async () => {
      this.hideTourDialog(client);
      await original();
      this.pinDialogInViewport(client);
    };
  }

  private hideTourDialog(client: TourGuideClient): void {
    const dialog = client.dialog;
    if (!dialog) {
      return;
    }
    dialog.classList.remove('onboard-student-tour-dialog--ready');
    dialog.style.visibility = 'hidden';
    dialog.style.opacity = '0';
    dialog.style.pointerEvents = 'none';
  }

  /**
   * TourGuide's absolute positioning fights the fixed sidenav. Place the card
   * inside the main content column, vertically near the highlighted menu item.
   */
  private pinDialogInViewport(client: TourGuideClient): void {
    const dialog = client.dialog;
    if (!dialog || dialog.style.display === 'none') {
      return;
    }

    const content =
      (document.querySelector('mdb-sidenav-content') as HTMLElement | null) ||
      (document.querySelector('.body-wrapper') as HTMLElement | null);
    const contentRect = content?.getBoundingClientRect();

    const step = client.tourSteps?.[client.activeStep];
    const targetEl = step?.target as HTMLElement | undefined;
    const targetRect =
      targetEl && targetEl !== document.body
        ? targetEl.getBoundingClientRect()
        : null;

    const margin = 16;
    const width = dialog.offsetWidth || 320;
    const height = dialog.offsetHeight || 160;
    const navbarHeight = 64;

    // Prefer main-pane left edge; fall back to classic 240px sidenav width.
    const contentLeft =
      contentRect && contentRect.width > 80
        ? contentRect.left
        : 240;
    const contentTop =
      contentRect && contentRect.height > 80
        ? Math.max(contentRect.top, navbarHeight)
        : navbarHeight + margin;

    let left = contentLeft + margin;
    if (left + width > window.innerWidth - margin) {
      left = Math.max(margin, window.innerWidth - width - margin);
    }
    // Never sit under the sidebar / logo.
    left = Math.max(left, 240 + margin, contentLeft + margin);

    let top = targetRect
      ? targetRect.top + targetRect.height / 2 - height / 2
      : contentTop + margin;
    top = Math.max(contentTop + margin, top);
    if (top + height > window.innerHeight - margin) {
      top = Math.max(contentTop + margin, window.innerHeight - height - margin);
    }

    dialog.classList.add('tg-dialog-fixed', 'onboard-student-tour-dialog--pinned');
    Object.assign(dialog.style, {
      position: 'fixed',
      left: `${Math.round(left)}px`,
      top: `${Math.round(top)}px`,
      right: 'auto',
      bottom: 'auto',
      transform: 'none',
      margin: '0',
      visibility: 'visible',
      opacity: '1',
      pointerEvents: 'auto',
    });
    dialog.classList.add('onboard-student-tour-dialog--ready');

    const arrow = dialog.querySelector('#tg-arrow') as HTMLElement | null;
    if (arrow) {
      arrow.style.display = 'none';
    }
  }

  private ensureMenuStepVisible(client: TourGuideClient): void {
    const step = client.tourSteps?.[client.activeStep];
    const target = step?.target as HTMLElement | undefined;
    if (!target || target === document.body) {
      return;
    }
    try {
      target.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    } catch {
      // ignore
    }
  }

  private buildSteps(): Array<{
    title: string;
    content: string;
    target?: HTMLElement;
    order: number;
    group: string;
  }> {
    return ONBOARD_STUDENT_STEPS.map((def, index) => {
      const target = def.menuId ? this.findMenuTarget(def.menuId) : null;
      return {
        title: def.title,
        content: def.content,
        // Keep sidebar highlight; dialog is pinned in viewport separately.
        target: target || undefined,
        order: index,
        group: ONBOARD_STUDENT_TOUR_KEY,
      };
    });
  }

  private findMenuTarget(menuId: string): HTMLElement | null {
    const escaped =
      typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
        ? CSS.escape(menuId)
        : menuId.replace(/"/g, '\\"');
    const byData = document.querySelector(
      `[data-dhx-id="${escaped}"]`,
    ) as HTMLElement | null;
    if (byData) {
      return (
        (byData.closest('.dhx_tree-folder, .dhx_tree-list-item') as HTMLElement) ||
        byData
      );
    }
    const byAttr = document.querySelector(
      `[dhx_id="${escaped}"]`,
    ) as HTMLElement | null;
    if (byAttr) {
      return (
        (byAttr.closest('.dhx_tree-folder, .dhx_tree-list-item') as HTMLElement) ||
        byAttr
      );
    }
    return null;
  }

  private handleTourEnded(): void {
    if (this.finishing) {
      return;
    }
    this.finishing = true;
    const params = this.readTourQueryParams();
    const returnPath = this.sanitizeReturnPath(params.tourReturn);

    this.ngZone.run(() => {
      this.destroyClient();
      this.activeTourKey = null;
      this.endStudentMenuPreview();

      if (returnPath) {
        void this.router.navigateByUrl(returnPath);
        return;
      }

      void this.router.navigateByUrl(STUDENT_DASHBOARD_HOME, {
        replaceUrl: true,
      });
    });
  }

  private readTourQueryParams(): {
    tour: string | null;
    tourReturn: string | null;
    tourSource: string | null;
  } {
    const tree = this.router.parseUrl(this.router.url);
    const q = tree.queryParams;
    return {
      tour: (q[TOUR_QUERY.tour] as string) || null,
      tourReturn: (q[TOUR_QUERY.tourReturn] as string) || null,
      tourSource: (q[TOUR_QUERY.tourSource] as string) || null,
    };
  }

  /** Only allow same-app absolute paths (no protocol / open redirect). */
  private sanitizeReturnPath(raw: string | null): string | null {
    if (!raw) {
      return null;
    }
    const value = raw.trim();
    if (!value.startsWith('/') || value.startsWith('//')) {
      return null;
    }
    if (value.includes('://')) {
      return null;
    }
    return value;
  }

  private destroyClient(): void {
    const client = this.client;
    this.client = null;
    if (client) {
      try {
        void client.exit();
      } catch {
        // ignore
      }
      try {
        client.dialog?.remove();
      } catch {
        // ignore
      }
      try {
        client.backdrop?.remove();
      } catch {
        // ignore
      }
    }
    // TourGuide uses document.getElementById for title/body — orphaned dialogs
    // from prior starts steal updates and leave the visible dialog blank.
    document.querySelectorAll('.tg-dialog, .tg-backdrop').forEach((el) => {
      el.remove();
    });
    document.body.classList.remove('tg-no-interaction');
  }

  private endStudentMenuPreview(): void {
    if (!this.usedStudentMenuPreview) {
      return;
    }
    this.usedStudentMenuPreview = false;
    this.menuService.endTourPreview();
  }

  private clearWaitTimer(): void {
    if (this.waitTimer != null) {
      clearTimeout(this.waitTimer);
      this.waitTimer = null;
    }
  }
}
