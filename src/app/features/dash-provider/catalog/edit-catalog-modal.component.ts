import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { CatalogCrudComponent } from '@app/components/_crud/catalog/catalog-crud.component';
import { HcclContextService } from '@app/shell/services/hccl-context.service';

@Component({
  selector: 'app-edit-catalog-modal',
  standalone: true,
  imports: [CommonModule, CatalogCrudComponent],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">
        <i class="fas fa-edit me-2"></i>
        Edit Catalog
      </h5>
      <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
    </div>
    
    <div class="modal-body">
      <app-catalog-crud 
        #catalogCrud
        [id]="catalogId" 
        [organizationId]="getOrganizationId()"
        [modeName]="'edit'"
        [isModal]="true"
        (catalogUpdated)="onCatalogUpdated($event)"
        (cancelled)="closeModal()">
      </app-catalog-crud>
    </div>
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
export class EditCatalogModalComponent implements OnInit {
  private hcclContextService = inject(HcclContextService);
  
  // Modal reference for closing
  public modalRef = inject(MdbModalRef<EditCatalogModalComponent>);
  
  // Catalog ID to edit - passed via modal data
  public catalogId: string = '';
  
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
    this.modalRef.close({ success: false });
  }

  /**
   * Handle successful catalog update
   */
  onCatalogUpdated(catalogId: string): void {
    console.log('Catalog updated:', catalogId);
    this.modalRef.close({ success: true, catalogId });
  }
}

