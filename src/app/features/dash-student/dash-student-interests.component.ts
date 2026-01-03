// This template is for generating a GROUP component  
// This was generated using entityName = HcclUserProfile
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclUserProfileCrudWrapper, HcclUserProfileCrudComponent } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { HcclService, CatalogEntryInterestCriteria, CatalogEntryInterestGETData } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { CatalogEntryInterestListComponent } from '@app/components/_crud/catalogentryinterest/catalogentryinterest-list.component';
import { CatalogEntryInterestCrudComponent } from '@app/components/_crud/catalogentryinterest/catalogentryinterest-crud.component';
import { StdBubaComponent } from '@app/components/_global/std-buba/std-buba.component';
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';

@Component({
  selector: 'app-dash-student-interests',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, 
    HcclUserProfileCrudComponent, CatalogEntryInterestListComponent,
    CatalogEntryInterestCrudComponent, StdBubaComponent],
  styleUrl: '../../components/_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './dash-student-interests.component.html',
})
export class DashStudentInterestsComponent 
extends AbstractEntityGroupComponent<HcclUserProfileCrudWrapper> implements OnInit {  

  private interestTab: SimpleTab | undefined;
  private catalogEntryInterest: CatalogEntryInterestGETData | null = null;
  
  constructor() {
    super();    
  }

  override ngOnInit(): void {
    // For singleton behavior, always use current user profile ID
    this.hcclContextService.refreshContext().subscribe(context => {
      this.defaultId = context.currentUserProfileId || '';
      this.id = this.defaultId;
      //this.setupWorkRequestListBlocks();
      // Call parent ngOnInit after setting the ID
      super.ngOnInit();
      //alert('defaultId ' + this.defaultId);
    });

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
 

  getInterestCriteria(): CatalogEntryInterestCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }



  protected override calculateTabIdFromUrl(tabId_in: string): string {

    let tabId = tabId_in;
    tabId = this.tabId;
  
    return tabId;
  }
  protected override populateFromParams(params: any): void {
    super.populateFromParams(params);
    this.interestId = this.route.snapshot.params['interestId'];
  }
  protected interestId: string = '';
  protected getInterestId(): string {
    return this.interestId;
  } 
  protected organizationId : string = '';
  protected getOrganizationId(): string {
    return this.organizationId;  
  }
 

  

  protected setupTabs(): SimpleTab[] {
    const baseRoute = this.getBaseRoute();
    var tabs: SimpleTab[] = [
      new SimpleTab('interests', 'Interests', '', 
        () => {
          this.router.navigate([baseRoute]);
        },
        () => {
          return true;
        }
      )];
      
      this.interestTab = new SimpleTab('interest', "Interest", '', 
        () => {
          this.router.navigate(['student-dashboard', 'interests', this.interestId, 'interest']);
        },
        () => {
          return this.interestId !== null;
        }
      );
      tabs.push(this.interestTab);
      
      // Load message data if messageId is available
      if (this.interestId) {
        this.loadMessageData();
      }
   
    return tabs;
  }

  protected override getDefaultTabId(): string {
    return 'interests';
  }

  protected onInterestRowClickBehavior(): OnRowClickBehavior   {
    var x: OnRowClickBehavior =  new OnRowClickBehavior();
    x.parentId = this.id;
    x.tabId = 'interest';
  //  x.alertMessage = 'Message';

    x.getNavigateUrl = (id: string) => {
      //return [this.getBaseRoute(),  id, 'message'];
      return ['student-dashboard', 'interests', id, 'interest'];
    };
    return x;
  }
   
//   selectedWorkQueue: MenuControlData | null = null;
//   onWorkQueueChange(selectedItem: MenuControlData | null): void {
//     this.selectedWorkQueue = selectedItem;
//   }
 
  private loadMessageData(): void {
    if (!this.interestId) return;
    
    this.hcclService.getCatalogEntryInterestById(this.interestId, '')
      .subscribe({
        next: (data) => {
          this.catalogEntryInterest = data;
          this.updateInterestTabLabel();
        },
        error: (err) => {
          console.error('Failed to load message:', err);
        }
      });
  }

  private updateInterestTabLabel(): void {
    if (this.interestTab && this.catalogEntryInterest?.interest) {
      this.interestTab.label = "Some Interest - need message";
    }
  }

}