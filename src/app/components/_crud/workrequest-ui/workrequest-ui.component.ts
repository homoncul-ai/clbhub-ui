import { Component, Input, AfterViewInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HcclService } from '../../../restsvc/hccl.service';
import {
  WorkRequestGETData,
  WorkRequestItemGETData,
  WorkRequestItemCriteria,
  WorkRequestLogGETData,
  WorkRequestLogCriteria,
  WorkRequestDeliverableGETData,
  WorkRequestDeliverableCriteria
} from '../../../restsvc/hccl.service';
import { SimpleTabsetComponent, SimpleTab } from '../../_global/simple-tabset/simple-tabset.component';
import { Subject, takeUntil } from 'rxjs';
import { WorkRequestCrudComponent } from '../workrequest/workrequest-crud.component';
import { StdBubaComponent } from '@app/components/_global/std-buba/std-buba.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';
import { WorkRequestItemCrudComponent } from '../workrequestitem/workrequestitem-crud.component';
import { WorkrequesttyperefCrudComponent } from '../workrequesttyperef/workrequesttyperef-crud.component';
import { WorkqueueCrudComponent } from '../workqueue/workqueue-crud.component';
import { HcclTeamCrudComponent } from '../hcclteam/hcclteam-crud.component';
import { HcclUserProfileCrudComponent } from '../hccluserprofile/hccluserprofile-crud.component';
import { CRUD_MODES } from '@app/@core/constants';

@Component({
  selector: 'app-workrequest-ui',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SimpleTabsetComponent,
    WorkRequestCrudComponent,
    StdBubaComponent,
    DategetdataDisplayComponent,
    WorkRequestItemCrudComponent,
    WorkrequesttyperefCrudComponent,
    WorkqueueCrudComponent,
    HcclTeamCrudComponent,
    HcclUserProfileCrudComponent
  ],
  templateUrl: './workrequest-ui.component.html',
  styleUrl: './workrequest-ui.component.scss'
})
export class WorkRequestUiComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() id?: string;

  @Input() readonly: boolean = false;

  // CRUD modes
  protected CRUD_MODES = CRUD_MODES;

  // Component state
  workRequest: WorkRequestGETData | null = null;
  workRequestItems: WorkRequestItemGETData[] = [];
  workRequestLogs: WorkRequestLogGETData[] = [];
  workRequestDeliverables: WorkRequestDeliverableGETData[] = [];

  // UI state
  loading = false;
  error: string | null = null;
  currentTabId: string = 'overview';
  showingTabset = true;

  // Tab management
  tabs: SimpleTab[] = [];

  // Selected item for detail view
  selectedItemId: string | null = null;

  // Lifecycle management
  private destroy$ = new Subject<void>();
  private initialized = false;

  constructor(private hcclService: HcclService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] && this.id) {
      if (this.initialized) {
        this.loadWorkRequest();
      }
    }
  }

  ngAfterViewInit(): void {
    this.initialized = true;
    this.initializeTabs();
    if (this.id) {
      this.loadWorkRequest();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeTabs(): void {
    this.tabs = [
      this.createTab('overview', 'Overview', '', () => this.showOverviewTab(), () => true),
      this.createTab('items', 'Items', '', () => this.showItemsTab(), () => true),
      this.createTab('deliverables', 'Deliverables', '', () => this.showDeliverablesTab(), () => true),
      this.createTab('logs', 'Activity Log', '', () => this.showLogsTab(), () => true),
      this.createTab('about', 'Details', '', () => this.showAboutTab(), () => true)
    ];
  }

  private createTab(id: string, label: string, url: string,
    activateFunction: () => void, showingTabFunction: () => boolean): SimpleTab {
    return new SimpleTab(id, label, url, activateFunction, showingTabFunction);
  }

  private showOverviewTab(): void {
    this.currentTabId = 'overview';
  }

  private showItemsTab(): void {
    this.currentTabId = 'items';
    this.loadWorkRequestItems();
  }

  private showDeliverablesTab(): void {
    this.currentTabId = 'deliverables';
    this.loadWorkRequestDeliverables();
  }

  private showLogsTab(): void {
    this.currentTabId = 'logs';
    this.loadWorkRequestLogs();
  }

  private showAboutTab(): void {
    this.currentTabId = 'about';
  }

  private loadWorkRequest(): void {
    if (!this.id) return;

    this.loading = true;
    this.error = null;

    this.hcclService.getWorkRequestById(this.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.workRequest = data;
          this.loading = false;
          this.showOverviewTab();
          this.loadWorkRequestItems();
        },
        error: (err) => {
          this.error = 'Failed to load work request: ' + (err.message || 'Unknown error');
          this.loading = false;
        }
      });
  }

  private loadWorkRequestItems(): void {
    if (!this.id) return;

    const criteria: WorkRequestItemCriteria = {
      workRequestId: this.id,
      maxResults: 100,
      orderByHint: 'sequenceOrder'
    };

    this.hcclService.findWorkRequestItems(criteria)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results) => {
          this.workRequestItems = results.searchResults || [];
        },
        error: (err) => {
          console.error('Failed to load work request items:', err);
        }
      });
  }

  private loadWorkRequestLogs(): void {
    if (!this.id) return;

    const criteria: WorkRequestLogCriteria = {
      workRequestId: this.id,
      maxResults: 100,
      orderByHint: 'dateCreatedDesc'
    };

    this.hcclService.findWorkRequestLogs(criteria)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results) => {
          this.workRequestLogs = results.searchResults || [];
        },
        error: (err) => {
          console.error('Failed to load work request logs:', err);
        }
      });
  }

  private loadWorkRequestDeliverables(): void {
    if (!this.id) return;

    const criteria: WorkRequestDeliverableCriteria = {
      workRequestId: this.id,
      maxResults: 100
    };

    this.hcclService.findWorkRequestDeliverables(criteria)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results) => {
          this.workRequestDeliverables = results.searchResults || [];
        },
        error: (err) => {
          console.error('Failed to load work request deliverables:', err);
        }
      });
  }

  onTabSelected(tabId: string): void {
    this.currentTabId = tabId;
    const tab = this.tabs.find(t => t.id === tabId);
    if (tab) {
      tab.activate();
    }
  }

  formatDate(dateData: any): string {
    if (!dateData) return '';
    if (dateData.date) {
      return new Date(dateData.date).toLocaleString();
    }
    return new Date(dateData).toLocaleString();
  }

  getStateClass(stateCode: string | undefined): string {
    if (!stateCode) return 'state-unknown';
    switch (stateCode.toLowerCase()) {
      case 'completed':
      case 'closed':
      case 'finished':
        return 'state-completed';
      case 'inprocess':
      case 'in_progress':
      case 'active':
        return 'state-active';
      case 'pending':
      case 'queued':
      case 'waiting':
        return 'state-pending';
      case 'cancelled':
      case 'rejected':
        return 'state-cancelled';
      default:
        return 'state-default';
    }
  }

  selectItem(itemId: string): void {
    this.selectedItemId = this.selectedItemId === itemId ? null : itemId;
  }

  isItemSelected(itemId: string | undefined): boolean {
    return itemId ? this.selectedItemId === itemId : false;
  }
}

