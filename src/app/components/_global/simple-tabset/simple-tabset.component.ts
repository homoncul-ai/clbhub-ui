import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-simple-tabset',
  imports: [CommonModule],
  templateUrl: './simple-tabset.component.html',
  styleUrl: './simple-tabset.component.scss'
})
export class SimpleTabsetComponent {

  @Input() tabs: SimpleTab[] = [];
  @Input() currentTabId: string | null = null;
  @Output() tabSelected = new EventEmitter<string>();

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

  get currentTab(): SimpleTab | undefined {
    return this.currentTabId ? this.getTab(this.currentTabId) : undefined;
  }

  public selectTab(id: string): void {
    this.tabSelected.emit(id);
    this.getTab(id)?.activate();
  }

  public isActivated(id: string): boolean {
    return this.currentTabId === id;
  }
}

export class SimpleTab {
  id: string;
  label: string;
  url: string; // for going there directly
  data: any;
  activateFunction: () => void;
  showingTabFunction: () => void;

  constructor(id: string, label: string, url: string, activateFunction: () => void, showingTabFunction: () => void) {
    this.id = id;
    this.label = label;
    this.url = url;
    this.activateFunction = activateFunction;
    this.showingTabFunction = showingTabFunction;
  }

  public activate(): void {
    this.activateFunction();
  }

  public deactivate(): void {
    this.activateFunction = () => {
      console.log('activateFunction not set' + this.id);
    };
  }
}