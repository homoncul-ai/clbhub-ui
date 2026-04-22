import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { HcclOrganizationInterestListComponent } from '@app/components/_crud/hcclorganizationinterest/hcclorganizationinterest-list.component';
import {
  HcclOrganizationInterestCriteria,
  SimpleMapEntry,
  SimpleMapEntryResponse,
  HcclService,
} from '@app/restsvc/hccl.service';
import { MapAddrUiComponent } from '@app/components/_crud/map-addr-ui/map-addr-ui.component';
import { OnDeleteClickBehavior, OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { HcclOrganizationUiComponent } from '@app/components/_crud/hcclorganization-ui/hcclorganization-ui.component';

@Component({
  selector: 'app-dash-student-my-organizations',
  standalone: true,
  imports: [CommonModule, MdbAccordionModule, HcclOrganizationInterestListComponent, MapAddrUiComponent, HcclOrganizationUiComponent],
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
                  [showingIdCheckbox]="false"
                  [onRowClickBehavior]="getOrganizationRowClickBehavior()"
                  [onDeleteClickBehavior]="getMyOrganizationInterestDeleteBehavior()">
                </app-hcclorganizationinterest-list>

                <div *ngIf="selectedOrganizationId" class="mt-3">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <h5 class="mb-0">{{ selectedOrganizationName }}</h5>
                    <button type="button" class="btn btn-sm btn-outline-secondary" (click)="clearSelectedOrganization()">
                      <i class="fas fa-times me-1"></i>Close
                    </button>
                  </div>
                  <app-hcclorganization-ui [id]="selectedOrganizationId"></app-hcclorganization-ui>
                </div>
              </ng-template>
            </mdb-accordion-item>

            <mdb-accordion-item
              [collapsed]="isAccordionCollapsed('map')"
              (itemShow)="openAccordion('map')">
              <ng-template mdbAccordionItemHeader>
                <i class="fas fa-map-location-dot me-2"></i>
                2. Organization Map
              </ng-template>
              <ng-template mdbAccordionItemBody>
                <app-map-addr-ui
                  title="My Organizations Map"
                  [mapEntryResponse]="organizationMapEntryResponse || undefined"
                  (pinClick)="onOrganizationMapPinClick($event)">
                </app-map-addr-ui>
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
  private hcclService = inject(HcclService);

  accordionId = 'organizations';
  loading = true;
  error = '';
  private userProfileId = '';
  protected organizationMapEntryResponse: SimpleMapEntryResponse | null = null;
  selectedOrganizationId: string = '';
  selectedOrganizationName: string = '';

  ngOnInit(): void {
    this.hcclContextService.waitForReady$().subscribe({
      next: (context) => {
        this.userProfileId = context?.currentUserProfileId || '';
        if (!this.userProfileId) {
          this.error = 'User profile context was not found.';
          this.organizationMapEntryResponse = { searchResults: [] };
        } else {
          this.updateMapEntries();
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to resolve user context.';
        this.organizationMapEntryResponse = { searchResults: [] };
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

  getMyOrganizationInterestDeleteBehavior(): OnDeleteClickBehavior {
    var x: OnDeleteClickBehavior = new OnDeleteClickBehavior();
    x.clicked = (entityId: string) => {
      // call the hcclService to delete the organization interest
      this.hcclService.deleteHcclOrganizationInterestById(entityId).subscribe({
        next: () => {
          this.updateMapEntries();
          alert('Organization interest deleted successfully');
        },
        error: () => {
          alert('Error deleting organization interest');
        },
      });
      //alert('My organization interest delete behavior clicked with entityId:' + entityId);
    };
    return x;
  }

  private updateMapEntries(): void {
    this.hcclService.lookupRelatedMapEntry('HcclUserProfile', this.userProfileId, 'HcclOrganizationInterest').subscribe({
      next: (searchResults: SimpleMapEntryResponse) => {
        this.organizationMapEntryResponse = searchResults;
      },
      error: () => {
        this.organizationMapEntryResponse = { searchResults: [] };
      },
    });
  }

  getOrganizationRowClickBehavior(): OnRowClickBehavior {
    const behavior = OnRowClickBehavior.getOnRowClickDoNothing();
    behavior.onRowClick = (interestId: string) => {
      this.hcclService.getHcclOrganizationInterestById(interestId).subscribe({
        next: (interest) => {
          if (interest.organizationId) {
            this.selectOrganization(interest.organizationId, interest.organization?.name);
          }
        },
        error: (err) => console.error('Error loading organization interest:', err),
      });
    };
    return behavior;
  }

  private selectOrganization(organizationId: string, orgName?: string): void {
    this.selectedOrganizationId = organizationId;
    this.selectedOrganizationName = orgName || 'Organization Details';
  }

  clearSelectedOrganization(): void {
    this.selectedOrganizationId = '';
    this.selectedOrganizationName = '';
  }

  onOrganizationMapPinClick(entry: SimpleMapEntry): void {
    if (entry.entityId) {
      this.selectOrganization(entry.entityId, entry.title);
      this.openAccordion('organizations');
    }
  }
}
