import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { HcclService, PersonalStatementPOSTData, VocationEncodingRefCriteria, VocationEncodingRefGETData } from '@app/restsvc/hccl.service';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { CAREER_LADDERS, CareerLadder } from '@app/shared/data/career-ladders';

export interface WizardSelection {
  careerLadderId: string;
  name: string;
  icon: string;
  source: 'icon' | 'search';
  vocodeRefId?: string;
}

@Component({
  selector: 'app-career-interest-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './career-interest-wizard.component.html',
  styleUrl: './career-interest-wizard.component.scss',
})
export class CareerInterestWizardComponent {
  private readonly hcclService = inject(HcclService);
  private readonly hcclContextService = inject(HcclContextService);

  @Output() closed = new EventEmitter<void>();
  @Output() completed = new EventEmitter<void>();

  currentPage = 1;
  totalPages = 3;
  submitting = false;
  error = '';

  readonly careerLadders: CareerLadder[] = CAREER_LADDERS;
  selectedFromIcons: Set<string> = new Set();

  searchText = '';
  searchResults: VocationEncodingRefGETData[] = [];
  searching = false;
  selectedFromSearch: Map<string, VocationEncodingRefGETData> = new Map();

  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(debounceTime(400)).subscribe(text => {
      this.performSearch(text);
    });
  }

  // Page 1: Icon selection
  toggleIcon(ladder: CareerLadder): void {
    if (this.selectedFromIcons.has(ladder.id)) {
      this.selectedFromIcons.delete(ladder.id);
    } else {
      this.selectedFromIcons.add(ladder.id);
    }
  }

  isIconSelected(id: string): boolean {
    return this.selectedFromIcons.has(id);
  }

  // Page 2: Search
  onSearchChange(): void {
    if (this.searchText.trim().length >= 2) {
      this.searchSubject.next(this.searchText.trim());
    } else {
      this.searchResults = [];
    }
  }

  private performSearch(text: string): void {
    this.searching = true;
    const criteria: VocationEncodingRefCriteria = {
      searchByText: text,
      maxResults: 20,
      isPaging: false,
    };
    this.hcclService.findVocationEncodingRefs(criteria).subscribe({
      next: (res) => {
        this.searchResults = res?.searchResults || [];
        this.searching = false;
      },
      error: () => {
        this.searchResults = [];
        this.searching = false;
      },
    });
  }

  toggleSearchResult(ref: VocationEncodingRefGETData): void {
    const id = ref.id!;
    if (this.selectedFromSearch.has(id)) {
      this.selectedFromSearch.delete(id);
    } else {
      this.selectedFromSearch.set(id, ref);
    }
  }

  isSearchResultSelected(id: string): boolean {
    return this.selectedFromSearch.has(id);
  }

  // Navigation
  nextPage(): void {
    this.currentPage = Math.min(this.currentPage + 1, this.totalPages);
  }

  prevPage(): void {
    this.currentPage = Math.max(this.currentPage - 1, 1);
  }

  // Page 3: Summary helpers
  getIconSelections(): WizardSelection[] {
    return Array.from(this.selectedFromIcons).map(id => {
      const ladder = this.careerLadders.find(l => l.id === id)!;
      return { careerLadderId: id, name: ladder.name, icon: ladder.icon, source: 'icon' as const };
    });
  }

  getSearchSelections(): WizardSelection[] {
    return Array.from(this.selectedFromSearch.values()).map(ref => ({
      careerLadderId: ref.id!,
      name: ref.name || ref.entityDisplayName || 'Unknown',
      icon: 'fas fa-search',
      source: 'search' as const,
      vocodeRefId: ref.id,
    }));
  }

  getAllSelections(): WizardSelection[] {
    return [...this.getIconSelections(), ...this.getSearchSelections()];
  }

  hasSelections(): boolean {
    return this.selectedFromIcons.size > 0 || this.selectedFromSearch.size > 0;
  }

  removeSelection(sel: WizardSelection): void {
    if (sel.source === 'icon') {
      this.selectedFromIcons.delete(sel.careerLadderId);
    } else {
      this.selectedFromSearch.delete(sel.careerLadderId);
    }
  }

  // Submit
  async submitInterests(): Promise<void> {
    this.submitting = true;
    this.error = '';

    try {
      await this.hcclContextService.waitForReady();
      const userId = this.hcclContextService.getCurrentUserProfileId();
      if (!userId) {
        this.error = 'Unable to determine current user.';
        this.submitting = false;
        return;
      }

      const selections = this.getAllSelections();
      for (const sel of selections) {
        const postData: PersonalStatementPOSTData = {
          name: sel.name,
          description: `Career interest: ${sel.name}`,
          rawText: sel.name,
          statementTypeCode: 'student_vocation',
          businessCode: 'autocalc',
          parentEntityId: userId,
          parentEntityType: 'HcclUserProfile',
          parentEntityName: 'ParentEntityName',
          encodingText: sel.name,
          vocationEncodingId: sel.vocodeRefId || '',
          status: 1,
        };
        await this.hcclService.createPersonalStatement(postData).toPromise();
      }

      this.submitting = false;
      this.completed.emit();
    } catch (err) {
      console.error('Error creating interests:', err);
      this.error = 'Failed to save interests. Please try again.';
      this.submitting = false;
    }
  }

  close(): void {
    this.closed.emit();
  }
}
