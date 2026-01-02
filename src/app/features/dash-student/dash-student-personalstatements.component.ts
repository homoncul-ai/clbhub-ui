import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HcclService, PersonalStatementGETData, PersonalStatementCriteria, PersonalStatementPOSTData } from '@app/restsvc/hccl.service';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { Observable } from 'rxjs';
import { DategetdataDisplayComponent } from "../../components/_global/dategetdata-display/dategetdata-display.component";
import { AbstractListComponent } from '@app/components/_global';
import { StdMdbFormTextareaComponent } from "../../components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component";
import { StdMdbFormTextComponent } from "../../components/_global/std-mdb-form-text/std-mdb-form-text.component";

@Component({
  selector: 'app-dash-student-courses',
  standalone: true,
  imports: [CommonModule, FormsModule, DategetdataDisplayComponent, StdMdbFormTextareaComponent, StdMdbFormTextComponent],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                <i class="fas fa-file-alt me-2"></i>
                My Career Goals
              </h3>
              <button class="btn btn-primary btn-sm" (click)="openCreateModal()" title="Create New Personal Statement">
                <i class="fas fa-plus me-1"></i>
                New Statement
              </button>
            </div>
            <div class="card-body">
              <!-- Loading state -->
              <div *ngIf="loading" class="text-center py-4">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading personal statements...</p>
              </div>

              <!-- Error state -->
              <div *ngIf="error" class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ error }}
              </div>

              <!-- Personal statements list -->
              <div *ngIf="!loading && !error && personalStatements.length > 0" class="row">
                <div *ngFor="let statement of personalStatements" class="col-md-6 col-lg-4 mb-4">
                  <div class="card statement-card">
                    <div class="card-body">
                      <h5 class="card-title">{{ statement.name || 'Untitled Statement' }}</h5>
                      <!-- <p class="card-text">{{ statement.description || 'No description available' }}</p> -->
                      <div class="status-badge mb-3">
                        <span class="badge" [ngClass]="getStatusClass(statement.status)">
                          {{ getStatusText(statement.status) }}
                        </span>
                      </div>
                      <small class="text-muted mb-3 d-block">
                        <i class="fas fa-calendar me-1"></i>
                        Created: <app-dategetdata-display [data]="statement.dateCreated"></app-dategetdata-display>
                      </small>
                      
                      <!-- Action buttons for each card -->
                      <div class="card-actions">
                        <button class="btn btn-xs btn-primary me-1" (click)="findMatchingJobs(statement)" title="Search Jobs">
                          <i class="fas fa-briefcase me-1"></i>
                          
                        </button>
                        <button class="btn btn-xs btn-success me-1" (click)="findMatchingCourses(statement)" title="Search Courses">
                          <i class="fas fa-graduation-cap me-1"></i>
                  
                        </button>
                        <button class="btn btn-xs btn-info" (click)="findMatchingEvents(statement)" title="Search Events">
                          <i class="fas fa-calendar-alt me-1"></i>
                          
                        </button>
                      </div>
                    </div>
                    <div class="card-footer">
                      <button class="btn btn-outline-secondary btn-sm w-100" (click)="openStatementDetails(statement.id!)">
                        <i class="fas fa-eye me-1"></i>
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty state -->
              <div *ngIf="!loading && !error && personalStatements.length === 0" class="text-center py-4">
                <i class="fas fa-file-alt fa-3x text-muted mb-3"></i>
                <h5>No Personal Statements Found</h5>
                <p class="text-muted">You haven't created any personal statements yet.</p>
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
              Create New Personal Statement
            </h5>
            <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
          </div>
          <div class="modal-body">
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
                label="Statement Name *"
                [required]="true"
                [maxlength]="255"
                [error]="error"
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
                [error]="error"
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
                    [disabled]="!createForm.form.valid || creating">
              <span *ngIf="creating" class="spinner-border spinner-border-sm me-2" role="status"></span>
              {{ creating ? 'Creating...' : 'Create Statement' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div *ngIf="showModal" class="modal-backdrop fade show"></div>
  `
})
export class DashStudentPersonalStatementsComponent implements OnInit {
  personalStatements: PersonalStatementGETData[] = [];
  loading = false;
  error = '';

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

  async loadPersonalStatements(): Promise<void> {
    this.loading = true;
    this.error = '';

    try {
      // Wait for context to be ready
      await this.hcclContextService.waitForReady();
      
      const currentUserId = this.hcclContextService.getCurrentUserProfileId();
      
      if (!currentUserId) {
        this.error = 'Unable to determine current user. Please try logging in again.';
        this.loading = false;
        return;
      }

      const criteria: PersonalStatementCriteria = {
        parentEntityId: currentUserId,
        isPaging: false,
        maxResults: 50
      };

      this.hcclService.findPersonalStatements(criteria).subscribe({
        next: (results) => {
          this.personalStatements = results.searchResults || [];
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading personal statements:', err);
          this.error = 'Failed to load personal statements. Please try again.';
          this.loading = false;
        }
      });
    } catch (err) {
      console.error('Error in loadPersonalStatements:', err);
      this.error = 'An unexpected error occurred. Please try again.';
      this.loading = false;
    }
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

  /**
   * Open the create personal statement modal
   */
  openCreateModal(): void {
    // Reset form with default values for hidden fields
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
  }

  /**
   * Create a new personal statement
   */
  async createPersonalStatement(form: any): Promise<void> {
    if (!form.form.valid) {
      return;
    }

    this.creating = true;
    this.error = '';

    try {
      // Wait for context to be ready
      await this.hcclContextService.waitForReady();
      
      const currentUserId = this.hcclContextService.getCurrentUserProfileId();
      
      if (!currentUserId) {
        this.error = 'Unable to determine current user. Please try logging in again.';
        this.creating = false;
        return;
      }

      // Prepare the data for creation using form values
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

      // Create the personal statement
      const response = await this.hcclService.createPersonalStatement(postData).toPromise();
      
      if (response) {
        // Close modal
        this.closeModal();
        
        // Reload the list
        await this.loadPersonalStatements();
        
        // Show success message or navigate to the new statement
        console.log('Personal statement created successfully:', response);
      }
    } catch (err) {
      console.error('Error creating personal statement:', err);
      this.error = 'Failed to create personal statement. Please try again.';
    } finally {
      this.creating = false;
    }
  }
}
