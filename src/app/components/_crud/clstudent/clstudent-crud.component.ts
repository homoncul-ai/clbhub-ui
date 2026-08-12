// This template is for generating a CRUD component for an entity that has a FK Menu
// This was generated using entityName = CLStudent
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
import { CLStudentCriteria, CLStudentGETData, CLStudentPOSTData, CLStudentPUTData, HcclService, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
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
import { CLSchoolCrudComponent } from '@app/components/_crud/clschool/clschool-crud.component';

@Component({
  selector: 'app-clstudent-crud',
  templateUrl: './clstudent-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule,
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent, ReferenceDataComponent, CLSchoolCrudComponent],
  standalone: true
})
export class CLStudentCrudComponent extends AbstractCrudComponent<CLStudentCrudWrapper> implements OnInit, OnChanges {

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
      return 'Email must be less than 255 characters';
    }
    return null;
  }

  private validateCellPhoneNumber(cellPhoneNumber: string): string | null {
    if (cellPhoneNumber && cellPhoneNumber.length > 255) {
      return 'Cell Phone must be less than 255 characters';
    }
    return null;
  }

  private validateWorkPhoneNumber(workPhoneNumber: string): string | null {
    if (workPhoneNumber && workPhoneNumber.length > 255) {
      return 'Work Phone must be less than 255 characters';
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
    
    return errors;
  }

  private clearValidationErrors(): void {
    this.error = null;
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected async loadEntityByIdCall(id: string): Promise<CLStudentCrudWrapper> {
    const clstudent = await this.hcclService.getCLStudentById(id).toPromise();
    if (!clstudent) {
      throw new Error('CLStudent not found');
    }
    return new CLStudentCrudWrapper(clstudent, this.hcclService);
  }

  protected override async createEntityDataCall(entity: CLStudentCrudWrapper): Promise<any> {
    const postData: CLStudentPOSTData = {
      name: entity.getData().name || '',
      businessCode: entity.getData().businessCode || '',
      available: entity.getData().available || 1,
      firstName: entity.getData().firstName || '',
      lastName: entity.getData().lastName || '',
      schoolId: entity.getData().schoolId || '',
      organizationId: entity.getData().organizationId,
      dataOriginCode: entity.getData().dataOriginCode,
      userProfileId: entity.getData().userProfileId,
      userId: entity.getData().userId,
      userEmail: entity.getData().userEmail,
      cellPhoneNumber: entity.getData().cellPhoneNumber,
      workPhoneNumber: entity.getData().workPhoneNumber
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    // This is important - the requestCreate method returns { id: string, status: 201 }
    try {
      // The requestCreate method returns { id: string, status: 201 }
      const response = await this.hcclService.createCLStudent(postData);
      console.log('Create response:', response);
      this.clearValidationErrors(); // Clear errors on success
      return response;
    } catch (error) {
      console.error('Create error:', error);
      throw error;
    }

  }

  protected override async updateEntityDataCall(entity: CLStudentCrudWrapper): Promise<void> {
    const putData: CLStudentPUTData = {
      name: entity.getData().name || '',
      businessCode: entity.getData().businessCode || '',
      available: entity.getData().available || 1,
      firstName: entity.getData().firstName || '',
      lastName: entity.getData().lastName || '',
      schoolId: entity.getData().schoolId || '',
      organizationId: entity.getData().organizationId,
      dataOriginCode: entity.getData().dataOriginCode,
      userProfileId: entity.getData().userProfileId,
      userId: entity.getData().userId,
      userEmail: entity.getData().userEmail,
      cellPhoneNumber: entity.getData().cellPhoneNumber,
      workPhoneNumber: entity.getData().workPhoneNumber
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    await this.hcclService.updateCLStudentById(entity.getData().id!, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteCLStudentById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting CLStudent:', error);
      return false;
    }
  }

  public override newEmptyWrapper(): CLStudentCrudWrapper {
    return CLStudentCrudWrapper.newInstanceForCreate(this.hcclService);
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

  public get available(): number {
    return this.getCurrentEntity()?.getData()?.available || 0;
  }

  public set available(value: number) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().available = value;
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

  public get organizationId(): string {
    return this.getCurrentEntity()?.getData()?.organizationId || '';
  }

  public set organizationId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().organizationId = value;
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

  public createWrapper(clstudentData: CLStudentGETData): CLStudentCrudWrapper {
    return new CLStudentCrudWrapper(clstudentData, this.hcclService);
  }

  getCLStudentFkMenuCriteria(): CLStudentCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected clstudentMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: CLStudentCrudWrapper): Promise<void> {
    const criteria = this.getCLStudentFkMenuCriteria();
    const results = await this.hcclService.findCLStudents(criteria).toPromise();
    this.clstudentMenu = await entity.getFkMenu("clstudents", this.id);
  }
}

export class CLStudentCrudWrapper extends EntityWrapper<CLStudentGETData> {

  public static newInstanceForCreate(hcclService: HcclService, entityIn?: CLStudentGETData | null): CLStudentCrudWrapper {
    const emptyData: CLStudentGETData = {
      name: '',
      businessCode: '',
      available: 1,
      firstName: '',
      lastName: '',
      schoolId: ''
    };
    return new CLStudentCrudWrapper(entityIn || emptyData, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<CLStudentCrudWrapper> {
    const data = await hcclService.getCLStudentById(id).toPromise();
    if (!data) {
      throw new Error('CLStudent not found');
    }
    return new CLStudentCrudWrapper(data, hcclService);
  }

  constructor(data: CLStudentGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  getDisplayText(entity?: CLStudentGETData): string {
    const data = entity || this.getData();
    if (data.name) {
      return data.name;
    }
    if (data.businessCode) {
      return data.businessCode;
    }
    return data.id || 'Unknown CL Citizen';
  }

  getFullName(): string {
    const data = this.getData();
    const firstName = data.firstName || '';
    const lastName = data.lastName || '';
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    return data.name || '';
  }

  getEmail(): string {
    return this.getData().userEmail || '';
  }

  getPhone(): string {
    return this.getData().cellPhoneNumber || this.getData().workPhoneNumber || '';
  }

  getOrganizationId(): string {
    return this.getData().organizationId || '';
  }

  getAvailable(): number {
    return this.getData().available || 0;
  }

  isActive(): boolean {
    return this.getData().available === 1;
  }

  getFkMenuCriteria(): CLStudentCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  async getCLStudents(criteria?: CLStudentCriteria): Promise<CLStudentGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const results = await this.hcclService.findCLStudents(criteria || this.getFkMenuCriteria()).toPromise();
    return results?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const clstudents = await this.getCLStudents();
    return this.getMenuControlDataList("clstudents", this.getEntityType() + " Menu", clstudents, data);
  }
}