// This template is for generating a LIST component for an entity that has a FK Menu
// This was generated using entityName = CatalogEntryInterest
// Generate the new catalogentryinterest-list.component.ts   files using this template
// Of course, the code related to the attributes of the entity in the grid should be changed to match the entityName's attributes


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HcclService } from '../../../restsvc/hccl.service';
import { CatalogEntryInterestGETData, CatalogEntryInterestCriteria, CatalogEntryInterestGETDataSearchResults } from '../../../restsvc/hccl.service';
import { AbstractListComponent } from '@app/components/_global/abstract-list/abstract-list.component';
import { Observable } from 'rxjs';
import { CatalogCrudWrapper } from '@app/components/_crud/catalog/catalog-crud.component';
import { CatalogEntryCrudWrapper } from '@app/components/_crud/catalogentry/catalogentry-crud.component';
import { PersonalStatementCrudWrapper } from '@app/components/_crud/personalstatement/personalstatement-crud.component';
import { HcclUserProfileCrudWrapper } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { HcclOrganizationCrudWrapper } from '../hcclorganization/hcclorganization-crud.component';

/**
 * Component for displaying and managing CatalogEntryInterest data using HcclService
 * Extends AbstractListComponent for common grid functionality
 */

@Component({
  selector: 'app-catalogentryinterest-list',
  standalone: true,
  templateUrl: '../../_global/abstract-list/abstract-list.component.html',
  styleUrls: ['../../_global/abstract-list/abstract-list.component.scss'],
    imports: [CommonModule]
})
export class CatalogEntryInterestListComponent extends AbstractListComponent<CatalogEntryInterestGETData, CatalogEntryInterestCriteria, CatalogEntryInterestGETDataSearchResults> {
  
  constructor(   
  ) {
    super();
    
    // Set entity-specific properties
    this.searchHeading = 'Catalog Entry Interests';
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
      { id: 'interest', header: [{ text: 'Interest Level', align: 'center' }, { content: 'inputFilter' }], minWidth: 120, adjust: true },
      { id: 'orgStr', header: [{ text: 'Provider', align: 'center' }, { content: 'inputFilter' }], minWidth: 200, adjust: true },

      // Replace [prefix]Id with the displaytext of the crudwrapper - named [prefix]Str instead of [prefix]Id
      //{ id: 'catalogStr', header: [{ text: 'Catalog', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'catalogEntryStr', header: [{ text: 'Catalog Entry', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      { id: 'currentStateCode', header: [{ text: 'Current State', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      //{ id: 'personalStatementStr', header: [{ text: 'Personal Statement', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },
      //{ id: 'userProfileStr', header: [{ text: 'User Profile', align: 'center' }, { content: 'inputFilter' }], minWidth: 150, adjust: true },

      // Commented out for now - not sure if we want to show this
//      { id: 'createdByInfo', header: [{ text: 'Created By', align: 'center' }], minWidth: 120, adjust: true },
  //    { id: 'dateCreated', header: [{ text: 'Date Created', align: 'center' }], minWidth: 120, adjust: true },
    //  { id: 'lastUpdatedByInfo', header: [{ text: 'Last Updated By', align: 'center' }], minWidth: 120, adjust: true },
      { id: 'dateLastUpdated', header: [{ text: 'Date Last Updated', align: 'center' }], minWidth: 120, adjust: true }
    ];
  }

  protected createCriteria(): CatalogEntryInterestCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected findEntities(criteria: CatalogEntryInterestCriteria): Observable<CatalogEntryInterestGETDataSearchResults> {
    return this.hcclService.findCatalogEntryInterests(criteria);
  }

  protected hasSearchResults(response: CatalogEntryInterestGETDataSearchResults): boolean {
    return !!response.searchResults;
  }

  protected getSearchResults(response: CatalogEntryInterestGETDataSearchResults): CatalogEntryInterestGETData[] {
    return response.searchResults || [];
  }

  /**
   * Special attributes in the grid.  FK info needs to be added here.
   * @param entity 
   * @returns 
   */
  protected override async formatEntityDataAsync(entity: CatalogEntryInterestGETData): Promise<any> {
    // Every attribute of the form [prefix]Id is an "foreign key" and should be replaced with the displaytext of the crudwrapper
  
    const catalogWrapper = entity.catalogId == null ? null : 
    (await CatalogCrudWrapper.newInstance(entity.catalogId, this.hcclService));

    var wrapper: CatalogCrudWrapper | null = catalogWrapper;
    var orgStr: string = wrapper?.theOrganization?.name || '';
    if (orgStr.length == 0) {
      orgStr = (await HcclOrganizationCrudWrapper.newInstance(wrapper?.organizationId || '', this.hcclService)).getDisplayText() ||  ' unknown';
      
    }



    const catalogStr: string = wrapper?.getDisplayText() || ' unknown';

    const catalogEntryStr: string = entity.catalogEntryId == null ? 'unknown' : 
    (await CatalogEntryCrudWrapper.newInstance(entity.catalogEntryId, this.hcclService)).getDisplayText();

    const personalStatementStr: string = entity.personalStatementId == null ? 'unknown' : 
       (await PersonalStatementCrudWrapper.newInstance(entity.personalStatementId, this.hcclService)).getDisplayText();

    const userProfileStr: string = entity.userProfileId == null ? 'unknown' : 
       (await HcclUserProfileCrudWrapper.newInstance(entity.userProfileId, this.hcclService)).getDisplayText();

      return {
        createdByInfo: entity.createdByInfo?.name || '',
        lastUpdatedByInfo: entity.lastUpdatedByInfo?.name || '',
        dateCreated: entity.dateCreated?.formattedDate || '',
        dateLastUpdated: entity.dateLastUpdated?.formattedDate || '',
        catalogStr: catalogStr,
        catalogEntryStr: catalogEntryStr,
        orgStr: orgStr,
        personalStatementStr: personalStatementStr,
        userProfileStr: userProfileStr
      };
    }
  }



