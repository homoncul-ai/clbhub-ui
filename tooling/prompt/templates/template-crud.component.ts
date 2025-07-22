// This template is for generating a CRUD component for an entity that has a FK Menu
// This was generated using entityName = HcclOrganization
// Generate the new [entityName]-crud.component.ts   files using this template
// Of course, the code related to the attribtutes of the entity shoule be changed to match the entityName


import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, Validators } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { HcclOrganizationCriteria, HcclOrganizationGETData, HcclOrganizationPOSTData, HcclOrganizationPUTData, HcclService, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { Observable, map } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';
import { ReferenceDataComponent } from '@app/components/_global/reference-data/reference-data.component';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';

// Import are all the FK Menus for the UI to use <app-entityNameFk-crud>
import { HcclOrganizationTypeRefCrudComponent } from '@app/components/_crud/hcclorganizationtyperef/hcclorganizationtyperef-crud.component';

@Component({
  selector: 'app-hcclorganization-crud',
  templateUrl: './hcclorganization-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule,
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent, ReferenceDataComponent, HcclOrganizationTypeRefCrudComponent],
  standalone: true
})
export class HcclOrganizationCrudComponent extends AbstractCrudComponent<HcclOrganizationCrudWrapper> implements OnInit, OnChanges {

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
    if (businessCode.length > 50) {
      return 'Business Code must be less than 50 characters';
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

  private validateParentEntityEntityType(parentEntityEntityType: string): string | null {
    if (parentEntityEntityType && parentEntityEntityType.length > 50) {
      return 'Parent Entity Entity Type must be less than 50 characters';
    }
    return null;
  }

  private validateParentEntityName(parentEntityName: string): string | null {
    if (parentEntityName && parentEntityName.length > 255) {
      return 'Parent Entity Name must be less than 255 characters';
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
    
    const parentEntityEntityTypeError = this.validateParentEntityEntityType(this.parentEntityEntityType);
    if (parentEntityEntityTypeError) {
      errors.parentEntityEntityType = { errorMessage: parentEntityEntityTypeError };
    }
    
    const parentEntityNameError = this.validateParentEntityName(this.parentEntityName);
    if (parentEntityNameError) {
      errors.parentEntityName = { errorMessage: parentEntityNameError };
    }
    
    return errors;
  }

  private clearValidationErrors(): void {
    this.error = null;
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected async loadEntityByIdCall(id: string): Promise<HcclOrganizationCrudWrapper> {
    const hcclorganization = await this.hcclService.getHcclOrganizationById(id).toPromise();
    if (!hcclorganization) {
      throw new Error('HcclOrganization not found');
    }
    return new HcclOrganizationCrudWrapper(hcclorganization, this.hcclService);
  }

  protected override async createEntityDataCall(entity: HcclOrganizationCrudWrapper): Promise<any> {
    const postData: HcclOrganizationPOSTData = {
      name: entity.getData().name || '',
      businessCode: entity.getData().businessCode || '',
      description: entity.getData().description || '',
      available: entity.getData().available || 0,
      organizationTypeId: entity.getData().organizationTypeId || '',
      organizationTypeCode: '', // This field is required by POST interface but not available in GET data
      jsonData: entity.getData().jsonData,
      websiteUrl: entity.getData().websiteUrl,
      parentEntityId: entity.getData().parentEntityId,
      parentEntityEntityType: entity.getData().parentEntityEntityType,
      parentEntityName: entity.getData().parentEntityName
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    return this.hcclService.createHcclOrganization(postData).toPromise();
  }

  protected override async updateEntityDataCall(entity: HcclOrganizationCrudWrapper): Promise<void> {
    const putData: HcclOrganizationPUTData = {
      name: entity.getData().name || '',
      businessCode: entity.getData().businessCode || '',
      description: entity.getData().description || '',
      available: entity.getData().available || 0,
      organizationTypeId: entity.getData().organizationTypeId || '',
      jsonData: entity.getData().jsonData,
      websiteUrl: entity.getData().websiteUrl,
      parentEntityId: entity.getData().parentEntityId,
      parentEntityEntityType: entity.getData().parentEntityEntityType,
      parentEntityName: entity.getData().parentEntityName
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    await this.hcclService.updateHcclOrganizationById(entity.getData().id!, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteHcclOrganizationById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting HcclOrganization:', error);
      return false;
    }
  }

  public override newEmptyWrapper(): HcclOrganizationCrudWrapper {
    return HcclOrganizationCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  // Getter and setter methods for form binding
  public get name(): string {
    return this.getCurrentEntity()?.getData()?.name || '';
  }

  public set name(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().name = value;
    }
  }

  public get businessCode(): string {
    return this.getCurrentEntity()?.getData()?.businessCode || '';
  }

  public set businessCode(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().businessCode = value;
    }
  }

  public get description(): string {
    return this.getCurrentEntity()?.getData()?.description || '';
  }

  public set description(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().description = value;
    }
  }

  public get available(): number {
    return this.getCurrentEntity()?.getData()?.available || 0;
  }

  public set available(value: number) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().available = value;
    }
  }

  public get organizationTypeId(): string {
    return this.getCurrentEntity()?.getData()?.organizationTypeId || '';
  }

  public set organizationTypeId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().organizationTypeId = value;
    }
  }

  public get jsonData(): string {
    return this.getCurrentEntity()?.getData()?.jsonData || '';
  }

  public set jsonData(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().jsonData = value;
    }
  }

  public get websiteUrl(): string {
    return this.getCurrentEntity()?.getData()?.websiteUrl || '';
  }

  public set websiteUrl(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().websiteUrl = value;
    }
  }

  public get parentEntityId(): string {
    return this.getCurrentEntity()?.getData()?.parentEntityId || '';
  }

  public set parentEntityId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().parentEntityId = value;
    }
  }

  public get parentEntityEntityType(): string {
    return this.getCurrentEntity()?.getData()?.parentEntityEntityType || '';
  }

  public set parentEntityEntityType(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().parentEntityEntityType = value;
    }
  }

  public get parentEntityName(): string {
    return this.getCurrentEntity()?.getData()?.parentEntityName || '';
  }

  public set parentEntityName(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().parentEntityName = value;
    }
  }

  public createWrapper(hcclorganizationData: HcclOrganizationGETData): HcclOrganizationCrudWrapper {
    return new HcclOrganizationCrudWrapper(hcclorganizationData, this.hcclService);
  }

  getHcclOrganizationFkMenuCriteria(): HcclOrganizationCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected hcclorganizationMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: HcclOrganizationCrudWrapper): Promise<void> {
    const criteria = this.getHcclOrganizationFkMenuCriteria();
    const results = await this.hcclService.findHcclOrganizations(criteria).toPromise();
    this.hcclorganizationMenu =await entity.getFkMenu("hcclorganizations", this.id);
  }
}

