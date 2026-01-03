import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, inject } from '@angular/core';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global';
import { HcclService, CatalogEntryInterestGETData, PMessageGETData, CatalogEntryGETData, SignupUIData, SignupBehaviorPOSTData } from '@app/restsvc/hccl.service';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclUserProfileCrudWrapper } from '../../dash-ecoadmin/orgs/org-school-staff-crud.component';
import { CatalogEntryInterestCrudWrapper } from '@app/components/_crud/catalogentryinterest/catalogentryinterest-crud.component';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PMessageCrudComponent } from '@app/components/_crud/pmessage/pmessage-crud.component';
import { PMessageUiComponent } from '@app/components/_crud/pmessage-ui/pmessage-ui.component';
import { CatalogEntryCrudComponent } from '@app/components/_crud/catalogentry/catalogentry-crud.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { StdBooleanComponent } from '@app/components/_global/std-boolean/std-boolean.component';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-student-engage-interest',
  standalone: true,
  imports: [
    SimpleTabsetComponent, 
    CommonModule, 
    FormsModule,
    PMessageUiComponent, 
    CatalogEntryCrudComponent,
    MenuControlDataListComponent,
    StdBooleanComponent
  ],
  templateUrl: './student-engage-interest.component.html',
  styleUrl: './student-engage-interest.component.scss'
})
export class StudentEngageInterestComponent 
implements OnInit, OnDestroy, OnChanges {
  @Input() interestId: string = '';

  private hcclService = inject(HcclService);
  private hcclContextService = inject(HcclContextService);
  private sanitizer = inject(DomSanitizer);
  private destroy$ = new Subject<void>();
  
  protected interestGETData: CatalogEntryInterestGETData | null = null;
  protected entryGETData: CatalogEntryGETData | null = null;
  protected messageId: string = '';

  // Modal state
  protected showSignUpModal = false;
  protected showApplyModal = false;

  // Signup UI data state
  protected loadingSignupUIData = false;
  protected signupUIData: SignupUIData | null = null;
  protected signupInstructionsHtml: SafeHtml | null = null;

  // Signup form data
  protected signupFormData: {
    resumeId?: string;
    allowingProviderToMessage?: boolean;
  } = {};

  // Signup submission state
  protected submittingSignup = false;
  protected signupError: string | null = null;

  constructor() {
   // super();    
  }

  ngOnInit(): void {
    this.loadInterestData(); 
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Reload data when interestId input changes
    if (changes['interestId']) {
      // Reset state first
      this.resetState();
      // Then load new data if we have an interestId
      if (this.interestId) {
        this.loadInterestData();
      }
    }
  }

  private resetState(): void {
    this.interestGETData = null;
    this.entryGETData = null;
    this.messageId = '';
    this.tabs = [];
    this.showingTabset = false;
    this.currentTabId = '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  private loadInterestData(): void {
    if (!this.interestId) return;
    this.hcclService.getCatalogEntryInterestById(this.interestId, 'all')
      .subscribe({
        next: (data) => {
          this.interestGETData = data;
          this.entryGETData = data.catalogEntry || null;
          this.messageId = data.messageId || '';
          // Setup tabs after data is loaded
          this.setupTabs();
          // Load signup UI data
          this.loadSignupUIData();
        },
      });
  }
  
  protected showingTabset: boolean = false;
  protected currentTabId: string = '';
  protected tabs: SimpleTab[] = [];
  protected setupTabs(): SimpleTab[] {
    var tabs: SimpleTab[] = [
      new SimpleTab('details', 'Details', '', 
        () => {
          // Open up the details tab, showing
          // <app-catalogentryinterest-crud [id]="interestId" modeName="details"></app-catalogentryinterest-crud>
          this.currentTabId = 'details';
        },
        () => {
          return true;
        }
      )];
      
      // Show if the 
      var signupInfoTab = new SimpleTab('signupInfo', "Signup Information", '', 
        () => {
          this.currentTabId = 'signupInfo';
        },
        () => {
          return this.entryGETData?.signupPacketId !== null;
        }
      );
      tabs.push(signupInfoTab);

      var messageTab = new SimpleTab('message', "Message", '', 
        () => {
         // alert("message id: " + this.messageId);
          this.currentTabId = 'message';
        },
        () => {
          return this.messageId !== '' && this.messageId !==  null;
        }
      );
      tabs.push(messageTab);
      
      this.tabs = tabs;
      this.showingTabset = true;
      this.currentTabId = this.getDefaultTabId();
   
    return tabs;
  }

  protected getDefaultTabId(): string {
    return 'details';
  }

  /**
   * Get the appropriate icon class based on catalog type
   */
  protected getCatalogTypeIcon(): string {
    if (!this.interestGETData?.catalogEntry?.catalogTypeCode) {
      return 'fas fa-heart';
    }

    const catalogTypeCode = this.interestGETData.catalogEntry.catalogTypeCode.toLowerCase();
    
    if (catalogTypeCode.includes('job') || catalogTypeCode.includes('position')) {
      return 'fas fa-briefcase';
    } else if (catalogTypeCode.includes('course') || catalogTypeCode.includes('class')) {
      return 'fas fa-graduation-cap';
    } else if (catalogTypeCode.includes('event') || catalogTypeCode.includes('meeting')) {
      return 'fas fa-calendar-alt';
    }
    
    return 'fas fa-heart';
  }

  getCurrentStateCode(): string {
    return this.interestGETData?.currentStateCode || '';
  }

  canCancelSignUp(): boolean {
    return this.getCurrentStateCode() === 'signupstarted' || this.getCurrentStateCode() === 'signupcompleted';
  }

  cancelSignUp(): void {
    alert("Cancleling signup");
  }

  /**
   * Determine if the Sign Up button should be shown
   */
  protected canSignUp(): boolean {
    if (!this.interestGETData?.catalogEntry) {
      return false;
    }
    if (this.getCurrentStateCode() !== 'initial') {
      return false;
    }
    const catalogEntry = this.interestGETData.catalogEntry;
    const catalogTypeCode = catalogEntry.catalogTypeCode?.toLowerCase() || '';
    const canSignUpTypes = ['course', 'event', 'program'];
    
    return canSignUpTypes.some(type => catalogTypeCode.includes(type)) && 
           catalogEntry.available === 1;
  }

  /**
   * Determine if the Apply button should be shown
   */
  protected canApply(): boolean {
    if (!this.interestGETData?.catalogEntry) {
      return false;
    }
    if (this.getCurrentStateCode() !== 'initial') {
      return false;
    }

    const catalogEntry = this.interestGETData.catalogEntry;
    const catalogTypeCode = catalogEntry.catalogTypeCode?.toLowerCase() || '';
    const canApplyTypes = ['job', 'position', 'program', 'admission'];
    
    return canApplyTypes.some(type => catalogTypeCode.includes(type)) && 
           catalogEntry.available === 1;
  }

  /**
   * Open the Sign Up modal
   */
  protected openSignUpModal(): void {
    this.signupFormData = {
      resumeId: undefined,
      allowingProviderToMessage: false
    };
    this.signupError = null;
    this.submittingSignup = false;

    if (!this.signupUIData && !this.loadingSignupUIData) {
      this.loadSignupUIData();
    }

    this.showSignUpModal = true;
  }

  /**
   * Close the Sign Up modal
   */
  protected closeSignUpModal(): void {
    this.showSignUpModal = false;
    this.signupFormData = {};
    this.signupError = null;
    this.submittingSignup = false;
  }

  /**
   * Check if signup form can be submitted
   */
  protected canSubmitSignup(): boolean {
    if (!this.signupUIData?.signupBehavior) {
      return false;
    }

    const behavior = this.signupUIData.signupBehavior;

    if (behavior.requiringResume && !this.signupFormData.resumeId) {
      return false;
    }

    return true;
  }

  /**
   * Submit the signup form
   */
  protected onSubmitSignup(): void {
    if (!this.canSubmitSignup() || this.submittingSignup) {
      return;
    }

    if (!this.signupUIData || !this.interestGETData) {
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
      catalogEntryInterestId: this.interestGETData.id || this.interestId,
      studentUserProfileId: userProfileId,
      resumeId: this.signupFormData.resumeId,
      consentToProviderMessaging: this.signupFormData.allowingProviderToMessage || false,
      consentToSendTranscript: this.signupUIData.signupBehavior?.consentingToSendTranscript ? 
        (this.signupFormData.allowingProviderToMessage || false) : undefined,
      signupMessage: undefined
    };

    this.hcclService.callCreateSignupRequest(signupData).subscribe({
      next: (response) => {
        console.log('Signup request created successfully:', response);
        this.submittingSignup = false;
        this.closeSignUpModal();
        this.loadInterestData();
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
  protected openApplyModal(): void {
    this.showApplyModal = true;
  }

  /**
   * Close the Apply modal
   */
  protected closeApplyModal(): void {
    this.showApplyModal = false;
  }

  /**
   * Load the SignupUIData
   */
  private loadSignupUIData(): void {
    if (!this.interestId) {
      return;
    }

    this.loadingSignupUIData = true;
    this.signupUIData = null;
    this.signupInstructionsHtml = null;

    this.hcclService.resolveSignupUIData(this.interestId).subscribe({
      next: (data) => {
        this.loadingSignupUIData = false;
        this.signupUIData = data;
        
        const instructionsMd = data?.signupPacket?.instructionsMd || 
                               data?.signupPacket?.signupInstructionsMD || '';
        
        if (instructionsMd) {
          const htmlContent = this.markdownToHtml(instructionsMd);
          this.signupInstructionsHtml = this.sanitizer.bypassSecurityTrustHtml(htmlContent);
        }
      },
      error: (err) => {
        console.error('Error loading signup UI data:', err);
        this.loadingSignupUIData = false;
      }
    });
  }

  /**
   * Convert markdown text to HTML
   */
  private markdownToHtml(markdown: string): string {
    if (!markdown) {
      return '';
    }

    let html = markdown;

    const escapeHtml = (text: string): string => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    };

    const codeBlocks: string[] = [];
    html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
      const id = `__CODE_BLOCK_${codeBlocks.length}__`;
      codeBlocks.push(escapeHtml(code));
      return id;
    });

    const inlineCodes: string[] = [];
    html = html.replace(/`([^`]+)`/g, (match, code) => {
      const id = `__INLINE_CODE_${inlineCodes.length}__`;
      inlineCodes.push(escapeHtml(code));
      return id;
    });

    html = escapeHtml(html);

    codeBlocks.forEach((code, index) => {
      html = html.replace(`__CODE_BLOCK_${index}__`, `<pre><code>${code}</code></pre>`);
    });

    inlineCodes.forEach((code, index) => {
      html = html.replace(`__INLINE_CODE_${index}__`, `<code>${code}</code>`);
    });

    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

    html = html.replace(/(?<!\*)\*(?!\*)([^*]+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
    html = html.replace(/(?<!_)_(?!_)([^_]+?)(?<!_)_(?!_)/g, '<em>$1</em>');

    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

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

    html = html.split('\n\n').map(para => {
      para = para.trim();
      if (para && !para.match(/^<(h[1-6]|ul|ol|pre|p)/)) {
        return `<p>${para}</p>`;
      }
      return para;
    }).join('');

    html = html.replace(/\n/g, '<br>');

    return html;
  }

}
