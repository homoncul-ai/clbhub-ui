import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CatalogEntryGETData,
  FeedEntryGETData,
  HcclService,
  MenuControlData,
  MenuControlDataList,
  OnboardCatalogEntryPOJO,
  OnboardCatalogEntryPOSTData,
  OnboardCatalogEntryResponse,
  OnboardCatalogEntryUIHelper,
} from '@app/restsvc/hccl.service';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { SimpleMessageList } from '@app/restsvc/common-request-service.model';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { StdMarkdownDisplayComponent } from '@app/components/_global/std-markdown-display/std-markdown-display.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';

@Component({
  selector: 'app-onboard-catalogentry-ui',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MdbAccordionModule,
    SimpleMessagesSectionComponent,
    StdMarkdownDisplayComponent,
    MenuControlDataListComponent,
  ],
  templateUrl: './onboard-catalogentry-ui.component.html',
  styleUrls: ['./onboard-catalogentry-ui.component.scss'],
})
export class OnboardCatalogEntryUiComponent implements OnInit, OnChanges {
  @Input() catalogId = '';
  @Output() refreshRequested = new EventEmitter<void>();

  protected hcclService = inject(HcclService);
  protected modalRef = inject<MdbModalRef<OnboardCatalogEntryUiComponent> | null>(MdbModalRef, { optional: true });

  accordionId = 'source';

  sourceUrl = '';
  sourceNotes = '';
  initialSetupCompleted = false;

  setupLoading = false;
  createLoading = false;
  setupError = '';
  createError = '';
  responseMessages: SimpleMessageList = { messages: [] };

  setupHelper: OnboardCatalogEntryUIHelper | null = null;
  onboardData: OnboardCatalogEntryPOSTData = this.createDefaultOnboardData();
  createResponse: OnboardCatalogEntryResponse | null = null;

  signupPacketMenu: MenuControlDataList | null = null;
  signupBehaviorMenu: MenuControlDataList | null = null;
  catalogMenu: MenuControlDataList | null = null;
  feedEntry: FeedEntryGETData | Record<string, any> | null = null;

