import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CatalogEntrySignupPacketGETData,
  CatalogEntrySignupPacketPUTData,
  HcclService,
  MenuControlDataList,
} from '@app/restsvc/hccl.service';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';

interface SignupPacketEditModel {
  name: string;
  signupBehaviorCode: string;
  description: string;
  available: number;
  instructionsMd: string;
}

/**
 * Editable form for a single CatalogEntrySignupPacket. Emits `saved` after a
 * successful update. Leaf component (no dependency on signuppacket-ui) so it can
 * be hosted both inline and inside the edit modal without import cycles.
 */
@Component({
  selector: 'app-signuppacket-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuControlDataListComponent],
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

    <div class="sp-edit" *ngIf="packet && !loading">
      <div *ngIf="saveSuccess" class="alert alert-success py-2 mb-3">
        <i class="fas fa-check-circle me-2"></i>Signup packet saved.
      </div>
      <div *ngIf="saveError" class="alert alert-danger py-2 mb-3">
        <i class="fas fa-exclamation-circle me-2"></i>{{ saveError }}
      </div>

      <section class="sp-section">
        <h5 class="sp-section-title"><i class="fas fa-circle-info me-2"></i>Info</h5>
        <div class="mb-3">
          <label class="form-label">Name</label>
          <input type="text" class="form-control" [(ngModel)]="editModel.name" />
        </div>
        <div class="mb-3">
          <label class="form-label">Signup Behavior</label>
          <app-menu-control-data-list
            [menuControlDataList]="signupBehaviorSelectData"
            placeholder="Select a signup behavior..."
            [(ngModel)]="editModel.signupBehaviorCode">
          </app-menu-control-data-list>
        </div>
        <div class="mb-3">
          <label class="form-label">Description</label>
          <textarea class="form-control" rows="3" [(ngModel)]="editModel.description"></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label">Available</label>
          <select class="form-select" [(ngModel)]="editModel.available">
            <option [ngValue]="0">Unavailable</option>
            <option [ngValue]="1">Available</option>
            <option [ngValue]="2">Prototype</option>
          </select>
        </div>
      </section>

      <section class="sp-section">
        <h5 class="sp-section-title"><i class="fas fa-file-lines me-2"></i>Instructions</h5>
        <div class="mb-3">
          <label class="form-label">Instructions (Markdown)</label>
          <textarea class="form-control" rows="6" [(ngModel)]="editModel.instructionsMd"></textarea>
        </div>
      </section>

      <div class="sp-edit-actions">
        <button class="btn btn-primary" (click)="savePacket()" [disabled]="saving">
          <i *ngIf="saving" class="fas fa-spinner fa-spin me-2"></i>
          <i *ngIf="!saving" class="fas fa-save me-2"></i>
          {{ saving ? 'Saving...' : 'Save Signup Packet' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .sp-loading {
      display: flex;
      justify-content: center;
      padding: 24px;
    }

    .sp-section {
      padding: 16px 0;
      border-top: 1px solid #eef0f2;
    }

    .sp-section:first-of-type {
      border-top: none;
    }

    .sp-section-title {
      font-weight: 600;
      margin-bottom: 12px;
    }

    .sp-edit-actions {
      padding-top: 8px;
    }
  `],
})
export class SignupPacketEditComponent implements OnInit, OnChanges {
  @Input() id: string = '';

  @Output() saved = new EventEmitter<void>();

  private hcclService = inject(HcclService);

  packet: CatalogEntrySignupPacketGETData | null = null;
  loading = false;
  error = '';

  signupBehaviorSelectData: MenuControlDataList | null = null;

  editModel: SignupPacketEditModel = this.emptyEditModel();
  saving = false;
  saveSuccess = false;
  saveError: string | null = null;

  ngOnInit(): void {
    this.loadSetupData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id']) {
      this.loadPacket();
    }
  }

  private loadSetupData(): void {
    this.hcclService.getSignupPacketsSetupData().subscribe({
      next: (data) => {
        this.signupBehaviorSelectData = data?.signupBehaviorSelectData || null;
      },
      error: (err) => {
        console.error('Failed to load signup packet setup data:', err);
      },
    });
  }

  private loadPacket(): void {
    if (!this.id) {
      this.packet = null;
      return;
    }

    this.loading = true;
    this.error = '';
    this.saveSuccess = false;
    this.saveError = null;

    this.hcclService.getCatalogEntrySignupPacketById(this.id).subscribe({
      next: (packet) => {
        this.packet = packet;
        this.editModel = this.buildEditModel(packet);
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load signup packet:', err);
        this.error = 'Unable to load signup packet details.';
        this.loading = false;
      },
    });
  }

  private emptyEditModel(): SignupPacketEditModel {
    return {
      name: '',
      signupBehaviorCode: '',
      description: '',
      available: 1,
      instructionsMd: '',
    };
  }

  private buildEditModel(packet: CatalogEntrySignupPacketGETData): SignupPacketEditModel {
    return {
      name: packet.name || '',
      signupBehaviorCode: packet.signupBehaviorCode || '',
      description: packet.description || '',
      available: packet.available ?? 1,
      instructionsMd: packet.instructionsMd || '',
    };
  }

  savePacket(): void {
    if (!this.packet || !this.id || this.saving) {
      return;
    }

    this.saving = true;
    this.saveSuccess = false;
    this.saveError = null;

    const putData: CatalogEntrySignupPacketPUTData = {
      organizationId: this.packet.organizationId || '',
      catalogId: this.packet.catalogId,
      catalogEntryId: this.packet.catalogEntryId,
      fileGroupId: this.packet.fileGroupId,
      name: this.editModel.name,
      signupBehaviorCode: this.editModel.signupBehaviorCode,
      description: this.editModel.description,
      available: this.editModel.available ?? 1,
      instructionsMd: this.editModel.instructionsMd,
    };

    this.hcclService.updateCatalogEntrySignupPacketById(this.id, putData).subscribe({
      next: () => {
        this.saving = false;
        this.saveSuccess = true;
        if (this.packet) {
          this.packet.name = this.editModel.name;
          this.packet.signupBehaviorCode = this.editModel.signupBehaviorCode;
          this.packet.description = this.editModel.description;
          this.packet.available = this.editModel.available;
          this.packet.instructionsMd = this.editModel.instructionsMd;
        }
        this.saved.emit();
      },
      error: (err) => {
        console.error('Failed to save signup packet:', err);
        this.saving = false;
        this.saveError = 'Unable to save signup packet.';
      },
    });
  }
}
