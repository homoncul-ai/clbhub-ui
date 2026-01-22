import { Component, inject, Input, ChangeDetectorRef } from '@angular/core';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { SimpleTab } from '../simple-tabset/simple-tabset.component';
import { HcclService, HcclUserProfileGETData } from '@app/restsvc/hccl.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { HcclUserContextGETData } from '@app/restsvc/hccl.service';
import { AbstractListComponent } from '../abstract-list';
import { OnRowClickBehavior } from '../abstract-list/abstract-list.component';
import { CRUD_MODES } from '@app/@core/constants/app-settings';
@Component({
  selector: 'app-abstract-entity-group',
  imports: [],
  templateUrl: './abstract-entity-group.component.html',
  styleUrl: './abstract-entity-group.component.scss'
})
export abstract class AbstractEntityGroupComponent< T extends EntityWrapper<any>> {
  protected CRUD_MODES = CRUD_MODES;
  @Input() id!: string;
  @Input() childId?: string;
  @Input() tabId!: string;
  @Input() childTabId?: string;
  @Input() showingTabset: boolean = true;
  @Input() showingDebug: boolean = false;
  @Input() readonly: boolean = false;
  @Input() onRowClickBehavior: OnRowClickBehavior = new OnRowClickBehavior();

  protected route = inject(ActivatedRoute);
  protected router = inject(Router);
  protected cdr = inject(ChangeDetectorRef);

  protected entity: T | null = null;
  protected loading: boolean = false;
  protected error: string = '';
  protected success: boolean = false;
  
  
  protected hcclService = inject(HcclService);
  protected hcclContextService = inject(HcclContextService);
  protected hcclContext: HcclUserContextGETData | null = null;
  protected currentUserProfileId: string =   '';

  protected abstract loadEntityById(id: string): Promise<T>;
  protected tabs: SimpleTab[] = [];
  protected abstract setupTabs(): SimpleTab[];
  protected currentTabId: string = '';

  public getCurrentEntity(): T {
    return this.entity || this.newCrudWrapperForCreate();
  }
  protected isReadOnly(): boolean {
    return this.readonly;
  }

  protected getUserProfile(): HcclUserProfileGETData {
    return this.hcclContextService.getCurrentUserProfile() as HcclUserProfileGETData;
  }

  protected getUserProfileId(): string {
    return this.hcclContextService.getCurrentUserProfileId();
  }
  protected getUserProfileTypeCode(): string {
    return this.getUserProfile()?.profileTypeCode ||   '';
  } 

  protected populateFromParams(params: any): void {
	
	if (this.childId == '') this.childId = undefined;
  if (this.id == undefined || this.id == '') this.id = params['id']? params['id'] : this.id;
  if (this.childId == undefined || this.childId == '') this.childId = params['childId']? params['childId'] : this.childId;
  if (this.tabId == undefined || this.tabId == '') this.tabId = params['tabId']? params['tabId'] : this.tabId  || 'details';
  if (this.childTabId == undefined || this.childTabId == '') this.childTabId = params['childTabId']? params['childTabId'] : this.childTabId  || 'details';
  }
  ngOnInit(): void {
    this.currentUserProfileId = this.hcclContextService?.getCurrentUserProfileId() || '';
    this.route.params.subscribe(params => {
      this.populateFromParams(params)
      if (this.id === undefined || this.id === '') {
        this.id = this.getDefaultId();
      }

      this.calculateTabIds();
      
    });
  }

  protected calculateTabIdFromUrl(tabId_in: string): string {
    let tabId = tabId_in;
    const urlSegments = this.router.url.split('/').filter(segment => segment.length > 0);
    if (urlSegments.length > 0) {
      let tabIdT = urlSegments[urlSegments.length - 1];
      if (tabIdT.includes('#')) {
        tabIdT = tabIdT.split('#')[0];
      }
      tabId = tabIdT;
    }
    return tabId;
  }

  protected calculateTabIds(): void {
    let tabId = this.calculateTabIdFromUrl(this.tabId);
 
      var id = this.id;
     if (tabId === 'create') {
      this.currentTabId = 'create';
      this.showingTabset = true;
      this.entity = this.newCrudWrapperForCreate();
     } else if (!id ) {
        this.setupIfNoId();
     } else {
        this.currentTabId = tabId;
		this.loading = true;
        this.loadEntityById(id).then(entity => {
          this.entity = entity;
          this.tabs = this.setupTabs();
          const defaultTabId = this.getDefaultTabId();
              // Check to see if the tabId is a valid tab
          if (!this.tabs.find(tab => tab.id === tabId)) {
            tabId = defaultTabId;
          }

          //debugger
          const finalTabId = tabId || defaultTabId;
          this.currentTabId = finalTabId;
		  this.loading=false;
            
        }).catch(error => {
          console.error('Error loading :', error);
        });
      }
    }
  
