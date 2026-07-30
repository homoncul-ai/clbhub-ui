import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CatalogEntryGETData, CatalogEntryCriteria, CatalogEntryGETDataSearchResults } from '../../../restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { map, Observable } from 'rxjs';
import { SimpleButtonbarComponent } from '@app/components/_global/simple-buttonbar/simple-buttonbar.component';
import {
  FeedDateRangeModalComponent,
  FeedDateRangeModalResult,
} from '@app/features/dash-student/feed-date-range-modal.component';

/**
 * Component for displaying and managing CatalogEntry data using HcclService
 * Extends AbstractListComponent for common grid functionality
 */

@Component({
  selector: 'app-catalogentry-list',
  standalone: true,
//  templateUrl: '../../_global/abstract-list/abstract-list-bb.component.html',
  templateUrl: './catalogentry-list.component.html',
  styleUrls: ['../../_global/abstract-list/abstract-list.component.scss'],
    imports: [CommonModule, SimpleButtonbarComponent]
})
export class CatalogEntryListComponent extends AbstractListComponent<CatalogEntryGETData, CatalogEntryCriteria, CatalogEntryGETDataSearchResults> {
  /** yyyy-mm-dd bounds from the Start Date range modal (inclusive). */
  private dateStartRangeFrom = '';
  private dateStartRangeTo = '';
  private dateStartRangeModalOpen = false;
  private dateStartFilterWired = false;

  constructor(
    protected override router: Router
  ) {
    super();
    
    // Set entity-specific properties
    this.searchHeading = 'Catalog Entries';
    this.showingAddButton = true;
    this.showingIdCheckbox = true;
    // Header filters must hit beyond the current page (see findEntities client filter path).
    this.usingServerSideColumnFilters = true;
    //this.searchPlaceholder = ...
  }

  /**
   * Search/column text filters are applied in findEntities. Do not put them on
   * searchByText — QA postgres SQL for that field is broken (invalid query).
   */
  protected override applyColumnFiltersToCriteria(_criteria: CatalogEntryCriteria): void {
    // Intentionally empty: columnFilters is read directly in findEntities.
  }

  protected override addGridEventListeners(grid: any): void {
    super.addGridEventListeners(grid);
    this.dateStartFilterWired = false;
    this.wireDateStartRangeFilter(grid);
  }

  /** Start Date uses a custom header control, not free-text inputFilter. */
  protected override handleColumnFilterChange(colId: string, _value: string): boolean {
    return colId === 'dateStart';
  }

  protected override restoreServerSideColumnFilterInputs(): void {
    super.restoreServerSideColumnFilterInputs();
    this.updateDateStartFilterHeaderLabel();
  }

