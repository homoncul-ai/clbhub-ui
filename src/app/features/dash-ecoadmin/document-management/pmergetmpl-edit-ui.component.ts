import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { firstValueFrom } from 'rxjs';

import { StdMarkdownDisplayComponent } from '@app/components/_global/std-markdown-display/std-markdown-display.component';
import { SimpleMessageList } from '@app/restsvc/common-request-service.model';
import {
  HcclService,
  MergeSchemeGETData,
  MergeSchemeTagGETData,
  PMergeCreateTemplatePOSTData,
  PMergeTmplGETData,
  PMergeTmplVersionGETData,
  PMergeTemplateActionResponse,
  PMergeUpdateDraftPOSTData,
} from '@app/restsvc/hccl.service';
import { mergeTemplateWithDefaults } from './pmerge-defaults-merge';
import { ADMIN_DOC_MGMT_TEMPLATES_BASE } from './pmergetmpl-list.component';
import { PMergePreviewModalComponent } from './pmerge-preview-modal.component';

const SEVERITY_ERROR = 1;
const SEVERITY_WARNING = 2;

const TEMPLATE_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: 'securityEmail', label: 'Security email' },
  { value: 'contracts', label: 'Contracts' },
  { value: 'experienceReport', label: 'Experience report' },
  { value: 'userMonthlyStatus', label: 'User monthly status' },
  { value: 'email', label: 'Email' },
];

interface HeaderForm {
  name: string;
  businessCode: string;
  templateTypeCode: string;
  description: string;
  mergeType: string;
}

interface DraftForm {
  title: string;
  contents: string;
  subjectTmpl: string;
  fileNameTmpl: string;
  mergingSubject: boolean;
  mergingFileName: boolean;
  selectedSchemeCodes: string[];
}

interface PaletteTag {
  schemeCode: string;
  schemeName: string;
  tagCode: string;
  description: string;
  sampleValue: string;
}

/**
 * Template detail + markdown editor driven by PMergeUIServices.
 * Create and edit share this screen.
 */
@Component({
  selector: 'app-pmergetmpl-edit-ui',
  standalone: true,
  imports: [CommonModule, FormsModule, StdMarkdownDisplayComponent],
  templateUrl: './pmergetmpl-edit-ui.component.html',
  styleUrl: './pmergetmpl-edit-ui.component.scss',
})
export class PMergeTmplEditUiComponent implements OnInit {
  @ViewChild(StdMarkdownDisplayComponent) markdownEditor?: StdMarkdownDisplayComponent;

