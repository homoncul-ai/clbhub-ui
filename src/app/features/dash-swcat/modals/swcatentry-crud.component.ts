import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, Validators } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { CatalogEntryCriteria, CatalogEntryGETData, CatalogEntryPOSTData, CatalogEntryPUTData, HcclService, MenuControlDataList, MenuControlData, SwWorkProductGETData } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { Observable, map } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';

@Component({
  selector: 'app-swcatentry-crud',
  templateUrl: './swcatentry-crud.component.html',
  styleUrl: '../../../components/_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule, 
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent],
  standalone: true
})
export class SwcatEntryCrudComponent extends AbstractCrudComponent<SwcatEntryCrudWrapper> implements OnInit, OnChanges {
/**
 * This is a component that will be used to create, read, update and delete SWCAT Entry
 * It will use the AbstractCrudComponent to handle the CRUD operations
 * It will use the CatalogEntryGETData and CatalogEntryPOSTData interfaces to handle the data
 * It will use the HcclService to handle the data
 * 
 * Input parameter:
 * - id?: string - Optional catalog entry ID to load a specific catalog entry for viewing/editing
 * 
 * If no ID is provided, the component will load the full list of catalog entries.
 * If an ID is provided, the component will load that specific catalog entry and show it in detail mode.
 * 
 * Create a wrapper class that extends EntityWrapper<CatalogEntryGETData>
 * and implement the abstract methods of the AbstractCrudComponent
 */

  
  constructor() {
    super();
  }

  // Error property for form validation
  public error: any = null;

  // Validation methods
  private validateEntryCode(entryCode: string): string | null {
    if (!entryCode || entryCode.trim() === '') {
      return 'Entry Code is required';
    }
    if (entryCode.length > 50) {
      return 'Entry Code must be less than 50 characters';
    }
    return null;
  }

  private validateTitle(title: string): string | null {
    if (!title || title.trim() === '') {
      return 'Title is required';
    }
    if (title.length > 255) {
      return 'Title must be less than 255 characters';
    }
    return null;
  }

  private validateShortDescription(shortDescription: string): string | null {
    if (!shortDescription || shortDescription.trim() === '') {
      return 'Short Description is required';
    }
    if (shortDescription.length > 1024) {
      return 'Short Description must be less than 1024 characters';
    }
    return null;
  }

  private validateDescription(description: string): string | null {
    if (!description || description.trim() === '') {
      return 'Description is required';
    }
    return null;
  }

  private validateIntegrationEntityType(integrationEntityType: string): string | null {
    if (integrationEntityType && integrationEntityType.length > 50) {
      return 'Integration Entity Type must be less than 50 characters';
    }
    return null;
  }

  private validateIntegrationEntityName(integrationEntityName: string): string | null {
    if (integrationEntityName && integrationEntityName.length > 255) {
      return 'Integration Entity Name must be less than 255 characters';
    }
    return null;
  }

