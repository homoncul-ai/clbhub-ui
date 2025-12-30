import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { CatalogEntryInterestListComponent } from "@app/components/_crud/catalogentryinterest/catalogentryinterest-list.component";
import { StdBubaComponent } from '@app/components/_global/std-buba/std-buba.component';
import { CatalogEntryInterestCrudComponent } from '@app/components/_crud/catalogentryinterest/catalogentryinterest-crud.component';
import { HcclUserProfileCrudComponent } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { OnFinishLoadingBehavior, OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { HcclUserProfileCrudWrapper } from '../dash-ecoadmin/orgs/org-school-staff-crud.component';
import { CatalogEntryInterestCriteria, CatalogEntryInterestGETData } from '@app/restsvc/hccl.service';
import { PersonalStatementSelectorComponent } from "@app/components/_global/personal-statement-selector/personal-statement-selector.component";
import { StudentEngageInterestComponent } from './student-engage-interest/student-engage-interest.component';
@Component({
  selector: 'app-student-engage',
  standalone: true,
  imports: [CommonModule, CatalogEntryInterestListComponent, CommonModule, SimpleTabsetComponent,
    HcclUserProfileCrudComponent, CatalogEntryInterestListComponent,
    CatalogEntryInterestCrudComponent, StdBubaComponent, PersonalStatementSelectorComponent, StudentEngageInterestComponent],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                <i class="fas fa-comments me-2"></i>
                Student Engage
              </h3>
            </div>
            <div class="card-body">
            <app-personal-statement-selector
  label="Select Personal Statement:"
  [autoSelectFirst]="true"
  (selectionChange)="onPersonalStatementChange($event)">
</app-personal-statement-selector>

            <app-catalogentryinterest-list *ngIf="showInterestList && personalStatementId"
   [criteria]="getInterestCriteria()" [showingSearch]="false"
   [showingSearchHeading]="false" [showingGoButton]="false" [showingAddButton]="false" [showingIdCheckbox]="false"
   [onRowClickBehavior]="onInterestRowClickBehavior()"
   [onFinishLoading]="onFinishLoadingBehavior()"></app-catalogentryinterest-list> 
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <app-student-engage-interest [interestId]="getSelectedInterestId()"></app-student-engage-interest>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
      border: 1px solid rgba(0, 0, 0, 0.125);
    }
    
    .card-header {
      background-color: #f8f9fa;
      border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    }
  `]
})
export class StudentEngageComponent 
extends AbstractEntityGroupComponent<HcclUserProfileCrudWrapper> implements OnInit {  

  protected personalStatementId: string = '';
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

  protected getPersonalStatementId(): string {
    return this.personalStatementId;
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
    var criteria: CatalogEntryInterestCriteria = {
      personalStatementId: this.personalStatementId,
      interestRangeMin: 1,
      interestRangeMax: 10,
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };

    return criteria;
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
 

  protected getSelectedInterestId(): string {
    return this.interestId;
  }
  protected setSelectedInterestId(interestId: string): void {
    this.interestId = interestId;
    this.cdr.detectChanges(); // Trigger change detection to update child component
  }

  protected setupTabs(): SimpleTab[] {
    const baseRoute = this.getBaseRoute();
    var tabs: SimpleTab[] = []
    return tabs;
  }

  protected override getDefaultTabId(): string {
    return 'interests';
  }

  protected onInterestRowClickBehavior(): OnRowClickBehavior   {
    var x: OnRowClickBehavior =  new OnRowClickBehavior();
    x.parentId = this.id;
    x.tabId = 'interest';
    x.alertMessage = 'Message';
    x.usingNavigateUrl = false;
    x.onRowClick = (id: string) => {
      this.setSelectedInterestId(id);
      // Clicking on this needs to open up 
    };
    
    return x;
  }
  protected onFinishLoadingBehavior(): OnFinishLoadingBehavior {
    var x: OnFinishLoadingBehavior = new OnFinishLoadingBehavior();
    x.onFinishLoading = (id: string, data: any) => {
      this.setSelectedInterestId(id);
    };
    return x;
  }

//   selectedWorkQueue: MenuControlData | null = null;
//   onWorkQueueChange(selectedItem: MenuControlData | null): void {
//     this.selectedWorkQueue = selectedItem;
//   }
 
  private loadMessageData(): void {
    if (!this.interestId) return;
    
    this.hcclService.getCatalogEntryInterestById(this.interestId)
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

  protected showInterestList: boolean = true;

  onPersonalStatementChange(event: any): void {
    const newId = event?.id || '';
    
    // Clear current selection
    this.interestId = '';
    this.setSelectedInterestId('');
    
    // Force list component to recreate by toggling visibility
    this.showInterestList = false;
    this.personalStatementId = newId;
    this.cdr.detectChanges();
    
    // Re-show the list after a tick to force recreation with new criteria
    setTimeout(() => {
      this.showInterestList = true;
      this.cdr.detectChanges();
    }, 0);
  }
}
