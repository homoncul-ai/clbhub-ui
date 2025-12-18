import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, Validators } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { HcclUserProfileCriteria, HcclUserProfileGETData, HcclUserProfilePOSTData, HcclUserProfilePUTData, HcclService, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { Observable, map } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';
import { ReferenceDataComponent } from '@app/components/_global/reference-data/reference-data.component';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';
import { HccluserCrudComponent } from '@app/components/_crud/hccluser/hccluser-crud.component';
import { HcclOrganizationCrudComponent } from '@app/components/_crud/hcclorganization/hcclorganization-crud.component';
import { CrudInternalDataComponent } from '@app/components/_global/crud-internal-data/crud-internal-data.component';
import { StdMdbPhoneComponent } from '@app/components/_global/std-mdb-phone/std-mdb-phone.component';

@Component({
  selector: 'app-org-school-staff-crud',
  templateUrl: './org-school-staff-crud.component.html',
  styleUrl: '../../../components/_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule, 
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent, ReferenceDataComponent,
    HccluserCrudComponent, HcclOrganizationCrudComponent, CrudInternalDataComponent, StdMdbPhoneComponent],
  standalone: true
})
export class OrgSchoolStaffCrudComponent extends AbstractCrudComponent<HcclUserProfileCrudWrapper> implements OnInit, OnChanges {
/**
 * This is a component that will be used to create, read, update and delete HCCL User Profiles
 * It will use the AbstractCrudComponent to handle the CRUD operations
 * It will use the HcclUserProfileGETData and HcclUserProfilePOSTData interfaces to handle the data
 * It will use the HcclService to handle the data
 * 
 * Input parameter:
 * - id?: string - Optional HCCL User Profile ID to load a specific HCCL User Profile for viewing/editing
 * 
 * If no ID is provided, the component will load the full list of HCCL User Profiles.
 * If an ID is provided, the component will load that specific HCCL User Profile and show it in detail mode.
 * 
 * Create a wrapper class that extends EntityWrapper<HcclUserProfileGETData>
 * and implement the abstract methods of the AbstractCrudComponent
 */

  
  constructor() {
    super();
  }

  // Error property for form validation
  public error: any = null;

  // Validation methods
  private validateUserId(userId: string): string | null {
    if (!userId || userId.trim() === '') {
      return 'User is required';
    }
    return null;
  }

  private validateUserCode(userCode: string): string | null {
    if (!userCode || userCode.trim() === '') {
      return 'User Code is required';
    }
    if (userCode.length > 255) {
      return 'User Code must be less than 255 characters';
    }
    return null;
  }

  private validateOrganizationId(organizationId: string): string | null {
    if (!organizationId || organizationId.trim() === '') {
      return 'Organization is required';
    }
    return null;
  }

  private validateProfileTypeCode(profileTypeCode: string): string | null {
    if (!profileTypeCode || profileTypeCode.trim() === '') {
      return 'Profile Type Code is required';
    }
    if (profileTypeCode.length > 255) {
      return 'Profile Type Code must be less than 255 characters';
    }
    return null;
  }

