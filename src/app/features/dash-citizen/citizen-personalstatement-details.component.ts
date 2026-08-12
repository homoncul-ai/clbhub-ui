import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { HcclService, HcclUserProfileGETData, PersonalStatementUIGETData, PersonalStatementGETData,
  CatalogEntryInterestGETData, CatalogEntryInterestCriteria } from '@app/restsvc/hccl.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PersonalStatementCrudComponent } from '@app/components/_crud/personalstatement/personalstatement-crud.component';
import { CatalogEntryCrudComponent } from '@app/components/_crud/catalogentry/catalogentry-crud.component';
import { CRUD_MODES } from '@app/@core/constants';
import { VocationEncodingDisplayComponent } from '@app/components/_crud/vocationencoding/vocationencoding-display.component';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';

@Component({
  selector: 'app-citizen-personalstatement-details',
  standalone: true,
  imports: [CommonModule, PersonalStatementCrudComponent, 
    CatalogEntryCrudComponent, VocationEncodingDisplayComponent, MdbAccordionModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
          
            <div class="card-body">
              <!-- Loading State -->
              <div *ngIf="loading" class="text-center py-5">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading personal statement...</p>
              </div>

              <!-- Error State -->
              <div *ngIf="error && !loading" class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ error }}
              </div>

              <!-- Content -->
              <div *ngIf="!loading && !error">
                <!-- Back Button -->
                <div class="mb-3">
                  <a href="/citizen/home" class="btn btn-outline-secondary btn-sm">
                    <i class="fas fa-arrow-left me-1"></i> Back to Dashboard
                  </a>
                </div>

                <mdb-accordion [multiple]="false" class="mb-4">
                  <mdb-accordion-item
                    [collapsed]="isAccordionCollapsed('personalGoal')"
                    (itemShow)="openAccordion('personalGoal')">
                    <ng-template mdbAccordionItemHeader>
                      <div>
                        <div>
                          <i class="fas fa-compass me-2"></i>
                          Pursuit: {{ personalStatement?.name }}
                        </div>
                        <div class="text-muted small ms-4 ps-1" *ngIf="isStatementHidden()">hidden</div>
                      </div>
                    </ng-template>
                    <ng-template mdbAccordionItemBody>
                      <div class="accordion-body-content">
                        <div class="personal-statement-card" *ngIf="personalStatement">
                          <div class="card statement-card">
                            <div class="card-body">
                              <div class="row g-3">
                                <div class="col-md-6">
                                  <app-personalstatement-crud [modeName]="CRUD_MODES.CARD" [id]="personalStatementId"></app-personalstatement-crud>
                                  <div class="text-muted small mt-2" *ngIf="isStatementHidden()">hidden</div>
                                </div>

                                <div class="col-md-6">
                                  <div class="recent-interests-tile h-100">
                                    <h6 class="recent-interests-title mb-3">
                                      <i class="fas fa-star me-2"></i>Recent Interests
                                    </h6>
                                    <div *ngIf="recentCatalogEntryInterests.length === 0" class="text-muted small py-3">
                                      No interests recorded yet for this pursuit.
                                    </div>
                                    <div *ngFor="let interest of recentCatalogEntryInterests" class="recent-interest-item">
                                      <app-catalogentry-crud [id]="interest.catalogEntryId" [modeName]="CRUD_MODES.FK"></app-catalogentry-crud>
                                      <div class="d-flex align-items-center gap-2 mt-1">
                                        <span class="badge bg-info">{{ interest.currentStateCode || 'New' }}</span>
                                        <small class="text-muted">{{ interest.dateCreated?.formattedDate || '-' }}</small>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ng-template>
                  </mdb-accordion-item>

                  <mdb-accordion-item
                    [collapsed]="isAccordionCollapsed('vocationEncoding')"
                    (itemShow)="openAccordion('vocationEncoding')">
                    <ng-template mdbAccordionItemHeader>
                      <i class="fas fa-briefcase me-2"></i>
                      Vocation Encoding Matches
                    </ng-template>
                    <ng-template mdbAccordionItemBody>
                      <div class="accordion-body-content">
                        <app-vocationencoding-display [id]="personalStatement?.vocationEncodingId || ''"></app-vocationencoding-display>
                      </div>
                    </ng-template>
                  </mdb-accordion-item>

                  <mdb-accordion-item
                    [collapsed]="isAccordionCollapsed('interests')"
                    (itemShow)="openAccordion('interests')">
                    <ng-template mdbAccordionItemHeader>
                      <i class="fas fa-star me-2"></i>
                      Your Interests for this Personal Statement
                    </ng-template>
                    <ng-template mdbAccordionItemBody>
                      <div class="accordion-body-content">
                        <div *ngIf="catalogEntryInterests.length === 0" class="text-center py-4">
                          <i class="fas fa-search fa-3x text-muted mb-3"></i>
                          <p class="text-muted">No interests have been expressed yet for this personal statement.</p>
                          <a [href]="'/citizen/personalstatements/' + personalStatementId + '/search'" class="btn btn-primary">
                            <i class="fas fa-search me-1"></i> Search for Opportunities
                          </a>
                        </div>
                        <div *ngIf="catalogEntryInterests.length > 0" class="interests-list">
                          <div class="table-responsive">
                            <table class="table table-hover">
                              <thead>
                                <tr>
                                  <th>Opportunity</th>
                                  <th>Interest Level</th>
                                  <th>Status</th>
                                  <th>Notes</th>
                                  <th>Date Added</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr *ngFor="let interest of catalogEntryInterests" class="interest-row">
                                  <td>
                                    <app-catalogentry-crud [id]="interest.catalogEntryId" [modeName]="CRUD_MODES.FK"></app-catalogentry-crud>
                                  </td>
                                  <td>
                                    <div class="interest-level">
                                      <span class="badge" [ngClass]="{
                                        'bg-success': interest.interest && interest.interest >= 8,
                                        'bg-primary': interest.interest && interest.interest >= 5 && interest.interest < 8,
                                        'bg-warning': interest.interest && interest.interest >= 3 && interest.interest < 5,
                                        'bg-secondary': !interest.interest || interest.interest < 3
                                      }">
                                        {{ interest.interest || 0 }}/10
                                      </span>
                                    </div>
                                  </td>
                                  <td>
                                    <span class="badge bg-info">{{ interest.currentStateCode || 'New' }}</span>
                                  </td>
                                  <td>
                                    <span class="notes-text">{{ interest.notes || '-' }}</span>
                                  </td>
                                  <td>
                                    <small class="text-muted">{{ interest.dateCreated?.formattedDate || '-' }}</small>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </ng-template>
                  </mdb-accordion-item>
                </mdb-accordion>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
      border: 1px solid rgba(0, 0, 0, 0.125);
    }
    
    .card-header {
      background-color: #f8f9fa;
      border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    }

    /* Statement Card Styles */
    .statement-card {
      border-left: 4px solid #4285f4;
      transition: box-shadow 0.2s ease;
    }
    
    .statement-card:hover {
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }

    /* Recent interests tile */
    .recent-interests-tile {
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
      border-radius: 8px;
      padding: 1rem;
      border: 1px solid #e9ecef;
    }

    .recent-interests-title {
      color: #495057;
      font-size: 0.9rem;
      font-weight: 600;
      border-bottom: 2px solid #4285f4;
      padding-bottom: 0.5rem;
    }

    .recent-interest-item {
      padding: 0.75rem 0;
      border-bottom: 1px solid #e9ecef;
    }

    .recent-interest-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    /* Interests Table Styles */
    .interests-list {
      margin-top: 0.5rem;
    }

    .interest-row:hover {
      background-color: #f8f9fa;
    }

    .interest-level .badge {
      font-size: 0.85rem;
      padding: 0.4rem 0.6rem;
    }

    .notes-text {
      max-width: 200px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    @media (max-width: 768px) {
      .notes-text {
        max-width: 100px;
      }
    }
  `]
})
export class CitizenPersonalStatementDetailsComponent implements OnInit {
  private static readonly ACTIVE_STATUS = 1;
  private hcclContextService = inject(HcclContextService);
  private hcclService = inject(HcclService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  CRUD_MODES = CRUD_MODES;
  loading: boolean = false;
  error: string | null = null;
  userProfile: HcclUserProfileGETData | null = null;
  personalStatementUIData: PersonalStatementUIGETData | null = null;
  personalStatement: PersonalStatementGETData | null = null;
  personalStatementId: string = '';
  catalogEntryInterests: CatalogEntryInterestGETData[] = [];
  accordionId = 'personalGoal';

  get recentCatalogEntryInterests(): CatalogEntryInterestGETData[] {
    return [...this.catalogEntryInterests]
      .sort((a, b) => {
        const aMs = a.dateCreated?.dateMilliseconds ?? 0;
        const bMs = b.dateCreated?.dateMilliseconds ?? 0;
        return bMs - aMs;
      })
      .slice(0, 4);
  }

  isStatementHidden(): boolean {
    return (this.personalStatement?.status ?? 0) !== CitizenPersonalStatementDetailsComponent.ACTIVE_STATUS;
  }

  constructor() {
    console.log('CitizenPersonalStatementDetailsComponent initialized');
  }

  ngOnInit(): void {
    // Get personal statement ID from route params
    this.route.params.subscribe(params => {
      this.personalStatementId = params['id'] || '';
      if (this.personalStatementId) {
        this.loadData();
      } else {
        this.error = 'No personal statement ID provided';
      }
    });
  }

  openAccordion(id: string): void {
    this.accordionId = id;
  }

  isAccordionCollapsed(id: string): boolean {
    return this.accordionId !== id;
  }

  /**
   * Load all required data
   */
  private loadData(): void {
    this.loading = true;
    this.error = null;

    // Wait for context to be ready
    this.hcclContextService.waitForReady$().subscribe({
      next: (context) => {
        if (!context || !context.currentUserProfileId) {
          this.error = 'User context not available';
          this.loading = false;
          return;
        }

        this.userProfile = context.currentUserProfile || null;

        // Load personal statement UI data and catalog entry interests
        forkJoin({
          psUIData: this.hcclService.resolvePersonalStatementUIData(this.personalStatementId).pipe(
            catchError(err => {
              console.warn('Error loading personal statement UI data:', err);
              return of(null);
            })
          ),
          interests: this.hcclService.findCatalogEntryInterests({
            personalStatementId: this.personalStatementId,
            pageNumber: 1,
            pageSize: 100,
            isPaging: true
          } as CatalogEntryInterestCriteria).pipe(
            catchError(err => {
              console.warn('Error loading catalog entry interests:', err);
              return of({ searchResults: [] });
            })
          )
        }).subscribe({
          next: (results) => {
            this.personalStatementUIData = results.psUIData;
            this.personalStatement = results.psUIData?.personalStatement || null;
            this.catalogEntryInterests = results.interests?.searchResults || [];

            // If personal statement not found, create minimal object
            if (!this.personalStatement) {
              this.personalStatement = {
                id: this.personalStatementId,
                name: 'Personal Statement'
              };
            }

            this.loading = false;
          },
          error: (err) => {
            console.error('Error loading data:', err);
            this.error = 'Failed to load personal statement data';
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error waiting for context:', err);
        this.error = 'Failed to load user context';
        this.loading = false;
      }
    });
  }
}

