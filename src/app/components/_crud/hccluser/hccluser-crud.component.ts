import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, Validators } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { HcclUserCriteria, HcclUserGETData, HcclUserPOSTData, HcclUserPUTData, HcclService, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { Observable, map } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';

@Component({
  selector: 'app-hccluser-crud',
  templateUrl: './hccluser-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule, 
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent],
  standalone: true
})
export class HccluserCrudComponent extends AbstractCrudComponent<HcclUserCrudWrapper> implements OnInit, OnChanges {
/**
 * This is a component that will be used to create, read, update and delete HCCL Users
 * It will use the AbstractCrudComponent to handle the CRUD operations
 * It will use the HcclUserGETData and HcclUserPOSTData interfaces to handle the data
 * It will use the HcclService to handle the data
 * 
 * Input parameter:
 * - id?: string - Optional HCCL User ID to load a specific HCCL User for viewing/editing
 * 
 * If no ID is provided, the component will load the full list of HCCL Users.
 * If an ID is provided, the component will load that specific HCCL User and show it in detail mode.
 * 
 * Create a wrapper class that extends EntityWrapper<HcclUserGETData>
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

  // Clear validation errors
  private clearValidationErrors(): void {
    this.error = null;
  }

     /** Standard boiler plate for ngOnInit */
  override ngOnInit(): void {
    super.ngOnInit();
    this.entityType = 'HcclUser';
  }



  protected async loadEntityByIdCall(id: string): Promise<HcclUserCrudWrapper> {
    const hcclUser = await this.hcclService.getHcclUserById(id).toPromise();
      if (hcclUser) {
        return new HcclUserCrudWrapper(hcclUser, this.hcclService);
      }
      throw new Error('HCCL User not found');
  }
  

  protected override async createEntityDataCall(entity: HcclUserCrudWrapper): Promise<any> {
     // Validate form before creating
     this.error = this.validateForm();
     if (this.error) {
       throw new Error('Validation failed');
     }

     // Use entityNew if in create mode, otherwise use the passed entity
     const hcclUserData = this.getMode() === CRUD_MODES.CREATE && this.entityNew ? this.entityNew.getData() : entity.getData();
    
    const postData: HcclUserPOSTData = {
      name: hcclUserData.name || '',
      businessCode: hcclUserData.businessCode || '',
      description: hcclUserData.description || '',
      externalUserId: hcclUserData.externalUserId || undefined,
      externalUserEntityType: hcclUserData.externalUserEntityType || undefined,
      externalUserName: hcclUserData.externalUserName || undefined,
      available: hcclUserData.available || 1,
      personId: hcclUserData.personId || ''
    };

     try {
       // The requestCreate method now returns { id: string, status: 201 }
       const response = await this.hcclService.createHcclUser(postData).toPromise();
       console.log('Create response:', response);
       this.clearValidationErrors(); // Clear errors on success
       return response;
     } catch (error) {
       console.error('Create error:', error);
       throw error;
     }
  }