export class HcclOrganizationCrudWrapper extends EntityWrapper<HcclOrganizationGETData> {

  public static newInstanceForCreate(hcclService: HcclService, entityIn?: HcclOrganizationGETData | null): HcclOrganizationCrudWrapper {
    const emptyData: HcclOrganizationGETData = {
      name: '',
      businessCode: '',
      description: '',
      available: 0,
      organizationTypeId: ''
    };
    return new HcclOrganizationCrudWrapper(entityIn || emptyData, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<HcclOrganizationCrudWrapper> {
    const data = await hcclService.getHcclOrganizationById(id).toPromise();
    if (!data) {
      throw new Error('HcclOrganization not found');
    }
    return new HcclOrganizationCrudWrapper(data, hcclService);
  }

  constructor(data: HcclOrganizationGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  getDisplayText(entity?: HcclOrganizationGETData): string {
    const data = entity || this.getData();
    if (data.name) {
      return data.name;
    }
    if (data.businessCode) {
      return data.businessCode;
    }
    return data.id || 'Unknown HcclOrganization';
  }

  getFullName(): string {
    return this.getData().name || '';
  }

  getBusinessCode(): string {
    return this.getData().businessCode || '';
  }

  getDescription(): string {
    return this.getData().description || '';
  }

  getAvailable(): number {
    return this.getData().available || 0;
  }

  isActive(): boolean {
    return this.getData().available === 1;
  }

  getFkMenuCriteria(): HcclOrganizationCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  async getHcclOrganizations(criteria?: HcclOrganizationCriteria): Promise<HcclOrganizationGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const results = await this.hcclService.findHcclOrganizations(criteria || this.getFkMenuCriteria()).toPromise();
    return results?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const hcclorganizations = await this.getHcclOrganizations();
    return this.getMenuControlDataList("hcclorganizations", this.getEntityType() + " Menu", hcclorganizations, data);
  }
} 