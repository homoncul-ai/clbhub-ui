import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CareerLadderRefCriteria,
  CareerLadderRefGETData,
  CareerLadderRefPOSTData,
  CareerLadderRefPUTData,
  CareerLadderRungRefGETData,
  CareerLadderRungRefPOSTData,
  CareerLadderRungRefPUTData,
  HcclService,
} from '@app/restsvc/hccl.service';
import { firstValueFrom } from 'rxjs';

type EditorMode = 'list' | 'create' | 'edit';

interface LadderFormModel {
  businessCode: string;
  name: string;
  tagline: string;
  description: string;
  available: number;
}

interface RungFormModel {
  id?: string;
  businessCode: string;
  sequenceOrder: number;
  title: string;
  shortTitle: string;
  oneLiner: string;
  summary: string;
  payHint: string;
  ageNote: string;
  available: number;
}

/** Matches backend SynchDataResponse from POST /hccl/realm/synchdata */
interface SynchDataResponse {
  careerLaddersCreated?: number;
  careerLaddersRefreshed?: number;
  careerLadderRungsCreated?: number;
  careerLadderRungsRefreshed?: number;
  qualifiersCreated?: number;
  qualifiersRefreshed?: number;
  rungQualifierLinksCreated?: number;
  rungQualifierLinksRefreshed?: number;
  failed?: number;
}

@Component({
  selector: 'app-career-ladder-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './career-ladder-admin.component.html',
  styleUrl: './career-ladder-admin.component.scss',
})
export class CareerLadderAdminComponent implements OnInit {
  private readonly hcclService = inject(HcclService);
  private readonly http = inject(HttpClient);

  mode: EditorMode = 'list';
  loading = false;
  syncing = false;
  saving = false;
  error: string | null = null;
  success: string | null = null;
  /** Last sync debug summary shown in the UI for troubleshooting. */
  syncDebug: string | null = null;

  searchText = '';
  ladders: CareerLadderRefGETData[] = [];
  selected: CareerLadderRefGETData | null = null;

  form: LadderFormModel = this.emptyLadderForm();
  rungs: RungFormModel[] = [];
  rungDraft: RungFormModel = this.emptyRungForm(1);
  editingRungId: string | null = null;

  ngOnInit(): void {
    void this.loadLadders();
  }

