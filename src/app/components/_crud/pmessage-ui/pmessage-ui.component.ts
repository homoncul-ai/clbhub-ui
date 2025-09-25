import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
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
import { StdMdbFormTextareaComponent } from '../../_global/std-mdb-form-textarea/std-mdb-form-textarea.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-pmessage-ui',
  standalone: true,
  imports: [CommonModule, FormsModule, SimpleTabsetComponent, 
    HcclUserProfileDetailsComponent, StdMdbFormTextareaComponent],
  templateUrl: './pmessage-ui.component.html',
  styleUrl: './pmessage-ui.component.scss'
})
export class PMessageUiComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() id!: string;
  @Input() readonly: boolean = false;
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

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
  
  // File upload
  showAttachmentModal = false;
  selectedFiles: File[] = [];
  uploading = false;
  uploadProgress = 0;
  
  // Pagination for messages
  private destroy$ = new Subject<void>();
  private shouldScrollToBottom = false;

  constructor(private hcclService: HcclService) {}

  ngOnInit(): void {
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

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom && this.messagesContainer) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
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
      orderByHint: 'pmessageUIEntryOrder'
    };
    
    this.hcclService.findPMessageEntrys(criteria)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results) => {
          this.messageEntries = results.searchResults || [];
          this.shouldScrollToBottom = true; // Trigger scroll to bottom after loading
        },
        error: (err) => {
          this.error = 'Failed to load messages: ' + (err.message || 'Unknown error');
        }
      });
  }

  protected isEdited(entry: PMessageEntryGETData): boolean {
    return  false;
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
          // collate attachments by entry id - attachemtns are type PMessageAttachmentGETData
          this.attachments.forEach((attachment: PMessageAttachmentGETData) => {
            if (this.mapEntryIdToAttachments.has(attachment.pmessageEntryId || '')) {
              this.mapEntryIdToAttachments.get(attachment.pmessageEntryId || '')?.push(attachment);
            } else {
              this.mapEntryIdToAttachments.set(attachment.pmessageEntryId || '', [attachment]);
            }
            });
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

  private mapEntryIdToAttachments: Map<string, PMessageAttachmentGETData[]> = new Map();

  protected getAttachmentsForEntry(entry: PMessageEntryGETData): PMessageAttachmentGETData[] {
    return this.mapEntryIdToAttachments.get(entry.id || '') || [];
  }
  protected hasAttachmentsForEntry(entry: PMessageEntryGETData): boolean {
    return this.mapEntryIdToAttachments.has(entry.id || '');
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
          this.shouldScrollToBottom = true; // Scroll to bottom after posting new message
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

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  // File upload methods
  openAttachmentModal(): void {
    this.showAttachmentModal = true;
    this.selectedFiles = [];
    this.uploadProgress = 0;
  }

  closeAttachmentModal(): void {
    this.showAttachmentModal = false;
    this.selectedFiles = [];
    this.uploadProgress = 0;
    this.uploading = false;
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      this.selectedFiles = Array.from(files);
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  uploadFiles(): void {
    if (this.selectedFiles.length === 0 || !this.id) return;
    
    this.uploading = true;
    this.uploadProgress = 0;
    
    // Simulate file upload progress
    const uploadInterval = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 100) {
        clearInterval(uploadInterval);
        this.uploading = false;
        this.uploadProgress = 100;
        
        // Show success message for each file
        this.selectedFiles.forEach(file => {
          alert(`File uploaded: ${file.name} (${this.formatFileSize(file.size)})`);
        });
        
        // Close modal and refresh attachments
        this.closeAttachmentModal();
        this.loadAttachments();
      }
    }, 200);
  }
}
