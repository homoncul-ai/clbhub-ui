import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, Validators } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { WorkRequestItemCriteria, WorkRequestItemGETData, WorkRequestItemPOSTData, WorkRequestItemPUTData, HcclService, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
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
import { WorkRequestCrudComponent } from '@app/components/_crud/workrequest/workrequest-crud.component';
import { HccluserCrudComponent } from '@app/components/_crud/hccluser/hccluser-crud.component';

@Component({
  selector: 'app-workrequestitem-crud',
  templateUrl: './workrequestitem-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule,
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent, ReferenceDataComponent, 
    WorkRequestCrudComponent, HccluserCrudComponent],
  standalone: true
})
export class WorkRequestItemCrudComponent extends AbstractCrudComponent<WorkRequestItemCrudWrapper> implements OnInit, OnChanges {

  constructor() {
    super();
  }

  // Error property for form validation
  public error: any = null;

  // Validation methods
  private validateWorkRequestId(workRequestId: string): string | null {
    if (!workRequestId || workRequestId.trim() === '') {
      return 'Work Request is required';
    }
    return null;
  }

  private validateNameText(nameText: string): string | null {
    if (!nameText || nameText.trim() === '') {
      return 'Name Text is required';
    }
    return null;
  }

  private validateBusinessCode(businessCode: string): string | null {
    if (!businessCode || businessCode.trim() === '') {
      return 'Business Code is required';
    }
    return null;
  }

  private validateSequenceOrder(sequenceOrder: number): string | null {
    if (sequenceOrder === null || sequenceOrder === undefined || sequenceOrder < 0) {
      return 'Sequence Order is required and must be a positive number';
    }
    return null;
  }

  private validateDescription(description: string): string | null {
    if (!description || description.trim() === '') {
      return 'Description is required';
    }
    return null;
  }

  private validateActionCode(actionCode: string): string | null {
    if (!actionCode || actionCode.trim() === '') {
      return 'Action Code is required';
    }
    return null;
  }

  private validateCurrentStateCode(currentStateCode: string): string | null {
    if (!currentStateCode || currentStateCode.trim() === '') {
      return 'Current State Code is required';
    }
    return null;
  }

  // Validate all fields and return error object
  private validateForm(): any {
    const errors: any = {};
    
    const workRequestIdError = this.validateWorkRequestId(this.workRequestId);
    if (workRequestIdError) {
      errors.workRequestId = { errorMessage: workRequestIdError };
    }
    
    const nameTextError = this.validateNameText(this.nameText);
    if (nameTextError) {
      errors.nameText = { errorMessage: nameTextError };
    }
    
    const businessCodeError = this.validateBusinessCode(this.businessCode);
    if (businessCodeError) {
      errors.businessCode = { errorMessage: businessCodeError };
    }
    
    const sequenceOrderError = this.validateSequenceOrder(this.sequenceOrder);
    if (sequenceOrderError) {
      errors.sequenceOrder = { errorMessage: sequenceOrderError };
    }
    
    const descriptionError = this.validateDescription(this.description);
    if (descriptionError) {
      errors.description = { errorMessage: descriptionError };
    }
    
    const actionCodeError = this.validateActionCode(this.actionCode);
    if (actionCodeError) {
      errors.actionCode = { errorMessage: actionCodeError };
    }
    
    const currentStateCodeError = this.validateCurrentStateCode(this.currentStateCode);
    if (currentStateCodeError) {
      errors.currentStateCode = { errorMessage: currentStateCodeError };
    }
    
    return errors;
  }

