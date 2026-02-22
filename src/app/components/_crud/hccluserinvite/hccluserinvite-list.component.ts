import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HcclService,
  HcclUserInviteGETData,
  HcclUserInviteCriteria,
  HcclUserInviteGETDataSearchResults
} from '@app/restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-hccluserinvite-list',
  standalone: true,
  templateUrl: '../../_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../_global/abstract-list/abstract-list.component.scss'],
  imports: [CommonModule]
})
export class HcclUserInviteListComponent extends AbstractListComponent<
  HcclUserInviteGETData,
  HcclUserInviteCriteria,
  HcclUserInviteGETDataSearchResults
> {
  constructor() {
    super();
    this.searchHeading = 'Hccl User Invites';
    this.showingAddButton = true;
    this.showingIdCheckbox = true;
  }

  protected getGridColumns(): any[] {
    return [
      { id: 'id', header: [{ text: 'ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'emailAddress', header: [{ text: 'Email', align: 'center' }, { content: 'inputFilter' }], minWidth: 220, adjust: true },
      { id: 'inviteCode', header: [{ text: 'Invite Code', align: 'center' }, { content: 'inputFilter' }], minWidth: 160, adjust: true },
      { id: 'organizationId', header: [{ text: 'Organization ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 180, adjust: true },
 //     { id: 'teamId', header: [{ text: 'Team ID', align: 'center' }, { content: 'inputFilter' }], minWidth: 180, adjust: true },
      { id: 'currentStateCode', header: [{ text: 'Current State', align: 'center' }, { content: 'inputFilter' }], minWidth: 140, adjust: true },
      { id: 'available', header: [{ text: 'Available', align: 'center' }, { content: 'selectFilter' }], minWidth: 110, adjust: true },
      { id: 'dateExpires', header: [{ text: 'Date Expires', align: 'center' }], minWidth: 150, adjust: true }
    ];
  }

  protected createCriteria(): HcclUserInviteCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected findEntities(criteria: HcclUserInviteCriteria): Observable<HcclUserInviteGETDataSearchResults> {
    return this.hcclService.findHcclUserInvites(criteria);
  }

  protected hasSearchResults(response: HcclUserInviteGETDataSearchResults): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(response: HcclUserInviteGETDataSearchResults): HcclUserInviteGETData[] {
    return response.searchResults || [];
  }

  protected override async formatEntityDataAsync(entity: HcclUserInviteGETData): Promise<any> {
    return {
      available: entity.available ?? '',
      createdByInfo: entity.createdByInfo?.name || '',
      lastUpdatedByInfo: entity.lastUpdatedByInfo?.name || '',
      dateCreated: entity.dateCreated?.formattedDate || '',
      dateLastUpdated: entity.dateLastUpdated?.formattedDate || '',
    //  dateExpires: entity.dateExpires?.formattedDate || ''
    };
  }

  protected override formatEntityData(entity: HcclUserInviteGETData): any {
    return {
      createdByInfo: entity.createdByInfo?.name || '',
      lastUpdatedByInfo: entity.lastUpdatedByInfo?.name || '',
      dateCreated: entity.dateCreated?.formattedDate || '',
      dateLastUpdated: entity.dateLastUpdated?.formattedDate || '',
  //    dateExpires: entity.dateExpires?.formattedDate || ''
    };
  }
}
