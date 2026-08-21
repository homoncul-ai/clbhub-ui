import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { CohortPOSTData, HcclService } from '@app/restsvc/hccl.service';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { GlobalConstants } from '@app/global-constants';

@Component({
  selector: 'app-cohort-create-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MdbFormsModule],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">
        <i class="fas fa-plus-circle me-2"></i>
        Create Cohort
      </h5>
      <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
    </div>

    <div class="modal-body">
      <div *ngIf="error" class="alert alert-danger">{{ error }}</div>

      <div class="mb-3">
        <label class="form-label" for="cohortName">Name</label>
        <input id="cohortName" class="form-control" [(ngModel)]="name" required />
      </div>

      <div class="mb-3">
        <label class="form-label" for="cohortCode">Business Code</label>
        <input id="cohortCode" class="form-control" [(ngModel)]="businessCode" required />
      </div>

      <div class="mb-3">
        <label class="form-label" for="cohortDescription">Description</label>
        <textarea id="cohortDescription" class="form-control" rows="3" [(ngModel)]="description"></textarea>
      </div>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
      <button type="button" class="btn btn-primary" [disabled]="saving" (click)="createCohort()">
        {{ saving ? 'Creating...' : 'Create Cohort' }}
      </button>
    </div>
  `,
  styles: [`
    .modal-header {
      background-color: #f8f9fa;
      border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    }

    .modal-title {
      color: #333;
      font-weight: 600;
    }

    .modal-body {
      padding: 1.5rem;
    }
  `],
})
export class CohortCreateModalComponent {
  private hcclService = inject(HcclService);
  private hcclContextService = inject(HcclContextService);

  name = '';
  businessCode = '';
  description = '';
  saving = false;
  error = '';

  constructor(public modalRef: MdbModalRef<CohortCreateModalComponent>) {}

  createCohort(): void {
    this.error = '';
    if (!this.name.trim() || !this.businessCode.trim()) {
      this.error = 'Name and business code are required.';
      return;
    }

    const context = this.hcclContextService.getContext();
    const postData: CohortPOSTData = {
      name: this.name.trim(),
      businessCode: this.businessCode.trim(),
      description: (this.description || this.name).trim(),
      organizationId: context?.currentUserProfile?.organizationId,
      available: 1,
      teamId: GlobalConstants.UUID_SENTINEL,
      currentStateCode: "initial",
    };

    this.saving = true;
    this.hcclService.createCohort(postData).subscribe({
      next: (response: { id?: string; status?: number }) => {
        this.saving = false;
        const cohortId = response?.id;
        if (!cohortId) {
          this.error = 'Cohort was created but no id was returned.';
          return;
        }
        this.modalRef.close({ created: true, cohortId });
      },
      error: () => {
        this.saving = false;
        this.error = 'Failed to create cohort.';
      },
    });
  }

  closeModal(): void {
    this.modalRef.close({ created: false });
  }
}
