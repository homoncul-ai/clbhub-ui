import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import {
  CatalogEntryGETData,
  ExperienceGETData,
  ExperiencePUTData,
  HcclService,
  ParticipantCriteria,
  ParticipantGETData,
} from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { StdBubaComponent } from '@app/components/_global/std-buba/std-buba.component';
import { ParticipantUiModalComponent } from '@app/components/_crud/participant-ui/participant-ui-modal.component';

interface ExperienceEditModel {
  name: string;
  description: string;
  dateStart: string;
  dateEnd: string;
  dateRegistrationStart: string;
  dateRegistrationEnd: string;
}

/**
 * Displays a single Experience.
 *
 * When `readonly` is true (default), it shows the name + dates header and a
 * tabset with Details (catalog entry), Participants, and Materials tabs.
 *
 * When `readonly` is false, it shows an edit interface with Info, Dates,
 * Costs, and Location sections.
 */
@Component({
  selector: 'app-experience-ui',
  standalone: true,
  imports: [CommonModule, FormsModule, SimpleTabsetComponent, StdBubaComponent],
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
      <div class="exp-header">
        <h2 class="exp-name">{{ experience.name }}</h2>
        <div class="exp-dates" *ngIf="getDateRange() as range">
          <i class="fas fa-calendar-alt me-2"></i>{{ range }}
        </div>
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
    <div class="exp-ui exp-edit" *ngIf="experience && !loading && !readonly">
      <div class="exp-header">
        <h2 class="exp-name">{{ editModel.name || experience.name || 'Experience' }}</h2>
      </div>

      <div *ngIf="saveSuccess" class="alert alert-success py-2 mb-3">
        <i class="fas fa-check-circle me-2"></i>Experience saved.
      </div>
      <div *ngIf="saveError" class="alert alert-danger py-2 mb-3">
        <i class="fas fa-exclamation-circle me-2"></i>{{ saveError }}
      </div>

      <!-- Info -->
      <section class="exp-section">
        <h5 class="exp-section-title"><i class="fas fa-circle-info me-2"></i>Info</h5>
        <div class="mb-3">
          <label class="form-label">Name</label>
          <input type="text" class="form-control" [(ngModel)]="editModel.name" />
        </div>
        <div class="mb-3">
          <label class="form-label">Details</label>
          <textarea class="form-control" rows="4" [(ngModel)]="editModel.description"></textarea>
        </div>
      </section>

      <!-- Dates -->
      <section class="exp-section">
        <h5 class="exp-section-title"><i class="fas fa-calendar-alt me-2"></i>Dates</h5>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Start Date</label>
            <input type="date" class="form-control" [(ngModel)]="editModel.dateStart" />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">End Date</label>
            <input type="date" class="form-control" [(ngModel)]="editModel.dateEnd" />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Registration Start</label>
            <input type="date" class="form-control" [(ngModel)]="editModel.dateRegistrationStart" />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Registration End</label>
            <input type="date" class="form-control" [(ngModel)]="editModel.dateRegistrationEnd" />
          </div>
        </div>
      </section>

      <!-- Costs -->
      <section class="exp-section">
        <h5 class="exp-section-title"><i class="fas fa-dollar-sign me-2"></i>Costs</h5>
        <div class="row" *ngIf="catalogEntry; else noCosts">
          <div class="col-md-6 mb-3">
            <label class="form-label">Price</label>
            <div class="form-control-plaintext">
              {{ catalogEntry.entryPrice != null ? (catalogEntry.entryPrice | currency) : '—' }}
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Cost</label>
            <div class="form-control-plaintext">
              {{ catalogEntry.entryCost != null ? (catalogEntry.entryCost | currency) : '—' }}
            </div>
          </div>
        </div>
        <ng-template #noCosts>
          <p class="text-muted mb-0">No cost information available.</p>
        </ng-template>
      </section>

      <!-- Location -->
      <section class="exp-section">
        <h5 class="exp-section-title"><i class="fas fa-location-dot me-2"></i>Location</h5>
        <div *ngIf="catalogEntry && catalogEntry.hcclAddrId; else noLocation">
          <app-std-buba
            entityName="HcclAddr"
            [entityId]="catalogEntry.hcclAddrId || ''"
            [showLink]="false"
            [showName]="true">
          </app-std-buba>
        </div>
        <ng-template #noLocation>
          <p class="text-muted mb-0">No location is set on the catalog entry.</p>
        </ng-template>
      </section>

      <div class="exp-edit-actions">
        <button class="btn btn-primary" (click)="saveExperience()" [disabled]="saving">
          <i *ngIf="saving" class="fas fa-spinner fa-spin me-2"></i>
          <i *ngIf="!saving" class="fas fa-save me-2"></i>
          {{ saving ? 'Saving...' : 'Save Experience' }}
        </button>
      </div>
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

    .exp-section {
      padding: 16px 0;
      border-top: 1px solid #eef0f2;
    }

    .exp-section:first-of-type {
      border-top: none;
    }

    .exp-section-title {
      font-weight: 600;
      margin-bottom: 12px;
    }

    .exp-edit-actions {
      padding-top: 8px;
    }
  `],
})
export class ExperienceUiComponent implements OnChanges {
  @Input() experienceId: string = '';
  @Input() readonly: boolean = true;
  @Input() catalogEntry: CatalogEntryGETData | null = null;

  private hcclService = inject(HcclService);
  private modalService = inject(MdbModalService);

  experience: ExperienceGETData | null = null;
  participants: ParticipantGETData[] = [];
  loading = false;
  error = '';

  currentTabId = 'details';
  tabs: SimpleTab[] = this.buildTabs();

  editModel: ExperienceEditModel = this.emptyEditModel();
  saving = false;
  saveSuccess = false;
  saveError: string | null = null;

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
    this.saveSuccess = false;
    this.saveError = null;

    this.hcclService.getExperienceById(this.experienceId).subscribe({
      next: (experience) => {
        this.experience = experience;
        this.editModel = this.buildEditModel(experience);
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

  private emptyEditModel(): ExperienceEditModel {
    return {
      name: '',
      description: '',
      dateStart: '',
      dateEnd: '',
      dateRegistrationStart: '',
      dateRegistrationEnd: '',
    };
  }

  private buildEditModel(experience: ExperienceGETData): ExperienceEditModel {
    const exp = experience as any;
    return {
      name: experience.name || '',
      description: experience.description || '',
      dateStart: this.toDateInput(exp?.dateStart),
      dateEnd: this.toDateInput(exp?.dateEnd),
      dateRegistrationStart: this.toDateInput(exp?.dateRegistrationStart),
      dateRegistrationEnd: this.toDateInput(exp?.dateRegistrationEnd),
    };
  }

  /** Normalize various date shapes to a yyyy-MM-dd value for <input type="date">. */
  private toDateInput(value: any): string {
    if (!value) {
      return '';
    }
    if (typeof value === 'string') {
      return value.substring(0, 10);
    }
    const iso = value.isoDate || value.isoDateTime || value.formattedDate || '';
    if (typeof iso === 'string' && iso.length >= 10) {
      return iso.substring(0, 10);
    }
    return '';
  }

  saveExperience(): void {
    if (!this.experience || !this.experienceId || this.saving) {
      return;
    }

    this.saving = true;
    this.saveSuccess = false;
    this.saveError = null;

    const exp = this.experience as any;
    const putData: ExperiencePUTData = {
      name: this.editModel.name,
      businessCode: this.experience.businessCode || '',
      description: this.editModel.description,
      available: this.experience.available ?? 1,
      exprienceTypeId: this.experience.exprienceTypeId || '',
      catalogEntryId: this.experience.catalogEntryId,
      currentStateCode: this.experience.currentStateCode || '',
      currentStateTransitionId: this.experience.currentStateTransitionId,
      dateStart: this.editModel.dateStart || undefined,
      dateEnd: this.editModel.dateEnd || undefined,
      dateRegistrationStart: this.editModel.dateRegistrationStart || undefined,
      dateRegistrationEnd: this.editModel.dateRegistrationEnd || undefined,
      maxParticipants: this.experience.maxParticipants,
      minParticipants: this.experience.minParticipants,
      metadataJson: exp?.metadataJson || '',
      indexMd: exp?.indexMd || '',
    };

    this.hcclService.updateExperienceById(this.experienceId, putData).subscribe({
      next: () => {
        this.saving = false;
        this.saveSuccess = true;
        // Reflect saved values back onto the loaded experience.
        if (this.experience) {
          this.experience.name = this.editModel.name;
          this.experience.description = this.editModel.description;
          (this.experience as any).dateStart = this.editModel.dateStart;
          (this.experience as any).dateEnd = this.editModel.dateEnd;
          (this.experience as any).dateRegistrationStart = this.editModel.dateRegistrationStart;
          (this.experience as any).dateRegistrationEnd = this.editModel.dateRegistrationEnd;
        }
      },
      error: (err) => {
        console.error('Failed to save experience:', err);
        this.saving = false;
        this.saveError = 'Unable to save experience.';
      },
    });
  }

  async openCatalogEntry(): Promise<void> {
    if (!this.experience?.catalogEntryId) {
      return;
    }
    // Imported dynamically to avoid a circular dependency:
    // catalogentry-ui -> experience-ui -> (modal) -> catalogentry-ui.
    const { ExperienceCatalogEntryModalComponent } = await import('./experience-catalogentry-modal.component');
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
