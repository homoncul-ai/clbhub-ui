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
  PMessageParticipantCriteria,
  PMFilePOSTData
} from '../../../restsvc/hccl.service';
import { SimpleTabsetComponent, SimpleTab } from '../../_global/simple-tabset/simple-tabset.component';
import { HcclUserProfileDetailsComponent } from '../../hccl-user-profile-details/hccl-user-profile-details.component';
import { StdMdbFormTextareaComponent } from '../../_global/std-mdb-form-textarea/std-mdb-form-textarea.component';
import { Subject, takeUntil } from 'rxjs';
import { StdBubfileComponent } from '@app/components/_global/std-bubfile/std-bubfile.component';

@Component({
  selector: 'app-pmessage-ui',
  standalone: true,
  imports: [CommonModule, FormsModule, SimpleTabsetComponent, 
    HcclUserProfileDetailsComponent, StdMdbFormTextareaComponent, StdBubfileComponent],
  templateUrl: './pmessage-ui.component.html',
  styleUrl: './pmessage-ui.component.scss'
})
export class PMessageUiComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() id!: string;
  @Input() readonly: boolean = false;
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInputSection') messageInputSection!: ElementRef;

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
  uploadedAttachments: PMFilePOSTData[] = [];
  
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
      this.createTab('messages', 'Conversation', '', () => this.showMessagesTab(), () => true),
      this.createTab('attachments', 'Attachments', '', () => this.showAttachmentsTab(), () => true),
      this.createTab('participants', 'About', '', () => this.showParticipantsTab(), () => true)
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
          this.loadAttachments();
          this.loadParticipants();
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
          // Also scroll to message input after a short delay to ensure DOM is updated
          setTimeout(() => this.scrollToMessageInput(), 100);
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
          // Clear the map before repopulating to avoid duplicates
          this.mapEntryIdToAttachments.clear();
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
      bodyFormatCode: 'PLAINTEXT',
      attachments: this.uploadedAttachments.length > 0 ? this.uploadedAttachments : undefined
    };
    
    this.hcclService.createPMessageEntry(newEntry)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.newMessageText = '';
          this.postingMessage = false;
          this.uploadedAttachments = []; // Clear uploaded attachments after posting
          this.loadMessageEntries(); // Refresh messages
          this.shouldScrollToBottom = true; // Scroll to bottom after posting new message
          // Scroll to message input after posting
          setTimeout(() => this.scrollToMessageInput(), 200);
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
   // alert('entry ' + entry.messageParticipantId + ' participant count : ' + this.participants.length);
    if (entry.authorUserProfileId) {
     // alert('participant count : ' + this.participants.length);
      const participant = this.participants.find(p => p.userProfileId === entry.authorUserProfileId);
      return participant?.userProfile?.messageHandle || '';
    }
    return 'Unknown User';
  }

  getParticipantUserProfileId(participant: PMessageParticipantGETData): string {
    // Extract user profile ID from participant data
    // This might need adjustment based on actual data structure
    return participant.userProfileId || '';
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  private scrollToMessageInput(): void {
    if (this.messageInputSection) {
      this.messageInputSection.nativeElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
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
    // Note: uploadedAttachments array is preserved for the next message post
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

  generateMD5Hash(input: string): string {
    // Simple hash function for demo purposes
    // In production, you'd want to use a proper MD5 library
    let hash = 0;
    if (input.length === 0) return hash.toString();
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }

  uploadFiles(): void {
    if (this.selectedFiles.length === 0 || !this.id) return;
    
    this.uploading = true;
    this.uploadProgress = 0;
    
    // Process files asynchronously
    this.processFilesAsync();
  }

  private async processFilesAsync(): Promise<void> {
    try {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        const file = this.selectedFiles[i];
        
        // Read file content as ArrayBuffer
        const arrayBuffer = await this.readFileAsArrayBuffer(file);
        
        // Convert ArrayBuffer to Base64 string for JSON transmission
        const base64String = await this.arrayBufferToBase64(arrayBuffer);
        
        // Create PMFilePOSTData entry
        const pmFileData: PMFilePOSTData = {
          downloadAs: file.name,
          folderPath: '/pmessage-attachments',
          fileAccessCode: 'PUBLIC',
          available: true,
          parentEntityId: this.id!,
          parentEntityName: this.pmessage?.title || 'Message Thread',
          parentEntityType: 'PMESSAGE',
          fileBlobBase64: base64String, // Base64 encoded string that Java can decode to byte[]
          md5Hash: this.generateMD5Hash(file.name + file.size),
          fileSize: file.size,
          mimeType: file.type || 'application/octet-stream'
        };

        console.log(`File prepared: ${file.name}, Size: ${file.size}, Base64 length: ${base64String.length}`);

        this.uploadedAttachments.push(pmFileData);
        console.log(`File prepared for upload: ${file.name} (${this.formatFileSize(file.size)})`);
        
        // Update progress
        this.uploadProgress = Math.round(((i + 1) / this.selectedFiles.length) * 100);
      }
      
      this.uploading = false;
      
      // Show success message
      alert(`${this.selectedFiles.length} file(s) prepared for attachment to message`);
      
      // Close modal
      this.closeAttachmentModal();
      
    } catch (error) {
      console.error('Error processing files:', error);
      this.error = 'Failed to process files: ' + (error as Error).message;
      this.uploading = false;
    }
  }

  private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }

  private arrayBufferToBase64(arrayBuffer: ArrayBuffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1]; // Remove data:application/octet-stream;base64, prefix
        resolve(base64);
      };
      reader.onerror = () => reject(reader.error);
      
      // Create a Blob from ArrayBuffer and read as DataURL
      const blob = new Blob([arrayBuffer]);
      reader.readAsDataURL(blob);
    });
  }

  clearUploadedAttachments(): void {
    this.uploadedAttachments = [];
  }
}
