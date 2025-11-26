import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentContextService } from '../../shared/student-context.service';
import { PMessageGETData } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-messages-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['../../dash-student2.styles.scss'],
  template: `
    <div class="sd-page">
      <!-- Header -->
      <div class="sd-flex sd-flex--between sd-flex--center sd-mb-6">
        <div>
          <h1 class="sd-page-title">
            <i class="fas fa-envelope icon"></i>
            My Messages
          </h1>
          <p class="sd-page-subtitle">
            Conversations with your guidance team
          </p>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="isLoading()" class="sd-loading">
        <div class="sd-loading__spinner"></div>
        <p class="sd-loading__text">Loading messages...</p>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading() && !messages().length" class="sd-card">
        <div class="sd-empty-state">
          <i class="fas fa-envelope-open sd-empty-state__icon"></i>
          <h3 class="sd-empty-state__title">No messages yet</h3>
          <p class="sd-empty-state__description">
            When you communicate with your guidance team, your conversations will appear here.
          </p>
          <a routerLink="../guidance" class="sd-btn sd-btn--primary sd-btn--lg">
            <i class="fas fa-hands-helping"></i>
            Get Help
          </a>
        </div>
      </div>

      <!-- Messages List -->
      <div *ngIf="!isLoading() && messages().length" class="sd-card">
        <ul class="sd-list">
          <li 
            *ngFor="let msg of messages()" 
            class="sd-list-item sd-list-item--clickable message-item"
            [class.message-item--unread]="hasUnread(msg)"
            [routerLink]="[msg.id]">
            <div class="sd-avatar">
              <i class="fas fa-user"></i>
            </div>
            <div class="sd-list-item__content">
              <div class="sd-flex sd-flex--between">
                <span class="sd-list-item__title">{{ msg.title || 'No Subject' }}</span>
                <span class="sd-text-muted sd-text-sm">
                  {{ studentContext.formatDate(msg.dateCreated) }}
                </span>
              </div>
              <div class="sd-list-item__subtitle">
                {{ truncate(msg.description, 80) }}
              </div>
            </div>
            <div *ngIf="hasUnread(msg)" class="unread-badge">
              {{ msg.unreadMessageCount }}
            </div>
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .message-item {
      padding: 1rem 1.25rem;
    }

    .message-item--unread {
      background: #EFF6FF;
    }

    .message-item--unread .sd-list-item__title {
      font-weight: 700;
    }

    .unread-badge {
      background: #2563EB;
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
      min-width: 24px;
      text-align: center;
    }
  `]
})
export class MessagesListComponent implements OnInit {
  studentContext = inject(StudentContextService);

  messages = signal<PMessageGETData[]>([]);
  isLoading = signal(false);

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.isLoading.set(true);
    this.studentContext.getMessages().subscribe({
      next: (data) => {
        this.messages.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  hasUnread(msg: PMessageGETData): boolean {
    return (msg.unreadMessageCount || 0) > 0;
  }

  truncate(text: string | undefined, maxLength: number): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
}

