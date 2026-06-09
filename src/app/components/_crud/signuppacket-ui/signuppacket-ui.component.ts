import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { CatalogEntrySignupPacketGETData, HcclService } from '@app/restsvc/hccl.service';
import { SignupPacketEditComponent } from './signuppacket-edit.component';
import { SignupPacketEditModalComponent } from './signuppacket-edit-modal.component';

/**
 * Displays a single CatalogEntrySignupPacket.
 *
 * When `readonly` is true (default) it shows the packet details. If `canEdit`
 * is also true, an Edit button opens the editable form in a modal.
 *
 * When `readonly` is false it renders the editable form (app-signuppacket-edit).
 */
@Component({
  selector: 'app-signuppacket-ui',
  standalone: true,
  imports: [CommonModule, SignupPacketEditComponent],
  template: `
    <div *ngIf="loading" class="sp-loading">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div *ngIf="error && !loading" class="alert alert-danger" role="alert">
      <i class="fas fa-exclamation-triangle me-2"></i>
      {{ error }}
    </div>

    <!-- READ-ONLY VIEW -->
    <div class="sp-ui" *ngIf="packet && !loading && readonly">
      <div class="sp-header d-flex justify-content-between align-items-start">
        <div>
          <h4 class="sp-name">{{ packet.name }}</h4>
          <span class="badge bg-secondary" *ngIf="packet.signupBehaviorCode">{{ packet.signupBehaviorCode }}</span>
        </div>
        <button *ngIf="canEdit" type="button" class="btn btn-outline-primary btn-sm" (click)="openEditModal()">
          <i class="fas fa-pen me-2"></i>Edit
        </button>
      </div>

      <dl class="sp-grid">
        <dt>Description</dt>
        <dd>{{ packet.description || '—' }}</dd>
        <dt>Available</dt>
        <dd>{{ availableLabel(packet.available) }}</dd>
        <dt>Instructions</dt>
        <dd class="sp-pre">{{ packet.instructionsMd || '—' }}</dd>
      </dl>
    </div>

    <!-- EDIT VIEW -->
    <div class="sp-ui" *ngIf="!readonly">
      <app-signuppacket-edit
        [id]="id"
        (saved)="saved.emit()">
      </app-signuppacket-edit>
    </div>
  `,
  styles: [`
    .sp-loading {
      display: flex;
      justify-content: center;
      padding: 24px;
    }

    .sp-header {
      margin-bottom: 16px;
    }

    .sp-name {
      margin: 0 0 4px 0;
      font-weight: 700;
    }

    .sp-grid {
      display: grid;
      grid-template-columns: 160px 1fr;
      gap: 8px 16px;
      margin: 0;
    }

    .sp-grid dt {
      font-weight: 600;
      color: #4b5563;
    }

    .sp-grid dd {
      margin: 0;
    }

    .sp-pre {
      white-space: pre-wrap;
    }
  `],
})
export class SignupPacketUiComponent implements OnChanges {
  @Input() id: string = '';
  @Input() readonly: boolean = true;
  @Input() canEdit: boolean = false;

  @Output() saved = new EventEmitter<void>();

  private hcclService = inject(HcclService);
  private modalService = inject(MdbModalService);

  packet: CatalogEntrySignupPacketGETData | null = null;
  loading = false;
  error = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id']) {
      this.loadPacket();
    }
  }

  private loadPacket(): void {
    if (!this.id) {
      this.packet = null;
      return;
    }

    this.loading = true;
    this.error = '';

    this.hcclService.getCatalogEntrySignupPacketById(this.id).subscribe({
      next: (packet) => {
        this.packet = packet;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load signup packet:', err);
        this.error = 'Unable to load signup packet details.';
        this.loading = false;
      },
    });
  }

  availableLabel(available: number | undefined): string {
    switch (available) {
      case 0: return 'Unavailable';
      case 1: return 'Available';
      case 2: return 'Prototype';
      default: return '—';
    }
  }

  /**
   * Open the editable signup packet form in a modal. After it closes following
   * a save, reload so the read-only view reflects the changes.
   */
  openEditModal(): void {
    if (!this.id) {
      return;
    }
    const modalRef = this.modalService.open(SignupPacketEditModalComponent, {
      modalClass: 'modal-lg',
      data: {
        id: this.id,
        title: this.packet?.name || 'Edit Signup Packet',
      },
    });

    modalRef.onClose.subscribe((result: any) => {
      if (result) {
        this.loadPacket();
      }
    });
  }
}
