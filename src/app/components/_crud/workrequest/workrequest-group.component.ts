// This template is for generating a GROUP component  
// This was generated using entityName = WorkRequest
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { WorkRequestCrudWrapper, WorkRequestCrudComponent } from '@app/components/_crud/workrequest/workrequest-crud.component';
import { HcclService, WorkRequestCriteria, WorkRequestItemCriteria } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { WorkrequestUpdateComponent } from "./workrequest-update.component";
import { WorkRequestListComponent } from './workrequest-list.component';
import { WorkRequestItemListComponent } from '../workrequestitem/workrequestitem-list.component';
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { WorkRequestItemCrudComponent } from '../workrequestitem/workrequestitem-crud.component';

@Component({
  selector: 'app-workrequest-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, WorkRequestCrudComponent, WorkrequestUpdateComponent, WorkRequestListComponent, WorkRequestItemListComponent, WorkRequestItemCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './workrequest-group.component.html',
})
export class WorkRequestGroupComponent extends AbstractEntityGroupComponent<WorkRequestCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  } 
  protected newCrudWrapperForCreate(): WorkRequestCrudWrapper {
    return WorkRequestCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<WorkRequestCrudWrapper> {
    return WorkRequestCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    var tabs = this.setupListDetailsTabs();
    var baseRoute = this.getBaseRoute();
    var tab =  new SimpleTab('update', 'Update', '', 
      () => {
        this.currentTabId = 'update';
       // this.router.navigate([baseRoute, this.id, 'update']);
        alert("update");
      },
      () => {
        return this.entity !== null;
      }
    );
    tabs.push(tab) 

     tab =  new SimpleTab('items', 'Items', '', 
      () => {
        this.currentTabId = 'items';
       // this.router.navigate([baseRoute, this.id, 'items']);
        
      },
      () => {
        return this.entity !== null;
      }
    );
    tabs.push(tab) 
    
    tab =  new SimpleTab('workRequestItem', 'Item', '', 
      () => {
        this.currentTabId = 'workRequestItem';
        
      },
      () => {
        return this.childId !== null && this.childId !== undefined && this.childId !== '';
      }
    );
    tabs.push(tab)

    // var tabD: SimpleTab | undefined = this.findTabById(tabs, 'details');
    // if (tabD) {
    //   //alert('found tabD');
    //   tabD.label = this.entity?.getBusinessCode() || '';
    // }
    return tabs;
    return tabs;
  }

  override getDetailsTabLabel(): string {
    return this.entity?.getBusinessCode() || '';
  }
 
  get itemsCriteria(): WorkRequestItemCriteria {
    var criteria: WorkRequestItemCriteria = {  
      workRequestId: this.id
    }
    return criteria;
  }

  myOnRowClickBehavior(): OnRowClickBehavior {
    var x: OnRowClickBehavior =  new OnRowClickBehavior();
    x.parentId = this.id;
    x.tabId = 'workRequestItem';
    //x.alertMessage = 'Catalog Entry';
    return x;
  }
   
} 