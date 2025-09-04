// This template is for generating a CRUD component for an entity that has a FK Menu
// This was generated using entityName = PersonalStatement
// Generate the new personalstatement-crud.component.ts   files using this template
// Of course, the code related to the attribtutes of the entity shoule be changed to match the entityName
// Review the HTML after the generation is complete and maker sure all the imports required are included.


import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, Validators } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { PersonalStatementCriteria, PersonalStatementGETData, PersonalStatementPOSTData, PersonalStatementPUTData, HcclService, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { Observable, map } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';
import { ReferenceDataComponent } from '@app/components/_global/reference-data/reference-data.component';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';

@Component({
  selector: 'app-personalstatement-crud',
  templateUrl: './personalstatement-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule,
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent, ReferenceDataComponent],
  standalone: true
})
export class PersonalStatementCrudComponent extends AbstractCrudComponent<PersonalStatementCrudWrapper> implements OnInit, OnChanges {

  constructor() {
    super();
  }

  // Error property for form validation
  public error: any = null;

  

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected async loadEntityByIdCall(id: string): Promise<PersonalStatementCrudWrapper> {
    const personalstatement = await this.hcclService.getPersonalStatementById(id).toPromise();
    if (!personalstatement) {
      throw new Error('PersonalStatement not found');
    }
    return new PersonalStatementCrudWrapper(personalstatement, this.hcclService);
  }

  protected override async createEntityDataCall(entity: PersonalStatementCrudWrapper): Promise<any> {
    const postData: PersonalStatementPOSTData = {
      name: entity.getData().name || '',
      businessCode: entity.getData().businessCode || '',
      description: entity.getData().description || '',
      statementTypeCode: entity.getData().statementTypeCode || '',
      parentEntityId: entity.getData().parentEntityId || '',
      parentEntityType: entity.getData().parentEntityType || '',
      parentEntityName: entity.getData().parentEntityName || '',
      rawText: entity.getData().rawText || '',
      encodingText: entity.getData().encodingText || '',
      vocationEncodingId: entity.getData().vocationEncodingId || '',
      status: entity.getData().status || 0
    };
 
    // This is important - the requestCreate method returns { id: string, status: 201 }
    try {
      // The requestCreate method returns { id: string, status: 201 }
      const response = await this.hcclService.createPersonalStatement(postData);
      console.log('Create response:', response);
      return response;
    } catch (error) {
      console.error('Create error:', error);
      throw error;
    }

  }

  protected override async updateEntityDataCall(entity: PersonalStatementCrudWrapper): Promise<void> {
    const putData: PersonalStatementPUTData = {
      name: entity.getData().name || '',
      businessCode: entity.getData().businessCode || '',
      description: entity.getData().description || '',
      statementTypeCode: entity.getData().statementTypeCode || '',
      parentEntityId: entity.getData().parentEntityId || '',
      parentEntityType: entity.getData().parentEntityType || '',
      parentEntityName: entity.getData().parentEntityName || '',
      rawText: entity.getData().rawText || '',
      encodingText: entity.getData().encodingText || '',
      vocationEncodingId: entity.getData().vocationEncodingId || '',
      status: entity.getData().status || 0
    };

    await this.hcclService.updatePersonalStatementById(entity.getData().id!, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deletePersonalStatementById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting PersonalStatement:', error);
      return false;
    }
  }

  public override newEmptyWrapper(): PersonalStatementCrudWrapper {
    return PersonalStatementCrudWrapper.newInstanceForCreate(this.hcclService);
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

  public get statementTypeCode(): string {
    return this.getCurrentEntity()?.getData()?.statementTypeCode || '';
  }

  public set statementTypeCode(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().statementTypeCode = value;
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

  public get parentEntityType(): string {
    return this.getCurrentEntity()?.getData()?.parentEntityType || '';
  }

  public set parentEntityType(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().parentEntityType = value;
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

  public get rawText(): string {
    return this.getCurrentEntity()?.getData()?.rawText || '';
  }

  public set rawText(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().rawText = value;
    }
  }

  public get encodingText(): string {
    return this.getCurrentEntity()?.getData()?.encodingText || '';
  }

  public set encodingText(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().encodingText = value;
    }
  }

  public get vocationEncodingId(): string {
    return this.getCurrentEntity()?.getData()?.vocationEncodingId || '';
  }

  public set vocationEncodingId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().vocationEncodingId = value;
    }
  }

  public get status(): number {
    return this.getCurrentEntity()?.getData()?.status || 0;
  }

  public set status(value: number) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().status = value;
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

  public createWrapper(personalstatementData: PersonalStatementGETData): PersonalStatementCrudWrapper {
    return new PersonalStatementCrudWrapper(personalstatementData, this.hcclService);
  }

  getPersonalStatementFkMenuCriteria(): PersonalStatementCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected personalstatementMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: PersonalStatementCrudWrapper): Promise<void> {
    const criteria = this.getPersonalStatementFkMenuCriteria();
    const results = await this.hcclService.findPersonalStatements(criteria).toPromise();
    this.personalstatementMenu = await entity.getFkMenu("personalstatements", this.id);
  }
}

export class PersonalStatementCrudWrapper extends EntityWrapper<PersonalStatementGETData> {

  public static newInstanceForCreate(hcclService: HcclService, entityIn?: PersonalStatementGETData | null): PersonalStatementCrudWrapper {
    const emptyData: PersonalStatementGETData = {
      name: '',
      businessCode: '',
      description: '',
      statementTypeCode: '',
      parentEntityId: '',
      parentEntityType: '',
      parentEntityName: '',
      rawText: '',
      encodingText: '',
      vocationEncodingId: '',
      status: 0
    };
    return new PersonalStatementCrudWrapper(entityIn || emptyData, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<PersonalStatementCrudWrapper> {
    const data = await hcclService.getPersonalStatementById(id).toPromise();
    if (!data) {
      throw new Error('PersonalStatement not found');
    }
    return new PersonalStatementCrudWrapper(data, hcclService);
  }

  constructor(data: PersonalStatementGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  getDisplayText(entity?: PersonalStatementGETData): string {
    const data = entity || this.getData();
    if (data.name) {
      return data.name;
    }
    if (data.businessCode) {
      return data.businessCode;
    }
    return data.id || 'Unknown PersonalStatement';
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

  getStatementTypeCode(): string {
    return this.getData().statementTypeCode || '';
  }

  getParentEntityName(): string {
    return this.getData().parentEntityName || '';
  }

  getRawText(): string {
    return this.getData().rawText || '';
  }

  getEncodingText(): string {
    return this.getData().encodingText || '';
  }

  getStatus(): number {
    return this.getData().status || 0;
  }
  getVocationEncodingId(): string {
    return this.getData().vocationEncodingId || '';
  }
  
  getFkMenuCriteria(): PersonalStatementCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  async getPersonalStatements(criteria?: PersonalStatementCriteria): Promise<PersonalStatementGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const results = await this.hcclService.findPersonalStatements(criteria || this.getFkMenuCriteria()).toPromise();
    return results?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const personalstatements = await this.getPersonalStatements();
    return this.getMenuControlDataList("personalstatements", this.getEntityType() + " Menu", personalstatements, data);
  }
}
