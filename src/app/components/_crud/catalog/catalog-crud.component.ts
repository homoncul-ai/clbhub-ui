import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, Validators } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { CatalogCriteria, CatalogGETData, CatalogPOSTData, CatalogPUTData, CatalogTypeRefGETData, HcclService, MenuControlDataList, MenuControlData, HcclOrganizationGETData, CatalogEntrySignupPacketCriteria } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { Observable, map } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';
import { HcclOrganizationCrudComponent } from '../hcclorganization/hcclorganization-crud.component';

@Component({
  selector: 'app-catalog-crud',
  templateUrl: './catalog-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule, 
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent,
    HcclOrganizationCrudComponent],
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
 * - organizationId?: string - Optional Organization ID to set when creating a new Catalog
 * 
 * If no ID is provided, the component will load the full list of Catalogs.
 * If an ID is provided, the component will load that specific Catalog and show it in detail mode.
 * 
 * Create a wrapper class that extends EntityWrapper<CatalogGETData>
 * and implement the abstract methods of the AbstractCrudComponent
 */

  // Input for organization ID when creating new catalog
  @Input() organizationId?: string;
  
  // Flag to indicate component is in modal mode (skip navigation after create/update)
  @Input() isModal: boolean = false;
  
  // Event emitted when a catalog is successfully created
  @Output() catalogCreated = new EventEmitter<string>();
  
  // Event emitted when a catalog is successfully updated
  @Output() catalogUpdated = new EventEmitter<string>();
  
  // Event emitted when user cancels the operation (for modal mode)
  @Output() cancelled = new EventEmitter<void>();
  
  constructor() {
    super();
  }

  // Error property for form validation
  public error: any = null;
  
  // Menu for catalog type selection
  protected catalogTypeMenu: MenuControlDataList | null = null;

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
    this.loadCatalogTypeMenu();
    this.loadSignupPacketMenu();
  }
  
  /**
   * Load the catalog type menu for selection
   */
  private async loadCatalogTypeMenu(): Promise<void> {
    try {
      const response = await this.hcclService.findCatalogTypeRefs({ isPaging: false }).toPromise();
      if (response?.searchResults) {
        const menuItems: MenuControlData[] = response.searchResults.map(typeRef => ({
          id: typeRef.id || '',
          name: typeRef.name || typeRef.businessCode || 'Unknown Type'
        }));
        this.catalogTypeMenu = { menuItems };
      }
    } catch (error) {
      console.error('Error loading catalog type refs:', error);
    }
  }
  protected signupPacketMenu: MenuControlDataList | null = null;
  private async loadSignupPacketMenu(): Promise<void> {
    try {
      const criteria: CatalogEntrySignupPacketCriteria = {
        pageNumber: 1,
        pageSize: 50,
        isPaging: true,
        organizationId: this.getCurrentOrganizationId() || ''
      };
      alert("Loading signup packet menu for organization: " + this.getCurrentOrganizationId());
      const response = await this.hcclService.findCatalogEntrySignupPackets(
        criteria).toPromise();
      if (response?.searchResults) {
        const menuItems: MenuControlData[] = response.searchResults.map(signupPacket => ({
          id: signupPacket.id || '',
          name: signupPacket.name || 'Unknown Signup Packet'
        }));
        this.signupPacketMenu = { menuItems };
      }
    } catch (error) {
      console.error('Error loading signup packet refs:', error);
    }
  }
  /**
   * Handle catalog type selection change
   */
  onCatalogTypeChange(selected: MenuControlData | null): void {
    const entity = this.getActiveEntity();
    if (entity) {
      entity.catalogTypeId = selected?.id || '';
    }
  }
  onSignupPacketChange(selected: MenuControlData | null): void {
    const entity = this.getActiveEntity();
    if (entity) {
      entity.signupPacketId = selected?.id || '';
    }
  } 

  protected async loadEntityByIdCall(id: string): Promise<CatalogCrudWrapper> {
    const data = await this.hcclService.getCatalogById(id).toPromise();
    if (!data) {
      throw new Error('Catalog not found');
    }
    return new CatalogCrudWrapper(data, this.hcclService);
  }

  protected override async createEntityDataCall(entity: CatalogCrudWrapper): Promise<any> {
    // Use input organizationId if entity doesn't have one
    const orgId = entity.organizationId || this.organizationId || '';
    
    const postData: CatalogPOSTData = {
      organizationId: orgId,
      name: entity.name,
      businessCode: entity.businessCode,
      description: entity.description,
      available: entity.available,
      taxonomyEntryId: entity.taxonomyEntryId || undefined,
      catalogTypeId: entity.catalogTypeId || undefined,
      urlPrefix: entity.urlPrefix || undefined,
      url: entity.url || undefined,
      signupPacketId: entity.signupPacketId || undefined
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
      taxonomyEntryId: entity.taxonomyEntryId || undefined,
      catalogTypeId: entity.catalogTypeId || undefined,
      urlPrefix: entity.urlPrefix || undefined,
      url: entity.url || undefined,
      signupPacketId: entity.signupPacketId || undefined
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
    return this.getActiveEntity()?.name || '';
  }

  public set name(value: string) {
    const entity = this.getActiveEntity();
    if (entity) {
      entity.name = value;
    }
  }

  public get businessCode(): string {
    return this.getActiveEntity()?.businessCode || '';
  }

  public set businessCode(value: string) {
    const entity = this.getActiveEntity();
    if (entity) {
      entity.businessCode = value;
    }
  }

  public get description(): string {
    return this.getActiveEntity()?.description || '';
  }

  public set description(value: string) {
    const entity = this.getActiveEntity();
    if (entity) {
      entity.description = value;
    }
  }

  public get available(): number {
    return this.getActiveEntity()?.available || 0;
  }

  public set available(value: number) {
    const entity = this.getActiveEntity();
    if (entity) {
      entity.available = value;
    }
  }

  public get taxonomyEntryId(): string {
    return this.getActiveEntity()?.taxonomyEntryId || '';
  }

  public set taxonomyEntryId(value: string) {
    const entity = this.getActiveEntity();
    if (entity) {
      entity.taxonomyEntryId = value;
    }
  }

  public get urlPrefix(): string {
    return this.getActiveEntity()?.urlPrefix || '';
  }

  public set urlPrefix(value: string) {
    const entity = this.getActiveEntity();
    if (entity) {
      entity.urlPrefix = value;
    }
  }

  public get url(): string {
    return this.getActiveEntity()?.url || '';
  }

  public set url(value: string) {
    const entity = this.getActiveEntity();
    if (entity) {
      entity.url = value;
    }
  }

  public get catalogTypeId(): string {
    return this.getActiveEntity()?.catalogTypeId || '';
  }

  public set catalogTypeId(value: string) {
    const entity = this.getActiveEntity();
    if (entity) {
      entity.catalogTypeId = value;
    }
  }

  public get signupPacketId(): string {
    return this.getActiveEntity()?.signupPacketId || '';
  }

  public set signupPacketId(value: string) {
    const entity = this.getActiveEntity();
    if (entity) {
      entity.signupPacketId = value;
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
    // Load catalog type menu if not already loaded
    if (!this.catalogTypeMenu) {
      await this.loadCatalogTypeMenu();
    }
  }

  /**
   * Override postCreate to handle modal mode - emit event instead of navigating
   */
  protected override postCreate(): void {
    console.log('Catalog created successfully');
    
    // Emit event with the created catalog ID
    this.catalogCreated.emit(this.id);
    
    // Only navigate if not in modal mode
    if (!this.isModal) {
      const baseRoute = this.getBaseRoute();
      this.router.navigate([baseRoute, this.id, 'details']);
    }
  }

  /**
   * Override postSave to handle modal mode - emit event instead of navigating
   */
  protected override postSave(): void {
    console.log('Catalog saved successfully');
    
    // Emit event with the updated catalog ID
    this.catalogUpdated.emit(this.id);
    
    // Only switch to detail mode if not in modal mode
    if (!this.isModal) {
      this.switchToDetailMode();
    }
  }

  /**
   * Cancel the current operation - emit cancel event if in modal mode
   */
  public cancelOperation(): void {
    if (this.isModal) {
      this.cancelled.emit();
    } else {
      this.switchToDetailMode();
    }
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
      catalogTypeId: '',
      urlPrefix: '',
      url: '',
      signupPacketId: ''
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

  get theOrganization(): HcclOrganizationGETData {
    return this.data.organization || {};
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

  get catalogTypeId(): string {
    return this.data.catalogTypeId || '';
  }

  set catalogTypeId(value: string) {
    this.data.catalogTypeId = value;
  }

  get signupPacketId(): string {
    return this.data.signupPacketId || '';
  }

  set signupPacketId(value: string) {
    this.data.signupPacketId = value;
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