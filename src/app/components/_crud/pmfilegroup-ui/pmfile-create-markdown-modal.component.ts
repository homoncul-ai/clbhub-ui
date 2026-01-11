import { Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { HcclService, PMFilePOSTData } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-pmfile-create-markdown-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MdbFormsModule],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">
        <i class="fas fa-file-alt me-2"></i>
        Create Markdown File
      </h5>
      <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
    </div>
    
    <div class="modal-body">
      <div class="mb-3">
        <label class="form-label">File Name <span class="text-danger">*</span></label>
        <div class="input-group">
          <input 
            type="text" 
            class="form-control" 
            [(ngModel)]="fileName"
            placeholder="Enter file name (without extension)"
            [disabled]="creating">
          <span class="input-group-text">.md</span>
        </div>
        <small class="text-muted">The file will be saved with a .md extension</small>
      </div>
      
      <div *ngIf="error" class="alert alert-danger">
        <i class="fas fa-exclamation-triangle me-2"></i>{{ error }}
      </div>
    </div>
    
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="closeModal()" [disabled]="creating">
        Cancel
      </button>
      <button type="button" class="btn btn-primary" (click)="createFile()" [disabled]="creating || !fileName.trim()">
        <span *ngIf="creating">
          <i class="fas fa-spinner fa-spin me-2"></i>Creating...
        </span>
        <span *ngIf="!creating">
          <i class="fas fa-plus me-2"></i>Create File
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
    }
    
    .modal-footer {
      border-top: 1px solid rgba(0, 0, 0, 0.125);
    }
  `]
})
export class PmfileCreateMarkdownModalComponent implements OnInit {
  private hcclService = inject(HcclService);
  
  /** The PMFileGroup ID that this file belongs to */
  @Input() pmFileGroupId: string = '';
  
  /** File name (without extension) */
  fileName: string = '';
  
  /** Creating state */
  creating: boolean = false;
  
  /** Error message */
  error: string | null = null;
  
  constructor(public modalRef: MdbModalRef<PmfileCreateMarkdownModalComponent>) {}
  
  ngOnInit(): void {
  }
  
  /**
   * Create the markdown file
   */
  async createFile(): Promise<void> {
    if (!this.fileName.trim() || !this.pmFileGroupId) {
      this.error = 'File name and PMFileGroup ID are required';
      return;
    }
    
    this.creating = true;
    this.error = null;
    
    try {
      // Build the file name with extension
      const fullFileName = this.fileName.trim().endsWith('.md') 
        ? this.fileName.trim() 
        : `${this.fileName.trim()}.md`;
      
      // Placeholder content for the markdown file
      const placeholderContent = '# Placeholder\n\nThis is a placeholder markdown file.';
      // encode placeholderContent to base64
      const placeholderContentBase64 = btoa(placeholderContent);
      // Build the PMFilePOSTData
      const postData: PMFilePOSTData = {
        downloadAs: fullFileName,
        folderPath: '/',
        fileAccessCode: 'db_text',
        available: true,
        parentEntityId: this.pmFileGroupId,
        parentEntityType: 'PMFileGroup',
        mimeType: 'text/markdown',
        fileBlobBase64: placeholderContentBase64,
        fileGroupId: this.pmFileGroupId,
      };
      
      // Create the file
      const response = await this.hcclService.createPMFile(postData).toPromise();
      
      if (response && response.id) {
        // Close modal and signal success
        this.modalRef.close({ created: true, fileId: response.id, fileName: fullFileName });
      } else {
        this.error = 'Failed to create file: No ID returned';
      }
    } catch (err) {
      console.error('Error creating markdown file:', err);
      this.error = 'Error creating file: ' + ((err as Error).message || 'Unknown error');
    } finally {
      this.creating = false;
    }
  }
  
  /**
   * Close the modal
   */
  closeModal(): void {
    this.modalRef.close({ created: false });
  }
}

