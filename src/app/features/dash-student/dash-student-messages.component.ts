// This template is for generating a GROUP component  
// This was generated using entityName = HcclUserProfile
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclUserProfileCrudWrapper, HcclUserProfileCrudComponent } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { HcclService, PMessageCriteria } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';

@Component({
  selector: 'app-dash-student-messages',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, HcclUserProfileCrudComponent],
  styleUrl: '../../components/_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './dash-student-messages.component.html',
})
export class DashStudentMessagesComponent extends AbstractEntityGroupComponent<HcclUserProfileCrudWrapper> implements OnInit {  

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

  protected override getDefaultTabId(): string {
    return 'details';
  }

  protected myOnRowClickBehavior(): OnRowClickBehavior   {
    var x: OnRowClickBehavior =  new OnRowClickBehavior();
    x.parentId = this.id;
    x.tabId = 'HcclUserProfileItem';
    //x.alertMessage = 'HCCL User Profile';
    return x;
  }
   
//   selectedWorkQueue: MenuControlData | null = null;
//   onWorkQueueChange(selectedItem: MenuControlData | null): void {
//     this.selectedWorkQueue = selectedItem;
//   }

  getPMessageCriteria(): PMessageCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }
}