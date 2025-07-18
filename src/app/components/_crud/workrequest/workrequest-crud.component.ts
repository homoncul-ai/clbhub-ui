import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { WorkRequestCriteria, WorkRequestGETData, WorkRequestPOSTData, WorkRequestPUTData, HcclService, MenuControlDataList } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { Observable, map } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';
import { WorkrequesttypeCrudComponent } from "@app/components/_crud/workrequesttype/workrequesttype-crud.component";

@Component({
  selector: 'app-workrequest-crud',
  imports: [CommonModule, FormsModule, SimpleMessagesSectionComponent, MenuControlDataListComponent, AvailableSelectorComponent, WorkrequesttypeCrudComponent],
  templateUrl: './workrequest-crud.component.html',
  styleUrl: './workrequest-crud.component.scss'
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
     /** Standard boiler plate for ngOnInit */
  override ngOnInit(): void {
    super.ngOnInit();
    this.entityType = WorkRequestCrudWrapper.ENTITY_TYPE;
  }

  protected async loadEntityByIdCall(id: string): Promise<WorkRequestCrudWrapper> {
    const workRequest = await this.hcclService.getWorkRequestById(id).toPromise();
      if (workRequest) {
        return new WorkRequestCrudWrapper(workRequest, this.hcclService);
      }
      throw new Error('Work Request not found');
  }
  


  protected override async createEntityDataCall(entity: WorkRequestCrudWrapper): Promise<any> {
      // Use entityNew if in create mode, otherwise use the passed entity
      const workRequestData = this.getMode() === CRUD_MODES.CREATE && this.entityNew ? this.entityNew.getData() : entity.getData();
      
      const postData: WorkRequestPOSTData = {
        name: workRequestData.name || '',
        businessCode: workRequestData.businessCode || '',
        description: workRequestData.description || '',
        workRequestTypeId: workRequestData.workRequestTypeId || '',
        currentStateCode: workRequestData.currentStateCode || '',
        workQueueId: workRequestData.workQueueId || '',
        createdByTeamId: workRequestData.createdByTeamId,
        createdByUserId: workRequestData.createdByUserId,
        acceptedByTeamId: workRequestData.acceptedByTeamId,
        acceptedByUserId: workRequestData.acceptedByUserId,
        subjectEntityId: workRequestData.subjectEntityId,
        subjectEntityType: workRequestData.subjectEntityType,
        subjectEntityName: workRequestData.subjectEntityName,
        parentWorkRequestItemId: workRequestData.parentWorkRequestItemId
      };

      return this.hcclService.createWorkRequest(postData);
  }



  protected override async updateEntityDataCall2(entity: WorkRequestCrudWrapper): Promise<void> {
      const workRequestData = entity.getData();
      if (!workRequestData.id) {
        throw new Error('Work Request ID is required for update');
      }

      const putData: WorkRequestPUTData = {
        name: workRequestData.name || '',
        businessCode: workRequestData.businessCode || '',
        description: workRequestData.description || '',
        workRequestTypeId: workRequestData.workRequestTypeId || '',
        currentStateCode: workRequestData.currentStateCode || '',
        workQueueId: workRequestData.workQueueId || '',
        createdByTeamId: workRequestData.createdByTeamId,
        createdByUserId: workRequestData.createdByUserId,
        acceptedByTeamId: workRequestData.acceptedByTeamId,
        acceptedByUserId: workRequestData.acceptedByUserId,
        subjectEntityId: workRequestData.subjectEntityId,
        subjectEntityType: workRequestData.subjectEntityType,
        subjectEntityName: workRequestData.subjectEntityName,
        parentWorkRequestItemId: workRequestData.parentWorkRequestItemId
      };

      await this.hcclService.updateWorkRequestById(workRequestData.id, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteWorkRequestById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting work request:', error);
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
      workQueueId: ''
    };
    
    return new WorkRequestCrudWrapper(emptyWorkRequest, this.hcclService);
  }
  // Getter methods for form binding
  public get name(): string {
    return this.getCurrentEntity().getData().name || '';
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

  public get workQueueId(): string {
    return this.getCurrentEntity().getData().workQueueId || '';
  }

  public set workQueueId(value: string) {
    var data = super.getEntityForSet();
    data.getData().workQueueId = value;
  }

 
  /**
   * Create a wrapper from WorkRequestGETData
   * @param workRequestData The WorkRequestGETData to wrap
   * @returns WorkRequestCrudWrapper instance
   */
  public createWrapper(workRequestData: WorkRequestGETData): WorkRequestCrudWrapper {
    return new WorkRequestCrudWrapper(workRequestData, this.hcclService);
  }

  getWorkRequestTypeFkMenuCriteria(): WorkRequestCriteria {
    // Work request type criteria
    return {
      // Add appropriate criteria for work request types
    };
  }

  getWorkRequestTypeFkMenu(): MenuControlDataList | null {
    // This method should return the work request type menu data
    // For now, return null - implement based on your business logic
    return null;
  }

  onWorkRequestTypeChange(selectedType: any): void {
    // Handle work request type selection change
    console.log('Work Request Type selected:', selectedType);
    // Implement your work request type change logic here
    // For example, update the current entity's workRequestTypeId
    if (selectedType && this.getCurrentEntity()) {
      this.workRequestTypeId = selectedType.id || '';
    }
  }

  onWorkQueueChange(selectedQueue: any): void {
    // Handle work queue selection change
    console.log('Work Queue selected:', selectedQueue);
    // Implement your work queue change logic here
    // For example, update the current entity's workQueueId
    if (selectedQueue && this.getCurrentEntity()) {
      this.workQueueId = selectedQueue.id || '';
    }
  }



   /** Define the menu objects for this crud component */
   protected workRequestTypeMenu: MenuControlDataList | null = null;
   protected workQueueMenu: MenuControlDataList | null = null;
   protected override async prepareMenus(entity: WorkRequestCrudWrapper): Promise<void> {
    
    // TODO: Implement menu preparation logic
    // This is a commented method guts for 'prepareMenu' as requested
    // Make a best guess based on what's in "ClStudentCrudWrapper" methods
    // but leave it commented out
    
    /*
    const fkMenu = await entity.getFkMenu();
    this.workRequestTypeMenu = fkMenu || null;

    // Load work queue menu
    this.workQueueMenu = await entity.getWorkQueueMenu();
    */
    
    return Promise.resolve();
  }


}

export class WorkRequestCrudWrapper extends EntityWrapper<WorkRequestGETData> {
  public static ENTITY_TYPE = 'WorkRequest';
  public static async newInstance(id: string, hcclService: HcclService): Promise<WorkRequestCrudWrapper> {
    const workRequest = await hcclService.getWorkRequestById(id).toPromise();
    if (workRequest) {
      return new WorkRequestCrudWrapper(workRequest, hcclService);
    }
    throw new Error('Work Request not found');
  }
  constructor(data: WorkRequestGETData, hcclService?: HcclService) {
    super(data, hcclService);
    this.entityType = WorkRequestCrudWrapper.ENTITY_TYPE;
  }
  
  getDisplayText(entity?: WorkRequestGETData): string {
    const data = entity || this.data;
    const name = data.name || '';
    const businessCode = data.businessCode || '';
    return name || businessCode || 'Unnamed Work Request';
  }

  getFullName(): string {
    return this.getDisplayText();
  }

  getDescription(): string {
    return this.data.description || '';
  }

  getBusinessCode(): string {
    return this.data.businessCode || '';
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

  getSubjectEntityId(): string {
    return this.data.subjectEntityId || '';
  }

  getSubjectEntityType(): string {
    return this.data.subjectEntityType || '';
  }

  getSubjectEntityName(): string {
    return this.data.subjectEntityName || '';
  }

  getFkMenuCriteria(): WorkRequestCriteria {
    return {
      // Add appropriate criteria for work requests
    };
  }

  async getWorkRequests(criteria?: WorkRequestCriteria): Promise<WorkRequestGETData[]> {
    if (!this.hcclService) {
      return [];
    }
    const result = await this.hcclService.findWorkRequests(criteria || {}).toPromise();
    return result?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const workRequests = await this.getWorkRequests();
    return this.getMenuControlDataList('workRequests', 'Work Requests', workRequests);
  }

}
