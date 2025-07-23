import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, Validators } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { CatalogCriteria, CatalogGETData, CatalogPOSTData, CatalogPUTData, HcclService, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { Observable, map } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';

@Component({
  selector: 'app-catalog-crud',
  templateUrl: './catalog-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule, 
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent],
  standalone: true
})
export class CatalogCrudComponent extends AbstractCrudComponent<CatalogCrudWrapper> implements OnInit, OnChanges {
/**
 * This is a component that will be used to create, read, update and delete Catalog data
 * It will use the AbstractCrudComponent to handle the CRUD operations
 * It will use the CatalogGETData and CatalogPOSTData interfaces to handle the data
 * It will use the HcclService to handle the data
 * 
 * Input parameter:
 * - id?: string - Optional Catalog ID to load a specific Catalog for viewing/editing
 * 
 * If no ID is provided, the component will load the full list of Catalogs.
 * If an ID is provided, the component will load that specific Catalog and show it in detail mode.
 * 
 * Create a wrapper class that extends EntityWrapper<CatalogGETData>
 * and implement the abstract methods of the AbstractCrudComponent
 */

  
  constructor() {
    super();
  }

  // Error property for form validation
  public error: any = null;

  // Validation methods
  private validateName(name: string): string | null {
    if (!name || name.trim() === '') {
      return 'Name is required';
    }
    if (name.length > 255) {
      return 'Name must be less than 255 characters';
    }
    return null;
  }

  private validateBusinessCode(businessCode: string): string | null {
    if (!businessCode || businessCode.trim() === '') {
      return 'Business Code is required';
    }
    if (businessCode.length > 255) {
      return 'Business Code must be less than 255 characters';
    }
    return null;
  }

  private validateDescription(description: string): string | null {
    if (!description || description.trim() === '') {
      return 'Description is required';
    }
    if (description.length > 1024) {
      return 'Description must be less than 1024 characters';
    }
    return null;
  }

