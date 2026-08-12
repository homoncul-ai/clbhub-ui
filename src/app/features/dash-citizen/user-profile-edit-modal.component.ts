import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { HcclUserProfileCrudWrapper } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { HcclService, HcclUserProfilePUTData } from '@app/restsvc/hccl.service';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';

@Component({
  selector: 'app-user-profile-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, StdMdbFormTextComponent],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">
        <i class="fas fa-user-edit me-2"></i>
        Edit Citizen Information
      </h5>
      <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
    </div>
    
    <div class="modal-body">
      <!-- Loading State -->
      <div *ngIf="loading" class="text-center py-4">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">Loading user profile...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error && !loading" class="alert alert-danger" role="alert">
        <i class="fas fa-exclamation-triangle me-2"></i>
        {{ error }}
      </div>

      <!-- Form -->
      <form *ngIf="!loading && !error && wrapper" (ngSubmit)="onSave()" #editForm="ngForm">
        <div class="row">
          <!-- Column 1 -->
          <div class="col-md-6">
            <div class="mb-3">
              <app-std-mdb-form-text
                prefix="userProfileEdit"
                name="name"
                label="Name"
                [required]="true"
                [maxLength]="255"
                placeholder="Enter name"
                [error]="error"
                [(ngModel)]="name">
              </app-std-mdb-form-text>
            </div>
            
            <div class="mb-3">
              <app-std-mdb-form-text
                prefix="userProfileEdit"
                name="messageHandle"
                label="Message Handle"
                [required]="false"
                [maxLength]="255"
                placeholder="Enter message handle"
                [error]="error"
                [(ngModel)]="messageHandle">
              </app-std-mdb-form-text>
            </div>
          </div>

          <!-- Column 2 -->
          <div class="col-md-6">
            <div class="mb-3">
              <app-std-mdb-form-text
                prefix="userProfileEdit"
                name="userEmail"
                label="Email"
                [required]="false"
                [maxLength]="255"
                placeholder="Enter email address"
                [error]="error"
                [(ngModel)]="userEmail">
              </app-std-mdb-form-text>
            </div>
            
            <div class="mb-3">
              <app-std-mdb-form-text
                prefix="userProfileEdit"
                name="cellPhoneNumber"
                label="Cell Phone"
                [required]="false"
                [maxLength]="50"
                placeholder="Enter cell phone number"
                [error]="error"
                [(ngModel)]="cellPhoneNumber">
              </app-std-mdb-form-text>
            </div>
            
            <div class="mb-3">
              <app-std-mdb-form-text
                prefix="userProfileEdit"
                name="workPhoneNumber"
                label="Work Phone"
                [required]="false"
                [maxLength]="50"
                placeholder="Enter work phone number"
                [error]="error"
                [(ngModel)]="workPhoneNumber">
              </app-std-mdb-form-text>
            </div>
          </div>
        </div>
      </form>
    </div>
    
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="closeModal()">
        Cancel
      </button>
      <button 
        type="button" 
        class="btn btn-primary" 
        (click)="onSave()"
        [disabled]="loading || saving || !wrapper">
        <i class="fas fa-save me-2" *ngIf="!saving"></i>
        <span class="spinner-border spinner-border-sm me-2" *ngIf="saving" role="status" aria-hidden="true"></span>
        {{ saving ? 'Saving...' : 'Save' }}
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
      max-height: 70vh;
      overflow-y: auto;
    }
    
    .modal-footer {
      border-top: 1px solid rgba(0, 0, 0, 0.125);
      padding: 1rem 1.5rem;
    }

    .spinner-border-sm {
      width: 1rem;
      height: 1rem;
    }
  `]
})
export class UserProfileEditModalComponent implements OnInit {
  private hcclService = inject(HcclService);
  
  userProfileId: string = '';
  wrapper: HcclUserProfileCrudWrapper | null = null;
  loading: boolean = false;
  saving: boolean = false;
  error: any = null;

  // Form properties
  name: string = '';
  messageHandle: string = '';
  userEmail: string = '';
  cellPhoneNumber: string = '';
  workPhoneNumber: string = '';
  
  constructor(public modalRef: MdbModalRef<UserProfileEditModalComponent>) {}
  
  ngOnInit(): void {
    // Get userProfileId from modal data if passed
    if (this.modalRef && (this.modalRef as any).data) {
      const data = (this.modalRef as any).data;
      this.userProfileId = data.userProfileId || '';
    }

    if (this.userProfileId) {
      this.loadUserProfile();
    } else {
      this.error = 'User profile ID is required';
    }
  }

  /**
   * Load user profile data using the wrapper
   */
  private async loadUserProfile(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      this.wrapper = await HcclUserProfileCrudWrapper.newInstance(this.userProfileId, this.hcclService);
      
      // Populate form fields from wrapper
      const data = this.wrapper.getData();
      this.name = data.theUser?.name || '';
      this.messageHandle = data.messageHandle || '';
      this.userEmail = data.userEmail || '';
      this.cellPhoneNumber = data.cellPhoneNumber || '';
      this.workPhoneNumber = data.workPhoneNumber || '';
      
      this.loading = false;
    } catch (err: any) {
      console.error('Error loading user profile:', err);
      this.error = err?.message || 'Failed to load user profile';
      this.loading = false;
    }
  }

  /**
   * Save the user profile changes
   */
  async onSave(): Promise<void> {
    if (!this.wrapper) {
      this.error = 'User profile data not loaded';
      return;
    }

    this.saving = true;
    this.error = null;

    try {
      // Update wrapper data with form values
      const data = this.wrapper.getData();
      
      // Update name in theUser
      if (data.theUser) {
        data.theUser.name = this.name;
      }
      
      data.messageHandle = this.messageHandle;
      data.userEmail = this.userEmail;
      data.cellPhoneNumber = this.cellPhoneNumber;
      data.workPhoneNumber = this.workPhoneNumber;

      // Create PUT data
      const putData: HcclUserProfilePUTData = {
        messageHandle: data.messageHandle || '',
        userId: data.userId || '',
        userCode: data.userCode || '',
        organizationId: data.organizationId || '',
        profileTypeCode: data.profileTypeCode || '',
        userEmail: data.userEmail,
        cellPhoneNumber: data.cellPhoneNumber,
        workPhoneNumber: data.workPhoneNumber,
        externalUserId: data.externalUserId,
        externalUserEntityType: data.externalUserEntityType,
        externalUserName: data.externalUserName,
        available: data.available || 1,
        personId: data.personId || '',
        name: this.name || ''
      };

      // Save using service
      await this.hcclService.updateHcclUserProfileById(data.id || '', putData).toPromise();
      
      this.saving = false;
      this.modalRef.close('saved');
    } catch (err: any) {
      console.error('Error saving user profile:', err);
      this.error = err?.message || 'Failed to save user profile';
      this.saving = false;
    }
  }
  
  closeModal(): void {
    this.modalRef.close();
  }
}
