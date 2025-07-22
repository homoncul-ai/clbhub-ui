import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, Validators } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { WorkRequestCriteria, WorkRequestGETData, WorkRequestPOSTData, WorkRequestPUTData, HcclService, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { Observable, map } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';

@Component({
  selector: 'app-workrequest-crud',
  templateUrl: './workrequest-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule, 
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent],
  standalone: true
})
export class WorkrequestCrudComponent extends AbstractCrudComponent<WorkRequestCrudWrapper> implements OnInit, OnChanges {
/**
 * This is a component that will be used to create, read, update and delete Work Requests
 * It will use the AbstractCrudComponent to handle the CRUD operations
 * It will use the WorkRequestGETData and WorkRequestPOSTData interfaces to handle the data
 * It will use the HcclService to handle the data
 * 
 * Input parameter:
 * - id?: string - Optional work request ID to load a specific work request for viewing/editing
 * 
 * If no ID is provided, the component will load the full list of work requests.
 * If an ID is provided, the component will load that specific work request and show it in detail mode.
 * 
 * Create a wrapper class that extends EntityWrapper<WorkRequestGETData>
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

  private validateWorkRequestTypeId(workRequestTypeId: string): string | null {
    if (!workRequestTypeId || workRequestTypeId.trim() === '') {
      return 'Work Request Type ID is required';
    }
    return null;
  }

  private validateCurrentStateCode(currentStateCode: string): string | null {
    if (!currentStateCode || currentStateCode.trim() === '') {
      return 'Current State Code is required';
    }
    return null;
  }

  private validateWorkQueueId(workQueueId: string): string | null {
    if (!workQueueId || workQueueId.trim() === '') {
      return 'Work Queue ID is required';
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
    
    const workRequestTypeIdError = this.validateWorkRequestTypeId(this.workRequestTypeId);
    if (workRequestTypeIdError) {
      errors.workRequestTypeId = { errorMessage: workRequestTypeIdError };
    }
    
    const currentStateCodeError = this.validateCurrentStateCode(this.currentStateCode);
    if (currentStateCodeError) {
      errors.currentStateCode = { errorMessage: currentStateCodeError };
    }
    
    const workQueueIdError = this.validateWorkQueueId(this.workQueueId);
    if (workQueueIdError) {
      errors.workQueueId = { errorMessage: workQueueIdError };
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
    this.entityType = 'WorkRequest';
  }



  protected async loadEntityByIdCall(id: string): Promise<WorkRequestCrudWrapper> {
    const workRequest = await this.hcclService.getWorkRequestById(id).toPromise();
      if (workRequest) {
        return new WorkRequestCrudWrapper(workRequest, this.hcclService);
      }
      throw new Error('Work Request not found');
  }
  

  protected override async createEntityDataCall(entity: WorkRequestCrudWrapper): Promise<any> {
     // Validate form before creating
     this.error = this.validateForm();
     if (this.error) {
       throw new Error('Validation failed');
     }

     // Use entityNew if in create mode, otherwise use the passed entity
     const workRequestData = this.getMode() === CRUD_MODES.CREATE && this.entityNew ? this.entityNew.getData() : entity.getData();
    
     const postData: WorkRequestPOSTData = {
       name: workRequestData.name || '',
       businessCode: workRequestData.businessCode || '',
       description: workRequestData.description || '',
       workRequestTypeId: workRequestData.workRequestTypeId || '',
       currentStateCode: workRequestData.currentStateCode || '',
       currentStateTransitionId: workRequestData.currentStateTransitionId || '',
       workQueueId: workRequestData.workQueueId || '',
       createdByTeamId: workRequestData.createdByTeamId || '',
       createdByUserId: workRequestData.createdByUserId || '',
       acceptedByTeamId: workRequestData.acceptedByTeamId || '',
       acceptedByUserId: workRequestData.acceptedByUserId || '',
       subjectEntityId: workRequestData.subjectEntityId || '',
       subjectEntityType: workRequestData.subjectEntityType || '',
       subjectEntityName: workRequestData.subjectEntityName || '',
       parentWorkRequestItemId: workRequestData.parentWorkRequestItemId || ''
     };

     try {
       // The requestCreate method now returns { id: string, status: 201 }
       const response = await this.hcclService.createWorkRequest(postData).toPromise();
       console.log('Create response:', response);
       this.clearValidationErrors(); // Clear errors on success
       return response;
     } catch (error) {
       console.error('Create error:', error);
       throw error;
     }
  }



  protected override async updateEntityDataCall(entity: WorkRequestCrudWrapper): Promise<void> {
      // Validate form before updating
      this.error = this.validateForm();
      if (this.error) {
        throw new Error('Validation failed');
      }

      const workRequestData = entity.getData();
      if (!workRequestData.id) {
        throw new Error('Work Request ID is required for update');    }

      const putData: WorkRequestPUTData = {
        name: workRequestData.name || '',
        businessCode: workRequestData.businessCode || '',
        description: workRequestData.description || '',
        workRequestTypeId: workRequestData.workRequestTypeId || '',
        currentStateCode: workRequestData.currentStateCode || '',
        currentStateTransitionId: workRequestData.currentStateTransitionId || '',
        workQueueId: workRequestData.workQueueId || '',
        createdByTeamId: workRequestData.createdByTeamId || '',
        createdByUserId: workRequestData.createdByUserId || '',
        acceptedByTeamId: workRequestData.acceptedByTeamId || '',
        acceptedByUserId: workRequestData.acceptedByUserId || '',
        subjectEntityId: workRequestData.subjectEntityId || '',
        subjectEntityType: workRequestData.subjectEntityType || '',
        subjectEntityName: workRequestData.subjectEntityName || '',
        parentWorkRequestItemId: workRequestData.parentWorkRequestItemId || ''
      };

      try {
        await this.hcclService.updateWorkRequestById(workRequestData.id, putData).toPromise();
        this.clearValidationErrors(); // Clear errors on success
      } catch (error) {
        console.error('Update error:', error);
        throw error;
      }
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteWorkRequestById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting Work Request:', error);
      throw error;
    }
  }


  
  public override newEmptyWrapper(): WorkRequestCrudWrapper {
    // Create an empty work request if no current entity exists
    const emptyWorkRequest: WorkRequestGETData = {
      name: '',
      businessCode: '',
      description: '',
      workRequestTypeId: '',
      currentStateCode: '',
      currentStateTransitionId: '',
      workQueueId: '',
      createdByTeamId: '',
      createdByUserId: '',
      acceptedByTeamId: '',
      acceptedByUserId: '',
      subjectEntityId: '',
      subjectEntityType: '',
      subjectEntityName: '',
      parentWorkRequestItemId: ''
    };
    
    return new WorkRequestCrudWrapper(emptyWorkRequest, this.hcclService);
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

  public get workRequestTypeId(): string {
    return this.getCurrentEntity().getData().workRequestTypeId || '';
  }

  public set workRequestTypeId(value: string) {
    var data = super.getEntityForSet();
    data.getData().workRequestTypeId = value;
  }

  public get currentStateCode(): string {
    return this.getCurrentEntity().getData().currentStateCode || '';
  }

  public set currentStateCode(value: string) {
    var data = super.getEntityForSet();
    data.getData().currentStateCode = value;
  }

  public get currentStateTransitionId(): string {
    return this.getCurrentEntity().getData().currentStateTransitionId || '';
  }

  public set currentStateTransitionId(value: string) {
    var data = super.getEntityForSet();
    data.getData().currentStateTransitionId = value;
  }

  public get workQueueId(): string {
    return this.getCurrentEntity().getData().workQueueId || '';
  }

  public set workQueueId(value: string) {
    var data = super.getEntityForSet();
    data.getData().workQueueId = value;
  }

  public get createdByTeamId(): string {
    return this.getCurrentEntity().getData().createdByTeamId || '';
  }

  public set createdByTeamId(value: string) {
    var data = super.getEntityForSet();
    data.getData().createdByTeamId = value;
  }

  public get createdByUserId(): string {
    return this.getCurrentEntity().getData().createdByUserId || '';
  }

  public set createdByUserId(value: string) {
    var data = super.getEntityForSet();
    data.getData().createdByUserId = value;
  }

  public get acceptedByTeamId(): string {
    return this.getCurrentEntity().getData().acceptedByTeamId || '';
  }

  public set acceptedByTeamId(value: string) {
    var data = super.getEntityForSet();
    data.getData().acceptedByTeamId = value;
  }

  public get acceptedByUserId(): string {
    return this.getCurrentEntity().getData().acceptedByUserId || '';
  }

  public set acceptedByUserId(value: string) {
    var data = super.getEntityForSet();
    data.getData().acceptedByUserId = value;
  }

  public get subjectEntityId(): string {
    return this.getCurrentEntity().getData().subjectEntityId || '';
  }

  public set subjectEntityId(value: string) {
    var data = super.getEntityForSet();
    data.getData().subjectEntityId = value;
  }

  public get subjectEntityType(): string {
    return this.getCurrentEntity().getData().subjectEntityType || '';
  }

  public set subjectEntityType(value: string) {
    var data = super.getEntityForSet();
    data.getData().subjectEntityType = value;
  }

  public get subjectEntityName(): string {
    return this.getCurrentEntity().getData().subjectEntityName || '';
  }

  public set subjectEntityName(value: string) {
    var data = super.getEntityForSet();
    data.getData().subjectEntityName = value;
  }

  public get parentWorkRequestItemId(): string {
    return this.getCurrentEntity().getData().parentWorkRequestItemId || '';
  }

  public set parentWorkRequestItemId(value: string) {
    var data = super.getEntityForSet();
    data.getData().parentWorkRequestItemId = value;
  }

 
  /**
   * Create a wrapper from WorkRequestGETData
   * @param workRequestData The WorkRequestGETData to wrap
   * @returns WorkRequestCrudWrapper instance
   */
  public createWrapper(workRequestData: WorkRequestGETData): WorkRequestCrudWrapper {
    return new WorkRequestCrudWrapper(workRequestData, this.hcclService);
  }

