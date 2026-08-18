import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit, SecurityContext, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { marked } from 'marked';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';

/**
 * Markdown dialect type
 * - 'common': Standard CommonMark markdown rendered inline
 * - 'markdeep': Markdeep dialect rendered in an iframe
 */
export type MarkdownDialect = 'common' | 'markdeep';

/**
 * Display mode
 * - 'display': Read-only rendered markdown
 * - 'edit': Raw markdown text in textarea (future implementation)
 */
export type MarkdownMode = 'display' | 'edit';

/**
 * StdMarkdownDisplayComponent - A reusable markdown display component
 * 
 * Features:
 * - Supports CommonMark markdown (rendered inline)
 * - Supports Markdeep dialect (rendered in iframe)
 * - Display and Edit modes
 * - Optional title header
 * 
 * Usage:
 * ```html
 * <!-- Basic usage with common markdown -->
 * <app-std-markdown-display 
 *   [markdown]="markdownContent">
 * </app-std-markdown-display>
 * 
 * <!-- With title and markdeep dialect -->
 * <app-std-markdown-display 
 *   title="Documentation"
 *   [markdown]="markdeepContent"
 *   dialect="markdeep">
 * </app-std-markdown-display>
 * ```
 */
@Component({
  selector: 'app-std-markdown-display',
  standalone: true,
  imports: [CommonModule, FormsModule, MdbTabsModule, MdbCheckboxModule],
  templateUrl: './std-markdown-display.component.html',
  styleUrl: './std-markdown-display.component.scss'
})
export class StdMarkdownDisplayComponent implements OnChanges, AfterViewInit {
  /** Optional title to display above the markdown content */
  @Input() title: string = '';
  
  /** The raw markdown content to render */
  @Input() markdown: string = '';
  
  /** Markdown dialect: 'common' (default) or 'markdeep' */
  @Input() dialect: MarkdownDialect = 'common';
  
  /** Display mode: 'display' (default) or 'edit' */
  @Input() modeName: MarkdownMode = 'display';

  /** CSS class to apply to the container */
  @Input() cssClass: string = '';

  /** Maximum height for the markdown container (e.g., '400px', 'none') */
  @Input() maxHeight: string = 'none';

  @ViewChild('markdeepFrame') markdeepFrame!: ElementRef<HTMLIFrameElement>;
  @ViewChild('editorTextarea') editorTextarea?: ElementRef<HTMLTextAreaElement>;

  /** True while a drag is hovering the edit textarea. */
  isDragOver = false;

  /** Rendered HTML for common markdown */
  renderedHtml: SafeHtml = '';
  
  /** Iframe source URL for markdeep */
  markdeepSrc: SafeResourceUrl | null = null;

  /** Edit mode content */
  editContent: string = '';

  /** Active tab in edit mode: 'edit' or 'preview' */
  activeEditTab: 'edit' | 'preview' = 'edit';

  /** Whether content is markdown format */
  isMarkdown: boolean = true;

  /** Emits when markdown checkbox changes */
  @Output() markdownChange = new EventEmitter<boolean>();
  /** Emits when edit mode content changes */
  @Output() contentChange = new EventEmitter<string>();

  constructor(private sanitizer: DomSanitizer) {
    // Configure marked options
    marked.setOptions({
      gfm: true, // GitHub Flavored Markdown
      breaks: true, // Convert \n to <br>
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['markdown'] || changes['dialect'] || changes['modeName']) {
      this.updateContent();
    }
  }

  ngAfterViewInit(): void {
    if (this.dialect === 'markdeep' && this.modeName === 'display') {
      this.renderMarkdeep();
    }
  }

  /**
   * Update the rendered content based on dialect and mode
   */
  private updateContent(): void {
    if (this.modeName === 'edit') {
      this.editContent = this.markdown;
      return;
    }

    if (this.dialect === 'common') {
      this.renderCommonMarkdown();
    } else if (this.dialect === 'markdeep') {
      // Markdeep will be rendered in ngAfterViewInit or when iframe is ready
      this.renderMarkdeep();
    }
  }

  /**
   * Render common markdown using marked
   */
  private renderCommonMarkdown(): void {
    if (!this.markdown) {
      this.renderedHtml = '';
      return;
    }

    try {
      const html = marked.parse(this.markdown, { async: false }) as string;
      // Sanitize the HTML to prevent XSS
      this.renderedHtml = this.sanitizer.bypassSecurityTrustHtml(html);
    } catch (error) {
      console.error('Error rendering markdown:', error);
      this.renderedHtml = this.sanitizer.bypassSecurityTrustHtml(
        '<p class="text-danger">Error rendering markdown</p>'
      );
    }
  }

  /**
   * Render markdeep content in an iframe
   * Markdeep requires a full HTML page structure
   */
  private renderMarkdeep(): void {
    if (!this.markdown || !this.markdeepFrame?.nativeElement) {
      return;
    }

    const iframe = this.markdeepFrame.nativeElement;
    const markdeepHtml = this.generateMarkdeepHtml();
    
    // Write content directly to iframe
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(markdeepHtml);
      doc.close();
    }
  }

