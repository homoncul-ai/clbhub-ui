import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import {
  CatalogEntryGETData,
  ExperienceGETData,
  HcclService,
  ParticipantCriteria,
  ParticipantGETData,
} from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { ExperienceEditComponent } from './experience-edit.component';
import { ExperienceCatalogEntryModalComponent } from './experience-catalogentry-modal.component';
import { ExperienceEditModalComponent } from './experience-edit-modal.component';
import { ParticipantUiModalComponent } from '@app/components/_crud/participant-ui/participant-ui-modal.component';

/**
 * Displays a single Experience.
 *
 * When `readonly` is true (default) it shows the name + dates header and a
 * tabset with Details (catalog entry), Participants and Materials tabs. If
 * `canEdit` is also true, an Edit button opens the editable form in a modal.
 *
 * When `readonly` is false it renders the editable form (app-experience-edit).
 */
@Component({
  selector: 'app-experience-ui',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, ExperienceEditComponent],
  template: `
    <div *ngIf="loading" class="exp-loading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div *ngIf="error && !loading" class="alert alert-danger" role="alert">
      <i class="fas fa-exclamation-triangle me-2"></i>
      {{ error }}
    </div>

    <!-- READ-ONLY VIEW -->
    <div class="exp-ui" *ngIf="experience && !loading && readonly">
      <!-- Header: name + dates -->
      <div class="exp-header d-flex justify-content-between align-items-start">
        <div>
          <h2 class="exp-name">{{ experience.name }}</h2>
          <div class="exp-dates" *ngIf="getDateRange() as range">
            <i class="fas fa-calendar-alt me-2"></i>{{ range }}
          </div>
        </div>
        <button *ngIf="canEdit" type="button" class="btn btn-outline-primary btn-sm" (click)="openEditModal()">
          <i class="fas fa-pen me-2"></i>Edit
        </button>
      </div>

      <!-- Tabset -->
      <app-simple-tabset
        [tabs]="tabs"
        [currentTabId]="currentTabId"
        (tabSelected)="selectTab($event)">
      </app-simple-tabset>

      <div class="exp-tab-content">
        <!-- Details -->
        <div *ngIf="currentTabId === 'details'">
          <p class="text-muted" *ngIf="experience.description">{{ experience.description }}</p>

          <div *ngIf="experience.catalogEntryId; else noCatalogEntry">
            <button class="btn btn-outline-primary" (click)="openCatalogEntry()">
              <i class="fas fa-book me-2"></i>View Catalog Entry
            </button>
          </div>
          <ng-template #noCatalogEntry>
            <p class="text-muted">No catalog entry is associated with this experience.</p>
          </ng-template>
        </div>

        <!-- Participants -->
        <div *ngIf="currentTabId === 'participants'">
          <div *ngIf="participants.length === 0" class="text-muted">No participants yet.</div>
          <table class="table table-hover" *ngIf="participants.length > 0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Business Code</th>
                <th>State</th>
                <th class="text-center">Seq</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of participants" class="exp-participant-row" (click)="openParticipant(p)">
                <td>{{ p.name }}</td>
                <td>{{ p.businessCode || '—' }}</td>
                <td>{{ p.currentStateCode || '—' }}</td>
                <td class="text-center">{{ p.sequenceOrder ?? '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Materials -->
        <div *ngIf="currentTabId === 'materials'">
          <!-- Intentionally empty for now -->
        </div>
      </div>
    </div>

    <!-- EDIT VIEW -->
    <div class="exp-ui exp-edit" *ngIf="!readonly">
      <app-experience-edit
        [experienceId]="experienceId"
        [catalogEntry]="catalogEntry"
        (saved)="saved.emit()">
      </app-experience-edit>
    </div>
  `,
  styles: [`
    .exp-loading {
      display: flex;
      justify-content: center;
      padding: 24px;
    }

    .exp-header {
      margin-bottom: 16px;
    }

    .exp-name {
      margin: 0;
      font-weight: 700;
    }

    .exp-dates {
      color: #6b7280;
      font-size: 0.95rem;
      margin-top: 4px;
    }

    .exp-tab-content {
      padding-top: 16px;
    }

    .exp-participant-row {
      cursor: pointer;
    }
  `],
})
export class ExperienceUiComponent implements OnChanges {
  @Input() experienceId: string = '';
  @Input() readonly: boolean = true;
  @Input() canEdit: boolean = false;
  @Input() catalogEntry: CatalogEntryGETData | null = null;

