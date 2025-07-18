import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { ProviderTypeRefCriteria, ProviderTypeRefGETData, ProviderTypeRefPOSTData, ProviderTypeRefPUTData, HcclService, MenuControlDataList } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { Observable, map } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';
import { R } from 'node_modules/@angular/cdk/overlay.d-BdoMy0hX';

@Component({
  selector: 'app-providertyperef-crud',
  imports: [CommonModule, FormsModule, SimpleMessagesSectionComponent, MenuControlDataListComponent, AvailableSelectorComponent, DategetdataDisplayComponent],
  templateUrl: './providertyperef-crud.component.html'
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
     // Use entityNew if in create mode, otherwise use the passed entity
     const providerTypeRefData = this.getMode() === CRUD_MODES.CREATE && this.entityNew ? this.entityNew.getData() : entity.getData();
    
     const postData: ProviderTypeRefPOSTData = {
       name: providerTypeRefData.name || '',
       businessCode: providerTypeRefData.businessCode || '',
       description: providerTypeRefData.description || '',
       available: providerTypeRefData.available || 1
     };

     // The requestCreate method now returns { id: string, status: 201 }
     const response = this.hcclService.createProviderTypeRef(postData).toPromise();     
     console.log('Create response:', response);
     return response;
  }



  protected override async updateEntityDataCall(entity: ProviderTypeRefCrudWrapper): Promise<void> {
      const providerTypeRefData = entity.getData();
      if (!providerTypeRefData.id) {
        throw new Error('Provider Type Ref ID is required for update');    }

      const putData: ProviderTypeRefPUTData = {
        name: providerTypeRefData.name || '',
        businessCode: providerTypeRefData.businessCode || '',
        description: providerTypeRefData.description || '',
        available: providerTypeRefData.available ||1   };

      this.hcclService.updateProviderTypeRefById(providerTypeRefData.id, putData).toPromise();
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

  getProviderTypeRefFkMenu(): MenuControlDataList | null {
    // This method should return the provider type ref menu data
    // For now, return null - implement based on your business logic
    return null;
  }
   /** Define the menu objects for this crud component */
   protected providerTypeRefMenu: MenuControlDataList | null = null;
   protected override async prepareMenus(entity: ProviderTypeRefCrudWrapper): Promise<void> {
    
    const fkMenu = await entity.getFkMenu();
    // Actually, we're going to load the provider type ref wrapper, then call getProviderTypeRefMenu
    this.providerTypeRefMenu = fkMenu || null;

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
    // TODO: Implement prepareMenu method
    // This is a commented method guts for 'prepareMenu'. Make a best guess (based on what in "ClstudentCrudWrapper" methods) as to what 
    // the implementation should be, but leave it commented out. Add any existing WrapperComponents that will 
    // be required for the FK presentation in the modeName=details' template.
    
    // For now, return an empty MenuControlDataList - this would need to be implemented based on business logic
    return { items: [] } as MenuControlDataList;
  }
} 