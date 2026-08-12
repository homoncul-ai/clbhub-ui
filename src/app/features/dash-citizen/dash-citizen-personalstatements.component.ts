import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HcclService, PersonalStatementGETData, PersonalStatementCriteria, PersonalStatementPOSTData, PersonalStatementPUTData, CatalogEntryCriteria } from '@app/restsvc/hccl.service';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { MenuService } from '@app/shell/services/menu.service';
import { firstValueFrom } from 'rxjs';
import { DategetdataDisplayComponent } from "../../components/_global/dategetdata-display/dategetdata-display.component";
import { AbstractListComponent } from '@app/components/_global';
import { StdMdbFormTextareaComponent } from "../../components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component";
import { StdMdbFormTextComponent } from "../../components/_global/std-mdb-form-text/std-mdb-form-text.component";
import { CareerInterestWizardComponent } from './career-interest-wizard/career-interest-wizard.component';
import {
  CatalogEntryCriteriaResolver,
  PURSUIT_RESEARCH_SECTIONS,
  CitizenResearchComponent
} from './citizen-research/citizen-research.component';

@Component({
  selector: 'app-dash-citizen-courses',
  standalone: true,
  imports: [CommonModule, FormsModule, DategetdataDisplayComponent, StdMdbFormTextareaComponent, StdMdbFormTextComponent, CareerInterestWizardComponent, CitizenResearchComponent],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
              <button type="button" class="btn btn-outline-secondary btn-sm" (click)="toggleShowAll()">
                {{ showAllPursuits ? 'Show Active' : 'Show All' }}
              </button>
              <div class="d-flex gap-2">
              <button type="button" class="btn btn-outline-primary btn-sm" (click)="openWizard()" title="Open Career Wizard">
                <i class="fas fa-compass me-1"></i>
                Choose Pursuit
              </button>
              <button type="button" class="btn btn-primary btn-sm" (click)="openCreateModal()" title="Create New Pursuit">
                <i class="fas fa-plus me-1"></i>
                New Pursuit
              </button>
              </div>
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
                    <tr *ngFor="let statement of personalStatements"
                      class="pursuit-row"
                      [class.table-active]="selectedPursuit?.id === statement.id"
                      (click)="explorePursuit(statement)">
                      <td>
                        <div class="fw-semibold">{{ statement.name || 'Untitled Pursuit' }}</div>
                        <div class="text-muted small" *ngIf="isHidden(statement)">hidden</div>
                      </td>
                      <td>
                        <span class="badge" [ngClass]="getStatusClass(statement.status)">
                          {{ getStatusText(statement.status) }}
                        </span>
                      </td>
                      <td class="text-muted">
                        <app-dategetdata-display [data]="statement.dateCreated"></app-dategetdata-display>
                      </td>
                      <td class="text-end" (click)="$event.stopPropagation()">
                        <button type="button" class="btn btn-sm btn-outline-secondary me-1"
                          (click)="openEditModal(statement)" title="Edit pursuit">
                          Edit
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-warning me-1"
                          (click)="togglePursuitVisibility(statement)"
                          [disabled]="visibilityUpdatingId === statement.id"
                          [title]="isHidden(statement) ? 'Show pursuit' : 'Hide pursuit'">
                          {{ isHidden(statement) ? 'Show' : 'Hide' }}
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-primary me-1"
                          (click)="explorePursuit(statement)" title="Search opportunities">
                          <i class="fas fa-search"></i>
                        </button>
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
                  Use the Career Wizard to explore career paths, or click "New Pursuit" to add your interests manually.
                </p>
                <button type="button" class="btn btn-primary btn-lg" (click)="openWizard()">
                  <i class="fas fa-compass me-2"></i>
                  Choose Pursuit
                </button>
              </div>
            </div>
          </div>

          <!-- Pursuit research (jobs / courses / careers) -->
          <div #researchPanel class="mt-4" *ngIf="showResearchPanel && selectedPursuit">
            <app-citizen-research
              #researchComponent
              [sections]="pursuitResearchSections"
              [accordionTitle]="researchAccordionTitle"
              [vocationEncodingId]="selectedPursuit.vocationEncodingId ?? null"
              [criteriaResolver]="pursuitCriteriaResolver">
            </app-citizen-research>
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

    <!-- Edit Pursuit Modal -->
    <div *ngIf="showEditModal" class="modal fade show" style="display: block;" tabindex="-1" aria-labelledby="editPersonalStatementModalLabel" aria-hidden="false">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editPersonalStatementModalLabel">
              <i class="fas fa-edit me-2"></i>
              Edit Pursuit
            </h5>
            <button type="button" class="btn-close" (click)="closeEditModal()" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div *ngIf="editModalError" class="alert alert-danger mb-3" role="alert">
              <i class="fas fa-exclamation-triangle me-2"></i>
              {{ editModalError }}
            </div>
            <form #editForm="ngForm">
              <app-std-mdb-form-text
                prefix="personalstatement"
                name="editName"
                label="Pursuit Name *"
                [required]="true"
                [maxlength]="255"
                [(ngModel)]="editStatement.name">
              </app-std-mdb-form-text>
              <app-std-mdb-form-textarea
                prefix="personalstatement"
                name="editRawText"
                label="Describe your professional dreams and goals"
                [required]="true"
                [maxlength]="1024"
                [(ngModel)]="editStatement.rawText">
              </app-std-mdb-form-textarea>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="closeEditModal()">Cancel</button>
            <button type="button" class="btn btn-primary" (click)="saveEditPursuit(editForm)"
                    [disabled]="!editForm.valid || editing">
              <span *ngIf="editing" class="spinner-border spinner-border-sm me-2" role="status"></span>
              {{ editing ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div *ngIf="showEditModal" class="modal-backdrop fade show"></div>

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
    .pursuit-row.table-active {
      --bs-table-bg: rgba(58, 136, 119, 0.08);
    }
  `]
})
export class DashCitizenPersonalStatementsComponent implements OnInit {
  private static readonly ACTIVE_STATUS = 1;
  private static readonly HIDDEN_STATUS = 0;

  personalStatements: PersonalStatementGETData[] = [];
  loading = false;
  listError = '';
  modalError = '';
  editModalError = '';
  showAllPursuits = false;

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
    status: DashCitizenPersonalStatementsComponent.ACTIVE_STATUS
  };
  editStatement: { id: string; name: string; rawText: string; source: PersonalStatementGETData | null } = {
    id: '',
    name: '',
    rawText: '',
    source: null,
  };
  creating = false;
  editing = false;
  showModal = false;
  showEditModal = false;
  showWizard = false;
  visibilityUpdatingId: string | null = null;

  readonly pursuitResearchSections = PURSUIT_RESEARCH_SECTIONS;
  selectedPursuit: PersonalStatementGETData | null = null;
  showResearchPanel = false;
  pursuitCriteriaResolver?: CatalogEntryCriteriaResolver;

  @ViewChild('researchPanel') researchPanelRef?: ElementRef<HTMLElement>;
  @ViewChild('researchComponent') researchComponent?: CitizenResearchComponent;

  get researchAccordionTitle(): string {
    const name = this.selectedPursuit?.name || 'Pursuit';
    return `Explore: ${name}`;
  }

  constructor(
    private hcclService: HcclService,
    private hcclContextService: HcclContextService,
    private menuService: MenuService,
    private router: Router
  ) {
    console.log('DashCitizenCoursesComponent initialized');
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
      if (!this.showAllPursuits) {
        criteria.status = DashCitizenPersonalStatementsComponent.ACTIVE_STATUS;
      }

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
    const url = `/citizen/personalstatements/${statementId}`;
    AbstractListComponent.openUrlInNewTab(url);
  }

  getStatusClass(status?: number): string {
    switch (status) {
      case DashCitizenPersonalStatementsComponent.ACTIVE_STATUS:
        return 'badge-active';
      case DashCitizenPersonalStatementsComponent.HIDDEN_STATUS:
        return 'badge-draft';
      case 200:
        return 'badge-archived';
      default:
        return 'badge-draft';
    }
  }

  getStatusText(status?: number): string {
    switch (status) {
      case DashCitizenPersonalStatementsComponent.ACTIVE_STATUS:
        return 'Active';
      case DashCitizenPersonalStatementsComponent.HIDDEN_STATUS:
        return 'Hidden';
      case 200:
        return 'Archived';
      default:
        return 'Unknown';
    }
  }

  isHidden(statement: PersonalStatementGETData): boolean {
    return statement.status !== DashCitizenPersonalStatementsComponent.ACTIVE_STATUS;
  }

  toggleShowAll(): void {
    this.showAllPursuits = !this.showAllPursuits;
    this.loadPersonalStatements();
  }

  /**
   * Show inline research for a pursuit and optionally open a section (jobs / courses / careers).
   */
  explorePursuit(statement: PersonalStatementGETData, sectionKey?: string): void {
    const samePursuit = this.selectedPursuit?.id === statement.id;
    this.selectedPursuit = statement;
    this.pursuitCriteriaResolver = this.buildPursuitCriteriaResolver(statement);

    if (!samePursuit) {
      this.showResearchPanel = false;
    }

    const openPanel = (): void => {
      this.showResearchPanel = true;
      setTimeout(() => {
        this.researchPanelRef?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (sectionKey) {
          this.researchComponent?.activateSection(sectionKey);
        }
      }, samePursuit ? 0 : 50);
    };

    if (samePursuit) {
      openPanel();
    } else {
      setTimeout(openPanel, 0);
    }
  }

  /** Build criteria per pursuit section using the pursuit's vocation encoding. */
  buildPursuitCriteriaResolver(statement: PersonalStatementGETData): CatalogEntryCriteriaResolver {
    return (sectionKey: string) => this.resolvePursuitCatalogCriteria(sectionKey, statement);
  }

  resolvePursuitCatalogCriteria(sectionKey: string, statement: PersonalStatementGETData): CatalogEntryCriteria {
    const base: CatalogEntryCriteria = {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true,
      ignoringWithInterest: true,
      vocationEncodingId: statement.vocationEncodingId || undefined,
    };

    switch (sectionKey) {
      case 'jobs':
        return { ...base, catalogTypeCode: 'job' };
      case 'courses':
        return { ...base, catalogTypeCode: 'course' };
      case 'careers':
        return { ...base, catalogTypeCode: 'career' };
      default:
        return base;
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
    this.loadPersonalStatements().then(() => this.menuService.requestMenuRefresh());
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
      status: DashCitizenPersonalStatementsComponent.ACTIVE_STATUS
    };
    
    // Show modal using Angular
    this.showModal = true;
  }

  openEditModal(statement: PersonalStatementGETData): void {
    if (!statement.id) {
      return;
    }
    this.editModalError = '';
    this.editing = false;
    this.showEditModal = true;
    this.editStatement = {
      id: statement.id,
      name: statement.name || '',
      rawText: statement.rawText || '',
      source: statement,
    };

    this.hcclService.getPersonalStatementById(statement.id).subscribe({
      next: (full) => {
        this.editStatement = {
          id: statement.id!,
          name: full.name || '',
          rawText: full.rawText || '',
          source: full,
        };
      },
      error: (err) => {
        console.error('Error loading pursuit for edit:', err);
        this.editModalError = this.formatErrorMessage(err, 'Failed to load pursuit details.');
      }
    });
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editModalError = '';
    this.editing = false;
    this.editStatement = { id: '', name: '', rawText: '', source: null };
  }

  saveEditPursuit(form: NgForm): void {
    if (!form.valid || !this.editStatement.source?.id) {
      return;
    }

    this.editing = true;
    this.editModalError = '';
    const source = this.editStatement.source;
    const putData = this.buildPutData(source);
    putData.name = this.editStatement.name.trim();
    putData.rawText = this.editStatement.rawText.trim();

    this.hcclService.updatePersonalStatementById(source.id!, putData).subscribe({
      next: () => {
        this.editing = false;
        this.closeEditModal();
        this.loadPersonalStatements().then(() => this.menuService.requestMenuRefresh());
      },
      error: (err) => {
        console.error('Error updating pursuit:', err);
        this.editModalError = this.formatErrorMessage(err, 'Failed to save pursuit. Please try again.');
        this.editing = false;
      }
    });
  }

  togglePursuitVisibility(statement: PersonalStatementGETData): void {
    if (!statement.id) {
      return;
    }

    this.visibilityUpdatingId = statement.id;
    this.hcclService.getPersonalStatementById(statement.id).subscribe({
      next: (full) => {
        const putData = this.buildPutData(full);
        putData.status = this.isHidden(full)
          ? DashCitizenPersonalStatementsComponent.ACTIVE_STATUS
          : DashCitizenPersonalStatementsComponent.HIDDEN_STATUS;

        this.hcclService.updatePersonalStatementById(statement.id!, putData).subscribe({
          next: () => {
            this.visibilityUpdatingId = null;
            if (this.selectedPursuit?.id === statement.id) {
              this.selectedPursuit = { ...this.selectedPursuit, status: putData.status };
            }
            this.loadPersonalStatements().then(() => this.menuService.requestMenuRefresh());
          },
          error: (err) => {
            console.error('Error updating pursuit visibility:', err);
            this.listError = this.formatErrorMessage(err, 'Failed to update pursuit visibility.');
            this.visibilityUpdatingId = null;
          }
        });
      },
      error: (err) => {
        console.error('Error loading pursuit for visibility toggle:', err);
        this.listError = this.formatErrorMessage(err, 'Failed to load pursuit details.');
        this.visibilityUpdatingId = null;
      }
    });
  }

  private buildPutData(from: PersonalStatementGETData): PersonalStatementPUTData {
    return {
      name: from.name || '',
      businessCode: from.businessCode || 'autocalc',
      description: from.description || '',
      statementTypeCode: from.statementTypeCode || 'student_vocation',
      parentEntityId: from.parentEntityId || '',
      parentEntityType: from.parentEntityType || 'HcclUserProfile',
      parentEntityName: from.parentEntityName || 'ParentEntityName',
      rawText: from.rawText || '',
      encodingText: from.encodingText || '',
      vocationEncodingId: from.vocationEncodingId || '',
      status: from.status ?? DashCitizenPersonalStatementsComponent.HIDDEN_STATUS,
    };
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
        status: DashCitizenPersonalStatementsComponent.ACTIVE_STATUS
      };

      this.hcclService.createPersonalStatement(postData).subscribe({
        next: () => {
          this.creating = false;
          this.closeModal();
          this.loadPersonalStatements().then(() => this.menuService.requestMenuRefresh());
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
