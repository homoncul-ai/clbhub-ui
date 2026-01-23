import { Component, OnInit, OnDestroy, inject, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { HcclService, CatalogEntryGETData, CatalogEntryCriteria, CatalogEntryInterestPOSTData, CatalogEntryInterestGETData } from '@app/restsvc/hccl.service';
import { StdBubaComponent } from '@app/components/_global/std-buba/std-buba.component';
import { MdbModalService, MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { CatalogEntryUiModalComponent } from './catalog-entry-ui-modal.component';
import { catchError } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface FeedItemInteraction {
  type: 'click' | 'scroll_past' | 'interest' | 'view';
  itemId: string;
  timestamp: Date;
  data?: any;
}

@Component({
  selector: 'app-dash-student-feed',
  standalone: true,
  imports: [CommonModule, FormsModule, StdBubaComponent],
  templateUrl: './dash-student-feed.component.html',
  styleUrls: ['./dash-student-feed.component.scss']
})
export class DashStudentFeedComponent implements OnInit, OnDestroy {
  @ViewChild('feedContainer') feedContainer!: ElementRef;
  
  private hcclContextService = inject(HcclContextService);
  private hcclService = inject(HcclService);
  private modalService = inject(MdbModalService);
  private catalogEntryUiModalRef: MdbModalRef<CatalogEntryUiModalComponent> | null = null;
  private destroy$ = new Subject<void>();
  
  // Feed data
  feedItems: CatalogEntryGETData[] = [];
  loading: boolean = true;
  loadingMore: boolean = false;
  error: string | null = null;
  
  // Pagination
  pageNumber: number = 1;
  pageSize: number = 10;
  hasMoreItems: boolean = true;
  totalItems: number = 0;
  
  // Filter state
  selectedCategory: string = 'all';
  
  // Interaction tracking
  interactions: FeedItemInteraction[] = [];
  viewedItems: Set<string> = new Set();
  scrolledPastItems: Set<string> = new Set();
  
  // Observer for tracking items scrolled past
  private intersectionObserver: IntersectionObserver | null = null;

  constructor() {
    console.log('DashStudentFeedComponent initialized');
  }

  ngOnInit(): void {
    this.loadInitialFeed();
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  /**
   * Setup intersection observer for tracking scroll-past events
   */
  private setupIntersectionObserver(): void {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const itemId = entry.target.getAttribute('data-item-id');
          if (itemId) {
            if (entry.isIntersecting && !this.viewedItems.has(itemId)) {
              // Item came into view
              this.viewedItems.add(itemId);
              this.recordInteraction('view', itemId);
            } else if (!entry.isIntersecting && this.viewedItems.has(itemId) && !this.scrolledPastItems.has(itemId)) {
              // Item scrolled past
              this.scrolledPastItems.add(itemId);
              this.recordInteraction('scroll_past', itemId);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: [0, 0.5, 1]
      }
    );
  }

  /**
   * Observe a feed item element
   */
  observeFeedItem(element: HTMLElement): void {
    if (this.intersectionObserver && element) {
      this.intersectionObserver.observe(element);
    }
  }

  /**
   * Record user interaction
   */
  recordInteraction(type: FeedItemInteraction['type'], itemId: string, data?: any): void {
    const interaction: FeedItemInteraction = {
      type,
      itemId,
      timestamp: new Date(),
      data
    };
    this.interactions.push(interaction);
    console.log('Feed interaction:', interaction);
    
    // In a real app, you'd batch these and send to analytics
  }

  /**
   * Load initial feed data
   */
  private loadInitialFeed(): void {
    this.loading = true;
    this.error = null;
    this.pageNumber = 1;
    this.feedItems = [];

    this.hcclContextService.waitForReady$().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (context) => {
        if (!context || !context.currentUserProfileId) {
          this.error = 'User context not available';
          this.loading = false;
          return;
        }
        this.loadFeedPage();
      },
      error: (err) => {
        console.error('Error waiting for context:', err);
        this.error = 'Failed to load user context';
        this.loading = false;
      }
    });
  }

  /**
   * Load a page of feed items
   */
  private loadFeedPage(): void {
    const criteria = this.getCriteria();
    
    this.hcclService.findCatalogEntrys(criteria).pipe(
      takeUntil(this.destroy$),
      catchError(err => {
        console.error('Error loading feed:', err);
        this.error = 'Failed to load feed items';
        return of(null);
      })
    ).subscribe({
      next: (response) => {
        if (response?.searchResults) {
          this.feedItems = [...this.feedItems, ...response.searchResults];
          this.totalItems = response.pagingInfo?.totalRows || 0;
          this.hasMoreItems = this.feedItems.length < this.totalItems;
          
          // Schedule observation of new items
          setTimeout(() => this.observeNewItems(), 100);
        }
        this.loading = false;
        this.loadingMore = false;
      },
      error: (err) => {
        console.error('Error loading feed:', err);
        this.error = 'Failed to load feed items';
        this.loading = false;
        this.loadingMore = false;
      }
    });
  }

  /**
   * Observe newly added feed items
   */
  private observeNewItems(): void {
    const feedElements = document.querySelectorAll('.feed-item[data-item-id]');
    feedElements.forEach(element => {
      const itemId = element.getAttribute('data-item-id');
      if (itemId && !this.viewedItems.has(itemId)) {
        this.observeFeedItem(element as HTMLElement);
      }
    });
  }

  /**
   * Get search criteria
   */
  getCriteria(): CatalogEntryCriteria {
    const criteria: CatalogEntryCriteria = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      isPaging: true
    };

    if (this.selectedCategory !== 'all') {
      criteria.catalogTypeCode = this.selectedCategory;
    }

    return criteria;
  }

  /**
   * Handle infinite scroll - load more items
   */
  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (this.loading || this.loadingMore || !this.hasMoreItems) {
      return;
    }

    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollThreshold = 200;

    if (documentHeight - scrollPosition < scrollThreshold) {
      this.loadMoreItems();
    }
  }

  /**
   * Load more feed items
   */
  loadMoreItems(): void {
    if (this.loadingMore || !this.hasMoreItems) {
      return;
    }

    this.loadingMore = true;
    this.pageNumber++;
    this.loadFeedPage();
  }

  /**
   * Refresh the feed
   */
  refreshFeed(): void {
    this.viewedItems.clear();
    this.scrolledPastItems.clear();
    this.loadInitialFeed();
  }

  /**
   * Select category filter
   */
  selectCategory(category: string): void {
    if (this.selectedCategory !== category) {
      this.selectedCategory = category;
      this.viewedItems.clear();
      this.scrolledPastItems.clear();
      this.loadInitialFeed();
    }
  }

  /**
   * Handle feed item click
   */
  onFeedItemClick(item: CatalogEntryGETData): void {
    this.recordInteraction('click', item.id || '', { title: item.title });
    this.openCatalogEntryModal(item);
  }

  /**
   * Open modal with CatalogEntryUiComponent
   */
  openCatalogEntryModal(result: CatalogEntryGETData): void {
    if (!result?.id) {
      return;
    }

    this.catalogEntryUiModalRef = this.modalService.open(CatalogEntryUiModalComponent, {
      modalClass: 'modal-xl',
      data: {
        catalogEntryId: result.id,
        title: result.entryCode || 'Catalog Entry Details'
      }
    }) as MdbModalRef<CatalogEntryUiModalComponent>;

    if (this.catalogEntryUiModalRef?.onClose) {
      this.catalogEntryUiModalRef.onClose.subscribe(() => {
        this.catalogEntryUiModalRef = null;
      });
    }
  }

  /**
   * Get catalog entry image URL
   */
  getCatalogEntryImageUrl(item: CatalogEntryGETData): string {
    // Could be customized based on item type
    return 'imgs/TAROT-HR.png';
  }

  /**
   * Mark as interested (thumbs up)
   */
  markInterested(item: CatalogEntryGETData, event: MouseEvent): void {
    event.stopPropagation();
    this.recordInterest(item, 10);
  }

  /**
   * Mark as not interested (thumbs down)
   */
  markNotInterested(item: CatalogEntryGETData, event: MouseEvent): void {
    event.stopPropagation();
    this.recordInterest(item, 0);
  }

  /**
   * Toggle interest state
   */
  toggleInterest(item: CatalogEntryGETData, event: MouseEvent): void {
    event.stopPropagation();
    const currentInterest = item.catalogEntryInterest?.interest || 0;
    this.recordInterest(item, currentInterest > 0 ? 0 : 10);
  }

  /**
   * Record interest for a catalog entry
   */
  private recordInterest(item: CatalogEntryGETData, interest: number): void {
    const userProfileId = this.hcclContextService.getCurrentUserProfileId() || '';
    
    const interestData: CatalogEntryInterestPOSTData = {
      catalogId: item.catalogId || '',
      catalogEntryId: item.id || '',
      personalStatementId: '', // Will be populated later when personal statement context is available
      userProfileId: userProfileId,
      interest: interest,
      currentStateCode: '--ChangedOnEntry--'
    };

    this.recordInteraction('interest', item.id || '', { interest });

    this.hcclService.showInterest(interestData).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        console.log('Interest recorded:', response);
        if (!item.catalogEntryInterest) {
          item.catalogEntryInterest = {} as CatalogEntryInterestGETData;
        }
        item.catalogEntryInterest.interest = interest;
        if (response?.id) {
          item.catalogEntryInterest.id = response.id;
        }
      },
      error: (error) => {
        console.error('Error recording interest:', error);
      }
    });
  }

  /**
   * Get relative time string from DateGETData
   */
  getRelativeTime(item: CatalogEntryGETData): string {
    const dateData = item.dateCreated;
    if (!dateData?.dateMilliseconds) return '';
    
    const date = new Date(dateData.dateMilliseconds);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }

  /**
   * Get icon for catalog entry type
   */
  getTypeIcon(item: CatalogEntryGETData): string {
    const typeCode = item.catalogTypeCode?.toLowerCase() || '';
    switch (typeCode) {
      case 'job':
        return 'fas fa-briefcase';
      case 'course':
        return 'fas fa-graduation-cap';
      case 'event':
        return 'fas fa-calendar-alt';
      default:
        return 'fas fa-file-alt';
    }
  }

  /**
   * Get label for catalog entry type
   */
  getTypeLabel(item: CatalogEntryGETData): string {
    const typeCode = item.catalogTypeCode?.toLowerCase() || '';
    switch (typeCode) {
      case 'job':
        return 'Job';
      case 'course':
        return 'Course';
      case 'event':
        return 'Event';
      default:
        return 'Item';
    }
  }
}
