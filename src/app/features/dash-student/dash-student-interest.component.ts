import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclService, CatalogEntryInterestGETData, SignupUIData, SignupBehaviorPOSTData } from '@app/restsvc/hccl.service';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { CatalogEntryCrudComponent } from '@app/components/_crud/catalogentry/catalogentry-crud.component';
import { MdbModalService, MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { StdBooleanComponent } from '@app/components/_global/std-boolean/std-boolean.component';

@Component({
  selector: 'app-dash-student-interest',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    CatalogEntryCrudComponent,
    MenuControlDataListComponent,
    StdBooleanComponent
  ],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
              <h3 class="card-title" style="margin: 0;">
                <i [class]="getCatalogTypeIcon() + ' me-2'"></i>
                {{ catalogEntryInterest?.catalogEntry?.catalogTypeCode | titlecase }} Interest
              </h3>
              <div class="button-bar" style="display: flex; gap: 10px; align-items: center;">
                <button 
                  *ngIf="canSignUp()" 
                  class="btn btn-primary btn-sm" 
                  (click)="openSignUpModal()" 
                  title="Sign Up">
                  <i class="fas fa-user-plus me-1"></i>
                  Sign Up
                </button>
                <button 
                  *ngIf="canApply()" 
                  class="btn btn-success btn-sm" 
                  (click)="openApplyModal()" 
                  title="Apply">
                  <i class="fas fa-paper-plane me-1"></i>
                  Apply
                </button>
              </div>
            </div>
            <div class="card-body">
              <!-- Loading state -->
              <div *ngIf="loading" class="text-center py-4">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading catalog entry interest...</p>
              </div>

              <!-- Error state -->
              <div *ngIf="error" class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ error }}
              </div>

              <!-- Catalog Entry Interest Details -->
              <div *ngIf="!loading && !error && catalogEntryInterest">
                <!-- Display Catalog Entry Information -->
                <div *ngIf="catalogEntryInterest.catalogEntry" class="catalog-entry-section mb-4">
                  <app-catalogentry-crud 
                    [id]="catalogEntryInterest.catalogEntry.id" 
                    [modeName]="'section'">
                  </app-catalogentry-crud>
                </div>

                <!-- More Information Section -->
                <div class="more-information-section mt-4">
                  <h4 class="mb-3">
                    <i class="fas fa-info-circle me-2"></i>
                    More Information
                  </h4>
                  
                  <!-- Loading state for signup UI data -->
                  <div *ngIf="loadingSignupUIData" class="text-center py-2">
                    <div class="spinner-border spinner-border-sm" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </div>

                  <!-- Signup Packet Instructions -->
                  <div *ngIf="!loadingSignupUIData && signupInstructionsHtml" 
                       class="signup-packet-instructions"
                       [innerHTML]="signupInstructionsHtml">
                  </div>

                  <!-- No signup packet available -->
                  <div *ngIf="!loadingSignupUIData && !signupInstructionsHtml" class="alert alert-info">
                    <p>No additional information available for this catalog entry.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sign Up Modal -->
    <div *ngIf="showSignUpModal" class="modal fade show" style="display: block;" tabindex="-1" aria-labelledby="signUpModalLabel" aria-hidden="false">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="signUpModalLabel">
              <i class="fas fa-user-plus me-2"></i>
              Sign Up
            </h5>
            <button type="button" class="btn-close" (click)="closeSignUpModal()" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- Loading state -->
            <div *ngIf="loadingSignupUIData" class="text-center py-4">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2">Loading signup information...</p>
            </div>

            <!-- Signup Form -->
            <form *ngIf="!loadingSignupUIData && signupUIData" (ngSubmit)="onSubmitSignup()">
              <!-- Resume Dropdown (if required) -->
              <div *ngIf="signupUIData.signupBehavior?.requiringResume" class="mb-3">
                <label class="form-label">Resume <span class="text-danger">*</span></label>
                <app-menu-control-data-list
                  [menuControlDataList]="signupUIData.resumeSelectData || null"
                  placeholder="Select a resume"
                  [(ngModel)]="signupFormData.resumeId"
                  name="resumeId"
                  [required]="signupUIData.signupBehavior?.requiringResume || false">
                </app-menu-control-data-list>
                <div class="form-text">Please select a resume to include with your signup.</div>
              </div>

              <!-- Provider Messaging Consent Checkbox (if required) -->
              <div *ngIf="signupUIData.signupBehavior?.ackingProviderContact" class="mb-3">
                <app-std-boolean
                  prefix="signup"
                  name="allowingProviderToMessage"
                  [label]="'Allow ' + (signupUIData.providerOrganizationName || 'Provider') + ' to Message'"
                  [required]="false"
                  mode="checkbox"
                  [(ngModel)]="signupFormData.allowingProviderToMessage">
                </app-std-boolean>
              </div>

              <!-- Error message -->
              <div *ngIf="signupError" class="alert alert-danger mt-3">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ signupError }}
              </div>
            </form>

            <!-- No signup data available -->
            <div *ngIf="!loadingSignupUIData && !signupUIData" class="alert alert-warning">
              <p>Signup information is not available for this catalog entry.</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="closeSignUpModal()">Cancel</button>
            <button 
              type="button" 
              class="btn btn-primary" 
              (click)="onSubmitSignup()"
              [disabled]="!canSubmitSignup() || submittingSignup">
              <span *ngIf="submittingSignup">
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Submitting...
              </span>
              <span *ngIf="!submittingSignup">Complete Signup</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div *ngIf="showSignUpModal" class="modal-backdrop fade show"></div>

    <!-- Apply Modal -->
    <div *ngIf="showApplyModal" class="modal fade show" style="display: block;" tabindex="-1" aria-labelledby="applyModalLabel" aria-hidden="false">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="applyModalLabel">
              <i class="fas fa-paper-plane me-2"></i>
              Apply
            </h5>
            <button type="button" class="btn-close" (click)="closeApplyModal()" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- TODO: Implement application form -->
            <!-- This modal will allow users to create an application for jobs, courses, etc. -->
            <!-- 
              Features to implement:
              - Application form fields
              - Resume/portfolio attachment
              - Personal statement selection
              - Validation
              - Submit to backend API
              - Success/error handling
            -->
            <p>Application functionality will be implemented here.</p>
            <p>This will allow users to create applications for:</p>
            <ul>
              <li>Job positions</li>
              <li>Course enrollments</li>
              <li>Program admissions</li>
              <li>Other opportunities</li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="closeApplyModal()">Cancel</button>
            <button type="button" class="btn btn-success" disabled>
              Submit Application
            </button>
          </div>
        </div>
      </div>
    </div>
    <div *ngIf="showApplyModal" class="modal-backdrop fade show"></div>
  `
})
export class DashStudentInterestComponent implements OnInit {

  @Input() interestId: string = '';

  catalogEntryInterest: CatalogEntryInterestGETData | null = null;
  loading = false;
  error = '';
  
  // Modal state
  showSignUpModal = false;
  showApplyModal = false;

  // Signup UI data state
  loadingSignupUIData = false;
  signupUIData: SignupUIData | null = null;
  signupInstructionsHtml: SafeHtml | null = null;

  // Signup form data
  signupFormData: {
    resumeId?: string;
    allowingProviderToMessage?: boolean;
  } = {};

  // Signup submission state
  submittingSignup = false;
  signupError: string | null = null;

  private modalService = inject(MdbModalService);

  constructor(
    private hcclService: HcclService,
    private hcclContextService: HcclContextService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    console.log('DashStudentInterestComponent initialized');
  }

  ngOnInit(): void {
    // Get interest ID from route parameters
  //  this.interestId = this.route.snapshot.params['interestId'] || '';
    
    if (this.interestId) {
      this.loadCatalogEntryInterest();
    } else {
      this.error = 'No interest ID provided in the route.';
    }
  }

  async loadCatalogEntryInterest(): Promise<void> {
    this.loading = true;
    this.error = '';

    try {
      // Wait for context to be ready
      await this.hcclContextService.waitForReady();
      
      this.hcclService.getCatalogEntryInterestById(this.interestId).subscribe({
        next: (data) => {
          this.catalogEntryInterest = data;
          this.loading = false;
          
          // Load signup UI data
          this.loadSignupUIData();
        },
        error: (err) => {
          console.error('Error loading catalog entry interest:', err);
          this.error = 'Failed to load catalog entry interest. Please try again.';
          this.loading = false;
        }
      });
    } catch (err) {
      console.error('Error in loadCatalogEntryInterest:', err);
      this.error = 'An unexpected error occurred. Please try again.';
      this.loading = false;
    }
  }

  /**
   * Get the appropriate icon class based on catalog type
   * Returns: fa-briefcase for Job, fa-graduation-cap for Course, fa-calendar-alt for Event
   */
  getCatalogTypeIcon(): string {
    if (!this.catalogEntryInterest?.catalogEntry?.catalogTypeCode) {
      return 'fas fa-heart'; // Default icon if type is unknown
    }

    const catalogTypeCode = this.catalogEntryInterest.catalogEntry.catalogTypeCode.toLowerCase();
    
    if (catalogTypeCode.includes('job') || catalogTypeCode.includes('position')) {
      return 'fas fa-briefcase';
    } else if (catalogTypeCode.includes('course') || catalogTypeCode.includes('class')) {
      return 'fas fa-graduation-cap';
    } else if (catalogTypeCode.includes('event') || catalogTypeCode.includes('meeting')) {
      return 'fas fa-calendar-alt';
    }
    
    return 'fas fa-heart'; // Default fallback
  }

  /**
   * Determine if the Sign Up button should be shown
   * This will check various conditions like catalog entry type, availability, etc.
   */
  canSignUp(): boolean {
    if (!this.catalogEntryInterest?.catalogEntry) {
      return false;
    }

    const catalogEntry = this.catalogEntryInterest.catalogEntry;
    
    // Example logic - adjust based on business requirements
    // Sign up might be available for courses, events, etc.
    const catalogTypeCode = catalogEntry.catalogTypeCode?.toLowerCase() || '';
    const canSignUpTypes = ['course', 'event', 'program'];
    
    return canSignUpTypes.some(type => catalogTypeCode.includes(type)) && 
           catalogEntry.available === 1;
  }

  /**
   * Determine if the Apply button should be shown
   * This will check various conditions like catalog entry type, availability, etc.
   */
  canApply(): boolean {
    if (!this.catalogEntryInterest?.catalogEntry) {
      return false;
    }

    const catalogEntry = this.catalogEntryInterest.catalogEntry;
    
    // Example logic - adjust based on business requirements
    // Apply might be available for jobs, programs, etc.
    const catalogTypeCode = catalogEntry.catalogTypeCode?.toLowerCase() || '';
    const canApplyTypes = ['job', 'position', 'program', 'admission'];
    
    return canApplyTypes.some(type => catalogTypeCode.includes(type)) && 
           catalogEntry.available === 1;
  }

  /**
   * Open the Sign Up modal
   */
  openSignUpModal(): void {
    // Reset form data
    this.signupFormData = {
      resumeId: undefined,
      allowingProviderToMessage: false
    };
    this.signupError = null;
    this.submittingSignup = false;

    // Ensure signup UI data is loaded
    if (!this.signupUIData && !this.loadingSignupUIData) {
      this.loadSignupUIData();
    }

    this.showSignUpModal = true;
  }

  /**
   * Close the Sign Up modal
   */
  closeSignUpModal(): void {
    this.showSignUpModal = false;
    this.signupFormData = {};
    this.signupError = null;
    this.submittingSignup = false;
  }

  /**
   * Check if signup form can be submitted
   */
  canSubmitSignup(): boolean {
    if (!this.signupUIData?.signupBehavior) {
      return false;
    }

    const behavior = this.signupUIData.signupBehavior;

    // If resume is required, it must be selected
    if (behavior.requiringResume && !this.signupFormData.resumeId) {
      return false;
    }

    return true;
  }

  /**
   * Submit the signup form
   */
  onSubmitSignup(): void {
    if (!this.canSubmitSignup() || this.submittingSignup) {
      return;
    }

    if (!this.signupUIData || !this.catalogEntryInterest) {
      this.signupError = 'Signup information is not available.';
      return;
    }

    this.submittingSignup = true;
    this.signupError = null;

    const userProfileId = this.hcclContextService.getCurrentUserProfileId();
    if (!userProfileId) {
      this.signupError = 'User profile ID is not available. Please refresh the page.';
      this.submittingSignup = false;
      return;
    }

    const signupData: SignupBehaviorPOSTData = {
      catalogEntryInterestId: this.catalogEntryInterest.id || this.interestId,
      studentUserProfileId: userProfileId,
      resumeId: this.signupFormData.resumeId,
      consentToProviderMessaging: this.signupFormData.allowingProviderToMessage || false,
      consentToSendTranscript: this.signupUIData.signupBehavior?.consentingToSendTranscript ? 
        (this.signupFormData.allowingProviderToMessage || false) : undefined,
      signupMessage: undefined
    };

    console.log('Submitting signup request:', signupData);

    this.hcclService.callCreateSignupRequest(signupData).subscribe({
      next: (response) => {
        console.log('Signup request created successfully:', response);
        this.submittingSignup = false;
        this.closeSignUpModal();
        
        // Optionally reload the catalog entry interest to show updated state
        this.loadCatalogEntryInterest();
      },
      error: (err) => {
        console.error('Error creating signup request:', err);
        this.signupError = err?.error?.message || err?.message || 'Failed to submit signup request. Please try again.';
        this.submittingSignup = false;
      }
    });
  }

  /**
   * Open the Apply modal
   */
  openApplyModal(): void {
    this.showApplyModal = true;
  }

  /**
   * Close the Apply modal
   */
  closeApplyModal(): void {
    this.showApplyModal = false;
  }

  /**
   * Load the SignupUIData by calling resolveSignupUIData
   */
  loadSignupUIData(): void {
    if (!this.interestId) {
      return;
    }

    this.loadingSignupUIData = true;
    this.signupUIData = null;
    this.signupInstructionsHtml = null;

    console.log('Loading signup UI data for interest ID:', this.interestId);
    this.hcclService.resolveSignupUIData(this.interestId).subscribe({
      next: (data) => {
        console.log('Signup UI data loaded successfully:', data);
        this.loadingSignupUIData = false;
        this.signupUIData = data;
        
        // Extract and render markdown instructions
        const instructionsMd = data?.signupPacket?.instructionsMd || 
                               data?.signupPacket?.signupInstructionsMD || '';
        
        if (instructionsMd) {
          const htmlContent = this.markdownToHtml(instructionsMd);
          this.signupInstructionsHtml = this.sanitizer.bypassSecurityTrustHtml(htmlContent);
        }
      },
      error: (err) => {
        console.error('Error loading signup UI data:', err);
        console.error('Error details:', {
          status: err?.status,
          statusText: err?.statusText,
          message: err?.message,
          error: err?.error,
          url: err?.url
        });
        this.loadingSignupUIData = false;
        // Don't show error to user, just don't display signup packet
      }
    });
  }

  /**
   * Convert markdown text to HTML
   * Basic markdown conversion for common syntax
   */
  markdownToHtml(markdown: string): string {
    if (!markdown) {
      return '';
    }

    let html = markdown;

    // Escape HTML first to prevent XSS, but preserve markdown syntax
    // We'll do this more carefully to allow markdown conversion
    const escapeHtml = (text: string): string => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    };

    // Process code blocks first (before escaping)
    const codeBlocks: string[] = [];
    html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
      const id = `__CODE_BLOCK_${codeBlocks.length}__`;
      codeBlocks.push(escapeHtml(code));
      return id;
    });

    // Process inline code
    const inlineCodes: string[] = [];
    html = html.replace(/`([^`]+)`/g, (match, code) => {
      const id = `__INLINE_CODE_${inlineCodes.length}__`;
      inlineCodes.push(escapeHtml(code));
      return id;
    });

    // Escape the rest of the HTML
    html = escapeHtml(html);

    // Restore code blocks
    codeBlocks.forEach((code, index) => {
      html = html.replace(`__CODE_BLOCK_${index}__`, `<pre><code>${code}</code></pre>`);
    });

    // Restore inline code
    inlineCodes.forEach((code, index) => {
      html = html.replace(`__INLINE_CODE_${index}__`, `<code>${code}</code>`);
    });

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // Italic (but not if it's part of bold)
    html = html.replace(/(?<!\*)\*(?!\*)([^*]+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
    html = html.replace(/(?<!_)_(?!_)([^_]+?)(?<!_)_(?!_)/g, '<em>$1</em>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Unordered lists - process line by line
    const lines = html.split('\n');
    const processedLines: string[] = [];
    let inList = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const listMatch = line.match(/^(\*|-)\s+(.+)$/);
      
      if (listMatch) {
        if (!inList) {
          processedLines.push('<ul>');
          inList = true;
        }
        processedLines.push(`<li>${listMatch[2]}</li>`);
      } else {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        processedLines.push(line);
      }
    }
    
    if (inList) {
      processedLines.push('</ul>');
    }
    
    html = processedLines.join('\n');

    // Ordered lists
    const olLines = html.split('\n');
    const olProcessedLines: string[] = [];
    let inOlList = false;
    
    for (let i = 0; i < olLines.length; i++) {
      const line = olLines[i];
      const olMatch = line.match(/^\d+\.\s+(.+)$/);
      
      if (olMatch) {
        if (!inOlList) {
          olProcessedLines.push('<ol>');
          inOlList = true;
        }
        olProcessedLines.push(`<li>${olMatch[1]}</li>`);
      } else {
        if (inOlList) {
          olProcessedLines.push('</ol>');
          inOlList = false;
        }
        olProcessedLines.push(line);
      }
    }
    
    if (inOlList) {
      olProcessedLines.push('</ol>');
    }
    
    html = olProcessedLines.join('\n');

    // Line breaks - convert double newlines to paragraphs
    html = html.split('\n\n').map(para => {
      para = para.trim();
      if (para && !para.match(/^<(h[1-6]|ul|ol|pre|p)/)) {
        return `<p>${para}</p>`;
      }
      return para;
    }).join('');

    // Single line breaks to <br>
    html = html.replace(/\n/g, '<br>');

    return html;
  }
}

