import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Router } from '@angular/router';
import { CatalogEntrySignupPacketCrudComponent } from './catalogentrysignuppacket-crud.component';

@Component({
  selector: 'app-catalogentrysignuppacket-create-modal',
  standalone: true,
  imports: [CommonModule, CatalogEntrySignupPacketCrudComponent],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">
        <i class="fas fa-plus-circle me-2"></i>
        Create Catalog Entry Signup Packet
      </h5>
      <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
    </div>
    
    <div class="modal-body">
      <app-catalogentrysignuppacket-crud 
        [modeName]="'create'"
        (entityCreated)="onEntityCreated($event)">
      </app-catalogentrysignuppacket-crud>
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
  `]
})
export class CatalogEntrySignupPacketCreateModalComponent implements OnInit {
  private router = inject(Router);
  
  constructor(public modalRef: MdbModalRef<CatalogEntrySignupPacketCreateModalComponent>) {}
  
  ngOnInit(): void {
  }
  
  /**
   * Handle entity created event from the CRUD component
   */
  onEntityCreated(event: any): void {
    console.log('Entity created, closing modal', event);
    // Close modal and signal that refresh is needed
    this.modalRef.close({ created: true, entity: event });
  }
  
  /**
   * Close the modal
   */
  closeModal(): void {
    this.modalRef.close({ created: false });
  }
}

