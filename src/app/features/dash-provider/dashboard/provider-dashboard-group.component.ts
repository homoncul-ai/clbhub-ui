import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclUserProfileCrudWrapper } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { HcclUserContextGETData, WorkQueueGETData, WorkRequestCriteria } from '@app/restsvc/hccl.service';
import { ProviderDashboardTabMydashComponent } from './provider-dashboard-tab-mydash.component';
import { ProviderDashboardTabSetupComponent } from './provider-dashboard-tab-setup.component';
import { ProviderDashboardTabProfileComponent } from './provider-dashboard-tab-profile.component';
import { CohortLeaderUiExampleComponent } from '../cohorts/cohort-leader-ui-example.component';

@Component({
  selector: 'app-provider-dashboard-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, ProviderDashboardTabMydashComponent, ProviderDashboardTabProfileComponent, ProviderDashboardTabSetupComponent, CohortLeaderUiExampleComponent],
  templateUrl: './provider-dashboard-group.component.html',
  styleUrl: './provider-dashboard-group.component.scss'
})
export class ProviderDashboardGroupComponent extends AbstractEntityGroupComponent<HcclUserProfileCrudWrapper> implements OnInit {

  override ngOnInit(): void {
    // For singleton behavior, always use current user profile ID
    this.hcclContextService.refreshContext().subscribe(context => {
      this.defaultId = context.currentUserProfileId || '';
      this.id = this.defaultId;
      this.organizationId = context.currentUserProfile.organizationId || '';
      // Call parent ngOnInit after setting the ID
      super.ngOnInit();
    });
  }

  protected defaultId: string = '';
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
      new SimpleTab('mydash', 'Dashboard', '', 
        () => {
          this.router.navigate([baseRoute]);
        },
        () => {
          return true;
        }
      ),
      new SimpleTab('profile', 'Profile', '', 
        () => {
          this.router.navigate([baseRoute, 'profile']);
        },
        () => {
          return true;
        }
      ),
      new SimpleTab('setup', 'Setup', '', 
        () => {
          this.router.navigate([baseRoute, 'setup']);
        },
        () => {
          return true;
        }
      ),
      new SimpleTab('cohort', 'Cohort', '', 
        () => {
          this.router.navigate([baseRoute, 'cohort']);
        },
        () => {
          return true;
        }
      )
    ];
  }

  protected organizationId : string = '';
  protected getOrganizationId(): string {
    return this.organizationId;  
  }

  protected override getDefaultTabId(): string {
    return 'mydash';
  }
}
