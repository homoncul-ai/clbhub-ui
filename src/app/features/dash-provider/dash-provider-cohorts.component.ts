import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclUserProfileCrudWrapper } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { CohortCriteria } from '@app/restsvc/hccl.service';
import { SimpleTab } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { CohortListComponent } from '@app/components/_crud/cohort/cohort-list.component';
import { CohortCreateModalComponent } from '@app/components/_crud/cohort/cohort-create-modal.component';
import { CohortTabsetUiComponent } from '@app/components/_crud/cohort/cohort-tabset-ui.component';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Subject, takeUntil } from 'rxjs';

class InlinePanelRowClickBehavior extends OnRowClickBehavior {
  private callback: (entityId: string) => void;

  constructor(callback: (entityId: string) => void) {
    super();
    this.doNotNavigate = true;
    this.callback = callback;
  }

  override onRowClick(entityId: string, baseRoute: string, router: Router): void {
    this.callback(entityId);
  }
}

@Component({
  selector: 'app-dash-provider-cohorts',
  standalone: true,
  imports: [CommonModule, RouterModule, MdbAccordionModule, CohortListComponent, CohortTabsetUiComponent],
  styleUrl: './dash-provider-cohorts.component.scss',
  templateUrl: './dash-provider-cohorts.component.html',
})
export class DashProviderCohortsComponent
  extends AbstractEntityGroupComponent<HcclUserProfileCrudWrapper>
  implements OnInit, OnDestroy, OnChanges
{
  @Input() cohortId = '';
  @ViewChild('cohortPanel') cohortPanel!: ElementRef;
  @ViewChild(CohortListComponent) cohortList?: CohortListComponent;

  private modalService = inject(MdbModalService);
  private destroy$ = new Subject<void>();

  selectedCohortId = '';
  selectedCohortTitle = '';
  /** SchoolProvider, nonprofit admin, and other org staff on this dashboard. */
  canInvite = true;
  canManageMaterials = true;

  override loading = true;
  private openAccordionId = 'cohorts';

  constructor() {
    super();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cohortId']?.currentValue) {
      this.selectedCohortId = changes['cohortId'].currentValue;
      this.loadCohortTitle(changes['cohortId'].currentValue);
      this.scrollToPanel();
    }
  }

  private loadCohortTitle(cohortId: string): void {
    this.selectedCohortTitle = 'Loading...';
    this.hcclService.getCohortById(cohortId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cohort) => {
          this.selectedCohortTitle = cohort.name || 'Cohort Details';
        },
        error: () => {
          this.selectedCohortTitle = 'Cohort Details';
        },
      });
  }

  override ngOnInit(): void {
    this.hcclContextService.refreshContext().subscribe((context) => {
      this.defaultId = context.currentUserProfileId || '';
      this.id = this.defaultId;
      this.organizationId = context.currentUserProfile.organizationId || '';
      this.applyMaterialsAdminFlags(context.currentUserProfile?.profileTypeCode);
      super.ngOnInit();
      this.loading = false;

      if (this.cohortId) {
        this.selectedCohortId = this.cohortId;
        this.loadCohortTitle(this.cohortId);
        this.openAccordionId = 'cohorts';
        setTimeout(() => this.scrollToPanel(), 100);
      }
    });
  }

  /**
   * Materials create + invite: SchoolProvider and Nonprofit admin (and related org staff).
   * Does not remove SchoolProvider; nonprofit is included alongside it.
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

  protected override calculateTabIdFromUrl(tabId_in: string): string {
    return this.tabId;
  }

  protected override populateFromParams(params: any): void {
    super.populateFromParams(params);
    const routeCohortId = this.route.snapshot.params['cohortId'];
    if (routeCohortId) {
      this.cohortId = routeCohortId;
      this.selectedCohortId = routeCohortId;
    }
  }

  protected organizationId = '';
  protected getOrganizationId(): string {
    return this.organizationId;
  }

  protected defaultId = '';
  protected override getDefaultId(): string {
    return this.defaultId;
  }

  protected newCrudWrapperForCreate(): HcclUserProfileCrudWrapper {
    return HcclUserProfileCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<HcclUserProfileCrudWrapper> {
    return HcclUserProfileCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    const baseRoute = this.getBaseRoute();
    return [
      new SimpleTab('cohorts', 'Cohorts', '', () => { this.router.navigate([baseRoute]); }, () => true),
    ];
  }

  protected override getDefaultTabId(): string {
    return 'cohorts';
  }

  private onCohortSelected(cohortId: string): void {
    this.selectedCohortId = cohortId;
    this.cohortId = cohortId;
    this.loadCohortTitle(cohortId);
    setTimeout(() => this.scrollToPanel(), 50);
  }

  private scrollToPanel(): void {
    if (this.cohortPanel?.nativeElement) {
      this.cohortPanel.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  closeCohortPanel(): void {
    this.selectedCohortId = '';
    this.cohortId = '';
    this.selectedCohortTitle = '';
  }

  protected onCohortRowClickBehavior(): OnRowClickBehavior {
    return new InlinePanelRowClickBehavior((entityId: string) => {
      this.onCohortSelected(entityId);
    });
  }

  isAccordionCollapsed(accordionId: string): boolean {
    return this.openAccordionId !== accordionId;
  }

  openAccordion(accordionId: string): void {
    this.openAccordionId = accordionId;
  }

  getCohortCriteria(): CohortCriteria {
    return {
      organizationId: this.organizationId,
      pageNumber: 1,
      pageSize: 50,
      isPaging: true,
      optionalDataHint: 'all',
    };
  }

  openCreateModal(): void {
    const modalRef = this.modalService.open(CohortCreateModalComponent, {
      modalClass: 'modal-lg',
    });

    modalRef.onClose.subscribe((result: any) => {
      if (result?.created) {
        this.cohortList?.refresh();
        if (result.cohortId) {
          this.onCohortSelected(result.cohortId);
        }
      }
    });
  }
}
