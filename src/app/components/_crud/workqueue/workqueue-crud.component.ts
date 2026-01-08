import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, Validators } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { WorkQueueCriteria, WorkQueueGETData, WorkQueuePOSTData, WorkQueuePUTData, HcclService, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { Observable, map } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';
import { WorkqueuetyperefCrudComponent  } from '@app/components/_crud/workqueuetyperef/workqueuetyperef-crud.component';

@Component({
  selector: 'app-workqueue-crud',
  templateUrl: './workqueue-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule, 
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent, WorkqueuetyperefCrudComponent ],
  standalone: true
})
export class WorkqueueCrudComponent extends AbstractCrudComponent<WorkQueueCrudWrapper> implements OnInit, OnChanges {
/**
 * This is a component that will be used to create, read, update and delete Work Queues
 * It will use the AbstractCrudComponent to handle the CRUD operations
 * It will use the WorkQueueGETData and WorkQueuePOSTData interfaces to handle the data
 * It will use the HcclService to handle the data
 * 
 * Input parameter:
 * - id?: string - Optional work queue ID to load a specific work queue for viewing/editing
 * 
 * If no ID is provided, the component will load the full list of work queues.
 * If an ID is provided, the component will load that specific work queue and show it in detail mode.
 * 
 * Create a wrapper class that extends EntityWrapper<WorkQueueGETData>
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

  private validatePrefixCode(prefixCode: string): string | null {
    if (!prefixCode || prefixCode.trim() === '') {
      return 'Prefix Code is required';
    }
    if (prefixCode.length > 50) {
      return 'Prefix Code must be less than 50 characters';
    }
    return null;
  }

  private validateWorkQueueTypeId(workQueueTypeId: string): string | null {
    if (!workQueueTypeId || workQueueTypeId.trim() === '') {
      return 'Work Queue Type ID is required';
    }
    return null;
  }

  private validateWorkQueueTeamId(workQueueTeamId: string): string | null {
    if (!workQueueTeamId || workQueueTeamId.trim() === '') {
      return 'Work Queue Team ID is required';
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
    
    const prefixCodeError = this.validatePrefixCode(this.prefixCode);
    if (prefixCodeError) {
      errors.prefixCode = { errorMessage: prefixCodeError };
    }
    
    const workQueueTypeIdError = this.validateWorkQueueTypeId(this.workQueueTypeId);
    if (workQueueTypeIdError) {
      errors.workQueueTypeId = { errorMessage: workQueueTypeIdError };
    }
    
    const workQueueTeamIdError = this.validateWorkQueueTeamId(this.workQueueTeamId);
    if (workQueueTeamIdError) {
      errors.workQueueTeamId = { errorMessage: workQueueTeamIdError };
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
    this.entityType = 'WorkQueue';
  }



  protected async loadEntityByIdCall(id: string): Promise<WorkQueueCrudWrapper> {
    const workQueue = await this.hcclService.getWorkQueueById(id).toPromise();
      if (workQueue) {
        return new WorkQueueCrudWrapper(workQueue, this.hcclService);
      }
      throw new Error('Work Queue not found');
  }
  

  protected override async createEntityDataCall(entity: WorkQueueCrudWrapper): Promise<any> {
     // Validate form before creating
     this.error = this.validateForm();
     if (this.error) {
       throw new Error('Validation failed');
     }

     // Use entityNew if in create mode, otherwise use the passed entity
     const workQueueData = this.getMode() === CRUD_MODES.CREATE && this.entityNew ? this.entityNew.getData() : entity.getData();
    
     const postData: WorkQueuePOSTData = {
       name: workQueueData.name || '',
       businessCode: workQueueData.businessCode || '',
       description: workQueueData.description || '',
       prefixCode: workQueueData.prefixCode || '',
       workQueueTypeId: workQueueData.workQueueTypeId || '',
       workQueueTeamId: workQueueData.workQueueTeamId || '',
       available: workQueueData.available || 1,
       organizationId: workQueueData.organizationId || '',
       externalQueue: workQueueData.externalQueue || 0
     };

     try {
       // The requestCreate method now returns { id: string, status: 201 }
       const response = await this.hcclService.createWorkQueue(postData).toPromise();
       console.log('Create response:', response);
       this.clearValidationErrors(); // Clear errors on success
       return response;
     } catch (error) {
       console.error('Create error:', error);
       throw error;
     }
  }



  protected override async updateEntityDataCall(entity: WorkQueueCrudWrapper): Promise<void> {
      // Validate form before updating
      this.error = this.validateForm();
      if (this.error) {
        throw new Error('Validation failed');
      }

      const workQueueData = entity.getData();
      if (!workQueueData.id) {
        throw new Error('Work Queue ID is required for update');    }

      const putData: WorkQueuePUTData = {
        name: workQueueData.name || '',
        businessCode: workQueueData.businessCode || '',
        description: workQueueData.description || '',
        prefixCode: workQueueData.prefixCode || '',
        workQueueTypeId: workQueueData.workQueueTypeId || '',
        workQueueTeamId: workQueueData.workQueueTeamId || '',
        available: workQueueData.available || 1,
        organizationId: workQueueData.organizationId || '',
        externalQueue: workQueueData.externalQueue || 0
      };

      try {
        await this.hcclService.updateWorkQueueById(workQueueData.id, putData).toPromise();
        this.clearValidationErrors(); // Clear errors on success
      } catch (error) {
        console.error('Update error:', error);
        throw error;
      }
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteWorkQueueById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting Work Queue:', error);
      throw error;
    }
  }


  
  public override newEmptyWrapper(): WorkQueueCrudWrapper {
    // Create an empty work queue if no current entity exists
    const emptyWorkQueue: WorkQueueGETData = {
      name: '',
      businessCode: '',
      description: '',
      prefixCode: '',
      workQueueTypeId: '',
      workQueueTeamId: '',
      available: 1,
      organizationId: '',
      externalQueue: 0
    };
    
    return new WorkQueueCrudWrapper(emptyWorkQueue, this.hcclService);
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

  public get prefixCode(): string {
    return this.getCurrentEntity().getData().prefixCode || '';
  }

  public set prefixCode(value: string) {
    var data = super.getEntityForSet();
    data.getData().prefixCode = value;
  }

  public get workQueueTypeId(): string {
    return this.getCurrentEntity().getData().workQueueTypeId || '';
  }

  public set workQueueTypeId(value: string) {
    var data = super.getEntityForSet();
    data.getData().workQueueTypeId = value;
  }

  public get workQueueTeamId(): string {
    return this.getCurrentEntity().getData().workQueueTeamId || '';
  }

  public set workQueueTeamId(value: string) {
    var data = super.getEntityForSet();
    data.getData().workQueueTeamId = value;
  }

  public get organizationId(): string {
    return this.getCurrentEntity().getData().organizationId || '';
  }

  public set organizationId(value: string) {
    var data = super.getEntityForSet();
    data.getData().organizationId = value;
  }

  public get available(): number {
    return this.getCurrentEntity().getData().available || 1;
  }

  public set available(value: number) {
    var data = super.getEntityForSet();
    data.getData().available = value;
  }

  public get externalQueue(): number {
    return this.getCurrentEntity().getData().externalQueue || 0;
  }

  public set externalQueue(value: number) {
    var data = super.getEntityForSet();
    data.getData().externalQueue = value;
  }

 
  /**
   * Create a wrapper from WorkQueueGETData
   * @param workQueueData The WorkQueueGETData to wrap
   * @returns WorkQueueCrudWrapper instance
   */
  public createWrapper(workQueueData: WorkQueueGETData): WorkQueueCrudWrapper {
    return new WorkQueueCrudWrapper(workQueueData, this.hcclService);
  }

