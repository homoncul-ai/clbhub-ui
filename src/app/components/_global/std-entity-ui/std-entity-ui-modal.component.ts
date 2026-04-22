import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { StdEntityUiComponent } from './std-entity-ui.component';

/**
 * Generic modal wrapper for std-entity-ui.
 *
 * Open via MdbModalService:
 *   this.modalService.open(StdEntityUiModalComponent, {
 *     modalClass: 'modal-xl',
 *     data: { entityType: 'hcclorganization', entityId: '...', title: 'Organization Details' }
 *   });
 */
@Component({
  selector: 'app-std-entity-ui-modal',
  standalone: true,
  imports: [CommonModule, StdEntityUiComponent],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">{{ title }}</h5>
      <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <app-std-entity-ui
        *ngIf="entityType && entityId"
        [entityType]="entityType"
        [entityId]="entityId"
        [readonly]="true">
      </app-std-entity-ui>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="closeModal()">Close</button>
    </div>
  `,
  styles: [`
    .modal-header {
      display: flex;
      align-items: center;
    }
  `]
})
export class StdEntityUiModalComponent implements OnInit {
  entityType: string = '';
  entityId: string = '';
  title: string = 'Details';

  constructor(
    public modalRef: MdbModalRef<StdEntityUiModalComponent>
  ) {}

  ngOnInit(): void {
    const data = (this.modalRef as any).data;
    if (data) {
      this.entityType = data.entityType || '';
      this.entityId = data.entityId || '';
      this.title = data.title || 'Details';
    }
  }

  closeModal(): void {
    this.modalRef.close();
  }
}
