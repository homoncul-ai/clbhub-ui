import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclUserProfileCrudWrapper } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { HcclUserContextGETData, WorkQueueGETData, WorkRequestCriteria } from '@app/restsvc/hccl.service';
import { ProviderDetailsTabMyschoolComponent } from './provider-details-tab-myschool.component';
import { ProviderDetailsTabColleaguesComponent } from './provider-details-tab-colleagues.component';
import { HcclOrganizationCrudWrapper } from 'tooling/prompt/templates/template-crud.component';

@Component({
  selector: 'app-provider-details-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, ProviderDetailsTabMyschoolComponent,ProviderDetailsTabColleaguesComponent],
  templateUrl: './provider-details-group.component.html',
  styleUrl: './provider-details-group.component.scss'
})
export class ProviderDetailsGroupComponent extends AbstractEntityGroupComponent<HcclUserProfileCrudWrapper> implements OnInit {

  override ngOnInit(): void {
    // For singleton behavior, always use current user profile ID
    this.hcclContextService.refreshContext().subscribe(context => {
      this.defaultId = context.currentUserProfileId || '';
      this.id = this.defaultId;
      // Call parent ngOnInit after setting the ID
      this.organizationId = context.currentUserProfile.organizationId || '';
      super.ngOnInit();
    });
  }

  protected defaultId: string = '';
  protected override getDefaultId(): string {
    return this.defaultId;
  }

  protected organizationId : string = '';
  protected getOrganizationId(): string {
    return this.organizationId;  
  }

  protected newCrudWrapperForCreate(): HcclUserProfileCrudWrapper {

    
    return HcclUserProfileCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected organization?: HcclOrganizationCrudWrapper;
  protected async loadEntityById(id: string): Promise<HcclUserProfileCrudWrapper> {
    this.organization = await  HcclOrganizationCrudWrapper.newInstance(this.organizationId, this.hcclService);

    return HcclUserProfileCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    const baseRoute = this.getBaseRoute();
    return [
      new SimpleTab('myschool', '' + this.organization?.getBusinessCode(), '', 
        () => {
          this.router.navigate([baseRoute]);
        },
        () => {
          return true;
        }
      ),
      new SimpleTab('colleagues', 'Colleagues', '', 
        () => {
          this.router.navigate([baseRoute, 'colleagues']);
        },
        () => {
          return this.entity !== null;
        }
      )
    ];
  }

  protected override getDefaultTabId(): string {
    return 'myschool';
  }
}
