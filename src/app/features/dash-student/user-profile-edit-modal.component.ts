import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { HcclUserProfileCrudComponent } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';

@Component({
  selector: 'app-user-profile-edit-modal',
  standalone: true,
  imports: [CommonModule, HcclUserProfileCrudComponent],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">
        <i class="fas fa-user-edit me-2"></i>
        Edit Student Information
      </h5>
      <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
    </div>
    
    <div class="modal-body"> 
      <app-hccluserprofile-crud 
        [id]="this.userProfileId" 
        [modeName]="'edit'">
      </app-hccluserprofile-crud>
    </div>
    
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="closeModal()">
        Close
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
  `]
})
export class UserProfileEditModalComponent implements OnInit {
  userProfileId: string = '';
  
  constructor(public modalRef: MdbModalRef<UserProfileEditModalComponent>) {}
  
  ngOnInit(): void {
    // Get userProfileId from modal data if passed
    if (this.modalRef && (this.modalRef as any).data) {
      const data = (this.modalRef as any).data;
      this.userProfileId = data.userProfileId || '';
    }
  }
  
  closeModal(): void {
    this.modalRef.close();
  }
}

