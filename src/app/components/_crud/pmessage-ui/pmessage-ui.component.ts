import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HcclService } from '../../../restsvc/hccl.service';
import { 
  PMessageGETData, 
  PMessageEntryGETData, 
  PMessageEntryGETDataSearchResults,
  PMessageAttachmentGETData,
  PMessageAttachmentGETDataSearchResults,
  PMessageParticipantGETData,
  PMessageParticipantGETDataSearchResults,
  PMessageEntryPOSTData,
  PMessageEntryCriteria,
  PMessageAttachmentCriteria,
  PMessageParticipantCriteria
} from '../../../restsvc/hccl.service';
import { SimpleTabsetComponent, SimpleTab } from '../../_global/simple-tabset/simple-tabset.component';
import { HcclUserProfileDetailsComponent } from '../../hccl-user-profile-details/hccl-user-profile-details.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-pmessage-ui',
  standalone: true,
  imports: [CommonModule, FormsModule, SimpleTabsetComponent, HcclUserProfileDetailsComponent],
  templateUrl: './pmessage-ui.component.html',
  styleUrl: './pmessage-ui.component.scss'
})
export class PMessageUiComponent implements OnInit, OnChanges {
  @Input() id!: string;
  @Input() readonly: boolean = false;

  // Component state
  pmessage: PMessageGETData | null = null;
  messageEntries: PMessageEntryGETData[] = [];
  attachments: PMessageAttachmentGETData[] = [];
  participants: PMessageParticipantGETData[] = [];
  
  // UI state
  loading = false;
  error: string | null = null;
  currentTabId: string = 'messages';
  showingTabset = true;
  
  // Tab management
  tabs: SimpleTab[] = [];
  
  // Message posting
  newMessageText = '';
  postingMessage = false;
  
  // Pagination for messages
  private destroy$ = new Subject<void>();

  constructor(private hcclService: HcclService) {}

  ngOnInit(): void {
    alert('ngOnInit ' + this.id);
    this.initializeTabs();
    if (this.id) {
      this.loadPMessage();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] && changes['id'].currentValue) {
      this.loadPMessage();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeTabs(): void {
    this.tabs = [
      this.createTab('messages', 'Messages', '', () => this.showMessagesTab(), () => true),
      this.createTab('attachments', 'Attachments', '', () => this.showAttachmentsTab(), () => true),
      this.createTab('participants', 'Participants', '', () => this.showParticipantsTab(), () => true)
    ];
  }

  private createTab(id: string, label: string, url: string, 
    activateFunction: () => void, showingTabFunction: () => boolean): SimpleTab {
    return new SimpleTab(id, label, url, activateFunction, showingTabFunction);
  }

  private showMessagesTab(): void {
    this.currentTabId = 'messages';
    this.loadMessageEntries();
  }

  private showAttachmentsTab(): void {
    this.currentTabId = 'attachments';
    this.loadAttachments();
  }

  private showParticipantsTab(): void {
    this.currentTabId = 'participants';
    this.loadParticipants();
  }

  private loadPMessage(): void {
    if (!this.id) return;
    
    this.loading = true;
    this.error = null;
    
    this.hcclService.getPMessageById(this.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.pmessage = data;
          this.loading = false;
          // Load initial tab content
          this.showMessagesTab();
        },
        error: (err) => {
          this.error = 'Failed to load message: ' + (err.message || 'Unknown error');
          this.loading = false;
        }
      });
  }

  private loadMessageEntries(): void {
    if (!this.id) return;
    
    const criteria: PMessageEntryCriteria = {
      pmessageId: this.id,
      maxResults: 50,
      orderByHint: 'dateCreated DESC'
    };
    
    this.hcclService.findPMessageEntrys(criteria)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results) => {
          this.messageEntries = results.searchResults || [];
        },
        error: (err) => {
          this.error = 'Failed to load messages: ' + (err.message || 'Unknown error');
        }
      });
  }

  private loadAttachments(): void {
    if (!this.id) return;
    
    const criteria: PMessageAttachmentCriteria = {
      pmessageId: this.id,
      maxResults: 100
    };
    
    this.hcclService.findPMessageAttachments(criteria)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results) => {
          this.attachments = results.searchResults || [];
        },
        error: (err) => {
          this.error = 'Failed to load attachments: ' + (err.message || 'Unknown error');
        }
      });
  }

  private loadParticipants(): void {
    if (!this.id) return;
    
    const criteria: PMessageParticipantCriteria = {
      pmessageId: this.id,
      maxResults: 100
    };
    
    this.hcclService.findPMessageParticipants(criteria)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results) => {
          this.participants = results.searchResults || [];
        },
        error: (err) => {
          this.error = 'Failed to load participants: ' + (err.message || 'Unknown error');
        }
      });
  }

  postMessage(): void {
    if (!this.newMessageText.trim() || !this.id || this.readonly) return;
    
    this.postingMessage = true;
    
    const newEntry: PMessageEntryPOSTData = {
      pmessageId: this.id,
      body: this.newMessageText.trim(),
      bodyFormatCode: 'PLAINTEXT'
    };
    
    this.hcclService.createPMessageEntry(newEntry)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.newMessageText = '';
          this.postingMessage = false;
          this.loadMessageEntries(); // Refresh messages
        },
        error: (err) => {
          this.error = 'Failed to post message: ' + (err.message || 'Unknown error');
          this.postingMessage = false;
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
    // Handle DateGETData format
    if (dateData.date) {
      return new Date(dateData.date).toLocaleString();
    }
    return new Date(dateData).toLocaleString();
  }

  getMessageAuthorName(entry: PMessageEntryGETData): string {
    if (entry.createdByInfo?.name) {
      return entry.createdByInfo.name;
    }
    return 'Unknown User';
  }

  getParticipantUserProfileId(participant: PMessageParticipantGETData): string {
    // Extract user profile ID from participant data
    // This might need adjustment based on actual data structure
    return participant.id || '';
  }
}
