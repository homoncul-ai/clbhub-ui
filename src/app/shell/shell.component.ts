import { Component, OnDestroy, OnInit, inject, AfterViewInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { I18nService } from '@app/i18n';
import { Title } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '@env/environment';
import { filter, merge, fromEvent } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Logger } from '@core/services';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType } from 'keycloak-angular';
import { effect } from '@angular/core';
import { NgZone, ViewChild } from '@angular/core';
import { MdbSidenavComponent } from 'mdb-angular-ui-kit/sidenav';
import { MenuService, MenuItem } from './services/menu.service';

@UntilDestroy()
@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  standalone: false
})
export class ShellComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sidenav', { static: true }) sidenav!: MdbSidenavComponent;
  title = 'mdb-angular-admin-dashboards';
  currentRoute: string = '';
  menuItems: MenuItem[] = [];

  mode = window.innerWidth >= 1400 ? 'side' : 'over';
  hidden = window.innerWidth >= 1400 ? false : true;

  private keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);

  constructor(
    private ngZone: NgZone,
    private readonly _router: Router,
    private readonly _titleService: Title,
    private readonly _translateService: TranslateService,
    private readonly _i18nService: I18nService,
    private readonly _menuService: MenuService
  ) {
    // Setup Keycloak event listener
    effect(() => {
      const keycloakEvent = this.keycloakSignal();
      if (keycloakEvent.type === KeycloakEventType.Ready) {
        console.log('Keycloak is ready');
        // After Keycloak is ready, navigate to the default route
        this._router.navigate(['/advocate-dashboard/messages']);
      }
      if (keycloakEvent.type === KeycloakEventType.AuthLogout) {
        console.log('User logged out');
      }
    });

    // Subscribe to route changes
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      untilDestroyed(this)
    ).subscribe((event: any) => {
      console.log('event', event);
      
      // Check if this is a Keycloak callback
      if (event.url.includes('state=') || event.url.includes('code=')) {
        console.log('Keycloak callback detected, skipping route update');
        return;
      }

      this.currentRoute = event.url;
      this.updateMenuItems();
    });
  }

  private updateMenuItems() {
    const dashboardType = this._menuService.getDashboardTypeFromRoute(this.currentRoute);
    if (dashboardType) {
      this.menuItems = this._menuService.getMenuItems(dashboardType);
    }
  }

  async ngOnInit() {
    // Set initial route and menu items
    this.currentRoute = this._router.url;
    this.updateMenuItems();

    // Setup logger
    if (environment.production) {
      Logger.enableProductionMode();
    }

    // Initialize i18nService with default language and supported languages
    this._i18nService.init(environment.defaultLanguage, environment.supportedLanguages);

    const onNavigationEnd = this._router.events.pipe(filter((event) => event instanceof NavigationEnd));

    merge(this._translateService.onLangChange, onNavigationEnd)
      .pipe(untilDestroyed(this))
      .subscribe((event:any) => {
        const titles = this.getTitle(this._router.routerState, this._router.routerState.root);

        if (titles.length === 0) {
          this._titleService.setTitle(this._translateService.instant('Home'));
        } else {
          const translatedTitles = titles.map((titlePart) => this._translateService.instant(titlePart));
          const allTitlesSame = translatedTitles.every((title, _, arr) => title === arr[0]);
          this._titleService.setTitle(allTitlesSame ? translatedTitles[0] : translatedTitles.join(' | '));
        }

        if (event['lang']) {
          // Uncomment the following line to force a reload of the page when the language changes if needed for translations from backend
          // window.location.reload();
        }
      });
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      fromEvent(window, 'resize').subscribe(() => {
        if (window.innerWidth < 1400 && this.mode !== 'over') {
          this.ngZone.run(() => {
            this.mode = 'over';
            this.hideSidenav();
          });
        } else if (window.innerWidth >= 1400 && this.mode !== 'side') {
          this.ngZone.run(() => {
            this.mode = 'side';
            this.showSidenav();
          });
        }
      });
    });
  }

  hideSidenav() {
    setTimeout(() => {
      this.sidenav.hide();
    }, 0);
  }

  showSidenav() {
    setTimeout(() => {
      this.sidenav.show();
    }, 0);
  }

  getTitle(state: any, parent: any): any[] {
    const data:any = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }

    if (state && parent) {
      data.push(...this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }

  ngOnDestroy() {
    this._i18nService.destroy();
  }
}

