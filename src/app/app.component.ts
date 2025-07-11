import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { I18nService } from '@app/i18n';
import { Title } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '@env/environment';
import { filter, merge } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Logger } from '@core/services';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType } from 'keycloak-angular';
import { effect } from '@angular/core';
import { HcclContextService } from './shell/services/hccl-context.service';
import { MenuService } from './shell/services/menu.service';

@UntilDestroy()
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule],
  template: ' <div id="main-wrapper" ><router-outlet></router-outlet></div>',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angular-boilerplate';

  private keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);

  constructor(
    private readonly _router: Router,
    private readonly _titleService: Title,
    private readonly _translateService: TranslateService,
    private readonly _i18nService: I18nService,
    private readonly _hcclContextService: HcclContextService,
    private readonly _menuService: MenuService,
  ) {
    // Setup Keycloak event listener
    effect(() => {
      const keycloakEvent = this.keycloakSignal();
      if (keycloakEvent.type === KeycloakEventType.Ready) {
        console.log('Keycloak is ready - initializing HCCL context');
        this.initializeHcclContextAndRedirect();
      }
      if (keycloakEvent.type === KeycloakEventType.AuthLogout) {
        console.log('User logged out');
        this._hcclContextService.clearContext();
      }
    });
  }

  /**
   * Initialize HCCL context after Keycloak authentication and redirect to first menu item
   */
  private initializeHcclContextAndRedirect(): void {
    console.log('Starting HCCL context initialization and redirect process');
    
    this._hcclContextService.initializeContext('').subscribe({
      next: (context) => {
        console.log('HCCL context loaded successfully:', context);
        
        // Get the first menu item based on user context or default to advocate
        const dashboardType = this.getDashboardTypeFromContext(context);
        console.log('Determined dashboard type:', dashboardType);
        
        const menuItems = this._menuService.getMenuItems(dashboardType);
        console.log('Retrieved menu items for dashboard type:', dashboardType, 'count:', menuItems.length);
        
        if (menuItems.length > 0) {
          const firstMenuItem = this.findFirstNavigableMenuItem(menuItems);
          if (firstMenuItem) {
            console.log('Redirecting to first menu item:', firstMenuItem.route);
            this._router.navigate([firstMenuItem.route]);
          } else {
            console.log('No navigable menu items found, staying on current route');
          }
        } else {
          console.log('No menu items found for dashboard type:', dashboardType);
          // Fallback to default dashboard
          this._router.navigate(['/advocate-dashboard']);
        }
      },
      error: (error) => {
        console.error('Failed to initialize HCCL context:', error);
        // On error, redirect to default dashboard
        this._router.navigate(['/advocate-dashboard']);
      }
    });
  }

  /**
   * Determine dashboard type from HCCL context
   */
  private getDashboardTypeFromContext(context: any): 'advocate' | 'broker' | 'service-provider' {
    if (!context || !context.currentUserProfile) {
      console.log('No user profile in context, defaulting to advocate');
      return 'advocate';
    }

    const profileTypeCode = context.currentUserProfile.profileTypeCode;
    console.log('User profile type code:', profileTypeCode);

    // Map profile type codes to dashboard types
    switch (profileTypeCode?.toUpperCase()) {
      case 'ADVOCATE':
      case 'EDU_ADVOCATE':
        return 'advocate';
      case 'BROKER':
      case 'EDU_BROKER':
        return 'broker';
      case 'SERVICE_PROVIDER':
      case 'EDU_SERVICE_PROVIDER':
        return 'service-provider';
      default:
        console.log('Unknown profile type code, defaulting to advocate:', profileTypeCode);
        return 'advocate';
    }
  }

  /**
   * Find the first menu item that has a route (navigable)
   */
  private findFirstNavigableMenuItem(menuItems: any[]): any | null {
    console.log('Searching for first navigable menu item in:', menuItems);
    
    for (const item of menuItems) {
      console.log('Checking menu item:', item.label, 'route:', item.route);
      
      // If this item has a route, return it
      if (item.route) {
        console.log('Found navigable menu item:', item.label, 'route:', item.route);
        return item;
      }
      
      // If this item has children, search them
      if (item.children && item.children.length > 0) {
        console.log('Checking children of:', item.label);
        const childItem = this.findFirstNavigableMenuItem(item.children);
        if (childItem) {
          return childItem;
        }
      }
    }
    
    console.log('No navigable menu items found');
    return null;
  }

  async ngOnInit() {
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