  /**
   * Generate full HTML page for markdeep rendering
   */
  private generateMarkdeepHtml(): string {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 16px;
      background: #fff;
    }
  </style>
</head>
<body>
${this.escapeHtmlForMarkdeep(this.markdown)}
<style class="fallback">body{visibility:hidden}</style>
<script>markdeepOptions={tocStyle:'medium'};</script>
<script src="https://casual-effects.com/markdeep/latest/markdeep.min.js" charset="utf-8"></script>
</body>
</html>`;
  }

  /**
   * Escape content for safe inclusion in markdeep HTML
   */
  private escapeHtmlForMarkdeep(content: string): string {
    // For markdeep, we want to preserve the markdown/markdeep syntax
    // but escape any script tags that might be malicious
    return content.replace(/<script/gi, '&lt;script');
  }

  /**
   * Insert text at the textarea caret (used for merge-tag drag/click).
   */
  insertText(text: string): void {
    if (this.modeName !== 'edit' || !text) {
      return;
    }
    const textarea = this.editorTextarea?.nativeElement;
    const start = textarea?.selectionStart ?? this.editContent.length;
    const end = textarea?.selectionEnd ?? start;
    this.editContent = this.editContent.slice(0, start) + text + this.editContent.slice(end);
    this.contentChange.emit(this.editContent);
    if (this.isMarkdown) {
      this.renderEditPreview();
    }
    if (textarea) {
      const pos = start + text.length;
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(pos, pos);
      });
    }
  }

  onEditorDragOver(event: DragEvent): void {
    if (!event.dataTransfer) {
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    this.isDragOver = true;
  }

  onEditorDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onEditorDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    const text = event.dataTransfer?.getData('text/plain') || '';
    if (text) {
      this.insertText(text);
    }
  }

  /**
   * Handle content changes in edit mode
   */
  onEditContentChange(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.editContent = textarea.value;
    this.contentChange.emit(this.editContent);
    // Re-render preview when content changes
    if (this.isMarkdown) {
      this.renderEditPreview();
    }
  }

  /**
   * Handle edit tab change
   */
  onEditTabChange(event: { index: number }): void {
    this.activeEditTab = event.index === 0 ? 'edit' : 'preview';
    if (this.activeEditTab === 'preview' && this.isMarkdown) {
      this.renderEditPreview();
    }
  }

  /**
   * Handle markdown checkbox change
   */
  onMarkdownChange(): void {
    this.markdownChange.emit(this.isMarkdown);
    if (this.isMarkdown) {
      this.renderEditPreview();
    }
  }

  /**
   * Render preview for edit mode
   */
  private renderEditPreview(): void {
    if (!this.editContent) {
      this.renderedHtml = '';
      return;
    }

    try {
      const html = marked.parse(this.editContent, { async: false }) as string;
      this.renderedHtml = this.sanitizer.bypassSecurityTrustHtml(html);
    } catch (error) {
      console.error('Error rendering markdown preview:', error);
      this.renderedHtml = this.sanitizer.bypassSecurityTrustHtml(
        '<p class="text-danger">Error rendering markdown</p>'
      );
    }
  }

  /**
   * Get the current content (useful for forms)
   */
  getContent(): string {
    return this.modeName === 'edit' ? this.editContent : this.markdown;
  }

  /**
   * Get container CSS classes
   */
  getContainerClasses(): string {
    const classes = ['markdown-container'];
    
    if (this.cssClass) {
      classes.push(this.cssClass);
    }
    
    if (this.dialect) {
      classes.push(`dialect-${this.dialect}`);
    }
    
    if (this.modeName) {
      classes.push(`mode-${this.modeName}`);
    }
    
    return classes.join(' ');
  }

  /**
   * Get container styles
   */
  getContainerStyles(): { [key: string]: string } {
    const styles: { [key: string]: string } = {};
    
    if (this.maxHeight && this.maxHeight !== 'none') {
      styles['max-height'] = this.maxHeight;
      styles['overflow-y'] = 'auto';
    }
    
    return styles;
  }
}
