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
  @Input() showingTabset!: boolean;
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
      const tabId = params['tabId'] || 'details';
      if (!id) {
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
          console.error('Error loading ProviderTypeRef:', error);
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
    return [
      new SimpleTab('list', 'List', '', 
        () => {
          this.router.navigate(['/ecoadmin-dashboard/providertyperefs']);
        },
        () => {
          return true;
        }
      ),
      new SimpleTab('details', 'Details', '', 
        () => {
          this.currentTabId = 'details';
          this.router.navigate(['/ecoadmin-dashboard/providertyperefs', this.id, 'details']);
        },
        () => {
          return this.entity !== null;
        }
      ),
      new SimpleTab('debug', 'Debug', '', 
        () => {
          this.currentTabId = 'debug';
          this.router.navigate(['/ecoadmin-dashboard/providertyperefs', this.id, 'debug']);
        },
        () => {
          return true;
        }
      ),
      new SimpleTab('fk_menu', 'FK_MENU', '', 
        () => {
          this.currentTabId = 'fk_menu';
          this.router.navigate(['/ecoadmin-dashboard/providertyperefs', this.id, 'fk_menu']);
        },
        () => {
          return true;
        }
      )
    ];
  }



  activateTab(tabId: string) {
    this.currentTabId = tabId;
  }
}
