import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, Validators } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { ProviderTypeRefCriteria, ProviderTypeRefGETData, ProviderTypeRefPOSTData, ProviderTypeRefPUTData, HcclService, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { Observable, map } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';
import { R } from 'node_modules/@angular/cdk/overlay.d-BdoMy0hX';
//import { CommonUiService } from '@app/models/common-ui.service';

@Component({
  selector: 'app-providertyperef-crud',
  templateUrl: './providertyperef-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule, 
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent],
  standalone: true
})
export class ProvidertyperefCrudComponent extends AbstractCrudComponent<ProviderTypeRefCrudWrapper> implements OnInit, OnChanges {
/**
 * This is a component that will be used to create, read, update and delete Provider Type References
 * It will use the AbstractCrudComponent to handle the CRUD operations
 * It will use the ProviderTypeRefGETData and ProviderTypeRefPOSTData interfaces to handle the data
 * It will use the HcclService to handle the data
 * 
 * Input parameter:
 * - id?: string - Optional provider type ref ID to load a specific provider type ref for viewing/editing
 * 
 * If no ID is provided, the component will load the full list of provider type refs.
 * If an ID is provided, the component will load that specific provider type ref and show it in detail mode.
 * 
 * Create a wrapper class that extends EntityWrapper<ProviderTypeRefGETData>
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

  // Clear validation errors
  private clearValidationErrors(): void {
    this.error = null;
  }

     /** Standard boiler plate for ngOnInit */
  override ngOnInit(): void {
    super.ngOnInit();
    this.entityType = 'ProviderTypeRef';
  }



  protected async loadEntityByIdCall(id: string): Promise<ProviderTypeRefCrudWrapper> {
    const providerTypeRef = await this.hcclService.getProviderTypeRefById(id).toPromise();
      if (providerTypeRef) {
        return new ProviderTypeRefCrudWrapper(providerTypeRef, this.hcclService);
      }
      throw new Error('Provider Type Ref not found');
  }
  

  protected override async createEntityDataCall(entity: ProviderTypeRefCrudWrapper): Promise<any> {
     // Validate form before creating
     this.error = this.validateForm();
     if (this.error) {
       throw new Error('Validation failed');
     }

     // Use entityNew if in create mode, otherwise use the passed entity
     const providerTypeRefData = this.getMode() === CRUD_MODES.CREATE && this.entityNew ? this.entityNew.getData() : entity.getData();
    
     const postData: ProviderTypeRefPOSTData = {
       name: providerTypeRefData.name || '',
       businessCode: providerTypeRefData.businessCode || '',
       description: providerTypeRefData.description || '',
       available: providerTypeRefData.available || 1
     };

     try {
       // The requestCreate method now returns { id: string, status: 201 }
       const response = await this.hcclService.createProviderTypeRef(postData).toPromise();
       console.log('Create response:', response);
       this.clearValidationErrors(); // Clear errors on success
       return response;
     } catch (error) {
       console.error('Create error:', error);
       throw error;
     }
  }



  protected override async updateEntityDataCall(entity: ProviderTypeRefCrudWrapper): Promise<void> {
      // Validate form before updating
      this.error = this.validateForm();
      if (this.error) {
        throw new Error('Validation failed');
      }

      const providerTypeRefData = entity.getData();
      if (!providerTypeRefData.id) {
        throw new Error('Provider Type Ref ID is required for update');    }

      const putData: ProviderTypeRefPUTData = {
        name: providerTypeRefData.name || '',
        businessCode: providerTypeRefData.businessCode || '',
        description: providerTypeRefData.description || '',
        available: providerTypeRefData.available ||1   };

      try {
        await this.hcclService.updateProviderTypeRefById(providerTypeRefData.id, putData).toPromise();
        this.clearValidationErrors(); // Clear errors on success
      } catch (error) {
        console.error('Update error:', error);
        throw error;
      }
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      // Note: There's no delete method in HcclService for ProviderTypeRef, so this would need to be implemented
      // For now, well throw an error
      throw new Error('Delete method not implemented for ProviderTypeRef');
    } catch (error) {
      console.error('Error deleting Provider Type Ref:', error);
      throw error;
    }
  }


  
  public override newEmptyWrapper(): ProviderTypeRefCrudWrapper {
    // Create an empty provider type ref if no current entity exists
    const emptyProviderTypeRef: ProviderTypeRefGETData = {
      name: '',
      businessCode: '',
      description: '',
      available:1};
    
    return new ProviderTypeRefCrudWrapper(emptyProviderTypeRef, this.hcclService);
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

  public get available(): number {
    return this.getCurrentEntity().getData().available || 1;
  }

  public set available(value: number) {
    var data = super.getEntityForSet();
    data.getData().available = value;
  }

 
  /**
   * Create a wrapper from ProviderTypeRefGETData
   * @param providerTypeRefData The ProviderTypeRefGETData to wrap
   * @returns ProviderTypeRefCrudWrapper instance
   */
  public createWrapper(providerTypeRefData: ProviderTypeRefGETData): ProviderTypeRefCrudWrapper {
    return new ProviderTypeRefCrudWrapper(providerTypeRefData, this.hcclService);
  }

  getProviderTypeRefFkMenuCriteria(): ProviderTypeRefCriteria {
    // Provider type ref organization.
    return {
      available: 1
    };
  }

   /** Define the menu objects for this crud component */
   protected providerTypeRefMenu: MenuControlDataList | null = null;
   protected override async prepareMenus(entity: ProviderTypeRefCrudWrapper): Promise<void> {
    
    // const fkMenu = await entity.getFkMenu();
    // // Actually, we're going to load the provider type ref wrapper, then call getProviderTypeRefMenu
    // this.providerTypeRefMenu = fkMenu || null;

    return Promise.resolve();
  }

}

export class ProviderTypeRefCrudWrapper extends EntityWrapper<ProviderTypeRefGETData> {

  public static  newInstanceForCreate( hcclService: HcclService, entityIn?: ProviderTypeRefGETData | null): ProviderTypeRefCrudWrapper {
    const entity = entityIn || {
      id: '0',
      name: '',
      businessCode: '',
      description: '',
      available: 1
    } as ProviderTypeRefGETData;
    return new ProviderTypeRefCrudWrapper(entity, hcclService);
  }
  public static async newInstance(id: string, hcclService: HcclService): Promise<ProviderTypeRefCrudWrapper> {
    const providerTypeRef = await hcclService.getProviderTypeRefById(id).toPromise();
    if (providerTypeRef) {
      return new ProviderTypeRefCrudWrapper(providerTypeRef, hcclService);
    }
    throw new Error('Provider Type Ref not found');
  }
  constructor(data: ProviderTypeRefGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }
  
  getDisplayText(entity?: ProviderTypeRefGETData): string {
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
      return 'Unnamed Provider Type Ref';
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

  getFkMenuCriteria(): ProviderTypeRefCriteria {
    return {
      available: 1
    };
  }

  async getProviderTypeRefs(criteria?: ProviderTypeRefCriteria): Promise<ProviderTypeRefGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const searchCriteria = criteria || this.getFkMenuCriteria();
    const response = await this.hcclService.findProviderTypeRefs(searchCriteria).toPromise();
    return response?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    console.log('getFkMenu', menuHint, data);
    var criteria = this.getFkMenuCriteria();
    var providerTypeRefs = await this.getProviderTypeRefs(criteria);
    var menuItems = providerTypeRefs.map(providerTypeRef => {
      return {
        id: providerTypeRef.id,
        name: providerTypeRef.name
      } as MenuControlData;
    });
    return { menuItems: menuItems } as MenuControlDataList;
  }
} 