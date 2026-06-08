import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HcclService, ParticipantGETData } from '@app/restsvc/hccl.service';
import { StdBubaComponent } from '@app/components/_global/std-buba/std-buba.component';

/**
 * Displays the details for a single experience Participant.
 */
@Component({
  selector: 'app-participant-ui',
  standalone: true,
  imports: [CommonModule, StdBubaComponent],
  template: `
    <div *ngIf="loading" class="p-ui-loading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div *ngIf="error && !loading" class="alert alert-danger" role="alert">
      <i class="fas fa-exclamation-triangle me-2"></i>
      {{ error }}
    </div>

    <div class="p-ui" *ngIf="participant && !loading">
      <div class="p-ui-header">
        <div class="p-ui-avatar">
          <app-std-buba entityName="HcclUserProfile" [entityId]="participant.userProfileId || ''"
            [showLink]="false" [showName]="true"></app-std-buba>
        </div>
        <h4 class="p-ui-name">{{ participant.name }}</h4>
        <span class="badge bg-secondary" *ngIf="participant.currentStateCode">{{ participant.currentStateCode }}</span>
      </div>

      <dl class="p-ui-grid">
        <dt>Business Code</dt>
        <dd>{{ participant.businessCode || '—' }}</dd>

        <dt>Sequence</dt>
        <dd>{{ participant.sequenceOrder ?? '—' }}</dd>

        <dt>Comments</dt>
        <dd>{{ participant.comments || '—' }}</dd>

        <dt>Created</dt>
        <dd>{{ participant.dateCreated?.formattedDate || '—' }}</dd>
      </dl>
    </div>
  `,
  styles: [`
    .p-ui-loading {
      display: flex;
      justify-content: center;
      padding: 24px;
    }

    .p-ui-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .p-ui-name {
      margin: 0;
      font-weight: 700;
    }

    .p-ui-grid {
      display: grid;
      grid-template-columns: 160px 1fr;
      row-gap: 8px;
      column-gap: 16px;
      margin: 0;

      dt {
        font-weight: 600;
        color: #374151;
      }

      dd {
        margin: 0;
        color: #4b5563;
      }
    }
  `],
})
export class ParticipantUiComponent implements OnChanges {
  @Input() participantId: string = '';

  private hcclService = inject(HcclService);

  participant: ParticipantGETData | null = null;
  loading = false;
  error = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['participantId']) {
      this.loadParticipant();
    }
  }

  private loadParticipant(): void {
    if (!this.participantId) {
      this.participant = null;
      return;
    }

    this.loading = true;
    this.error = '';

    this.hcclService.getParticipantById(this.participantId).subscribe({
      next: (participant) => {
        this.participant = participant;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load participant:', err);
        this.error = 'Unable to load participant details.';
        this.loading = false;
      },
    });
  }
}
