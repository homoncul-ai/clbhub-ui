import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  NgZone,
  inject
} from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { fromEvent, merge, filter, Subscription } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { I18nService } from '@app/i18n';
import { Logger } from '@core/services';
import { environment } from '@env/environment';
import { MdbSidenavComponent } from 'mdb-angular-ui-kit/sidenav';
import { MenuService, MenuItem } from './services/menu.service';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType } from 'keycloak-angular';
import { effect } from '@angular/core';
import { AppConstants } from './services/config.service';
import { HcclUserContextGETData, MenuControlData, ConsentRequestPOSTData } from '@app/restsvc/hccl.service';
import { HcclContextService } from './services/hccl-context.service';
import { ConsentGateService } from './services/consent-gate.service';
import { PageHeaderAction, PageHeaderActionService } from './services/page-header-action.service';
import { MenuControlDataListComponent } from '../components/_global/menu-control-data-list/menu-control-data-list.component';

declare const dhx: any; // DHTMLX global

@UntilDestroy()
@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  standalone: false
})
export class ShellComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sidenav', { static: true }) sidenav!: MdbSidenavComponent;
  @ViewChild('treeContainer') treeContainer!: ElementRef;

  menuItems: MenuItem[] = [];
  currentRoute: string = '';
  mode: 'side' | 'over' = window.innerWidth >= 1400 ? 'side' : 'over';
  hidden: boolean = window.innerWidth >= 1400 ? false : true;
  private tree: any;
  private resizeSubscription!: Subscription;
  private keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);
  private hcclContextService = inject(HcclContextService);
  private consentGateService = inject(ConsentGateService);
  protected readonly contextLoading = this.hcclContextService.isLoading;
  protected readonly consentModalOpen = this.consentGateService.isModalOpen;
  protected readonly consentUnsignedConsents = this.consentGateService.unsignedConsents;
  protected readonly consentSubmitting = this.consentGateService.isSubmitting;
  
  constructor(
    private _router: Router,
    private _titleService: Title,
    private _translateService: TranslateService,
    private _i18nService: I18nService,
    private _menuService: MenuService,
    private ngZone: NgZone,
    private appConstants: AppConstants,
    private activatedRoute: ActivatedRoute,
    private pageHeaderActionService: PageHeaderActionService,
  ) {
    this.pageHeaderActionService.actions$
      .pipe(untilDestroyed(this))
      .subscribe(actions => {
        this.headerActions = actions;
      });
    // Listen to Route Changes
    this._router.events
      .pipe(filter(event => event instanceof NavigationEnd), untilDestroyed(this))
      .subscribe((event: any) => {
        //if (true ||!event.url.includes('state=') && !event.url.includes('code=')) {
          this.currentRoute = event.url;
          console.log('Route changed:', this.currentRoute);
          //alert('Route changed:' + this.currentRoute);
          this.updatePageHeaderFromRoute();
          if (this.menuItems.length == 0) {
            const dashboardType = this._menuService.getDashboardTypeFromRoute(this.currentRoute);
            const newRawMenu = dashboardType ? this._menuService.getMenuItems(dashboardType) : [];
            const newMenuItems = this.convertMenuItemsToTreeFormat(newRawMenu);
            this.menuItems = newMenuItems;
            // First load: parse tree data. Later navigations only sync selection —
            // full rebuild on every NavigationEnd left stale --selected highlights.
            this.updateTree();
          } else {
            this.syncTreeSelectionToRoute();
          }
        //  }
      });
  }

  pageHeader: any = null;
  headerActions: PageHeaderAction[] = [];

private updatePageHeaderFromRoute() {
  const data:any = this.getDeepestRouteData();

  this.pageHeader = {
    title: data.pageTitle || data.title || '',
    subtitle: data.pageSubtitle || data.subtitle || '',
    icon: data.pageIcon || '',
    breadcrumbs: data.breadcrumbs || [],
    actions: data.actions || []
  };
}

  private getDeepestRouteData() {
  let route = this.activatedRoute;

  while (route.firstChild) {
    route = route.firstChild;
  }

  return route.snapshot?.data || {};
}

