import { Component, inject, Input } from '@angular/core';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { SimpleTab } from '../simple-tabset/simple-tabset.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { HcclUserContextGETData } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-abstract-entity-group',
  imports: [],
  templateUrl: './abstract-entity-group.component.html',
  styleUrl: './abstract-entity-group.component.scss'
})
export abstract class AbstractEntityGroupComponent< T extends EntityWrapper<any>> {
  @Input() id!: string;
  @Input() tabId!: string;
  @Input() showingTabset: boolean = true;
  protected route = inject(ActivatedRoute);
  protected router = inject(Router);


  protected entity: T | null = null;
  protected loading: boolean = false;
  protected error: string = '';
  protected success: boolean = false;
  
  
  protected hcclService = inject(HcclService);
  protected hcclContextService = inject(HcclContextService);
  protected hcclContext: HcclUserContextGETData | null = null;

  protected abstract loadEntityById(id: string): Promise<T>;
  protected tabs: SimpleTab[] = [];
  protected abstract setupTabs(): SimpleTab[];
  protected currentTabId: string = '';


  ngOnInit(): void {

    this.route.params.subscribe(params => {
      const id = params['id'];
      const urlSegments = this.router.url.split('/').filter(segment => segment.length > 0);
      var defaultTabId = 'details';
      if (urlSegments.length > 0) {
        defaultTabId = urlSegments[urlSegments.length - 1];
      }
      const tabId = params['tabId'] || defaultTabId;
      debugger
      if (!id || tabId === 'create') {
  
        this.currentTabId = tabId;
        this.showingTabset = false;
        this.entity = this.newCrudWrapperForCreate();
      } else {
      if (id) {
        this.id = id;
        this.tabs = this.setupTabs();
        this.currentTabId = tabId;
        this.loadEntityById(id).then(entity => {
          this.entity = entity;
        }).catch(error => {
          console.error('Error loading :', error);
        });
      }
      }
    });
  }

  protected abstract newCrudWrapperForCreate(): T;

  public addTab(tab: SimpleTab): void {
    this.tabs.push(tab);
  }

  public removeTab(tab: SimpleTab): void {
    this.tabs = this.tabs.filter(t => t.id !== tab.id);
  }

  public getTab(id: string): SimpleTab | undefined {
    return this.tabs.find(t => t.id === id);
  }

  public newTab(id: string, label: string, url: string, activateFunction: () => void, showingTabFunction: () => void): SimpleTab {
    var t : SimpleTab = new SimpleTab(id, label, url, activateFunction, showingTabFunction);
    //this.tabs.push(t);
    return t;
  }
  protected setupListDetailsTabs(): SimpleTab[] {
    const baseRoute = this.getBaseRoute();
    return [
      new SimpleTab('list', 'List', '', 
        () => {
          this.router.navigate([baseRoute]);
        },
        () => {
          return true;
        }
      ),
      new SimpleTab('details', 'Details', '', 
        () => {
          this.currentTabId = 'details';
          this.router.navigate([baseRoute, this.id, 'details']);
        },
        () => {
          return this.entity !== null;
        }
      )];
    //   ,
    //   new SimpleTab('debug', 'Debug', '', 
    //     () => {
    //       this.currentTabId = 'debug';
    //       this.router.navigate([baseRoute, this.id, 'debug']);
    //     },
    //     () => {
    //       return true;
    //     }
    //   ),
    //   new SimpleTab('fk_menu', 'FK_MENU', '', 
    //     () => {
    //       this.currentTabId = 'fk_menu';
    //       this.router.navigate([baseRoute, this.id, 'fk_menu']);
    //     },
    //     () => {
    //       return true;
    //     }
    //   )
    // ];
  }
/**
   * Calculate the base route for the current entity type
   * @returns The base route path for navigation
   */
protected getBaseRoute(): string {
  // Get the current URL segments
  const urlSegments = this.router.url.split('/').filter(segment => segment.length > 0);
  
  // Find the dashboard type (advocate-dashboard, broker-dashboard, etc.)
  const dashboardIndex = urlSegments.findIndex(segment => segment.includes('-dashboard'));
  if (dashboardIndex === -1) {
    // Fallback to ecoadmin-dashboard if no dashboard found
    return '/ecoadmin-dashboard';
  }
  
  const dashboardType = urlSegments[dashboardIndex];
  
  // Find the entity route (the segment after the dashboard)
  const entityRouteIndex = dashboardIndex + 1;
  if (entityRouteIndex >= urlSegments.length) {
    // If no entity route found, return dashboard
    return `/${dashboardType}`;
  }
  
  // Get the entity route (e.g., 'providertyperefs', 'clstudents', etc.)
  const entityRoute = urlSegments[entityRouteIndex];
  
  // Remove any trailing segments like 'create', 'details', etc. to get the base route
  // This handles cases where we're on a route like /dashboard/entity/create
  const baseRoute = `/${dashboardType}/${entityRoute}`;
  
  return baseRoute;
}


  activateTab(tabId: string) {
    this.currentTabId = tabId;
  }
}