  async loadLadders(): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      const criteria: CareerLadderRefCriteria = {
        isPaging: false,
        maxResults: 500,
        searchByText: this.searchText.trim() || undefined,
        orderByHint: 'name',
      };
      const response = await firstValueFrom(this.hcclService.findCareerLadderRefs(criteria));
      this.ladders = [...(response?.searchResults || [])].sort((a, b) =>
        (a.name || '').localeCompare(b.name || ''),
      );
    } catch (err: unknown) {
      console.error('Failed to load career ladders', err);
      this.error = err instanceof Error ? err.message : 'Failed to load career ladders.';
      this.ladders = [];
    } finally {
      this.loading = false;
    }
  }

  async applySearch(): Promise<void> {
    await this.loadLadders();
  }

  clearSearch(): void {
    this.searchText = '';
    void this.loadLadders();
  }

  async syncFromLovable(): Promise<void> {
    this.syncing = true;
    this.error = null;
    this.success = null;
    this.syncDebug = null;

    const baseUrl = this.hcclService.getBaseUrl();
    const url = `${baseUrl}/hccl/realm/synchdata`;
    const body = { synchingCareerLadders: true };
    const startedAt = Date.now();

    console.log('[CareerLadderAdmin] sync start', {
      url,
      baseUrl,
      body,
      startedAt: new Date(startedAt).toISOString(),
    });

    try {
      // Use HttpClient directly so we avoid CommonRequestServiceCaller.retry(2)
      // (a long sync should not be retried) and keep the raw HttpErrorResponse.
      const response = await firstValueFrom(this.http.post<SynchDataResponse>(url, body));
      const elapsedMs = Date.now() - startedAt;
      console.log('[CareerLadderAdmin] sync success', { elapsedMs, response });

      const created = response?.careerLaddersCreated ?? 0;
      const refreshed = response?.careerLaddersRefreshed ?? 0;
      const rungsCreated = response?.careerLadderRungsCreated ?? 0;
      const rungsRefreshed = response?.careerLadderRungsRefreshed ?? 0;
      const failed = response?.failed ?? 0;
      this.success =
        `Sync complete in ${Math.round(elapsedMs / 1000)}s: ladders created ${created}, refreshed ${refreshed}; ` +
        `rungs created ${rungsCreated}, refreshed ${rungsRefreshed}` +
        (failed ? `; failed ${failed}` : '');
      this.syncDebug = `OK ${elapsedMs}ms @ ${url}`;
      await this.loadLadders();
    } catch (err: unknown) {
      const elapsedMs = Date.now() - startedAt;
      this.logSyncFailure(err, url, elapsedMs);
      this.syncDebug = this.formatSyncDebug(err, url, elapsedMs);

      // Browser/proxy often times out (HTTP 0) while the server keeps syncing.
      // Reload and treat "we now have ladders" as success with a soft warning.
      console.log('[CareerLadderAdmin] reloading ladders after sync transport failure');
      await this.loadLadders();

      if (this.ladders.length > 0 && err instanceof HttpErrorResponse && err.status === 0) {
        this.error = null;
        this.success =
          `Sync appears to have completed on the server (found ${this.ladders.length} ladder(s)), ` +
          `but the browser connection timed out after ${Math.round(elapsedMs / 1000)}s.`;
        console.log('[CareerLadderAdmin] treating HTTP 0 as soft success after ladders loaded', {
          ladderCount: this.ladders.length,
        });
      } else {
        this.error = this.formatSyncError(err, elapsedMs);
      }
    } finally {
      this.syncing = false;
    }
  }

  private logSyncFailure(err: unknown, url: string, elapsedMs: number): void {
    console.error('[CareerLadderAdmin] sync failed', { url, elapsedMs, err });
    if (err instanceof HttpErrorResponse) {
      console.error('[CareerLadderAdmin] HttpErrorResponse details', {
        status: err.status,
        statusText: err.statusText,
        url: err.url,
        name: err.name,
        message: err.message,
        ok: err.ok,
        type: err.type,
        errorType: err.error?.constructor?.name,
        error: err.error,
        headers: err.headers?.keys?.()?.map((k) => `${k}=${err.headers.get(k)}`),
      });
      if (err.status === 0) {
        console.warn(
          '[CareerLadderAdmin] HTTP 0 usually means the browser/proxy aborted the request ' +
            '(gateway timeout, CORS, offline, or TLS). Elapsed ~' +
            Math.round(elapsedMs / 1000) +
            's — check gbs-qa gateway/proxy timeout and server logs for SynchLadderDataUtils.',
        );
      }
    } else if (err instanceof Error) {
      console.error('[CareerLadderAdmin] Error details', {
        name: err.name,
        message: err.message,
        stack: err.stack,
      });
    }
  }

  private formatSyncError(err: unknown, elapsedMs: number): string {
    const secs = Math.round(elapsedMs / 1000);
    if (err instanceof HttpErrorResponse) {
      if (err.status === 0) {
        return (
          `Sync aborted after ${secs}s (HTTP 0 / network). ` +
          `Likely a gateway or proxy timeout while pulling from Lovable. ` +
          `Check server logs for synchAllLadders; data may still have partially synced.`
        );
      }
      return `Sync failed after ${secs}s (HTTP ${err.status} ${err.statusText || ''}). ${err.message}`;
    }
    if (err instanceof Error) {
      return `Sync failed after ${secs}s: ${err.message}`;
    }
    return `Sync failed after ${secs}s.`;
  }

  private formatSyncDebug(err: unknown, url: string, elapsedMs: number): string {
    if (err instanceof HttpErrorResponse) {
      const errBody =
        err.error instanceof ProgressEvent
          ? `ProgressEvent(type=${err.error.type}, loaded=${err.error.loaded}, total=${err.error.total})`
          : typeof err.error === 'string'
            ? err.error
            : JSON.stringify(err.error);
      return `FAIL ${elapsedMs}ms status=${err.status} statusText=${err.statusText} url=${err.url || url} body=${errBody}`;
    }
    if (err instanceof Error) {
      return `FAIL ${elapsedMs}ms ${err.name}: ${err.message} url=${url}`;
    }
    return `FAIL ${elapsedMs}ms url=${url} err=${String(err)}`;
  }

  startCreate(): void {
    this.mode = 'create';
    this.selected = null;
    this.form = this.emptyLadderForm();
    this.rungs = [];
    this.rungDraft = this.emptyRungForm(1);
    this.editingRungId = null;
    this.error = null;
    this.success = null;
  }

  async startEdit(ladder: CareerLadderRefGETData): Promise<void> {
    if (!ladder.id) {
      this.error = 'Ladder is missing an id.';
      return;
    }

    this.mode = 'edit';
    this.error = null;
    this.success = null;
    this.loading = true;

    try {
      const fresh = await firstValueFrom(this.hcclService.getCareerLadderRefById(ladder.id));
      this.selected = fresh;
      this.form = {
        businessCode: fresh.businessCode || '',
        name: fresh.name || '',
        tagline: fresh.tagline || '',
        description: fresh.description || '',
        available: fresh.available ?? 1,
      };
      await this.loadRungs(fresh.id!);
    } catch (err: unknown) {
      console.error('Failed to load ladder', err);
      this.error = err instanceof Error ? err.message : 'Failed to load ladder.';
      this.mode = 'list';
    } finally {
      this.loading = false;
    }
  }

  backToList(): void {
    this.mode = 'list';
    this.selected = null;
    this.form = this.emptyLadderForm();
    this.rungs = [];
    this.editingRungId = null;
    this.error = null;
    this.success = null;
    void this.loadLadders();
  }

  async saveLadder(): Promise<void> {
    this.error = null;
    this.success = null;

    const businessCode = this.form.businessCode.trim();
    const name = this.form.name.trim();
    if (!businessCode || !name) {
      this.error = 'Business code and name are required.';
      return;
    }

    this.saving = true;
    try {
      if (this.mode === 'create') {
        const postData: CareerLadderRefPOSTData = {
          businessCode,
          name,
          tagline: this.form.tagline.trim() || undefined,
          description: this.form.description.trim() || undefined,
          available: Number(this.form.available) || 0,
        };
        const created = await firstValueFrom(this.hcclService.createCareerLadderRef(postData));
        const createdId = created?.id as string | undefined;
        this.success = 'Ladder created.';
        if (createdId) {
          await this.startEdit({ id: createdId });
        } else {
          this.backToList();
        }
      } else if (this.mode === 'edit' && this.selected?.id) {
        const putData: CareerLadderRefPUTData = {
          businessCode,
          name,
          tagline: this.form.tagline.trim() || undefined,
          description: this.form.description.trim() || undefined,
          available: Number(this.form.available) || 0,
        };
        await firstValueFrom(this.hcclService.updateCareerLadderRefById(this.selected.id, putData));
        this.success = 'Ladder saved.';
        await this.startEdit({ id: this.selected.id });
      }
    } catch (err: unknown) {
      console.error('Failed to save ladder', err);
      this.error = err instanceof Error ? err.message : 'Failed to save ladder.';
    } finally {
      this.saving = false;
    }
  }

  async deleteLadder(): Promise<void> {
    if (!this.selected?.id) {
      return;
    }
    const ok = window.confirm(`Delete career ladder "${this.selected.name}"? This cannot be undone.`);
    if (!ok) {
      return;
    }

    this.saving = true;
    this.error = null;
    try {
      await firstValueFrom(this.hcclService.deleteCareerLadderRefById(this.selected.id));
      this.success = 'Ladder deleted.';
      this.backToList();
    } catch (err: unknown) {
      console.error('Failed to delete ladder', err);
      this.error = err instanceof Error ? err.message : 'Failed to delete ladder.';
    } finally {
      this.saving = false;
    }
  }

  async loadRungs(careerLadderRefId: string): Promise<void> {
    const response = await firstValueFrom(
      this.hcclService.findCareerLadderRungRefs({
        careerLadderRefId,
        isPaging: false,
        maxResults: 200,
        orderByHint: 'sequenceOrder',
      }),
    );
    const rows = response?.searchResults || [];
    this.rungs = rows
      .map((rung) => this.rungFromEntity(rung))
      .sort((a, b) => a.sequenceOrder - b.sequenceOrder || a.title.localeCompare(b.title));
    this.rungDraft = this.emptyRungForm(this.nextSequenceOrder());
    this.editingRungId = null;
  }

  startEditRung(rung: RungFormModel): void {
    this.editingRungId = rung.id || null;
    this.rungDraft = { ...rung };
  }

  cancelRungEdit(): void {
    this.editingRungId = null;
    this.rungDraft = this.emptyRungForm(this.nextSequenceOrder());
  }

  async saveRung(): Promise<void> {
    if (!this.selected?.id) {
      this.error = 'Save the ladder before adding rungs.';
      return;
    }

    const title = this.rungDraft.title.trim();
    const businessCode = this.rungDraft.businessCode.trim();
    if (!title || !businessCode) {
      this.error = 'Rung title and business code are required.';
      return;
    }

    this.saving = true;
    this.error = null;
    this.success = null;

    try {
      if (this.editingRungId) {
        const putData: CareerLadderRungRefPUTData = {
          careerLadderRefId: this.selected.id,
          businessCode,
          sequenceOrder: Number(this.rungDraft.sequenceOrder) || 1,
          title,
          shortTitle: this.rungDraft.shortTitle.trim() || undefined,
          oneLiner: this.rungDraft.oneLiner.trim() || undefined,
          summary: this.rungDraft.summary.trim() || undefined,
          payHint: this.rungDraft.payHint.trim() || undefined,
          ageNote: this.rungDraft.ageNote.trim() || undefined,
          available: Number(this.rungDraft.available) || 0,
        };
        await firstValueFrom(
          this.hcclService.updateCareerLadderRungRefById(this.editingRungId, putData),
        );
        this.success = 'Rung updated.';
      } else {
        const postData: CareerLadderRungRefPOSTData = {
          careerLadderRefId: this.selected.id,
          businessCode,
          sequenceOrder: Number(this.rungDraft.sequenceOrder) || 1,
          title,
          shortTitle: this.rungDraft.shortTitle.trim() || undefined,
          oneLiner: this.rungDraft.oneLiner.trim() || undefined,
          summary: this.rungDraft.summary.trim() || undefined,
          payHint: this.rungDraft.payHint.trim() || undefined,
          ageNote: this.rungDraft.ageNote.trim() || undefined,
          available: Number(this.rungDraft.available) || 0,
        };
        await firstValueFrom(this.hcclService.createCareerLadderRungRef(postData));
        this.success = 'Rung created.';
      }
      await this.loadRungs(this.selected.id);
    } catch (err: unknown) {
      console.error('Failed to save rung', err);
      this.error = err instanceof Error ? err.message : 'Failed to save rung.';
    } finally {
      this.saving = false;
    }
  }

  async deleteRung(rung: RungFormModel): Promise<void> {
    if (!rung.id || !this.selected?.id) {
      return;
    }
    const ok = window.confirm(`Delete rung "${rung.title}"?`);
    if (!ok) {
      return;
    }

    this.saving = true;
    this.error = null;
    try {
      await firstValueFrom(this.hcclService.deleteCareerLadderRungRefById(rung.id));
      this.success = 'Rung deleted.';
      await this.loadRungs(this.selected.id);
    } catch (err: unknown) {
      console.error('Failed to delete rung', err);
      this.error = err instanceof Error ? err.message : 'Failed to delete rung.';
    } finally {
      this.saving = false;
    }
  }

  availableLabel(value: number | undefined): string {
    if (value === 1) {
      return 'Available';
    }
    if (value === 2) {
      return 'Prototype';
    }
    return 'Unavailable';
  }

  private emptyLadderForm(): LadderFormModel {
    return {
      businessCode: '',
      name: '',
      tagline: '',
      description: '',
      available: 1,
    };
  }

  private emptyRungForm(sequenceOrder: number): RungFormModel {
    return {
      businessCode: '',
      sequenceOrder,
      title: '',
      shortTitle: '',
      oneLiner: '',
      summary: '',
      payHint: '',
      ageNote: '',
      available: 1,
    };
  }

  private rungFromEntity(rung: CareerLadderRungRefGETData): RungFormModel {
    return {
      id: rung.id,
      businessCode: rung.businessCode || '',
      sequenceOrder: rung.sequenceOrder ?? 1,
      title: rung.title || '',
      shortTitle: rung.shortTitle || '',
      oneLiner: rung.oneLiner || '',
      summary: rung.summary || '',
      payHint: rung.payHint || '',
      ageNote: rung.ageNote || '',
      available: rung.available ?? 1,
    };
  }

  private nextSequenceOrder(): number {
    if (!this.rungs.length) {
      return 1;
    }
    return Math.max(...this.rungs.map((r) => r.sequenceOrder || 0)) + 1;
  }
}