  getWorkRequestFkMenuCriteria(): WorkRequestCriteria {
    // Work request organization.
    return {
      // Add any specific criteria for work requests
    };
  }

   /** Define the menu objects for this crud component */
   protected workRequestMenu: MenuControlDataList | null = null;
   protected override async prepareMenus(entity: WorkRequestCrudWrapper): Promise<void> {
    
    // const fkMenu = await entity.getFkMenu();
    // // Actually, we're going to load the work request wrapper, then call getWorkRequestMenu
    // this.workRequestMenu = fkMenu || null;

    return Promise.resolve();
  }

}

export class WorkRequestCrudWrapper extends EntityWrapper<WorkRequestGETData> {

  public static  newInstanceForCreate( hcclService: HcclService, entityIn?: WorkRequestGETData | null): WorkRequestCrudWrapper {
    const entity = entityIn || {
      id: '0',
      name: '',
      businessCode: '',
      description: '',
      workRequestTypeId: '',
      currentStateCode: '',
      currentStateTransitionId: '',
      workQueueId: '',
      createdByTeamId: '',
      createdByUserId: '',
      acceptedByTeamId: '',
      acceptedByUserId: '',
      subjectEntityId: '',
      subjectEntityType: '',
      subjectEntityName: '',
      parentWorkRequestItemId: ''
    } as WorkRequestGETData;
    return new WorkRequestCrudWrapper(entity, hcclService);
  }
  public static async newInstance(id: string, hcclService: HcclService): Promise<WorkRequestCrudWrapper> {
    const workRequest = await hcclService.getWorkRequestById(id).toPromise();
    if (workRequest) {
      return new WorkRequestCrudWrapper(workRequest, hcclService);
    }
    throw new Error('Work Request not found');
  }
  constructor(data: WorkRequestGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }
  
