import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { HcclService } from '@app/restsvc/hccl.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-view-resume-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-header text-white">
      <h5 class="modal-title">Resume Preview</h5>
      <span class="fa fa-times cursorPointer" (click)="onClose()"></span>
    </div>

    <div class="modal-body">
      <!-- Loading state -->
      <div *ngIf="isLoading" class="text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Loading resume...</p>
      </div>

      <!-- Error state -->
      <div *ngIf="error && !isLoading" class="alert alert-danger">
        <strong>Error:</strong> {{ error.message || 'Failed to load resume' }}
      </div>

      <!-- Resume content in iframe -->
      <div *ngIf="!isLoading && !error && resumeHtml" class="resume-preview-container">
        <iframe 
          #resumeIframe
          [srcdoc]="resumeHtml" 
          class="resume-iframe"
          frameborder="0"
          title="Resume Preview">
        </iframe>
      </div>
    </div>

    <div class="modal-footer">
      <button 
        *ngIf="!isLoading && !error && resumeHtml"
        type="button" 
        class="btn btn-sm btn-primary me-2" 
        (click)="saveToPdf()"
        [disabled]="isSavingPdf">
        <i class="fas fa-file-pdf me-1"></i>
        <span *ngIf="isSavingPdf">Saving...</span>
        <span *ngIf="!isSavingPdf">Save to PDF</span>
      </button>
      <button type="button" class="btn btn-sm btn-dark" (click)="onClose()">
        Close
      </button>
    </div>
  `,
  styles: [`
    .cursorPointer {
      cursor: pointer;
    }
    .resume-preview-container {
      width: 100%;
      height: 70vh;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      overflow: hidden;
    }
    .resume-iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  `]
})
export class ViewResumeModalComponent implements OnInit {
  resumeId?: string;

  @ViewChild('resumeIframe', { static: false }) resumeIframe!: ElementRef<HTMLIFrameElement>;

  private hcclService = inject(HcclService);
  private sanitizer = inject(DomSanitizer);

  isLoading = false;
  error: any = null;
  resumeHtml: SafeHtml | null = null;
  resumeHtmlContent: string = ''; // Store raw HTML content for PDF generation
  isSavingPdf = false;

  constructor(public modalRef: MdbModalRef<ViewResumeModalComponent>) {}

  ngOnInit(): void {
    if (this.resumeId) {
      this.loadResumeMarkdown();
    }
  }

  protected loadResumeMarkdown(): void {
    this.isLoading = true;
    this.error = null;

    this.hcclService.getFinalMarkdown(this.resumeId!).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        //alert(JSON.stringify(response));
        // Handle different response formats
        let markdownContent = response.finalMd;
        // if (typeof response === 'string') {
        //   markdownContent = response;
        // } else if (response && response.markdown) {
        //   markdownContent = response.markdown;
        // } else if (response && response.html) {
        //   markdownContent = response.html;
        // } else if (response && response.content) {
        //   markdownContent = response.content;
        // } else {
        //   // Try to stringify if it's an object
        //   markdownContent = JSON.stringify(response);
        // }

        // Convert markdown to HTML if needed, or use as-is if already HTML
        // For now, we'll wrap it in a basic HTML structure
        const htmlContent = markdownContent; // this.wrapInHtml(markdownContent);
        this.resumeHtmlContent = htmlContent; // Store raw HTML for PDF generation
        this.resumeHtml = this.sanitizer.bypassSecurityTrustHtml(htmlContent);
      },
      error: (error) => {
        console.error('Error loading resume markdown:', error);
        this.error = error;
        this.isLoading = false;
      }
    });
  }

  protected wrapInHtml(content: string): string {
    // If content already looks like HTML, use it as-is
    if (content.trim().startsWith('<')) {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Resume Preview</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1, h2, h3, h4, h5, h6 {
              margin-top: 1.5em;
              margin-bottom: 0.5em;
            }
            p {
              margin-bottom: 1em;
            }
            ul, ol {
              margin-bottom: 1em;
              padding-left: 2em;
            }
            code {
              background-color: #f4f4f4;
              padding: 2px 4px;
              border-radius: 3px;
            }
            pre {
              background-color: #f4f4f4;
              padding: 10px;
              border-radius: 5px;
              overflow-x: auto;
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
        </html>
      `;
    } else {
      // If it's markdown, we'll display it as preformatted text for now
      // In a real implementation, you might want to use a markdown parser
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Resume Preview</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              white-space: pre-wrap;
            }
          </style>
        </head>
        <body>
          ${this.escapeHtml(content)}
        </body>
        </html>
      `;
    }
  }

  protected escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  onClose(): void {
    this.modalRef.close(false);
  }

  protected saveToPdf(): void {
    if ((!this.resumeHtml && !this.resumeHtmlContent) || !this.resumeId) {
      return;
    }

    this.isSavingPdf = true;

    try {
      // Use stored HTML content if available, otherwise extract from SafeHtml
      let htmlContent = this.resumeHtmlContent;
      
      if (!htmlContent) {
        // Fallback: extract from SafeHtml
        if (typeof this.resumeHtml === 'string') {
          htmlContent = this.resumeHtml;
        } else if (this.resumeHtml && typeof this.resumeHtml === 'object') {
          htmlContent = (this.resumeHtml as any).changingThisBreaksApplicationSecurity || '';
        }
      }

      if (!htmlContent) {
        // Last resort: try to get content from iframe
        if (this.resumeIframe?.nativeElement?.contentDocument?.body) {
          htmlContent = this.resumeIframe.nativeElement.contentDocument.body.innerHTML;
        } else {
          alert('Unable to extract resume content for PDF');
          this.isSavingPdf = false;
          return;
        }
      }

      // Create a new window with the resume content
      const printWindow = window.open('', '_blank');
      
      if (!printWindow) {
        alert('Please allow popups to save the PDF');
        this.isSavingPdf = false;
        return;
      }

      // Write the HTML content to the new window
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Resume - PDF</title>
          <style>
            @media print {
              @page {
                margin: 0.5in;
              }
              body {
                margin: 0;
                padding: 0;
              }
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1, h2, h3, h4, h5, h6 {
              margin-top: 1.5em;
              margin-bottom: 0.5em;
            }
            p {
              margin-bottom: 1em;
            }
            ul, ol {
              margin-bottom: 1em;
              padding-left: 2em;
            }
            code {
              background-color: #f4f4f4;
              padding: 2px 4px;
              border-radius: 3px;
            }
            pre {
              background-color: #f4f4f4;
              padding: 10px;
              border-radius: 5px;
              overflow-x: auto;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `);

      printWindow.document.close();

      // Wait for content to load, then trigger print dialog
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          this.isSavingPdf = false;
          // Close the print window after a short delay
          setTimeout(() => {
            printWindow.close();
          }, 500);
        }, 250);
      };
    } catch (error) {
      console.error('Error saving to PDF:', error);
      alert('Error saving to PDF. Please try again.');
      this.isSavingPdf = false;
    }
  }
}

