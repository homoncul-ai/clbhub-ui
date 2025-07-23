import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { WorkRequestTypeRefCriteria, WorkRequestTypeRefGETData, WorkRequestTypeRefPOSTData, WorkRequestTypeRefPUTData, HcclService, MenuControlDataList } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { Observable, map } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';

@Component({
  selector: 'app-workrequesttype-crud',
  standalone: true,
  imports: [CommonModule, FormsModule, SimpleMessagesSectionComponent, AvailableSelectorComponent],
  templateUrl: './workrequesttype-crud.component.html',
  styleUrl: './workrequesttype-crud.component.scss'
})
export class WorkrequesttypeCrudComponent extends AbstractCrudComponent<WorkRequestTypeCrudWrapper> implements OnInit, OnChanges {
/**
 * This is a component that will be used to create, read, update and delete Work Request Types
 * It will use the AbstractCrudComponent to handle the CRUD operations
 * It will use the WorkRequestTypeRefGETData and WorkRequestTypeRefPOSTData interfaces to handle the data
 * It will use the HcclService to handle the data
 * 
 * Input parameter:
 * - id?: string - Optional work request type ID to load a specific work request type for viewing/editing
 * 
 * If no ID is provided, the component will load the full list of work request types.
 * If an ID is provided, the component will load that specific work request type and show it in detail mode.
 * 
 * Create a wrapper class that extends EntityWrapper<WorkRequestTypeRefGETData>
 * and implement the abstract methods of the AbstractCrudComponent
 */

  
  constructor() {
    super();
  }
     /** Standard boiler plate for ngOnInit */
  override ngOnInit(): void {
    super.ngOnInit();
    this.entityType = WorkRequestTypeCrudWrapper.ENTITY_TYPE;
  }


  protected async loadEntityByIdCall(id: string): Promise<WorkRequestTypeCrudWrapper> {
    const workRequestType = await this.hcclService.getWorkRequestTypeRefById(id).toPromise();
      if (workRequestType) {
        return new WorkRequestTypeCrudWrapper(workRequestType, this.hcclService);
      }
      throw new Error('Work Request Type not found');
  }
  


  protected override async createEntityDataCall(entity: WorkRequestTypeCrudWrapper): Promise<any> {
      // Use entityNew if in create mode, otherwise use the passed entity
      const workRequestTypeData = this.getMode() === CRUD_MODES.CREATE && this.entityNew ? this.entityNew.getData() : entity.getData();
      
      const postData: WorkRequestTypeRefPOSTData = {
        name: workRequestTypeData.name || '',
        businessCode: workRequestTypeData.businessCode || '',
        description: workRequestTypeData.description || '',
        policyBeanName: workRequestTypeData.policyBeanName || '',
        available: workRequestTypeData.available || 1
      };

      return this.hcclService.createWorkRequestTypeRef(postData);
  }



  protected override async updateEntityDataCall(entity: WorkRequestTypeCrudWrapper): Promise<void> {
      const workRequestTypeData = entity.getData();
      if (!workRequestTypeData.id) {
        throw new Error('Work Request Type ID is required for update');
      }

      const putData: WorkRequestTypeRefPUTData = {
        name: workRequestTypeData.name || '',
        businessCode: workRequestTypeData.businessCode || '',
        description: workRequestTypeData.description || '',
        policyBeanName: workRequestTypeData.policyBeanName || '',
        available: workRequestTypeData.available || 1
      };

      await this.hcclService.updateWorkRequestTypeRefById(workRequestTypeData.id, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteWorkRequestTypeRefById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting work request type:', error);
      throw error;
    }
  }


  
  public override newEmptyWrapper(): WorkRequestTypeCrudWrapper {
    return this.createWrapper(WorkRequestTypeCrudWrapper.newEmpty());
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

  public get policyBeanName(): string {
    return this.getCurrentEntity().getData().policyBeanName || '';
  }

  public set policyBeanName(value: string) {
    var data = super.getEntityForSet();
    data.getData().policyBeanName = value;
  }

  public get available(): number {
    return this.getCurrentEntity().getData().available || 1;
  }

  public set available(value: number) {
    var data = super.getEntityForSet();
    data.getData().available = value;
  }

 
  /**
   * Create a wrapper from WorkRequestTypeRefGETData
   * @param workRequestTypeData The WorkRequestTypeRefGETData to wrap
   * @returns WorkRequestTypeCrudWrapper instance
   */
  public createWrapper(workRequestTypeData: WorkRequestTypeRefGETData): WorkRequestTypeCrudWrapper {
    return new WorkRequestTypeCrudWrapper(workRequestTypeData, this.hcclService);
  }

   /** Define the menu objects for this crud component */
   protected workRequestTypeMenu: MenuControlDataList | null = null;
   protected override async prepareMenus(entity: WorkRequestTypeCrudWrapper): Promise<void> {
    
    const fkMenu = await entity.getFkMenu();
    this.workRequestTypeMenu = fkMenu || null;
    return Promise.resolve();
  }


}

export class WorkRequestTypeCrudWrapper extends EntityWrapper<WorkRequestTypeRefGETData> {

  public static ENTITY_TYPE = 'WorkRequestType';
  public static async newInstance(id: string, hcclService: HcclService): Promise<WorkRequestTypeCrudWrapper> {
    const workRequestType: WorkRequestTypeRefGETData | undefined = id && id.length > 0 ? await hcclService.getWorkRequestTypeRefById(id).toPromise() : undefined;
    if (!workRequestType) {
      return new WorkRequestTypeCrudWrapper(WorkRequestTypeCrudWrapper.newEmpty(), hcclService);
    }
    return new WorkRequestTypeCrudWrapper(workRequestType, hcclService);
  }

  public static newEmpty() : WorkRequestTypeRefGETData {
    return {
      name: '',
      businessCode: '',
      description: '',
      policyBeanName: '',
      available: 1
    };
  }

  constructor(data: WorkRequestTypeRefGETData, hcclService?: HcclService) {
    super(data, hcclService);
    this.entityType = WorkRequestTypeCrudWrapper.ENTITY_TYPE;
  }
  
  getDisplayText(entity?: WorkRequestTypeRefGETData): string {
    const data = entity || this.data;
    return data.name || data.businessCode || 'Unknown Work Request Type';
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

  getPolicyBeanName(): string {
    return this.data.policyBeanName || '';
  }

  isActive(): boolean {
    return this.data.available === 1;
  }

  getFkMenuCriteria(): WorkRequestTypeRefCriteria {
    return {
      available: 1
    };
  }

  async getWorkRequestTypes(criteria?: WorkRequestTypeRefCriteria): Promise<WorkRequestTypeRefGETData[]> {
    if (!this.hcclService) {
      return [];
    }
    const searchCriteria = criteria || this.getFkMenuCriteria();
    const result = await this.hcclService.findWorkRequestTypeRefs(searchCriteria).toPromise();
    return result?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const workRequestTypes = await this.getWorkRequestTypes();
    const id = this.getId();
    return this.getMenuControlDataList('workRequestTypes', 'Work Request Types', workRequestTypes, id);
  }

}
