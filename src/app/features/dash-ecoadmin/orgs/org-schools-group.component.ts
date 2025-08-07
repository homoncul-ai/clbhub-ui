import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HcclOrganizationCrudComponent, HcclOrganizationCrudWrapper } from '@app/components/_crud/hcclorganization/hcclorganization-crud.component';
import { AbstractListComponent, OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { HcclOrganizationCriteria, HcclService } from '@app/restsvc/hccl.service';
import { HcclOrganizationTypeRefCrudComponent, HcclOrganizationTypeRefCrudWrapper } from '@app/components/_crud/hcclorganizationtyperef/hcclorganizationtyperef-crud.component';
import { HcclOrganizationTypeRefListComponent } from '@app/components/_crud/hcclorganizationtyperef/hcclorganizationtyperef-list.component';
import { HcclOrganizationListComponent } from '@app/components/_crud/hcclorganization/hcclorganization-list.component';
import { OrgSchoolCrudComponent } from './org-school-crud.component';

@Component({
  selector: 'app-org-schools-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, HcclOrganizationCrudComponent, HcclOrganizationListComponent,
    HcclOrganizationTypeRefCrudComponent, HcclOrganizationTypeRefListComponent, OrgSchoolCrudComponent],
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
    return this.setupListDetailsTabs();
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

  public x() {
    super.routeToPath(['/ecoadmin-dashboard/orgs/schools']);
  }
} 