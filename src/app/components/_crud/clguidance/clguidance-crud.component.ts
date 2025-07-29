// This template is for generating a CRUD component for an entity that has a FK Menu
// This was generated using entityName = CLGuidance
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
import { CLGuidanceCriteria, CLGuidanceGETData, CLGuidancePOSTData, CLGuidancePUTData, HcclService, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
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
import { CLSchoolCrudComponent } from '@app/components/_crud/clschool/clschool-crud.component';

@Component({
  selector: 'app-clguidance-crud',
  templateUrl: './clguidance-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule,
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent, ReferenceDataComponent, HcclOrganizationCrudComponent, CLSchoolCrudComponent],
  standalone: true
})
export class CLGuidanceCrudComponent extends AbstractCrudComponent<CLGuidanceCrudWrapper> implements OnInit, OnChanges {

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

  private validateFirstName(firstName: string): string | null {
    if (!firstName || firstName.trim() === '') {
      return 'First Name is required';
    }
    if (firstName.length > 255) {
      return 'First Name must be less than 255 characters';
    }
    return null;
  }

  private validateLastName(lastName: string): string | null {
    if (!lastName || lastName.trim() === '') {
      return 'Last Name is required';
    }
    if (lastName.length > 255) {
      return 'Last Name must be less than 255 characters';
    }
    return null;
  }

  private validateUserEmail(userEmail: string): string | null {
    if (userEmail && userEmail.length > 255) {
      return 'User Email must be less than 255 characters';
    }
    return null;
  }

  private validateCellPhoneNumber(cellPhoneNumber: string): string | null {
    if (cellPhoneNumber && cellPhoneNumber.length > 255) {
      return 'Cell Phone Number must be less than 255 characters';
    }
    return null;
  }

  private validateWorkPhoneNumber(workPhoneNumber: string): string | null {
    if (workPhoneNumber && workPhoneNumber.length > 255) {
      return 'Work Phone Number must be less than 255 characters';
    }
    return null;
  }

  private validateJobTitle(jobTitle: string): string | null {
    if (jobTitle && jobTitle.length > 255) {
      return 'Job Title must be less than 255 characters';
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
    
    const firstNameError = this.validateFirstName(this.firstName);
    if (firstNameError) {
      errors.firstName = { errorMessage: firstNameError };
    }
    
    const lastNameError = this.validateLastName(this.lastName);
    if (lastNameError) {
      errors.lastName = { errorMessage: lastNameError };
    }
    
    const userEmailError = this.validateUserEmail(this.userEmail);
    if (userEmailError) {
      errors.userEmail = { errorMessage: userEmailError };
    }
    
    const cellPhoneNumberError = this.validateCellPhoneNumber(this.cellPhoneNumber);
    if (cellPhoneNumberError) {
      errors.cellPhoneNumber = { errorMessage: cellPhoneNumberError };
    }
    
    const workPhoneNumberError = this.validateWorkPhoneNumber(this.workPhoneNumber);
    if (workPhoneNumberError) {
      errors.workPhoneNumber = { errorMessage: workPhoneNumberError };
    }
    
    const jobTitleError = this.validateJobTitle(this.jobTitle);
    if (jobTitleError) {
      errors.jobTitle = { errorMessage: jobTitleError };
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

  override ngOnChanges(changes: SimpleChanges): void {
    // Implementation for OnChanges interface
  }

  protected async loadEntityByIdCall(id: string): Promise<CLGuidanceCrudWrapper> {
    const clguidance = await this.hcclService.getCLGuidanceById(id).toPromise();
    if (!clguidance) {
      throw new Error('CLGuidance not found');
    }
    return new CLGuidanceCrudWrapper(clguidance, this.hcclService);
  }

  protected override async createEntityDataCall(entity: CLGuidanceCrudWrapper): Promise<any> {
    const postData: CLGuidancePOSTData = {
      organizationId: entity.getData().organizationId || '',
      name: entity.getData().name || '',
      businessCode: entity.getData().businessCode || '',
      available: entity.getData().available || 0,
      dataOriginCode: entity.getData().dataOriginCode || '',
      userProfileId: entity.getData().userProfileId || '',
      userId: entity.getData().userId || '',
      userEmail: entity.getData().userEmail || '',
      cellPhoneNumber: entity.getData().cellPhoneNumber || '',
      workPhoneNumber: entity.getData().workPhoneNumber || '',
      firstName: entity.getData().firstName || '',
      lastName: entity.getData().lastName || '',
      schoolId: entity.getData().schoolId || '',
      jobTitle: entity.getData().jobTitle || ''
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    // This is important - the requestCreate method returns { id: string, status: 201 }
    try {
      // The requestCreate method returns { id: string, status: 201 }
      const response = await this.hcclService.createCLGuidance(postData);
      console.log('Create response:', response);
      this.clearValidationErrors(); // Clear errors on success
      return response;
    } catch (error) {
      console.error('Create error:', error);
      throw error;
    }

  }

  protected override async updateEntityDataCall(entity: CLGuidanceCrudWrapper): Promise<void> {
    const putData: CLGuidancePUTData = {
      organizationId: entity.getData().organizationId || '',
      name: entity.getData().name || '',
      businessCode: entity.getData().businessCode || '',
      available: entity.getData().available || 0,
      dataOriginCode: entity.getData().dataOriginCode || '',
      userProfileId: entity.getData().userProfileId || '',
      userId: entity.getData().userId || '',
      userEmail: entity.getData().userEmail || '',
      cellPhoneNumber: entity.getData().cellPhoneNumber || '',
      workPhoneNumber: entity.getData().workPhoneNumber || '',
      firstName: entity.getData().firstName || '',
      lastName: entity.getData().lastName || '',
      schoolId: entity.getData().schoolId || '',
      jobTitle: entity.getData().jobTitle || ''
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    await this.hcclService.updateCLGuidanceById(entity.getData().id!, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteCLGuidanceById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting CLGuidance:', error);
      return false;
    }
  }

  public override newEmptyWrapper(): CLGuidanceCrudWrapper {
    return CLGuidanceCrudWrapper.newInstanceForCreate(this.hcclService);
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

  public get available(): number {
    return this.getCurrentEntity()?.getData()?.available || 0;
  }

  public set available(value: number) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().available = value;
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

  public get userProfileId(): string {
    return this.getCurrentEntity()?.getData()?.userProfileId || '';
  }

  public set userProfileId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().userProfileId = value;
    }
  }

  public get userId(): string {
    return this.getCurrentEntity()?.getData()?.userId || '';
  }

  public set userId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().userId = value;
    }
  }

  public get userEmail(): string {
    return this.getCurrentEntity()?.getData()?.userEmail || '';
  }

  public set userEmail(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().userEmail = value;
    }
  }

  public get cellPhoneNumber(): string {
    return this.getCurrentEntity()?.getData()?.cellPhoneNumber || '';
  }

  public set cellPhoneNumber(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().cellPhoneNumber = value;
    }
  }

