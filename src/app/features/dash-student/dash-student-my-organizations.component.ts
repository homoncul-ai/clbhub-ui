import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { HcclOrganizationInterestListComponent } from '@app/components/_crud/hcclorganizationinterest/hcclorganizationinterest-list.component';
import { HcclOrganizationInterestCriteria } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-dash-student-my-organizations',
  standalone: true,
  imports: [CommonModule, MdbAccordionModule, HcclOrganizationInterestListComponent],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <h1>My Organizations</h1>

          <div *ngIf="loading" class="text-center py-4">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading your organization interests...</p>
          </div>

          <div *ngIf="error && !loading" class="alert alert-danger" role="alert">
            <i class="fas fa-exclamation-triangle me-2"></i>
            {{ error }}
          </div>

          <mdb-accordion *ngIf="!loading && !error" [multiple]="false">
            <mdb-accordion-item
              [collapsed]="isAccordionCollapsed('organizations')"
              (itemShow)="openAccordion('organizations')">
              <ng-template mdbAccordionItemHeader>
                <i class="fas fa-building me-2"></i>
                1. Organization Interests
              </ng-template>
              <ng-template mdbAccordionItemBody>
                <app-hcclorganizationinterest-list
                  [criteria]="getMyOrganizationsCriteria()"
                  [showingSearchHeading]="false"
                  [showingGoButton]="false"
                  [showingAddButton]="false"
                  [showingIdCheckbox]="false">
                </app-hcclorganizationinterest-list>
              </ng-template>
            </mdb-accordion-item>
          </mdb-accordion>
        </div>
      </div>
    </div>
  `,
})
export class DashStudentMyOrganizationsComponent implements OnInit {
  private hcclContextService = inject(HcclContextService);

  accordionId = 'organizations';
  loading = true;
  error = '';
  private userProfileId = '';

  ngOnInit(): void {
    this.hcclContextService.waitForReady$().subscribe({
      next: (context) => {
        this.userProfileId = context?.currentUserProfileId || '';
        if (!this.userProfileId) {
          this.error = 'User profile context was not found.';
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to resolve user context.';
        this.loading = false;
      },
    });
  }

  openAccordion(id: string): void {
    this.accordionId = id;
  }

  isAccordionCollapsed(id: string): boolean {
    return this.accordionId !== id;
  }

  getMyOrganizationsCriteria(): HcclOrganizationInterestCriteria {
    return {
      userProfileId: this.userProfileId,
      pageNumber: 1,
      pageSize: 50,
      isPaging: true,
    };
  }
}
