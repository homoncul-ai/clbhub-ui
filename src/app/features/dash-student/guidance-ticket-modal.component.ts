import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';
import { StdMdbDatepickerComponent } from '@app/components/_global/std-mdb-datepicker/std-mdb-datepicker.component';
import { HcclService, PersonalStatementCriteria, MenuControlDataList, MenuControlData, CreateTicketPOSTData, WorkItemFormResponse } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-guidance-ticket-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuControlDataListComponent, StdMdbFormTextComponent, StdMdbFormTextareaComponent, StdMdbDatepickerComponent],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">
        <i class="fas fa-life-ring me-2"></i>
        Request Help from Guidance
      </h5>
      <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
    </div>
    
    <div class="modal-body">
      <form (ngSubmit)="onSubmit()" #ticketForm="ngForm">
        <!-- Hidden field for userProfileId -->
        <input type="hidden" name="userProfileId" [(ngModel)]="userProfileId">
        
        <!-- Personal Statement Selection -->
        <div class="mb-4">
          <!-- <label class="form-label">
            <sup class="text-muted">† </sup>
            <span class="requiredField">* </span>
            Personal Statement
          </label> -->
          <app-menu-control-data-list 
            [menuControlDataList]="personalStatementMenu"
            placeholder="Select a personal statement..."
            (selectionChange)="onPersonalStatementChange($event)">
          </app-menu-control-data-list>
        </div>
        <!-- Title -->
        <div class="mb-4">
          <app-std-mdb-form-text
            prefix="guidanceTicket"
            name="title"
            label="Title"
            [required]="true"
            [maxlength]="255"
            placeholder="Enter a title for your guidance request"
            helpText="Title will be auto-populated from personal statement name. You can modify it if needed."
            [error]="error"
            [(ngModel)]="title">
          </app-std-mdb-form-text>
        </div>
        
        <!-- Notes/Description -->
        <div class="mb-4">
          <app-std-mdb-form-textarea
            prefix="guidanceTicket"
            name="notes"
            label="Notes"
            [required]="true"
            [rows]="6"
            [maxlength]="1024"
            [showCharCounter]="true"
            helpText="Personal statement content will be auto-populated. You can modify or add additional notes for your guidance request."
            [error]="error"
            [(ngModel)]="notes">
          </app-std-mdb-form-textarea>
        </div>
        
        <!-- Due Date  -->
        <div class="mb-4">
          <app-std-mdb-datepicker
            prefix="guidanceTicket"
            name="dueDate"
            label="Preferred Response Date"
            [required]="false"
            placeholder="MM/DD/YYYY"
            helpText="When would you like to receive a response? (Optional)"
            [(ngModel)]="dueDate">
          </app-std-mdb-datepicker>
        </div>
        
      </form>
    </div>
    
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="closeModal()">
        Cancel
      </button>
      <button type="button" class="btn btn-success" (click)="onSubmit()" [disabled]="!isFormValid()">
        <i class="fas fa-paper-plane me-2"></i>
        Submit Request
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
    
    .modal-footer {
      border-top: 1px solid rgba(0, 0, 0, 0.125);
      padding: 1rem 1.5rem;
    }
    
    .requiredField {
      color: #dc3545;
      font-weight: bold;
    }
    
    .form-label {
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
    
    .btn-success {
      background-color: #198754;
      border-color: #198754;
    }
    
    .btn-success:hover {
      background-color: #157347;
      border-color: #146c43;
    }
    
    .btn-success:disabled {
      background-color: #6c757d;
      border-color: #6c757d;
      opacity: 0.65;
    }
  `]
})
export class GuidanceTicketModalComponent implements OnInit {
  // Form data
  userProfileId: string = '';
  personalStatementId: string = '';
  title: string = '';
  notes: string = '';
  dueDate: string = '';
  
  // Personal statement menu data
  personalStatementMenu: MenuControlDataList | null = null;
  
  // Error handling
  error: any = null;
  
  // Inject services
  private hcclService = inject(HcclService);
  
  // Modal reference
  constructor(public modalRef: MdbModalRef<GuidanceTicketModalComponent>) {}
  
  ngOnInit(): void {
    // Get data from modal service if passed
    if (this.modalRef && (this.modalRef as any).data) {
      const data = (this.modalRef as any).data;
      this.userProfileId = data.userProfileId || '';
      this.personalStatementId = data.personalStatementId || '';
      this.title = data.title || '';
      this.notes = data.notes || '';
      this.dueDate = data.dueDate || '';
    }
    
    // Load personal statement menu
    this.loadPersonalStatementMenu();
  }
  
  /**
   * Load personal statement menu data
   */
  private async loadPersonalStatementMenu(): Promise<void> {
    try {
      const criteria: PersonalStatementCriteria = {
        parentEntityId: this.userProfileId
        // Add any specific criteria for personal statements
        // For now, we'll get all personal statements for the current user
      };
      
      const results = await this.hcclService.findPersonalStatements(criteria).toPromise();
      
      if (results?.searchResults) {
        // Convert search results to MenuControlDataList format
        const menuItems = results.searchResults.map(ps => ({
          id: ps.id || '',
          name: ps.name || 'Unnamed Personal Statement',
          helpText: (ps.description && ps.description !== '-' && ps.description.trim() !== '') ? ps.description : '',
          selected: false
        }));
        
        this.personalStatementMenu = {
          menuItems: menuItems,
          menuName: 'Personal Statements',
          label: 'Select a personal statement for guidance request'
        };
      }
    } catch (error) {
      console.error('Error loading personal statement menu:', error);
      this.error = {
        personalStatement: { errorMessage: 'Failed to load personal statements' }
      };
    }
  }
  
  /**
   * Handle personal statement selection change
   */
  onPersonalStatementChange(selectedItem: MenuControlData | null): void {
    if (selectedItem && selectedItem.id) {
      this.personalStatementId = selectedItem.id;
      console.log('Personal Statement selected:', selectedItem);
      
      // Set title to personal statement name
      this.title = selectedItem.name || '';
      
      // Load the selected personal statement and populate notes
      this.loadPersonalStatementData(selectedItem.id);
    } else {
      this.personalStatementId = '';
      this.title = ''; // Clear title when no personal statement is selected
      this.notes = ''; // Clear notes when no personal statement is selected
    }
  }
  
  /**
   * Load personal statement data and populate notes field
   */
  private async loadPersonalStatementData(personalStatementId: string): Promise<void> {
    try {
      const personalStatement = await this.hcclService.getPersonalStatementById(personalStatementId).toPromise();
      
      if (personalStatement) {
        // Set the notes field to the personal statement's encoding text
        this.notes = personalStatement.encodingText || personalStatement.rawText || '';
        console.log('Personal statement loaded:', {
          id: personalStatement.id,
          name: personalStatement.name,
          encodingText: personalStatement.encodingText,
          rawText: personalStatement.rawText
        });
      }
    } catch (error) {
      console.error('Error loading personal statement data:', error);
      // Don't show error to user, just log it and keep the form functional
    }
  }
  
  /**
   * Check if form is valid for submission
   */
  isFormValid(): boolean {
    return !!(this.personalStatementId && this.title?.trim() && this.notes?.trim());
  }
  
  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (!this.isFormValid()) {
      this.error = {
        title: { errorMessage: 'Please fill in all required fields' },
        notes: { errorMessage: 'Please fill in all required fields' }
      };
      return;
    }
    
    // Clear any previous errors
    this.error = null;
    
    // Prepare ticket data
    const ticketData = {
      title: this.title,
      userProfileId: this.userProfileId,
      personalStatementId: this.personalStatementId,
      notes: this.notes,
      dueDate: this.dueDate,
      timestamp: new Date().toISOString()
    };

    // Transform ticketData to CreateTicketPOSTData format
    const createTicketData: CreateTicketPOSTData = {
      title: ticketData.title,
      rawText: ticketData.notes,
      studentUserProfileId: ticketData.userProfileId,
      // Note: workRequestTypeId and queueId would need to be configured for guidance tickets
      // For now, we'll let the backend handle default values
    };
    
    console.log('Submitting guidance ticket:', createTicketData);
    
    // Call createStudentTicket service
    this.hcclService.createStudentTicket(ticketData.userProfileId, createTicketData).subscribe({
      next: (result: WorkItemFormResponse) => {
        console.log('Guidance ticket created successfully:', result);
        // Close modal with success result
        this.modalRef.close({
          success: true,
          ticketId: result.workRequestData?.id || result.context?.workRequestId,
          message: 'Guidance ticket submitted successfully!'
        });
      },
      error: (error) => {
        console.error('Error creating guidance ticket:', error);
        this.error = {
          general: { errorMessage: 'Failed to submit guidance ticket. Please try again.' }
        };
      }
    });
  }
  
  /**
   * Close the modal
   */
  closeModal(): void {
    this.modalRef.close();
  }
}
