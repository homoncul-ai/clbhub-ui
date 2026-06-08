import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { CatalogEntryGETData, ExperiencePOSTData, HcclService } from '@app/restsvc/hccl.service';

/** Sentinel "empty" UUID used for the experience type until a real one is chosen. */
const EXPERIENCE_TYPE_SENTINEL = '00000000-0000-0000-0000-000000000000';

interface ExperienceCreateModel {
  name: string;
  businessCode: string;
  description: string;
  dateStart: string;
  dateEnd: string;
  dateRegistrationStart: string;
  dateRegistrationEnd: string;
}

/**
 * Modal used to add a new Experience for a catalog entry. The form is
 * pre-filled from the catalog entry; on create it calls createExperience and
 * closes with the created result so the caller can refresh its list.
 */
@Component({
  selector: 'app-experience-create-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-header">
      <h5 class="modal-title"><i class="fas fa-compass me-2"></i>{{ title }}</h5>
      <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
    </div>

    <div class="modal-body">
      <div *ngIf="error" class="alert alert-danger py-2">
        <i class="fas fa-exclamation-circle me-2"></i>{{ error }}
      </div>

      <div class="mb-3">
        <label class="form-label">Name</label>
        <input type="text" class="form-control" [(ngModel)]="model.name" />
      </div>

      <div class="mb-3">
        <label class="form-label">Business Code</label>
        <input type="text" class="form-control" [(ngModel)]="model.businessCode" />
      </div>

      <div class="mb-3">
        <label class="form-label">Details</label>
        <textarea class="form-control" rows="4" [(ngModel)]="model.description"></textarea>
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Start Date</label>
          <input type="date" class="form-control" [(ngModel)]="model.dateStart" />
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">End Date</label>
          <input type="date" class="form-control" [(ngModel)]="model.dateEnd" />
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Registration Start</label>
          <input type="date" class="form-control" [(ngModel)]="model.dateRegistrationStart" />
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">Registration End</label>
          <input type="date" class="form-control" [(ngModel)]="model.dateRegistrationEnd" />
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="closeModal()" [disabled]="saving">Cancel</button>
      <button type="button" class="btn btn-primary" (click)="create()" [disabled]="saving || !model.name">
        <i *ngIf="saving" class="fas fa-spinner fa-spin me-2"></i>
        <i *ngIf="!saving" class="fas fa-plus me-2"></i>
        {{ saving ? 'Creating...' : 'Create Experience' }}
      </button>
    </div>
  `,
})
export class ExperienceCreateModalComponent implements OnInit {
  title: string = 'Add Experience';
  catalogEntry: CatalogEntryGETData | null = null;
  catalogEntryId: string = '';

  model: ExperienceCreateModel = {
    name: '',
    businessCode: '',
    description: '',
    dateStart: '',
    dateEnd: '',
    dateRegistrationStart: '',
    dateRegistrationEnd: '',
  };
  saving = false;
  error: string | null = null;

  private hcclService = inject(HcclService);

  constructor(public modalRef: MdbModalRef<ExperienceCreateModalComponent>) {}

  ngOnInit(): void {
    const data = (this.modalRef as any).data;
    if (data) {
      this.catalogEntry = data.catalogEntry || null;
      this.catalogEntryId = data.catalogEntryId || this.catalogEntry?.id || '';
      this.title = data.title || this.title;
    }

    // Pre-fill the form from the catalog entry.
    if (this.catalogEntry) {
      this.model.name = this.catalogEntry.title || '';
      this.model.businessCode = this.catalogEntry.entryCode || '';
      this.model.description = this.catalogEntry.description || this.catalogEntry.shortDescription || '';
    }
  }

  create(): void {
    if (this.saving) {
      return;
    }
    this.saving = true;
    this.error = null;

    const body: ExperiencePOSTData = {
      name: this.model.name,
      businessCode: this.model.businessCode,
      description: this.model.description,
      available: 1,
      exprienceTypeId: EXPERIENCE_TYPE_SENTINEL,
      catalogEntryId: this.catalogEntryId || undefined,
      currentStateCode: 'initial',
      dateStart: this.toApiDateTime(this.model.dateStart),
      dateEnd: this.toApiDateTime(this.model.dateEnd),
      dateRegistrationStart: this.toApiDateTime(this.model.dateRegistrationStart),
      dateRegistrationEnd: this.toApiDateTime(this.model.dateRegistrationEnd),
      metadataJson: '',
      indexMd: '',
    };

    this.hcclService.createExperience(body).subscribe({
      next: (res) => {
        this.saving = false;
        this.modalRef.close(res || true);
      },
      error: (err) => {
        console.error('Failed to create experience:', err);
        this.saving = false;
        this.error = 'Unable to create experience.';
      },
    });
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

  closeModal(): void {
    this.modalRef.close();
  }
}
