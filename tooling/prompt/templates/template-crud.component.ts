// This template is for generating a CRUD component for an entity that has a FK Menu
// This was generated using entityName = EntityName
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
import { EntityNameCriteria, EntityNameGETData, EntityNamePOSTData, EntityNamePUTData, HcclService, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
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
import { EntityNameTypeRefCrudComponent } from '@app/components/_crud/hcclorganizationtyperef/hcclorganizationtyperef-crud.component';


@Component({
  selector: 'app-hcclorganization-crud',
  template: './hcclorganization-crud.component.html',
  styleUrl: './template-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule,
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent, ReferenceDataComponent, EntityNameTypeRefCrudComponent],
  standalone: true
})
export class EntityNameCrudComponent extends AbstractCrudComponent<EntityNameCrudWrapper> implements OnInit, OnChanges {

  constructor() {
    super();
  }

  // Error property for form validation
  public error: any = null;

  

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected async loadEntityByIdCall(id: string): Promise<EntityNameCrudWrapper> {
    const hcclorganization = await EntityNameCrudWrapper.newInstance(id, this.hcclService);
    return hcclorganization;
  }

  protected override async createEntityDataCall(entity: EntityNameCrudWrapper): Promise<any> {
    const postData: EntityNamePOSTData = {
      name: entity.getData().name || '',
      businessCode: entity.getData().businessCode || '',
      description: entity.getData().description || '',
      available: entity.getData().available || 0,
      organizationTypeId: entity.getData().organizationTypeId || '',
      organizationTypeCode: '', // This field is required by POST interface but not available in GET data
      jsonData: entity.getData().jsonData,
      websiteUrl: entity.getData().websiteUrl,
      parentEntityId: entity.getData().parentEntityId,
      parentEntityEntityType: entity.getData().parentEntityEntityType,
      parentEntityName: entity.getData().parentEntityName
    };
 
    // This is important - the requestCreate method returns { id: string, status: 201 }
    try {
      // The requestCreate method returns { id: string, status: 201 }
      const response = await this.hcclService.createEntityName(postData);
      console.log('Create response:', response);
      return response;
    } catch (error) {
      console.error('Create error:', error);
      throw error;
    }

  }

  protected override async updateEntityDataCall(entity: EntityNameCrudWrapper): Promise<void> {
    const putData: EntityNamePUTData = {
      name: entity.getData().name || '',
      businessCode: entity.getData().businessCode || '',
      description: entity.getData().description || '',
      available: entity.getData().available || 0,
      organizationTypeId: entity.getData().organizationTypeId || '',
      jsonData: entity.getData().jsonData,
      websiteUrl: entity.getData().websiteUrl,
      parentEntityId: entity.getData().parentEntityId,
      parentEntityEntityType: entity.getData().parentEntityEntityType,
      parentEntityName: entity.getData().parentEntityName
    };

    await this.hcclService.updateEntityNameById(entity.getData().id!, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteEntityNameById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting EntityName:', error);
      return false;
    }
  }

  public override newEmptyWrapper(): EntityNameCrudWrapper {
    return EntityNameCrudWrapper.newInstanceForCreate(this.hcclService);
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

  public get available(): number {
    return this.getCurrentEntity()?.getData()?.available || 0;
  }

  public set available(value: number) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().available = value;
    }
  }

  public get organizationTypeId(): string {
    return this.getCurrentEntity()?.getData()?.organizationTypeId || '';
  }

  public set organizationTypeId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().organizationTypeId = value;
    }
  }

  public get jsonData(): string {
    return this.getCurrentEntity()?.getData()?.jsonData || '';
  }

  public set jsonData(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().jsonData = value;
    }
  }

  public get websiteUrl(): string {
    return this.getCurrentEntity()?.getData()?.websiteUrl || '';
  }

  public set websiteUrl(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().websiteUrl = value;
    }
  }

  public get parentEntityId(): string {
    return this.getCurrentEntity()?.getData()?.parentEntityId || '';
  }

  public set parentEntityId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().parentEntityId = value;
    }
  }

  public get parentEntityEntityType(): string {
    return this.getCurrentEntity()?.getData()?.parentEntityEntityType || '';
  }

  public set parentEntityEntityType(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().parentEntityEntityType = value;
    }
  }

  public get parentEntityName(): string {
    return this.getCurrentEntity()?.getData()?.parentEntityName || '';
  }

  public set parentEntityName(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().parentEntityName = value;
    }
  }

  public createWrapper(hcclorganizationData: EntityNameGETData): EntityNameCrudWrapper {
    return new EntityNameCrudWrapper(hcclorganizationData, this.hcclService);
  }

  getEntityNameFkMenuCriteria(): EntityNameCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected hcclorganizationMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: EntityNameCrudWrapper): Promise<void> {
    const criteria = this.getEntityNameFkMenuCriteria();
    const results = await this.hcclService.findEntityNames(criteria).toPromise();
    this.hcclorganizationMenu =await entity.getFkMenu("hcclorganizations", this.id);
  }
}

export class EntityNameCrudWrapper extends EntityWrapper<EntityNameGETData> {

  public static newInstanceForCreate(hcclService: HcclService, entityIn?: EntityNameGETData | null): EntityNameCrudWrapper {
    const emptyData: EntityNameGETData = {
      name: '',
      businessCode: '',
      description: '',
      available: 0,
      organizationTypeId: ''
    };
    return new EntityNameCrudWrapper(entityIn || emptyData, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<EntityNameCrudWrapper> {
    const data = await hcclService.getEntityNameById(id).toPromise();
    if (!data) {
      throw new Error('EntityName not found');
    }
    return new EntityNameCrudWrapper(data, hcclService);
  }

  constructor(data: EntityNameGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  getDisplayText(entity?: EntityNameGETData): string {
    const data = entity || this.getData();
    if (data.name) {
      return data.name;
    }
    if (data.businessCode) {
      return data.businessCode;
    }
    return data.id || 'Unknown EntityName';
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
  getWebsiteUrl(): string {
    return this.getData().websiteUrl || '';
  }

  getAvailable(): number {
    return this.getData().available || 0;
  }

  isActive(): boolean {
    return this.getData().available === 1;
  }

  getFkMenuCriteria(): EntityNameCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  async getEntityNames(criteria?: EntityNameCriteria): Promise<EntityNameGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const results = await this.hcclService.findEntityNames(criteria || this.getFkMenuCriteria()).toPromise();
    return results?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const hcclorganizations = await this.getEntityNames();
    return this.getMenuControlDataList("hcclorganizations", this.getEntityType() + " Menu", hcclorganizations, data);
  }
} 