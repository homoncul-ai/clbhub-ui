import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CatalogEntryFeedProfileGETData,
  FeedInputsPOJO,
  MenuControlData,
  MenuControlDataList,
} from '@app/restsvc/hccl.service';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { MenuControlDataListMComponent } from '@app/components/_global/menu-control-data-list-m/menu-control-data-list-m.component';

@Component({
  selector: 'app-feedinputs-ui',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuControlDataListComponent, MenuControlDataListMComponent],
  templateUrl: './feedinputs-ui.component.html',
  styleUrl: './feedinputs-ui.component.scss',
})
export class FeedInputsUiComponent implements OnChanges {
  @Input() catalogEntryFeedProfile?: CatalogEntryFeedProfileGETData;
  @Input() readonly = false;

  randomInfluenceSelectionId = '';
  locationInfluenceSelectionId = '';

  ngOnChanges(_changes: SimpleChanges): void {
    this.ensureFeedInputs();
    this.syncSelectionsFromFeedInputs();
  }

  onRandomInfluenceIdChange(id: string): void {
    this.randomInfluenceSelectionId = id || '';
    this.applyInfluenceFromSelection('random', id);
  }

  onRandomInfluenceSelectionChange(item: MenuControlData | null): void {
    const selectedId = item?.id || '';
    this.randomInfluenceSelectionId = selectedId;
    this.applyInfluenceFromSelection('random', selectedId, item?.name);
  }

  onLocationInfluenceIdChange(id: string): void {
    this.locationInfluenceSelectionId = id || '';
    this.applyInfluenceFromSelection('location', id);
  }

  onLocationInfluenceSelectionChange(item: MenuControlData | null): void {
    const selectedId = item?.id || '';
    this.locationInfluenceSelectionId = selectedId;
    this.applyInfluenceFromSelection('location', selectedId, item?.name);
  }

  onVocationalPrimaryCodesChange(items: MenuControlData[]): void {
    const feedInputs = this.ensureFeedInputs();
    feedInputs.vocationalPrimaryCodes = (items || []).map((item) => item.id || '').filter((code) => !!code);
    this.syncVocationSelections(feedInputs.vocationalPrimaryCodes);
  }

  get feedInputs(): FeedInputsPOJO {
    return this.ensureFeedInputs();
  }

  private ensureFeedInputs(): FeedInputsPOJO {
    if (!this.catalogEntryFeedProfile) {
      this.catalogEntryFeedProfile = {};
    }
    if (!this.catalogEntryFeedProfile.feedInputs) {
      this.catalogEntryFeedProfile.feedInputs = {};
    }

    const feedInputs = this.catalogEntryFeedProfile.feedInputs;
    if (feedInputs.randomInfluence === undefined || feedInputs.randomInfluence === null) {
      feedInputs.randomInfluence = 0;
    }
    if (feedInputs.locationInfluence === undefined || feedInputs.locationInfluence === null) {
      feedInputs.locationInfluence = 0;
    }
    if (feedInputs.usingLocation === undefined || feedInputs.usingLocation === null) {
      feedInputs.usingLocation = false;
    }
    if (feedInputs.usingPersonalStatements === undefined || feedInputs.usingPersonalStatements === null) {
      feedInputs.usingPersonalStatements = true;
    }
    if (!Array.isArray(feedInputs.vocationalPrimaryCodes)) {
      feedInputs.vocationalPrimaryCodes = [];
    }

    return feedInputs;
  }

  private syncSelectionsFromFeedInputs(): void {
    const feedInputs = this.ensureFeedInputs();
    this.randomInfluenceSelectionId = this.resolveMenuSelectionId(
      this.catalogEntryFeedProfile?.sbRandomInfluence || null,
      feedInputs.randomInfluence
    );
    this.locationInfluenceSelectionId = this.resolveMenuSelectionId(
      this.catalogEntryFeedProfile?.sbLocationInfluence || null,
      feedInputs.locationInfluence
    );
    this.syncVocationSelections(feedInputs.vocationalPrimaryCodes || []);
  }

  private syncVocationSelections(selectedCodes: string[]): void {
    const menu = this.catalogEntryFeedProfile?.sbVocations;
    if (!menu?.menuItems?.length) {
      return;
    }
    const selectedLookup = new Set(selectedCodes || []);
    menu.menuItems.forEach((item) => {
      item.selected = !!item.id && selectedLookup.has(item.id);
    });
  }

  private resolveMenuSelectionId(menu: MenuControlDataList | null, value: number | undefined): string {
    if (value === undefined || value === null || !menu?.menuItems?.length) {
      return '';
    }
    const stringValue = String(value);
    const byId = menu.menuItems.find((item) => item.id === stringValue);
    if (byId?.id) {
      return byId.id;
    }
    const byName = menu.menuItems.find((item) => this.tryParseNumber(item.name) === value);
    return byName?.id || '';
  }

  private applyInfluenceFromSelection(
    target: 'random' | 'location',
    selectedId: string | undefined,
    fallbackName?: string | undefined
  ): void {
    const parsed = this.tryParseNumber(selectedId) ?? this.tryParseNumber(fallbackName);
    if (parsed === null) {
      return;
    }
    const feedInputs = this.ensureFeedInputs();
    if (target === 'random') {
      feedInputs.randomInfluence = parsed;
      this.setSingleMenuSelection(this.catalogEntryFeedProfile?.sbRandomInfluence, selectedId);
      return;
    }
    feedInputs.locationInfluence = parsed;
    this.setSingleMenuSelection(this.catalogEntryFeedProfile?.sbLocationInfluence, selectedId);
  }

  private setSingleMenuSelection(menu: MenuControlDataList | undefined, selectedId: string | undefined): void {
    if (!menu?.menuItems?.length) {
      return;
    }
    menu.menuItems.forEach((item) => {
      item.selected = !!selectedId && item.id === selectedId;
    });
  }

  private tryParseNumber(value: string | undefined): number | null {
    if (!value) {
      return null;
    }
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
    const match = value.match(/\d+/);
    if (!match) {
      return null;
    }
    const extracted = Number(match[0]);
    return Number.isFinite(extracted) ? extracted : null;
  }
}
