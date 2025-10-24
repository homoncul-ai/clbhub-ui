import { PMFileCriteria } from './../../../restsvc/hccl.service';
import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { PMFileGETData, HcclService } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-std-bubfile',
  imports: [CommonModule],
  templateUrl: './std-bubfile.component.html',
  styleUrl: './std-bubfile.component.scss'
})
export class StdBubfileComponent implements OnInit, OnDestroy {
  @Input() entityId: string = '';
  @Input() showIcon: boolean = true;
  @Input() showTooltip: boolean = true;
  @Input() showLink: boolean = true;
  @Input() cssClass: string = '';

  private hcclService = inject(HcclService);
  private destroy$ = new Subject<void>();

  pmFile: PMFileGETData | null = null;
  loading: boolean = false;
  error: string | null = null;
  showPopup: boolean = false;

  ngOnInit(): void {
    if (this.entityId) {
      this.loadPMFile();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load the PMFile data
   */
  private loadPMFile(): void {
    this.loading = true;
    this.error = null;

    const criteria: PMFileCriteria = {
      ids: [this.entityId],
      optionalDataHint: 'all'
    };
    this.hcclService.findPMFiles(criteria)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (pmFileGETDataSearchResults) => {
          this.pmFile = pmFileGETDataSearchResults.searchResults?.[0] || null;
          this.loading = false;
          //alert("loaded pmfile: " + JSON.stringify(this.pmFile));
        },
        error: (error) => {
          this.error = 'Failed to load file data';
          this.loading = false;
          console.error('Error loading PMFile:', error);
        }
      });
  }

  getFileIcon(): string {
    const extension = this.pmFile?.downloadAs?.split('.').pop()?.toLowerCase();
    if (!extension) {
      return '/imgs/fileicons/generic-file.svg';
    }

    const iconMap: { [key: string]: string } = {
      'pdf': '/imgs/fileicons/pdf.svg',
      'doc': '/imgs/fileicons/word.svg',
      'docx': '/imgs/fileicons/word.svg',
      'txt': '/imgs/fileicons/text.svg',
      'rtf': '/imgs/fileicons/text.svg',
      'xls': '/imgs/fileicons/excel.svg',
      'xlsx': '/imgs/fileicons/excel.svg',
      'ppt': '/imgs/fileicons/powerpoint.svg',
      'pptx': '/imgs/fileicons/powerpoint.svg',
      'jpg': '/imgs/fileicons/image.svg',
      'jpeg': '/imgs/fileicons/image.svg',
      'png': '/imgs/fileicons/image.svg',
      'gif': '/imgs/fileicons/image.svg',
      'svg': '/imgs/fileicons/image.svg',
      'mp4': '/imgs/fileicons/video.svg',
      'avi': '/imgs/fileicons/video.svg',
      'mov': '/imgs/fileicons/video.svg',
      'mp3': '/imgs/fileicons/audio.svg',
      'wav': '/imgs/fileicons/audio.svg',
      'zip': '/imgs/fileicons/archive.svg',
      'rar': '/imgs/fileicons/archive.svg',
      '7z': '/imgs/fileicons/archive.svg'
    };

    return iconMap[extension || ''] || '/imgs/fileicons/generic-file.svg';
  }

  /**
   * Get file URL for opening in new tab
   */
  getFileUrl(): string {
    return this.pmFile?.downloadFileUrl || '#';
  }

  /**
   * Handle click on the file link
   */
  onFileClick(event: Event): void {
    const fileUrl = this.getFileUrl();
    alert("clicking on file url: " + JSON.stringify(this.pmFile));
    if (fileUrl && fileUrl !== '#') {
      event.preventDefault();
      window.open(fileUrl, '_blank');
    }
  }

  /**
   * Show popup on icon mouse enter
   */
  onIconMouseEnter(): void {
    if (this.pmFile) {
      this.showPopup = true;
    }
  }

  /**
   * Hide popup on mouse leave
   */
  onIconMouseLeave(): void {
    this.showPopup = false;
  }

  /**
   * Get file properties for popup display
   */
  getFileProperties(): { [key: string]: any } {
    if (!this.pmFile) {
      return {};
    }
    
    const props: { [key: string]: any } = {};
    
    // Add relevant file properties
    if (this.pmFile.downloadAs) props['File Name'] = this.pmFile.downloadAs;
    if (this.pmFile.fileSize) props['File Size'] = this.formatFileSize(this.pmFile.fileSize);
    if (this.pmFile.mimeType) props['MIME Type'] = this.pmFile.mimeType;
    if (this.pmFile.folderPath) props['Folder Path'] = this.pmFile.folderPath;
    if (this.pmFile.fileAccessCode) props['Access Code'] = this.pmFile.fileAccessCode;
    if (this.pmFile.available !== undefined) props['Available'] = this.pmFile.available ? 'Yes' : 'No';
    if (this.pmFile.version) props['Version'] = this.pmFile.version;
    if (this.pmFile.dateCreated) props['Created'] = this.formatDate(this.pmFile.dateCreated);
    if (this.pmFile.dateLastUpdated) props['Last Updated'] = this.formatDate(this.pmFile.dateLastUpdated);
    
    return props;
  }

  /**
   * Format file size in human readable format
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Format date for display
   */
  private formatDate(date: any): string {
    if (!date) return '';
    
    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString();
    } catch {
      return String(date);
    }
  }

  /**
   * Get the CSS classes for the bubfile container
   */
  getBubfileClasses(): string {
    const classes = ['bubfile-container'];
    
    if (this.cssClass) {
      classes.push(this.cssClass);
    }
    
    if (this.loading) {
      classes.push('bubfile-loading');
    }
    
    if (this.error) {
      classes.push('bubfile-error');
    }
    
    return classes.join(' ');
  }
}
