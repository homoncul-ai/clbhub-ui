import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HcclOrganizationCrudComponent, HcclOrganizationCrudWrapper } from '@app/components/_crud/hcclorganization/hcclorganization-crud.component';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { HcclOrganizationCriteria, HcclService } from '@app/restsvc/hccl.service';
import { HcclOrganizationTypeRefCrudWrapper } from '@app/components/_crud/hcclorganizationtyperef/hcclorganizationtyperef-crud.component';

@Component({
  selector: 'app-org-schools-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, HcclOrganizationCrudComponent],
  templateUrl: './org-schools-group.component.html' 
})
export class OrgSchoolsGroupComponent extends AbstractEntityGroupComponent<HcclOrganizationCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): HcclOrganizationCrudWrapper {
    var x: HcclOrganizationCrudWrapper = HcclOrganizationCrudWrapper.newInstanceForCreate(this.hcclService);
    x.getData().organizationTypeId = 'SCHOOL';
    return x;
  }

  organizationTypeCode: string = 'SCHOOL';
  organizationTypeRefWrapper: HcclOrganizationTypeRefCrudWrapper | null = null;

 
  protected async loadEntityById(id: string): Promise<HcclOrganizationCrudWrapper> {
    this.organizationTypeRefWrapper = await HcclOrganizationTypeRefCrudWrapper.newInstanceByCode(this.organizationTypeCode, this.hcclService);
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

  
} 