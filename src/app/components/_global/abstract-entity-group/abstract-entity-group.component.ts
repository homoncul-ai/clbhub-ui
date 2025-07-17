import { Component, inject } from '@angular/core';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { SimpleTab } from '../simple-tabset/simple-tabset.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { Router } from '@angular/router';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { HcclUserContextGETData } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-abstract-entity-group',
  imports: [],
  templateUrl: './abstract-entity-group.component.html',
  styleUrl: './abstract-entity-group.component.scss'
})
export abstract class AbstractEntityGroupComponent< T extends EntityWrapper<any>> {

  protected entity: T | null = null;
  protected loading: boolean = false;
  protected error: string = '';
  protected success: boolean = false;
  protected showingTabset: boolean = true;
  
  
  protected hcclService = inject(HcclService);
  protected router = inject(Router);
  protected hcclContextService = inject(HcclContextService);
  protected hcclContext: HcclUserContextGETData | null = null;

  protected abstract loadEntityById(id: string): Promise<T>;
  protected tabs: SimpleTab[] = [];
  protected abstract setupTabs(): SimpleTab[];
  protected currentTabId: string = '';

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

  activateTab(tabId: string) {
    this.currentTabId = tabId;
  }

}
