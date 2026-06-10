import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HcclService, PersonalStatementGETData, PersonalStatementCriteria, PersonalStatementPOSTData } from '@app/restsvc/hccl.service';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { firstValueFrom } from 'rxjs';
import { DategetdataDisplayComponent } from "../../components/_global/dategetdata-display/dategetdata-display.component";
import { AbstractListComponent } from '@app/components/_global';
import { StdMdbFormTextareaComponent } from "../../components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component";
import { StdMdbFormTextComponent } from "../../components/_global/std-mdb-form-text/std-mdb-form-text.component";
import { CareerInterestWizardComponent } from './career-interest-wizard/career-interest-wizard.component';

@Component({
  selector: 'app-dash-student-courses',
  standalone: true,
  imports: [CommonModule, FormsModule, DategetdataDisplayComponent, StdMdbFormTextareaComponent, StdMdbFormTextComponent, CareerInterestWizardComponent],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header d-flex justify-content-end">
              <button class="btn btn-primary btn-sm" (click)="openCreateModal()" title="Create New Pursuit">
                <i class="fas fa-plus me-1"></i>
                New Pursuit
              </button>
            </div>
            <div class="card-body">
              <!-- Loading state -->
              <div *ngIf="loading" class="text-center py-4">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading pursuits...</p>
              </div>

              <!-- Error state -->
              <div *ngIf="listError" class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ listError }}
              </div>

              <!-- Pursuits list -->
              <div *ngIf="!loading && !listError && personalStatements.length > 0" class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th class="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let statement of personalStatements" class="pursuit-row" (click)="openStatementDetails(statement.id!)">
                      <td class="fw-semibold">{{ statement.name || 'Untitled Pursuit' }}</td>
                      <td>
                        <span class="badge" [ngClass]="getStatusClass(statement.status)">
                          {{ getStatusText(statement.status) }}
                        </span>
                      </td>
                      <td class="text-muted">
                        <app-dategetdata-display [data]="statement.dateCreated"></app-dategetdata-display>
                      </td>
                      <td class="text-end" (click)="$event.stopPropagation()">
                        <button type="button" class="btn btn-sm btn-outline-primary me-1"
                          (click)="findMatchingJobs(statement)" title="Search Jobs">Jobs</button>
                        <button type="button" class="btn btn-sm btn-outline-success me-1"
                          (click)="findMatchingCourses(statement)" title="Search Courses">Courses</button>
                        <button type="button" class="btn btn-sm btn-outline-info me-1"
                          (click)="findMatchingEvents(statement)" title="Search Events">Events</button>
                        <button type="button" class="btn btn-sm btn-secondary"
                          (click)="openStatementDetails(statement.id!)" title="View Details">View</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Empty state with wizard prompt -->
              <div *ngIf="!loading && !listError && personalStatements.length === 0" class="text-center py-4">
                <i class="fas fa-compass fa-3x text-primary mb-3"></i>
                <h5>Start a Pursuit</h5>
                <p class="text-muted mb-3">
                  Use the wizard to explore career paths, or click "New Pursuit" to add your interests manually.
                </p>
                <button class="btn btn-primary btn-lg" (click)="openWizard()">
                  <i class="fas fa-magic me-2"></i>
                  Launch Career Wizard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Personal Statement Modal -->
    <div *ngIf="showModal" class="modal fade show" style="display: block;" tabindex="-1" aria-labelledby="createPersonalStatementModalLabel" aria-hidden="false">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createPersonalStatementModalLabel">
              <i class="fas fa-plus me-2"></i>
              Create New Pursuit
            </h5>
            <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div *ngIf="modalError" class="alert alert-danger mb-3" role="alert">
              <i class="fas fa-exclamation-triangle me-2"></i>
              {{ modalError }}
            </div>
            <form #createForm="ngForm" (ngSubmit)="createPersonalStatement(createForm)">
              <!-- Hidden inputs for required fields -->
              <input type="hidden" name="businessCode" [(ngModel)]="newStatement.businessCode">
              <input type="hidden" name="statementTypeCode" [(ngModel)]="newStatement.statementTypeCode">
              <input type="hidden" name="parentEntityId" [(ngModel)]="newStatement.parentEntityId">
              <input type="hidden" name="parentEntityType" [(ngModel)]="newStatement.parentEntityType">
              <input type="hidden" name="parentEntityName" [(ngModel)]="newStatement.parentEntityName">
              <input type="hidden" name="encodingText" [(ngModel)]="newStatement.encodingText">
              <input type="hidden" name="vocationEncodingId" [(ngModel)]="newStatement.vocationEncodingId">
              <input type="hidden" name="status" [(ngModel)]="newStatement.status">
              
              <app-std-mdb-form-text 
                prefix="personalstatement"
                name="name"
                label="Pursuit Name *"
                [required]="true"
                [maxlength]="255"
                [(ngModel)]="newStatement.name">
              </app-std-mdb-form-text>
              <!--
              <div class="mb-3">
                <label for="statementName" class="form-label">Statement Name *</label>
                <input type="text" class="form-control" id="statementName" name="statementName" 
                       [(ngModel)]="newStatement.name" required maxlength="255"
                       placeholder="Enter statement name">
              </div>
              -->
              <!--
              <div class="mb-3">
                <label for="statementDescription" class="form-label">Description</label>
                <textarea class="form-control" id="statementDescription" name="statementDescription" 
                          [(ngModel)]="newStatement.description" rows="3" maxlength="1024"
                          placeholder="Enter statement description"></textarea>
              </div> 
              -->
              <app-std-mdb-form-textarea
                prefix="personalstatement"
                name="rawText"
                label="Describe your professional dreams and goals"
                [required]="true"
                [maxlength]="1024"
                [(ngModel)]="newStatement.rawText">
              </app-std-mdb-form-textarea>
              <!--
              <div class="mb-3">
                <label for="statementRawText" class="form-label">Describe your professional dreams and goals *</label>
                <textarea class="form-control" id="statementRawText" name="statementRawText" 
                          [(ngModel)]="newStatement.rawText" rows="6" required
                          placeholder="Enter your personal statement text"></textarea>
              </div>
              -->
