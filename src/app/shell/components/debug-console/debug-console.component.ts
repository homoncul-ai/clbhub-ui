import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { DebugLog } from '@app/shell/services/debug-log';

/**
 * A small fixed debug console pinned to the bottom of the screen. Visible only
 * when HcclContextService.debugEnabled is true. Messages are appended via
 * HcclContextService.appendDebug(...) and the view always scrolls to the bottom.
 */
@Component({
  selector: 'app-debug-console',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="debug-console" *ngIf="enabled" [class.collapsed]="collapsed">
      <div class="debug-console-header">
        <span class="debug-console-title">
          <i class="fas fa-bug me-2"></i>Debug
          <span class="debug-console-count">({{ messages.length }})</span>
        </span>
        <span class="debug-console-actions">
          <button type="button" class="debug-btn" (click)="clear()" title="Clear">
            <i class="fas fa-trash"></i>
          </button>
          <button type="button" class="debug-btn" (click)="toggleCollapsed()" [title]="collapsed ? 'Expand' : 'Collapse'">
            <i class="fas" [class.fa-chevron-up]="collapsed" [class.fa-chevron-down]="!collapsed"></i>
          </button>
        </span>
      </div>
      <div #scrollArea class="debug-console-body" *ngIf="!collapsed">
        <div class="debug-line" *ngFor="let line of messages">{{ line }}</div>
      </div>
    </div>
  `,
  styles: [`
    .debug-console {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2147483647;
      background: #1e1e1e;
      color: #d4d4d4;
      border-top: 1px solid #444;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 12px;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.4);
    }

    .debug-console-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 10px;
      background: #252526;
      border-bottom: 1px solid #333;
    }

    .debug-console-title {
      font-weight: 600;
      color: #9cdcfe;
    }

    .debug-console-count {
      color: #808080;
      font-weight: 400;
      margin-left: 4px;
    }

    .debug-console-actions {
      display: flex;
      gap: 6px;
    }

    .debug-btn {
      background: transparent;
      border: none;
      color: #d4d4d4;
      cursor: pointer;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .debug-btn:hover {
      background: #3a3a3a;
    }

    .debug-console-body {
      max-height: 160px;
      overflow-y: auto;
      padding: 6px 10px;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .debug-line {
      line-height: 1.4;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }
  `],
})
export class DebugConsoleComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('scrollArea') scrollArea?: ElementRef<HTMLElement>;

  enabled = DebugLog.enabled;
  collapsed = false;
  messages: string[] = [];

  private sub?: Subscription;
  private shouldScroll = false;

  ngOnInit(): void {
    this.sub = DebugLog.messages$.subscribe((messages) => {
      this.messages = messages;
      this.shouldScroll = true;
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll && this.scrollArea?.nativeElement) {
      const el = this.scrollArea.nativeElement;
      el.scrollTop = el.scrollHeight;
      this.shouldScroll = false;
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  clear(): void {
    DebugLog.clear();
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
    this.shouldScroll = true;
  }
}
