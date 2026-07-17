import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { CatalogEntryListComponent } from "@app/components/_crud/catalogentry/catalogentry-list.component";
import { CatalogSearchListComponent } from '@app/components/_crud/catalogentry/catalog-search-list.component';
import { CatalogEntryUiComponent } from '@app/components/_crud/catalogentry-ui/catalogentry-ui.component';
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { CatalogEntryCriteria } from '@app/restsvc/hccl.service';

interface ResearchSection {
  key: string;
  title: string;
  icon: string;
  gradient: string;
}

export const DEFAULT_STUDENT_RESEARCH_SECTIONS: ResearchSection[] = [
  { key: 'state-of-ma', title: 'State of MA', icon: 'fas fa-landmark', gradient: 'bg-gradient-warning' },
  { key: 'careers', title: 'Careers', icon: 'fas fa-briefcase', gradient: 'bg-gradient-success' },
  { key: 'ecosystem', title: 'Ecosystem', icon: 'fas fa-globe', gradient: 'bg-gradient-info' },
  { key: 'catalog-search', title: 'Catalog Search', icon: 'fas fa-search', gradient: 'bg-gradient-teal' },
  { key: 'new-listings', title: 'New Listings', icon: 'fas fa-clipboard-list', gradient: 'bg-gradient-primary' },
];

/** Sections used on the My Pursuits page (jobs / courses / careers). */
export const PURSUIT_RESEARCH_SECTIONS: ResearchSection[] = [
  { key: 'jobs', title: 'Jobs', icon: 'fas fa-briefcase', gradient: 'bg-gradient-primary' },
  { key: 'courses', title: 'Courses', icon: 'fas fa-graduation-cap', gradient: 'bg-gradient-success' },
  { key: 'careers', title: 'Careers', icon: 'fas fa-user-tie', gradient: 'bg-gradient-info' },
];

/** Optional override for catalog entry list criteria per research section. */
export type CatalogEntryCriteriaResolver = (sectionKey: string) => CatalogEntryCriteria;
export type { ResearchSection };

