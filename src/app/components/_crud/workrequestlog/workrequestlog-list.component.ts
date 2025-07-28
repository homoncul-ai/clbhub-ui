// This template is for generating a LIST component for an entity that has a FK Menu
// This was generated using entityName = WorkRequestLog
// Generate the new [entityName]-list.component.ts   files using this template
// Of course, the code related to the attributes of the entity in the grid should be changed to match the entityName's attributes


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclService } from '../../../restsvc/hccl.service';
import { WorkRequestLogGETData, WorkRequestLogCriteria, WorkRequestLogGETDataSearchResults } from '../../../restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { Observable } from 'rxjs';
import { WorkRequestCrudWrapper } from '@app/components/_crud/workrequest/workrequest-crud.component';
import { WorkRequestItemCrudWrapper } from '@app/components/_crud/workrequestitem/workrequestitem-crud.component';
import { DateGETData } from '@app/restsvc/common-request-service.model';

/**
 * Component for displaying and managing WorkRequestLog data using HcclService
 * Extends AbstractListComponent for common grid functionality
 */

@Component({
  selector: 'app-workrequestlog-list',
  standalone: true,
  templateUrl: '../../_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../_global/abstract-list/abstract-list.component.scss'],
    imports: [CommonModule]
})
export class WorkRequestLogListComponent extends AbstractListComponent<WorkRequestLogGETData, WorkRequestLogCriteria, WorkRequestLogGETDataSearchResults> {
  
  constructor(   
  ) {
    super();
    
    // Set entity-specific properties
    this.searchHeading = 'Work Request Logs';
    this.showingAddButton = true;
    this.showingIdCheckbox = true;
    //this.searchPlaceholder = ...
  }

  // Always start with the id column, then the attributes of the entity in the order you want them to appear in the grid
  // start with the id, dateCreated, dateLastUpdated, createdByInfo, lastUpdatedByInfo commented out.
  protected getGridColumns(): any[] {
    return [
      // id is commented out for now - not sure if we want to show this
      //{ id: 'id', header: [{ text: 'ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'nameText', header: [{ text: 'Name Text', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'description', header: [{ text: 'Description', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'eventCode', header: [{ text: 'Event Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      // { id: 'transactionReferenceId', header: [{ text: 'Transaction Reference ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      // { id: 'roleCode', header: [{ text: 'Role Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      // { id: 'actionSubCode', header: [{ text: 'Action Sub Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      // { id: 'statusCode', header: [{ text: 'Status Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },

      // // Replace [prefix]Id with the displaytext of the crudwrapper - named [prefix]Str instead of [prefix]Id
      // { id: 'workRequestStr', header: [{ text: 'Work Request', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      // { id: 'workRequestItemStr', header: [{ text: 'Work Request Item', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },

      // Commented out for now - not sure if we want to show this
//      { id: 'createdByInfo', header: [{ text: 'Created By', align: 'center' }], minWidth: 120, adjust: true },
  //    { id: 'dateCreated', header: [{ text: 'Date Created', align: 'center' }], minWidth: 120, adjust: true },
    //  { id: 'lastUpdatedByInfo', header: [{ text: 'Last Updated By', align: 'center' }], minWidth: 120, adjust: true },
      { id: 'dateLastUpdated', header: [{ text: 'Date Last Updated', align: 'center' }], minWidth: 120, adjust: true }
    ];
  }

  protected createCriteria(): WorkRequestLogCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected findEntities(criteria: WorkRequestLogCriteria): Observable<WorkRequestLogGETDataSearchResults> {
    return this.hcclService.findWorkRequestLogs(criteria);
  }

  protected hasSearchResults(response: WorkRequestLogGETDataSearchResults): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(response: WorkRequestLogGETDataSearchResults): WorkRequestLogGETData[] {
    return response.searchResults || [];
  }

  /**
   * Special attributes in the grid.  FK info needs to be added here.
   * @param entity 
   * @returns 
   */
  protected override async formatEntityDataAsync(entity: WorkRequestLogGETData): Promise<any> {
    // Every attribute of the form [prefix]Id is an "foreign key" and should be replaced with the displaytext of the crudwrapper
    const workRequestStr: string = entity.workRequestId == null ? 'unknown' : 
       (await WorkRequestCrudWrapper.newInstance(entity.workRequestId, this.hcclService)).getDisplayText();

    const workRequestItemStr: string = entity.workRequestItemId == null ? 'unknown' : 
       (await WorkRequestItemCrudWrapper.newInstance(entity.workRequestItemId, this.hcclService)).getDisplayText();

       var dateLastUpdatedStr:string = super.formatDateTime(entity.dateLastUpdated);
        
      return {
        createdByInfo: entity.createdByInfo?.name || '',
        lastUpdatedByInfo: entity.lastUpdatedByInfo?.name || '',
        dateCreated: entity.dateCreated?.formattedDate || '',
        dateLastUpdated: dateLastUpdatedStr,
        workRequestStr: workRequestStr,
        workRequestItemStr: workRequestItemStr
      };
  }

} 