  private validateUserEmail(userEmail: string): string | null {
    if (userEmail && userEmail.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userEmail)) {
        return 'User Email must be a valid email format';
      }
    }
    return null;
  }

  private validateCellPhoneNumber(cellPhoneNumber: string): string | null {
    if (cellPhoneNumber && cellPhoneNumber.trim() !== '') {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(cellPhoneNumber.replace(/[\s\-\(\)]/g, ''))) {
        return 'Cell Phone Number must be a valid phone format';
      }
    }
    return null;
  }

  private validateWorkPhoneNumber(workPhoneNumber: string): string | null {
    if (workPhoneNumber && workPhoneNumber.trim() !== '') {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(workPhoneNumber.replace(/[\s\-\(\)]/g, ''))) {
        return 'Work Phone Number must be a valid phone format';
      }
    }
    return null;
  }

  private validateExternalUserId(externalUserId: string): string | null {
    // External User ID is optional, so no validation needed
    return null;
  }

  private validateExternalUserEntityType(externalUserEntityType: string): string | null {
    // External User Entity Type is optional, so no validation needed
    return null;
  }

  private validateExternalUserName(externalUserName: string): string | null {
    // External User Name is optional, so no validation needed
    return null;
  }

  // Validate all fields and return error object
  private validateForm(): any {
    const errors: any = {};
    
    if (this.entity) {
      const data = this.entity.getData();
      
      const userIdError = this.validateUserId(data.userId || '');
      if (userIdError) errors.userId = userIdError;
      
      const userCodeError = this.validateUserCode(data.userCode || '');
      if (userCodeError) errors.userCode = userCodeError;
      
      const organizationIdError = this.validateOrganizationId(data.organizationId || '');
      if (organizationIdError) errors.organizationId = organizationIdError;
      
      const profileTypeCodeError = this.validateProfileTypeCode(data.profileTypeCode || '');
      if (profileTypeCodeError) errors.profileTypeCode = profileTypeCodeError;
      
      const userEmailError = this.validateUserEmail(data.userEmail || '');
      if (userEmailError) errors.userEmail = userEmailError;
      
      const cellPhoneNumberError = this.validateCellPhoneNumber(data.cellPhoneNumber || '');
      if (cellPhoneNumberError) errors.cellPhoneNumber = cellPhoneNumberError;
      
      const workPhoneNumberError = this.validateWorkPhoneNumber(data.workPhoneNumber || '');
      if (workPhoneNumberError) errors.workPhoneNumber = workPhoneNumberError;
      
      const externalUserIdError = this.validateExternalUserId(data.externalUserId || '');
      if (externalUserIdError) errors.externalUserId = externalUserIdError;
      
      const externalUserEntityTypeError = this.validateExternalUserEntityType(data.externalUserEntityType || '');
      if (externalUserEntityTypeError) errors.externalUserEntityType = externalUserEntityTypeError;
      
      const externalUserNameError = this.validateExternalUserName(data.externalUserName || '');
      if (externalUserNameError) errors.externalUserName = externalUserNameError;
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  }

  private clearValidationErrors(): void {
    this.error = null;
  }

  override ngOnInit(): void { 
    super.ngOnInit();
    this.clearValidationErrors();
    
    
  }

  protected async loadEntityByIdCall(id: string): Promise<HcclUserProfileCrudWrapper> {
    const userProfile = await this.hcclService.getHcclUserProfileById(id).toPromise();
    if (!userProfile) {
      throw new Error('HCCL User Profile not found');
    }
    return new HcclUserProfileCrudWrapper(userProfile, this.hcclService);
  }

  protected override async createEntityDataCall(entity: HcclUserProfileCrudWrapper): Promise<any> {
    const data = entity.getData();
    const postData: HcclUserProfilePOSTData = {
      userId: data.userId || '',
      userCode: data.userCode || '',
      messageHandle: data.messageHandle || '',
      organizationId: data.organizationId || '',
      profileTypeCode: data.profileTypeCode || '',
      userEmail: data.userEmail,
      cellPhoneNumber: data.cellPhoneNumber,
      workPhoneNumber: data.workPhoneNumber,
      externalUserId: data.externalUserId,
      externalUserEntityType: data.externalUserEntityType,
      externalUserName: data.externalUserName,
      available: data.available || 1,
      personId: data.personId || ''
    };
    
    return this.hcclService.createHcclUserProfile(postData).toPromise();
  }

  protected override async updateEntityDataCall(entity: HcclUserProfileCrudWrapper): Promise<void> {
    const data = entity.getData();
    const putData: HcclUserProfilePUTData = {
      userId: data.userId || '',
      userCode: data.userCode || '',
      messageHandle: data.messageHandle || '',
      organizationId: data.organizationId || '',
      profileTypeCode: data.profileTypeCode || '',
      userEmail: data.userEmail,
      cellPhoneNumber: data.cellPhoneNumber,
      workPhoneNumber: data.workPhoneNumber,
      externalUserId: data.externalUserId,
      externalUserEntityType: data.externalUserEntityType,
      externalUserName: data.externalUserName,
      available: data.available || 1,
      personId: data.personId || '',
      name: data.theUser?.name || ''
    };
    
    await this.hcclService.updateHcclUserProfileById(data.id || '', putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    await this.hcclService.deleteHcclUserProfileById(id).toPromise();
    return true;
  }

  public override newEmptyWrapper(): HcclUserProfileCrudWrapper {
    return HcclUserProfileCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  // Getter and setter methods for form binding

  public get name(): string {
    return this.entity?.getData().theUser?.name || '';
  }
  public set name(value: string) {
    if (this.entity) {
      this.entity.getData().theUser?.name;
    }
  }

  public get userId(): string {
    return this.entity?.getData().userId || '';
  }

  public set userId(value: string) {
    if (this.entity) {
      this.entity.getData().userId = value;
    }
  }

  public get userCode(): string {
    return this.entity?.getData().userCode || '';
  }

  public set userCode(value: string) {
    if (this.entity) {
      this.entity.getData().userCode = value;
    }
  }

  public get organizationId(): string {
    return this.entity?.getData().organizationId || '';
  }

  public set organizationId(value: string) {
    if (this.entity) {
      this.entity.getData().organizationId = value;
    }
  }

  public get profileTypeCode(): string {
    return this.entity?.getData().profileTypeCode || '';
  }

  public set profileTypeCode(value: string) {
    if (this.entity) {
      this.entity.getData().profileTypeCode = value;
    }
  }

  public get userEmail(): string {
    return this.entity?.getData().userEmail || '';
  }

  public set userEmail(value: string) {
    if (this.entity) {
      this.entity.getData().userEmail = value;
    }
  }

  public get cellPhoneNumber(): string {
    return this.entity?.getData().cellPhoneNumber || '';
  }

  public set cellPhoneNumber(value: string) {
    if (this.entity) {
      this.entity.getData().cellPhoneNumber = value;
    }
  }

  public get workPhoneNumber(): string {
    return this.entity?.getData().workPhoneNumber || '';
  }

  public set workPhoneNumber(value: string) {
    if (this.entity) {
      this.entity.getData().workPhoneNumber = value;
    }
  }

  public get externalUserId(): string {
    return this.entity?.getData().externalUserId || '';
  }

  public set externalUserId(value: string) {
    if (this.entity) {
      this.entity.getData().externalUserId = value;
    }
  }

  public get externalUserEntityType(): string {
    return this.entity?.getData().externalUserEntityType || '';
  }

  public set externalUserEntityType(value: string) {
    if (this.entity) {
      this.entity.getData().externalUserEntityType = value;
    }
  }

  public get externalUserName(): string {
    return this.entity?.getData().externalUserName || '';
  }

  public set externalUserName(value: string) {
    if (this.entity) {
      this.entity.getData().externalUserName = value;
    }
  }

  public get available(): number {
    return super.availableValue(this.entity?.getData().available)
  }

  public set available(value: number) {
    alert('setting available ' + value);
    if (this.entity) {
      this.entity.getData().available = value;
    }
  }

  // Audit fields for display
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

  public createWrapper(userProfileData: HcclUserProfileGETData): HcclUserProfileCrudWrapper {
    return new HcclUserProfileCrudWrapper(userProfileData, this.hcclService);
  }

  getHcclUserProfileFkMenuCriteria(): HcclUserProfileCriteria {
    return {
      available: 1
    };
  }

  protected hcclUserProfileMenu: MenuControlDataList | null = null;

  protected override async prepareMenus(entity: HcclUserProfileCrudWrapper): Promise<void> {
    return Promise.resolve();
  }
}

export class HcclUserProfileCrudWrapper extends EntityWrapper<HcclUserProfileGETData> {

  public static newInstanceForCreate(hcclService: HcclService, entityIn?: HcclUserProfileGETData | null): HcclUserProfileCrudWrapper {
    const entity = entityIn || {
      id: '0',
      userId: '',
      userCode: '',
      organizationId: '',
      profileTypeCode: '',
      userEmail: '',
      cellPhoneNumber: '',
      workPhoneNumber: '',
      externalUserId: '',
      externalUserEntityType: '',
      externalUserName: '',
      available: 1
    } as HcclUserProfileGETData;
    return new HcclUserProfileCrudWrapper(entity, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<HcclUserProfileCrudWrapper> {
    const userProfile = await hcclService.getHcclUserProfileById(id).toPromise();
    if (userProfile) {
      return new HcclUserProfileCrudWrapper(userProfile, hcclService);
    }
    throw new Error('HCCL User Profile not found');
  }

  constructor(data: HcclUserProfileGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }
  
  getDisplayText(entity?: HcclUserProfileGETData): string {
    const data = entity || this.data;
    const userCode = data.userCode || '';
    const profileTypeCode = data.profileTypeCode || '';
    if (userCode && profileTypeCode) {
      return `${userCode} (${profileTypeCode})`;
    } else if (userCode) {
      return userCode;
    } else if (profileTypeCode) {
      return profileTypeCode;
    } else {
      return 'Unnamed HCCL User Profile';
    }
  }

  getUserCode(): string {
    return this.data.userCode || '';
  }

  getProfileTypeCode(): string {
    return this.data.profileTypeCode || '';
  }

  getUserId(): string {
    return this.data.userId || '';
  }

  getOrganizationId(): string {
    return this.data.organizationId || '';
  }

  getUserEmail(): string {
    return this.data.userEmail || '';
  }

  getCellPhoneNumber(): string {
    return this.data.cellPhoneNumber || '';
  }

  getWorkPhoneNumber(): string {
    return this.data.workPhoneNumber || '';
  }

  getExternalUserId(): string {
    return this.data.externalUserId || '';
  }

  getExternalUserEntityType(): string {
    return this.data.externalUserEntityType || '';
  }

  getExternalUserName(): string {
    return this.data.externalUserName || '';
  }

  getAvailable(): number {
    return this.data.available || 1;
  }

  isActive(): boolean {
    return this.data.available === 1;
  }

  getFkMenuCriteria(): HcclUserProfileCriteria {
    return {
      available: 1
    };
  }

  async getHcclUserProfiles(criteria?: HcclUserProfileCriteria): Promise<HcclUserProfileGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const searchCriteria = criteria || this.getFkMenuCriteria();
    const response = await this.hcclService.findHcclUserProfiles(searchCriteria).toPromise();
    return response?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    console.log('getFkMenu', menuHint, data);
    var criteria = this.getFkMenuCriteria();
    var userProfiles = await this.getHcclUserProfiles(criteria);
    var menuItems = userProfiles.map(userProfile => {
      return {
        id: userProfile.id,
        name: userProfile.userCode || userProfile.profileTypeCode || 'Unnamed Profile'
      } as MenuControlData;
    });
    return { menuItems: menuItems } as MenuControlDataList;
  }
} 