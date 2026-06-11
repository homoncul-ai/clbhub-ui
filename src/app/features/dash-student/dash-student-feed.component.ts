import { Component, OnInit, OnDestroy, inject } from '@angular/core';
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
  private detailsModalRef: MdbModalRef<FeedListingDetailsModalComponent> | null = null;
  private destroy$ = new Subject<void>();

  feedEntries: FeedEntryDisplayData[] = [];
  loading: boolean = true;
  error: string | null = null;

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
