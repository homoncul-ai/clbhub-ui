import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  HcclService,
  OnboardOrganizationPOJO,
  OnboardOrganizationPOSTData,
  OnboardOrganizationResponse,
  OnboardOrganizationUIHelper,
} from '@app/restsvc/hccl.service';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { SimpleMessageList } from '@app/restsvc/common-request-service.model';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';

@Component({
  selector: 'app-onboard-org-ui',
  standalone: true,
  imports: [CommonModule, FormsModule, MdbAccordionModule, SimpleMessagesSectionComponent],
  templateUrl: './onboard-org-ui.component.html',
  styleUrls: ['./onboard-org-ui.component.scss'],
})
export class OnboardOrgUiComponent implements OnChanges {
  @Input() orgTypeCode = '';
  @Output() refreshRequested = new EventEmitter<void>();

  protected hcclService = inject(HcclService);
  protected modalRef = inject<MdbModalRef<OnboardOrgUiComponent> | null>(MdbModalRef, { optional: true });

  accordionId = 'source';

  sourceUrl = '';
  sourceNotes = '';

  inviteUserEmail = '';

  setupLoading = false;
  createLoading = false;
  setupError = '';
  createError = '';
  responseMessages: SimpleMessageList = { messages: [] };

  setupHelper: OnboardOrganizationUIHelper | null = null;
  orgData: OnboardOrganizationPOSTData = this.createDefaultOrgData();
  createResponse: OnboardOrganizationResponse | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['orgTypeCode']) {
      this.orgData.orgTypeCode = this.orgTypeCode || this.orgData.orgTypeCode;
      this.orgData.providerOrganization.organizationTypeCode =
        this.orgTypeCode || this.orgData.providerOrganization.organizationTypeCode;
    }
  }

  openAccordion(id: string): void {
    this.accordionId = id;
  }

  isAccordionCollapsed(id: string): boolean {
    return this.accordionId !== id;
  }

  onboardOrganizationSetup(): void {
    this.setupError = '';
    this.createResponse = null;
    this.createError = '';
    this.responseMessages = { messages: [] };

    const url = this.sourceUrl.trim();
    if (!url || !this.isValidUrl(url)) {
      this.setupError = 'Please provide a valid URL.';
      return;
    }

    const body: OnboardOrganizationPOJO = {
      url: url,
      notes: this.sourceNotes?.trim() || undefined,
      orgTypeCode: this.orgTypeCode || undefined,
    };

    this.setupLoading = true;
    this.hcclService.onboardOrgSetup(body).subscribe({
      next: (helper) => {
        this.setupLoading = false;
        this.setupHelper = helper;
        this.orgData = this.normalizeOrgData(helper?.orgData);
        this.inviteUserEmail = this.orgData.inviteUserEmail || '';
        this.openAccordion('basics');
      },
      error: (err) => {
        this.setupLoading = false;
        this.setupError = this.getErrorMessage(err, 'Failed to prepare onboarding data.');
      },
    });
  }

  createOrganizationAndInvite(): void {
    this.createError = '';
    this.createResponse = null;
    this.responseMessages = { messages: [] };

    if (!this.orgData.providerOrganization.name?.trim()) {
      this.createError = 'Organization name is required.';
      return;
    }

    const inviteEmail = this.inviteUserEmail.trim();
    if (inviteEmail && !this.isValidEmail(inviteEmail)) {
      this.createError = 'Invite email format is invalid.';
      return;
    }

    this.orgData.inviteUserEmail = inviteEmail || undefined;
    this.orgData.orgTypeCode = this.orgTypeCode || this.orgData.orgTypeCode;
    this.orgData.providerOrganization.organizationTypeCode =
      this.orgTypeCode || this.orgData.providerOrganization.organizationTypeCode;

    this.createLoading = true;
    this.hcclService.onboardOrg(this.orgData).subscribe({
      next: (response) => {
        this.createLoading = false;
        this.createResponse = response;
        this.responseMessages = response?.messages || { messages: [] };
        this.openAccordion('submit');
      },
      error: (err) => {
        this.createLoading = false;
        this.createError = this.getErrorMessage(err, 'Failed to create organization.');
      },
    });
  }

  private normalizeOrgData(data?: OnboardOrganizationPOSTData): OnboardOrganizationPOSTData {
    const defaults = this.createDefaultOrgData();

    const normalized: OnboardOrganizationPOSTData = {
      ...defaults,
      ...data,
      orgTypeCode: this.orgTypeCode || data?.orgTypeCode || defaults.orgTypeCode,
      providerOrganization: {
        ...defaults.providerOrganization,
        ...(data?.providerOrganization || {}),
        organizationTypeCode:
          this.orgTypeCode ||
          data?.providerOrganization?.organizationTypeCode ||
          defaults.providerOrganization.organizationTypeCode,
        websiteUrl: data?.providerOrganization?.websiteUrl || this.sourceUrl || undefined,
        primaryAddress: {
          ...(defaults.providerOrganization.primaryAddress || {}),
          ...(data?.providerOrganization?.primaryAddress || {}),
        },
      },
      companyLogo: {
        ...(defaults.companyLogo || {}),
        ...(data?.companyLogo || {}),
      },
      companyMissionStatementImage: {
        ...(defaults.companyMissionStatementImage || {}),
        ...(data?.companyMissionStatementImage || {}),
      },
    };

    return normalized;
  }

  private createDefaultOrgData(): OnboardOrganizationPOSTData {
    return {
      orgTypeCode: this.orgTypeCode || 'BUSINESS',
      providerOrganization: {
        name: '',
        businessCode: '',
        description: '',
        available: 1,
        organizationTypeId: '',
        orgPolicyCode: '',
        organizationTypeCode: this.orgTypeCode || 'BUSINESS',
        primaryAddress: {},
      },
      inviteUserEmail: '',
      companyLogo: { imageUrl: '', alt: '' },
      companyMissionStatementImage: { imageUrl: '', alt: '' },
    };
  }

  private isValidUrl(value: string): boolean {
    try {
      const parsed = new URL(value);
      return !!parsed.protocol && !!parsed.host;
    } catch {
      return false;
    }
  }

  private isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  private getErrorMessage(err: any, fallback: string): string {
    return err?.error?.message || err?.message || fallback;
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close({ refresh: true });
    }
    this.refreshRequested.emit();
  }
}
