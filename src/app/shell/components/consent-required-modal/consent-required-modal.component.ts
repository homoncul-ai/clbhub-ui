import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ContractSectionComponent } from '@app/components/_global/contract-section/contract-section.component';
import {
  ConsentRequestPOSTData,
  MultiConsentRequestGETData,
} from '@app/restsvc/hccl.service';

/**
 * Blocking shell modal shown when the active HCCLUserProfile has unsigned consents.
 * Uses ContractSectionComponent for checkbox + contract viewer UI.
 */
@Component({
  selector: 'app-consent-required-modal',
  standalone: true,
  imports: [CommonModule, ContractSectionComponent],
  templateUrl: './consent-required-modal.component.html',
  styleUrl: './consent-required-modal.component.scss',
})
export class ConsentRequiredModalComponent implements OnChanges {
  @Input() open = false;
  @Input() consents: MultiConsentRequestGETData | null = null;
  @Input() submitting = false;

  @Output() accept = new EventEmitter<ConsentRequestPOSTData[]>();

  /** TEMP: remove when real accept flow is fully wired/trusted. */
  @Output() dismiss = new EventEmitter<void>();

  selectedConsents: ConsentRequestPOSTData[] = [];
  allAccepted = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['consents'] || changes['open']) {
      this.selectedConsents = [];
      this.allAccepted = !(this.consents?.contracts?.length || 0);
    }
  }

  onConsentSelectionChange(consents: ConsentRequestPOSTData[]): void {
    this.selectedConsents = consents;
  }

  onAllAcceptedChange(isAccepted: boolean): void {
    this.allAccepted = isAccepted;
  }

  onAccept(): void {
    if (!this.allAccepted || this.submitting) {
      return;
    }
    this.accept.emit(this.selectedConsents);
  }

  onTempDismiss(): void {
    this.dismiss.emit();
  }
}