  protected getGridColumns(): any[] {
    return [
     // { id: 'id', header: [{ text: 'ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      //{ id: 'catalogId', header: [{ text: 'Catalog ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'entryCode', header: [{ text: 'Entry Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'entryTypeCode', header: [{ text: 'Entry Type', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'title', header: [{ text: 'Title', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, maxWidth: 300, adjust: true },
      {
        id: 'dateStart',
        sortable: false,
        header: [
          { text: 'Start Date', align: 'center' },
          {
            htmlEnable: true,
            text: this.buildDateStartFilterHeaderHtml(),
          },
        ],
        minWidth: 160,
        adjust: true,
      },
      { id: 'shortDescription', header: [{ text: 'Short Description', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true, wordWrap: true },
      //{ id: 'description', header: [{ text: 'Description', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      //{ id: 'notes', header: [{ text: 'Notes', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      //{ id: 'available', header: [{ text: 'Available', align: 'center' }, { content: 'inputFilter' }], minWidth: 100, adjust: true },
      //{ id: 'url', header: [{ text: 'URL', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      //{ id: 'vocodeInstanceId', header: [{ text: 'Vocode Instance ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      //{ id: 'integrationEntityId', header: [{ text: 'Integration Entity ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      //{ id: 'integrationEntityType', header: [{ text: 'Integration Entity Type', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      //{ id: 'integrationEntityName', header: [{ text: 'Integration Entity Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
//      { id: 'createdByInfo', header: [{ text: 'Created By', align: 'center' }], minWidth: 120, adjust: true },
  //    { id: 'dateCreated', header: [{ text: 'Date Created', align: 'center' }], minWidth: 120, adjust: true },
    //  { id: 'lastUpdatedByInfo', header: [{ text: 'Last Updated By', align: 'center' }], minWidth: 120, adjust: true },
      //{ id: 'dateLastUpdated', header: [{ text: 'Date Last Updated', align: 'center' }], minWidth: 120, adjust: true }
    ];
  }

  protected createCriteria(): CatalogEntryCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected findEntities(criteria: CatalogEntryCriteria): Observable<CatalogEntryGETDataSearchResults> {
    if (criteria.vocationEncodingId) {
      return this.hcclService.findCatalogEntrysUsingVocode(criteria).pipe(
        map(response => response.catalogEntries ?? { searchResults: [] })
      );
    }

    const topSearch = criteria.searchByText?.trim() || '';
    const entryCode = this.columnFilters['entryCode']?.trim() || '';
    const title = this.columnFilters['title']?.trim() || '';
    const shortDescription = this.columnFilters['shortDescription']?.trim() || '';
    const entryTypeCode = this.columnFilters['entryTypeCode']?.trim() || '';
    const hasDateRange = !!this.dateStartRangeFrom || !!this.dateStartRangeTo;

    const hasTextFilter =
      (!!topSearch && topSearch !== '*') ||
      !!entryCode ||
      !!title ||
      !!shortDescription ||
      !!entryTypeCode ||
      hasDateRange;

    // Never send searchByText to the API until the postgres predicate is fixed in QA.
    const { searchByText: _ignored, catalogTypeCode: _typeIgnored, ...base } = criteria;
    const apiCriteria: CatalogEntryCriteria = { ...base };

    if (!hasTextFilter) {
      return this.hcclService.findCatalogEntrys(apiCriteria);
    }

    // Broader fetch, then filter + page client-side (covers full result set up to maxResults).
    const fetchCriteria: CatalogEntryCriteria = {
      ...apiCriteria,
      isPaging: false,
      maxResults: criteria.maxResults && criteria.maxResults > 0 ? criteria.maxResults : 5000,
    };
    delete fetchCriteria.pageNumber;
    delete fetchCriteria.pageSize;

    const pageNumber = Number(criteria.pageNumber) || 1;
    const pageSize = Number(criteria.pageSize) || this.pageSize || 50;

    return this.hcclService.findCatalogEntrys(fetchCriteria).pipe(
      map((response) => {
        let rows = response.searchResults || [];
        rows = this.filterCatalogEntriesClientSide(rows, {
          topSearch,
          entryCode,
          title,
          shortDescription,
          entryTypeCode,
          dateStartFrom: this.dateStartRangeFrom,
          dateStartTo: this.dateStartRangeTo,
        });
        const start = (pageNumber - 1) * pageSize;
        return {
          searchResults: rows.slice(start, start + pageSize),
          pagingInfo: {
            totalRows: rows.length,
            pageNumber,
            pageSize,
          },
        };
      })
    );
  }

  private wireDateStartRangeFilter(grid: any): void {
    if (this.dateStartFilterWired || !grid?.events) {
      return;
    }
    this.dateStartFilterWired = true;

    grid.events.on('headerCellClick', (_cell: any, column: any, event: MouseEvent) => {
      if (column?.id !== 'dateStart') {
        return;
      }
      event?.preventDefault?.();
      event?.stopPropagation?.();
      this.openDateStartRangeModal();
    });

    // Also catch clicks on the custom filter button if the event target is nested HTML.
    const host = this.gridContainer?.nativeElement as HTMLElement | undefined;
    if (host && !host.dataset['dateStartFilterDelegate']) {
      host.dataset['dateStartFilterDelegate'] = '1';
      host.addEventListener(
        'click',
        (event: MouseEvent) => {
          const target = event.target as HTMLElement | null;
          if (!target?.closest?.('.catalog-date-range-filter-btn')) {
            return;
          }
          event.preventDefault();
          event.stopPropagation();
          this.openDateStartRangeModal();
        },
        true
      );
    }

    setTimeout(() => this.updateDateStartFilterHeaderLabel(), 0);
  }

  private buildDateStartFilterHeaderHtml(): string {
    const summary = this.formatDateStartRangeSummary();
    const label = summary || 'Select range…';
    const active = !!summary;
    // Inline styles: DHTMLX injects this HTML outside Angular encapsulation.
    const border = active ? '#94a3b8' : '#e5e7eb';
    const color = active ? '#0f172a' : '#9ca3af';
    const background = active ? '#f8fafc' : '#ffffff';
    return `
      <button
        type="button"
        class="catalog-date-range-filter-btn${active ? ' is-active' : ''}"
        title="Filter by start date range"
        style="
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
          width: calc(100% - 4px);
          min-height: 26px;
          margin: 2px;
          padding: 3px 8px 3px 10px;
          border: 1px solid ${border};
          border-radius: 4px;
          background: ${background};
          color: ${color};
          font: 400 12px/1.2 system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
          text-align: left;
          cursor: pointer;
          white-space: nowrap;
          overflow: hidden;
          box-shadow: inset 0 1px 1px rgba(15, 23, 42, 0.03);
        "
      >
        <span style="overflow: hidden; text-overflow: ellipsis;">${label}</span>
        <i class="fas fa-calendar-alt" style="flex-shrink: 0; font-size: 11px; opacity: 0.55; color: #6b7280;"></i>
      </button>
    `.replace(/\s+/g, ' ').trim();
  }

  private updateDateStartFilterHeaderLabel(): void {
    const host = this.gridContainer?.nativeElement as HTMLElement | undefined;
    const btn = host?.querySelector?.('.catalog-date-range-filter-btn') as HTMLButtonElement | null;
    if (!btn) {
      return;
    }
    const summary = this.formatDateStartRangeSummary();
    const labelEl = btn.querySelector('span');
    if (labelEl) {
      labelEl.textContent = summary || 'Select range…';
    } else {
      btn.textContent = summary || 'Select range…';
    }
    btn.classList.toggle('is-active', !!summary);
    btn.style.borderColor = summary ? '#94a3b8' : '#e5e7eb';
    btn.style.color = summary ? '#0f172a' : '#9ca3af';
    btn.style.background = summary ? '#f8fafc' : '#ffffff';
  }

  private openDateStartRangeModal(): void {
    if (this.dateStartRangeModalOpen) {
      return;
    }
    this.dateStartRangeModalOpen = true;

    const modalRef = this.modalService.open(FeedDateRangeModalComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        dateStart: this.dateStartRangeFrom,
        dateEnd: this.dateStartRangeTo,
        title: 'Start date range',
        helpText: 'Choose a date range to filter opportunities by their start date.',
      },
    });

    modalRef.onClose.subscribe((result: FeedDateRangeModalResult | undefined) => {
      this.dateStartRangeModalOpen = false;
      if (!result) {
        return;
      }

      this.dateStartRangeFrom = (result.dateStart || '').trim();
      this.dateStartRangeTo = (result.dateEnd || '').trim();
      const summary = this.formatDateStartRangeSummary();

      if (summary) {
        this.columnFilters['dateStart'] = summary;
      } else {
        delete this.columnFilters['dateStart'];
      }

      this.updateDateStartFilterHeaderLabel();
      this.loadGridData(undefined, true);
    });
  }

