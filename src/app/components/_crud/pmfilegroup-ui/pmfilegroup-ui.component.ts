import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy, OnChanges, SimpleChanges, NgZone, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { HcclService, PMFileGroupGETData, PMFileGETData, DhtmlxTreeNode, PMFilePUTData } from '@app/restsvc/hccl.service';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { PmfileCreateMarkdownModalComponent } from './pmfile-create-markdown-modal.component';
import { PmfileUploadModalComponent } from './pmfile-upload-modal.component';
import { StdMarkdownDisplayComponent } from '@app/components/_global/std-markdown-display/std-markdown-display.component';

declare const dhx: any; // DHTMLX global

@Component({
  selector: 'app-pmfilegroup-ui',
  imports: [CommonModule, FormsModule, StdMarkdownDisplayComponent],
  templateUrl: './pmfilegroup-ui.component.html',
  styleUrl: './pmfilegroup-ui.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PmfilegroupUiComponent implements AfterViewInit, OnDestroy, OnChanges {
  /** Optional: ID to load the PMFileGroup by */
  @Input() id?: string;
  @Input() readonly: boolean = false;

  @ViewChild('treeContainer') treeContainer!: ElementRef;
  @ViewChild('markdownEditor') markdownEditor?: StdMarkdownDisplayComponent;

  /** Optional: Pass the PMFileGroupGETData object directly */
  @Input() data?: PMFileGroupGETData;
  
  private modalService = inject(MdbModalService);
  private http = inject(HttpClient);
 
  pmfilegroup: PMFileGroupGETData | null = null;
  selectedFile: PMFileGETData | null = null;
  selectedFileUrl: SafeResourceUrl | null = null;
  loading = false;
  loadingFile = false;
  error: string | null = null;

  // Markdown editing state
  markdownContent: string = '';
  markdownDirty: boolean = false;
  savingMarkdown: boolean = false;

  private tree: any = null;
  private initialized = false;

  constructor(
    private hcclService: HcclService,
    private sanitizer: DomSanitizer,
    private ngZone: NgZone
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    // If data is provided directly, use it
    if (changes['data'] && this.data) {
      this.pmfilegroup = this.data;
      if (this.initialized && !this.treeInitPending) {
        // Defer tree initialization to next tick to allow Angular to render the DOM
        this.deferredInitializeTree();
      }
    }
    // Otherwise, load by id
    else if (changes['id'] && this.id && !this.data) {
      this.loadPMFileGroup();
    }
  }

  ngAfterViewInit(): void {
    this.initialized = true;
    
    // If data was passed directly and tree not yet initialized, initialize tree
    if (this.data && !this.tree && !this.treeInitPending) {
      this.pmfilegroup = this.data;
      // Defer tree initialization to next tick to allow Angular to render the DOM
      this.deferredInitializeTree();
    }
    // Otherwise load by id
    else if (this.id && !this.data) {
      this.loadPMFileGroup();
    }
  }

  private treeInitPending = false;

  /**
   * Defer tree initialization to allow Angular change detection to complete
   * and render the treeContainer element in the DOM
   */
  private deferredInitializeTree(): void {
    if (this.treeInitPending) return;
    this.treeInitPending = true;
    
    setTimeout(() => {
      this.treeInitPending = false;
      this.initializeTree();
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.tree) {
      this.tree.destructor();
      this.tree = null;
    }
  }

  loadPMFileGroup(): void {
    // Use this.id or fall back to the current pmfilegroup's id
    const fileGroupId = this.id || this.pmfilegroup?.id;
    
    if (!fileGroupId) {
      return;
    }
    
    this.loading = true;
    this.error = null;
    
    // Clear current selection when reloading
    this.selectedFile = null;
    this.selectedFileUrl = null;
    
    this.hcclService.getPMFileGroupById(fileGroupId).subscribe({
      next: (data) => {
        this.pmfilegroup = data;
        this.loading = false;
        // Defer tree initialization to allow Angular to re-render the DOM
        // (the treeContainer is conditionally rendered based on !loading)
        this.deferredInitializeTree();
      },
      error: (err) => {
        this.error = 'Failed to load file group';
        this.loading = false;
        console.error('Error loading PMFileGroup:', err);
      }
    });
  }

  private initializeTree(): void {
    console.log('initializeTree called', {
      hasFileTree: !!this.pmfilegroup?.fileTree,
      hasContainer: !!this.treeContainer?.nativeElement,
      fileTree: this.pmfilegroup?.fileTree
    });

    if (!this.pmfilegroup?.fileTree || !this.treeContainer?.nativeElement) {
      console.warn('Cannot initialize tree - missing fileTree or container');
      return;
    }

    // Destroy existing tree if any
    if (this.tree) {
      this.tree.destructor();
      this.tree = null;
    }

    this.ngZone.runOutsideAngular(() => {
      // Create tree with same config as shell component
      this.tree = new dhx.Tree(this.treeContainer.nativeElement, {
        css: 'dhx_widget--bordered',
        autoWidth: true
      });

      // Transform the tree data to add icons based on type
      const treeData = this.transformTreeData(this.pmfilegroup!.fileTree!);
      console.log('Transformed tree data:', treeData);
      
      this.tree.data.parse([treeData]);

      // Handle item click
      this.tree.events.on('itemClick', (id: string) => {
        this.ngZone.run(() => {
          this.onTreeItemClick(id);
        });
      });

      // Auto-select the first file in the tree
      this.ngZone.run(() => {
        const firstFileId = this.findFirstFileId(this.pmfilegroup!.fileTree!);
        if (firstFileId) {
          this.loadFile(firstFileId);
          // Select the item in the tree
          if (this.tree) {
            this.tree.selection.add(firstFileId);
          }
        }
      });
    });
  }

  /**
   * Find the first file (leaf node) in the tree and return its id
   */
  private findFirstFileId(node: DhtmlxTreeNode): string | null {
    // If this node has no children, it's a file - return its id
    if (!node.items || node.items.length === 0) {
      return node.id || null;
    }
    
    // Otherwise, recursively search children for the first file
    for (const child of node.items) {
      const fileId = this.findFirstFileId(child);
      if (fileId) {
        return fileId;
      }
    }
    
    return null;
  }

  private transformTreeData(node: DhtmlxTreeNode): any {
    // Handle case where value might be in different properties
    const nodeValue = node.value || (node as any).text || (node as any).name || (node as any).title || node.id || 'Unnamed';
    
    const transformedNode: any = {
      id: node.id,
      value: nodeValue,
      opened: node.opened ?? true
    };

    // Set icon based on type
    if (node.type === 'folder' || (node.items && node.items.length > 0)) {
      transformedNode.icon = {
        folder: 'fas fa-folder text-warning',
        openFolder: 'fas fa-folder-open text-warning',
        file: 'fas fa-folder text-warning'
      };
    } else {
      // Determine file icon based on extension
      const extension = nodeValue?.split('.').pop()?.toLowerCase() || '';
      transformedNode.icon = this.getFileIcon(extension);
    }

    // Transform children
    if (node.items && node.items.length > 0) {
      transformedNode.items = node.items.map(child => this.transformTreeData(child));
    }

    return transformedNode;
  }

  private getFileIcon(extension: string): any {
    const iconMap: { [key: string]: string } = {
      'pdf': 'fas fa-file-pdf text-danger',
      'doc': 'fas fa-file-word text-primary',
      'docx': 'fas fa-file-word text-primary',
      'xls': 'fas fa-file-excel text-success',
      'xlsx': 'fas fa-file-excel text-success',
      'ppt': 'fas fa-file-powerpoint text-danger',
      'pptx': 'fas fa-file-powerpoint text-danger',
      'txt': 'fas fa-file-alt text-secondary',
      'html': 'fas fa-file-code text-info',
      'htm': 'fas fa-file-code text-info',
      'css': 'fas fa-file-code text-info',
      'js': 'fas fa-file-code text-warning',
      'ts': 'fas fa-file-code text-primary',
      'json': 'fas fa-file-code text-secondary',
      'xml': 'fas fa-file-code text-secondary',
      'jpg': 'fas fa-file-image text-success',
      'jpeg': 'fas fa-file-image text-success',
      'png': 'fas fa-file-image text-success',
      'gif': 'fas fa-file-image text-success',
      'svg': 'fas fa-file-image text-success',
      'mp3': 'fas fa-file-audio text-info',
      'wav': 'fas fa-file-audio text-info',
      'mp4': 'fas fa-file-video text-danger',
      'avi': 'fas fa-file-video text-danger',
      'mov': 'fas fa-file-video text-danger',
      'zip': 'fas fa-file-archive text-warning',
      'rar': 'fas fa-file-archive text-warning',
      '7z': 'fas fa-file-archive text-warning',
      'md': 'fas fa-file-alt text-secondary'
    };

    const iconClass = iconMap[extension] || 'fas fa-file text-secondary';
    return {
      folder: iconClass,
      openFolder: iconClass,
      file: iconClass
    };
  }

  private onTreeItemClick(nodeId: string): void {
    // Check if this is a file (leaf node) by checking the tree data
    const node = this.findNodeById(this.pmfilegroup?.fileTree, nodeId);
    
    // If node has no children, it's a file - use the node id as pmfileId
    if (node && (!node.items || node.items.length === 0)) {
      this.loadFile(nodeId);
    } else {
      // It's a folder, clear selection
      this.selectedFile = null;
      this.selectedFileUrl = null;
    }
  }

  /**
   * Find a node by id in the tree
   */
  private findNodeById(node: DhtmlxTreeNode | undefined, id: string): DhtmlxTreeNode | null {
    if (!node) return null;
    
    if (node.id === id) {
      return node;
    }
    
    if (node.items) {
      for (const child of node.items) {
        const found = this.findNodeById(child, id);
        if (found) return found;
      }
    }
    
    return null;
  }

  private loadFile(pmfileId: string): void {
    this.loadingFile = true;
    this.markdownContent = '';
    this.markdownDirty = false;
    console.log('Loading file with id:', pmfileId);
    
    this.hcclService.getPMFileById(pmfileId).subscribe({
      next: (file) => {
        this.selectedFile = file;
        
        // Set the iframe URL        
        if (file.downloadFileUrl) {
          this.selectedFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(file.downloadFileUrl);
        } else if (file.downloadInternalFileUrl) {
          this.selectedFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(file.downloadInternalFileUrl);
        } else {
          this.selectedFileUrl = null;
        }

        // If it's a markdown file, fetch the content
        if (this.isMarkdownFile()) {
          this.loadMarkdownContent(file);
        } else {
          this.loadingFile = false;
        }
      },
      error: (err) => {
        console.error('Error loading file:', err);
        this.loadingFile = false;
        this.selectedFile = null;
        this.selectedFileUrl = null;
        this.markdownContent = '';
      }
    });
  }

  /**
   * Check if the selected file is a markdown file (.md or .md.htm)
   */
  isMarkdownFile(): boolean {
    if (!this.selectedFile?.downloadAs) return false;
    const filename = this.selectedFile.downloadAs.toLowerCase();
    return filename.endsWith('.md') || filename.endsWith('.md.htm');
  }

  /**
   * Load markdown content from the file URL
   */
  private loadMarkdownContent(file: PMFileGETData): void {
    const url = file.downloadFileUrl || file.downloadInternalFileUrl;
    if (!url) {
      this.markdownContent = '';
      this.loadingFile = false;
      return;
    }

    this.http.get(url, { responseType: 'text' }).subscribe({
      next: (content) => {
        this.markdownContent = content;
        this.markdownDirty = false;
        this.loadingFile = false;
      },
      error: (err) => {
        console.error('Error loading markdown content:', err);
        this.markdownContent = '';
        this.loadingFile = false;
      }
    });
  }

  /**
   * Mark markdown as dirty when content changes
   */
  onMarkdownEdited(): void {
    this.markdownDirty = true;
  }

  /**
   * Save the markdown file content
   */
  async saveMarkdownFile(): Promise<void> {
    if (!this.selectedFile?.id) {
      return;
    }

    // Get content from the markdown editor component
    const content = this.markdownEditor?.getContent() || this.markdownContent;
    const contentBase64 = btoa(content);

    this.savingMarkdown = true;

    try {
      const putData: PMFilePUTData = {
        downloadAs: this.selectedFile.downloadAs || '',
        folderPath: this.selectedFile.folderPath || '/',
        fileAccessCode: this.selectedFile.fileAccessCode || 'db_text',
        available: this.selectedFile.available,
        parentEntityId: this.selectedFile.parentEntityId || '',
        parentEntityType: this.selectedFile.parentEntityType || 'PMFileGroup',
        mimeType: this.selectedFile.mimeType || 'text/markdown',
        fileBlobBase64: contentBase64,
      };

      await this.hcclService.updatePMFileById(this.selectedFile.id, putData).toPromise();
      this.markdownDirty = false;
      
      // Reload the file to get updated URL/data
      this.loadFile(this.selectedFile.id);
    } catch (err) {
      console.error('Error saving markdown file:', err);
      alert('Error saving file: ' + ((err as Error).message || 'Unknown error'));
    } finally {
      this.savingMarkdown = false;
    }
  }

  getDisplayableInIframe(): boolean {
    if (!this.selectedFile?.mimeType) return false;
    
    const displayableMimeTypes = [
      'text/html',
      'text/plain',
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/gif',
      'image/svg+xml',
      'image/webp',
      'video/mp4',
      'video/webm',
      'audio/mpeg',
      'audio/wav'
    ];
    
    return displayableMimeTypes.some(type => 
      this.selectedFile!.mimeType!.toLowerCase().startsWith(type.split('/')[0]) ||
      this.selectedFile!.mimeType!.toLowerCase() === type
    );
  }

  openInNewTab(): void {
    if (this.selectedFile?.downloadFileUrl) {
      window.open(this.selectedFile.downloadFileUrl, '_blank');
    }
  }

  downloadFile(): void {
    if (this.selectedFile?.downloadFileUrl) {
      const link = document.createElement('a');
      link.href = this.selectedFile.downloadFileUrl;
      link.download = this.selectedFile.downloadAs || 'file';
      link.click();
    }
  }

  /**
   * Open modal to create a new markdown file
   */
  onCreateMarkdownFile(): void {
    if (!this.pmfilegroup?.id) {
      console.error('Cannot create file: PMFileGroup ID is missing');
      return;
    }

    const modalRef = this.modalService.open(PmfileCreateMarkdownModalComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        pmFileGroupId: this.pmfilegroup.id
      }
    });

    modalRef.onClose.subscribe((result: any) => {
      if (result && result.created) {
        // Wait a moment for backend to process, then reload the file group to update the tree
        setTimeout(() => {
          this.loadPMFileGroup();
        }, 50);
      }
    });
  }

  /**
   * Open modal to upload files
   */
  onUploadFiles(): void {
    if (!this.pmfilegroup?.id) {
      console.error('Cannot upload files: PMFileGroup ID is missing');
      return;
    }

    const modalRef = this.modalService.open(PmfileUploadModalComponent, {
      modalClass: 'modal-lg modal-dialog-centered',
      data: {
        pmFileGroupId: this.pmfilegroup.id
      }
    });

    modalRef.onClose.subscribe((result: any) => {
      if (result && result.uploaded) {
        // Wait a moment for backend to process, then reload the file group to update the tree
        setTimeout(() => {
          this.loadPMFileGroup();
        }, 50);
      }
    });
  }

  /**
   * Create a new folder (hidden for now, placeholder for future implementation)
   */
  onCreateFolder(): void {
    // TODO: Implement folder creation functionality
    alert('Create Folder - functionality to be implemented');
  }
}