@Component({
  selector: 'app-student-research',
  standalone: true,
  imports: [CommonModule, MdbAccordionModule, CatalogEntryListComponent, CatalogSearchListComponent, CatalogEntryUiComponent],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">

          <!-- What's New Accordion (acts as a tabset) -->
          <mdb-accordion class="whats-new-accordion mb-4">
            <mdb-accordion-item [collapsed]="whatsNewCollapsed" (itemShow)="whatsNewCollapsed = false" (itemHide)="whatsNewCollapsed = true">
              <ng-template mdbAccordionItemHeader>
                <i class="fas fa-sparkles me-2"></i>
                <span class="fw-bold">{{ accordionTitle }}</span>
              </ng-template>
              <ng-template mdbAccordionItemBody>
                <div class="whats-new-grid">
                  <div
                    class="whats-new-card"
                    *ngFor="let section of sections"
                    [class.whats-new-card--active]="activeSection === section.key"
                    (click)="showSection(section.key)">
                    <div class="whats-new-icon-wrap" [ngClass]="section.gradient">
                      <i [class]="section.icon"></i>
                    </div>
                    <span class="whats-new-label">{{ section.title }}</span>
                  </div>
                </div>
              </ng-template>
            </mdb-accordion-item>
          </mdb-accordion>

          <!-- Section Accordion (only the active one is shown) -->
          <mdb-accordion class="whats-new-accordion mb-4" *ngIf="activeSectionObj as section">
            <mdb-accordion-item [collapsed]="false">
              <ng-template mdbAccordionItemHeader>
                <i [class]="section.icon + ' me-2'"></i>
                <span class="fw-bold">{{ section.title }}</span>
              </ng-template>
              <ng-template mdbAccordionItemBody>
                <app-catalog-search-list
                  *ngIf="section.key === 'catalog-search'; else standardCatalogEntryList"
                  [criteria]="getCatalogEntryListCriteria(section.key)"
                  [showingSearchHeading]="false"
                  [showingGoButton]="false"
                  [showingAddButton]="false"
                  [showingIdCheckbox]="false"
                  [onRowClickBehavior]="getCatalogEntryRowClickBehavior()">
                </app-catalog-search-list>
                <ng-template #standardCatalogEntryList>
                  <app-catalogentry-list
                    [criteria]="getCatalogEntryListCriteria(section.key)"
                    [showingSearchHeading]="false"
                    [showingGoButton]="false"
                    [showingAddButton]="false"
                    [showingIdCheckbox]="false"
                    [onRowClickBehavior]="getCatalogEntryRowClickBehavior()">
                  </app-catalogentry-list>
                </ng-template>

                <div #selectedEntry class="mt-3" *ngIf="selectedCatalogEntryId">
                  <app-catalogentry-ui [catalogEntryId]="selectedCatalogEntryId"></app-catalogentry-ui>
                </div>
              </ng-template>
            </mdb-accordion-item>
          </mdb-accordion>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .whats-new-accordion {
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    }

    .whats-new-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 1rem;
      padding: 0.75rem 0;
    }

    @media (max-width: 768px) {
      .whats-new-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .whats-new-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 0.875rem 0.5rem;
      border-radius: 12px;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
      background: #fff;
      border: 1px solid #e9ecef;
    }

    .whats-new-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
    }

    .whats-new-card--active {
      border-color: #3a8877;
      box-shadow: 0 4px 14px rgba(58, 136, 119, 0.25);
    }

    .whats-new-icon-wrap {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      color: #fff;
      transition: transform 0.2s ease;
    }

    .whats-new-card:hover .whats-new-icon-wrap {
      transform: scale(1.1);
    }

    .bg-gradient-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .bg-gradient-success {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    }
    .bg-gradient-info {
      background: linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%);
    }
    .bg-gradient-warning {
      background: linear-gradient(135deg, #f2994a 0%, #f2c94c 100%);
    }
    .bg-gradient-teal {
      background: linear-gradient(135deg, #3a8877 0%, #8db392 100%);
    }

    .whats-new-label {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #495057;
      text-align: center;
    }
  `],
})
export class StudentResearchComponent {
  /** Research section cards; defaults to the standard five sections when not provided. */
  @Input() sections: ResearchSection[] = DEFAULT_STUDENT_RESEARCH_SECTIONS;

  /** When set, replaces default section-based catalog entry criteria. */
  @Input() criteriaResolver?: CatalogEntryCriteriaResolver;

  /** When set, passed through on catalog entry query criteria. */
  @Input() vocationEncodingId: string | null = null;

  /** Label for the section-picker accordion header. */
  @Input() accordionTitle = "What's New";

  whatsNewCollapsed = false;
  activeSection: string | null = null;

  selectedCatalogEntryId = '';

  @ViewChild('selectedEntry') selectedEntryRef?: ElementRef<HTMLElement>;

  get activeSectionObj(): ResearchSection | undefined {
    return this.sections.find((s) => s.key === this.activeSection);
  }

  showSection(key: string): void {
    this.activeSection = this.activeSection === key ? null : key;
    // Reset any selected catalog entry when switching sections.
    this.selectedCatalogEntryId = '';
  }

  /** Open a section without toggling it closed (for parent-driven focus). */
  activateSection(key: string): void {
    this.activeSection = key;
    this.selectedCatalogEntryId = '';
  }

  getCatalogEntryListCriteria(sectionKey: string): CatalogEntryCriteria {
    const criteria = this.criteriaResolver
      ? this.criteriaResolver(sectionKey)
      : this.getCatalogEntryListCriteriaBySectionKey(sectionKey);
    return this.applyVocationEncodingId(criteria);
  }

  private applyVocationEncodingId(criteria: CatalogEntryCriteria): CatalogEntryCriteria {
    if (this.vocationEncodingId) {
      return { ...criteria, vocationEncodingId: this.vocationEncodingId };
    }
    return criteria;
  }

  getCatalogEntryListCriteriaBySectionKey(sectionKey: string): CatalogEntryCriteria {
    const base: CatalogEntryCriteria = {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true,
      orderByHint: 'dateLastUpdated desc',
    };

    switch (sectionKey) {
      case 'state-of-ma':
        // criteria.catalogTypeCodes = ['state-of-ma', 'online-course';
        // criteria.online = 1;
        return { ...base };
      case 'careers':
        // criteria.catalogTypeCodes = ['career', 'career-ladder']';
        return { ...base };
      case 'ecosystem':
        // criteria.catalogTypeCodes = ['ecosystem', 'main', 'non-profit', 'business', 'school';
        return { ...base };
      case 'catalog-search':
        return { ...base };
      case 'new-listings':
        return { ...base, orderByHint: 'dateLastUpdated desc' };
      default:
        return base;
    }
  }

  getCatalogEntryRowClickBehavior(): OnRowClickBehavior {
    const x = new OnRowClickBehavior();
    x.usingNavigateUrl = false;
    x.doNotNavigate = true;
    x.onRowClick = (id: string) => {
      this.selectedCatalogEntryId = id;
      // Wait for the entry to render, then scroll it into view.
      setTimeout(() => {
        this.selectedEntryRef?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    };
    return x;
  }
}
