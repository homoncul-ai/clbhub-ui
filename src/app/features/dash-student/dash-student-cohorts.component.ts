import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import {
  CohortUIData,
  HcclService,
  StudentCohortSummaryGETData,
  StudentCohortsUIGETData,
} from '@app/restsvc/hccl.service';
import { PMessageUiComponent } from '@app/components/_crud/pmessage-ui/pmessage-ui.component';

@Component({
  selector: 'app-dash-student-cohorts',
  standalone: true,
  imports: [CommonModule, MdbAccordionModule, PMessageUiComponent],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">

          <div *ngIf="loading" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading your cohorts...</p>
          </div>

          <div *ngIf="error && !loading" class="alert alert-danger" role="alert">
            <i class="fas fa-exclamation-triangle me-2"></i>
            {{ error }}
          </div>

          <mdb-accordion *ngIf="!loading && !error" [multiple]="false">
            <mdb-accordion-item
              [collapsed]="isAccordionCollapsed('cohorts')"
              (itemShow)="openAccordion('cohorts')">
              <ng-template mdbAccordionItemHeader>
                <i class="fas fa-users me-2"></i>
                Cohorts
              </ng-template>
              <ng-template mdbAccordionItemBody>
                <div *ngIf="cohorts.length === 0" class="text-muted py-3">
                  You are not a member of any cohorts yet.
                </div>
                <div *ngIf="cohorts.length > 0" class="table-responsive">
                  <table class="table table-hover align-middle mb-0">
                    <thead class="table-light">
                      <tr>
                        <th>Organization</th>
                        <th>Cohort Name</th>
                        <th>Leader</th>
                        <th>Date Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        *ngFor="let cohort of cohorts"
                        [class.table-active]="selectedCohortId === cohort.cohortId"
                        (click)="selectCohort(cohort)"
                        style="cursor: pointer;">
                        <td>{{ cohort.organizationName }}</td>
                        <td>{{ cohort.cohortName }}</td>
                        <td>{{ cohort.leaderName }}</td>
                        <td>{{ cohort.dateCreated?.formattedDate || cohort.dateCreated?.formattedDateTime }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </ng-template>
            </mdb-accordion-item>

            <mdb-accordion-item
              *ngIf="selectedCohortId"
              [collapsed]="isAccordionCollapsed('cohortDetails')"
              (itemShow)="openAccordion('cohortDetails')">
              <ng-template mdbAccordionItemHeader>
                <i class="fas fa-circle-info me-2"></i>
                Cohort Details
              </ng-template>
              <ng-template mdbAccordionItemBody>
                <div *ngIf="detailLoading" class="text-center py-3">
                  <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                  <span class="ms-2">Loading cohort details...</span>
                </div>

                <div *ngIf="detailError && !detailLoading" class="alert alert-danger">
                  {{ detailError }}
                </div>

                <ng-container *ngIf="cohortDetail && !detailLoading">
                  <div class="card mb-3">
                    <div class="card-body">
                      <h5 class="card-title mb-1">{{ cohortDetail.cohort?.name }}</h5>
                      <p class="text-muted mb-2">{{ cohortDetail.cohort?.description }}</p>
                      <div><strong>Organization:</strong> {{ cohortDetail.cohort?.organization?.entityDisplayName }}</div>
                      <div><strong>Status:</strong> {{ cohortDetail.cohort?.currentStateCode }}</div>
                      <div *ngIf="cohortDetail.members?.length">
                        <strong>Members:</strong>
                        <span *ngFor="let member of cohortDetail.members; let last = last">
                          {{ member.entityDisplayName }}<span *ngIf="!last">, </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div *ngIf="selectedMessageId">
                    <h6 class="mb-2">Cohort Messages</h6>
                    <app-pmessage-ui [id]="selectedMessageId"></app-pmessage-ui>
                  </div>
                </ng-container>
              </ng-template>
            </mdb-accordion-item>
          </mdb-accordion>
        </div>
      </div>
    </div>
  `,
})
export class DashStudentCohortsComponent implements OnInit {
  private hcclContextService = inject(HcclContextService);
  private hcclService = inject(HcclService);

  accordionId = 'cohorts';
  loading = true;
  error = '';
  detailLoading = false;
  detailError = '';
  cohorts: StudentCohortSummaryGETData[] = [];
  selectedCohortId: string | null = null;
  selectedMessageId: string | null = null;
  cohortDetail: CohortUIData | null = null;

  ngOnInit(): void {
    this.hcclContextService.waitForReady$().subscribe({
      next: () => this.loadCohorts(),
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

  selectCohort(cohort: StudentCohortSummaryGETData): void {
    if (!cohort.cohortId) {
      return;
    }
    this.selectedCohortId = cohort.cohortId;
    this.selectedMessageId = cohort.messageId || null;
    this.openAccordion('cohortDetails');
    this.loadCohortDetail(cohort.cohortId);
  }

  private loadCohorts(): void {
    this.loading = true;
    this.error = '';
    this.hcclService.loadMyCohorts().subscribe({
      next: (data: StudentCohortsUIGETData) => {
        this.cohorts = data.cohorts || [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load cohorts.';
        this.loading = false;
      },
    });
  }

  private loadCohortDetail(cohortId: string): void {
    this.detailLoading = true;
    this.detailError = '';
    this.cohortDetail = null;
    this.hcclService.loadCohortUIData(cohortId).subscribe({
      next: (data: CohortUIData) => {
        this.cohortDetail = data;
        this.selectedMessageId = data.cohort?.messageId || this.selectedMessageId;
        this.detailLoading = false;
      },
      error: () => {
        this.detailError = 'Failed to load cohort details.';
        this.detailLoading = false;
      },
    });
  }
}
