// This template is for generating a CRUD component for an entity that has a FK Menu
// This was generated using entityName = CatalogSearchResult
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
import { CatalogSearchResultCriteria, CatalogSearchResultGETData, CatalogSearchResultPOSTData, CatalogSearchResultPUTData, HcclService, MenuControlDataList, MenuControlData, CatalogSearchResultEntryGETData } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { Observable, map } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';
import { ReferenceDataComponent } from '@app/components/_global/reference-data/reference-data.component';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';

// Import are all the FK Menus for the UI to use <app-entityNameFk-crud>
import { CatalogCrudComponent } from '@app/components/_crud/catalog/catalog-crud.component';
import { CatalogSearchResultEntryCrudComponent } from '../catalogsearchresultentry/catalogsearchresultentry-crud.component';

@Component({
  selector: 'app-catalogsearchresult-crud',
  templateUrl: './catalogsearchresult-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule,
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    DategetdataDisplayComponent, ReferenceDataComponent, CatalogCrudComponent, CatalogSearchResultEntryCrudComponent],
  standalone: true
})
export class CatalogSearchResultCrudComponent extends AbstractCrudComponent<CatalogSearchResultCrudWrapper> implements OnInit, OnChanges {

  constructor() {
    super();
  }

  // Error property for form validation
  public error: any = null;

  // Validation methods
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

  private validateSubjectEntityName(subjectEntityName: string): string | null {
    if (subjectEntityName && subjectEntityName.length > 255) {
      return 'Subject Entity Name must be less than 255 characters';
    }
    return null;
  }

  private validateSubjectEntityType(subjectEntityType: string): string | null {
    if (subjectEntityType && subjectEntityType.length > 50) {
      return 'Subject Entity Type must be less than 50 characters';
    }
    return null;
  }

  private validateParentWorkRequestItemId(parentWorkRequestItemId: string): string | null {
    if (parentWorkRequestItemId && parentWorkRequestItemId.length > 255) {
      return 'Parent Work Request Item ID must be less than 255 characters';
    }
    return null;
  }

  // Validate all fields and return error object
  private validateForm(): any {
    const errors: any = {};
    
    const catalogIdError = this.validateCatalogId(this.catalogId);
    if (catalogIdError) {
      errors.catalogId = { errorMessage: catalogIdError };
    }
    
    const commentsError = this.validateComments(this.comments);
    if (commentsError) {
      errors.comments = { errorMessage: commentsError };
    }
    
    const subjectEntityNameError = this.validateSubjectEntityName(this.subjectEntityName);
    if (subjectEntityNameError) {
      errors.subjectEntityName = { errorMessage: subjectEntityNameError };
    }
    
    const subjectEntityTypeError = this.validateSubjectEntityType(this.subjectEntityType);
    if (subjectEntityTypeError) {
      errors.subjectEntityType = { errorMessage: subjectEntityTypeError };
    }
    
    const parentWorkRequestItemIdError = this.validateParentWorkRequestItemId(this.parentWorkRequestItemId);
    if (parentWorkRequestItemIdError) {
      errors.parentWorkRequestItemId = { errorMessage: parentWorkRequestItemIdError };
    }
    
    return errors;
  }

