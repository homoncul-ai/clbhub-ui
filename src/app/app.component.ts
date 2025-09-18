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
import { routes } from './app.routes';

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
      if (true || keycloakEvent.type === KeycloakEventType.Ready ) {
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
   * Initialize HCCL context after Keycloak authentication and redirect to the route (if the path is empty) or the first menu item
   */
  private initializeHcclContextAndRedirect(): void {
    console.log('Starting HCCL context initialization and redirect process ');
   // alert('app.component.ts: Whoax:' + this._router.url + " " + this._hcclContextService.isInitialized());
    if (this._router.url === '/') {
      this._hcclContextService.initializeContext('').subscribe({
        next: (context) => {
          do {
          console.log('app.component.ts: HCCL context loaded successfully:', context);
          // Check if we're already on a valid route
     
            const dashboardType = this._menuService.getDashboardTypeFromContext(context);
            var dashUrl = this._menuService.getRouteFromDashboardType(dashboardType);     
            this._router.navigate(["/" + dashUrl]);    
      
           // alert('app.component.ts: Redirecting to dashboard:' + dashUrl);
       
        } while (false);
        },
      error: (error) => {
        console.error('Failed to initialize HCCL context:', error);
        // On error, redirect to default dashboard
        this._router.navigate(['/advocate-dashboard']);
      }
    }
    );
    }
  }
 
  
  private initializeHcclContextAndRedirectOrig(): void {
 
  if (this._router.url === '/') 
    this._hcclContextService.initializeContext('').subscribe({
      next: (context) => {
        do {
        console.log('app.component.ts: HCCL context loaded successfully:', context);
        // Check if we're already on a valid route
        let currentUrl = this._router.url;
        if (!currentUrl || currentUrl === '/' || 
          currentUrl === '/login') {
          const dashboardType = this._menuService.getDashboardTypeFromContext(context);
          var dashUrl = this._menuService.getRouteFromDashboardType(dashboardType);     
          this._router.navigate([dashUrl]);    
          continue;
        }
         
        console.log('Current URL :', currentUrl);
        // Check if the current URL is empty, root, or contains auth-related parameters
        const shouldRedirect = !currentUrl || 
                              currentUrl === '/' || 
                              currentUrl === '/login' || 
                              currentUrl === '/advocate-dashboard' ||
                              currentUrl === '/broker-dashboard' ||
                              currentUrl === '/service-provider-dashboard' ||
                              currentUrl === '/ecoadmin-dashboard' || 
                              currentUrl === '/student-dashboard';
        if (shouldRedirect) {
          console.log('Current URL requires redirect, getting first menu item');
          // Get the first navigable menu item using the menu service
           const firstMenuItem =  this._menuService.getFirstNavigableMenuItem(context, this._router)
            .then(firstMenuItem => {
          if (firstMenuItem) {
            console.log('Redirecting to first menu item:', firstMenuItem.route);
            this._router.navigate([firstMenuItem.route]);
            } else {
              console.log('No navigable menu items found, redirecting to default dashboard');
              // Fallback to default dashboard
              this._router.navigate(['/advocate-dashboard']);
            }
          });
        } else {
          console.log('Current URL is valid, staying on route:', currentUrl);
          //this._router.navigate([currentUrl]);
          //alert('app.component.ts: Current URL is valid, staying on route:' + currentUrl);
          //debugger

        }
        } while (false);
      },
      error: (error) => {
        console.error('Failed to initialize HCCL context:', error);
        // On error, redirect to default dashboard
        this._router.navigate(['/advocate-dashboard']);
      }
    });
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
