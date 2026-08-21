import { Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { HcclService, PMFilePOSTData } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-pmfile-upload-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">
        <i class="fas fa-upload me-2"></i>
        Upload Files
      </h5>
      <button type="button" class="btn-close" (click)="closeModal()" [disabled]="uploading" aria-label="Close"></button>
    </div>
    
    <div class="modal-body">
      <!-- File Input -->
      <div class="mb-3">
        <label class="form-label">Select Files</label>
        <input 
          type="file" 
          class="form-control" 
          multiple
          (change)="onFilesSelected($event)"
          [disabled]="uploading"
          #fileInput>
      </div>

      <!-- Selected Files List -->
      <div *ngIf="selectedFiles.length > 0" class="selected-files-list mb-3">
        <label class="form-label">Files to Upload ({{ selectedFiles.length }})</label>
        <div class="list-group">
          <div *ngFor="let file of selectedFiles; let i = index" class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <i [class]="getFileIcon(file.name)" class="me-2"></i>
              <span>{{ file.name }}</span>
              <small class="text-muted ms-2">({{ formatFileSize(file.size) }})</small>
            </div>
            <button 
              type="button" 
              class="btn btn-sm btn-outline-danger" 
              (click)="removeFile(i)"
              [disabled]="uploading">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Upload Progress -->
      <div *ngIf="uploading" class="mb-3">
        <label class="form-label">Uploading...</label>
        <div class="progress">
          <div 
            class="progress-bar progress-bar-striped progress-bar-animated" 
            role="progressbar" 
            [style.width.%]="uploadProgress"
            [attr.aria-valuenow]="uploadProgress" 
            aria-valuemin="0" 
            aria-valuemax="100">
            {{ uploadProgress }}%
          </div>
        </div>
        <small class="text-muted">Uploading {{ currentFileIndex + 1 }} of {{ selectedFiles.length }}: {{ currentFileName }}</small>
      </div>

      <!-- Error Message -->
      <div *ngIf="error" class="alert alert-danger">
        <i class="fas fa-exclamation-triangle me-2"></i>{{ error }}
      </div>

      <!-- Success Message -->
      <div *ngIf="uploadComplete && !error" class="alert alert-success">
        <i class="fas fa-check-circle me-2"></i>Successfully uploaded {{ uploadedCount }} file(s)!
      </div>
    </div>
    
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="closeModal()" [disabled]="uploading">
        {{ uploadComplete ? 'Close' : 'Cancel' }}
      </button>
      <button 
        type="button" 
        class="btn btn-primary" 
        (click)="uploadFiles()" 
        [disabled]="uploading || selectedFiles.length === 0 || uploadComplete">
        <span *ngIf="uploading">
          <i class="fas fa-spinner fa-spin me-2"></i>Uploading...
        </span>
        <span *ngIf="!uploading">
          <i class="fas fa-upload me-2"></i>Upload {{ selectedFiles.length }} File(s)
        </span>
      </button>
    </div>
  `,
  styles: [`
    .modal-header {
      background-color: #f8f9fa;
      border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    }
    
    .modal-title {
      color: #333;
      font-weight: 600;
    }
    
    .modal-body {
      padding: 1.5rem;
      max-height: 60vh;
      overflow-y: auto;
    }
    
    .modal-footer {
      border-top: 1px solid rgba(0, 0, 0, 0.125);
    }

    .selected-files-list .list-group-item {
      padding: 0.5rem 1rem;
    }

    .progress {
      height: 20px;
    }
  `]
})
export class PmfileUploadModalComponent implements OnInit {
  private hcclService = inject(HcclService);
  
  /** The PMFileGroup ID that files will be uploaded to */
  @Input() pmFileGroupId: string = '';
  
  /** Selected files to upload */
  selectedFiles: File[] = [];
  
  /** Upload state */
  uploading: boolean = false;
  uploadProgress: number = 0;
  currentFileIndex: number = 0;
  currentFileName: string = '';
  uploadComplete: boolean = false;
  uploadedCount: number = 0;
  
  /** Error message */
  error: string | null = null;
  
  constructor(public modalRef: MdbModalRef<PmfileUploadModalComponent>) {}
  
  ngOnInit(): void {
  }

  /**
   * Handle file selection
   */
  onFilesSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      // Add to existing selection
      this.selectedFiles = [...this.selectedFiles, ...Array.from(files) as File[]];
    }
  }

  /**
   * Remove a file from the selection
   */
  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get icon class based on file extension
   */
  getFileIcon(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const iconMap: { [key: string]: string } = {
      'pdf': 'fas fa-file-pdf text-danger',
      'doc': 'fas fa-file-word text-primary',
      'docx': 'fas fa-file-word text-primary',
      'xls': 'fas fa-file-excel text-success',
      'xlsx': 'fas fa-file-excel text-success',
      'ppt': 'fas fa-file-powerpoint text-danger',
      'pptx': 'fas fa-file-powerpoint text-danger',
      'txt': 'fas fa-file-alt text-secondary',
      'md': 'fas fa-file-alt text-secondary',
      'jpg': 'fas fa-file-image text-success',
      'jpeg': 'fas fa-file-image text-success',
      'png': 'fas fa-file-image text-success',
      'gif': 'fas fa-file-image text-success',
      'svg': 'fas fa-file-image text-success',
      'zip': 'fas fa-file-archive text-warning',
      'rar': 'fas fa-file-archive text-warning',
    };
    return iconMap[ext] || 'fas fa-file text-secondary';
  }

  /**
   * Upload all selected files
   */
  async uploadFiles(): Promise<void> {
    if (this.selectedFiles.length === 0 || !this.pmFileGroupId) {
      this.error = 'No files selected or PMFileGroup ID missing';
      return;
    }

    this.uploading = true;
    this.uploadProgress = 0;
    this.error = null;
    this.uploadedCount = 0;

    try {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        const file = this.selectedFiles[i];
        this.currentFileIndex = i;
        this.currentFileName = file.name;

        // Read file as base64
        const base64Content = await this.readFileAsBase64(file);

        const isMarkdown =
          file.name.toLowerCase().endsWith('.md') &&
          !file.name.toLowerCase().endsWith('.md.htm');

        // Markdown must use db_text (same as Create Markdown). db_blob downloads
        // hit a backend NPE on the public dsig URL, so content loads blank.
        const fileAccessCode = isMarkdown ? 'db_text' : 'db_blob';
        const mimeType = isMarkdown
          ? 'text/markdown'
          : (file.type || 'application/octet-stream');

        // Create PMFilePOSTData
        const postData: PMFilePOSTData = {
          downloadAs: file.name,
          folderPath: '/',
          fileAccessCode,
          available: true,
          parentEntityId: this.pmFileGroupId,
          parentEntityType: 'PMFileGroup',
          fileGroupId: this.pmFileGroupId,
          fileBlobBase64: base64Content,
          fileSize: file.size,
          mimeType
        };

        // #region agent log
        fetch('http://127.0.0.1:7439/ingest/cf6584ed-f778-4c37-9144-510549c22bbd',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'a7f2a8'},body:JSON.stringify({sessionId:'a7f2a8',runId:'post-fix-upload',hypothesisId:'H1',location:'pmfile-upload-modal.component.ts:uploadFiles',message:'upload POST about to send',data:{downloadAs:postData.downloadAs,fileAccessCode:postData.fileAccessCode,mimeType:postData.mimeType,fileSize:file.size,base64Len:base64Content?.length??0,browserFileType:file.type||null,isMarkdown},timestamp:Date.now()})}).catch(()=>{});
        // #endregion

        // Upload the file
        const uploadResp = await this.hcclService.createPMFile(postData).toPromise();
        // #region agent log
        fetch('http://127.0.0.1:7439/ingest/cf6584ed-f778-4c37-9144-510549c22bbd',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'a7f2a8'},body:JSON.stringify({sessionId:'a7f2a8',runId:'post-fix-upload',hypothesisId:'H1',location:'pmfile-upload-modal.component.ts:uploadFiles:response',message:'upload createPMFile response',data:{responseId:uploadResp?.id||null,responseStatus:uploadResp?.status||null,downloadAs:file.name,fileAccessCode},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        this.uploadedCount++;

        // Update progress
        this.uploadProgress = Math.round(((i + 1) / this.selectedFiles.length) * 100);
      }

      this.uploadComplete = true;
    } catch (err) {
      console.error('Error uploading files:', err);
      this.error = 'Error uploading files: ' + ((err as Error).message || 'Unknown error');
    } finally {
      this.uploading = false;
    }
  }

  /**
   * Read file as base64 string
   */
  private readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Remove the data URL prefix (e.g., "data:image/png;base64,")
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }
  
  /**
   * Close the modal
   */
  closeModal(): void {
    this.modalRef.close({ uploaded: this.uploadComplete, count: this.uploadedCount });
  }
}