  // Validate all fields and return error object
  private validateForm(): any {
    const errors: any = {};
    
    const entryCodeError = this.validateEntryCode(this.entryCode);
    if (entryCodeError) {
      errors.entryCode = { errorMessage: entryCodeError };
    }
    
    const titleError = this.validateTitle(this.title);
    if (titleError) {
      errors.title = { errorMessage: titleError };
    }
    
    const shortDescriptionError = this.validateShortDescription(this.shortDescription);
    if (shortDescriptionError) {
      errors.shortDescription = { errorMessage: shortDescriptionError };
    }
    
    const descriptionError = this.validateDescription(this.description);
    if (descriptionError) {
      errors.description = { errorMessage: descriptionError };
    }
    
    const integrationEntityTypeError = this.validateIntegrationEntityType(this.integrationEntityType);
    if (integrationEntityTypeError) {
      errors.integrationEntityType = { errorMessage: integrationEntityTypeError };
    }
    
    const integrationEntityNameError = this.validateIntegrationEntityName(this.integrationEntityName);
    if (integrationEntityNameError) {
      errors.integrationEntityName = { errorMessage: integrationEntityNameError };
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  }

  // Clear validation errors
  private clearValidationErrors(): void {
    this.error = null;
  }

     /** Standard boiler plate for ngOnInit */
  override ngOnInit(): void {
    super.ngOnInit();
    this.entityType = 'SwcatEntry';
  }



  protected async loadEntityByIdCall(id: string): Promise<SwcatEntryCrudWrapper> {
    const catalogEntry = await SwcatEntryCrudWrapper.newInstance(id, this.hcclService);
    return catalogEntry;
  }
  

  protected override async createEntityDataCall(entity: SwcatEntryCrudWrapper): Promise<any> {
     // Validate form before creating
     this.error = this.validateForm();
     if (this.error) {
       throw new Error('Validation failed');
     }

     // Use entityNew if in create mode, otherwise use the passed entity
     const catalogEntryData = this.getMode() === CRUD_MODES.CREATE && this.entityNew ? this.entityNew.getData() : entity.getData();
    
     const postData: CatalogEntryPOSTData = {
       catalogId: catalogEntryData.catalogId || '',
       entryCode: catalogEntryData.entryCode || '',
       title: catalogEntryData.title || '',
       shortDescription: catalogEntryData.shortDescription || '',
       description: catalogEntryData.description || '',
       notes: catalogEntryData.notes || '',
       available: catalogEntryData.available || 1,
       url: catalogEntryData.url || '',
       vocodeInstanceId: catalogEntryData.vocodeInstanceId || '',
       integrationEntityId: catalogEntryData.integrationEntityId || '',
       integrationEntityType: catalogEntryData.integrationEntityType || '',
       integrationEntityName: catalogEntryData.integrationEntityName || '',
       catalogTypeCode: catalogEntryData.catalogTypeCode || ''
     };

     try {
       // The requestCreate method now returns { id: string, status: 201 }
       const response = await this.hcclService.createCatalogEntry(postData).toPromise();
       console.log('Create response:', response);
       this.clearValidationErrors(); // Clear errors on success
       return response;
     } catch (error) {
       console.error('Create error:', error);
       throw error;
     }
  }



  protected override async updateEntityDataCall(entity: SwcatEntryCrudWrapper): Promise<void> {
      // Validate form before updating
      this.error = this.validateForm();
      if (this.error) {
        throw new Error('Validation failed');
      }

      const catalogEntryData = entity.getData();
      if (!catalogEntryData.id) {
        throw new Error('SWCAT Entry ID is required for update');    }

      const putData: CatalogEntryPUTData = {
        catalogId: catalogEntryData.catalogId || '',
        entryCode: catalogEntryData.entryCode || '',
        title: catalogEntryData.title || '',
        shortDescription: catalogEntryData.shortDescription || '',
        description: catalogEntryData.description || '',
        notes: catalogEntryData.notes || '',
        available: catalogEntryData.available || 1,
        url: catalogEntryData.url || '',
        vocodeInstanceId: catalogEntryData.vocodeInstanceId || '',
        integrationEntityId: catalogEntryData.integrationEntityId || '',
        integrationEntityType: catalogEntryData.integrationEntityType || '',
        integrationEntityName: catalogEntryData.integrationEntityName || '',
        catalogTypeCode: catalogEntryData.catalogTypeCode || ''
      };

      try {
        await this.hcclService.updateCatalogEntryById(catalogEntryData.id, putData).toPromise();
        this.clearValidationErrors(); // Clear errors on success
      } catch (error) {
        console.error('Update error:', error);
        throw error;
      }
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteCatalogEntryById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting SWCAT Entry:', error);
      throw error;
    }
  }


  
  public override newEmptyWrapper(): SwcatEntryCrudWrapper {
    // Create an empty catalog entry if no current entity exists
    const emptyCatalogEntry: CatalogEntryGETData = {
      catalogId: '',
      entryCode: '',
      title: '',
      shortDescription: '',
      description: '',
      notes: '',
      available: 1,
      url: '',
      vocodeInstanceId: '',
      integrationEntityId: '',
      integrationEntityType: '',
      integrationEntityName: ''
    };
    
    return new SwcatEntryCrudWrapper(emptyCatalogEntry, this.hcclService);
  }

  // Getter methods for form binding
  public get catalogId(): string {
    return this.getCurrentEntity().getData().catalogId || '';
  }

  public set catalogId(value: string) {
    var data = super.getEntityForSet();
    data.getData().catalogId = value;
  }

  public get entryCode(): string {
    return this.getCurrentEntity().getData().entryCode || '';
  }

  public set entryCode(value: string) {
    var data = super.getEntityForSet();
    data.getData().entryCode = value;
  }

  public get title(): string {
    return this.getCurrentEntity().getData().title || '';
  }

