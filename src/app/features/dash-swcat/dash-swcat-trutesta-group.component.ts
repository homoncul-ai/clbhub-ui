// This template is for generating a GROUP component  
// This was generated using entityName = HcclUserProfile
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclUserProfileCrudWrapper } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { HcclService, PMessageCriteria } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { DashSwcatTrutestaTabOverviewComponent } from './dash-swcat-trutesta-tab-overview.component';
import { DashSwcatTrutestaTabUsageComponent } from './dash-swcat-trutesta-tab-usage.component';
import { DashSwcatTrutestaTabUsageorgComponent } from './dash-swcat-trutesta-tab-usageorg.component';

@Component({
  selector: 'app-swcat-trutesta-group-component',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent,
     DashSwcatTrutestaTabOverviewComponent, DashSwcatTrutestaTabUsageComponent, DashSwcatTrutestaTabUsageorgComponent],
  styleUrl: '../../components/_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './dash-swcat-trutesta-group.component.html',
})
export class DashSwcatTrutestaGroupComponent extends AbstractEntityGroupComponent<HcclUserProfileCrudWrapper> implements OnInit {  

  @Input() messageId: string = '';

  constructor() {
    super();    
  }

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

  protected override calculateTabIdFromUrl(tabId_in: string): string {

    let tabId = tabId_in;
    tabId = this.tabId;
  
    return tabId;
  }
  protected override populateFromParams(params: any): void {
    super.populateFromParams(params);
    this.messageId = this.route.snapshot.params['messageId'];
  }

  protected organizationId : string = '';
  protected getOrganizationId(): string {
    return this.organizationId;  
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
    var tabs: SimpleTab[] = [
      new SimpleTab('overview', 'Overview', '', 
        () => {
          this.router.navigate([baseRoute, 'overview']);
        },
        () => {
          return true;
        }
      ),
      new SimpleTab('usage', 'Software Usage', '', 
        () => {
          this.router.navigate([baseRoute, 'usage']);
        },
        () => {
          return true;
        }
      ),
      new SimpleTab('usageorg', 'Usage by Organization', '', 
        () => {
          this.router.navigate([baseRoute, 'usageorg']);
        },
        () => {
          return true;
        }
      )];
      
   
    return tabs;
  }

  protected override getDefaultTabId(): string {
    return 'overview';
  }

  protected onMessageRowClickBehavior(): OnRowClickBehavior   {
    var x: OnRowClickBehavior =  new OnRowClickBehavior();
    x.parentId = this.id;
    x.tabId = 'message';
  //  x.alertMessage = 'Message';

    x.getNavigateUrl = (id: string) => {
      //return [this.getBaseRoute(),  id, 'message'];
      return ['swcat-dashboard', 'trutesta', id, 'message'];
    };
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
