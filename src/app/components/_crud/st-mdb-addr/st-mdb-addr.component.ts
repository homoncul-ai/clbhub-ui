import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MapAddrUiComponent } from '@app/components/_crud/map-addr-ui/map-addr-ui.component';
import {
  HcclAddrGETData,
  HcclAddrPOSTData,
  HcclAddrPUTData,
  HcclService,
  OnboardAddressResponse,
  SimpleMapEntryResponse,
} from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-st-mdb-addr',
  standalone: true,
  imports: [CommonModule, FormsModule, MapAddrUiComponent],
  templateUrl: './st-mdb-addr.component.html',
  styleUrl: './st-mdb-addr.component.scss',
})
export class StMdbAddrComponent implements OnInit, OnChanges {
  @Input('id') hcclAddrId: string | null = null;
  @Input() parentEntityType: string | null = null;
  @Input() parentEntityId: string | null = null;
  @Input() addrTypeCode = '';
  @Input('readonly') readonlyInput: boolean | null = null;
  @Input() addrSingleLine: string | null = null;
  @Input() title = 'Address';
  @Output() addrCreated = new EventEmitter<string>();

  protected hcclService = inject(HcclService);

  hcclAddr: HcclAddrGETData | null = null;
  addrToSubmit: HcclAddrPOSTData = {};
  editableSingleLine = '';
  loading = false;
  lookupLoading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  private lastSavedState: HcclAddrPOSTData = {};
  private initialized = false;

  get isReadonly(): boolean {
    if (this.readonlyInput === null || this.readonlyInput === undefined) {
      return !!this.hcclAddrId;
    }
    return this.readonlyInput;
  }

  get showReadonlyLayout(): boolean {
    return this.isReadonly && !!this.hcclAddrId;
  }

  get mapEntryResponse(): SimpleMapEntryResponse {
    if (!this.hcclAddr) {
      return { searchResults: [] };
    }

    return {
      searchResults: [{
        color: 'blue',
        title: this.hcclAddr.entityDisplayName || this.hcclAddr.parentEntityName || this.hcclAddr.addrSingleLine || this.title,
        text: this.hcclAddr.addrSingleLine || '',
        geolocationLatitude: this.hcclAddr.geolocationLatitude,
        geolocationLongitude: this.hcclAddr.geolocationLongitude,
        entityType: this.hcclAddr.entityType || this.hcclAddr.parentEntityType,
        entityId: this.hcclAddr.id || this.hcclAddrId || undefined,
        showingLink: true,
      }]
    };
  }

  ngOnInit(): void {
    this.resolveAddressState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.initialized) {
      return;
    }

    if (changes['hcclAddrId']) {
      this.resolveAddressState();
      return;
    }

    if (!this.hcclAddrId && (changes['parentEntityType'] || changes['parentEntityId'] || changes['addrTypeCode'])) {
      this.resolveAddressState();
      return;
    }

