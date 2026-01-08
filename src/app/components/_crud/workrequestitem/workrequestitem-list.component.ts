// This template is for generating a LIST component for an entity that has a FK Menu
// This was generated using entityName = WorkRequestItem
// Generate the new [entityName]-list.component.ts   files using this template
// Of course, the code related to the attributes of the entity in the grid should be changed to match the entityName's attributes


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclService } from '../../../restsvc/hccl.service';
import { WorkRequestItemGETData, WorkRequestItemCriteria, WorkRequestItemGETDataSearchResults } from '../../../restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { Observable } from 'rxjs';
import { WorkRequestCrudWrapper } from '../workrequest/workrequest-crud.component';
import { HcclUserCrudWrapper } from '../hccluser/hccluser-crud.component';

/**
 * Component for displaying and managing WorkRequestItem data using HcclService
 * Extends AbstractListComponent for common grid functionality
 */

@Component({
  selector: 'app-workrequestitem-list',
  standalone: true,
  templateUrl: '../../_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../_global/abstract-list/abstract-list.component.scss'],
    imports: [CommonModule]
})
export class WorkRequestItemListComponent extends AbstractListComponent<WorkRequestItemGETData, WorkRequestItemCriteria, WorkRequestItemGETDataSearchResults> {
  
  constructor(   
  ) {
    super();
    
    // Set entity-specific properties
    this.searchHeading = 'Work Request Items';
    this.showingAddButton = true;
    this.showingIdCheckbox = true;
    //this.searchPlaceholder = ...
  }

  // Always start with the id column, then the attributes of the entity in the order you want them to appear in the grid
  // start with the id, dateCreated, dateLastUpdated, createdByInfo, lastUpdatedByInfo commented out.
  protected getGridColumns(): any[] {
    return [
      { id: 'id', header: [{ text: 'ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
//      { id: 'workRequestId', header: [{ text: 'Work Request ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
{ id: 'businessCode', header: [{ text: 'Business Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'nameText', header: [{ text: 'Name Text', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'actionCode', header: [{ text: 'Action Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'currentStateCode', header: [{ text: 'Current State Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      ///      { id: 'sequenceOrder', header: [{ text: 'Sequence Order', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'description', header: [{ text: 'Description', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
  //    { id: 'acceptedByUserId', header: [{ text: 'Accepted By User ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
  //    { id: 'acceptedByUserStr', header: [{ text: 'Accepted By User', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
  //  {  id: 'workRequestStr', header: [{ text: 'Parent Work Request', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
  //    { id: 'roleCode', header: [{ text: 'Role Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
 //     { id: 'currentStateTransitionId', header: [{ text: 'Current State Transition ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 180, adjust: true },
//      { id: 'createdByInfo', header: [{ text: 'Created By', align: 'center' }], minWidth: 120, adjust: true },
  //    { id: 'dateCreated', header: [{ text: 'Date Created', align: 'center' }], minWidth: 120, adjust: true },
    //  { id: 'lastUpdatedByInfo', header: [{ text: 'Last Updated By', align: 'center' }], minWidth: 120, adjust: true },
      { id: 'dateLastUpdated', header: [{ text: 'Date Last Updated ', align: 'center' }], minWidth: 120, adjust: true }
    ];
  }

  protected createCriteria(): WorkRequestItemCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected findEntities(criteria: WorkRequestItemCriteria): Observable<WorkRequestItemGETDataSearchResults> {
    return this.hcclService.findWorkRequestItems(criteria);
  }

  protected hasSearchResults(response: WorkRequestItemGETDataSearchResults): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(response: WorkRequestItemGETDataSearchResults): WorkRequestItemGETData[] {
    return response.searchResults || [];
  }

  /**
   * Special attributes in the grid.  FK info needs to be added here.
   * @param entity 
   * @returns 
   */
  protected override async formatEntityDataAsync(entity: WorkRequestItemGETData): Promise<any> {
    // if there's one ore more FK's FK, then create a CrudWrapper for the FK and add the displaytext of the crudwrapper
    const workRequestStr: string = entity.workRequestId == null ? 'unknown' : 
       (await WorkRequestCrudWrapper.newInstance(entity.workRequestId, this.hcclService)).getDisplayText();

    const acceptedByUserStr: string = entity.acceptedByUserId == null ? 'unknown' : 
       (await HcclUserCrudWrapper.newInstance(entity.acceptedByUserId, this.hcclService)).getDisplayText();

    return {
      workRequestStr: workRequestStr,
      acceptedByUserStr: acceptedByUserStr,
      createdByInfo: entity.createdByInfo?.name || '',
      lastUpdatedByInfo: entity.lastUpdatedByInfo?.name || '',
      dateCreated: entity.dateCreated?.formattedDate || '',
      dateLastUpdated: entity.dateLastUpdated?.formattedDate || ''
    };
  }


} 