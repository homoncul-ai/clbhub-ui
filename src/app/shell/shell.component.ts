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
import { Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { fromEvent, merge, filter, Subscription } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { I18nService } from '@app/i18n';
import { Logger } from '@core/services';
import { environment } from '@env/environment';
import { MdbSidenavComponent } from 'mdb-angular-ui-kit/sidenav';
import { MenuService, MenuItem } from './services/menu.service';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType, KeycloakService } from 'keycloak-angular';
import { effect } from '@angular/core';
import Keycloak from 'keycloak-js';

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
  private readonly keycloak = inject(Keycloak);
  constructor(
    private _router: Router,
    private _titleService: Title,
    private _translateService: TranslateService,
    private _i18nService: I18nService,
    private _menuService: MenuService,
    private ngZone: NgZone,
  ) {
    // Keycloak Event
    effect(() => {
      const keycloakEvent = this.keycloakSignal();
      if (keycloakEvent.type === KeycloakEventType.Ready) {
        this._router.navigate(['/advocate-dashboard/messages']);
      }
    });

    // Listen to Route Changes
    this._router.events
      .pipe(filter(event => event instanceof NavigationEnd), untilDestroyed(this))
      .subscribe((event: any) => {
        if (!event.url.includes('state=') && !event.url.includes('code=')) {
          this.currentRoute = event.url;
          console.log('Route changed:', this.currentRoute);

          const dashboardType = this._menuService.getDashboardTypeFromRoute(this.currentRoute);
          const newRawMenu = dashboardType ? this._menuService.getMenuItems(dashboardType) : [];
          const newMenuItems = this.convertMenuItemsToTreeFormat(newRawMenu);

          this.menuItems = newMenuItems;

          if (this.tree) {
            const openedIds = this.tree.getState().opened;

            this.tree.data.removeAll();
            this.tree.data.parse(this.menuItems);

            // Restore open state
            if (Array.isArray(openedIds)) {
              openedIds.forEach(id => this.tree.open(id));
            }
          }
        }
      });
  }

  ngOnInit() {
    this.currentRoute = this._router.url;

    const dashboardType = this._menuService.getDashboardTypeFromRoute(this.currentRoute);
    const rawMenu = dashboardType ? this._menuService.getMenuItems(dashboardType) : [];
    this.menuItems = this.convertMenuItemsToTreeFormat(rawMenu);

    if (environment.production) {
      Logger.enableProductionMode();
    }

    this._i18nService.init(environment.defaultLanguage, environment.supportedLanguages);

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
      autoWidth: true
    });

    this.tree.data.parse(this.menuItems);

    this.tree.events.on("itemClick", (id: string) => {
      const menuItem = this.findMenuItemById(this.menuItems, id);
      if (menuItem?.data?.route) {
        this._router.navigate([menuItem.data.route]);
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
      id: item.label,
      value: item.label,
      opened: true,
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

  async logout() {
    const localStorgeAttributes = [];
    for (let index = 0; index < localStorgeAttributes.length; index++) {
      const element = localStorgeAttributes[index];
      if (element) localStorage.removeItem(element);
    }

   
    this.keycloak.logout();
  }
}
