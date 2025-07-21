import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, Validators } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { WorkRequestTypeRefCriteria, WorkRequestTypeRefGETData, WorkRequestTypeRefPOSTData, WorkRequestTypeRefPUTData, HcclService, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { Observable, map } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';

@Component({
  selector: 'app-workrequesttyperef-crud',
  templateUrl: './workrequesttyperef-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule, 
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent],
  standalone: true
})
export class WorkrequesttyperefCrudComponent extends AbstractCrudComponent<WorkRequestTypeRefCrudWrapper> implements OnInit, OnChanges {
/**
 * This is a component that will be used to create, read, update and delete Work Request Type References
 * It will use the AbstractCrudComponent to handle the CRUD operations
 * It will use the WorkRequestTypeRefGETData and WorkRequestTypeRefPOSTData interfaces to handle the data
 * It will use the HcclService to handle the data
 * 
 * Input parameter:
 * - id?: string - Optional work request type ref ID to load a specific work request type ref for viewing/editing
 * 
 * If no ID is provided, the component will load the full list of work request type refs.
 * If an ID is provided, the component will load that specific work request type ref and show it in detail mode.
 * 
 * Create a wrapper class that extends EntityWrapper<WorkRequestTypeRefGETData>
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
    
    return Object.keys(errors).length > 0 ? errors : null;
  }

  // Clear validation errors
  private clearValidationErrors(): void {
    this.error = null;
  }

     /** Standard boiler plate for ngOnInit */
  override ngOnInit(): void {
    super.ngOnInit();
    this.entityType = 'WorkRequestTypeRef';
  }



  protected async loadEntityByIdCall(id: string): Promise<WorkRequestTypeRefCrudWrapper> {
    const workRequestTypeRef = await this.hcclService.getWorkRequestTypeRefById(id).toPromise();
      if (workRequestTypeRef) {
        return new WorkRequestTypeRefCrudWrapper(workRequestTypeRef, this.hcclService);
      }
      throw new Error('Work Request Type Ref not found');
  }
  

  protected override async createEntityDataCall(entity: WorkRequestTypeRefCrudWrapper): Promise<any> {
     // Validate form before creating
     this.error = this.validateForm();
     if (this.error) {
       throw new Error('Validation failed');
     }

     // Use entityNew if in create mode, otherwise use the passed entity
     const workRequestTypeRefData = this.getMode() === CRUD_MODES.CREATE && this.entityNew ? this.entityNew.getData() : entity.getData();
    
     const postData: WorkRequestTypeRefPOSTData = {
       name: workRequestTypeRefData.name || '',
       businessCode: workRequestTypeRefData.businessCode || '',
       description: workRequestTypeRefData.description || '',
       policyBeanName: workRequestTypeRefData.policyBeanName || '',
       available: workRequestTypeRefData.available || 1
     };

     try {
       // The requestCreate method now returns { id: string, status: 201 }
       const response = await this.hcclService.createWorkRequestTypeRef(postData).toPromise();
       console.log('Create response:', response);
       this.clearValidationErrors(); // Clear errors on success
       return response;
     } catch (error) {
       console.error('Create error:', error);
       throw error;
     }
  }



