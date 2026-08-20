import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CareerLadderRefCriteria } from '@app/restsvc/hccl.service';
import { CAREER_LADDERS, CareerLadder } from '@app/shared/data/career-ladders';

@Component({
  selector: 'app-ladder-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ladder-selector.component.html',
  styleUrl: './ladder-selector.component.scss',
})
export class LadderSelectorComponent implements OnChanges {
  /** Ticket LadderCriteria — V1 filters the static icon list client-side. */
  @Input() ladderCriteria: CareerLadderRefCriteria | null = null;

  /**
   * Max ladders the user may select.
   * Use 0 (default) for no practical cap.
   */
  @Input() maxAllowedToChoose = 0;

  @Input() selectedIds: string[] = [];

  @Output() selectionChange = new EventEmitter<CareerLadder[]>();

  private readonly allLadders: CareerLadder[] = CAREER_LADDERS;
  private selectedIdSet = new Set<string>();

  filteredLadders: CareerLadder[] = [...CAREER_LADDERS];
  chosenLadders: CareerLadder[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ladderCriteria']) {
      this.applyCriteriaFilter();
    }
    if (changes['selectedIds']) {
      this.selectedIdSet = new Set(this.selectedIds || []);
      this.refreshChosen();
    }
  }

  isSelected(id: string): boolean {
    return this.selectedIdSet.has(id);
  }

  toggleLadder(ladder: CareerLadder): void {
    if (this.selectedIdSet.has(ladder.id)) {
      this.selectedIdSet.delete(ladder.id);
    } else {
      const max = this.maxAllowedToChoose;
      if (max === 1) {
        this.selectedIdSet.clear();
        this.selectedIdSet.add(ladder.id);
      } else if (max > 1 && this.selectedIdSet.size >= max) {
        return;
      } else {
        this.selectedIdSet.add(ladder.id);
      }
    }
    this.refreshChosen();
    this.selectionChange.emit(this.chosenLadders);
  }

  removeChosen(ladder: CareerLadder, event: Event): void {
    event.stopPropagation();
    this.selectedIdSet.delete(ladder.id);
    this.refreshChosen();
    this.selectionChange.emit(this.chosenLadders);
  }

  private applyCriteriaFilter(): void {
    const criteria = this.ladderCriteria;
    let list = [...this.allLadders];

    if (criteria?.ids?.length) {
      const allowed = new Set(criteria.ids);
      list = list.filter((l) => allowed.has(l.id));
    }
    if (criteria?.idsToExclude?.length) {
      const excluded = new Set(criteria.idsToExclude);
      list = list.filter((l) => !excluded.has(l.id));
    }
    const search = (criteria?.searchByText || criteria?.name || '').trim().toLowerCase();
    if (search) {
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(search) ||
          l.description.toLowerCase().includes(search) ||
          l.id.toLowerCase().includes(search),
      );
    }

    this.filteredLadders = list;
    this.refreshChosen();
  }

  private refreshChosen(): void {
    this.chosenLadders = this.allLadders.filter((l) => this.selectedIdSet.has(l.id));
  }
}
