import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { HcclService, UserFeedGETData, FeedEntryInstanceGETData, FeedEntryGETData, CatalogEntryInterestPOSTData } from '@app/restsvc/hccl.service';
import { StdMarkdownDisplayComponent } from '@app/components/_global/std-markdown-display/std-markdown-display.component';
import { catchError } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Extended FeedEntryInstanceGETData to track UI state for "more" expansion
 */
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
  private destroy$ = new Subject<void>();
  
  // Feed data
  feedEntries: FeedEntryDisplayData[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor() {
    console.log('DashStudentFeedComponent initialized');
  }

  ngOnInit(): void {
    this.loadFeed();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load the current user's feed
   */
  private loadFeed(refreshFeed: boolean = false): void {
    this.loading = true;
    this.error = null;
    this.feedEntries = [];

    this.hcclContextService.waitForReady$().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (context) => {
        if (!context || !context.currentUserProfileId) {
          this.error = 'User context not available';
          this.loading = false;
          return;
        }
        this.fetchFeed(refreshFeed);
      },
      error: (err) => {
        console.error('Error waiting for context:', err);
        this.error = 'Failed to load user context';
        this.loading = false;
      }
    });
  }

  /**
   * Fetch feed data from the service
   */
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
          // Map feed entries and initialize display state
          this.feedEntries = response.feedEntries.map(entry => ({
            ...entry,
            displayMarkdown: entry.feedEntry?.mdContents || '',
            isExpanded: false
          }));
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading feed:', err);
        this.error = 'Failed to load feed';
        this.loading = false;
      }
    });
  }

  /**
   * Refresh the feed
   */
  refreshFeed(): void {
    this.loadFeed(true);
  }

  /**
   * Toggle the "more" content for a feed entry
   */
  toggleMore(entry: FeedEntryDisplayData): void {
    if (!entry.feedEntry?.mdMore) {
      return;
    }

    if (entry.isExpanded) {
      // Collapse - show only mdContents
      entry.displayMarkdown = entry.feedEntry.mdContents || '';
      entry.isExpanded = false;
    } else {
      // Expand - append mdMore to mdContents
      const base = entry.feedEntry.mdContents || '';
      const more = entry.feedEntry.mdMore || '';
      entry.displayMarkdown = base + '\n\n' + more;
      entry.isExpanded = true;
    }
  }

  /**
   * Check if a feed entry has "more" content
   */
  hasMore(entry: FeedEntryDisplayData): boolean {
    return !!entry.feedEntry?.mdMore;
  }

  /**
   * Get the feed entry from the instance
   */
  getFeedEntry(entry: FeedEntryDisplayData): FeedEntryGETData | undefined {
    return entry.feedEntry;
  }

  thumbUp(entry: FeedEntryDisplayData) {
    this.recordInterest(entry, 10);
  }
  
  thumbDown(entry: FeedEntryDisplayData) {
    this.recordInterest(entry, 0);
  }

  private recordInterest(entry: FeedEntryDisplayData, interest: number): void {
    const userProfileId = this.hcclContextService.getCurrentUserProfileId() || '';
    const feedEntry = entry.feedEntry;

    const interestData: CatalogEntryInterestPOSTData = {
      catalogId: '',
      catalogEntryId: feedEntry?.subjectEntityId || '',
      personalStatementId: entry.personalStatementId || '',
      userProfileId: userProfileId,
      interest: interest,
      currentStateCode: '--ChangedOnEntry--'
    };
    //alert(entry.id + ' ' + feedEntry?.subjectEntityId + ' ' + entry.personalStatementId + ' ' + userProfileId + ' ' + interest);

    this.hcclService.showInterest(interestData).subscribe({
      next: (response) => {
        console.log('Interest recorded from feed:', response);
      },
      error: (error) => {
        console.error('Error recording interest from feed:', error);
      }
    });
  }
  
  moreActions(entry: FeedEntryDisplayData) {
    alert('⋯ more');
  }
  
  dismiss(entry: FeedEntryDisplayData) {
    alert('X dismiss (later: remove from feed)');
  }
}
