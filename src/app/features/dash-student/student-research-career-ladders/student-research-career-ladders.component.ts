import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CareerLadderRefCriteria,
  CareerLadderRefGETData,
  CareerLadderRungRefCriteria,
  CareerLadderRungRefGETData,
  HcclService,
} from '@app/restsvc/hccl.service';
import { firstValueFrom } from 'rxjs';

interface LadderRungState {
  loading: boolean;
  loaded: boolean;
  error: string | null;
  rungs: CareerLadderRungRefGETData[];
}

@Component({
  selector: 'app-student-research-career-ladders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-research-career-ladders.component.html',
  styleUrls: ['./student-research-career-ladders.component.scss'],
})
export class StudentResearchCareerLaddersComponent implements OnInit {
  private readonly hcclService = inject(HcclService);

  searchKeyword = '';
  isLoading = false;
  error: string | null = null;

  private allLadders: CareerLadderRefGETData[] = [];
  filteredLadders: CareerLadderRefGETData[] = [];

  expandedLadderIds = new Set<string>();
  private rungStateByLadderId = new Map<string, LadderRungState>();

  ngOnInit(): void {
    void this.loadLadders();
  }

  async loadLadders(): Promise<void> {
    this.isLoading = true;
    this.error = null;
    try {
      const criteria: CareerLadderRefCriteria = {
        isPaging: false,
        maxResults: 500,
        available: 1,
      };
      const response = await firstValueFrom(this.hcclService.findCareerLadderRefs(criteria));
      this.allLadders = [...(response?.searchResults || [])].sort((a, b) =>
        (a.name || '').localeCompare(b.name || ''),
      );
      this.applyFilter();
    } catch (err: unknown) {
      console.error('[CareerLadders] Failed to load career ladders', err);
      this.error = err instanceof Error ? err.message : 'Failed to load career ladders.';
      this.allLadders = [];
      this.filteredLadders = [];
    } finally {
      this.isLoading = false;
    }
  }

  applyFilter(): void {
    const q = this.searchKeyword.trim().toLowerCase();
    if (!q) {
      this.filteredLadders = this.allLadders;
      return;
    }
    this.filteredLadders = this.allLadders.filter((ladder) => {
      const name = (ladder.name || '').toLowerCase();
      const description = (ladder.description || '').toLowerCase();
      if (name.includes(q) || description.includes(q)) {
        return true;
      }
      // Also match already-loaded rung pay hints / titles.
      const state = ladder.id ? this.rungStateByLadderId.get(ladder.id) : undefined;
      return !!state?.rungs.some((rung) => {
        const haystack = [rung.title, rung.oneLiner, rung.payHint, rung.summary]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(q);
      });
    });
  }

  onSearch(): void {
    this.applyFilter();
  }

  clearSearch(): void {
    this.searchKeyword = '';
    this.applyFilter();
  }

  isExpanded(ladder: CareerLadderRefGETData): boolean {
    return !!ladder.id && this.expandedLadderIds.has(ladder.id);
  }

  getRungState(ladder: CareerLadderRefGETData): LadderRungState | null {
    if (!ladder.id) {
      return null;
    }
    return this.rungStateByLadderId.get(ladder.id) || null;
  }

  async toggleLadder(ladder: CareerLadderRefGETData): Promise<void> {
    if (!ladder.id) {
      return;
    }
    if (this.expandedLadderIds.has(ladder.id)) {
      this.expandedLadderIds.delete(ladder.id);
      return;
    }
    this.expandedLadderIds.add(ladder.id);
    await this.ensureRungsLoaded(ladder);
  }

  private async ensureRungsLoaded(ladder: CareerLadderRefGETData): Promise<void> {
    const ladderId = ladder.id;
    if (!ladderId) {
      return;
    }
    const existing = this.rungStateByLadderId.get(ladderId);
    if (existing?.loaded || existing?.loading) {
      return;
    }

    const state: LadderRungState = {
      loading: true,
      loaded: false,
      error: null,
      rungs: [],
    };
    this.rungStateByLadderId.set(ladderId, state);

    try {
      const criteria: CareerLadderRungRefCriteria = {
        careerLadderRefId: ladderId,
        isPaging: false,
        maxResults: 100,
        available: 1,
      };
      console.log('[CareerLadders] loading rungs', criteria);
      const response = await firstValueFrom(this.hcclService.findCareerLadderRungRefs(criteria));
      let rungs = [...(response?.searchResults || [])];

      // If available=1 is empty, fall back to all rungs for this ladder.
      if (!rungs.length) {
        const unfiltered = await firstValueFrom(
          this.hcclService.findCareerLadderRungRefs({
            careerLadderRefId: ladderId,
            isPaging: false,
            maxResults: 100,
          }),
        );
        rungs = [...(unfiltered?.searchResults || [])];
        console.log('[CareerLadders] unfiltered rungs', rungs.length, rungs);
      }

      rungs.sort((a, b) => (a.sequenceOrder ?? 0) - (b.sequenceOrder ?? 0));
      state.rungs = rungs;
      state.loaded = true;
      console.log('[CareerLadders] rungs loaded', {
        ladderId,
        count: rungs.length,
        sample: rungs[0],
      });
    } catch (err: unknown) {
      console.error('[CareerLadders] Failed to load rungs', ladderId, err);
      state.error = err instanceof Error ? err.message : 'Failed to load ladder steps.';
      state.rungs = [];
      state.loaded = true;
    } finally {
      state.loading = false;
      this.rungStateByLadderId.set(ladderId, { ...state });
    }
  }
}
