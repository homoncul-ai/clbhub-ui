import { Component, Input, AfterViewInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HcclService } from '../../../restsvc/hccl.service';
import {
  WorkRequestDeliverableGETData,
  WorkRequestDeliverableSectionGETData
} from '../../../restsvc/hccl.service';
import { SimpleTabsetComponent, SimpleTab } from '../../_global/simple-tabset/simple-tabset.component';
import { Subject, takeUntil } from 'rxjs';
import { StdBubaComponent } from '@app/components/_global/std-buba/std-buba.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';
import { PmfilegroupUiComponent } from '../pmfilegroup-ui/pmfilegroup-ui.component';
import { CRUD_MODES } from '@app/@core/constants';

@Component({
  selector: 'app-workrequestdeliverable-ui',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SimpleTabsetComponent,
    StdBubaComponent,
    DategetdataDisplayComponent,
    PmfilegroupUiComponent
  ],
  templateUrl: './workrequestdeliverable-ui.component.html',
  styleUrl: './workrequestdeliverable-ui.component.scss'
})
export class WorkRequestDeliverableUiComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() id?: string;

  @Input() readonly: boolean = false;

  // CRUD modes
  protected CRUD_MODES = CRUD_MODES;

  // Component state
  deliverable: WorkRequestDeliverableGETData | null = null;
  sections: WorkRequestDeliverableSectionGETData[] = [];

  // UI state
  loading = false;
  error: string | null = null;
  currentTabId: string = 'overview';
  showingTabset = true;

  // Tab management
  tabs: SimpleTab[] = [];

  // Selected section for detail view
  selectedSectionId: string | null = null;

  // Lifecycle management
  private destroy$ = new Subject<void>();
  private initialized = false;

  constructor(private hcclService: HcclService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] && this.id) {
      if (this.initialized) {
        this.loadDeliverable();
      }
    }
  }

  ngAfterViewInit(): void {
    this.initialized = true;
    this.initializeTabs();
    if (this.id) {
      this.loadDeliverable();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeTabs(): void {
    this.tabs = [
      this.createTab('overview', 'Overview', '', () => this.showOverviewTab(), () => true),
      this.createTab('sections', 'Sections', '', () => this.showSectionsTab(), () => true),
      this.createTab('files', 'Files', '', () => this.showFilesTab(), () => this.hasFiles())
    ];
  }

  private createTab(id: string, label: string, url: string,
    activateFunction: () => void, showingTabFunction: () => boolean): SimpleTab {
    return new SimpleTab(id, label, url, activateFunction, showingTabFunction);
  }

  private showOverviewTab(): void {
    this.currentTabId = 'overview';
  }

  private showSectionsTab(): void {
    this.currentTabId = 'sections';
  }

  private showFilesTab(): void {
    this.currentTabId = 'files';
  }

  private hasFiles(): boolean {
    return !!this.deliverable?.pmfileGroupId;
  }

  private loadDeliverable(): void {
    if (!this.id) return;

    this.loading = true;
    this.error = null;

    this.hcclService.getWorkRequestDeliverableById(this.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.deliverable = data;
          this.sections = data.sections || [];
          this.loading = false;
          this.showOverviewTab();
        },
        error: (err) => {
          this.error = 'Failed to load deliverable: ' + (err.message || 'Unknown error');
          this.loading = false;
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

  selectSection(sectionId: string): void {
    this.selectedSectionId = this.selectedSectionId === sectionId ? null : sectionId;
  }

  isSectionSelected(sectionId: string | undefined): boolean {
    return sectionId ? this.selectedSectionId === sectionId : false;
  }
}

