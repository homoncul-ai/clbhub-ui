import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import {
  PMergeTmplCriteria,
  PMergeTmplGETData,
  PMergeTmplGETDataSearchResults,
  PMergeTmplVersionGETData,
} from '@app/restsvc/hccl.service';

export const ADMIN_DOC_MGMT_TEMPLATES_BASE =
  '/ecoadmin-dashboard/document-management/templates';

const TEMPLATE_TYPE_LABELS: Record<string, string> = {
  securityEmail: 'Security email',
  contracts: 'Contracts',
  experienceReport: 'Experience report',
  userMonthlyStatus: 'User monthly status',
  email: 'Email',
};

interface TemplateListRow extends PMergeTmplGETData {
  __mergeSchemeCode?: string;
  __versionNumber?: number | string;
  __versionStatus?: string;
  __lastEditedBy?: string;
  __dateLastEdited?: string;
}

/**
 * Ecoadmin list of merge templates (PMergeTmpl), with current-version
 * columns joined from PMergeTmplVersion.
 */
@Component({
  selector: 'app-pmergetmpl-list',
  standalone: true,
  templateUrl: '../../../components/_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../../components/_global/abstract-list/abstract-list.component.scss'],
  imports: [CommonModule],
})
export class PMergeTmplListComponent extends AbstractListComponent<
  TemplateListRow,
  PMergeTmplCriteria,
  PMergeTmplGETDataSearchResults
> {
  constructor() {
    super();
    this.searchHeading = 'Templates';
    this.searchHeadingLabel = 'Templates';
    this.showingAddButton = true;
    this.showingGoButton = false;
    this.showingIdCheckbox = false;
  }

  /** AbstractList only keeps one path segment after the dashboard. */
  protected override getBaseRoute(): string {
    return ADMIN_DOC_MGMT_TEMPLATES_BASE;
  }

  protected getGridColumns(): any[] {
    return [
      { id: 'code', header: [{ text: 'Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 140, adjust: true },
      { id: 'name', header: [{ text: 'Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'type', header: [{ text: 'Type', align: 'center' }, { content: 'inputFilter' }], minWidth: 140, adjust: true },
      { id: 'mergeSchemeCode', header: [{ text: 'Merge Scheme', align: 'center' }, { content: 'inputFilter' }], minWidth: 160, adjust: true },
      { id: 'versionNumber', header: [{ text: 'Version', align: 'center' }], minWidth: 90, align: 'center', adjust: true },
      { id: 'versionStatus', header: [{ text: 'Status', align: 'center' }, { content: 'inputFilter' }], minWidth: 130, align: 'center', adjust: true },
      { id: 'lastEditedBy', header: [{ text: 'Last Edited By', align: 'center' }], minWidth: 150, adjust: true },
      { id: 'dateLastEdited', header: [{ text: 'Date Last Edited', align: 'center' }], minWidth: 150, adjust: true },
    ];
  }

  protected createCriteria(): PMergeTmplCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true,
    };
  }

  protected findEntities(
    criteria: PMergeTmplCriteria,
  ): Observable<PMergeTmplGETDataSearchResults> {
    return this.hcclService.findPMergeTmpls(criteria).pipe(
      switchMap((tmplRsp) => {
        const tmpls = tmplRsp.searchResults ?? [];
        const versionIds = this.collectCurrentVersionIds(tmpls);
        if (versionIds.length === 0) {
          return of(tmplRsp);
        }
        return this.hcclService
          .findPMergeTmplVersions({
            ids: versionIds,
            isPaging: false,
            pageSize: versionIds.length,
          })
          .pipe(
            map((verRsp) => {
              const byId = new Map<string, PMergeTmplVersionGETData>();
              (verRsp.searchResults ?? []).forEach((v) => {
                if (v.id) {
                  byId.set(v.id, v);
                }
              });
              const enriched: TemplateListRow[] = tmpls.map((tmpl) =>
                this.attachVersion(tmpl, byId),
              );
              return {
                ...tmplRsp,
                searchResults: enriched,
              };
            }),
          );
      }),
    );
  }

  protected hasSearchResults(response: PMergeTmplGETDataSearchResults): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(response: PMergeTmplGETDataSearchResults): TemplateListRow[] {
    return (response.searchResults as TemplateListRow[]) || [];
  }

  protected override formatEntityData(entity: TemplateListRow): any {
    return {
      code: entity.businessCode || '',
      type: this.templateTypeLabel(entity.templateTypeCode),
      mergeSchemeCode: entity.__mergeSchemeCode || '',
      versionNumber: entity.__versionNumber ?? '',
      versionStatus: entity.__versionStatus || '',
      lastEditedBy: entity.__lastEditedBy || entity.lastUpdatedByInfo?.name || '',
      dateLastEdited:
        entity.__dateLastEdited || entity.dateLastUpdated?.formattedDate || '',
    };
  }

  protected override onRowClick(entityId: string): void {
    this.router.navigate([ADMIN_DOC_MGMT_TEMPLATES_BASE, entityId]);
  }

  private templateTypeLabel(code?: string): string {
    if (!code) {
      return '';
    }
    return TEMPLATE_TYPE_LABELS[code] || code;
  }

  private collectCurrentVersionIds(tmpls: PMergeTmplGETData[]): string[] {
    const ids = new Set<string>();
    tmpls.forEach((tmpl) => {
      const versionId = tmpl.inProcessVersionId || tmpl.activeVersionId;
      if (versionId) {
        ids.add(versionId);
      }
    });
    return Array.from(ids);
  }

  private attachVersion(
    tmpl: PMergeTmplGETData,
    byId: Map<string, PMergeTmplVersionGETData>,
  ): TemplateListRow {
    const versionId = tmpl.inProcessVersionId || tmpl.activeVersionId;
    const version = versionId ? byId.get(versionId) : undefined;
    const lastEditedSource = version ?? tmpl;
    return {
      ...tmpl,
      __mergeSchemeCode: version?.mergeSchemeCodes || '',
      __versionNumber: version?.version ?? '',
      __versionStatus: this.versionStatusLabel(tmpl),
      __lastEditedBy: lastEditedSource.lastUpdatedByInfo?.name || '',
      __dateLastEdited: lastEditedSource.dateLastUpdated?.formattedDate || '',
    };
  }

  private versionStatusLabel(tmpl: PMergeTmplGETData): string {
    const hasActive = !!tmpl.activeVersionId;
    const hasDraft = !!tmpl.inProcessVersionId;
    if (hasActive && hasDraft) {
      return 'Active + draft';
    }
    if (hasActive) {
      return 'Active';
    }
    if (hasDraft) {
      return 'Draft';
    }
    return '';
  }
}
