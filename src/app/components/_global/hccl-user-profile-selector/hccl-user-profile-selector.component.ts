import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Subject,
  Subscription,
  of,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  tap,
} from 'rxjs';
import {
  HcclService,
  HcclUserProfileCriteria,
  HcclUserProfileGETData,
} from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-hccl-user-profile-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hccl-user-profile-selector.component.html',
  styleUrl: './hccl-user-profile-selector.component.scss',
})
export class HcclUserProfileSelectorComponent implements OnInit, OnChanges, OnDestroy {
  private readonly hcclService = inject(HcclService);

  /**
   * Parent-supplied search filters (org, future type, etc.).
   * This widget only overwrites searchByText when looking up.
   */
  @Input() criteria: HcclUserProfileCriteria | null = null;

  /**
   * Max profiles the user may select (including locked).
   * Use 0 (default) for no practical cap.
   */
  @Input() maxAllowedToChoose = 0;

  /** Profile ids that must stay selected (no remove button). */
  @Input() lockedIds: string[] = [];

  /** Controlled selection from parent (locked + extras). */
  @Input() selectedIds: string[] = [];

  /** Prefill chosen profiles (e.g. current user as locked leader). */
  @Input() initialSelected: HcclUserProfileGETData[] = [];

  @Input() minSearchLength = 4;

  @Input() placeholder = 'Search by message handle or email (4+ characters)...';

  @Output() selectionChange = new EventEmitter<HcclUserProfileGETData[]>();

  searchText = '';
  searching = false;
  searchResults: HcclUserProfileGETData[] = [];
  chosenProfiles: HcclUserProfileGETData[] = [];

  private selectedIdSet = new Set<string>();
  private lockedIdSet = new Set<string>();
  private profileById = new Map<string, HcclUserProfileGETData>();
  private searchSubject = new Subject<string>();
  private searchSub?: Subscription;

  ngOnInit(): void {
    this.searchSub = this.searchSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => {
          this.searching = true;
        }),
        switchMap((text) => {
          if (text.length < this.minSearchLength) {
            this.searching = false;
            this.searchResults = [];
            return of(null);
          }
          const body: HcclUserProfileCriteria = {
            ...(this.criteria || {}),
            searchByText: text,
            optionalDataHint: 'all',
            pageNumber: 1,
            pageSize: this.criteria?.pageSize || 20,
            isPaging: this.criteria?.isPaging ?? true,
          };
          return this.hcclService.findHcclUserProfiles(body).pipe(
            catchError(() => {
              this.searching = false;
              this.searchResults = [];
              return of(null);
            }),
          );
        }),
      )
      .subscribe((response) => {
        if (response === null) {
          return;
        }
        this.searching = false;
        this.searchResults = (response.searchResults || []).filter((p) => !!p.id);
        for (const profile of this.searchResults) {
          if (profile.id) {
            this.profileById.set(profile.id, profile);
          }
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lockedIds']) {
      this.lockedIdSet = new Set((this.lockedIds || []).filter(Boolean));
    }
    if (changes['initialSelected']) {
      for (const profile of this.initialSelected || []) {
        if (profile?.id) {
          this.profileById.set(profile.id, profile);
        }
      }
    }
    if (changes['selectedIds'] || changes['lockedIds'] || changes['initialSelected']) {
      this.selectedIdSet = new Set<string>([
        ...(this.selectedIds || []).filter(Boolean),
        ...this.lockedIdSet,
      ]);
      this.refreshChosen();
    }
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  onSearchChange(): void {
    const text = (this.searchText || '').trim();
    if (text.length < this.minSearchLength) {
      this.searchResults = [];
      this.searching = false;
    }
    this.searchSubject.next(text);
  }

  isSelected(id: string | undefined): boolean {
    return !!id && this.selectedIdSet.has(id);
  }

  isLocked(id: string | undefined): boolean {
    return !!id && this.lockedIdSet.has(id);
  }

  displayName(profile: HcclUserProfileGETData): string {
    return (
      profile.theUser?.name ||
      profile.entityDisplayName ||
      profile.messageHandle ||
      profile.userEmail ||
      profile.id ||
      'Unknown'
    );
  }

  organizationName(profile: HcclUserProfileGETData): string {
    return profile.organization?.entityDisplayName || profile.organization?.name || '—';
  }

  rolesLabel(profile: HcclUserProfileGETData): string {
    const roles = profile.roles || [];
    if (!roles.length) {
      return profile.profileTypeCode || '—';
    }
    return roles.join(', ');
  }

  selectResult(profile: HcclUserProfileGETData): void {
    const id = profile.id;
    if (!id) {
      return;
    }

    if (this.selectedIdSet.has(id)) {
      if (this.lockedIdSet.has(id)) {
        return;
      }
      this.selectedIdSet.delete(id);
    } else {
      if (this.lockedIdSet.has(id)) {
        this.selectedIdSet.add(id);
      } else {
        const max = this.maxAllowedToChoose;
        if (max === 1 && this.lockedIdSet.size === 0) {
          this.selectedIdSet.clear();
          this.selectedIdSet.add(id);
        } else if (max > 0 && this.selectedIdSet.size >= max) {
          return;
        } else {
          this.selectedIdSet.add(id);
        }
      }
      this.profileById.set(id, profile);
    }

    this.refreshChosen();
    this.emitSelection();
  }

  removeChosen(profile: HcclUserProfileGETData, event: Event): void {
    event.stopPropagation();
    const id = profile.id;
    if (!id || this.lockedIdSet.has(id)) {
      return;
    }
    this.selectedIdSet.delete(id);
    this.refreshChosen();
    this.emitSelection();
  }

  private refreshChosen(): void {
    const locked: HcclUserProfileGETData[] = [];
    const extras: HcclUserProfileGETData[] = [];
    for (const id of this.selectedIdSet) {
      const profile =
        this.profileById.get(id) ||
        this.initialSelected?.find((p) => p.id === id) ||
        ({ id } as HcclUserProfileGETData);
      if (this.lockedIdSet.has(id)) {
        locked.push(profile);
      } else {
        extras.push(profile);
      }
    }
    this.chosenProfiles = [...locked, ...extras];
  }

  private emitSelection(): void {
    this.selectionChange.emit([...this.chosenProfiles]);
  }
}