  public set title(value: string) {
    var data = super.getEntityForSet();
    data.getData().title = value;
  }

  public get shortDescription(): string {
    return this.getCurrentEntity().getData().shortDescription || '';
  }

  public set shortDescription(value: string) {
    var data = super.getEntityForSet();
    data.getData().shortDescription = value;
  }

  public get description(): string {
    return this.getCurrentEntity().getData().description || '';
  }

  public set description(value: string) {
    var data = super.getEntityForSet();
    data.getData().description = value;
  }

  public get notes(): string {
    return this.getCurrentEntity().getData().notes || '';
  }

  public set notes(value: string) {
    var data = super.getEntityForSet();
    data.getData().notes = value;
  }

  public get available(): number {
    return this.getCurrentEntity().getData().available || 1;
  }

  public set available(value: number) {
    var data = super.getEntityForSet();
    data.getData().available = value;
  }

  public get url(): string {
    return this.getCurrentEntity().getData().url || '';
  }

  public set url(value: string) {
    var data = super.getEntityForSet();
    data.getData().url = value;
  }

  public get vocodeInstanceId(): string {
    return this.getCurrentEntity().getData().vocodeInstanceId || '';
  }

  public set vocodeInstanceId(value: string) {
    var data = super.getEntityForSet();
    data.getData().vocodeInstanceId = value;
  }

  public get integrationEntityId(): string {
    return this.getCurrentEntity().getData().integrationEntityId || '';
  }

  public set integrationEntityId(value: string) {
    var data = super.getEntityForSet();
    data.getData().integrationEntityId = value;
  }

  public get integrationEntityType(): string {
    return this.getCurrentEntity().getData().integrationEntityType || '';
  }

  public set integrationEntityType(value: string) {
    var data = super.getEntityForSet();
    data.getData().integrationEntityType = value;
  }

  public get integrationEntityName(): string {
    return this.getCurrentEntity().getData().integrationEntityName || '';
  }

  public set integrationEntityName(value: string) {
    var data = super.getEntityForSet();
    data.getData().integrationEntityName = value;
  }

  public get catalogTypeCode(): string {
    return this.getCurrentEntity().getData().catalogTypeCode || '';
  }

  public set catalogTypeCode(value: string) {
    var data = super.getEntityForSet();
    data.getData().catalogTypeCode = value;
  }

  // Getter methods for swWorkProduct fields
  public get swWorkProductName(): string {
    return this.getCurrentEntity().swWorkProduct?.name || '';
  }

  public get swWorkProductBusinessCode(): string {
    return this.getCurrentEntity().swWorkProduct?.businessCode || '';
  }

  public get swWorkProductDescription(): string {
    return this.getCurrentEntity().swWorkProduct?.description || '';
  }

  public get swWorkProductAvailable(): number {
    return this.getCurrentEntity().swWorkProduct?.available || 0;
  }

  public get swWorkProductAvailableForPricing(): number {
    return this.getCurrentEntity().swWorkProduct?.availableForPricing || 0;
  }

  public get swWorkProductSoftwareCategoryCode(): string {
    return this.getCurrentEntity().swWorkProduct?.softwareCategoryCode || '';
  }

  public get swWorkProductBusinessNeed(): string {
    return this.getCurrentEntity().swWorkProduct?.businessNeed || '';
  }

  public get swWorkProductProductTypeCode(): string {
    return this.getCurrentEntity().swWorkProduct?.productTypeCode || '';
  }

  public get swWorkProductIpOwnershipCode(): string {
    return this.getCurrentEntity().swWorkProduct?.ipOwnershipCode || '';
  }

  public get swWorkProductComplexityCode(): string {
    return this.getCurrentEntity().swWorkProduct?.complexityCode || '';
  }

  public get swWorkProductHostingCode(): string {
    return this.getCurrentEntity().swWorkProduct?.hostingCode || '';
  }

  public get swWorkProductLifecycleCode(): string {
    return this.getCurrentEntity().swWorkProduct?.lifecycleCode || '';
  }

  public get swWorkProductSlaCode(): string {
    return this.getCurrentEntity().swWorkProduct?.slaCode || '';
  }

  public get swWorkProductLinkWiki(): string {
    return this.getCurrentEntity().swWorkProduct?.linkWiki || '';
  }

  public get swWorkProductNumberOfUniqueUsersPerYear(): number {
    return this.getCurrentEntity().swWorkProduct?.numberOfUniqueUsersPerYear || 0;
  }

