// This template is for generating a CRUD component for an entity that has a FK Menu
// This was generated using entityName = CLSchool
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
import { CLSchoolCriteria, CLSchoolGETData, CLSchoolPOSTData, CLSchoolPUTData, HcclService, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
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
import { HcclOrganizationCrudComponent } from '@app/components/_crud/hcclorganization/hcclorganization-crud.component';

@Component({
  selector: 'app-clschool-crud',
  templateUrl: './clschool-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule,
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent, ReferenceDataComponent, HcclOrganizationCrudComponent],
  standalone: true
})
export class CLSchoolCrudComponent extends AbstractCrudComponent<CLSchoolCrudWrapper> implements OnInit, OnChanges {

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

  private validateOrganizationName(organizationName: string): string | null {
    if (organizationName && organizationName.length > 255) {
      return 'Organization Name must be less than 255 characters';
    }
    return null;
  }

  private validateAddressLine1(addressLine1: string): string | null {
    if (addressLine1 && addressLine1.length > 255) {
      return 'Address Line 1 must be less than 255 characters';
    }
    return null;
  }

  private validateAddressLine2(addressLine2: string): string | null {
    if (addressLine2 && addressLine2.length > 255) {
      return 'Address Line 2 must be less than 255 characters';
    }
    return null;
  }

  private validateAddressLine3(addressLine3: string): string | null {
    if (addressLine3 && addressLine3.length > 255) {
      return 'Address Line 3 must be less than 255 characters';
    }
    return null;
  }

  private validateAddressLine4(addressLine4: string): string | null {
    if (addressLine4 && addressLine4.length > 255) {
      return 'Address Line 4 must be less than 255 characters';
    }
    return null;
  }

  private validateDistrictCode(districtCode: string): string | null {
    if (districtCode && districtCode.length > 255) {
      return 'District Code must be less than 255 characters';
    }
    return null;
  }

  private validateDataOriginCode(dataOriginCode: string): string | null {
    if (dataOriginCode && dataOriginCode.length > 20) {
      return 'Data Origin Code must be less than 20 characters';
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
    
    const organizationNameError = this.validateOrganizationName(this.organizationName);
    if (organizationNameError) {
      errors.organizationName = { errorMessage: organizationNameError };
    }
    
    const addressLine1Error = this.validateAddressLine1(this.addressLine1);
    if (addressLine1Error) {
      errors.addressLine1 = { errorMessage: addressLine1Error };
    }
    
    const addressLine2Error = this.validateAddressLine2(this.addressLine2);
    if (addressLine2Error) {
      errors.addressLine2 = { errorMessage: addressLine2Error };
    }
    
    const addressLine3Error = this.validateAddressLine3(this.addressLine3);
    if (addressLine3Error) {
      errors.addressLine3 = { errorMessage: addressLine3Error };
    }
    
    const addressLine4Error = this.validateAddressLine4(this.addressLine4);
    if (addressLine4Error) {
      errors.addressLine4 = { errorMessage: addressLine4Error };
    }
    
    const districtCodeError = this.validateDistrictCode(this.districtCode);
    if (districtCodeError) {
      errors.districtCode = { errorMessage: districtCodeError };
    }
    
    const dataOriginCodeError = this.validateDataOriginCode(this.dataOriginCode);
    if (dataOriginCodeError) {
      errors.dataOriginCode = { errorMessage: dataOriginCodeError };
    }
    
    return errors;
  }

  private clearValidationErrors(): void {
    this.error = null;
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected async loadEntityByIdCall(id: string): Promise<CLSchoolCrudWrapper> {
    const clschool = await this.hcclService.getCLSchoolById(id).toPromise();
    if (!clschool) {
      throw new Error('CLSchool not found');
    }
    return new CLSchoolCrudWrapper(clschool, this.hcclService);
  }

  protected override async createEntityDataCall(entity: CLSchoolCrudWrapper): Promise<any> {
    const postData: CLSchoolPOSTData = {
      name: entity.getData().name || '',
      businessCode: entity.getData().businessCode || '',
      available: entity.getData().available || 0,
      organizationId: entity.getData().organizationId,
      dataOriginCode: entity.getData().dataOriginCode,
      organizationName: entity.getData().organizationName,
      addressLine1: entity.getData().addressLine1,
      addressLine2: entity.getData().addressLine2,
      addressLine3: entity.getData().addressLine3,
      addressLine4: entity.getData().addressLine4,
      districtCode: entity.getData().districtCode
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    // This is important - the requestCreate method returns { id: string, status: 201 }
    try {
      // The requestCreate method returns { id: string, status: 201 }
      const response = await this.hcclService.createCLSchool(postData);
      console.log('Create response:', response);
      this.clearValidationErrors(); // Clear errors on success
      return response;
    } catch (error) {
      console.error('Create error:', error);
      throw error;
    }

  }

  protected override async updateEntityDataCall(entity: CLSchoolCrudWrapper): Promise<void> {
    const putData: CLSchoolPUTData = {
      name: entity.getData().name || '',
      businessCode: entity.getData().businessCode || '',
      available: entity.getData().available || 0,
      organizationId: entity.getData().organizationId,
      dataOriginCode: entity.getData().dataOriginCode,
      organizationName: entity.getData().organizationName,
      addressLine1: entity.getData().addressLine1,
      addressLine2: entity.getData().addressLine2,
      addressLine3: entity.getData().addressLine3,
      addressLine4: entity.getData().addressLine4,
      districtCode: entity.getData().districtCode
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    await this.hcclService.updateCLSchoolById(entity.getData().id!, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteCLSchoolById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting CLSchool:', error);
      return false;
    }
  }

  public override newEmptyWrapper(): CLSchoolCrudWrapper {
    return CLSchoolCrudWrapper.newInstanceForCreate(this.hcclService);
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

  public get organizationName(): string {
    return this.getCurrentEntity()?.getData()?.organizationName || '';
  }

  public set organizationName(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().organizationName = value;
    }
  }

  public get addressLine1(): string {
    return this.getCurrentEntity()?.getData()?.addressLine1 || '';
  }

  public set addressLine1(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().addressLine1 = value;
    }
  }

  public get addressLine2(): string {
    return this.getCurrentEntity()?.getData()?.addressLine2 || '';
  }

  public set addressLine2(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().addressLine2 = value;
    }
  }

  public get addressLine3(): string {
    return this.getCurrentEntity()?.getData()?.addressLine3 || '';
  }

  public set addressLine3(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().addressLine3 = value;
    }
  }

  public get addressLine4(): string {
    return this.getCurrentEntity()?.getData()?.addressLine4 || '';
  }

  public set addressLine4(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().addressLine4 = value;
    }
  }