    if (changes['addrSingleLine'] && this.addrSingleLine !== null && this.addrSingleLine !== undefined) {
      this.editableSingleLine = this.addrSingleLine;
      this.onAddrSingleLineChanged(this.addrSingleLine);
    }
  }

  onSingleLineInputChange(value: string): void {
    this.editableSingleLine = value;
    this.addrToSubmit = {
      ...this.addrToSubmit,
      addrSingleLine: value,
    };
    this.hcclAddr = {
      ...(this.hcclAddr || {}),
      addrSingleLine: value,
    };
  }

  onAddrSingleLineChanged(addrSingleLine: string): void {
    const singleLine = (addrSingleLine || '').trim();
    this.addrToSubmit = {
      ...this.addrToSubmit,
      addrSingleLine: singleLine,
    };
    this.hcclAddr = {
      ...(this.hcclAddr || {}),
      addrSingleLine: singleLine,
    };

    if (!singleLine) {
      return;
    }

    this.lookupLoading = true;
    this.errorMessage = '';
    this.hcclService.lookupAddress(singleLine).subscribe({
      next: (response: OnboardAddressResponse) => {
        if (response?.hcclAddr) {
          this.mergeAddressFields(response.hcclAddr);
        }
        this.lookupLoading = false;
      },
      error: (error) => {
        console.error('lookupAddress failed', error);
        this.lookupLoading = false;
        this.errorMessage = 'Unable to resolve the address text.';
      },
    });
  }

  onSaveButtonClick(): void {
    this.onSaveAddress();
  }

  onSaveAddress(): void {
    if (this.showReadonlyLayout) {
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.hcclAddrId) {
      const putData: HcclAddrPUTData = { ...this.addrToSubmit };
      this.hcclService.updateHcclAddrById(this.hcclAddrId, putData).subscribe({
        next: () => {
          this.markSavedState();
          this.saving = false;
          this.successMessage = 'Address updated.';
        },
        error: (error) => {
          console.error('updateHcclAddrById failed', error);
          this.saving = false;
          this.errorMessage = 'Unable to update address.';
        },
      });
      return;
    }

    this.hcclService.createHcclAddr(this.addrToSubmit).subscribe({
      next: (response: any) => {
        const createdId = this.resolveIdFromResponse(response);
        if (createdId) {
          this.hcclAddrId = createdId;
          this.addrCreated.emit(createdId);
        }

        this.hcclAddr = {
          ...(this.hcclAddr || {}),
          ...this.addrToSubmit,
          id: this.hcclAddrId || this.hcclAddr?.id,
        };
        this.markSavedState();
        this.saving = false;
        this.successMessage = 'Address created.';
      },
      error: (error) => {
        console.error('createHcclAddr failed', error);
        this.saving = false;
        this.errorMessage = 'Unable to create address.';
      },
    });
  }

  onResetButtonClick(): void {
    this.addrToSubmit = this.clonePostData(this.lastSavedState);
    this.hcclAddr = {
      ...(this.hcclAddr || {}),
      ...this.addrToSubmit,
    };
    this.editableSingleLine = this.addrToSubmit.addrSingleLine || '';
    this.successMessage = '';
    this.errorMessage = '';
  }

  private resolveAddressState(): void {
    this.initialized = true;
    this.loading = true;
    this.lookupLoading = false;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.hcclAddrId) {
      this.hcclService.getHcclAddrById(this.hcclAddrId).subscribe({
        next: (data: HcclAddrGETData) => {
          this.hcclAddr = data;
          this.addrToSubmit = this.mapGetToPost(data);
          this.editableSingleLine = this.addrToSubmit.addrSingleLine || '';
          this.markSavedState();
          this.loading = false;
          this.applyInputSingleLineOverride();
        },
        error: (error) => {
          console.error('getHcclAddrById failed', error);
          this.loading = false;
          this.errorMessage = 'Unable to load address.';
        },
      });
      return;
    }

    this.addrToSubmit = {
      parentEntityId: this.parentEntityId || undefined,
      parentEntityType: this.parentEntityType || undefined,
      addressTypeCode: this.addrTypeCode || undefined,
      addrSingleLine: this.addrSingleLine || undefined,
    };
    this.hcclAddr = { ...this.addrToSubmit };
    this.editableSingleLine = this.addrToSubmit.addrSingleLine || '';
    this.markSavedState();
    this.loading = false;
    this.applyInputSingleLineOverride();
  }

  private applyInputSingleLineOverride(): void {
    if (this.addrSingleLine === null || this.addrSingleLine === undefined) {
      return;
    }

    this.editableSingleLine = this.addrSingleLine;
    this.onAddrSingleLineChanged(this.addrSingleLine);
  }

  private mergeAddressFields(resolvedAddr: HcclAddrGETData): void {
    const merged = {
      ...this.addrToSubmit,
      formattedAddressJson: resolvedAddr.formattedAddressJson,
      addrLine1: resolvedAddr.addrLine1,
      addrLine2: resolvedAddr.addrLine2,
      addrLine3: resolvedAddr.addrLine3,
      addrLine4: resolvedAddr.addrLine4,
      city: resolvedAddr.city,
      stateCode: resolvedAddr.stateCode,
      countryCode: resolvedAddr.countryCode,
      zip: resolvedAddr.zip,
      zipPlus4: resolvedAddr.zipPlus4,
      geolocationLatitude: resolvedAddr.geolocationLatitude,
      geolocationLongitude: resolvedAddr.geolocationLongitude,
      addrSingleLine: resolvedAddr.addrSingleLine || this.editableSingleLine,
      geoAppifyJson: resolvedAddr.geoAppifyJson,
    };

    this.addrToSubmit = merged;
    this.hcclAddr = {
      ...(this.hcclAddr || {}),
      ...merged,
      id: this.hcclAddr?.id || this.hcclAddrId || undefined,
      parentEntityId: this.hcclAddr?.parentEntityId || this.parentEntityId || undefined,
      parentEntityType: this.hcclAddr?.parentEntityType || this.parentEntityType || undefined,
    };
    this.editableSingleLine = this.addrToSubmit.addrSingleLine || this.editableSingleLine;
  }

  private mapGetToPost(data: HcclAddrGETData): HcclAddrPOSTData {
    return {
      parentEntityId: data.parentEntityId,
      parentEntityType: data.parentEntityType,
      parentEntityName: data.parentEntityName,
      organizationId: data.organizationId,
      formattedAddressJson: data.formattedAddressJson,
      addressTypeCode: data.addressTypeCode,
      addrLine1: data.addrLine1,
      addrLine2: data.addrLine2,
      addrLine3: data.addrLine3,
      addrLine4: data.addrLine4,
      city: data.city,
      stateCode: data.stateCode,
      countryCode: data.countryCode,
      zip: data.zip,
      zipPlus4: data.zipPlus4,
      geolocationLongitude: data.geolocationLongitude,
      geolocationLatitude: data.geolocationLatitude,
      addrSingleLine: data.addrSingleLine,
      geoAppifyJson: data.geoAppifyJson,
    };
  }

  private markSavedState(): void {
    this.lastSavedState = this.clonePostData(this.addrToSubmit);
  }

  private clonePostData(data: HcclAddrPOSTData): HcclAddrPOSTData {
    return { ...data };
  }

  private resolveIdFromResponse(response: any): string | null {
    if (!response) {
      return null;
    }
    const id = response.id || response.hcclAddrId || response.entityId || response.data?.id || response.context?.id;
    return typeof id === 'string' && id.length > 0 ? id : null;
  }
}
