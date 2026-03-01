import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HcclOrganizationCrudComponent, HcclOrganizationCrudWrapper } from '@app/components/_crud/hcclorganization/hcclorganization-crud.component';
import { AbstractListComponent, OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { HcclOrganizationCriteria, HcclService, HcclUserInviteCriteria, HcclUserProfileCriteria } from '@app/restsvc/hccl.service';
import { HcclOrganizationTypeRefCrudComponent, HcclOrganizationTypeRefCrudWrapper } from '@app/components/_crud/hcclorganizationtyperef/hcclorganizationtyperef-crud.component';
import { HcclOrganizationTypeRefListComponent } from '@app/components/_crud/hcclorganizationtyperef/hcclorganizationtyperef-list.component';
import { HcclOrganizationListComponent } from '@app/components/_crud/hcclorganization/hcclorganization-list.component';
import { OrgSchoolCrudComponent } from './org-school-crud.component';
import { OrgSchoolStaffListComponent } from './org-school-staff-list.component';
import { OrgSchoolStaffCrudComponent } from './org-school-staff-crud.component';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { overrides } from 'node_modules/chart.js/dist/core/core.defaults';
import { HcclUserInviteListComponent } from '@app/components/_crud/hccluserinvite/hccluserinvite-list.component';

@Component({
  selector: 'app-org-schools-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, HcclOrganizationCrudComponent, HcclOrganizationListComponent,
    HcclOrganizationTypeRefCrudComponent, HcclOrganizationTypeRefListComponent,
     OrgSchoolCrudComponent, OrgSchoolStaffListComponent, OrgSchoolStaffCrudComponent, MdbModalModule,
     HcclUserInviteListComponent],
  templateUrl: './org-schools-group.component.html' 
})
export class OrgSchoolsGroupComponent extends AbstractEntityGroupComponent<HcclOrganizationCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }
  override async ngOnInit(): Promise<void> {
    super.ngOnInit();
    this.organizationTypeRefWrapper = await HcclOrganizationTypeRefCrudWrapper.newInstanceByCode(this.organizationTypeCode, this.hcclService);
    this.organizationTypeId = this.organizationTypeRefWrapper.getData().id ?? '';
  }

  protected newCrudWrapperForCreate(): HcclOrganizationCrudWrapper {
    var x: HcclOrganizationCrudWrapper = HcclOrganizationCrudWrapper.newInstanceForCreate(this.hcclService);
    x.getData().organizationTypeId = this.organizationTypeId;
    return x;
  }

  organizationTypeCode: string = 'SCHOOL';
  organizationTypeId: string = '';
  organizationTypeRefWrapper: HcclOrganizationTypeRefCrudWrapper | null = null;

 
  protected async loadEntityById(id: string): Promise<HcclOrganizationCrudWrapper> {
   return HcclOrganizationCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {  
    const baseRoute = this.getBaseRoute();
    let tabs: SimpleTab[] = [
      new SimpleTab('list', 'List', '', 
        () => {
          this.router.navigate([baseRoute]);
        },
        () => {
          return true;
        }
      ),
      new SimpleTab('details', this.getDetailsTabLabel(), '', 
        () => {
          //this.currentTabId = 'details';
          this.router.navigate([baseRoute, this.id, 'details']);
        },
        () => {
          return this.entity !== null;
        }
      )];
      let tab = new SimpleTab('staff', 'Staff', '', 
        () => {
          //this.currentTabId = 'details';
          this.router.navigate([baseRoute, this.id, 'staff']);
        },
        () => {
          return this.entity !== null;
        }
      );
      tabs.push(tab);
      tab = new SimpleTab('invitations', 'Invitations', '', 
        () => {
          //this.currentTabId = 'details';
          this.router.navigate([baseRoute, this.id, 'invitations']);
        },
        () => {
          return this.entity !== null;
        }
      );
      tabs.push(tab);      
      tab = new SimpleTab('staffmember', 'Staff Member', '', 
        () => {
          //this.currentTabId = 'details';
          this.router.navigate([baseRoute, this.id, 'staffmember', this.childId]);
        },
        () => {
          return this.currentTabId === 'staffmember';
        }
      );
      tabs.push(tab);
    return tabs;
  }

  protected getCriteria(): HcclOrganizationCriteria {
    var x: HcclOrganizationCriteria = { 
      organizationTypeCode: this.organizationTypeCode
    };
    return x;
  }
  protected override setupIfNoId(): void {
    this.currentTabId = 'list';
    this.showingTabset = true;
      this.entity = this.newCrudWrapperForCreate();   
  }

  onClickOrgRowBehavior(): OnRowClickBehavior {
    var o : OnRowClickBehavior = new OnRowClickBehavior();
    o.parentId = this.id;
    o.tabId = 'details';     
  //  o.alertMessage = 'Modal to show catalog entry';
    o.usingNavigateUrl = true;
    //o.doNotNavigate = true;
    o.getNavigateUrl = (entityId: string, baseRoute: string): any[] => {
      return ['/ecoadmin-dashboard/orgs/schools', entityId, 'details'];
    };
    return o;
  }

  entityForCreate?: HcclOrganizationCrudWrapper ;
  onClickAddSchool(): void {
    this.currentTabId = 'create';
    this.showingTabset = true;
    this.entityForCreate = this.newCrudWrapperForCreate();
    this.entityForCreate.getData().name = 'New School';
  }

  protected override getBaseRoute(): string {
    return '/ecoadmin-dashboard/orgs/schools';
  }

  protected getCriteriaForStaff(): HcclUserProfileCriteria {
    var x: HcclUserProfileCriteria = { 
      organizationId: this.id,
      findingColleagues: true
    };
    return x;
  }

  onClickOrgStaffRowBehavior(): OnRowClickBehavior {
    var o : OnRowClickBehavior = new OnRowClickBehavior();
    o.parentId = this.id;
    o.tabId = 'staffmember';     
    //o.alertMessage = 'Modal to show staff member entry';
    o.usingNavigateUrl = true;
    //o.doNotNavigate = true;
    o.getNavigateUrl = (entityId: string, baseRoute: string): any[] => {
      return ['/ecoadmin-dashboard/orgs/schools', this.id, 'staffmember', entityId];
    };
    return o;
  }


  protected override populateFromParams(params: any): void {
    super.populateFromParams(params);
    this.childId = params['childId'];
//    alert('childId: ' + this.childId + " " + JSON.stringify(params));
    
  }

  protected override calculateTabIdFromUrl(tabId_in: string): string {
    let tabId = super.calculateTabIdFromUrl(tabId_in);
    tabId = this.tabId;
//    alert('tabId: ' + tabId);
    return tabId;
  }

  protected getCriteriaForInvitations(): HcclUserInviteCriteria {
    var x: HcclUserInviteCriteria = { 
      organizationId: this.id
    };
    return x;
  }

} 