  // Validate all fields and return error object
  private validateForm(): any {
    const errors: any = {};
    
    const nameError = this.validateName(this.name);
    if (nameError) {
      errors.name = { errorMessage: nameError };
    }
    
    const businessCodeError = this.validateBusinessCode(this.businessCode);
    if (businessCodeError) {
      errors.businessCode = { errorMessage: businessCodeError };
    }
    
    const descriptionError = this.validateDescription(this.description);
    if (descriptionError) {
      errors.description = { errorMessage: descriptionError };
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  }

  private clearValidationErrors(): void {
    this.error = null;
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected async loadEntityByIdCall(id: string): Promise<CatalogCrudWrapper> {
    const data = await this.hcclService.getCatalogById(id).toPromise();
    if (!data) {
      throw new Error('Catalog not found');
    }
    return new CatalogCrudWrapper(data, this.hcclService);
  }

  protected override async createEntityDataCall(entity: CatalogCrudWrapper): Promise<any> {
    const postData: CatalogPOSTData = {
      organizationId: entity.organizationId,
      name: entity.name,
      businessCode: entity.businessCode,
      description: entity.description,
      available: entity.available,
      taxonomyEntryId: entity.taxonomyEntryId,
      urlPrefix: entity.urlPrefix,
      url: entity.url
    };
    
    return await this.hcclService.createCatalog(postData).toPromise();
  }

  protected override async updateEntityDataCall(entity: CatalogCrudWrapper): Promise<void> {
    const putData: CatalogPUTData = {
      organizationId: entity.organizationId,
      name: entity.name,
      businessCode: entity.businessCode,
      description: entity.description,
      available: entity.available,
      taxonomyEntryId: entity.taxonomyEntryId,
      urlPrefix: entity.urlPrefix,
      url: entity.url
    };
    
    await this.hcclService.updateCatalogById(entity.id!, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteCatalogById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting Catalog:', error);
      return false;
    }
  }

  public override newEmptyWrapper(): CatalogCrudWrapper {
    return CatalogCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  public get name(): string {
    return this.entity?.name || '';
  }

  public set name(value: string) {
    if (this.entity) {
      this.entity.name = value;
    }
  }

  public get businessCode(): string {
    return this.entity?.businessCode || '';
  }

  public set businessCode(value: string) {
    if (this.entity) {
      this.entity.businessCode = value;
    }
  }

  public get description(): string {
    return this.entity?.description || '';
  }

  public set description(value: string) {
    if (this.entity) {
      this.entity.description = value;
    }
  }

  public get available(): number {
    return this.entity?.available || 0;
  }

  public set available(value: number) {
    if (this.entity) {
      this.entity.available = value;
    }
  }

  public get organizationId(): string {
    return this.entity?.organizationId || '';
  }

  public set organizationId(value: string) {
    if (this.entity) {
      this.entity.organizationId = value;
    }
  }

  public get taxonomyEntryId(): string {
    return this.entity?.taxonomyEntryId || '';
  }

  public set taxonomyEntryId(value: string) {
    if (this.entity) {
      this.entity.taxonomyEntryId = value;
    }
  }

  public get urlPrefix(): string {
    return this.entity?.urlPrefix || '';
  }

  public set urlPrefix(value: string) {
    if (this.entity) {
      this.entity.urlPrefix = value;
    }
  }

  public get url(): string {
    return this.entity?.url || '';
  }

  public set url(value: string) {
    if (this.entity) {
      this.entity.url = value;
    }
  }

  public createWrapper(catalogData: CatalogGETData): CatalogCrudWrapper {
    return new CatalogCrudWrapper(catalogData, this.hcclService);
  }

  getCatalogFkMenuCriteria(): CatalogCriteria {
    return {
      available: 1
    };
  }

  protected catalogMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: CatalogCrudWrapper): Promise<void> {
    // Prepare FK menus if needed
  }
}

export class CatalogCrudWrapper extends EntityWrapper<CatalogGETData> {

  public static newInstanceForCreate(hcclService: HcclService, entityIn?: CatalogGETData | null): CatalogCrudWrapper {
    const emptyData: CatalogGETData = {
      id: '',
      organizationId: '',
      name: '',
      businessCode: '',
      description: '',
      available: 1,
      taxonomyEntryId: '',
      urlPrefix: '',
      url: ''
    };
    return new CatalogCrudWrapper(entityIn || emptyData, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<CatalogCrudWrapper> {
    const catalog = await hcclService.getCatalogById(id).toPromise();
    if (catalog) {
      return new CatalogCrudWrapper(catalog, hcclService);
    }
    throw new Error('Catalog not found');
  }

  constructor(data: CatalogGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  // Properties for form binding
  get organizationId(): string {
    return this.data.organizationId || '';
  }

  set organizationId(value: string) {
    this.data.organizationId = value;
  }

  get name(): string {
    return this.data.name || '';
  }

  set name(value: string) {
    this.data.name = value;
  }

  get businessCode(): string {
    return this.data.businessCode || '';
  }

  set businessCode(value: string) {
    this.data.businessCode = value;
  }

  get description(): string {
    return this.data.description || '';
  }

  set description(value: string) {
    this.data.description = value;
  }

  get available(): number {
    return this.data.available || 0;
  }

  set available(value: number) {
    this.data.available = value;
  }

  get taxonomyEntryId(): string {
    return this.data.taxonomyEntryId || '';
  }

  set taxonomyEntryId(value: string) {
    this.data.taxonomyEntryId = value;
  }

  get urlPrefix(): string {
    return this.data.urlPrefix || '';
  }

  set urlPrefix(value: string) {
    this.data.urlPrefix = value;
  }

  get url(): string {
    return this.data.url || '';
  }

  set url(value: string) {
    this.data.url = value;
  }

  get id(): string {
    return this.data.id || '';
  }

  set id(value: string) {
    this.data.id = value;
  }

  getDisplayText(entity?: CatalogGETData): string {
    const targetEntity: CatalogGETData = entity ? entity : (this.data || {});
    return targetEntity.name || targetEntity.businessCode || 'Catalog';
  }

  getFullName(): string {
    return this.data.name || '';
  }

  getBusinessCode(): string {
    return this.data.businessCode || '';
  }

  getDescription(): string {
    return this.data.description || '';
  }

  getAvailable(): number {
    return this.data.available || 0;
  }

  isActive(): boolean {
    return this.data.available === 1;
  }

  getFkMenuCriteria(): CatalogCriteria {
    return {
      available: 1
    };
  }

  async getCatalogs(criteria?: CatalogCriteria): Promise<CatalogGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const results = await this.hcclService.findCatalogs(criteria || this.getFkMenuCriteria()).toPromise();
    return results?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    
    const catalogs = await this.getCatalogs();
    const menuItems: MenuControlData[] = catalogs.map(catalog => ({
      id: catalog.id || '',
      name: catalog.name || catalog.businessCode || 'Catalog'
    }));
    
    return {
      menuItems: menuItems
    };
  }
} 