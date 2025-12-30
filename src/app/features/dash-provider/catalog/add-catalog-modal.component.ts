import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { CatalogCrudComponent } from '@app/components/_crud/catalog/catalog-crud.component';
import { HcclContextService } from '@app/shell/services/hccl-context.service';

@Component({
  selector: 'app-add-catalog-modal',
  standalone: true,
  imports: [CommonModule, CatalogCrudComponent],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">
        <i class="fas fa-plus-circle me-2"></i>
        Add New Catalog
      </h5>
      <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
    </div>
    
    <div class="modal-body">
      <app-catalog-crud 
        #catalogCrud
        [id]="''" 
        [organizationId]="getOrganizationId()"
        [modeName]="'create'">
      </app-catalog-crud>
    </div>
    
    <!-- <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="closeModal()">
        <i class="fas fa-times me-1"></i>
        Close
      </button>
    </div> -->
  `,
  styles: [`
    .modal-header {
      background-color: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
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
      background-color: #f8f9fa;
      border-top: 1px solid #dee2e6;
    }
  `]
})
export class AddCatalogModalComponent implements OnInit {
  private hcclContextService = inject(HcclContextService);
  
  // Modal reference for closing
  public modalRef = inject(MdbModalRef<AddCatalogModalComponent>);
  
  @ViewChild('catalogCrud') catalogCrud!: CatalogCrudComponent;

  ngOnInit(): void {
    // Component initialization
  }

  /**
   * Get the organization ID from the current user context
   */
  getOrganizationId(): string {
    const userProfile = this.hcclContextService.getCurrentUserProfile();
    return userProfile?.organizationId || '';
  }

  /**
   * Close the modal
   */
  closeModal(): void {
    this.modalRef.close({ success: true });
  }
}
