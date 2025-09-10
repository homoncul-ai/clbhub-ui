// This template is for generating a CRUD component for an entity that has a FK Menu
// This was generated using entityName = CatalogSearchResultEntry
// Generate the new [entityName]-crud.component.ts   files using this template
// Of course, the code related to the attribtutes of the entity shoule be changed to match the entityName
// Review the HTML after the generation is complete and maker sure all the imports required are included.


import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, Validators } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { CatalogSearchResultEntryCriteria, CatalogSearchResultEntryGETData, CatalogSearchResultEntryPOSTData, CatalogSearchResultEntryPUTData, HcclService, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { Observable, map } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';
import { ReferenceDataComponent } from '@app/components/_global/reference-data/reference-data.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';

// Import are all the FK Menus for the UI to use <app-entityNameFk-crud>
import { CatalogEntryCrudComponent } from '@app/components/_crud/catalogentry/catalogentry-crud.component';
import { CatalogCrudComponent } from '@app/components/_crud/catalog/catalog-crud.component';

@Component({
  selector: 'app-catalogsearchresultentry-crud',
  templateUrl: './catalogsearchresultentry-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule,
    StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    DategetdataDisplayComponent, ReferenceDataComponent, 
    CatalogEntryCrudComponent, CatalogCrudComponent],
  standalone: true
})
export class CatalogSearchResultEntryCrudComponent extends AbstractCrudComponent<CatalogSearchResultEntryCrudWrapper> implements OnInit, OnChanges {

  constructor() {
    super();
  }

  // Error property for form validation
  public error: any = null;

  // Validation methods
  private validateCatalogSearchResultId(catalogSearchResultId: string): string | null {
    if (!catalogSearchResultId || catalogSearchResultId.trim() === '') {
      return 'Catalog Search Result is required';
    }
    return null;
  }

  private validateCatalogEntryId(catalogEntryId: string): string | null {
    if (!catalogEntryId || catalogEntryId.trim() === '') {
      return 'Catalog Entry is required';
    }
    return null;
  }

  private validateCatalogId(catalogId: string): string | null {
    if (!catalogId || catalogId.trim() === '') {
      return 'Catalog is required';
    }
    return null;
  }

  private validateComments(comments: string): string | null {
    if (comments && comments.length > 1024) {
      return 'Comments must be less than 1024 characters';
    }
    return null;
  }

  // Validate all fields and return error object
  private validateForm(): any {
    const errors: any = {};
    
    const catalogSearchResultIdError = this.validateCatalogSearchResultId(this.catalogSearchResultId);
    if (catalogSearchResultIdError) {
      errors.catalogSearchResultId = { errorMessage: catalogSearchResultIdError };
    }
    
    const catalogEntryIdError = this.validateCatalogEntryId(this.catalogEntryId);
    if (catalogEntryIdError) {
      errors.catalogEntryId = { errorMessage: catalogEntryIdError };
    }
    
    const catalogIdError = this.validateCatalogId(this.catalogId);
    if (catalogIdError) {
      errors.catalogId = { errorMessage: catalogIdError };
    }
    
    const commentsError = this.validateComments(this.comments);
    if (commentsError) {
      errors.comments = { errorMessage: commentsError };
    }
    
    return errors;
  }

  private clearValidationErrors(): void {
    this.error = null;
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected async loadEntityByIdCall(id: string): Promise<CatalogSearchResultEntryCrudWrapper> {
    const catalogsearchresultentry = await this.hcclService.getCatalogSearchResultEntryById(id).toPromise();
    if (!catalogsearchresultentry) {
      throw new Error('CatalogSearchResultEntry not found');
    }
    return new CatalogSearchResultEntryCrudWrapper(catalogsearchresultentry, this.hcclService);
  }

  protected override async createEntityDataCall(entity: CatalogSearchResultEntryCrudWrapper): Promise<any> {
    const postData: CatalogSearchResultEntryPOSTData = {
      catalogSearchResultId: entity.getData().catalogSearchResultId || '',
      catalogEntryId: entity.getData().catalogEntryId || '',
      catalogId: entity.getData().catalogId || '',
      comments: entity.getData().comments || ''
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    // This is important - the requestCreate method returns { id: string, status: 201 }
    try {
      // The requestCreate method returns { id: string, status: 201 }
      const response = await this.hcclService.createCatalogSearchResultEntry(postData);
      console.log('Create response:', response);
      this.clearValidationErrors(); // Clear errors on success
      return response;
    } catch (error) {
      console.error('Create error:', error);
      throw error;
    }

  }

  protected override async updateEntityDataCall(entity: CatalogSearchResultEntryCrudWrapper): Promise<void> {
    const putData: CatalogSearchResultEntryPUTData = {
      catalogSearchResultId: entity.getData().catalogSearchResultId || '',
      catalogEntryId: entity.getData().catalogEntryId || '',
      catalogId: entity.getData().catalogId || '',
      comments: entity.getData().comments || ''
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    await this.hcclService.updateCatalogSearchResultEntryById(entity.getData().id!, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteCatalogSearchResultEntryById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting CatalogSearchResultEntry:', error);
      return false;
    }
  }

  public override newEmptyWrapper(): CatalogSearchResultEntryCrudWrapper {
    return CatalogSearchResultEntryCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  // Getter and setter methods for form binding
  public get catalogSearchResultId(): string {
    return this.getCurrentEntity()?.getData()?.catalogSearchResultId || '';
  }

  public set catalogSearchResultId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().catalogSearchResultId = value;
    }
  }

  public get catalogEntryId(): string {
    return this.getCurrentEntity()?.getData()?.catalogEntryId || '';
  }

  public set catalogEntryId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().catalogEntryId = value;
    }
  }

