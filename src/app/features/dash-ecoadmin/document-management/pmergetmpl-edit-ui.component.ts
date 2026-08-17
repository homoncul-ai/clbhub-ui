import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { StdMarkdownDisplayComponent } from '@app/components/_global/std-markdown-display/std-markdown-display.component';
import { SimpleMessageList } from '@app/restsvc/common-request-service.model';
import {
  HcclService,
  MergeSchemeGETData,
  PMergeTmplGETData,
  PMergeTmplVersionGETData,
  PMergeTemplateActionResponse,
  PMergeUpdateDraftPOSTData,
} from '@app/restsvc/hccl.service';
import { ADMIN_DOC_MGMT_TEMPLATES_BASE } from './pmergetmpl-list.component';

const SEVERITY_ERROR = 1;
const SEVERITY_WARNING = 2;

interface DraftForm {
  title: string;
  contents: string;
  subjectTmpl: string;
  fileNameTmpl: string;
  mergingSubject: boolean;
  mergingFileName: boolean;
  selectedSchemeCodes: string[];
}

/**
 * Template detail + markdown editor driven by PMergeUIServices.
 *
 * View mode shows header details and rendered markdown. Edit begins an
 * in-process draft (if needed); Save Draft and Promote stay on this screen.
 */
@Component({
  selector: 'app-pmergetmpl-edit-ui',
  standalone: true,
  imports: [CommonModule, FormsModule, StdMarkdownDisplayComponent],
  templateUrl: './pmergetmpl-edit-ui.component.html',
  styleUrl: './pmergetmpl-edit-ui.component.scss',
})
export class PMergeTmplEditUiComponent implements OnInit {
  private hcclService = inject(HcclService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  templateId = '';
  template: PMergeTmplGETData | null = null;
  version: PMergeTmplVersionGETData | null = null;
  allSchemes: MergeSchemeGETData[] = [];

  loading = false;
  saving = false;
  promoting = false;
  editing = false;

  loadError = '';
  errorText = '';
  warningText = '';
  successText = '';

  draft: DraftForm = this.emptyDraft();

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.templateId = id;
        void this.loadSetup();
      }
    });
  }

  get hasDraft(): boolean {
    return !!this.template?.inProcessVersionId;
  }

  get versionStatusLabel(): string {
    const status = this.version?.statusCode || '';
    if (status === 'in_process') {
      return 'Draft';
    }
    if (status === 'active') {
      return 'Active';
    }
    return status || '—';
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

  backToList(): void {
    this.router.navigate([ADMIN_DOC_MGMT_TEMPLATES_BASE]);
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
    if (!this.templateId || this.saving) {
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
    this.editing = false;
    this.copyVersionToDraft();
    this.clearMessages();
  }

  async saveDraft(): Promise<boolean> {
    if (!this.templateId || this.saving) {
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

  async promote(): Promise<void> {
    if (!this.templateId || this.promoting) {
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

  private copyVersionToDraft(): void {
    const version = this.version;
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
    const list = messages?.messages ?? [];
    this.errorText = list
      .filter((m) => (m.severity ?? 0) === SEVERITY_ERROR)
      .map((m) => m.message || m.messageCode || '')
      .filter((t) => t.length > 0)
      .join(' ');
    this.warningText = list
      .filter((m) => (m.severity ?? 0) === SEVERITY_WARNING)
      .map((m) => m.message || m.messageCode || '')
      .filter((t) => t.length > 0)
      .join(' ');
    if (!this.errorText && !this.warningText) {
      this.successText = list
        .map((m) => m.message || m.messageCode || '')
        .filter((t) => t.length > 0)
        .join(' ');
    }
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