  getDisplayText(entity?: WorkRequestGETData): string {
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
      return 'Unnamed Work Request';
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

  getWorkRequestTypeId(): string {
    return this.data.workRequestTypeId || '';
  }

  getCurrentStateCode(): string {
    return this.data.currentStateCode || '';
  }

  getWorkQueueId(): string {
    return this.data.workQueueId || '';
  }

  getCreatedByTeamId(): string {
    return this.data.createdByTeamId || '';
  }

  getCreatedByUserId(): string {
    return this.data.createdByUserId || '';
  }

  getAcceptedByTeamId(): string {
    return this.data.acceptedByTeamId || '';
  }

  getAcceptedByUserId(): string {
    return this.data.acceptedByUserId || '';
  }

  getSubjectEntityId(): string {
    return this.data.subjectEntityId || '';
  }

  getSubjectEntityType(): string {
    return this.data.subjectEntityType || '';
  }

  getSubjectEntityName(): string {
    return this.data.subjectEntityName || '';
  }

  getParentWorkRequestItemId(): string {
    return this.data.parentWorkRequestItemId || '';
  }

  isActive(): boolean {
    return true; // Work requests don't have an available field, so assume active
  }

  getFkMenuCriteria(): WorkRequestCriteria {
    return {
      // Add any specific criteria for work requests
    };
  }

  async getWorkRequests(criteria?: WorkRequestCriteria): Promise<WorkRequestGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const searchCriteria = criteria || this.getFkMenuCriteria();
    const response = await this.hcclService.findWorkRequests(searchCriteria).toPromise();
    return response?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    console.log('getFkMenu', menuHint, data);
    var criteria = this.getFkMenuCriteria();
    var workRequests = await this.getWorkRequests(criteria);
    var menuItems = workRequests.map(workRequest => {
      return {
        id: workRequest.id,
        name: workRequest.name
      } as MenuControlData;
    });
    return { menuItems: menuItems } as MenuControlDataList;
  }
} 