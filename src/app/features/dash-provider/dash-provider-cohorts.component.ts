import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclUserProfileCrudWrapper } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { CohortCriteria } from '@app/restsvc/hccl.service';
import { SimpleTab } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { CohortListComponent } from '@app/components/_crud/cohort/cohort-list.component';
import { CohortCreateModalComponent } from '@app/components/_crud/cohort/cohort-create-modal.component';
import { MenuService } from '@app/shell/services/menu.service';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';

class CohortPageRowClickBehavior extends OnRowClickBehavior {
  override onRowClick(entityId: string, baseRoute: string, router: Router): void {
    router.navigate([baseRoute, entityId]);
  }
}

@Component({
  selector: 'app-dash-provider-cohorts',
  standalone: true,
  imports: [CommonModule, RouterModule, CohortListComponent],
  styleUrl: './dash-provider-cohorts.component.scss',
  templateUrl: './dash-provider-cohorts.component.html',
})
export class DashProviderCohortsComponent
  extends AbstractEntityGroupComponent<HcclUserProfileCrudWrapper>
  implements OnInit
{
  @ViewChild(CohortListComponent) cohortList?: CohortListComponent;

  private modalService = inject(MdbModalService);
  private menuService = inject(MenuService);

  readonly cohortRowClickBehavior = new CohortPageRowClickBehavior();

  override loading = true;

  constructor() {
    super();
  }

  override ngOnInit(): void {
    this.hcclContextService.refreshContext().subscribe((context) => {
      this.defaultId = context.currentUserProfileId || '';
      this.id = this.defaultId;
      this.organizationId = context.currentUserProfile.organizationId || '';
      super.ngOnInit();
      this.loading = false;
    });
  }

  protected override calculateTabIdFromUrl(tabId_in: string): string {
    return this.tabId;
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
        this.menuService.requestMenuRefresh();
        if (result.cohortId) {
          this.router.navigate(['/provider-dashboard/cohorts', result.cohortId]);
        }
      }
    });
  }
}
