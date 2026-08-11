import { CommonModule } from '@angular/common';
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

@Component({
  selector: 'app-career-ladder-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './career-ladder-admin.component.html',
  styleUrl: './career-ladder-admin.component.scss',
})
export class CareerLadderAdminComponent implements OnInit {
  private readonly hcclService = inject(HcclService);

  mode: EditorMode = 'list';
  loading = false;
  saving = false;
  error: string | null = null;
  success: string | null = null;

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
