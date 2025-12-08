// This template is for generating a CRUD component for an entity that has a FK Menu
// This was generated using entityName = CatalogTypeRef
// Generate the new [entityName]-crud.component.ts   files using this template
// Of course, the code related to the attribtutes of the entity shoule be changed to match the entityName
// Review the HTML after the generation is complete and maker sure all the imports required are included.


import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, Validators } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { CatalogTypeRefCriteria, CatalogTypeRefGETData, CatalogTypeRefPOSTData, CatalogTypeRefPUTData, HcclService, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { Observable, map } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';
import { ReferenceDataComponent } from '@app/components/_global/reference-data/reference-data.component';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';

// Import are all the FK Menus for the UI to use <app-entityNameFk-crud>
// No FK components needed for CatalogTypeRef

@Component({
  selector: 'app-catalogtyperef-crud',
  templateUrl: './catalogtyperef-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule,
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent, ReferenceDataComponent],
  standalone: true
})
export class CatalogTypeRefCrudComponent extends AbstractCrudComponent<CatalogTypeRefCrudWrapper> implements OnInit, OnChanges {

  constructor() {
    super();
  }

  // Error property for form validation
  public error: any = null;

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected async loadEntityByIdCall(id: string): Promise<CatalogTypeRefCrudWrapper> {
    const catalogtyperef = await CatalogTypeRefCrudWrapper.newInstance(id, this.hcclService);
    return catalogtyperef;
  }

  protected override async createEntityDataCall(entity: CatalogTypeRefCrudWrapper): Promise<any> {
    const postData: CatalogTypeRefPOSTData = {
      name: entity.getData().name || '',
      businessCode: entity.getData().businessCode || '',
      description: entity.getData().description || '',
      signupPacketId: entity.getData().signupPacketId
    };
 
    // This is important - the requestCreate method returns { id: string, status: 201 }
    try {
      // The requestCreate method returns { id: string, status: 201 }
      const response = await this.hcclService.createCatalogTypeRef(postData);
      console.log('Create response:', response);
      return response;
    } catch (error) {
      console.error('Create error:', error);
      throw error;
    }

  }

  protected override async updateEntityDataCall(entity: CatalogTypeRefCrudWrapper): Promise<void> {
    const putData: CatalogTypeRefPUTData = {
      name: entity.getData().name || '',
      businessCode: entity.getData().businessCode || '',
      description: entity.getData().description || '',
      signupPacketId: entity.getData().signupPacketId
    };

    await this.hcclService.updateCatalogTypeRefById(entity.getData().id!, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteCatalogTypeRefById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting CatalogTypeRef:', error);
      return false;
    }
  }

  public override newEmptyWrapper(): CatalogTypeRefCrudWrapper {
    return CatalogTypeRefCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  // Getter and setter methods for form binding
  public get name(): string {
    return this.getCurrentEntity()?.getData()?.name || '';
  }

  public set name(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().name = value;
    }
  }

  public get businessCode(): string {
    return this.getCurrentEntity()?.getData()?.businessCode || '';
  }

  public set businessCode(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().businessCode = value;
    }
  }

  public get description(): string {
    return this.getCurrentEntity()?.getData()?.description || '';
  }

  public set description(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().description = value;
    }
  }

  public get signupPacketId(): string {
    return this.getCurrentEntity()?.getData()?.signupPacketId || '';
  }

  public set signupPacketId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().signupPacketId = value;
    }
  }

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

  public createWrapper(catalogtyperefData: CatalogTypeRefGETData): CatalogTypeRefCrudWrapper {
    return new CatalogTypeRefCrudWrapper(catalogtyperefData, this.hcclService);
  }

  getCatalogTypeRefFkMenuCriteria(): CatalogTypeRefCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected catalogtyperefMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: CatalogTypeRefCrudWrapper): Promise<void> {
    // const criteria = this.getCatalogTypeRefFkMenuCriteria();
    // const results = await this.hcclService.findCatalogTypeRefs(criteria).toPromise();
    // this.catalogtyperefMenu = await entity.getFkMenu("catalogtyperefs", this.id);
    // Note: CatalogTypeRef has no foreign keys, so this method may not be needed
    // If FK menus are needed in the future, uncomment and implement above
  }
}

export class CatalogTypeRefCrudWrapper extends EntityWrapper<CatalogTypeRefGETData> {

  public static newInstanceForCreate(hcclService: HcclService, entityIn?: CatalogTypeRefGETData | null): CatalogTypeRefCrudWrapper {
    const emptyData: CatalogTypeRefGETData = {
      name: '',
      businessCode: '',
      description: ''
    };
    return new CatalogTypeRefCrudWrapper(entityIn || emptyData, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<CatalogTypeRefCrudWrapper> {
    const data = await hcclService.getCatalogTypeRefById(id).toPromise();
    if (!data) {
      throw new Error('CatalogTypeRef not found');
    }
    return new CatalogTypeRefCrudWrapper(data, hcclService);
  }

  constructor(data: CatalogTypeRefGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  getDisplayText(entity?: CatalogTypeRefGETData): string {
    const data = entity || this.getData();
    if (data.name) {
      return data.name;
    }
    if (data.businessCode) {
      return data.businessCode;
    }
    return data.id || 'Unknown CatalogTypeRef';
  }

  getFullName(): string {
    return this.getData().name || '';
  }

  getBusinessCode(): string {
    return this.getData().businessCode || '';
  }

  getDescription(): string {
    return this.getData().description || '';
  }

  getFkMenuCriteria(): CatalogTypeRefCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  async getCatalogTypeRefs(criteria?: CatalogTypeRefCriteria): Promise<CatalogTypeRefGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const results = await this.hcclService.findCatalogTypeRefs(criteria || this.getFkMenuCriteria()).toPromise();
    return results?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const catalogtyperefs = await this.getCatalogTypeRefs();
    return this.getMenuControlDataList("catalogtyperefs", this.getEntityType() + " Menu", catalogtyperefs, data);
  }
}

