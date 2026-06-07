import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { CatalogEntryInterestListComponent } from '@app/components/_crud/catalogentryinterest/catalogentryinterest-list.component';
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { CatalogEntryInterestCriteria, HcclService } from '@app/restsvc/hccl.service';
import { StudentEngageInterestComponent } from './student-engage-interest/student-engage-interest.component';

interface ParticipationEntry {
  id: string;
  title: string;
  collapsed: boolean;
}

@Component({
  selector: 'app-dash-student-my-participation',
  standalone: true,
  imports: [CommonModule, MdbAccordionModule, CatalogEntryInterestListComponent, StudentEngageInterestComponent],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">

          <h1 class="mb-4">My Participation</h1>

          <mdb-accordion class="participation-accordion" [multiple]="true">
            <!-- Interests and Engagement -->
            <mdb-accordion-item [collapsed]="false">
              <ng-template mdbAccordionItemHeader>
                <i class="fas fa-heart me-2"></i>
                <span class="fw-bold">Interests and Engagement</span>
              </ng-template>
              <ng-template mdbAccordionItemBody>
                <app-catalogentryinterest-list
                  *ngIf="userProfileId"
                  [criteria]="getInterestCriteria()"
                  [showingSearch]="false"
                  [showingSearchHeading]="false"
                  [showingGoButton]="false"
                  [showingAddButton]="false"
                  [showingIdCheckbox]="false"
                  [showingDiagnostics]="false"
                  [autoHeight]="true"
                  [maxRows]="20"
                  [onRowClickBehavior]="onInterestRowClickBehavior()">
                </app-catalogentryinterest-list>
              </ng-template>
            </mdb-accordion-item>

            <!-- Dynamically opened CatalogEntry accordions -->
            <mdb-accordion-item *ngFor="let entry of selectedEntries" [collapsed]="entry.collapsed" [attr.id]="'participation-entry-' + entry.id">
              <ng-template mdbAccordionItemHeader>
                <i class="fas fa-book me-2"></i>
                <span class="fw-bold">{{ entry.title }}</span>
              </ng-template>
              <ng-template mdbAccordionItemBody>
                <app-student-engage-interest
                  [interestId]="entry.id"
                  (componentRequiresRefresh)="onChildComponentRefresh()">
                </app-student-engage-interest>
              </ng-template>
            </mdb-accordion-item>
          </mdb-accordion>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .participation-accordion {
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    }
  `],
})
export class DashStudentMyParticipationComponent implements OnInit {
  private hcclContextService = inject(HcclContextService);
  private hcclService = inject(HcclService);

  userProfileId = '';
  selectedEntries: ParticipationEntry[] = [];

  ngOnInit(): void {
    this.hcclContextService.waitForReady$().subscribe({
      next: (context) => {
        this.userProfileId = context?.currentUserProfileId || '';
      },
    });
  }

  getInterestCriteria(): CatalogEntryInterestCriteria {
    return {
      userProfileId: this.userProfileId,
      interestRangeMin: 1,
      interestRangeMax: 11,
      pageNumber: 1,
      pageSize: 50,
      isPaging: true,
    };
  }

  onInterestRowClickBehavior(): OnRowClickBehavior {
    const x = new OnRowClickBehavior();
    x.usingNavigateUrl = false;
    x.onRowClick = (id: string) => {
      this.openCatalogEntryAccordion(id);
    };
    return x;
  }

  private openCatalogEntryAccordion(interestId: string): void {
    if (!interestId) {
      return;
    }

    // Already opened: just expand it again.
    const existing = this.selectedEntries.find((e) => e.id === interestId);
    if (existing) {
      existing.collapsed = false;
      this.scrollToEntry(interestId);
      return;
    }

    this.hcclService.getCatalogEntryInterestById(interestId, 'all').subscribe({
      next: (interest) => {
        const title = interest?.catalogEntry?.title || 'Catalog Entry';
        this.selectedEntries.push({ id: interestId, title, collapsed: false });
        this.scrollToEntry(interestId);
      },
      error: (err) => {
        console.error('Failed to load catalog entry interest:', err);
        this.selectedEntries.push({ id: interestId, title: 'Catalog Entry', collapsed: false });
        this.scrollToEntry(interestId);
      },
    });
  }

  private scrollToEntry(interestId: string): void {
    // Wait for the accordion item to render/expand, then bring it into view.
    setTimeout(() => {
      const el = document.getElementById('participation-entry-' + interestId);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  }

  onChildComponentRefresh(): void {
    console.log('onChildComponentRefresh called');
  }
}
