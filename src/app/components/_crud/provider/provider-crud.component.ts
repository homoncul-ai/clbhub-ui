// This template is for generating a CRUD component for an entity that has a FK Menu
// This was generated using entityName = Provider
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
import { ProviderCriteria, ProviderGETData, ProviderPOSTData, ProviderPUTData, HcclService, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
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
import { ProvidertyperefCrudComponent } from '@app/components/_crud/providertyperef/providertyperef-crud.component';

@Component({
  selector: 'app-provider-crud',
  templateUrl: './provider-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule,
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent, ReferenceDataComponent, ProvidertyperefCrudComponent],
  standalone: true
})
export class ProviderCrudComponent extends AbstractCrudComponent<ProviderCrudWrapper> implements OnInit, OnChanges {

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

  private validateTeamParentId(teamParentId: string): string | null {
    if (!teamParentId || teamParentId.trim() === '') {
      return 'Team Parent ID is required';
    }
    return null;
  }

  private validateTeamParentEntityType(teamParentEntityType: string): string | null {
    if (!teamParentEntityType || teamParentEntityType.trim() === '') {
      return 'Team Parent Entity Type is required';
    }
    if (teamParentEntityType.length > 50) {
      return 'Team Parent Entity Type must be less than 50 characters';
    }
    return null;
  }

  private validateTeamParentName(teamParentName: string): string | null {
    if (!teamParentName || teamParentName.trim() === '') {
      return 'Team Parent Name is required';
    }
    if (teamParentName.length > 255) {
      return 'Team Parent Name must be less than 255 characters';
    }
    return null;
  }

  private validateProviderTypeId(providerTypeId: string): string | null {
    if (!providerTypeId || providerTypeId.trim() === '') {
      return 'Provider Type ID is required';
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
    
    const teamParentIdError = this.validateTeamParentId(this.teamParentId);
    if (teamParentIdError) {
      errors.teamParentId = { errorMessage: teamParentIdError };
    }
    
    const teamParentEntityTypeError = this.validateTeamParentEntityType(this.teamParentEntityType);
    if (teamParentEntityTypeError) {
      errors.teamParentEntityType = { errorMessage: teamParentEntityTypeError };
    }
    
    const teamParentNameError = this.validateTeamParentName(this.teamParentName);
    if (teamParentNameError) {
      errors.teamParentName = { errorMessage: teamParentNameError };
    }
    
    const providerTypeIdError = this.validateProviderTypeId(this.providerTypeId);
    if (providerTypeIdError) {
      errors.providerTypeId = { errorMessage: providerTypeIdError };
    }
    
    return errors;
  }

  private clearValidationErrors(): void {
    this.error = null;
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected async loadEntityByIdCall(id: string): Promise<ProviderCrudWrapper> {
    const provider = await this.hcclService.getProviderById(id).toPromise();
    if (!provider) {
      throw new Error('Provider not found');
    }
    return new ProviderCrudWrapper(provider, this.hcclService);
  }

  protected override async createEntityDataCall(entity: ProviderCrudWrapper): Promise<any> {
    const postData: ProviderPOSTData = {
      name: entity.getData().name || '',
      businessCode: entity.getData().businessCode || '',
      description: entity.getData().description || '',
      teamParentId: entity.getData().teamParentId || '',
      teamParentEntityType: entity.getData().teamParentEntityType || '',
      teamParentName: entity.getData().teamParentName || '',
      modelJson: entity.getData().modelJson || '',
      providerTypeId: entity.getData().providerTypeId || ''
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    // This is important - the requestCreate method returns { id: string, status: 201 }
    try {
      // The requestCreate method returns { id: string, status: 201 }
      const response = await this.hcclService.createProvider(postData);
      console.log('Create response:', response);
      this.clearValidationErrors(); // Clear errors on success
      return response;
    } catch (error) {
      console.error('Create error:', error);
      throw error;
    }

  }

  protected override async updateEntityDataCall(entity: ProviderCrudWrapper): Promise<void> {
    const putData: ProviderPUTData = {
      name: entity.getData().name || '',
      businessCode: entity.getData().businessCode || '',
      description: entity.getData().description || '',
      teamParentId: entity.getData().teamParentId || '',
      teamParentEntityType: entity.getData().teamParentEntityType || '',
      teamParentName: entity.getData().teamParentName || '',
      modelJson: entity.getData().modelJson || '',
      providerTypeId: entity.getData().providerTypeId || ''
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    await this.hcclService.updateProviderById(entity.getData().id!, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteProviderById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting Provider:', error);
      return false;
    }
  }

  public override newEmptyWrapper(): ProviderCrudWrapper {
    return ProviderCrudWrapper.newInstanceForCreate(this.hcclService);
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

  public get teamParentId(): string {
    return this.getCurrentEntity()?.getData()?.teamParentId || '';
  }

  public set teamParentId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().teamParentId = value;
    }
  }

  public get teamParentEntityType(): string {
    return this.getCurrentEntity()?.getData()?.teamParentEntityType || '';
  }

  public set teamParentEntityType(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().teamParentEntityType = value;
    }
  }

  public get teamParentName(): string {
    return this.getCurrentEntity()?.getData()?.teamParentName || '';
  }

  public set teamParentName(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().teamParentName = value;
    }
  }

  public get modelJson(): string {
    return this.getCurrentEntity()?.getData()?.modelJson || '';
  }

  public set modelJson(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().modelJson = value;
    }
  }