  protected setupIfNoId(): void {
    this.currentTabId = 'create';
    this.showingTabset = true;
    this.entity = this.newCrudWrapperForCreate();   
  }

  protected getDefaultId(): string {
    //alert('getDefaultId ' + this.id + ' id is not defined ');
    return '';
  }
  protected getDefaultTabId(): string {
    return 'details';
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

  public newTab(id: string, label: string, url: string, activateFunction: () => void, showingTabFunction: () => boolean): SimpleTab {
    var t : SimpleTab = new SimpleTab(id, label, url, activateFunction, showingTabFunction);
    //this.tabs.push(t);
    return t;
  }
  public newTabX(id: string, label: string, activateFunction: () => void): SimpleTab {
    var t : SimpleTab = new SimpleTab(id, label, '', activateFunction, () => {return true});
    return t;
  }
  protected setupListDetailsTabs(): SimpleTab[] {
    const baseRoute = this.getBaseRoute();
    var tabs: SimpleTab[] = [];
    var tab = new SimpleTab('list', 'List', '', 
        () => {
          this.router.navigate([baseRoute]);
        },
        () => {
          return true;
        }
      );
      tabs.push(tab);
      tab = new SimpleTab('details', this.getDetailsTabLabel(), '', 
        () => {
          //this.currentTabId = 'details';
          this.router.navigate([baseRoute, this.id, 'details']);
        },
        () => {
          return this.entity !== null;
        }
      );
      tabs.push(tab);
     
      tab = new SimpleTab('debug', 'Debug', '', 
        () => {
          this.currentTabId = 'debug';
          this.router.navigate([baseRoute, this.id, 'debug']);
        },
        () => {
          return true;
        }
      );
     // tabs.push(tab);
      tab = new SimpleTab('fk_menu', 'FK_MENU', '', 
        () => {
          this.currentTabId = 'fk_menu';
          this.router.navigate([baseRoute, this.id, 'fk_menu']);
        },
        () => {
          return true;
        }
      )
    //  tabs.push(tab);
      return tabs;
  }
/**
   * Calculate the base route for the current entity type
   * @returns The base route path for navigation
   */
protected getBaseRoute(): string {
  return AbstractListComponent.extractBaseRoute(this.router.url);
}
protected getIdBaseRoute(id: string): string {
  var x = AbstractListComponent.extractIdBaseRoute(this.router.url, id);
  return x
}
public routeToPath(routePath: string[]) {
  return AbstractListComponent.routeToPath(this.router, routePath);
}

protected findTabById(tabs: SimpleTab[], tabId: string): SimpleTab | undefined {
  return tabs.find(tab => tab.id === tabId);
}

public getDetailsTabLabel(): string {
  return "Details";
}

  protected isShowingDebug(): boolean {
    return this.showingDebug;
  }
/**
   * Handle state change complete event from std-mdb-entitystate component
   * This triggers a refresh of the parent component data
   */
onStateChangeComplete(): void {
  // Trigger ngOnInit to refresh the component data
  //alert('onStateChangeComplete');
  this.ngOnInit();
}

/**
 * Complete refresh method that resets all component state and reloads data
 * This is the Angular way to refresh a component with all new data
 */
componentRequiresRefresh(): void {
  this.refreshComponent();
}

/**
 * Refresh the component by resetting state and reloading data
 */
protected refreshComponent(): void {
  // Reset all component state
  this.resetComponentState();
  
  // Reload the entity data
  this.reloadEntityData();
  
  // Trigger change detection to update the UI
  this.cdr.detectChanges();
}

/**
 * Reset all component state to initial values
 */
protected resetComponentState(): void {
  this.entity = null;
  this.loading = false;
  this.error = '';
  this.success = false;
  this.tabs = [];
  this.currentTabId = '';
}

/**
 * Reload entity data based on current route parameters
 */
protected reloadEntityData(): void {
  if (this.id) {
	this.loading = true;
    this.loadEntityById(this.id).then(entity => {
      this.entity = entity;
      this.tabs = this.setupTabs();
      this.currentTabId = this.calculateTabIdFromUrl(this.tabId);
	  this.loading = false;
    }).catch(error => {
      console.error('Error reloading entity:', error);
      this.error = 'Failed to reload data';
    });
  } else {
    this.setupIfNoId();
  }
}
protected closeModal(): void {
 this.refreshComponent();
}
}