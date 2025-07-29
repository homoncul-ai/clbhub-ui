import { Component, inject, Input } from '@angular/core';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { SimpleTab } from '../simple-tabset/simple-tabset.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { HcclUserContextGETData } from '@app/restsvc/hccl.service';
import { AbstractListComponent } from '../abstract-list';
import { OnRowClickBehavior } from '../abstract-list/abstract-list.component';

@Component({
  selector: 'app-abstract-entity-group',
  imports: [],
  templateUrl: './abstract-entity-group.component.html',
  styleUrl: './abstract-entity-group.component.scss'
})
export abstract class AbstractEntityGroupComponent< T extends EntityWrapper<any>> {
  @Input() id!: string;
  @Input() childId?: string;
  @Input() tabId!: string;
  @Input() showingTabset: boolean = true;

  @Input() onRowClickBehavior: OnRowClickBehavior = new OnRowClickBehavior();

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
    var id = this.hcclContextService?.getCurrentUserProfileId() || '';
    this.route.params.subscribe(params => {
      this. id = params['id'];
      let tabId = params['tabId'];
      this. childId = params['childId'];
      this.tabs = this.setupTabs();

    //debugger
      if (this.id === undefined || this.id === '') {
        this.id = this.getDefaultId();
      }

      const urlSegments = this.router.url.split('/').filter(segment => segment.length > 0);
      var defaultTabId = this.getDefaultTabId();
      if (urlSegments.length > 0) {
        let tabIdT = urlSegments[urlSegments.length - 1];
        if (tabIdT.includes('#')) {
          tabIdT = tabIdT.split('#')[0];
        }
        if (this.tabs.find(tab => tab.id === tabIdT)) {
          tabId = tabIdT;
        }
      }

      // Check to see if the tabId is a valid tab
      if (!this.tabs.find(tab => tab.id === tabId)) {
        tabId = defaultTabId;
      }

      // debugger
      const finalTabId = tabId || defaultTabId;
      
      // Set the extracted parameters
       
     
      if (finalTabId) {
        this.tabId = finalTabId;
      }

      //alert("AbstractEntityGroupComponent.ngOnInit id, tabid, childId = "  + this.id + " " + finalTabId + " " +this.childId + " " +  " " );
     
      var id = this.id;
     // debugger
      if (!id || finalTabId === 'create') {
        this.currentTabId = finalTabId;
        this.showingTabset = true;
        this.entity = this.newCrudWrapperForCreate();
      } else {
      if (id) {
        this.loadEntityById(id).then(entity => {
          this.entity = entity;
          this.tabs = this.setupTabs();
          this.currentTabId = finalTabId;
  
        }).catch(error => {
          console.error('Error loading :', error);
        });
      }
      }
    });
  }
  protected getDefaultId(): string {
    alert('getDefaultId ' + this.id + ' id is not defined ');
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
      new SimpleTab('details', this.getDetailsTabLabel(), '', 
        () => {
          //this.currentTabId = 'details';
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
  return AbstractListComponent.extractBaseRoute(this.router.url);
}

protected findTabById(tabs: SimpleTab[], tabId: string): SimpleTab | undefined {
  return tabs.find(tab => tab.id === tabId);
}

public getDetailsTabLabel(): string {
  return "Details";
}

}