  public get workPhoneNumber(): string {
    return this.getCurrentEntity()?.getData()?.workPhoneNumber || '';
  }

  public set workPhoneNumber(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().workPhoneNumber = value;
    }
  }

  public get firstName(): string {
    return this.getCurrentEntity()?.getData()?.firstName || '';
  }

  public set firstName(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().firstName = value;
    }
  }

  public get lastName(): string {
    return this.getCurrentEntity()?.getData()?.lastName || '';
  }

  public set lastName(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().lastName = value;
    }
  }

  public get schoolId(): string {
    return this.getCurrentEntity()?.getData()?.schoolId || '';
  }

  public set schoolId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().schoolId = value;
    }
  }

  public get jobTitle(): string {
    return this.getCurrentEntity()?.getData()?.jobTitle || '';
  }

  public set jobTitle(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().jobTitle = value;
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

  public createWrapper(clguidanceData: CLGuidanceGETData): CLGuidanceCrudWrapper {
    return new CLGuidanceCrudWrapper(clguidanceData, this.hcclService);
  }

  getCLGuidanceFkMenuCriteria(): CLGuidanceCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected clguidanceMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: CLGuidanceCrudWrapper): Promise<void> {
    const criteria = this.getCLGuidanceFkMenuCriteria();
    const results = await this.hcclService.findCLGuidances(criteria).toPromise();
    this.clguidanceMenu = await entity.getFkMenu("clguidances", this.id);
  }
}

export class CLGuidanceCrudWrapper extends EntityWrapper<CLGuidanceGETData> {

  public static newInstanceForCreate(hcclService: HcclService, entityIn?: CLGuidanceGETData | null): CLGuidanceCrudWrapper {
    const emptyData: CLGuidanceGETData = {
      name: '',
      businessCode: '',
      available: 0,
      firstName: '',
      lastName: '',
      schoolId: ''
    };
    return new CLGuidanceCrudWrapper(entityIn || emptyData, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<CLGuidanceCrudWrapper> {
    const data = await hcclService.getCLGuidanceById(id).toPromise();
    if (!data) {
      throw new Error('CLGuidance not found');
    }
    return new CLGuidanceCrudWrapper(data, hcclService);
  }

  constructor(data: CLGuidanceGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  getDisplayText(entity?: CLGuidanceGETData): string {
    const data = entity || this.getData();
    if (data.name) {
      return data.name;
    }
    if (data.businessCode) {
      return data.businessCode;
    }
    return data.id || 'Unknown CLGuidance';
  }

  getFullName(): string {
    return this.getData().name || '';
  }

  getBusinessCode(): string {
    return this.getData().businessCode || '';
  }

  getFirstName(): string {
    return this.getData().firstName || '';
  }

  getLastName(): string {
    return this.getData().lastName || '';
  }

  getAvailable(): number {
    return this.getData().available || 0;
  }

  isActive(): boolean {
    return this.getData().available === 1;
  }

  getFkMenuCriteria(): CLGuidanceCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  async getCLGuidances(criteria?: CLGuidanceCriteria): Promise<CLGuidanceGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const results = await this.hcclService.findCLGuidances(criteria || this.getFkMenuCriteria()).toPromise();
    return results?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const clguidances = await this.getCLGuidances();
    return this.getMenuControlDataList("clguidances", this.getEntityType() + " Menu", clguidances, data);
  }
} 