<!--               
              <div class="mb-3">
                <label for="statementTypeCode" class="form-label">Statement Type Code</label>
                <input type="text" class="form-control" id="statementTypeCode" name="statementTypeCode" 
                       [(ngModel)]="newStatement.statementTypeCode" maxlength="50"
                       placeholder="Enter statement type code">
              </div> -->
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
            <button type="button" class="btn btn-primary" (click)="createPersonalStatement(createForm)" 
                    [disabled]="!createForm.valid || creating">
              <span *ngIf="creating" class="spinner-border spinner-border-sm me-2" role="status"></span>
              {{ creating ? 'Creating...' : 'Create Pursuit' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div *ngIf="showModal" class="modal-backdrop fade show"></div>

    <!-- Career Interest Wizard -->
    <app-career-interest-wizard
      *ngIf="showWizard"
      (closed)="closeWizard()"
      (completed)="onWizardComplete()">
    </app-career-interest-wizard>
  `,
  styles: [`
    .pursuit-row {
      cursor: pointer;
    }
  `]
})
export class DashStudentPersonalStatementsComponent implements OnInit {
  personalStatements: PersonalStatementGETData[] = [];
  loading = false;
  listError = '';
  modalError = '';

  // Modal and form properties
  newStatement: Partial<PersonalStatementPOSTData> = {
    name: '',
    description: '',
    rawText: '',
    statementTypeCode: '',
    businessCode: '',
    parentEntityId: '',
    parentEntityType: '',
    parentEntityName: '',
    encodingText: '',
    vocationEncodingId: '',
    status: 0
  };
  creating = false;
  showModal = false;
  showWizard = false;

  constructor(
    private hcclService: HcclService,
    private hcclContextService: HcclContextService,
    private router: Router
  ) {
    console.log('DashStudentCoursesComponent initialized');
  }

  ngOnInit(): void {
    this.loadPersonalStatements();
  }

  loadPersonalStatements(): Promise<void> {
    this.loading = true;
    this.listError = '';

    return this.hcclContextService.waitForReady().then(() => {
      const currentUserId = this.hcclContextService.getCurrentUserProfileId();

      if (!currentUserId) {
        this.listError = 'Unable to determine current user. Please try logging in again.';
        this.loading = false;
        return;
      }

      const criteria: PersonalStatementCriteria = {
        parentEntityId: currentUserId,
        isPaging: false,
        maxResults: 50
      };

      return firstValueFrom(this.hcclService.findPersonalStatements(criteria))
        .then((results) => {
          this.personalStatements = results.searchResults || [];
          this.loading = false;
        })
        .catch((err) => {
          console.error('Error loading personal statements:', err);
          this.listError = this.formatErrorMessage(err, 'Failed to load pursuits. Please try again.');
          this.loading = false;
        });
    }).catch((err) => {
      console.error('Error in loadPersonalStatements:', err);
      this.listError = this.formatErrorMessage(err, 'An unexpected error occurred. Please try again.');
      this.loading = false;
    });
  }

  openStatementDetails(statementId: string): void {
    const url = `/student-dashboard/personalstatements/${statementId}`;
    AbstractListComponent.openUrlInNewTab(url);
  }

  getStatusClass(status?: number): string {
    switch (status) {
      case 1:
        return 'badge-active';
      case 0:
        return 'badge-draft';
      case 2:
        return 'badge-archived';
      default:
        return 'badge-draft';
    }
  }

  getStatusText(status?: number): string {
    //alert(status);
    switch (status) {
      case 2: 
      case 1:
        return 'Active';
      case 0:
        return 'Draft';
      case 200:
        return 'Archived';
      default:
        return 'Unknown';
    }
  }

  findMatchingJobs(statement: PersonalStatementGETData): void {
    if (statement.id) {
      const url = `/student-dashboard/personalstatements/${statement.id}/search?searchType=jobs`;
      AbstractListComponent.openUrlInNewTab(url);
    }
  }

  findMatchingCourses(statement: PersonalStatementGETData): void {
    if (statement.id) {
      const url = `/student-dashboard/personalstatements/${statement.id}/search?searchType=courses`;
      AbstractListComponent.openUrlInNewTab(url);    }
  }

  findMatchingEvents(statement: PersonalStatementGETData): void {
    if (statement.id) {
      const url = `/student-dashboard/personalstatements/${statement.id}/search?searchType=events`;
      AbstractListComponent.openUrlInNewTab(url);
    }
  }

  openWizard(): void {
    this.showWizard = true;
  }

  closeWizard(): void {
    this.showWizard = false;
  }

  onWizardComplete(): void {
    this.showWizard = false;
    this.loadPersonalStatements();
  }

  /**
   * Open the create personal statement modal
   */
  openCreateModal(): void {
    this.modalError = '';
    this.newStatement = {
      name: '',
      description: '',
      rawText: '',
      statementTypeCode: 'student_vocation',
      businessCode: 'autocalc',
      parentEntityId: '',
      parentEntityType: 'HcclUserProfile',
      parentEntityName: 'ParentEntityName',
      encodingText: '',
      vocationEncodingId: '',
      status: 0
    };
    
    // Show modal using Angular
    this.showModal = true;
  }

  /**
   * Close the modal
   */
  closeModal(): void {
    this.showModal = false;
    this.modalError = '';
    this.creating = false;
  }

  private formatErrorMessage(err: unknown, fallback: string): string {
    if (err && typeof err === 'object') {
      const e = err as { message?: string; error?: { message?: string } | string };
      if (typeof e.error === 'string' && e.error.trim()) {
        return e.error;
      }
      if (e.error && typeof e.error === 'object' && e.error.message) {
        return e.error.message;
      }
      if (e.message && e.message.trim()) {
        return e.message;
      }
    }
    return fallback;
  }

  /**
   * Create a new personal statement
   */
  createPersonalStatement(form: NgForm): void {
    if (!form.valid) {
      return;
    }

    this.creating = true;
    this.modalError = '';

    this.hcclContextService.waitForReady().then(() => {
      const currentUserId = this.hcclContextService.getCurrentUserProfileId();

      if (!currentUserId) {
        this.modalError = 'Unable to determine current user. Please try logging in again.';
        this.creating = false;
        return;
      }

      const postData: PersonalStatementPOSTData = {
        name: this.newStatement.name || '',
        businessCode: this.newStatement.businessCode || 'autocalc',
        description: this.newStatement.description || '',
        statementTypeCode: this.newStatement.statementTypeCode || 'student_vocation',
        parentEntityId: currentUserId,
        parentEntityType: this.newStatement.parentEntityType || 'HcclUserProfile',
        parentEntityName: this.newStatement.parentEntityName || 'ParentEntityName',
        rawText: this.newStatement.rawText || '',
        encodingText: this.newStatement.encodingText || '',
        vocationEncodingId: this.newStatement.vocationEncodingId || '',
        status: this.newStatement.status || 0
      };

      this.hcclService.createPersonalStatement(postData).subscribe({
        next: () => {
          this.creating = false;
          this.closeModal();
          this.loadPersonalStatements();
        },
        error: (err) => {
          console.error('Error creating personal statement:', err);
          this.modalError = this.formatErrorMessage(
            err,
            'Failed to create pursuit. Please try again.'
          );
          this.creating = false;
        }
      });
    }).catch((err) => {
      console.error('Error waiting for context:', err);
      this.modalError = this.formatErrorMessage(
        err,
        'Unable to determine current user. Please try logging in again.'
      );
      this.creating = false;
    });
  }
}
