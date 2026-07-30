import { Component, OnInit, OnDestroy, inject, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { PageHeaderActionService } from '@app/shell/services/page-header-action.service';
import {
  HcclService,
  UserFeedGETData,
  FeedEntryInstanceGETData,
  CatalogEntryGETData,
  CatalogEntryInterestPOSTData,
  CatalogEntryInterestGETData,
  MenuControlDataList
} from '@app/restsvc/hccl.service';
import { StdMarkdownDisplayComponent } from '@app/components/_global/std-markdown-display/std-markdown-display.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { FeedListingDetailsModalComponent } from './feed-listing-details-modal.component';
import {
  FeedDateRangeModalComponent,
  FeedDateRangeModalResult
} from './feed-date-range-modal.component';
import { catchError, filter, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';

interface FeedSignupIcon {
  code: string;
  icon: string;
  label: string;
  tooltip: string;
}

interface FeedAgeIcon {
  kind: 'over18' | 'under18' | 'all_ages';
  icon: string;
  label: string;
  tooltip: string;
}

interface FeedEntryDisplayData extends FeedEntryInstanceGETData {
  displayMarkdown?: string;
  isExpanded?: boolean;
}

@Component({
  selector: 'app-dash-student-feed',
  standalone: true,
  imports: [CommonModule, FormsModule, StdMarkdownDisplayComponent],
  templateUrl: './dash-student-feed.component.html',
  styleUrls: ['./dash-student-feed.component.scss']
})
export class DashStudentFeedComponent implements OnInit, OnDestroy {
  private hcclContextService = inject(HcclContextService);
  private hcclService = inject(HcclService);
  private pageHeaderActionService = inject(PageHeaderActionService);
  private modalService = inject(MdbModalService);
  private hostElement = inject(ElementRef);
  private detailsModalRef: MdbModalRef<FeedListingDetailsModalComponent> | null = null;
  private destroy$ = new Subject<void>();

  feedEntries: FeedEntryDisplayData[] = [];
  loading: boolean = true;
  error: string | null = null;

  over18Only = false;
  selectedCategory = 'all';
  dateStart = '';
  dateEnd = '';
  activeDatePreset: 'today' | 'last7' | 'thisMonth' | 'last30' | 'custom' | null = null;

  readonly pageSize = 50;
  currentPage = 1;

  readonly categoryOptions = [
    { code: 'all', label: 'All', icon: 'fas fa-th-large' },
    { code: 'job', label: 'Jobs', icon: 'fas fa-briefcase' },
    { code: 'course', label: 'Courses', icon: 'fas fa-graduation-cap' },
    { code: 'event', label: 'Events', icon: 'fas fa-calendar-alt' },
    { code: 'career', label: 'Careers', icon: 'fas fa-compass' }
  ];

  readonly datePresets = [
    { code: 'today' as const, label: 'Today' },
    { code: 'last7' as const, label: 'Last 7 days' },
    { code: 'thisMonth' as const, label: 'This month' },
    { code: 'last30' as const, label: 'Last 30 days' }
  ];

  get filteredFeedEntries(): FeedEntryDisplayData[] {
    let entries = [...this.feedEntries];

    if (this.over18Only) {
      entries = entries.filter(entry => (entry.catalogEntry?.ageRequired ?? 0) >= 18);
    }

    if (this.selectedCategory !== 'all') {
      entries = entries.filter(entry => this.getEntryTypeCode(entry) === this.selectedCategory);
    }

    if (this.dateStart || this.dateEnd) {
      const startMs = this.dateStart ? this.getStartOfDayMs(this.dateStart) : Number.NEGATIVE_INFINITY;
      const endMs = this.dateEnd ? this.getEndOfDayMs(this.dateEnd) : Number.POSITIVE_INFINITY;
      entries = entries.filter(entry => {
        const entryMs = this.getDateCreatedMs(entry);
        return entryMs >= startMs && entryMs <= endMs;
      });
    }

    entries.sort((a, b) => {
      const aMs = this.getDateCreatedMs(a);
      const bMs = this.getDateCreatedMs(b);
      return bMs - aMs;
    });

    return entries;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredFeedEntries.length / this.pageSize));
  }

  get visiblePageNumbers(): Array<number | 'ellipsis'> {
    const total = this.totalPages;
    const current = this.currentPage;
    if (total <= 9) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages = new Set<number>();
    pages.add(1);
    pages.add(total);
    for (let p = current - 2; p <= current + 2; p++) {
      if (p >= 1 && p <= total) {
        pages.add(p);
      }
    }

    const sorted = Array.from(pages).sort((a, b) => a - b);
    const result: Array<number | 'ellipsis'> = [];
    let previous = 0;
    for (const page of sorted) {
      if (previous && page - previous > 1) {
        result.push('ellipsis');
      }
      result.push(page);
      previous = page;
    }
    return result;
  }

  get pagedFeedEntries(): FeedEntryDisplayData[] {
    const page = Math.min(this.currentPage, this.totalPages);
    const start = (page - 1) * this.pageSize;
    return this.filteredFeedEntries.slice(start, start + this.pageSize);
  }

  get pageRangeLabel(): string {
    const total = this.filteredFeedEntries.length;
    if (total === 0) {
      return '0 of 0';
    }
    const page = Math.min(this.currentPage, this.totalPages);
    const start = (page - 1) * this.pageSize + 1;
    const end = Math.min(page * this.pageSize, total);
    return `${start}–${end} of ${total}`;
  }

  get hasActiveFilters(): boolean {
    return this.over18Only || this.selectedCategory !== 'all' || !!this.dateStart || !!this.dateEnd;
  }

  ngOnInit(): void {
    this.syncHeaderActions();
    this.pageHeaderActionService.actionClick$
      .pipe(
        takeUntil(this.destroy$),
        filter(key => key === 'refreshFeed')
      )
      .subscribe(() => this.refreshFeed());
    this.loadFeed();
  }

  ngOnDestroy(): void {
    this.pageHeaderActionService.clearActions();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private syncHeaderActions(): void {
    this.pageHeaderActionService.setActions([
      {
        key: 'refreshFeed',
        label: 'Refresh Feed',
        icon: 'fas fa-sync-alt',
        disabled: this.loading,
        loading: this.loading
      }
    ]);
  }

  private loadFeed(refreshFeed: boolean = false): void {
    this.loading = true;
    this.syncHeaderActions();
    this.error = null;
    this.feedEntries = [];

    this.hcclContextService.waitForReady$().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (context) => {
        if (!context || !context.currentUserProfileId) {
          this.error = 'User context not available';
          this.loading = false;
          this.syncHeaderActions();
          return;
        }
        this.fetchFeed(refreshFeed);
      },
      error: (err) => {
        console.error('Error waiting for context:', err);
        this.error = 'Failed to load user context';
        this.loading = false;
        this.syncHeaderActions();
      }
    });
  }

  private fetchFeed(refreshFeed: boolean = false): void {
    this.hcclService.loadCurrentFeed(refreshFeed).pipe(
      takeUntil(this.destroy$),
      catchError(err => {
        console.error('Error loading feed:', err);
        this.error = 'Failed to load feed';
        return of(null);
      })
    ).subscribe({
      next: (response: UserFeedGETData | null) => {
        if (response?.feedEntries) {
          this.feedEntries = response.feedEntries.map(entry => ({
            ...entry,
            displayMarkdown: entry.feedEntry?.mdContents || '',
            isExpanded: false
          }));
        }
        this.currentPage = 1;
        this.loading = false;
        this.syncHeaderActions();
      },
      error: (err) => {
        console.error('Error loading feed:', err);
        this.error = 'Failed to load feed';
        this.loading = false;
        this.syncHeaderActions();
      }
    });
  }

  refreshFeed(): void {
    this.loadFeed(true);
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1;
  }

  onOver18OnlyChange(): void {
    this.currentPage = 1;
  }

  clearFilters(): void {
    this.over18Only = false;
    this.selectedCategory = 'all';
    this.clearDateRange();
    this.currentPage = 1;
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
      this.scrollFeedPaginationIntoView();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;
      this.scrollFeedPaginationIntoView();
    }
  }

  goToPage(page: number | string): void {
    if (page === 'ellipsis') {
      return;
    }
    const target = Number(page);
    if (!Number.isFinite(target) || target < 1 || target > this.totalPages || target === this.currentPage) {
      return;
    }
    this.currentPage = target;
    this.scrollFeedPaginationIntoView();
  }

  private scrollFeedPaginationIntoView(): void {
    setTimeout(() => {
      const pagination = this.hostElement.nativeElement.querySelector(
        '.feed-pagination'
      ) as HTMLElement | null;
      pagination?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }, 50);
  }

  applyDatePreset(preset: 'today' | 'last7' | 'thisMonth' | 'last30'): void {
    const today = this.getTodayString();

    switch (preset) {
      case 'today':
        this.dateEnd = today;
        break;
      case 'last7':
        this.dateStart = this.addDaysToDateString(today, -6);
        this.dateEnd = today;
        break;
      case 'thisMonth':
        this.dateStart = this.getFirstDayOfMonthString(today);
        this.dateEnd = today;
        break;
      case 'last30':
        this.dateStart = this.addDaysToDateString(today, -29);
        this.dateEnd = today;
        break;
    }

    this.activeDatePreset = preset;
    this.currentPage = 1;
  }

  openDateRangeModal(): void {
    const modalRef = this.modalService.open(FeedDateRangeModalComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        dateStart: this.dateStart,
        dateEnd: this.dateEnd
      }
    });

    modalRef.onClose.subscribe((result: FeedDateRangeModalResult | undefined) => {
      if (!result) {
        return;
      }

      this.dateStart = result.dateStart;
      this.dateEnd = result.dateEnd;
      this.syncActiveDatePreset();
      this.currentPage = 1;
    });
  }

  get dateRangeSummary(): string | null {
    if (!this.dateStart && !this.dateEnd) {
      return null;
    }

    if (this.dateStart && this.dateEnd) {
      return `${this.formatDisplayDate(this.dateStart)} – ${this.formatDisplayDate(this.dateEnd)}`;
    }

    if (this.dateStart) {
      return `From ${this.formatDisplayDate(this.dateStart)}`;
    }

    return `Through ${this.formatDisplayDate(this.dateEnd)}`;
  }

  private clearDateRange(): void {
    this.dateStart = '';
    this.dateEnd = '';
    this.activeDatePreset = null;
  }

  private syncActiveDatePreset(): void {
    if (!this.dateStart && !this.dateEnd) {
      this.activeDatePreset = null;
      return;
    }

    const today = this.getTodayString();
    const ranges = {
      today: { start: '', end: today },
      last7: { start: this.addDaysToDateString(today, -6), end: today },
      thisMonth: { start: this.getFirstDayOfMonthString(today), end: today },
      last30: { start: this.addDaysToDateString(today, -29), end: today }
    };

    for (const [preset, range] of Object.entries(ranges) as Array<
      ['today' | 'last7' | 'thisMonth' | 'last30', { start: string; end: string }]
    >) {
      if (this.dateStart === range.start && this.dateEnd === range.end) {
        this.activeDatePreset = preset;
        return;
      }
    }

    this.activeDatePreset = 'custom';
  }

  private getTodayString(): string {
    return this.formatDateString(new Date());
  }

  private formatDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private addDaysToDateString(dateValue: string, days: number): string {
    const [year, month, day] = dateValue.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + days);
    return this.formatDateString(date);
  }

  private getFirstDayOfMonthString(dateValue: string): string {
    const [year, month] = dateValue.split('-').map(Number);
    return `${year}-${String(month).padStart(2, '0')}-01`;
  }

  private formatDisplayDate(dateValue: string): string {
    const [year, month, day] = dateValue.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  private getEntryTypeCode(entry: FeedEntryDisplayData): string {
    return (entry.feedEntry?.feedSubTypeCode || entry.catalogEntry?.catalogTypeCode || '').toLowerCase();
  }

  private getDateCreatedMs(entry: FeedEntryDisplayData): number {
    return (
      entry.dateCreated?.dateMilliseconds ??
      entry.feedEntry?.dateCreated?.dateMilliseconds ??
      entry.catalogEntry?.dateCreated?.dateMilliseconds ??
      0
    );
  }

  private getStartOfDayMs(dateValue: string): number {
    return new Date(`${dateValue}T00:00:00`).getTime();
  }

  private getEndOfDayMs(dateValue: string): number {
    return new Date(`${dateValue}T23:59:59.999`).getTime();
  }

  toggleMore(entry: FeedEntryDisplayData): void {
    if (!entry.feedEntry?.mdMore) {
      return;
    }

    if (entry.isExpanded) {
      entry.displayMarkdown = entry.feedEntry.mdContents || '';
      entry.isExpanded = false;
    } else {
      const base = entry.feedEntry.mdContents || '';
      const more = entry.feedEntry.mdMore || '';
      entry.displayMarkdown = base + '\n\n' + more;
      entry.isExpanded = true;
    }
  }

  hasMore(entry: FeedEntryDisplayData): boolean {
    return !!entry.feedEntry?.mdMore;
  }

  getTypeBadge(entry: FeedEntryDisplayData): string {
    const code = entry.feedEntry?.feedSubTypeCode || entry.catalogEntry?.catalogTypeCode;
    return code ? code.toUpperCase() : '';
  }

  getTypeIcon(entry: FeedEntryDisplayData): string {
    const code = (entry.feedEntry?.feedSubTypeCode || entry.catalogEntry?.catalogTypeCode || '').toLowerCase();
    switch (code) {
      case 'course':
        return 'fas fa-graduation-cap';
      case 'job':
        return 'fas fa-briefcase';
      case 'career':
        return 'fas fa-compass';
      case 'event':
        return 'fas fa-calendar-alt';
      default:
        return 'fas fa-bullhorn';
    }
  }

  getSignupIcons(entry: FeedEntryDisplayData): FeedSignupIcon[] {
    const code = this.getSignupBehaviorCode(entry);
    if (!code || code === 'none') {
      return [];
    }
    return [this.mapSignupIcon(code)];
  }

  getSourceUrl(entry: FeedEntryDisplayData): string {
    return entry.catalogEntry?.url?.trim() || '';
  }

  getSourceLabel(entry: FeedEntryDisplayData): string {
    return (
      entry.feedEntry?.postedByEntityExtra ||
      entry.catalogEntry?.catalog?.name ||
      entry.catalogEntry?.catalog?.entityDisplayName ||
      this.formatSourceUrl(entry.catalogEntry?.url)
    );
  }

  getDateCreatedLabel(entry: FeedEntryDisplayData): string | null {
    const dateCreated =
      entry.dateCreated ??
      entry.feedEntry?.dateCreated ??
      entry.catalogEntry?.dateCreated;

    if (!dateCreated) {
      return null;
    }

    if (dateCreated.formattedDate) {
      return dateCreated.formattedDate;
    }

    if (dateCreated.formattedDateTime) {
      return dateCreated.formattedDateTime;
    }

    const ms = dateCreated.dateMilliseconds;
    if (ms) {
      return new Date(ms).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }

    if (dateCreated.date) {
      return new Date(dateCreated.date).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }

    return null;
  }

  getAgeRestriction(entry: FeedEntryDisplayData): FeedAgeIcon | null {
    if (!entry.catalogEntry) {
      return null;
    }

    const ageRequired = entry.catalogEntry.ageRequired;
    if (ageRequired === undefined || ageRequired === null) {
      return this.buildAgeIcon('all_ages');
    }
    if (ageRequired >= 18) {
      return this.buildAgeIcon('over18', ageRequired);
    }
    if (ageRequired > 0) {
      return this.buildAgeIcon('under18', ageRequired);
    }
    return this.buildAgeIcon('all_ages');
  }

  openDetails(entry: FeedEntryDisplayData): void {
    this.detailsModalRef = this.modalService.open(FeedListingDetailsModalComponent, {
      modalClass: 'modal-fullscreen',
      data: {
        feedEntry: entry.feedEntry,
        feedInstance: entry
      }
    });
  }

  openMap(entry: FeedEntryDisplayData): void {
    alert('Map view (coming soon)');
  }

  isLiked(entry: FeedEntryDisplayData): boolean {
    const catalogEntry = entry.catalogEntry;
    if (!catalogEntry) {
      return false;
    }
    const interestId =
      (catalogEntry as CatalogEntryGETData & { catalogEntryInterestId?: string }).catalogEntryInterestId ||
      catalogEntry.catalogEntryInterest?.id;
    return !!interestId;
  }

  thumbUp(entry: FeedEntryDisplayData): void {
    if (this.isLiked(entry)) {
      return;
    }
    this.recordInterest(entry, 10);
  }

  thumbDown(entry: FeedEntryDisplayData): void {
    this.recordInterest(entry, 0);
  }

  moreActions(entry: FeedEntryDisplayData): void {
    alert('More options (coming soon)');
  }

  dismiss(entry: FeedEntryDisplayData): void {
    alert('Dismiss (coming soon: remove from feed)');
  }

  private getSignupBehaviorCode(entry: FeedEntryDisplayData): string {
    const fromMenu = this.getSelectedMenuId(entry.catalogEntry?.signupBehaviorMenu);
    if (fromMenu) {
      return fromMenu;
    }
    if (entry.catalogEntry?.url) {
      return 'participant';
    }
    return 'none';
  }

  private getSelectedMenuId(menu: MenuControlDataList | null | undefined): string {
    const selected = menu?.menuItems?.find(item => item.selected);
    return selected?.id || '';
  }

  private formatSourceUrl(url?: string): string {
    if (!url) {
      return 'View source';
    }
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  }

  private buildAgeIcon(kind: FeedAgeIcon['kind'], ageRequired?: number): FeedAgeIcon {
    switch (kind) {
      case 'over18':
        return {
          kind,
          icon: 'fas fa-user-shield',
          label: 'Over 18',
          tooltip: ageRequired
            ? `Appropriate age: ${ageRequired}+`
            : 'Appropriate age: 18 and over'
        };
      case 'under18':
        return {
          kind,
          icon: 'fas fa-child',
          label: 'Under 18',
          tooltip: ageRequired
            ? `Appropriate age: under ${ageRequired + 1}`
            : 'Appropriate age: under 18'
        };
      default:
        return {
          kind: 'all_ages',
          icon: 'fas fa-users',
          label: 'All ages',
          tooltip: 'Appropriate for all ages'
        };
    }
  }

  private mapSignupIcon(code: string): FeedSignupIcon {
    switch (code.toLowerCase()) {
      case 'participant':
        return {
          code,
          icon: 'fas fa-user-plus',
          label: 'Signup',
          tooltip: 'Signup available for this listing'
        };
      case 'messaging':
      case 'message':
        return {
          code,
          icon: 'fas fa-comment-dots',
          label: 'Message',
          tooltip: 'Contact the provider to sign up'
        };
      case 'info_only':
      case 'info':
        return {
          code,
          icon: 'fas fa-info-circle',
          label: 'Info',
          tooltip: 'Information-only signup'
        };
      default:
        return {
          code,
          icon: 'fas fa-user-plus',
          label: 'Signup',
          tooltip: `Signup: ${code}`
        };
    }
  }

  private recordInterest(entry: FeedEntryDisplayData, interest: number): void {
    const userProfileId = this.hcclContextService.getCurrentUserProfileId() || '';
    const feedEntry = entry.feedEntry;

    const interestData: CatalogEntryInterestPOSTData = {
      catalogId: '',
      catalogEntryId: feedEntry?.subjectEntityId || entry.catalogEntry?.id || '',
      personalStatementId: entry.personalStatementId || '',
      userProfileId: userProfileId,
      interest: interest,
      currentStateCode: '--ChangedOnEntry--'
    };

    this.hcclService.showInterest(interestData).subscribe({
      next: (response) => {
        console.log('Interest recorded from feed:', response);
        if (interest > 0 && entry.catalogEntry) {
          if (!entry.catalogEntry.catalogEntryInterest) {
            entry.catalogEntry.catalogEntryInterest = {} as CatalogEntryInterestGETData;
          }
          entry.catalogEntry.catalogEntryInterest.interest = interest;
          if (response?.id) {
            entry.catalogEntry.catalogEntryInterest.id = response.id;
          }
        }
      },
      error: (error) => {
        console.error('Error recording interest from feed:', error);
      }
    });
  }
}