  private clearValidationErrors(): void {
    this.error = null;
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected async loadEntityByIdCall(id: string): Promise<WorkRequestItemCrudWrapper> {
    const workrequestitem = await this.hcclService.getWorkRequestItemById(id).toPromise();
    if (!workrequestitem) {
      throw new Error('WorkRequestItem not found');
    }
    return new WorkRequestItemCrudWrapper(workrequestitem, this.hcclService);
  }

  protected override async createEntityDataCall(entity: WorkRequestItemCrudWrapper): Promise<any> {
    const postData: WorkRequestItemPOSTData = {
      workRequestId: entity.getData().workRequestId || '',
      nameText: entity.getData().nameText || '',
      businessCode: entity.getData().businessCode || '',
      sequenceOrder: entity.getData().sequenceOrder || 0,
      description: entity.getData().description || '',
      acceptedByUserId: entity.getData().acceptedByUserId,
      roleCode: entity.getData().roleCode,
      actionCode: entity.getData().actionCode || '',
      jsonData: entity.getData().jsonData,
      commentText: entity.getData().commentText,
      currentStateCode: entity.getData().currentStateCode || '',
      currentStateTransitionId: entity.getData().currentStateTransitionId
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    try {
      const response = await this.hcclService.createWorkRequestItem(postData);
      console.log('Create response:', response);
      this.clearValidationErrors();
      return response;
    } catch (error) {
      console.error('Create error:', error);
      throw error;
    }
  }

  protected override async updateEntityDataCall(entity: WorkRequestItemCrudWrapper): Promise<void> {
    const putData: WorkRequestItemPUTData = {
      workRequestId: entity.getData().workRequestId || '',
      nameText: entity.getData().nameText || '',
      businessCode: entity.getData().businessCode || '',
      sequenceOrder: entity.getData().sequenceOrder || 0,
      description: entity.getData().description || '',
      acceptedByUserId: entity.getData().acceptedByUserId,
      roleCode: entity.getData().roleCode,
      actionCode: entity.getData().actionCode || '',
      jsonData: entity.getData().jsonData,
      commentText: entity.getData().commentText,
      currentStateCode: entity.getData().currentStateCode || '',
      currentStateTransitionId: entity.getData().currentStateTransitionId
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    await this.hcclService.updateWorkRequestItemById(entity.getData().id!, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteWorkRequestItemById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting WorkRequestItem:', error);
      return false;
    }
  }

  public override newEmptyWrapper(): WorkRequestItemCrudWrapper {
    return WorkRequestItemCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  // Getter and setter methods for form binding
  public get workRequestId(): string {
    return this.getCurrentEntity()?.getData()?.workRequestId || '';
  }

  public set workRequestId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().workRequestId = value;
    }
  }

  public get nameText(): string {
    return this.getCurrentEntity()?.getData()?.nameText || '';
  }

  public set nameText(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().nameText = value;
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

  public get sequenceOrder(): number {
    return this.getCurrentEntity()?.getData()?.sequenceOrder || 0;
  }

  public set sequenceOrder(value: number) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().sequenceOrder = value;
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

  public get acceptedByUserId(): string {
    return this.getCurrentEntity()?.getData()?.acceptedByUserId || '';
  }

  public set acceptedByUserId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().acceptedByUserId = value;
    }
  }

  public get roleCode(): string {
    return this.getCurrentEntity()?.getData()?.roleCode || '';
  }

  public set roleCode(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().roleCode = value;
    }
  }

  public get actionCode(): string {
    return this.getCurrentEntity()?.getData()?.actionCode || '';
  }

  public set actionCode(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().actionCode = value;
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

  public get commentText(): string {
    return this.getCurrentEntity()?.getData()?.commentText || '';
  }

  public set commentText(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().commentText = value;
    }
  }

  public get currentStateCode(): string {
    return this.getCurrentEntity()?.getData()?.currentStateCode || '';
  }

  public set currentStateCode(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().currentStateCode = value;
    }
  }

  public get currentStateTransitionId(): string {
    return this.getCurrentEntity()?.getData()?.currentStateTransitionId || '';
  }

  public set currentStateTransitionId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().currentStateTransitionId = value;
    }
  }

  public createWrapper(workrequestitemData: WorkRequestItemGETData): WorkRequestItemCrudWrapper {
    return new WorkRequestItemCrudWrapper(workrequestitemData, this.hcclService);
  }

  getWorkRequestItemFkMenuCriteria(): WorkRequestItemCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected workrequestitemMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: WorkRequestItemCrudWrapper): Promise<void> {
    const criteria = this.getWorkRequestItemFkMenuCriteria();
    const results = await this.hcclService.findWorkRequestItems(criteria).toPromise();
    this.workrequestitemMenu = await entity.getFkMenu("workrequestitems", this.id);
  }
}

export class WorkRequestItemCrudWrapper extends EntityWrapper<WorkRequestItemGETData> {

  public static newInstanceForCreate(hcclService: HcclService, entityIn?: WorkRequestItemGETData | null): WorkRequestItemCrudWrapper {
    const emptyData: WorkRequestItemGETData = {
      workRequestId: '',
      nameText: '',
      businessCode: '',
      sequenceOrder: 0,
      description: '',
      actionCode: '',
      currentStateCode: ''
    };
    return new WorkRequestItemCrudWrapper(entityIn || emptyData, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<WorkRequestItemCrudWrapper> {
    const data = await hcclService.getWorkRequestItemById(id).toPromise();
    if (!data) {
      throw new Error('WorkRequestItem not found');
    }
    return new WorkRequestItemCrudWrapper(data, hcclService);
  }

  constructor(data: WorkRequestItemGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  getDisplayText(entity?: WorkRequestItemGETData): string {
    const data = entity || this.getData();
    if (data.nameText) {
      return data.nameText;
    }
    if (data.businessCode) {
      return data.businessCode;
    }
    return data.id || 'Unknown WorkRequestItem';
  }

  getFullName(): string {
    return this.getData().nameText || '';
  }

  getBusinessCode(): string {
    return this.getData().businessCode || '';
  }

  getDescription(): string {
    return this.getData().description || '';
  }

  getWorkRequestId(): string {
    return this.getData().workRequestId || '';
  }

  getSequenceOrder(): number {
    return this.getData().sequenceOrder || 0;
  }

  getActionCode(): string {
    return this.getData().actionCode || '';
  }

  getCurrentStateCode(): string {
    return this.getData().currentStateCode || '';
  }

  getFkMenuCriteria(): WorkRequestItemCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  async getWorkRequestItems(criteria?: WorkRequestItemCriteria): Promise<WorkRequestItemGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const results = await this.hcclService.findWorkRequestItems(criteria || this.getFkMenuCriteria()).toPromise();
    return results?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const workrequestitems = await this.getWorkRequestItems();
    return this.getMenuControlDataList("workrequestitems", this.getEntityType() + " Menu", workrequestitems, data);
  }
} 