  protected override async updateEntityDataCall(entity: HcclUserCrudWrapper): Promise<void> {
      // Validate form before updating
      this.error = this.validateForm();
      if (this.error) {
        throw new Error('Validation failed');
      }

      const hcclUserData = entity.getData();
      if (!hcclUserData.id) {
        throw new Error('HCCL User ID is required for update');    }

      const putData: HcclUserPUTData = {
        name: hcclUserData.name || '',
        businessCode: hcclUserData.businessCode || '',
        description: hcclUserData.description || '',
        externalUserId: hcclUserData.externalUserId || undefined,
        externalUserEntityType: hcclUserData.externalUserEntityType || undefined,
        externalUserName: hcclUserData.externalUserName || undefined,
        available: hcclUserData.available || 1,
        personId: hcclUserData.personId || ''
      };

      try {
        await this.hcclService.updateHcclUserById(hcclUserData.id, putData).toPromise();
        this.clearValidationErrors(); // Clear errors on success
      } catch (error) {
        console.error('Update error:', error);
        throw error;
      }
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteHcclUserById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting HCCL User:', error);
      throw error;
    }
  }


  
  public override newEmptyWrapper(): HcclUserCrudWrapper {
    // Create an empty HCCL User if no current entity exists
    const emptyHcclUser: HcclUserGETData = {
      name: '',
      businessCode: '',
      description: '',
      externalUserId: '',
      externalUserEntityType: '',
      externalUserName: '',
      available: 1
    };
    
    return new HcclUserCrudWrapper(emptyHcclUser, this.hcclService);
  }

  // Getter methods for form binding
  public get name(): string {
    const x = this.getCurrentEntity().getData().name || '';
   
    return x;
  }

  public set name(value: string) {
    var data = super.getEntityForSet();
    data.getData().name = value;
  }

  public get businessCode(): string {
    return this.getCurrentEntity().getData().businessCode || '';
  }

  public set businessCode(value: string) {
    var data = super.getEntityForSet();
    data.getData().businessCode = value;
  }

  public get description(): string {
    return this.getCurrentEntity().getData().description || '';
  }

  public set description(value: string) {
    var data = super.getEntityForSet();
    data.getData().description = value;
  }

  public get externalUserId(): string {
    return this.getCurrentEntity().getData().externalUserId || '';
  }

  public set externalUserId(value: string) {
    var data = super.getEntityForSet();
    data.getData().externalUserId = value;
  }

  public get externalUserEntityType(): string {
    return this.getCurrentEntity().getData().externalUserEntityType || '';
  }

  public set externalUserEntityType(value: string) {
    var data = super.getEntityForSet();
    data.getData().externalUserEntityType = value;
  }

  public get externalUserName(): string {
    return this.getCurrentEntity().getData().externalUserName || '';
  }

  public set externalUserName(value: string) {
    var data = super.getEntityForSet();
    data.getData().externalUserName = value;
  }

  public get available(): number {
    return this.getCurrentEntity().getData().available || 1;
  }

  public set available(value: number) {
    var data = super.getEntityForSet();
    data.getData().available = value;
  }

 
  /**
   * Create a wrapper from HcclUserGETData
   * @param hcclUserData The HcclUserGETData to wrap
   * @returns HcclUserCrudWrapper instance
   */
  public createWrapper(hcclUserData: HcclUserGETData): HcclUserCrudWrapper {
    return new HcclUserCrudWrapper(hcclUserData, this.hcclService);
  }

  getHcclUserFkMenuCriteria(): HcclUserCriteria {
    // HCCL User organization.
    return {
      available: 1
    };
  }

   /** Define the menu objects for this crud component */
   protected hcclUserMenu: MenuControlDataList | null = null;
   protected override async prepareMenus(entity: HcclUserCrudWrapper): Promise<void> {
    
    // const fkMenu = await entity.getFkMenu();
    // // Actually, we're going to load the HCCL User wrapper, then call getHcclUserMenu
    // this.hcclUserMenu = fkMenu || null;

    return Promise.resolve();
  }

}

export class HcclUserCrudWrapper extends EntityWrapper<HcclUserGETData> {

  public static  newInstanceForCreate( hcclService: HcclService, entityIn?: HcclUserGETData | null): HcclUserCrudWrapper {
    const entity = entityIn || {
      id: '0',
      name: '',
      businessCode: '',
      description: '',
      externalUserId: '',
      externalUserEntityType: '',
      externalUserName: '',
      available: 1
    } as HcclUserGETData;
    return new HcclUserCrudWrapper(entity, hcclService);
  }
  public static async newInstance(id: string, hcclService: HcclService): Promise<HcclUserCrudWrapper> {
    const hcclUser = await hcclService.getHcclUserById(id).toPromise();
    if (hcclUser) {
      return new HcclUserCrudWrapper(hcclUser, hcclService);
    }
    throw new Error('HCCL User not found');
  }
  constructor(data: HcclUserGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }
  
  getDisplayText(entity?: HcclUserGETData): string {
    const data = entity || this.data;
    const name = data.name || '';
    const businessCode = data.businessCode || '';
    if (name && businessCode) {
      return `${name} (${businessCode})`;
    } else if (name) {
      return name;
    } else if (businessCode) {
      return businessCode;
    } else {
      return 'Unnamed HCCL User';
    }
  }

  getFullName(): string {
    return this.getDisplayText();
  }

  getBusinessCode(): string {
    return this.data.businessCode || '';
  }

  getDescription(): string {
    return this.data.description || '';
  }

  getAvailable(): number {
    return this.data.available || 1;
  }

  isActive(): boolean {
    return this.data.available === 1;
  }

  getFkMenuCriteria(): HcclUserCriteria {
    return {
      available: 1
    };
  }

  async getHcclUsers(criteria?: HcclUserCriteria): Promise<HcclUserGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const searchCriteria = criteria || this.getFkMenuCriteria();
    const response = await this.hcclService.findHcclUsers(searchCriteria).toPromise();
    return response?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    console.log('getFkMenu', menuHint, data);
    var criteria = this.getFkMenuCriteria();
    var hcclUsers = await this.getHcclUsers(criteria);
    var menuItems = hcclUsers.map(hcclUser => {
      return {
        id: hcclUser.id,
        name: hcclUser.name
      } as MenuControlData;
    });
    return { menuItems: menuItems } as MenuControlDataList;
  }
} 