  protected override async updateEntityDataCall(entity: WorkRequestTypeRefCrudWrapper): Promise<void> {
      // Validate form before updating
      this.error = this.validateForm();
      if (this.error) {
        throw new Error('Validation failed');
      }

      const workRequestTypeRefData = entity.getData();
      if (!workRequestTypeRefData.id) {
        throw new Error('Work Request Type Ref ID is required for update');    }

      const putData: WorkRequestTypeRefPUTData = {
        name: workRequestTypeRefData.name || '',
        businessCode: workRequestTypeRefData.businessCode || '',
        description: workRequestTypeRefData.description || '',
        policyBeanName: workRequestTypeRefData.policyBeanName || '',
        available: workRequestTypeRefData.available || 1
      };

      try {
        await this.hcclService.updateWorkRequestTypeRefById(workRequestTypeRefData.id, putData).toPromise();
        this.clearValidationErrors(); // Clear errors on success
      } catch (error) {
        console.error('Update error:', error);
        throw error;
      }
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteWorkRequestTypeRefById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting Work Request Type Ref:', error);
      throw error;
    }
  }


  
  public override newEmptyWrapper(): WorkRequestTypeRefCrudWrapper {
    // Create an empty work request type ref if no current entity exists
    const emptyWorkRequestTypeRef: WorkRequestTypeRefGETData = {
      name: '',
      businessCode: '',
      description: '',
      available: 1
    };
    
    return new WorkRequestTypeRefCrudWrapper(emptyWorkRequestTypeRef, this.hcclService);
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

  public get policyBeanName(): string {
    return this.getCurrentEntity().getData().policyBeanName || '';
  }

  public set policyBeanName(value: string) {
    var data = super.getEntityForSet();
    data.getData().policyBeanName = value;
  }

 
  /**
   * Create a wrapper from WorkRequestTypeRefGETData
   * @param workRequestTypeRefData The WorkRequestTypeRefGETData to wrap
   * @returns WorkRequestTypeRefCrudWrapper instance
   */
  public createWrapper(workRequestTypeRefData: WorkRequestTypeRefGETData): WorkRequestTypeRefCrudWrapper {
    return new WorkRequestTypeRefCrudWrapper(workRequestTypeRefData, this.hcclService);
  }

  getWorkRequestTypeRefFkMenuCriteria(): WorkRequestTypeRefCriteria {
    // Work request type ref organization.
    return {
      available: 1
    };
  }

   /** Define the menu objects for this crud component */
   protected workRequestTypeRefMenu: MenuControlDataList | null = null;
   protected override async prepareMenus(entity: WorkRequestTypeRefCrudWrapper): Promise<void> {
    
    // const fkMenu = await entity.getFkMenu();
    // // Actually, we're going to load the work request type ref wrapper, then call getWorkRequestTypeRefMenu
    // this.workRequestTypeRefMenu = fkMenu || null;

    return Promise.resolve();
  }

}

export class WorkRequestTypeRefCrudWrapper extends EntityWrapper<WorkRequestTypeRefGETData> {

  public static  newInstanceForCreate( hcclService: HcclService, entityIn?: WorkRequestTypeRefGETData | null): WorkRequestTypeRefCrudWrapper {
    const entity = entityIn || {
      id: '0',
      name: '',
      businessCode: '',
      description: '',
      available: 1
    } as WorkRequestTypeRefGETData;
    return new WorkRequestTypeRefCrudWrapper(entity, hcclService);
  }
  public static async newInstance(id: string, hcclService: HcclService): Promise<WorkRequestTypeRefCrudWrapper> {
    const workRequestTypeRef = await hcclService.getWorkRequestTypeRefById(id).toPromise();
    if (workRequestTypeRef) {
      return new WorkRequestTypeRefCrudWrapper(workRequestTypeRef, hcclService);
    }
    throw new Error('Work Request Type Ref not found');
  }
  constructor(data: WorkRequestTypeRefGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }
  
  getDisplayText(entity?: WorkRequestTypeRefGETData): string {
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
      return 'Unnamed Work Request Type Ref';
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

  getFkMenuCriteria(): WorkRequestTypeRefCriteria {
    return {
      available: 1
    };
  }

  async getWorkRequestTypeRefs(criteria?: WorkRequestTypeRefCriteria): Promise<WorkRequestTypeRefGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const searchCriteria = criteria || this.getFkMenuCriteria();
    const response = await this.hcclService.findWorkRequestTypeRefs(searchCriteria).toPromise();
    return response?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    console.log('getFkMenu', menuHint, data);
    var criteria = this.getFkMenuCriteria();
    var workRequestTypeRefs = await this.getWorkRequestTypeRefs(criteria);
    var menuItems = workRequestTypeRefs.map(workRequestTypeRef => {
      return {
        id: workRequestTypeRef.id,
        name: workRequestTypeRef.name
      } as MenuControlData;
    });
    return { menuItems: menuItems } as MenuControlDataList;
  }
} 