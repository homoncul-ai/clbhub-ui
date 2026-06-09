import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { CatalogEntrySignupPacketGETData, HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { SignupPacketEditModalComponent } from './signuppacket-edit-modal.component';

/**
 * Displays a single CatalogEntrySignupPacket with a name header and a tabset
 * (Details, Instructions). If `canEdit` is true an Edit button opens the
 * editable form (signuppacket-ui readonly=false) in a modal.
 */
@Component({
  selector: 'app-signuppacket-tabset-ui',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent],
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

    <div class="sp-ui" *ngIf="packet && !loading">
      <!-- Header: name + edit -->
      <div class="sp-header d-flex justify-content-between align-items-start">
        <div>
          <h2 class="sp-name">{{ packet.name }}</h2>
          <span class="badge bg-secondary" *ngIf="packet.signupBehaviorCode">{{ packet.signupBehaviorCode }}</span>
        </div>
        <button *ngIf="canEdit" type="button" class="btn btn-outline-primary btn-sm" (click)="openEditModal()">
          <i class="fas fa-pen me-2"></i>Edit
        </button>
      </div>

      <!-- Tabset -->
      <app-simple-tabset
        [tabs]="tabs"
        [currentTabId]="currentTabId"
        (tabSelected)="selectTab($event)">
      </app-simple-tabset>

      <div class="sp-tab-content">
        <!-- Details -->
        <div *ngIf="currentTabId === 'details'">
          <dl class="sp-grid">
            <dt>Description</dt>
            <dd>{{ packet.description || '—' }}</dd>
            <dt>Available</dt>
            <dd>{{ availableLabel(packet.available) }}</dd>
            <dt>Signup Behavior</dt>
            <dd>{{ packet.signupBehaviorCode || '—' }}</dd>
          </dl>
        </div>

        <!-- Instructions -->
        <div *ngIf="currentTabId === 'instructions'">
          <div class="sp-pre" *ngIf="packet.instructionsMd; else noInstructions">{{ packet.instructionsMd }}</div>
          <ng-template #noInstructions>
            <p class="text-muted">No instructions provided.</p>
          </ng-template>
        </div>
      </div>
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

    .sp-tab-content {
      padding-top: 16px;
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
export class SignupPacketTabsetUiComponent implements OnChanges {
  @Input() id: string = '';
  @Input() canEdit: boolean = false;

  @Output() saved = new EventEmitter<void>();

  private hcclService = inject(HcclService);
  private modalService = inject(MdbModalService);

  packet: CatalogEntrySignupPacketGETData | null = null;
  loading = false;
  error = '';

  currentTabId = 'details';
  tabs: SimpleTab[] = this.buildTabs();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id']) {
      this.currentTabId = 'details';
      this.loadPacket();
    }
  }

  private buildTabs(): SimpleTab[] {
    return [
      new SimpleTab('details', 'Details', '', () => (this.currentTabId = 'details'), () => true),
      new SimpleTab('instructions', 'Instructions', '', () => (this.currentTabId = 'instructions'), () => true),
    ];
  }

  selectTab(tabId: string): void {
    this.currentTabId = tabId;
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
   * Open the editable signup packet form (signuppacket-ui readonly=false) in a
   * modal. After it closes following a save, reload so the view reflects it.
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
        this.saved.emit();
      }
    });
  }
}