  public get swWorkProductImportance(): number {
    return this.getCurrentEntity().swWorkProduct?.importance || 0;
  }

  public get swWorkProductRevenuePerYear(): number {
    return this.getCurrentEntity().swWorkProduct?.revenuePerYear || 0;
  }

  public get swWorkProductRecordCount(): number {
    return this.getCurrentEntity().swWorkProduct?.recordCount || 0;
  }

  public get swWorkProductDevelopmentHours(): number {
    return this.getCurrentEntity().swWorkProduct?.developmentHours || 0;
  }

  public get swWorkProductCostPerMonth(): number {
    return this.getCurrentEntity().swWorkProduct?.costPerMonth || 0;
  }
  /**
   * Create a wrapper from CatalogEntryGETData
   * @param catalogEntryData The CatalogEntryGETData to wrap
   * @returns SwcatEntryCrudWrapper instance
   */
  public createWrapper(catalogEntryData: CatalogEntryGETData): SwcatEntryCrudWrapper {
    return new SwcatEntryCrudWrapper(catalogEntryData, this.hcclService);
  }

  getSwcatEntryFkMenuCriteria(): CatalogEntryCriteria {
    // SWCAT entry organization.
    return {
      available: 1
    };
  }

   /** Define the menu objects for this crud component */
   protected swcatEntryMenu: MenuControlDataList | null = null;
   protected override async prepareMenus(entity: SwcatEntryCrudWrapper): Promise<void> {
    
    // const fkMenu = await entity.getFkMenu();
    // // Actually, we're going to load the catalog entry wrapper, then call getSwcatEntryMenu
    // this.swcatEntryMenu = fkMenu || null;

    return Promise.resolve();
  }

  protected getSwcatEntryImageUrl(): string {
    return "imgs/TAROT-HR.png";
  }

}

export class SwcatEntryCrudWrapper extends EntityWrapper<CatalogEntryGETData> {

  public swWorkProduct: SwWorkProductGETData | null = null;

  public static  newInstanceForCreate( hcclService: HcclService, entityIn?: CatalogEntryGETData | null): SwcatEntryCrudWrapper {
    const entity = entityIn || {
      id: '0',
      catalogId: '',
      entryCode: '',
      title: '',
      shortDescription: '',
      description: '',
      notes: '',
      available: 1,
      url: '',
      vocodeInstanceId: '',
      integrationEntityId: '',
      integrationEntityType: '',
      integrationEntityName: '',
      catalogTypeCode: ''
    } as CatalogEntryGETData;
    return new SwcatEntryCrudWrapper(entity, hcclService);
  }
  public static async newInstance(id: string, hcclService: HcclService): Promise<SwcatEntryCrudWrapper> {
    const catalogEntry = await hcclService.getCatalogEntryById(id).toPromise();
    if (catalogEntry) {
        let wrapper  = new SwcatEntryCrudWrapper(catalogEntry, hcclService);
        wrapper.swWorkProduct = await hcclService.getSwWorkProductById(catalogEntry.subjectEntityId || '').toPromise() || null;
        return wrapper;
    }
    throw new Error('SWCAT Entry not found');
  }
  constructor(data: CatalogEntryGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }
  
  getDisplayText(entity?: CatalogEntryGETData): string {
    const data = entity || this.data;
    const title = data.title || '';
    const entryCode = data.entryCode || '';
    if (title && entryCode) {
      return `${title} (${entryCode})`;
    } else if (title) {
      return title;
    } else if (entryCode) {
      return entryCode;
    } else {
      return 'Unnamed SWCAT Entry';
    }
  }

  getFullName(): string {
    return this.getDisplayText();
  }

  getEntryCode(): string {
    return this.data.entryCode || '';
  }

  getTitle(): string {
    return this.data.title || '';
  }

  getShortDescription(): string {
    return this.data.shortDescription || '';
  }

  getDescription(): string {
    return this.data.description || '';
  }

  getNotes(): string {
    return this.data.notes || '';
  }

  getAvailable(): number {
    return this.data.available || 1;
  }

  getUrl(): string {
    return this.data.url || '';
  }

  getVocodeInstanceId(): string {
    return this.data.vocodeInstanceId || '';
  }

  getIntegrationEntityId(): string {
    return this.data.integrationEntityId || '';
  }