  private clearValidationErrors(): void {
    this.error = null;
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected catalogSearchResultEntries: CatalogSearchResultEntryGETData[] = [];
  protected async loadEntityByIdCall(id: string): Promise<CatalogSearchResultCrudWrapper> {
    const catalogsearchresult = await this.hcclService.getCatalogSearchResultById(id).toPromise();
    if (!catalogsearchresult) {
      throw new Error('CatalogSearchResult not found');
    }

    return new CatalogSearchResultCrudWrapper(catalogsearchresult, this.hcclService);
  }

  protected override async createEntityDataCall(entity: CatalogSearchResultCrudWrapper): Promise<any> {
    const postData: CatalogSearchResultPOSTData = {
      catalogId: entity.getData().catalogId || '',
      comments: entity.getData().comments || '',
      subjectEntityId: entity.getData().subjectEntityId || '',
      subjectEntityType: entity.getData().subjectEntityType || '',
      subjectEntityName: entity.getData().subjectEntityName || '',
      parentWorkRequestItemId: entity.getData().parentWorkRequestItemId || ''
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    // This is important - the requestCreate method returns { id: string, status: 201 }
    try {
      // The requestCreate method returns { id: string, status: 201 }
      const response = await this.hcclService.createCatalogSearchResult(postData);
      console.log('Create response:', response);
      this.clearValidationErrors(); // Clear errors on success
      return response;
    } catch (error) {
      console.error('Create error:', error);
      throw error;
    }

  }
  getEntries(): CatalogSearchResultEntryGETData[] {
    return this.isLoading ? [] : this.getCurrentEntity()?.getData().entries || [];
  }

  protected override async updateEntityDataCall(entity: CatalogSearchResultCrudWrapper): Promise<void> {
    const putData: CatalogSearchResultPUTData = {
      catalogId: entity.getData().catalogId || '',
      comments: entity.getData().comments || '',
      subjectEntityId: entity.getData().subjectEntityId || '',
      subjectEntityType: entity.getData().subjectEntityType || '',
      subjectEntityName: entity.getData().subjectEntityName || '',
      parentWorkRequestItemId: entity.getData().parentWorkRequestItemId || ''
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    await this.hcclService.updateCatalogSearchResultById(entity.getData().id!, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteCatalogSearchResultById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting CatalogSearchResult:', error);
      return false;
    }
  }

  public override newEmptyWrapper(): CatalogSearchResultCrudWrapper {
    return CatalogSearchResultCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  // Getter and setter methods for form binding
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

  public get subjectEntityId(): string {
    return this.getCurrentEntity()?.getData()?.subjectEntityId || '';
  }

  public set subjectEntityId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().subjectEntityId = value;
    }
  }

  public get subjectEntityType(): string {
    return this.getCurrentEntity()?.getData()?.subjectEntityType || '';
  }

  public set subjectEntityType(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().subjectEntityType = value;
    }
  }

  public get subjectEntityName(): string {
    return this.getCurrentEntity()?.getData()?.subjectEntityName || '';
  }

  public set subjectEntityName(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().subjectEntityName = value;
    }
  }

  public get parentWorkRequestItemId(): string {
    return this.getCurrentEntity()?.getData()?.parentWorkRequestItemId || '';
  }

  public set parentWorkRequestItemId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().parentWorkRequestItemId = value;
    }
  }

  public createWrapper(catalogsearchresultData: CatalogSearchResultGETData): CatalogSearchResultCrudWrapper {
    return new CatalogSearchResultCrudWrapper(catalogsearchresultData, this.hcclService);
  }

  getCatalogSearchResultFkMenuCriteria(): CatalogSearchResultCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected catalogsearchresultMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: CatalogSearchResultCrudWrapper): Promise<void> {
    const criteria = this.getCatalogSearchResultFkMenuCriteria();
    const results = await this.hcclService.findCatalogSearchResults(criteria).toPromise();
    this.catalogsearchresultMenu = await entity.getFkMenu("catalogsearchresults", this.id);
  }
}

export class CatalogSearchResultCrudWrapper extends EntityWrapper<CatalogSearchResultGETData> {

  public static newInstanceForCreate(hcclService: HcclService, entityIn?: CatalogSearchResultGETData | null): CatalogSearchResultCrudWrapper {
    const emptyData: CatalogSearchResultGETData = {
      catalogId: '',
      comments: ''
    };
    return new CatalogSearchResultCrudWrapper(entityIn || emptyData, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<CatalogSearchResultCrudWrapper> {
    const data = await hcclService.getCatalogSearchResultById(id).toPromise();
    if (!data) {
      throw new Error('CatalogSearchResult not found');
    }
    return new CatalogSearchResultCrudWrapper(data, hcclService);
  }

  constructor(data: CatalogSearchResultGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  getDisplayText(entity?: CatalogSearchResultGETData): string {
    const data = entity || this.getData();
    if (data.comments) {
      return data.comments;
    }
    if (data.subjectEntityName) {
      return data.subjectEntityName;
    }
    return data.id || 'Unknown CatalogSearchResult';
  }

  getCatalogId(): string {
    return this.getData().catalogId || '';
  }

  getComments(): string {
    return this.getData().comments || '';
  }

  getSubjectEntityName(): string {
    return this.getData().subjectEntityName || '';
  }

  getSubjectEntityType(): string {
    return this.getData().subjectEntityType || '';
  }

  getParentWorkRequestItemId(): string {
    return this.getData().parentWorkRequestItemId || '';
  }

  getFkMenuCriteria(): CatalogSearchResultCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  async getCatalogSearchResults(criteria?: CatalogSearchResultCriteria): Promise<CatalogSearchResultGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const results = await this.hcclService.findCatalogSearchResults(criteria || this.getFkMenuCriteria()).toPromise();
    return results?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const catalogsearchresults = await this.getCatalogSearchResults();
    return this.getMenuControlDataList("catalogsearchresults", this.getEntityType() + " Menu", catalogsearchresults, data);
  }
} 