  @Output() saved = new EventEmitter<void>();

  private hcclService = inject(HcclService);
  private modalService = inject(MdbModalService);

  experience: ExperienceGETData | null = null;
  participants: ParticipantGETData[] = [];
  loading = false;
  error = '';

  currentTabId = 'details';
  tabs: SimpleTab[] = this.buildTabs();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['experienceId']) {
      this.currentTabId = 'details';
      this.loadExperience();
    }
  }

  private buildTabs(): SimpleTab[] {
    return [
      new SimpleTab('details', 'Details', '', () => (this.currentTabId = 'details'), () => true),
      new SimpleTab('participants', 'Participants', '', () => (this.currentTabId = 'participants'), () => true),
      new SimpleTab('materials', 'Materials', '', () => (this.currentTabId = 'materials'), () => true),
    ];
  }

  selectTab(tabId: string): void {
    this.currentTabId = tabId;
  }

  private loadExperience(): void {
    if (!this.experienceId) {
      this.experience = null;
      this.participants = [];
      return;
    }

    this.loading = true;
    this.error = '';

    this.hcclService.getExperienceById(this.experienceId).subscribe({
      next: (experience) => {
        this.experience = experience;
        this.loading = false;
        this.loadParticipants();
      },
      error: (err) => {
        console.error('Failed to load experience:', err);
        this.error = 'Unable to load experience details.';
        this.loading = false;
      },
    });
  }

  private loadParticipants(): void {
    const criteria: ParticipantCriteria = {
      experienceId: this.experienceId,
      pageNumber: 1,
      pageSize: 100,
      isPaging: true,
    };

    this.hcclService.findParticipants(criteria).subscribe({
      next: (response) => {
        this.participants = response?.searchResults || [];
      },
      error: (err) => {
        console.error('Failed to load participants:', err);
        this.participants = [];
      },
    });
  }

  getDateRange(): string {
    const exp = this.experience as any;
    const start = this.formatDate(exp?.dateStart);
    const end = this.formatDate(exp?.dateEnd);
    if (start && end) {
      return `${start} – ${end}`;
    }
    return start || end || '';
  }

  private formatDate(value: any): string {
    if (!value) {
      return '';
    }
    if (typeof value === 'string') {
      return value;
    }
    return value.formattedDate || value.formattedDateTime || '';
  }

  /**
   * Open the editable experience form in a modal. After it closes following a
   * save, reload so the read-only view reflects the changes.
   */
  openEditModal(): void {
    if (!this.experienceId) {
      return;
    }
    const modalRef = this.modalService.open(ExperienceEditModalComponent, {
      modalClass: 'modal-lg',
      data: {
        experienceId: this.experienceId,
        catalogEntry: this.catalogEntry,
        title: this.experience?.name || 'Edit Experience',
      },
    });

    modalRef.onClose.subscribe((result: any) => {
      if (result) {
        this.loadExperience();
      }
    });
  }

  openCatalogEntry(): void {
    if (!this.experience?.catalogEntryId) {
      return;
    }
    this.modalService.open(ExperienceCatalogEntryModalComponent, {
      modalClass: 'modal-xl',
      data: {
        catalogEntryId: this.experience.catalogEntryId,
        title: this.experience.name || 'Catalog Entry Details',
      },
    });
  }

  openParticipant(participant: ParticipantGETData): void {
    if (!participant?.id) {
      return;
    }
    this.modalService.open(ParticipantUiModalComponent, {
      modalClass: 'modal-lg',
      data: {
        participantId: participant.id,
        title: participant.name || 'Participant Details',
      },
    });
  }
}
