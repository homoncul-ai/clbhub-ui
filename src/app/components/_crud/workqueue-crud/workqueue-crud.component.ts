import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { WorkQueueCriteria, WorkQueueGETData, WorkQueuePOSTData, WorkQueuePUTData, HcclService, MenuControlDataList } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { Observable, map } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';

@Component({
  selector: 'app-workqueue-crud',
  imports: [CommonModule, FormsModule, SimpleMessagesSectionComponent, MenuControlDataListComponent, AvailableSelectorComponent],
  templateUrl: './workqueue-crud.component.html',
  styleUrl: './workqueue-crud.component.scss'
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
     /** Standard boiler plate for ngOnInit */
  override ngOnInit(): void {
    super.ngOnInit();
  }


  protected async loadEntityByIdCall(id: string): Promise<WorkQueueCrudWrapper> {
    const workQueue = await this.hcclService.getWorkQueueById(id).toPromise();
      if (workQueue) {
        return new WorkQueueCrudWrapper(workQueue, this.hcclService);
      }
      throw new Error('Work Queue not found');
  }
  


  protected async createEntityDataCall(entity: WorkQueueCrudWrapper): Promise<WorkQueueCrudWrapper> {
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
        organizationId: workQueueData.organizationId,
        externalQueue: workQueueData.externalQueue || 0
      };

      const createdWorkQueue = await this.hcclService.createWorkQueue(postData).toPromise();
      if (createdWorkQueue) {
        return new WorkQueueCrudWrapper(createdWorkQueue, this.hcclService);
      }
      throw new Error('Failed to create work queue');
     
  }

  protected async updateEntityDataCall(entity: WorkQueueCrudWrapper): Promise<WorkQueueCrudWrapper> {
      const workQueueData = entity.getData();
      if (!workQueueData.id) {
        throw new Error('Work Queue ID is required for update');
      }

      const putData: WorkQueuePUTData = {
        name: workQueueData.name || '',
        businessCode: workQueueData.businessCode || '',
        description: workQueueData.description || '',
        prefixCode: workQueueData.prefixCode || '',
        workQueueTypeId: workQueueData.workQueueTypeId || '',
        workQueueTeamId: workQueueData.workQueueTeamId || '',
        available: workQueueData.available || 1,
        organizationId: workQueueData.organizationId,
        externalQueue: workQueueData.externalQueue || 0
      };

      const updatedWorkQueue = await this.hcclService.updateWorkQueueById(workQueueData.id, putData).toPromise();
      if (updatedWorkQueue) {
        return new WorkQueueCrudWrapper(updatedWorkQueue, this.hcclService);
      }
      throw new Error('Failed to update work queue');
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteWorkQueueById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting work queue:', error);
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
      externalQueue: 0
    };
    
    return new WorkQueueCrudWrapper(emptyWorkQueue, this.hcclService);
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

  public get organizationId(): string {
    return this.getCurrentEntity().getData().organizationId || '';
  }

  public set organizationId(value: string) {
    var data = super.getEntityForSet();
    data.getData().organizationId = value;
  }

 
  /**
   * Create a wrapper from WorkQueueGETData
   * @param workQueueData The WorkQueueGETData to wrap
   * @returns WorkQueueCrudWrapper instance
   */
  public createWrapper(workQueueData: WorkQueueGETData): WorkQueueCrudWrapper {
    return new WorkQueueCrudWrapper(workQueueData, this.hcclService);
  }

  onWorkQueueTypeChange(selectedType: any): void {
    // Handle work queue type selection change
    console.log('Work Queue Type selected:', selectedType);
    // Implement your work queue type change logic here
    if (selectedType && this.getCurrentEntity()) {
      this.workQueueTypeId = selectedType.id || '';
    }
  }

  onWorkQueueTeamChange(selectedTeam: any): void {
    // Handle work queue team selection change
    console.log('Work Queue Team selected:', selectedTeam);
    // Implement your work queue team change logic here
    if (selectedTeam && this.getCurrentEntity()) {
      this.workQueueTeamId = selectedTeam.id || '';
    }
  }

   /** Define the menu objects for this crud component */
   protected workQueueTypeMenu: MenuControlDataList | null = null;
   protected workQueueTeamMenu: MenuControlDataList | null = null;
   protected override async prepareMenus(entity: WorkQueueCrudWrapper): Promise<void> {
    
    // TODO: Implement menu preparation logic
    // This would load the work queue type and team menus
    // For now, we'll leave this commented out as per instructions
    /*
    const fkMenu = await entity.getFkMenu();
    this.workQueueTypeMenu = fkMenu || null;

    var teamWrapper = await WorkQueueTeamCrudWrapper.newInstance(entity.getWorkQueueTeamId(), this.hcclService);
    this.workQueueTeamMenu = await teamWrapper.getFkMenu();
    */
    return Promise.resolve();
  }


}

export class WorkQueueCrudWrapper extends EntityWrapper<WorkQueueGETData> {

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
    const businessCode = data.businessCode || '';
    return name || businessCode || 'Unnamed Work Queue';
  }

  getFullName(): string {
    const data = this.data;
    const name = data.name || '';
    const businessCode = data.businessCode || '';
    return name || businessCode || 'Unnamed Work Queue';
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

  isActive(): boolean {
    return this.data.available === 1;
  }

  isExternalQueue(): boolean {
    return this.data.externalQueue === 1;
  }

  getFkMenuCriteria(): WorkQueueCriteria {
    return {
      available: 1
    };
  }

  async getWorkQueues(criteria?: WorkQueueCriteria): Promise<WorkQueueGETData[]> {
    if (!this.hcclService) {
      return [];
    }
    const searchResults = await this.hcclService.findWorkQueues(criteria || this.getFkMenuCriteria()).toPromise();
    return searchResults?.searchResults || [];
  }

   public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    // TODO: Implement FK menu logic
    // This would return a menu of work queues for selection
    return super.getFkMenu(menuHint, data);
  }

}
