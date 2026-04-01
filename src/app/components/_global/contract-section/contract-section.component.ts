import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import {
  ConsentRequestGETData,
  ConsentRequestPOSTData,
  MultiConsentRequestGETData,
} from '@app/restsvc/hccl.service';
import { ContractViewerModalComponent } from './contract-viewer-modal.component';

@Component({
  selector: 'app-contract-section',
  standalone: true,
  imports: [CommonModule, ContractViewerModalComponent],
  templateUrl: './contract-section.component.html',
  styleUrl: './contract-section.component.scss',
})
export class ContractSectionComponent implements OnChanges {
  @Input() consents: MultiConsentRequestGETData | null = null;
  @Input() disabled = false;

  @Output() consentSelectionChange = new EventEmitter<ConsentRequestPOSTData[]>();
  @Output() allAcceptedChange = new EventEmitter<boolean>();

  acceptedById: Record<string, boolean> = {};
  activeContract: ConsentRequestGETData | null = null;

  ngOnChanges(): void {
    const contracts = this.contracts;
    for (const contract of contracts) {
      const id = this.getContractId(contract);
      if (id && this.acceptedById[id] === undefined) {
        this.acceptedById[id] = false;
      }
    }
    this.emitState();
  }

  get contracts(): ConsentRequestGETData[] {
    return this.consents?.contracts || [];
  }

  get hasContracts(): boolean {
    return this.contracts.length > 0;
  }

  getContractId(contract: ConsentRequestGETData): string {
    return String(contract.contractVersionId || contract.title || '').trim();
  }

  isAccepted(contract: ConsentRequestGETData): boolean {
    const id = this.getContractId(contract);
    return id ? !!this.acceptedById[id] : false;
  }

  onConsentChange(contract: ConsentRequestGETData, checked: boolean): void {
    if (this.disabled) {
      return;
    }
    const id = this.getContractId(contract);
    if (!id) {
      return;
    }
    this.acceptedById[id] = checked;
    this.emitState();
  }

  openContract(contract: ConsentRequestGETData): void {
    this.activeContract = contract;
  }

  closeContract(): void {
    this.activeContract = null;
  }

  private emitState(): void {
    const selectedConsents: ConsentRequestPOSTData[] = this.contracts
      .map((contract) => {
        const id = this.getContractId(contract);
        if (!id || !this.acceptedById[id]) {
          return null;
        }
        return {
          contractVersionId: id,
          agreeValue: 'accepted',
          consenting: true,
        } as ConsentRequestPOSTData;
      })
      .filter((item): item is ConsentRequestPOSTData => !!item);

    this.consentSelectionChange.emit(selectedConsents);
    this.allAcceptedChange.emit(!this.hasContracts || selectedConsents.length === this.contracts.length);
  }
}
