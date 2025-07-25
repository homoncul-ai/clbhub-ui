// This template is for generating a CRUD component for an entity that has a FK Menu
// This was generated using entityName = ProviderRequestTypeRef
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
import { ProviderRequestTypeRefCriteria, ProviderRequestTypeRefGETData, ProviderRequestTypeRefPOSTData, ProviderRequestTypeRefPUTData, HcclService, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
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
// No FK components needed for ProviderRequestTypeRef

@Component({
  selector: 'app-providerrequesttyperef-crud',
  templateUrl: './providerrequesttyperef-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule,
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent, ReferenceDataComponent],
  standalone: true
})
export class ProviderRequestTypeRefCrudComponent extends AbstractCrudComponent<ProviderRequestTypeRefCrudWrapper> implements OnInit, OnChanges {

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

  private validatePolicyBeanName(policyBeanName: string): string | null {
    if (!policyBeanName || policyBeanName.trim() === '') {
      return 'Policy Bean Name is required';
    }
    if (policyBeanName.length > 255) {
      return 'Policy Bean Name must be less than 255 characters';
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
    
    const policyBeanNameError = this.validatePolicyBeanName(this.policyBeanName);
    if (policyBeanNameError) {
      errors.policyBeanName = { errorMessage: policyBeanNameError };
    }
    
    return errors;
  }

  private clearValidationErrors(): void {
    this.error = null;
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected async loadEntityByIdCall(id: string): Promise<ProviderRequestTypeRefCrudWrapper> {
    const providerRequestTypeRef = await this.hcclService.getProviderRequestTypeRefById(id).toPromise();
    if (!providerRequestTypeRef) {
      throw new Error('ProviderRequestTypeRef not found');
    }
    return new ProviderRequestTypeRefCrudWrapper(providerRequestTypeRef, this.hcclService);
  }

  protected override async createEntityDataCall(entity: ProviderRequestTypeRefCrudWrapper): Promise<any> {
    const postData: ProviderRequestTypeRefPOSTData = {
      name: entity.getData().name || '',
      businessCode: entity.getData().businessCode || '',
      description: entity.getData().description || '',
      available: entity.getData().available || 0,
      policyBeanName: entity.getData().policyBeanName || ''
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    // This is important - the requestCreate method returns { id: string, status: 201 }
    try {
      // The requestCreate method returns { id: string, status: 201 }
      const response = await this.hcclService.createProviderRequestTypeRef(postData);
      console.log('Create response:', response);
      this.clearValidationErrors(); // Clear errors on success
      return response;
    } catch (error) {
      console.error('Create error:', error);
      throw error;
    }

  }

  protected override async updateEntityDataCall(entity: ProviderRequestTypeRefCrudWrapper): Promise<void> {
    const putData: ProviderRequestTypeRefPUTData = {
      name: entity.getData().name || '',
      businessCode: entity.getData().businessCode || '',
      description: entity.getData().description || '',
      available: entity.getData().available || 0,
      policyBeanName: entity.getData().policyBeanName || ''
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    await this.hcclService.updateProviderRequestTypeRefById(entity.getData().id!, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteProviderRequestTypeRefById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting ProviderRequestTypeRef:', error);
      return false;
    }
  }

  public override newEmptyWrapper(): ProviderRequestTypeRefCrudWrapper {
    return ProviderRequestTypeRefCrudWrapper.newInstanceForCreate(this.hcclService);
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

  public get policyBeanName(): string {
    return this.getCurrentEntity()?.getData()?.policyBeanName || '';
  }

  public set policyBeanName(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().policyBeanName = value;
    }
  }

  public createWrapper(providerRequestTypeRefData: ProviderRequestTypeRefGETData): ProviderRequestTypeRefCrudWrapper {
    return new ProviderRequestTypeRefCrudWrapper(providerRequestTypeRefData, this.hcclService);
  }

  getProviderRequestTypeRefFkMenuCriteria(): ProviderRequestTypeRefCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected providerRequestTypeRefMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: ProviderRequestTypeRefCrudWrapper): Promise<void> {
    const criteria = this.getProviderRequestTypeRefFkMenuCriteria();
    const results = await this.hcclService.findProviderRequestTypeRefs(criteria).toPromise();
    this.providerRequestTypeRefMenu = await entity.getFkMenu("providerrequesttyperefs", this.id);
  }
}

export class ProviderRequestTypeRefCrudWrapper extends EntityWrapper<ProviderRequestTypeRefGETData> {

  public static newInstanceForCreate(hcclService: HcclService, entityIn?: ProviderRequestTypeRefGETData | null): ProviderRequestTypeRefCrudWrapper {
    const emptyData: ProviderRequestTypeRefGETData = {
      name: '',
      businessCode: '',
      description: '',
      available: 0,
      policyBeanName: ''
    };
    return new ProviderRequestTypeRefCrudWrapper(entityIn || emptyData, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<ProviderRequestTypeRefCrudWrapper> {
    const data = await hcclService.getProviderRequestTypeRefById(id).toPromise();
    if (!data) {
      throw new Error('ProviderRequestTypeRef not found');
    }
    return new ProviderRequestTypeRefCrudWrapper(data, hcclService);
  }

  constructor(data: ProviderRequestTypeRefGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  getDisplayText(entity?: ProviderRequestTypeRefGETData): string {
    const data = entity || this.getData();
    if (data.name) {
      return data.name;
    }
    if (data.businessCode) {
      return data.businessCode;
    }
    return data.id || 'Unknown ProviderRequestTypeRef';
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

  getFkMenuCriteria(): ProviderRequestTypeRefCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  async getProviderRequestTypeRefs(criteria?: ProviderRequestTypeRefCriteria): Promise<ProviderRequestTypeRefGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const results = await this.hcclService.findProviderRequestTypeRefs(criteria || this.getFkMenuCriteria()).toPromise();
    return results?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const providerRequestTypeRefs = await this.getProviderRequestTypeRefs();
    return this.getMenuControlDataList("providerrequesttyperefs", this.getEntityType() + " Menu", providerRequestTypeRefs, data);
  }
} 