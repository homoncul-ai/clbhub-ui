import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CatalogEntryGETData,
  ExperienceGETData,
  ExperiencePUTData,
  HcclService,
} from '@app/restsvc/hccl.service';
import { StdBubaComponent } from '@app/components/_global/std-buba/std-buba.component';

interface ExperienceEditModel {
  name: string;
  description: string;
  dateStart: string;
  dateEnd: string;
  dateRegistrationStart: string;
  dateRegistrationEnd: string;
}

/**
 * Editable form for a single Experience: Info, Dates, Costs (from the catalog
 * entry) and Location (catalog entry address). Emits `saved` after a
 * successful update. This is a leaf component (no dependency on experience-ui)
 * so it can be hosted both inline and inside the edit modal without cycles.
 */
@Component({
  selector: 'app-experience-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, StdBubaComponent],
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

    <div class="exp-ui exp-edit" *ngIf="experience && !loading">
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
export class ExperienceEditComponent implements OnChanges {
  @Input() experienceId: string = '';
  @Input() catalogEntry: CatalogEntryGETData | null = null;

  @Output() saved = new EventEmitter<void>();

  private hcclService = inject(HcclService);

  experience: ExperienceGETData | null = null;
  loading = false;
  error = '';

  editModel: ExperienceEditModel = this.emptyEditModel();
  saving = false;
  saveSuccess = false;
  saveError: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['experienceId']) {
      this.loadExperience();
    }
  }

  private loadExperience(): void {
    if (!this.experienceId) {
      this.experience = null;
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
      },
      error: (err) => {
        console.error('Failed to load experience:', err);
        this.error = 'Unable to load experience details.';
        this.loading = false;
      },
    });
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

  /**
   * Normalize various date shapes to a yyyy-MM-dd value for <input type="date">.
   * Handles plain ISO strings and the backend DateGETData object
   * (date / formattedDateTime / dateMilliseconds / year+month+dayOfMonth).
   */
  private toDateInput(value: any): string {
    if (!value) {
      return '';
    }

    if (typeof value === 'string') {
      return value.substring(0, 10);
    }

    // Prefer string fields that already begin with an ISO date (no timezone math).
    for (const candidate of [value.date, value.formattedDateTime, value.formattedDate, value.isoDate, value.isoDateTime]) {
      if (typeof candidate === 'string' && /^\d{4}-\d{2}-\d{2}/.test(candidate)) {
        return candidate.substring(0, 10);
      }
    }

    // Explicit calendar components, if provided.
    if (value.year && value.month && value.dayOfMonth) {
      const mm = String(value.month).padStart(2, '0');
      const dd = String(value.dayOfMonth).padStart(2, '0');
      return `${value.year}-${mm}-${dd}`;
    }

    // Epoch milliseconds fallback (use UTC to avoid off-by-one day shifts).
    if (typeof value.dateMilliseconds === 'number') {
      const dt = new Date(value.dateMilliseconds);
      if (!isNaN(dt.getTime())) {
        return dt.toISOString().substring(0, 10);
      }
    }

    return '';
  }

  /**
   * Convert a date-only input value (yyyy-MM-dd) to the datetime format the
   * backend expects (yyyy-MM-dd'T'HH:mm:ss). Returns undefined when empty.
   */
  private toApiDateTime(value: string): string | undefined {
    if (!value) {
      return undefined;
    }
    return value.length === 10 ? `${value}T00:00:00` : value;
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
      dateStart: this.toApiDateTime(this.editModel.dateStart),
      dateEnd: this.toApiDateTime(this.editModel.dateEnd),
      dateRegistrationStart: this.toApiDateTime(this.editModel.dateRegistrationStart),
      dateRegistrationEnd: this.toApiDateTime(this.editModel.dateRegistrationEnd),
      maxParticipants: this.experience.maxParticipants,
      minParticipants: this.experience.minParticipants,
      metadataJson: exp?.metadataJson || '',
      indexMd: exp?.indexMd || '',
    };

    this.hcclService.updateExperienceById(this.experienceId, putData).subscribe({
      next: () => {
        this.saving = false;
        this.saveSuccess = true;
        if (this.experience) {
          this.experience.name = this.editModel.name;
          this.experience.description = this.editModel.description;
          (this.experience as any).dateStart = this.editModel.dateStart;
          (this.experience as any).dateEnd = this.editModel.dateEnd;
          (this.experience as any).dateRegistrationStart = this.editModel.dateRegistrationStart;
          (this.experience as any).dateRegistrationEnd = this.editModel.dateRegistrationEnd;
        }
        this.saved.emit();
      },
      error: (err) => {
        console.error('Failed to save experience:', err);
        this.saving = false;
        this.saveError = 'Unable to save experience.';
      },
    });
  }
}