onHeaderAction(key: string): void {
  this.pageHeaderActionService.emitAction(key);
}


  updateTree() {
    if (this.tree) {
      //alert("Tree updated:" + this.menuItems.length);
      const openedIds = this.tree.getState().opened;

      // Clear selection before rebuild — DHTMLX keeps selected ids across parse
      // when menu item ids are stable labels, which causes multi-highlight.
      this.clearTreeSelection();

      this.tree.data.removeAll();
      this.tree.data.parse(this.menuItems);

      // Restore open state
      if (Array.isArray(openedIds)) {
        openedIds.forEach(id => this.tree.open(id));
      }

      this.syncTreeSelectionToRoute();
    }
  }

  /** Rebuild sidebar from current context without navigating away. */
  private refreshMenuInPlace(): void {
    const context = this.hcclContextService.getContext();
    if (!context) {
      return;
    }
    const dashboardType = this._menuService.getDashboardTypeFromContext(context);
    this._menuService.getMenuItemsAsyc(context, dashboardType).then((newRawMenu) => {
      this.menuItems = this.convertMenuItemsToTreeFormat(newRawMenu);
      this.updateTree();
    });
  }

  /**
   * Drive DHTMLX selection from the current router URL so only the active
   * route's menu item stays highlighted (clears stale click selections).
   */
  private syncTreeSelectionToRoute(): void {
    if (!this.tree) {
      return;
    }

    const currentUrl = (this._router.url || '').split('?')[0].split('#')[0];
    const matchedId = this.findMenuItemIdByRoute(this.menuItems, currentUrl);

    this.clearTreeSelection();

    if (matchedId && this.tree.data.exists(matchedId)) {
      this.tree.selection.add(matchedId);
    }

    // DHTMLX can leave --selected/--focused classes on siblings after
    // programmatic nav; force the DOM to match the single active route.
    setTimeout(() => this.applyExclusiveActiveDom(matchedId), 0);
  }

  private clearTreeSelection(): void {
    if (!this.tree?.selection) {
      return;
    }
    try {
      const selectedIds: string[] =
        typeof this.tree.selection.getIds === 'function'
          ? [...(this.tree.selection.getIds() || [])]
          : [];
      selectedIds.forEach((id: string) => {
        try {
          this.tree.selection.remove(id);
        } catch {
          // ignore
        }
      });
      this.tree.selection.remove();
    } catch {
      // Selection API may throw if tree data is empty
    }
  }

  private applyExclusiveActiveDom(matchedId: string | null): void {
    const root = this.treeContainer?.nativeElement as HTMLElement | undefined;
    if (!root) {
      return;
    }

    root
      .querySelectorAll(
        '.dhx_tree-list-item--selected, .dhx_tree-folder--selected, ' +
          '.dhx_tree-list-item--focused, .dhx_tree-folder--focused',
      )
      .forEach((el) => {
        el.classList.remove(
          'dhx_tree-list-item--selected',
          'dhx_tree-folder--selected',
          'dhx_tree-list-item--focused',
          'dhx_tree-folder--focused',
        );
      });

    if (!matchedId) {
      return;
    }

    const escaped =
      typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
        ? CSS.escape(matchedId)
        : matchedId.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const node = root.querySelector(
      `[data-dhx-id="${escaped}"], [dhx_id="${escaped}"]`,
    ) as HTMLElement | null;
    const row = (node?.closest('.dhx_tree-folder, .dhx_tree-list-item') ||
      node) as HTMLElement | null;
    if (!row) {
      return;
    }
    if (row.classList.contains('dhx_tree-folder')) {
      row.classList.add('dhx_tree-folder--selected');
    } else {
      row.classList.add('dhx_tree-list-item--selected');
    }
  }

  /**
   * Find the tree node id whose data.route best matches the given URL:
   * exact match first, otherwise the longest route that is a path prefix.
   */
  private findMenuItemIdByRoute(items: any[], url: string): string | null {
    let bestId: string | null = null;
    let bestLen = -1;

    const walk = (nodes: any[]) => {
      for (const item of nodes) {
        const route = item?.data?.route;
        if (typeof route === 'string' && route.length > 0) {
          // Strip query/hash so tour links still match path-only current URLs.
          const routePath = route.split('?')[0].split('#')[0];
          const isExact = url === routePath;
          // Query-param menu links (e.g. tours) match path exactly only —
          // avoid `/student-dashboard?...` prefix-matching all student routes.
          const isPrefix =
            !route.includes('?') &&
            url.startsWith(routePath.endsWith('/') ? routePath : routePath + '/');
          if ((isExact || isPrefix) && routePath.length > bestLen) {
            bestId = item.id;
            bestLen = routePath.length;
          }
        }
        if (item.items?.length) {
          walk(item.items);
        }
      }
    };

    walk(items);
    return bestId;
  }

  userDetails: any = null;
  loggedInUserInitials:any='';
  user: string = '';
  
  // User profile menu properties
  userProfileMenu: any = null;
  selectedUserProfile: MenuControlData | null = null;
  currentUserProfileId: string = '';
  hcclUserContext: HcclUserContextGETData | null = null;

  ngOnInit() {
    this.currentRoute = this._router.url;
    if (environment.production) {
      Logger.enableProductionMode();
    }
    const currentUrl = this._router.url;
    this.updatePageHeaderFromRoute();
    this._i18nService.init(environment.defaultLanguage, environment.supportedLanguages);

    this.userDetails = this.appConstants.userDetails();
    this.user = `${this.userDetails?.firstName} ${this.userDetails?.lastName}`;
    this.loggedInUserInitials = this.user.match(/\b(\w)/g)?.join('');

    // Keep the profile dropdown in sync whenever context refreshes (e.g. after name edit).
    // Also run the consent gate whenever an HCCLUserProfile becomes active.
    this.hcclContextService.context$
      .pipe(untilDestroyed(this))
      .subscribe(context => {
        if (context?.userProfileMenu) {
          this.currentUserProfileId = context.currentUserProfileId || '';
          // New object reference so the dropdown reliably rerenders options + selection.
          this.userProfileMenu = {
            ...context.userProfileMenu,
            menuItems: [...(context.userProfileMenu.menuItems || [])],
          };
        } else if (!context) {
          this.currentUserProfileId = '';
          this.userProfileMenu = null;
        }

        this.consentGateService.onProfileActivated(context);
      });

    // Subscribe to HCCL context changes to update user profile menu
    if (this.hcclContextService.isInitialized() == false) {
        this.hcclContextService.initializeContext();
        this.hcclContextService.waitForReady().then(() => { 
          const context = this.hcclContextService.getContext();
           // alert('shell.component.ts: User profile menu updated: ' +  context?.currentUserProfileId + ' ' + currentUrl);
           
          this.userProfileMenu = context.userProfileMenu;
          this.currentUserProfileId = context.currentUserProfileId || '';
          this.setupForUserProfileContext(context, currentUrl);
         
        });
    } else {
      const context = this.hcclContextService.getContext();
      this.userProfileMenu = context.userProfileMenu;
      this.currentUserProfileId = context.currentUserProfileId || '';
      this.setupForUserProfileContext(context, currentUrl);
    }

    this._menuService.menuRefreshRequested$
      .pipe(untilDestroyed(this))
      .subscribe(() => this.refreshMenuInPlace());

    const onNavigationEnd = this._router.events.pipe(filter(event => event instanceof NavigationEnd));
    merge(this._translateService.onLangChange, onNavigationEnd)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        const titles = this.getTitle(this._router.routerState, this._router.routerState.root);
        const translated = titles.map(t => this._translateService.instant(t));
        const title = translated.every(t => t === translated[0]) ? translated[0] : translated.join(' | ');
        this._titleService.setTitle(title);
      });
  }

  ngAfterViewInit() {
    this.tree = new dhx.Tree(this.treeContainer.nativeElement, {
      css: "dhx_widget--bordered",
      autoWidth: true,
      multiselection: false,
    });
    this.tree.data.parse(this.menuItems);
    this.syncTreeSelectionToRoute();

    this.tree.events.on("itemClick", (id: string) => {
      const menuItem = this.findMenuItemById(this.menuItems, id);
      if (menuItem?.data?.route) {
        // NavigationEnd → updateTree() → syncTreeSelectionToRoute() is the
        // single source of truth for selection; do not select here.
        // Use navigateByUrl so menu routes may include query params (e.g. tours).
        this._router.navigateByUrl(menuItem.data.route);
      } else {
        // Folder / non-route click still updates DHTMLX selection; restore route match.
        setTimeout(() => this.syncTreeSelectionToRoute(), 0);
      }
    });

    this.ngZone.runOutsideAngular(() => {
      this.resizeSubscription = fromEvent(window, 'resize').subscribe(() => {
        this.ngZone.run(() => {
          const width = window.innerWidth;
          if (width < 1400 && this.mode !== 'over') {
            this.mode = 'over';
            this.hideSidenav();
          } else if (width >= 1400 && this.mode !== 'side') {
            this.mode = 'side';
            this.showSidenav();
          }
        });
      });
    });
  }

  ngOnDestroy() {
    this._i18nService.destroy();
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  private convertMenuItemsToTreeFormat(menuItems: any[]): any[] {
    return menuItems.map(item => ({
      id: item.id || item.label,
      value: item.label,
      opened: item.open === true, // Only open if explicitly set to true
      icon: {
        folder: item.icon || "fas fa-folder",
        openFolder: item.icon || "fas fa-folder-open",
        file: item.icon || "fas fa-file"
      },
      data: {
        route: item.route,
        componentPath: item.componentPath,
        componentName: item.componentName
      },
      items: item.children ? this.convertMenuItemsToTreeFormat(item.children) : []
    }));
  }

  private findMenuItemById(items: any[], id: string): any {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.items) {
        const found = this.findMenuItemById(item.items, id);
        if (found) return found;
      }
    }
    return undefined;
  }

  hideSidenav() {
    setTimeout(() => this.sidenav.hide(), 0);
  }

  showSidenav() {
    setTimeout(() => this.sidenav.show(), 0);
  }

  getTitle(state: any, parent: any): string[] {
    const titles: string[] = [];
    if (parent?.snapshot?.data?.title) {
      titles.push(parent.snapshot.data.title);
    }
    if (state && parent) {
      titles.push(...this.getTitle(state, state.firstChild(parent)));
    }
    return titles;
  }

  onConsentModalAccept(selected: ConsentRequestPOSTData[]): void {
    this.consentGateService.submitAcceptedConsents(selected).subscribe({
      next: (ok) => {
        if (!ok) {
          console.error('Consent acceptance failed for one or more contracts');
        }
      },
      error: (err) => {
        console.error('Consent acceptance failed', err);
      },
    });
  }

  /** TEMP: remove when real consent accept flow is fully trusted. */
  onConsentModalTempDismiss(): void {
    this.consentGateService.markConsentsAccepted();
  }

  async logout() {
    const localStorgeAttributes = [];
    for (let index = 0; index < localStorgeAttributes.length; index++) {
      const element = localStorgeAttributes[index];
      if (element) localStorage.removeItem(element);
    }

    // Clear userProfileId cookie on logout
    this.hcclContextService.clearUserProfileIdCookie();
    this.consentGateService.reset();
   
    this.appConstants.logout();
  }

  public getTicketContext(): HcclUserContextGETData | null {
    return this.hcclContextService.getContext();
  }

  /**
   * Handle user profile menu selection
   */
  onUserProfileChange(selectedProfile: MenuControlData | null): void {
    this.selectedUserProfile = selectedProfile;
    console.log('User profile changed to:', selectedProfile);
    
    if (selectedProfile) {
      this.updateUserProfile(selectedProfile.id || '');
    }
  }

  public setupForUserProfileContext(context: HcclUserContextGETData, currentUrl_in: string): void {
        
    // Check if we're already on a valid route
    const currentUrl = currentUrl_in || this._router.url;
    //alert('shell.component.ts: setupForUserProfileContext Current URL1: ' + currentUrl);
    // Now, load the menu items for the new profile
    const dashboardType = this._menuService.getDashboardTypeFromContext(context);
    //const newRawMenu = dashboardType ? this._menuService.getMenuItems(dashboardType) : [];
     this._menuService.getMenuItemsAsyc(context, dashboardType).then(newRawMenu => {
      var routePath : string[] = [currentUrl];
      do {
        const newMenuItems = this.convertMenuItemsToTreeFormat(newRawMenu);
        this.menuItems = newMenuItems;
        this.updateTree();
        //alert('shell.component.ts: setupForUserProfileContext Current URL: ' + currentUrl);

        const firstMenuItem : MenuItem | null = this._menuService.findFirstNavigableMenuItem(newRawMenu);
          
        var defaultRoute = "/" + this._menuService.getRouteFromDashboardType(dashboardType);
        // Get the first menu item, then compare it to the current URL, 
        // if they are the same, then stay on the current route, otherwise, navigate to the first menu item
         //var defaultRoute = currentUrl; //"/ecoadmin-dashboard/providertyperefs"
        if ( !currentUrl.startsWith(defaultRoute)) {
          console.log('Navigating to first menu item after profile change:', defaultRoute);
          //alert("Profile Chanage :" + firstMenuItem?.route + " Yyyyyyyyyyy  " + currentUrl);
          routePath = [firstMenuItem?.route || ''];
           // this._router.navigate([firstMenuItem.route]);
          continue;
        } else {
          console.log('No navigable menu items found after profile change, staying on current route');
        }

        
        // Check if the current URL is empty, root, or contains auth-related parameters
        const shouldRedirect = !currentUrl || 
                              currentUrl === '/' || 
                              currentUrl === '/login'
                              //  || 
                              // currentUrl.includes('state=') || 
                              // currentUrl.includes('code=') ||
                              // currentUrl === '/advocate-dashboard' ||
                              // currentUrl === '/broker-dashboard' ||
                              // currentUrl === '/service-provider-dashboard' ||
                              // currentUrl === '/ecoadmin-dashboard' ||
                              // currentUrl === '/student-dashboard'
                              ;
        
        if (shouldRedirect) {
          console.log('Current URL requires redirect after profile change, getting first menu item');
          // Get the first navigable menu item using the menu service
          //const firstMenuItem = this._menuService.getFirstNavigableMenuItem(context, this._router);
          
          if (firstMenuItem) {
            console.log('Navigating to first menu item after profile change:', firstMenuItem.route);
            //alert("ShouldRedirect:" + firstMenuItem.route + " Yyyyyyyyyyy  " + defaultRoute);
            // this._router.navigate([firstMenuItem.route]);
            routePath = [firstMenuItem.route];
            //this.updateTree();
          continue;
          } 
        }
        
        console.log('Current URL is valid after profile change, staying on route:', currentUrl);
        //alert('Current URL is valid after profile change, staying on route:' +currentUrl);
          // Stay on the current route - no navigation needed
          //this._router.navigate([currentUrl]);
          routePath = [currentUrl];
          //this.updateTree();
      } while (false);

      //alert("Navigating to " + routePath + " \n" + currentUrl);
      //debugger;
      this._router.navigate(routePath);
  });
  }

  updateUserProfile(userProfileId: string): void {
        // Here you can add logic to handle the profile change
      // For example, refresh the context with the new profile ID

      if (this.hcclUserContext) {
        
        return;
      }
      this.hcclContextService.initializeContext(userProfileId).subscribe({
        next: (context) => {
          this.setupForUserProfileContext(context, this._router.url);
        },
        error: (error) => {
          console.error('Failed to refresh context with new profile:', error);
        }
      });
    
  }
}