  private hcclService = inject(HcclService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private modalService = inject(MdbModalService);

  readonly templateTypeOptions = TEMPLATE_TYPE_OPTIONS;

  isCreateMode = false;
  templateId = '';
  template: PMergeTmplGETData | null = null;
  version: PMergeTmplVersionGETData | null = null;
  allSchemes: MergeSchemeGETData[] = [];

  loading = false;
  saving = false;
  promoting = false;
  previewing = false;
  editing = false;

  loadError = '';
  errorText = '';
  warningText = '';
  successText = '';

  header: HeaderForm = this.emptyHeader();
  draft: DraftForm = this.emptyDraft();

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isCreateMode = false;
        this.templateId = id;
        this.editing = false;
        void this.loadSetup();
      } else {
        this.isCreateMode = true;
        this.templateId = '';
        this.template = null;
        this.version = null;
        this.editing = true;
        this.header = this.emptyHeader();
        this.draft = this.emptyDraft();
        void this.loadSchemesForCreate();
      }
    });
  }

  get hasDraft(): boolean {
    return !!this.template?.inProcessVersionId;
  }

  get showEditor(): boolean {
    return !this.loading && (this.isCreateMode || !!this.template);
  }

  get versionStatusLabel(): string {
    if (this.isCreateMode) {
      return 'New';
    }
    const status = this.version?.statusCode || '';
    if (status === 'in_process') {
      return 'Draft';
    }
    if (status === 'active') {
      return 'Active';
    }
    return status || '—';
  }

  get templateTypeLabel(): string {
    const code = this.isCreateMode
      ? this.header.templateTypeCode
      : this.template?.templateTypeCode || '';
    return TEMPLATE_TYPE_OPTIONS.find((opt) => opt.value === code)?.label || code || '—';
  }

  get configuredSchemeLabels(): string {
    return (this.version?.mergeSchemeCodes || '')
      .split(',')
      .map((code) => code.trim())
      .filter((code) => code.length > 0)
      .map((code) => {
        const scheme = this.allSchemes.find((s) => s.businessCode === code);
        return scheme?.name ? `${scheme.name} (${code})` : code;
      })
      .join(', ');
  }

  get paletteTags(): PaletteTag[] {
    const selected = new Set(this.draft.selectedSchemeCodes);
    const tags: PaletteTag[] = [];
    this.allSchemes.forEach((scheme) => {
      if (!scheme.businessCode || !selected.has(scheme.businessCode)) {
        return;
      }
      (scheme.tags ?? []).forEach((tag: MergeSchemeTagGETData) => {
        if (!tag.tagCode) {
          return;
        }
        tags.push({
          schemeCode: scheme.businessCode || '',
          schemeName: scheme.name || scheme.businessCode || '',
          tagCode: tag.tagCode,
          description: tag.description || '',
          sampleValue: tag.sampleValue == null ? '' : String(tag.sampleValue),
        });
      });
    });
    return tags;
  }

  get markdownSource(): string {
    if (this.isCreateMode) {
      return '';
    }
    return this.version?.contents || '';
  }

  backToList(): void {
    this.router.navigate([ADMIN_DOC_MGMT_TEMPLATES_BASE]);
  }

  async loadSchemesForCreate(): Promise<void> {
    this.loading = true;
    this.loadError = '';
    this.clearMessages();
    try {
      const schemesRsp = await firstValueFrom(this.hcclService.listMergeSchemes());
      this.allSchemes = schemesRsp.schemes ?? [];
    } catch (err: unknown) {
      console.error('Failed to load merge schemes', err);
      this.loadError = this.extractError(err, 'Unable to load merge schemes.');
    } finally {
      this.loading = false;
    }
  }

  async loadSetup(): Promise<void> {
    if (!this.templateId) {
      return;
    }
    this.loading = true;
    this.loadError = '';
    this.clearMessages();
    try {
      const setupRsp = await firstValueFrom(this.hcclService.getEditorSetup(this.templateId));
      this.applyMessages(setupRsp.messages);
      this.template = setupRsp.editorData?.template ?? null;
      this.version = setupRsp.editorData?.templateVersion ?? null;
      this.allSchemes = setupRsp.editorData?.mergeSchemes ?? [];
      try {
        const schemesRsp = await firstValueFrom(this.hcclService.listMergeSchemes());
        if (schemesRsp.schemes?.length) {
          this.allSchemes = schemesRsp.schemes;
        }
      } catch (schemeErr: unknown) {
        console.warn('Failed to load merge schemes; using setup data', schemeErr);
      }
      this.copyVersionToDraft();
    } catch (err: unknown) {
      console.error('Failed to load merge template editor', err);
      this.loadError = this.extractError(err, 'Unable to load template.');
    } finally {
      this.loading = false;
    }
  }

  async startEdit(): Promise<void> {
    if (this.isCreateMode || !this.templateId || this.saving) {
      return;
    }
    this.clearMessages();
    if (this.hasDraft) {
      this.copyVersionToDraft();
      this.editing = true;
      return;
    }
    this.saving = true;
    try {
      const rsp = await firstValueFrom(this.hcclService.beginEditTemplate(this.templateId));
      this.applyActionResponse(rsp);
      if (!this.errorText) {
        this.editing = true;
        this.successText = this.successText || 'Draft created. You can edit this version.';
      }
    } catch (err: unknown) {
      console.error('Failed to begin template edit', err);
      this.errorText = this.extractError(err, 'Unable to start editing.');
    } finally {
      this.saving = false;
    }
  }

  cancelEdit(): void {
    if (this.isCreateMode) {
      this.backToList();
      return;
    }
    this.editing = false;
    this.copyVersionToDraft();
    this.clearMessages();
  }

  async save(): Promise<boolean> {
    if (this.isCreateMode) {
      return this.saveCreate();
    }
    return this.saveDraft();
  }

  async saveDraft(): Promise<boolean> {
    if (!this.templateId || this.saving) {
      return false;
    }
    if (!this.validateRequiredFields()) {
      return false;
    }
    this.saving = true;
    this.clearMessages();
    try {
      const rsp = await firstValueFrom(
        this.hcclService.updateDraftTemplate(this.templateId, this.toDraftPost()),
      );
      this.applyActionResponse(rsp);
      if (!this.errorText) {
        this.successText = this.successText || 'Draft saved.';
        return true;
      }
      return false;
    } catch (err: unknown) {
      console.error('Failed to save draft', err);
      this.errorText = this.extractError(err, 'Unable to save draft.');
      return false;
    } finally {
      this.saving = false;
    }
  }

  async saveCreate(): Promise<boolean> {
    if (this.saving) {
      return false;
    }
    if (!this.validateRequiredFields(true)) {
      return false;
    }
    this.saving = true;
    this.clearMessages();
    try {
      const body: PMergeCreateTemplatePOSTData = {
        name: this.header.name.trim(),
        businessCode: this.header.businessCode.trim(),
        templateTypeCode: this.header.templateTypeCode.trim(),
        mergeType: this.header.mergeType.trim() || 'md',
        description: this.header.description.trim(),
        title: this.draft.title.trim(),
        contents: this.draft.contents,
        mergeSchemeCodes: this.draft.selectedSchemeCodes.join(','),
        available: 1,
        mergingSubject: this.draft.mergingSubject ? 1 : 0,
        mergingFileName: this.draft.mergingFileName ? 1 : 0,
        subjectTmpl: this.draft.subjectTmpl,
        fileNameTmpl: this.draft.fileNameTmpl,
      };
      const rsp = await firstValueFrom(this.hcclService.createTemplate(body));
      this.applyActionResponse(rsp);
      const newId = rsp.template?.id || (rsp as { id?: string }).id;
      if (!this.errorText && newId) {
        this.router.navigate([ADMIN_DOC_MGMT_TEMPLATES_BASE, newId]);
        return true;
      }
      if (!newId && !this.errorText) {
        this.errorText = 'Template was created but no id was returned.';
      }
      return false;
    } catch (err: unknown) {
      console.error('Failed to create template', err);
      this.errorText = this.extractError(err, 'Unable to create template.');
      return false;
    } finally {
      this.saving = false;
    }
  }

  async promote(): Promise<void> {
    if (this.isCreateMode || !this.templateId || this.promoting) {
      return;
    }
    if (this.editing) {
      const saved = await this.saveDraft();
      if (!saved) {
        return;
      }
    } else if (!this.hasDraft) {
      this.errorText = 'Start editing and save a draft before promoting.';
      return;
    }
    this.promoting = true;
    this.clearMessages();
    try {
      const rsp = await firstValueFrom(this.hcclService.promoteDraftTemplate(this.templateId));
      this.applyActionResponse(rsp);
      if (!this.errorText) {
        this.editing = false;
        this.successText = this.successText || 'Draft promoted to the active version.';
      }
    } catch (err: unknown) {
      console.error('Failed to promote draft', err);
      this.errorText = this.extractError(err, 'Unable to promote draft.');
    } finally {
      this.promoting = false;
    }
  }

  previewWithDefaults(): void {
    if (this.previewing) {
      return;
    }
    this.previewing = true;
    this.clearMessages();
    try {
      const body = this.draft.contents || this.version?.contents || '';
      if (!body.trim()) {
        this.modalService.open(PMergePreviewModalComponent, {
          modalClass: 'modal-lg',
          data: {
            title: 'Preview with defaults',
            errorText: 'Template contents are empty.',
          },
        });
        return;
      }

      const schemeCodes = this.draft.selectedSchemeCodes;
      const contents = mergeTemplateWithDefaults(body, this.allSchemes, schemeCodes);
      const subject = this.draft.mergingSubject
        ? mergeTemplateWithDefaults(this.draft.subjectTmpl || '', this.allSchemes, schemeCodes)
        : '';
      const fileName = this.draft.mergingFileName
        ? mergeTemplateWithDefaults(this.draft.fileNameTmpl || '', this.allSchemes, schemeCodes)
        : '';

      this.modalService.open(PMergePreviewModalComponent, {
        modalClass: 'modal-lg',
        data: {
          title: 'Preview with defaults',
          contents,
          subject,
          fileName,
        },
      });
    } finally {
      this.previewing = false;
    }
  }

  onMarkdownChange(contents: string): void {
    this.draft.contents = contents;
  }

  isSchemeSelected(code: string | undefined): boolean {
    if (!code) {
      return false;
    }
    return this.draft.selectedSchemeCodes.includes(code);
  }

  toggleScheme(code: string | undefined, checked: boolean): void {
    if (!code) {
      return;
    }
    if (checked) {
      if (!this.draft.selectedSchemeCodes.includes(code)) {
        this.draft.selectedSchemeCodes = [...this.draft.selectedSchemeCodes, code];
      }
      return;
    }
    this.draft.selectedSchemeCodes = this.draft.selectedSchemeCodes.filter((c) => c !== code);
  }

  onTagDragStart(event: DragEvent, tagCode: string): void {
    event.dataTransfer?.setData('text/plain', this.tokenFor(tagCode));
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'copy';
    }
  }

  insertTag(tagCode: string): void {
    if (!this.editing && !this.isCreateMode) {
      return;
    }
    this.markdownEditor?.insertText(this.tokenFor(tagCode));
  }

  private tokenFor(tagCode: string): string {
    return `[=${tagCode}]`;
  }

  private validateRequiredFields(forCreate = false): boolean {
    this.clearMessages();
    const missing: string[] = [];
    if (forCreate) {
      if (!this.header.name.trim()) {
        missing.push('Name');
      }
      if (!this.header.businessCode.trim()) {
        missing.push('Code');
      }
      if (!this.header.templateTypeCode.trim()) {
        missing.push('Type');
      }
      if (!this.header.description.trim()) {
        missing.push('Description');
      }
    }
    if (this.draft.mergingSubject && !this.draft.subjectTmpl.trim()) {
      missing.push('Subject template');
    }
    if (this.draft.mergingFileName && !this.draft.fileNameTmpl.trim()) {
      missing.push('File name template');
    }
    if (missing.length > 0) {
      this.errorText = `Required: ${missing.join(', ')}.`;
      return false;
    }
    return true;
  }

  private copyVersionToDraft(): void {
    const version = this.version;
    this.header = {
      name: this.template?.name || '',
      businessCode: this.template?.businessCode || '',
      templateTypeCode: this.template?.templateTypeCode || '',
      description: this.template?.description || '',
      mergeType: this.template?.mergeType || 'md',
    };
    this.draft = {
      title: version?.title || '',
      contents: version?.contents || '',
      subjectTmpl: version?.subjectTmpl || '',
      fileNameTmpl: version?.fileNameTmpl || '',
      mergingSubject: (this.template?.mergingSubject ?? 0) === 1,
      mergingFileName: (this.template?.mergingFileName ?? 0) === 1,
      selectedSchemeCodes: this.parseSchemeCodes(version?.mergeSchemeCodes),
    };
  }

  private toDraftPost(): PMergeUpdateDraftPOSTData {
    return {
      title: this.draft.title,
      contents: this.draft.contents,
      mergeSchemeCodes: this.draft.selectedSchemeCodes.join(','),
      subjectTmpl: this.draft.subjectTmpl,
      fileNameTmpl: this.draft.fileNameTmpl,
      mergingSubject: this.draft.mergingSubject ? 1 : 0,
      mergingFileName: this.draft.mergingFileName ? 1 : 0,
    };
  }

  private applyActionResponse(rsp: PMergeTemplateActionResponse): void {
    this.applyMessages(rsp.messages);
    if (rsp.template) {
      this.template = rsp.template;
    }
    if (rsp.version) {
      this.version = rsp.version;
      this.copyVersionToDraft();
    }
  }

  private applyMessages(messages?: SimpleMessageList): void {
    this.errorText = this.messageText(messages, SEVERITY_ERROR);
    this.warningText = this.messageText(messages, SEVERITY_WARNING);
    if (!this.errorText && !this.warningText) {
      this.successText = (messages?.messages ?? [])
        .map((m) => m.message || m.messageCode || '')
        .filter((t) => t.length > 0)
        .join(' ');
    }
  }

  private messageText(messages: SimpleMessageList | undefined, severity: number): string {
    return (messages?.messages ?? [])
      .filter((m) => (m.severity ?? 0) === severity)
      .map((m) => m.message || m.messageCode || '')
      .filter((t) => t.length > 0)
      .join(' ');
  }

  private clearMessages(): void {
    this.errorText = '';
    this.warningText = '';
    this.successText = '';
  }

  private parseSchemeCodes(value?: string): string[] {
    return (value || '')
      .split(',')
      .map((code) => code.trim())
      .filter((code) => code.length > 0);
  }

  private emptyHeader(): HeaderForm {
    return {
      name: '',
      businessCode: '',
      templateTypeCode: '',
      description: '',
      mergeType: 'md',
    };
  }

  private emptyDraft(): DraftForm {
    return {
      title: '',
      contents: '',
      subjectTmpl: '',
      fileNameTmpl: '',
      mergingSubject: false,
      mergingFileName: false,
      selectedSchemeCodes: [],
    };
  }

  private extractError(err: unknown, fallback: string): string {
    const httpErr = err as { error?: { messages?: SimpleMessageList }; message?: string };
    const fromPayload = (httpErr?.error?.messages?.messages ?? [])
      .map((m) => m.message || m.messageCode || '')
      .filter((t) => t.length > 0)
      .join(' ');
    if (fromPayload) {
      return fromPayload;
    }
    if (httpErr?.message) {
      return httpErr.message;
    }
    return fallback;
  }
}
