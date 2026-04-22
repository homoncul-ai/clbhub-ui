import { Component, Input, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { HcclService, HcclOrganizationGETData } from '@app/restsvc/hccl.service';
import { HcclOrganizationCrudComponent } from '@app/components/_crud/hcclorganization/hcclorganization-crud.component';
import { HcclOrganizationContactListComponent } from './hcclorganization-contact-list.component';

@Component({
  selector: 'app-hcclorganization-ui',
  standalone: true,
  imports: [CommonModule, MdbAccordionModule, HcclOrganizationCrudComponent, HcclOrganizationContactListComponent],
  template: `
    <div *ngIf="loading" class="text-center py-4">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading organization...</p>
    </div>

    <div *ngIf="error && !loading" class="alert alert-danger" role="alert">
      <i class="fas fa-exclamation-triangle me-2"></i>
      {{ error }}
    </div>

    <mdb-accordion *ngIf="!loading && !error && organization" [multiple]="false">
      <mdb-accordion-item
        [collapsed]="isAccordionCollapsed('details')"
        (itemShow)="openAccordion('details')">
        <ng-template mdbAccordionItemHeader>
          <i class="fas fa-building me-2"></i>
          {{ organization.name || 'Organization' }} Details
        </ng-template>
        <ng-template mdbAccordionItemBody>
          <app-hcclorganization-crud
            [id]="id"
            [modeName]="'section'">
          </app-hcclorganization-crud>
        </ng-template>
      </mdb-accordion-item>

      <mdb-accordion-item
        [collapsed]="isAccordionCollapsed('contacts')"
        (itemShow)="openAccordion('contacts')">
        <ng-template mdbAccordionItemHeader>
          <i class="fas fa-address-book me-2"></i>
          Contacts
        </ng-template>
        <ng-template mdbAccordionItemBody>
          <app-hcclorganization-contact-list
            [criteria]="getContactsCriteria()"
            [showingSearchHeading]="false"
            [showingGoButton]="false"
            [showingAddButton]="false"
            [showingIdCheckbox]="false">
          </app-hcclorganization-contact-list>
        </ng-template>
      </mdb-accordion-item>
    </mdb-accordion>
  `,
})
export class HcclOrganizationUiComponent implements OnInit, OnChanges {
  private hcclService = inject(HcclService);

  @Input() id: string = '';

  organization: HcclOrganizationGETData | null = null;
  loading = false;
  error = '';
  accordionId = 'details';

  ngOnInit(): void {
    this.loadOrganization();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] && !changes['id'].firstChange) {
      this.loadOrganization();
    }
  }

  private loadOrganization(): void {
    if (!this.id) {
      this.error = 'No organization ID provided.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.hcclService.getHcclOrganizationById(this.id).subscribe({
      next: (org) => {
        this.organization = org;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load organization.';
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

  getContactsCriteria() {
    return {
      organizationId: this.id,
      pageNumber: 1,
      pageSize: 50,
      isPaging: true,
    };
  }
}
