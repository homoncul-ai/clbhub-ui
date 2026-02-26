import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclUserProfileCrudWrapper } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { HcclUserContextGETData, HcclUserProfileCriteria, WorkQueueGETData, WorkRequestCriteria } from '@app/restsvc/hccl.service';
import { ProviderDetailsTabMyschoolComponent } from './provider-details-tab-myschool.component';
import { HcclOrganizationCrudWrapper } from '@app/components/_crud/hcclorganization/hcclorganization-crud.component';
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { OrgSchoolStaffListComponent } from '@app/features/dash-ecoadmin/orgs/org-school-staff-list.component';
import { OrgSchoolStaffCrudComponent } from '@app/features/dash-ecoadmin/orgs/org-school-staff-crud.component';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-provider-details-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, ProviderDetailsTabMyschoolComponent,OrgSchoolStaffListComponent,OrgSchoolStaffCrudComponent,MdbModalModule],
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
      new SimpleTab('staff', 'Staff', '', 
        () => {
          this.router.navigate([baseRoute, 'staff']);
        },
        () => {
          return this.entity !== null;
        }
      ),
      new SimpleTab('staffmember', 'Staff Member', '', 
        () => {
          this.router.navigate([baseRoute, 'staffmember']);
        },
        () => {
          return this.entity !== null && this.childId !== undefined;
        }
      )
    ];
  }

  protected override getDefaultTabId(): string {
    return 'myschool';
  }


  protected getCriteriaForStaff(): HcclUserProfileCriteria {
    var x: HcclUserProfileCriteria = { 
      organizationId: this.organizationId,
      available: 1,
      findingColleagues: true
    };
    return x;
  }

  onClickOrgStaffRowBehavior(): OnRowClickBehavior {
    var o : OnRowClickBehavior = new OnRowClickBehavior();
    o.parentId = this.id;
    o.tabId = 'staffmember';     
  //  o.alertMessage = 'link to show staff entry';
    o.usingNavigateUrl = true;
    //o.doNotNavigate = true;
    o.getNavigateUrl = (entityId: string, baseRoute: string): any[] => {
 
      //var urlParts = [baseRoute, 'staffmember', entityId];
      var urlParts = [baseRoute, 'staffmember', entityId];
      
      return urlParts
    };
    return o;
  }

}
