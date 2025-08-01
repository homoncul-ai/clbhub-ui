import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclOrganizationGETData, HcclService } from '../../../restsvc/hccl.service';
import { WorkQueueGETData, WorkQueueCriteria, WorkQueueGETDataSearchResults } from '../../../restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { Observable } from 'rxjs';

/**
 * Component for displaying and managing WorkQueue data using HcclService
 * Extends AbstractListComponent for common grid functionality
 */

@Component({
  selector: 'app-provider-workqueue-list',
  standalone: true,
  templateUrl: '../../_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../_global/abstract-list/abstract-list.component.scss'],
    imports: [CommonModule]
})
export class ProviderWorkQueueListComponent extends AbstractListComponent<WorkQueueGETData, WorkQueueCriteria, WorkQueueGETDataSearchResults> {
  
  constructor(   
  ) {
    super();
    
    // Set entity-specific properties
    this.searchHeading = 'Provider Queues';
    this.showingAddButton = true;
    this.showingIdCheckbox = true;
    //this.searchPlaceholder = ...
  }

  protected getGridColumns(): any[] {
    return [
      //{ id: 'id', header: [{ text: 'ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'orgName', header: [{ text: 'Provider', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'workQueueTypeName', header: [{ text: 'Queue Type', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'organizationId', header: [{ text: 'Provider', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'name', header: [{ text: 'Name', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'businessCode', header: [{ text: 'Business Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'description', header: [{ text: 'Description', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'prefixCode', header: [{ text: 'Prefix Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
 //     { id: 'workQueueTypeId', header: [{ text: 'Work Queue Type ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
  //    { id: 'workQueueTeamId', header: [{ text: 'Work Queue Team ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
  //    { id: 'available', header: [{ text: 'Available', align: 'center' }, { content: 'inputFilter' }], minWidth: 100, adjust: true },
      { id: 'externalQueue', header: [{ text: 'External Queue', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
//      { id: 'createdByInfo', header: [{ text: 'Created By', align: 'center' }], minWidth: 120, adjust: true },
  //    { id: 'dateCreated', header: [{ text: 'Date Created', align: 'center' }], minWidth: 120, adjust: true },
    //  { id: 'lastUpdatedByInfo', header: [{ text: 'Last Updated By', align: 'center' }], minWidth: 120, adjust: true },
      { id: 'dateLastUpdated', header: [{ text: 'Date Last Updated', align: 'center' }], minWidth: 120, adjust: true }
    ];
  }

  protected createCriteria(): WorkQueueCriteria {
    return {
      externalQueue: 1,
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected findEntities(criteria: WorkQueueCriteria): Observable<WorkQueueGETDataSearchResults> {
    return this.hcclService.findWorkQueues(criteria);
  }

  protected hasSearchResults(response: WorkQueueGETDataSearchResults): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(response: WorkQueueGETDataSearchResults): WorkQueueGETData[] {
    return response.searchResults || [];
  }

  protected override async formatEntityDataAsync(entity: WorkQueueGETData): Promise<any> {
     var org  =  await this.hcclService.getHcclOrganizationById(entity?.organizationId || '').toPromise();
     var orgName = org?.name || '';
     var workQueueType = await this.hcclService.getWorkQueueTypeRefById(entity?.workQueueTypeId || '').toPromise();
     var workQueueTypeName = workQueueType?.name || '';
    return {
      createdByInfo: entity.createdByInfo?.name || '',
      lastUpdatedByInfo: entity.lastUpdatedByInfo?.name || '',
      dateCreated: entity.dateCreated?.formattedDate || '',
      dateLastUpdated: entity.dateLastUpdated?.formattedDate || '',
      orgName: orgName,
      workQueueTypeName: workQueueTypeName
    };
    
    
  }

} 