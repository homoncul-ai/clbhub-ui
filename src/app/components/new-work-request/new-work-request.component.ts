import { Component, OnInit, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HcclService } from '../../restsvc/hccl.service';
import { HcclContextService } from '../../shell/services/hccl-context.service';
import { 
  CreateTicketPOSTData, 
  CreateTicketSetupUIData, 
  WorkRequestGETData,
  MenuControlData,
  HcclUserContextGETData
} from '../../restsvc/hccl.service';
import { MenuControlDataListComponent } from '../_global/menu-control-data-list/menu-control-data-list.component';
import { HcclUserProfileDetailsComponent } from '../hccl-user-profile-details/hccl-user-profile-details.component';

// //
// This component is used to create a new work request.
// Use the object /tixui/create-ticket-setup-ui to create the work request.
// Call /tixui/create-ticket-setup-ui - use a randomuuid for the CreateTicketPOSTData.advocateUserProfileId
// 
// Use the data from CreateTicketSetupUIData to create the form.
// on submit, call /tixui/create-ticket with the data from the form in CreateTicketPOSTData,
// Textbox for title, textarea for rawText, and a dropdown for workRequestTypeId, 
// and a dropdown for workQueueId.  use the new component menu-control-data-list for the dropdowns.
//  
//  
@Component({
  selector: 'app-new-work-request',
  imports: [CommonModule, FormsModule, MenuControlDataListComponent, HcclUserProfileDetailsComponent],
  templateUrl: './new-work-request.component.html',
  styleUrl: './new-work-request.component.scss'
})
export class NewWorkRequestComponent implements OnInit {
  @Input() advocateUserProfileId?: string;
  @Input() clientUserProfileId?: string;

  setupData: CreateTicketSetupUIData | null = null; 
  formData: CreateTicketPOSTData = {
    title: '',
    rawText: '',
    workRequestTypeId: '',
    queueId: ''
  };
  
  loading = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';
  
  selectedWorkRequestType: MenuControlData | null = null;
  selectedWorkQueue: MenuControlData | null = null;

  private hcclService = inject(HcclService);
  private hcclContextService = inject(HcclContextService);
  constructor() {}

  ngOnInit(): void {
    this.hcclContextService.waitForReady() .then(() => {  
      var hcclContext: HcclUserContextGETData = this.hcclContextService.getContext();
      //alert('NewWorkRequestComponent hcclContext:' + hcclContext.currentUserProfileId);
      if (hcclContext && hcclContext.currentUserProfileId) {
      this.loadSetupData(hcclContext.currentUserProfileId);
    } else {
      alert('NewWorkRequestComponent No user context found');
    }
  });
  }

   

  private loadSetupData(advocateUserProfileId: string): void {
    // Create initial data with the resolved advocateUserProfileId
     
    const initialData: CreateTicketPOSTData = {
      advocateUserProfileId: advocateUserProfileId,
      studentUserProfileId: this.clientUserProfileId,
      title: '',
      rawText: '',
      workRequestTypeId: '',
      queueId: ''
    };

    this.hcclService.getCreateTicketSetupUi(initialData).subscribe({
      next: (data: CreateTicketSetupUIData) => {
        this.setupData = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading setup data:', error);
        alert('Error loading setup data:' + error.message);
        this.errorMessage = 'Failed to load form setup data. Please try again.';
        this.loading = false;
      }
    });
  }

  onWorkRequestTypeChange(selectedItem: MenuControlData | null): void {
    this.selectedWorkRequestType = selectedItem;
    this.formData.workRequestTypeId = selectedItem?.id || '';
  }

  onWorkQueueChange(selectedItem: MenuControlData | null): void {
    this.selectedWorkQueue = selectedItem;
    this.formData.queueId = selectedItem?.id || '';
  }

  onSubmit(): void {
    debugger
    if (!this.isFormValid()) {
      return;
    }

    this.loading = true;
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Use the context data if available, otherwise use the inputs
   
    if (this.clientUserProfileId) {
      this.formData.studentUserProfileId = this.clientUserProfileId;
    }
    this.formData.advocateUserProfileId = this.hcclContextService.getContext().currentUserProfileId;
    console.log('creatTicket formData:' + this.formData);
    this.hcclService.createTicket(this.formData).subscribe({
      next: (result: WorkRequestGETData) => {
        this.loading = false;
        this.successMessage = `Work request created successfully! ID: ${result.id}`;
        this.resetForm();
      },
      error: (error) => {
        console.error('Error creating work request:', error);
        this.errorMessage = 'Failed to create work request. Please try again.';
        this.loading = false;
      }
    });
  }
  public getUserContext(): HcclUserContextGETData  {
    return this.hcclContextService.getContext();
  }
  private isFormValid(): boolean {
    return !!(
      this.formData.title?.trim() &&
      this.formData.rawText?.trim() &&
      this.formData.workRequestTypeId &&
      this.formData.queueId
    );
  }

  resetForm(): void {
    this.formData = {
      title: '',
      rawText: '',
      workRequestTypeId: '',
      queueId: ''
    };
    this.selectedWorkRequestType = null;
    this.selectedWorkQueue = null;
    this.submitted = false;
  }

  private generateRandomUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
 
}
