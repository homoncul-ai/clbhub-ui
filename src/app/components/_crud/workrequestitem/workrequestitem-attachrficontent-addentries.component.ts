import { CatalogEntryCriteria, CatalogSearchResultEntryCriteria, CatalogSearchResultGETData, CatalogSearchResultPOSTData, HcclUserContextGETData, MenuControlData, MenuControlDataList, WorkItemFormContext, WorkItemFormRequest, WorkItemFormResponse } from './../../../restsvc/hccl.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractMultimodeComponent } from '@app/components/_global/abstract-multimode/abstract-multimode.component';
import { WorkRequestItemCrudComponent, WorkRequestItemCrudWrapper } from './workrequestitem-crud.component';
import { SimpleMessage } from '@app/restsvc/common-request-service.model';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { FormsModule } from '@angular/forms';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { WorkRequestCrudWrapper } from '../workrequest/workrequest-crud.component';
import { JsonPipe } from '@angular/common';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { CatalogEntryListComponent } from "../catalogentry/catalogentry-list.component";
import { CatalogEntryCrudComponent } from '../catalogentry/catalogentry-crud.component';
import { CatalogEntryGroupComponent } from '../catalogentry/catalogentry-group.component';
import { OnGoClickActionBehavior, OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { CatalogSearchResultEntryListComponent } from '../catalogsearchresultentry/catalogsearchresultentry-list.component';
import { Router } from '@angular/router';
import { CatalogSearchResultCrudComponent } from '../catalogsearchresult/catalogsearchresult-crud.component';

@Component({
  selector: 'app-workrequestitem-attachrficontent-addentries',
  standalone: true,
  imports: [CommonModule, WorkRequestItemCrudComponent, SimpleMessagesSectionComponent, FormsModule, MenuControlDataListComponent, JsonPipe,
    StdMdbFormTextComponent, CatalogEntryListComponent, CatalogSearchResultEntryListComponent, CatalogSearchResultCrudComponent],
  templateUrl: './workrequestitem-attachrficontent-addentries.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss'
})
export class WorkRequestItemAttachRFIContentAddEntriesComponent extends AbstractMultimodeComponent<WorkRequestCrudWrapper> implements OnInit  {
  
  // Properties referenced in template
  acceptText: string = '';
  availableQueues: any[] = [];

  protected workRequestItem: WorkRequestItemCrudWrapper | null = null;
  // RFI is for enqueuing a new erquest.
  override async ngOnInit(): Promise<void> {
    this.loading = true;
    //
   // alert('ngOnInit ' + this.id + ' ' + this.childId);
    this.entity = await WorkRequestCrudWrapper.newInstance(this.id, this.hcclService);
    if (this.childId != null) {
      this.workRequestItem = await WorkRequestItemCrudWrapper.newInstance(this.childId || '', this.hcclService);
    }

    var x : HcclUserContextGETData = this.hcclContextService.getContext();

    if (this.workItemFormContext.workRequestId === '') {
      this.workItemFormContext.workRequestId = this.id;
      this.workItemFormContext.workRequestItemId = this.childId;
      this.workItemFormContext.userProfileId = x.currentUserProfileId
      this.workItemFormContext.mapContextData = {};
      this.workItemFormContext.mapResultsData = {};
    }
    
    this.loading = false;
    this.localModes = ['createItemView', 'createItemViewPost'];
    this.enterMode('createItemView');
    super.ngOnInit();
  }

  protected workItemFormContext : WorkItemFormContext = {
    workRequestId: '',
    workRequestItemId: '',
    userProfileId: '',
    mapContextData: {},
    mapResultsData: {}
  };

  protected override async prepareModeEntry(entity: WorkRequestCrudWrapper, mode: string): Promise<void> {
    super.prepareModeEntry(entity, mode);
    //alert('prepareModeEntry ' + this.id + ' ' + this.childId);

    if (mode === 'createItemView') {
      // Create show a text area.
        await this.setupCreateItemView();
    } else if (mode === 'createItemViewPost') {
      // show a list of queues to reroute to.

    }
    return Promise.resolve();
  }

  protected async setupCreateItemView() {
   
     
    var request : WorkItemFormRequest = {
      op: 'createItemView',
      context: this.workItemFormContext,
      actionFormData: {}
    }
    this.workItemFormRequest = request;
    
    var rsp  =  await this.hcclService.callWorkRequestUi(this.id, 'AttachRFIContent', request).toPromise();

    
    var wirsp : WorkItemFormResponse = rsp as WorkItemFormResponse;
    this.workItemFormResponse = wirsp;
   // alert('WorkRequestItemAttachRFIContentAddEntriesComponent ngOnInit ' + JSON.stringify(rsp));
    this.menuCatalogs = wirsp.mapFormElements.menu_catalogs;
    this.catalogSearchResult = wirsp.mapFormElements.catalogSearchResult;
    this.catalogEntriesIdsToRemove = this.catalogSearchResult?.entries?.map
      (entry => entry.catalogEntryId).filter((id): id is string => id !== undefined) || [];
    debugger;
    this.workItemFormContext = wirsp.context as WorkItemFormContext;
  }
  protected notes: string = '';
  protected menuCatalogs : MenuControlDataList = {
    menuItems: []
  };

  protected workItemFormResponse : WorkItemFormResponse | null = null;
  protected workItemFormRequest : WorkItemFormRequest | null = null;
  protected catalogSearchResult : CatalogSearchResultGETData | null = null;
  protected catalogEntriesIdsToRemove: string[] = [];
  protected selectedWorkQueue : MenuControlData | null = null;

  protected catalogCode : string = '';
  onCatalogChange(selectedItem: MenuControlData | null): void {
    this.selectedWorkQueue = selectedItem;
   this.catalogCode = selectedItem?.id || '';
  }

 

  getCriteriaForEntries(): CatalogSearchResultEntryCriteria {
    return {
      catalogSearchResultId: this.catalogSearchResult?.id || ''
    }
  }   

  getCriteriaForSearch(): CatalogEntryCriteria {
    return {
      catalogId: this.catalogSearchResult?.catalogId || '',
      idsToRemove: this.catalogEntriesIdsToRemove
    }
  } 

  clickRowToShowEntry(): OnRowClickBehavior {
    var o : OnRowClickBehavior = new OnRowClickBehavior();
    o.parentId = this.id;
    o.tabId = 'catalogentry'; 
    o.alertMessage = 'Modal to show catalog entry';
    o.doNotNavigate = true;
    return o;
  }

  getCatalogCode(): string {
    return this.catalogCode;
  }



  getOnGoRemoveCatalogEntriesToRFI(): OnGoClickActionBehavior {
    var o : OnGoClickActionBehavior = new OnGoClickActionBehavior();
    o.onGoClick = async (entityIds: string[], baseRoute: string, router: Router) => {
      this.removeItemsFromRFI(entityIds);
    }
    o.alertMessage = 'Go with entity ids:';
    return o;
  }


  removeItemsFromRFI(entityIds: string[]) { 
    var request : WorkItemFormRequest = {
      op: 'contentRemoveItems',
      context: this.workItemFormContext,
      actionFormData: {
        searchResultsCatalogEntryIds: entityIds,
      }
    }
   var rsp  =   this.hcclService.callWorkRequestUi(this.id, 'AttachRFIContent', request).toPromise().then(rsp => {
    var wirsp : WorkItemFormResponse = rsp as WorkItemFormResponse;
    var wrid: string = wirsp.context?.workRequestItemId || '';
    var path : string[] = ['/ecoadmin-dashboard/workrequests', this.id, 'workRequestItem', wrid];
    this.router.navigate(path)
   });
  }
  getOnGoAddCatalogEntriesToRFI(): OnGoClickActionBehavior {
    var o : OnGoClickActionBehavior = new OnGoClickActionBehavior();
    o.onGoClick = async (entityIds: string[], baseRoute: string, router: Router) => {
      this.addItemsToRFI(entityIds);
    }
    o.alertMessage = 'Go with entity ids:';
    return o;
  }

  addItemsToRFI(entityIds: string[]) { 
    var request : WorkItemFormRequest = {
      op: 'contentAddPost',
      context: this.workItemFormContext,
      actionFormData: {
        catalogEntryIds: entityIds,
      }
    } 
   var rsp  =   this.hcclService.callWorkRequestUi(this.id, 'AttachRFIContent', request).toPromise().then(rsp => {
    var wirsp : WorkItemFormResponse = rsp as WorkItemFormResponse;
    var wrid: string = wirsp.context?.workRequestItemId || '';
    var path : string[] = ['/ecoadmin-dashboard/workrequests', this.id, 'workRequestItem', wrid];
   // alert('addItemsToRFI called with entityIds:' + entityIds );
    this.router.navigate(path)
    this.enterMode('createItemViewPost'); 
   });
  }

  getCatalogEntryOtherData(): any {
    return {
      catalogCode: "Bambi"
    }
  }
} 