  public get catalogId(): string {
    return this.getCurrentEntity()?.getData()?.catalogId || '';
  }

  public set catalogId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().catalogId = value;
    }
  }

  public get comments(): string {
    return this.getCurrentEntity()?.getData()?.comments || '';
  }

  public set comments(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().comments = value;
    }
  }

  public createWrapper(catalogsearchresultentryData: CatalogSearchResultEntryGETData): CatalogSearchResultEntryCrudWrapper {
    return new CatalogSearchResultEntryCrudWrapper(catalogsearchresultentryData, this.hcclService);
  }

  getCatalogSearchResultEntryFkMenuCriteria(): CatalogSearchResultEntryCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected catalogsearchresultentryMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: CatalogSearchResultEntryCrudWrapper): Promise<void> {
    const criteria = this.getCatalogSearchResultEntryFkMenuCriteria();
    const results = await this.hcclService.findCatalogSearchResultEntrys(criteria).toPromise();
    this.catalogsearchresultentryMenu = await entity.getFkMenu("catalogsearchresultentries", this.id);
  }
}

export class CatalogSearchResultEntryCrudWrapper extends EntityWrapper<CatalogSearchResultEntryGETData> {

  public static newInstanceForCreate(hcclService: HcclService, entityIn?: CatalogSearchResultEntryGETData | null): CatalogSearchResultEntryCrudWrapper {
    const emptyData: CatalogSearchResultEntryGETData = {
      catalogSearchResultId: '',
      catalogEntryId: '',
      catalogId: '',
      comments: ''
    };
    return new CatalogSearchResultEntryCrudWrapper(entityIn || emptyData, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<CatalogSearchResultEntryCrudWrapper> {
    const data = await hcclService.getCatalogSearchResultEntryById(id).toPromise();
    if (!data) {
      throw new Error('CatalogSearchResultEntry not found');
    }
    return new CatalogSearchResultEntryCrudWrapper(data, hcclService);
  }

  constructor(data: CatalogSearchResultEntryGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  getDisplayText(entity?: CatalogSearchResultEntryGETData): string {
    const data = entity || this.getData();
    if (data.comments) {
      return data.comments;
    }
    if (data.catalogSearchResultId) {
      return 'Catalog Search Result Entry: ' + data.catalogSearchResultId;
    }
    return data.id || 'Unknown CatalogSearchResultEntry';
  }

  getCatalogSearchResultId(): string {
    return this.getData().catalogSearchResultId || '';
  }

  getCatalogEntryId(): string {
    return this.getData().catalogEntryId || '';
  }

  getCatalogId(): string {
    return this.getData().catalogId || '';
  }

  getComments(): string {
    return this.getData().comments || '';
  }

  getFkMenuCriteria(): CatalogSearchResultEntryCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  async getCatalogSearchResultEntries(criteria?: CatalogSearchResultEntryCriteria): Promise<CatalogSearchResultEntryGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const results = await this.hcclService.findCatalogSearchResultEntrys(criteria || this.getFkMenuCriteria()).toPromise();
    return results?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const catalogsearchresultentries = await this.getCatalogSearchResultEntries();
    return this.getMenuControlDataList("catalogsearchresultentries", this.getEntityType() + " Menu", catalogsearchresultentries, data);
  }
} 