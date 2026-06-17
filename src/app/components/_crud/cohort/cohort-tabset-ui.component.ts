import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CohortUIData, HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { PMessageUiComponent } from '@app/components/_crud/pmessage-ui/pmessage-ui.component';

@Component({
  selector: 'app-cohort-tabset-ui',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, PMessageUiComponent],
  template: `
    <div *ngIf="loading" class="cohort-loading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div *ngIf="error && !loading" class="alert alert-danger" role="alert">
      <i class="fas fa-exclamation-triangle me-2"></i>
      {{ error }}
    </div>

    <div class="cohort-ui" *ngIf="uiData && !loading">
      <div class="cohort-header">
        <div>
          <h2 class="cohort-name">{{ uiData.cohort?.name }}</h2>
          <span class="badge bg-secondary me-2">{{ uiData.cohort?.businessCode }}</span>
          <span class="badge bg-info">{{ uiData.cohort?.currentStateCode }}</span>
        </div>
      </div>

      <app-simple-tabset
        [tabs]="tabs"
        [currentTabId]="currentTabId"
        (tabSelected)="selectTab($event)">
      </app-simple-tabset>

      <div class="cohort-tab-content">
        <div *ngIf="currentTabId === 'details'">
          <dl class="cohort-grid">
            <dt>Description</dt>
            <dd>{{ uiData.cohort?.description || '—' }}</dd>
            <dt>Organization</dt>
            <dd>{{ uiData.cohort?.organization?.entityDisplayName || '—' }}</dd>
            <dt>Date Created</dt>
            <dd>{{ uiData.cohort?.dateCreated?.formattedDate || '—' }}</dd>
          </dl>
        </div>

        <div *ngIf="currentTabId === 'members'">
          <div *ngIf="!uiData.members?.length" class="text-muted">No members yet.</div>
          <ul *ngIf="uiData.members?.length" class="list-group">
            <li *ngFor="let member of uiData.members" class="list-group-item">
              {{ member.entityDisplayName }}
            </li>
          </ul>
        </div>

        <div *ngIf="currentTabId === 'invites'">
          <div *ngIf="!uiData.outstandingInvites?.length" class="text-muted">No outstanding invitations.</div>
          <table *ngIf="uiData.outstandingInvites?.length" class="table table-sm">
            <thead>
              <tr>
                <th>Email</th>
                <th>Status</th>
                <th>Expires</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let invite of uiData.outstandingInvites">
                <td>{{ invite.emailAddress }}</td>
                <td>{{ invite.currentStateCode }}</td>
                <td>{{ invite.dateExpires?.formattedDate || invite.dateExpires?.formattedDateTime }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="currentTabId === 'messages'">
          <app-pmessage-ui *ngIf="getMessageId()" [id]="getMessageId()"></app-pmessage-ui>
          <div *ngIf="!getMessageId()" class="text-muted">No message channel configured.</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cohort-loading {
      display: flex;
      justify-content: center;
      padding: 24px;
    }

    .cohort-header {
      margin-bottom: 1rem;
    }

    .cohort-name {
      margin-bottom: 0.5rem;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .cohort-grid {
      display: grid;
      grid-template-columns: 160px 1fr;
      gap: 0.5rem 1rem;
      margin: 0;
    }

    .cohort-grid dt {
      font-weight: 600;
      margin: 0;
    }

    .cohort-grid dd {
      margin: 0;
    }

    .cohort-tab-content {
      padding-top: 1rem;
    }
  `],
})
export class CohortTabsetUiComponent implements OnChanges {
  private hcclService = inject(HcclService);

  @Input() id = '';

  loading = false;
  error = '';
  uiData: CohortUIData | null = null;
  currentTabId = 'details';

  tabs: SimpleTab[] = [
    new SimpleTab('details', 'Details', '', () => this.selectTab('details'), () => true),
    new SimpleTab('members', 'Members', '', () => this.selectTab('members'), () => true),
    new SimpleTab('invites', 'Invites', '', () => this.selectTab('invites'), () => true),
    new SimpleTab('messages', 'Messages', '', () => this.selectTab('messages'), () => true),
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id']?.currentValue) {
      this.loadCohort();
    }
  }

  selectTab(tabId: string): void {
    this.currentTabId = tabId;
  }

  getMessageId(): string {
    return this.uiData?.cohort?.messageId ?? '';
  }

  reload(): void {
    if (this.id) {
      this.loadCohort();
    }
  }

  private loadCohort(): void {
    this.loading = true;
    this.error = '';
    this.hcclService.loadCohortUIData(this.id).subscribe({
      next: (data) => {
        this.uiData = data;
        this.loading = false;
        const errors = data.messages?.messages?.filter((m) => m.severity === 1) || [];
        if (errors.length) {
          this.error = errors.map((e) => e.message).join(' ');
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to load cohort details.';
      },
    });
  }
}