  public get providerTypeId(): string {
    return this.getCurrentEntity()?.getData()?.providerTypeId || '';
  }

  public set providerTypeId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().providerTypeId = value;
    }
  }

  public createWrapper(providerData: ProviderGETData): ProviderCrudWrapper {
    return new ProviderCrudWrapper(providerData, this.hcclService);
  }

  getProviderFkMenuCriteria(): ProviderCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected providerMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: ProviderCrudWrapper): Promise<void> {
    const criteria = this.getProviderFkMenuCriteria();
    const results = await this.hcclService.findProviders(criteria).toPromise();
    this.providerMenu = await entity.getFkMenu("providers", this.id);
  }
}

export class ProviderCrudWrapper extends EntityWrapper<ProviderGETData> {

  public static newInstanceForCreate(hcclService: HcclService, entityIn?: ProviderGETData | null): ProviderCrudWrapper {
    const emptyData: ProviderGETData = {
      name: '',
      businessCode: '',
      description: '',
      teamParentId: '',
      teamParentEntityType: '',
      teamParentName: '',
      modelJson: '',
      providerTypeId: ''
    };
    return new ProviderCrudWrapper(entityIn || emptyData, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<ProviderCrudWrapper> {
    const data = await hcclService.getProviderById(id).toPromise();
    if (!data) {
      throw new Error('Provider not found');
    }
    return new ProviderCrudWrapper(data, hcclService);
  }

  constructor(data: ProviderGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  getDisplayText(entity?: ProviderGETData): string {
    const data = entity || this.getData();
    if (data.name) {
      return data.name;
    }
    if (data.businessCode) {
      return data.businessCode;
    }
    return data.id || 'Unknown Provider';
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

  getTeamParentId(): string {
    return this.getData().teamParentId || '';
  }

  getTeamParentEntityType(): string {
    return this.getData().teamParentEntityType || '';
  }

  getTeamParentName(): string {
    return this.getData().teamParentName || '';
  }

  getModelJson(): string {
    return this.getData().modelJson || '';
  }

  getProviderTypeId(): string {
    return this.getData().providerTypeId || '';
  }

  getFkMenuCriteria(): ProviderCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  async getProviders(criteria?: ProviderCriteria): Promise<ProviderGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const results = await this.hcclService.findProviders(criteria || this.getFkMenuCriteria()).toPromise();
    return results?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const providers = await this.getProviders();
    return this.getMenuControlDataList("providers", this.getEntityType() + " Menu", providers, data);
  }
} 