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
import { PMessageListComponent } from '@app/components/_crud/pmessage/pmessage-list.component';
import { PMessageUiComponent } from '@app/components/_crud/pmessage-ui/pmessage-ui.component';

@Component({
  selector: 'app-dash-swcat-home',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent,
     PMessageListComponent, PMessageUiComponent],
  styleUrl: '../../components/_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './dash-swcat-home.component.html',
})
export class DashSwcatHomeComponent extends AbstractEntityGroupComponent<HcclUserProfileCrudWrapper> implements OnInit {  

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
      new SimpleTab('messages', 'Messages', '', 
        () => {
          this.router.navigate([baseRoute]);
        },
        () => {
          return true;
        }
      )];
      
      tabs.push(new SimpleTab('message', "Message", '', 
        () => {
          this.router.navigate(['swcat-dashboard', 'messages', this.messageId, 'message']);
        },
        () => {
          return this.messageId !== null;
        }
      ));
      
   
    return tabs;
  }

  protected override getDefaultTabId(): string {
    return 'messages';
  }

  protected onMessageRowClickBehavior(): OnRowClickBehavior   {
    var x: OnRowClickBehavior =  new OnRowClickBehavior();
    x.parentId = this.id;
    x.tabId = 'message';
  //  x.alertMessage = 'Message';

    x.getNavigateUrl = (id: string) => {
      //return [this.getBaseRoute(),  id, 'message'];
      return ['swcat-dashboard', 'messages', id, 'message'];
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
