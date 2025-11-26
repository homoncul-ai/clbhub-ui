import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StudentContextService } from '../../shared/student-context.service';
import { PMessageGETData } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-message-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['../../dash-student2.styles.scss'],
  template: `
    <div class="sd-page">
      <!-- Breadcrumb -->
      <nav class="sd-breadcrumb">
        <a routerLink="../" class="sd-breadcrumb__link">Messages</a>
        <span class="sd-breadcrumb__separator">/</span>
        <span class="sd-breadcrumb__current">{{ message()?.title || 'Message' }}</span>
      </nav>

      <!-- Loading -->
      <div *ngIf="isLoading()" class="sd-loading">
        <div class="sd-loading__spinner"></div>
        <p class="sd-loading__text">Loading message...</p>
      </div>

      <!-- Error -->
      <div *ngIf="error() && !isLoading()" class="sd-alert sd-alert--error">
        <i class="fas fa-exclamation-circle sd-alert__icon"></i>
        <div class="sd-alert__content">
          <div class="sd-alert__message">{{ error() }}</div>
        </div>
      </div>

      <!-- Content -->
      <div *ngIf="message() && !isLoading()">
        <div class="sd-card">
          <div class="sd-card-header">
            <div class="sd-card-header__title">
              {{ message()?.title || 'No Subject' }}
            </div>
            <span class="sd-text-muted sd-text-sm">
              {{ studentContext.formatDate(message()?.dateCreated) }}
            </span>
          </div>
          <div class="sd-card-body">
            <!-- Participants -->
            <div class="participants sd-mb-6" *ngIf="message()?.participants?.length">
              <span class="sd-label">Participants:</span>
              <span class="sd-value">
                {{ getParticipantNames() }}
              </span>
            </div>

            <!-- Message Content -->
            <div class="message-content">
              <p>{{ message()?.description || 'No content.' }}</p>
            </div>

            <!-- Placeholder for message thread -->
            <div class="sd-alert sd-alert--info sd-mt-6">
              <i class="fas fa-info-circle sd-alert__icon"></i>
              <div class="sd-alert__content">
                <div class="sd-alert__message">
                  Full message thread and reply functionality coming soon.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .participants {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .message-content {
      font-size: 1rem;
      line-height: 1.75;
      color: #374151;
    }
  `]
})
export class MessageDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  studentContext = inject(StudentContextService);

  message = signal<PMessageGETData | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMessage(id);
    }
  }

  loadMessage(id: string) {
    this.isLoading.set(true);
    this.error.set(null);

    this.studentContext.getMessageById(id).subscribe({
      next: (data) => {
        if (data) {
          this.message.set(data);
        } else {
          this.error.set('Message not found');
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load message');
        this.isLoading.set(false);
      }
    });
  }

  getParticipantNames(): string {
    const participants = this.message()?.participants || [];
    return participants.map(p => p.userProfileId || 'Unknown').join(', ');
  }
}