  ngOnInit(): void {
    this.runInitialSetup();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['catalogId']) {
      this.onboardData.catalogEntry.catalogId = this.catalogId || this.onboardData.catalogEntry.catalogId;
      if (!changes['catalogId'].firstChange) {
        this.runInitialSetup();
      }
    }
  }

  openAccordion(id: string): void {
    this.accordionId = id;
  }

  isAccordionCollapsed(id: string): boolean {
    return this.accordionId !== id;
  }

  submitSourceAndSetup(): void {
    this.setupError = '';
    const url = this.sourceUrl.trim();
    if (url && !this.isValidUrl(url)) {
      this.setupError = 'Please provide a valid URL when URL is entered.';
      return;
    }

    this.callSetup(true);
  }

  createCatalogEntry(): void {
    this.createError = '';
    this.createResponse = null;
    this.responseMessages = { messages: [] };

    const activeCatalogId = this.getCatalogIdValue();
    if (!activeCatalogId) {
      this.createError = 'Catalog ID is required.';
      return;
    }

    this.catalogId = activeCatalogId;
    this.onboardData.catalogEntry.catalogId = activeCatalogId;
    const payload = this.buildSubmitPayload();

    this.createLoading = true;
    this.hcclService.onboardCatalogEntry(payload).subscribe({
      next: (response) => {
        this.createLoading = false;
        this.createResponse = response;
        this.responseMessages = response?.messages || { messages: [] };
        this.openAccordion('submit');
      },
      error: (err) => {
        this.createLoading = false;
        this.createError = this.getErrorMessage(err, 'Failed to onboard catalog entry.');
      },
    });
  }

  onMdContentsChange(markdown: string): void {
    this.onboardData.catalogEntry.mdContents = markdown;
  }

  onMdQualificationsChange(markdown: string): void {
    this.onboardData.catalogEntry.mdQualifications = markdown;
  }

  onMdSignupInfoChange(markdown: string): void {
    this.onboardData.catalogEntry.mdSignupInfo = markdown;
  }

  onSignupPacketChange(value: string): void {
    this.onboardData.catalogEntry.signupPacketId = value || undefined;
  }

  onSignupBehaviorChange(value: string): void {
    this.onboardData.signupBehaviorCode = value || undefined;
  }

  onSignupPacketSelectionChange(item: MenuControlData | null): void {
    this.onboardData.catalogEntry.signupPacketId = item?.id || undefined;
  }

  onSignupBehaviorSelectionChange(item: MenuControlData | null): void {
    this.onboardData.signupBehaviorCode = item?.id || undefined;
  }

  onCatalogIdChange(value: string): void {
    const normalized = (value || '').trim();
    this.catalogId = normalized;
    this.onboardData.catalogEntry.catalogId = normalized;
  }

  onCatalogSelectionChange(item: MenuControlData | null): void {
    const selectedId = item?.id || '';
    this.catalogId = selectedId;
    this.onboardData.catalogEntry.catalogId = selectedId;
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close({ refresh: true });
    }
    this.refreshRequested.emit();
  }

  private runInitialSetup(): void {
    if (this.initialSetupCompleted || !this.getCatalogIdValue()) {
      return;
    }
    this.callSetup(false);
  }

  private callSetup(openNextAccordion: boolean): void {
    this.setupError = '';
    this.createResponse = null;
    this.createError = '';
    this.responseMessages = { messages: [] };

    const trimmedCatalogId = this.getCatalogIdValue();
    if (!trimmedCatalogId) {
      this.setupError = 'Catalog ID is required.';
      return;
    }

    const body: OnboardCatalogEntryPOJO = {
      catalogId: trimmedCatalogId,
      url: this.sourceUrl.trim() || undefined,
      notes: this.sourceNotes.trim() || undefined,
    };

    this.setupLoading = true;
    this.hcclService.onboardCatalogEntrySetup(body).subscribe({
      next: (helper) => {
        this.setupLoading = false;
        this.initialSetupCompleted = true;
        this.setupHelper = helper;
        this.hydrateFromSetupHelper(helper);
        if (openNextAccordion) {
          this.openAccordion('details');
        }
      },
      error: (err) => {
        this.setupLoading = false;
        this.setupError = this.getErrorMessage(err, 'Failed to prepare catalog entry onboarding data.');
      },
    });
  }

  private hydrateFromSetupHelper(helper: OnboardCatalogEntryUIHelper | any): void {
    const helperAny = this.coerceObject(helper);
    const helperCatalogEntry = this.coerceObject(helperAny.catalogEntry);
    const helperOnboardData = this.coerceObject(helperAny.catalogEntryData ?? helperAny.data ?? {});
    const helperCatalogEntryData = this.coerceObject(
      helperOnboardData.catalogEntry ?? helperCatalogEntry ?? this.onboardData.catalogEntry
    );

    const mergedData: OnboardCatalogEntryPOSTData = {
      ...this.createDefaultOnboardData(),
      ...helperOnboardData,
      catalogEntry: {
        ...this.createDefaultOnboardData().catalogEntry,
        ...helperCatalogEntryData,
        catalogId: this.catalogId || helperCatalogEntryData.catalogId || '',
        dateStart: this.normalizeDateValue(helperCatalogEntryData.dateStart),
        dateEnd: this.normalizeDateValue(helperCatalogEntryData.dateEnd),
        dateListingStarts: this.normalizeDateValue(helperCatalogEntryData.dateListingStarts),
        dateListingEnds: this.normalizeDateValue(helperCatalogEntryData.dateListingEnds),
      },
      signupBehaviorCode:
        helperOnboardData.signupBehaviorCode ||
        this.getSelectedMenuId(helperCatalogEntry.signupBehaviorMenu) ||
        this.getSelectedMenuId(helperAny.signupBehaviorMenu),
    };

    this.onboardData = mergedData;

    this.catalogMenu = helperAny.catalogSb || null;
    this.signupPacketMenu = helperCatalogEntry.signupPacketMenu || helperAny.signupPacketMenu || null;
    this.signupBehaviorMenu = helperCatalogEntry.signupBehaviorMenu || helperAny.signupBehaviorMenu || null;
    this.feedEntry = helperCatalogEntry.feedEntry || helperAny.feedEntry || null;

    if (!this.catalogId) {
      this.catalogId = this.onboardData.catalogEntry.catalogId || this.getSelectedMenuId(this.catalogMenu) || '';
    }
    if (!this.onboardData.catalogEntry.catalogId) {
      this.onboardData.catalogEntry.catalogId = this.catalogId || '';
    }

    if (!this.onboardData.catalogEntry.signupPacketId) {
      this.onboardData.catalogEntry.signupPacketId = this.getSelectedMenuId(this.signupPacketMenu) || undefined;
    }
  }

  private createDefaultOnboardData(): OnboardCatalogEntryPOSTData {
    return {
      catalogEntry: {
        catalogId: this.catalogId || '',
        entryCode: '',
        title: '',
        catalogTypeCode: '',
        catalogTypeId: '',
        shortDescription: '',
        description: '',
        available: 1,
        mdContents: '',
        mdQualifications: '',
      },
      signupBehaviorCode: '',
    };
  }

  private getCatalogIdValue(): string {
    return (this.onboardData.catalogEntry.catalogId || this.catalogId || '').trim();
  }

  private buildSubmitPayload(): OnboardCatalogEntryPOSTData {
    const catalogEntry = this.onboardData.catalogEntry;
    return {
      ...this.onboardData,
      catalogEntry: {
        ...catalogEntry,
        dateStart: this.toDateTimeString(catalogEntry.dateStart),
        dateEnd: this.toDateTimeString(catalogEntry.dateEnd),
        dateListingStarts: this.toDateTimeString(catalogEntry.dateListingStarts),
        dateListingEnds: this.toDateTimeString(catalogEntry.dateListingEnds),
      },
    };
  }

  private toDateTimeString(value: string | undefined): string | undefined {
    if (!value) {
      return undefined;
    }

    const trimmed = value.trim();
    if (!trimmed) {
      return undefined;
    }

    // Convert date-only values from HTML date inputs.
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return `${trimmed}T00:00:00`;
    }

    // Already in expected backend format.
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(trimmed)) {
      return trimmed;
    }

    // Normalize date-time variants to backend format: yyyy-MM-dd'T'HH:mm:ss
    let candidate = trimmed;
    if (!/(Z|[+-]\d{2}:?\d{2})$/.test(candidate)) {
      candidate = `${candidate}Z`;
    }

    const parsed = new Date(candidate);
    if (Number.isNaN(parsed.getTime())) {
      return trimmed;
    }

    return AbstractCrudComponent.formateDateForPost(parsed);
  }

  private getSelectedMenuId(menu: MenuControlDataList | null | undefined): string {
    const selected = menu?.menuItems?.find((item) => item.selected);
    return selected?.id || '';
  }

  private normalizeDateValue(value: string | undefined): string | undefined {
    if (!value) {
      return undefined;
    }
    if (value.length >= 10) {
      return value.substring(0, 10);
    }
    return value;
  }

  private coerceObject(value: any): any {
    if (!value) {
      return {};
    }
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return {};
      }
    }
    return value;
  }

  private isValidUrl(value: string): boolean {
    try {
      const parsed = new URL(value);
      return !!parsed.protocol && !!parsed.host;
    } catch {
      return false;
    }
  }

  private getErrorMessage(err: any, fallback: string): string {
    return err?.error?.message || err?.message || fallback;
  }
}
