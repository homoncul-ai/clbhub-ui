// This template is for generating a GROUP component  
// This was generated using entityName = HcclUserProfile
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclUserProfileCrudWrapper, HcclUserProfileCrudComponent } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { HcclService, CatalogEntryInterestCriteria } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { CatalogEntryInterestListComponent } from '@app/components/_crud/catalogentryinterest/catalogentryinterest-list.component';

@Component({
  selector: 'app-dash-student-interests',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, HcclUserProfileCrudComponent, CatalogEntryInterestListComponent],
  styleUrl: '../../components/_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './dash-student-interests.component.html',
})
export class DashStudentInterestsComponent extends AbstractEntityGroupComponent<HcclUserProfileCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): HcclUserProfileCrudWrapper {
    return HcclUserProfileCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<HcclUserProfileCrudWrapper> {
    return HcclUserProfileCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

  getInterestCriteria(): CatalogEntryInterestCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

}