  getWorkQueueFkMenuCriteria(): WorkQueueCriteria {
    // Work queue organization.
    return {
      available: 1
    };
  }

   /** Define the menu objects for this crud component */
   protected workQueueMenu: MenuControlDataList | null = null;
   protected override async prepareMenus(entity: WorkQueueCrudWrapper): Promise<void> {
    
    // const fkMenu = await entity.getFkMenu();
    // // Actually, we're going to load the work queue wrapper, then call getWorkQueueMenu
    // this.workQueueMenu = fkMenu || null;

    return Promise.resolve();
  }

}

export class WorkQueueCrudWrapper extends EntityWrapper<WorkQueueGETData> {

  public static  newInstanceForCreate( hcclService: HcclService, entityIn?: WorkQueueGETData | null): WorkQueueCrudWrapper {
    const entity = entityIn || {
      id: '0',
      name: '',
      businessCode: '',
      description: '',
      prefixCode: '',
      workQueueTypeId: '',
      workQueueTeamId: '',
      available: 1,
      organizationId: '',
      externalQueue: 0
    } as WorkQueueGETData;
    return new WorkQueueCrudWrapper(entity, hcclService);
  }
  public static async newInstance(id: string, hcclService: HcclService): Promise<WorkQueueCrudWrapper> {
    const workQueue = await hcclService.getWorkQueueById(id).toPromise();
    if (workQueue) {
      return new WorkQueueCrudWrapper(workQueue, hcclService);
    }
    throw new Error('Work Queue not found');
  }
  constructor(data: WorkQueueGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }
  
  getDisplayText(entity?: WorkQueueGETData): string {
    const data = entity || this.data;
    const name = data.name || '';
    const orgName = data.organization?.businessCode || '';  
    const businessCode = data.businessCode || '';
    
    return `${orgName} / ${name} `;
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

  getPrefixCode(): string {
    return this.data.prefixCode || '';
  }

  getWorkQueueTypeId(): string {
    return this.data.workQueueTypeId || '';
  }

  getWorkQueueTeamId(): string {
    return this.data.workQueueTeamId || '';
  }

  getOrganizationId(): string {
    return this.data.organizationId || '';
  }

  getAvailable(): number {
    return this.data.available || 1;
  }

  getExternalQueue(): number {
    return this.data.externalQueue || 0;
  }

  isActive(): boolean {
    return this.data.available === 1;
  }

  getFkMenuCriteria(): WorkQueueCriteria {
    return {
      available: 1
    };
  }

  async getWorkQueues(criteria?: WorkQueueCriteria): Promise<WorkQueueGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const searchCriteria = criteria || this.getFkMenuCriteria();
    const response = await this.hcclService.findWorkQueues(searchCriteria).toPromise();
    return response?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    console.log('getFkMenu', menuHint, data);
    var criteria = this.getFkMenuCriteria();
    var workQueues = await this.getWorkQueues(criteria);
    var menuItems = workQueues.map(workQueue => {
      return {
        id: workQueue.id,
        name: workQueue.name
      } as MenuControlData;
    });
    return { menuItems: menuItems } as MenuControlDataList;
  }
} 