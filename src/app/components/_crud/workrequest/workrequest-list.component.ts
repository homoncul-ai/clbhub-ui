import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclService } from '../../../restsvc/hccl.service';
import { WorkRequestGETData, WorkRequestCriteria, WorkRequestGETDataSearchResults } from '../../../restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { Observable } from 'rxjs';
import { WorkQueueCrudWrapper } from '../workqueue/workqueue-crud.component';
import { WorkRequestTypeCrudWrapper } from '../workrequesttype/workrequesttype-crud.component';

/**
 * Component for displaying and managing WorkRequest data using HcclService
 * Extends AbstractListComponent for common grid functionality
 */

@Component({
  selector: 'app-workrequest-list',
  standalone: true,
  templateUrl: '../../_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../_global/abstract-list/abstract-list.component.scss'],
    imports: [CommonModule]
})
export class WorkRequestListComponent extends AbstractListComponent<WorkRequestGETData, WorkRequestCriteria, WorkRequestGETDataSearchResults> {
  
  constructor(   
  ) {
    super();
    
    // Set entity-specific properties
    this.searchHeading = 'Work Requests';
    this.showingAddButton = true;
    this.showingIdCheckbox = true;
    //this.searchPlaceholder = ...
  }

  protected getGridColumns(): any[] {
    return [
      //{ id: 'id', header: [{ text: 'ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'name', header: [{ text: 'Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'businessCode', header: [{ text: 'Business Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'description', header: [{ text: 'Description', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'workRequestTypeCode', header: [{ text: 'Work Request Type', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'currentStateCode', header: [{ text: 'Current State Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'workQueueCode', header: [{ text: 'Work Queue', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'createdByTeamId', header: [{ text: 'Created By Team ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'createdByUserId', header: [{ text: 'Created By User ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'acceptedByTeamId', header: [{ text: 'Accepted By Team ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'acceptedByUserId', header: [{ text: 'Accepted By User ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'subjectEntityId', header: [{ text: 'Subject Entity ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'subjectEntityType', header: [{ text: 'Subject Entity Type', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'subjectEntityName', header: [{ text: 'Subject Entity Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'parentWorkRequestItemId', header: [{ text: 'Parent Work Request Item ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 180, adjust: true },
//      { id: 'createdByInfo', header: [{ text: 'Created By', align: 'center' }], minWidth: 120, adjust: true },
  //    { id: 'dateCreated', header: [{ text: 'Date Created', align: 'center' }], minWidth: 120, adjust: true },
    //  { id: 'lastUpdatedByInfo', header: [{ text: 'Last Updated By', align: 'center' }], minWidth: 120, adjust: true },
      { id: 'dateLastUpdated', header: [{ text: 'Date Last Updated', align: 'center' }], minWidth: 120, adjust: true }
    ];
  }

  protected createCriteria(): WorkRequestCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected findEntities(criteria: WorkRequestCriteria): Observable<WorkRequestGETDataSearchResults> {
    return this.hcclService.findWorkRequests(criteria);
  }

  protected hasSearchResults(response: WorkRequestGETDataSearchResults): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(response: WorkRequestGETDataSearchResults): WorkRequestGETData[] {
    return response.searchResults || [];
  }

  protected override async formatEntityDataAsync(entity: WorkRequestGETData): Promise<any> {
    const typeName :string = entity.workQueueId  == null ? 'unknown' : 
       (await WorkQueueCrudWrapper.newInstance(entity.workQueueId , this.hcclService)).getDisplayText();

    const typeName2 :string = entity.workRequestTypeId  == null ? 'unknown' : 
       (await WorkRequestTypeCrudWrapper.newInstance(entity.workRequestTypeId , this.hcclService)).getDisplayText();
       
    return {
      workQueueCode: typeName,
      workRequestTypeCode: typeName2,
      createdByInfo: entity.createdByInfo?.name || '',
      lastUpdatedByInfo: entity.lastUpdatedByInfo?.name || '',
      dateCreated: entity.dateCreated?.formattedDate || '',
      dateLastUpdated: entity.dateLastUpdated?.formattedDate || ''
    };
  }

} 