  public get districtCode(): string {
    return this.getCurrentEntity()?.getData()?.districtCode || '';
  }

  public set districtCode(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().districtCode = value;
    }
  }

  public get dataOriginCode(): string {
    return this.getCurrentEntity()?.getData()?.dataOriginCode || '';
  }

  public set dataOriginCode(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().dataOriginCode = value;
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

  public get organizationId(): string {
    return this.getCurrentEntity()?.getData()?.organizationId || '';
  }

  public set organizationId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().organizationId = value;
    }
  }

  public override get dateCreated(): any {
    return this.getCurrentEntity()?.getData()?.dateCreated;
  }

  public override get dateLastUpdated(): any {
    return this.getCurrentEntity()?.getData()?.dateLastUpdated;
  }

  public override get createdByInfo(): any {
    return this.getCurrentEntity()?.getData()?.createdByInfo;
  }

  public override get lastUpdatedByInfo(): any {
    return this.getCurrentEntity()?.getData()?.lastUpdatedByInfo;
  }

  public createWrapper(clschoolData: CLSchoolGETData): CLSchoolCrudWrapper {
    return new CLSchoolCrudWrapper(clschoolData, this.hcclService);
  }

  getCLSchoolFkMenuCriteria(): CLSchoolCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected clschoolMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: CLSchoolCrudWrapper): Promise<void> {
    const criteria = this.getCLSchoolFkMenuCriteria();
    const results = await this.hcclService.findCLSchools(criteria).toPromise();
    this.clschoolMenu = await entity.getFkMenu("clschools", this.id);
  }
}

export class CLSchoolCrudWrapper extends EntityWrapper<CLSchoolGETData> {

  public static newInstanceForCreate(hcclService: HcclService, entityIn?: CLSchoolGETData | null): CLSchoolCrudWrapper {
    const emptyData: CLSchoolGETData = {
      name: '',
      businessCode: '',
      available: 0
    };
    return new CLSchoolCrudWrapper(entityIn || emptyData, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<CLSchoolCrudWrapper> {
    const data = await hcclService.getCLSchoolById(id).toPromise();
    if (!data) {
      throw new Error('CLSchool not found');
    }
    return new CLSchoolCrudWrapper(data, hcclService);
  }

  constructor(data: CLSchoolGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  getDisplayText(entity?: CLSchoolGETData): string {
    const data = entity || this.getData();
    if (data.name) {
      return data.name;
    }
    if (data.businessCode) {
      return data.businessCode;
    }
    return data.id || 'Unknown CLSchool';
  }

  getFullName(): string {
    return this.getData().name || '';
  }

  getBusinessCode(): string {
    return this.getData().businessCode || '';
  }

  getOrganizationName(): string {
    return this.getData().organizationName || '';
  }

  getAvailable(): number {
    return this.getData().available || 0;
  }

  isActive(): boolean {
    return this.getData().available === 1;
  }

  getFkMenuCriteria(): CLSchoolCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  async getCLSchools(criteria?: CLSchoolCriteria): Promise<CLSchoolGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const results = await this.hcclService.findCLSchools(criteria || this.getFkMenuCriteria()).toPromise();
    return results?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const clschools = await this.getCLSchools();
    return this.getMenuControlDataList("clschools", this.getEntityType() + " Menu", clschools, data);
  }
} 