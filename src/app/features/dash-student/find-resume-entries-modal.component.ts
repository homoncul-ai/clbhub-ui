import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { HcclService, ResumeEntryGETData, ResumeEntryPOJO, ResumeAddEntriesPOSTData } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-find-resume-entries-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-header text-white">
      <h5 class="modal-title">Find Resume Entries</h5>
      <span class="fa fa-times cursorPointer" (click)="onCancel()"></span>
    </div>

    <div class="modal-body">
      <div *ngIf="isLoading" class="text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Loading available entries...</p>
      </div>

      <div *ngIf="!isLoading && error" class="alert alert-danger">
        <strong>Error:</strong> {{ error.message || 'Failed to load entries' }}
      </div>

      <div *ngIf="!isLoading && !error">
        <div class="mb-3">
          <p class="text-muted">Select entries to add to your resume. Already selected entries are disabled.</p>
        </div>

        <div class="available-entries-list" style="max-height: 400px; overflow-y: auto;">
          <div 
            *ngFor="let entry of availableEntries" 
            class="entry-item mb-2 p-3 border rounded"
            [class.entry-selected]="isEntrySelected(entry)"
            [class.entry-disabled]="isEntryAlreadyAdded(entry)">
            
            <div class="form-check">
              <input 
                class="form-check-input" 
                type="checkbox" 
                [id]="'entry_' + entry.id"
                [checked]="isEntrySelected(entry)"
                [disabled]="isEntryAlreadyAdded(entry)"
                (change)="toggleEntry(entry)">
              <label class="form-check-label w-100" [for]="'entry_' + entry.id">
                <div>
                  <h6 class="mb-1">{{ entry.title || 'Untitled Entry' }}</h6>
                  <p class="text-muted mb-1" *ngIf="getEntryOrganizationName(entry)">
                    {{ getEntryOrganizationName(entry) }}
                  </p>
                  <p class="text-muted mb-1" *ngIf="getEntryPosition(entry)">
                    {{ getEntryPosition(entry) }}
                  </p>
                  <p class="text-muted small mb-1" *ngIf="getEntryDateStart(entry) || getEntryDateEnd(entry)">
                    <span *ngIf="getEntryDateStart(entry)">{{ formatDate(getEntryDateStart(entry)) }}</span>
                    <span *ngIf="!getEntryDateStart(entry) && getEntryDateEnd(entry)">Start: Unknown</span>
                    <span *ngIf="getEntryDateStart(entry) || getEntryDateEnd(entry)"> - </span>
                    <span *ngIf="getEntryDateEnd(entry)">{{ formatDate(getEntryDateEnd(entry)) }}</span>
                    <span *ngIf="!getEntryDateEnd(entry) && getEntryDateStart(entry)">Present</span>
                  </p>
                  <p class="mb-0 small" *ngIf="getEntryDescription(entry)">{{ getEntryDescription(entry) }}</p>
                </div>
              </label>
            </div>
          </div>

          <div *ngIf="availableEntries.length === 0" class="text-muted text-center py-3">
            No available entries found.
          </div>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-sm btn-primary"
        (click)="onSubmit()"
        [disabled]="selectedEntries.length === 0 || isLoading">
        Add Selected Entries ({{ selectedEntries.length }})
      </button>
      <button type="button" class="btn btn-sm btn-dark" (click)="onCancel()">
        Cancel
      </button>
    </div>
  `,
  styles: [`
    .cursorPointer {
      cursor: pointer;
    }
    .entry-item {
      transition: background-color 0.2s;
    }
    .entry-item:hover {
      background-color: #f8f9fa;
    }
    .entry-selected {
      background-color: #e7f3ff;
      border-color: #0d6efd !important;
    }
    .entry-disabled {
      opacity: 0.5;
      background-color: #f8f9fa;
    }
    .available-entries-list {
      border: 1px solid #dee2e6;
      border-radius: 4px;
      padding: 10px;
    }
  `]
})
export class FindResumeEntriesModalComponent implements OnInit {
  resumeId?: string;
  existingEntryIds: string[] = [];

  private hcclService = inject(HcclService);

  availableEntries: ResumeEntryGETData[] = [];
  selectedEntries: ResumeEntryGETData[] = [];
  isLoading = false;
  error: any = null;

  constructor(public modalRef: MdbModalRef<FindResumeEntriesModalComponent>) {}

  ngOnInit(): void {
    if (this.resumeId) {
      this.loadAvailableEntries();
    }
  }

  protected loadAvailableEntries(): void {
    this.isLoading = true;
    this.error = null;

    this.hcclService.getAvailableEntries(this.resumeId!).subscribe({
      next: (response) => {
        // The API might return entries in entryJson or as an array
        try {
          if (Array.isArray(response)) {
            this.availableEntries = response;
          } else if (response && (response as any).entryJson) {
            // Try parsing entryJson if it exists
            const parsed = JSON.parse((response as any).entryJson);
            if (Array.isArray(parsed)) {
              this.availableEntries = parsed;
            } else {
              this.availableEntries = [response];
            }
          } else if (response) {
            // Single entry or response object
            this.availableEntries = [response];
          } else {
            this.availableEntries = [];
          }
        } catch (parseError) {
          // If parsing fails, treat as single entry or empty
          if (response) {
            this.availableEntries = [response];
          } else {
            this.availableEntries = [];
          }
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading available entries:', error);
        this.error = error;
        this.isLoading = false;
      }
    });
  }

  protected isEntrySelected(entry: ResumeEntryGETData): boolean {
    return this.selectedEntries.some(e => e.id === entry.id);
  }

  protected isEntryAlreadyAdded(entry: ResumeEntryGETData): boolean {
    return this.existingEntryIds.includes(entry.id || '');
  }

  protected toggleEntry(entry: ResumeEntryGETData): void {
    if (this.isEntryAlreadyAdded(entry)) {
      return; // Don't allow selecting already added entries
    }

    const index = this.selectedEntries.findIndex(e => e.id === entry.id);
    if (index >= 0) {
      this.selectedEntries.splice(index, 1);
    } else {
      this.selectedEntries.push(entry);
    }
  }

  onSubmit(): void {
    if (this.selectedEntries.length === 0 || !this.resumeId) {
      return;
    }

    const entryIds = this.selectedEntries
      .map(entry => entry.id)
      .filter((id): id is string => !!id);

    const addEntriesData: ResumeAddEntriesPOSTData = {
      entryIds: entryIds
    };

    this.hcclService.addResumeEntries(this.resumeId, addEntriesData).subscribe({
      next: (updatedResume) => {
        this.modalRef.close({ success: true, resume: updatedResume });
      },
      error: (error) => {
        console.error('Error adding entries:', error);
        this.error = error;
      }
    });
  }

  onCancel(): void {
    this.modalRef.close(false);
  }

  // Helper methods to handle both ResumeEntryGETData and ResumeEntryPOJO
  protected getEntryOrganizationName(entry: ResumeEntryGETData | ResumeEntryPOJO): string | undefined {
    return (entry as any).organizationName;
  }

  protected getEntryPosition(entry: ResumeEntryGETData | ResumeEntryPOJO): string | undefined {
    return (entry as any).position;
  }

  protected getEntryDateStart(entry: ResumeEntryGETData | ResumeEntryPOJO): string | undefined {
    return (entry as any).dateStart;
  }

  protected getEntryDateEnd(entry: ResumeEntryGETData | ResumeEntryPOJO): string | undefined {
    return (entry as any).dateEnd;
  }

  protected getEntryDescription(entry: ResumeEntryGETData | ResumeEntryPOJO): string | undefined {
    return (entry as any).description || (entry as any).resumeText;
  }

  protected formatDate(dateString?: string): string {
    if (!dateString) {
      return '';
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return original string if invalid date
      }
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (error) {
      return dateString; // Return original string if parsing fails
    }
  }
}