  private formatDateStartRangeSummary(): string | null {
    if (!this.dateStartRangeFrom && !this.dateStartRangeTo) {
      return null;
    }
    if (this.dateStartRangeFrom && this.dateStartRangeTo) {
      return `${this.formatDisplayDate(this.dateStartRangeFrom)} – ${this.formatDisplayDate(this.dateStartRangeTo)}`;
    }
    if (this.dateStartRangeFrom) {
      return `From ${this.formatDisplayDate(this.dateStartRangeFrom)}`;
    }
    return `Through ${this.formatDisplayDate(this.dateStartRangeTo)}`;
  }

  private formatDisplayDate(dateValue: string): string {
    const [year, month, day] = dateValue.split('-').map(Number);
    if (!year || !month || !day) {
      return dateValue;
    }
    return new Date(year, month - 1, day).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  private formatDateStart(entity: CatalogEntryGETData): string {
    return entity.dateStart?.formattedDate
      || entity.dateStart?.formattedDateTime
      || '';
  }

  /** Normalize an opportunity dateStart to yyyy-mm-dd for range compares. */
  private getRowDateStartYmd(row: CatalogEntryGETData): string | null {
    if (row.dateStart?.dateMilliseconds != null) {
      const d = new Date(row.dateStart.dateMilliseconds);
      if (!Number.isNaN(d.getTime())) {
        return this.toYmd(d);
      }
    }
    if (row.dateStart?.year != null && row.dateStart?.month != null && row.dateStart?.dayOfMonth != null) {
      const yyyy = String(row.dateStart.year);
      const mm = String(row.dateStart.month).padStart(2, '0');
      const dd = String(row.dateStart.dayOfMonth).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }
    const raw = row.dateStart?.date ? String(row.dateStart.date) : '';
    const match = raw.match(/(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : null;
  }

  private toYmd(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private filterCatalogEntriesClientSide(
    rows: CatalogEntryGETData[],
    filters: {
      topSearch: string;
      entryCode: string;
      title: string;
      shortDescription: string;
      entryTypeCode: string;
      dateStartFrom: string;
      dateStartTo: string;
    }
  ): CatalogEntryGETData[] {
    const matchesField = (value: string | undefined, needle: string): boolean => {
      if (!needle || needle === '*') {
        return true;
      }
      const hay = (value || '').toLowerCase();
      const n = needle.toLowerCase();
      if (n.includes('*')) {
        const pattern = n
          .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
          .replace(/\*/g, '.*');
        return new RegExp(`^${pattern}$`, 'i').test(value || '');
      }
      return hay.includes(n);
    };

    const matchesDateStartRange = (row: CatalogEntryGETData): boolean => {
      if (!filters.dateStartFrom && !filters.dateStartTo) {
        return true;
      }
      const rowYmd = this.getRowDateStartYmd(row);
      if (!rowYmd) {
        return false;
      }
      if (filters.dateStartFrom && rowYmd < filters.dateStartFrom) {
        return false;
      }
      if (filters.dateStartTo && rowYmd > filters.dateStartTo) {
        return false;
      }
      return true;
    };

    return rows.filter((row) => {
      if (filters.topSearch && filters.topSearch !== '*') {
        const top = filters.topSearch.toLowerCase();
        const fields = [
          row.entryCode || '',
          row.title || '',
          row.shortDescription || '',
          row.catalogTypeCode || '',
          this.formatDateStart(row),
        ];
        const hit = top.includes('*')
          ? fields.some((f) => matchesField(f, filters.topSearch))
          : fields.some((f) => f.toLowerCase().includes(top));
        if (!hit) {
          return false;
        }
      }
      if (!matchesField(row.entryCode, filters.entryCode)) {
        return false;
      }
      if (!matchesField(row.title, filters.title)) {
        return false;
      }
      if (!matchesField(row.shortDescription, filters.shortDescription)) {
        return false;
      }
      if (!matchesField(row.catalogTypeCode, filters.entryTypeCode)) {
        return false;
      }
      if (!matchesDateStartRange(row)) {
        return false;
      }
      return true;
    });
  }

  protected hasSearchResults(response: CatalogEntryGETDataSearchResults): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(response: CatalogEntryGETDataSearchResults): CatalogEntryGETData[] {
    return response.searchResults || [];
  }

  protected override formatEntityData(entity: CatalogEntryGETData): any {
    return {
      createdByInfo: entity.createdByInfo?.name || '',
      lastUpdatedByInfo: entity.lastUpdatedByInfo?.name || '',
      dateCreated: entity.dateCreated?.formattedDate || '',
      dateLastUpdated: entity.dateLastUpdated?.formattedDate || '',
      dateStart: this.formatDateStart(entity),
      entryTypeCode: entity.catalogTypeCode || ''
    };
  }
}