  getIntegrationEntityType(): string {
    return this.data.integrationEntityType || '';
  }

  getIntegrationEntityName(): string {
    return this.data.integrationEntityName || '';
  }

  isActive(): boolean {
    return this.data.available === 1;
  }

  getFkMenuCriteria(): CatalogEntryCriteria {
    return {
      available: 1
    };
  }

  async getSwcatEntries(criteria?: CatalogEntryCriteria): Promise<CatalogEntryGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const searchCriteria = criteria || this.getFkMenuCriteria();
    const response = await this.hcclService.findCatalogEntrys(searchCriteria).toPromise();
    return response?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    console.log('getFkMenu', menuHint, data);
    var criteria = this.getFkMenuCriteria();
    var swcatEntries = await this.getSwcatEntries(criteria);
    var menuItems = swcatEntries.map(swcatEntry => {
      return {
        id: swcatEntry.id,
        name: swcatEntry.title
      } as MenuControlData;
    });
    return { menuItems: menuItems } as MenuControlDataList;
  }

  // Methods for swWorkProduct
  getSwWorkProduct(): SwWorkProductGETData | null {
    return this.swWorkProduct;
  }

  hasSwWorkProduct(): boolean {
    return this.swWorkProduct !== null && this.swWorkProduct !== undefined;
  }

  getSwWorkProductName(): string {
    return this.swWorkProduct?.name || '';
  }

  getSwWorkProductBusinessCode(): string {
    return this.swWorkProduct?.businessCode || '';
  }

  getSwWorkProductDescription(): string {
    return this.swWorkProduct?.description || '';
  }

  getSwWorkProductAvailable(): number {
    return this.swWorkProduct?.available || 0;
  }

  getSwWorkProductAvailableForPricing(): number {
    return this.swWorkProduct?.availableForPricing || 0;
  }

  getSwWorkProductSoftwareCategoryCode(): string {
    return this.swWorkProduct?.softwareCategoryCode || '';
  }

  getSwWorkProductBusinessNeed(): string {
    return this.swWorkProduct?.businessNeed || '';
  }

  getSwWorkProductProductTypeCode(): string {
    return this.swWorkProduct?.productTypeCode || '';
  }

  getSwWorkProductIpOwnershipCode(): string {
    return this.swWorkProduct?.ipOwnershipCode || '';
  }

  getSwWorkProductComplexityCode(): string {
    return this.swWorkProduct?.complexityCode || '';
  }

  getSwWorkProductHostingCode(): string {
    return this.swWorkProduct?.hostingCode || '';
  }

  getSwWorkProductLifecycleCode(): string {
    return this.swWorkProduct?.lifecycleCode || '';
  }

  getSwWorkProductSlaCode(): string {
    return this.swWorkProduct?.slaCode || '';
  }

  getSwWorkProductLinkWiki(): string {
    return this.swWorkProduct?.linkWiki || '';
  }

  getSwWorkProductNumberOfUniqueUsersPerYear(): number {
    return this.swWorkProduct?.numberOfUniqueUsersPerYear || 0;
  }

  getSwWorkProductImportance(): number {
    return this.swWorkProduct?.importance || 0;
  }

  getSwWorkProductRevenuePerYear(): number {
    return this.swWorkProduct?.revenuePerYear || 0;
  }

  getSwWorkProductRecordCount(): number {
    return this.swWorkProduct?.recordCount || 0;
  }

  getSwWorkProductDevelopmentHours(): number {
    return this.swWorkProduct?.developmentHours || 0;
  }

  getSwWorkProductCostPerMonth(): number {
    return this.swWorkProduct?.costPerMonth || 0;
  }

  // Enhanced display text that includes swWorkProduct info
  getEnhancedDisplayText(entity?: CatalogEntryGETData): string {
    const data = entity || this.data;
    const title = data.title || '';
    const entryCode = data.entryCode || '';
    const swWorkProductName = this.swWorkProduct?.name || '';
    
    if (swWorkProductName && title && entryCode) {
      return `${swWorkProductName} - ${title} (${entryCode})`;
    } else if (swWorkProductName && title) {
      return `${swWorkProductName} - ${title}`;
    } else if (title && entryCode) {
      return `${title} (${entryCode})`;
    } else if (title) {
      return title;
    } else if (entryCode) {
      return entryCode;
    } else {
      return 'Unnamed SWCAT Entry';
    }
  }
}
