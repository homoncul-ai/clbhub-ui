import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { CohortTabsetUiComponent } from './cohort-tabset-ui.component';

@Component({
  selector: 'app-cohort-detail-page',
  standalone: true,
  imports: [CommonModule, RouterModule, CohortTabsetUiComponent],
  template: `
    <div class="cohort-detail-page">
      <a *ngIf="listRoute" [routerLink]="listRoute" class="small text-decoration-none mb-3 d-inline-block">
        &larr; All cohorts
      </a>
      <app-cohort-tabset-ui
        *ngIf="cohortId"
        [id]="cohortId"
        [canInvite]="canInvite"
        [canManageMaterials]="canManageMaterials">
      </app-cohort-tabset-ui>
    </div>
  `,
})
export class CohortDetailPageComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private hcclContextService = inject(HcclContextService);
  private destroy$ = new Subject<void>();

  cohortId = '';
  listRoute = '';
  canInvite = false;
  canManageMaterials = false;

  ngOnInit(): void {
    const data = this.route.snapshot.data || {};
    this.listRoute = data['cohortListRoute'] || '';
    const allowManage = data['canInvite'] === true || data['canManageMaterials'] === true;

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.cohortId = params.get('cohortId') || '';
    });

    if (!allowManage) {
      this.canInvite = false;
      this.canManageMaterials = false;
      return;
    }

    this.hcclContextService.refreshContext().subscribe((context) => {
      this.applyMaterialsAdminFlags(context.currentUserProfile?.profileTypeCode);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Materials create + invite: SchoolProvider and Nonprofit admin (and related org staff).
   */
  private applyMaterialsAdminFlags(profileTypeCode: string | undefined): void {
    const code = (profileTypeCode || '').toUpperCase();
    const canManage = [
      'NONPROFIT',
      'EDU_NONPROFIT',
      'PROVIDER',
      'SCHOOLPROVIDER',
      'SERVICE_PROVIDER',
      'EDU_SERVICE_PROVIDER',
      'EMPLOYEE',
      'EDU_EMPLOYEE',
      'EMPLOYER',
      'EDU_EMPLOYER',
    ].includes(code);
    this.canInvite = canManage;
    this.canManageMaterials = canManage;
  }
}
