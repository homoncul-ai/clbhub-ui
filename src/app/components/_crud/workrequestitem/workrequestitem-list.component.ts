import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractListComponent } from '../../_global/abstract-list/abstract-list.component';
import { WorkRequestItemGETData, WorkRequestItemCriteria, WorkRequestItemGETDataSearchResults, HcclService } from '../../../restsvc/hccl.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-workrequestitem-list',
  templateUrl: '../../_global/abstract-list/abstract-list.component.html',
  styleUrl: '../../_global/abstract-list/abstract-list.component.scss',
  imports: [CommonModule],
  standalone: true
})
export class WorkRequestItemListComponent extends AbstractListComponent<WorkRequestItemGETData, WorkRequestItemCriteria, WorkRequestItemGETDataSearchResults> {
  constructor() {
    super();
  }

  protected getGridColumns(): any[] {
    return [
      { id: 'workRequestId', header: [{ text: 'Work Request ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'nameText', header: [{ text: 'Name Text', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'businessCode', header: [{ text: 'Business Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'sequenceOrder', header: [{ text: 'Sequence Order', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'description', header: [{ text: 'Description', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },
      { id: 'acceptedByUserId', header: [{ text: 'Accepted By User ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'roleCode', header: [{ text: 'Role Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'actionCode', header: [{ text: 'Action Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'currentStateCode', header: [{ text: 'Current State Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'currentStateTransitionId', header: [{ text: 'Current State Transition ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 180, adjust: true },
      { id: 'dateLastUpdated', header: [{ text: 'Date Last Updated', align: 'center' }], minWidth: 120, adjust: true }
    ];
  }

  protected createCriteria(): WorkRequestItemCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true,
      searchByText: ''
    };
  }

  protected findEntities(criteria: WorkRequestItemCriteria): Observable<WorkRequestItemGETDataSearchResults> {
    return this.hcclService.findWorkRequestItems(criteria);
  }

  protected hasSearchResults(response: WorkRequestItemGETDataSearchResults): boolean {
    return response.searchResults !== undefined && response.searchResults.length > 0;
  }

  protected getSearchResults(response: WorkRequestItemGETDataSearchResults): WorkRequestItemGETData[] {
    return response.searchResults || [];
  }

  protected override formatEntityData(data: WorkRequestItemGETData): any {
    return {
      id: data.id,
      workRequestId: data.workRequestId,
      nameText: data.nameText,
      businessCode: data.businessCode,
      sequenceOrder: data.sequenceOrder,
      description: data.description,
      acceptedByUserId: data.acceptedByUserId,
      roleCode: data.roleCode,
      actionCode: data.actionCode,
      currentStateCode: data.currentStateCode,
      currentStateTransitionId: data.currentStateTransitionId,
      dateLastUpdated: data.dateLastUpdated
    };
  }

  protected getEntityType(): string {
    return 'WorkRequestItem';
  }

  protected override getBaseRoute(): string {
    return '/ecoadmin-dashboard/workrequestitems';
  }
} 