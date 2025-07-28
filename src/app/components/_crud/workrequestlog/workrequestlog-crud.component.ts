// This template is for generating a CRUD component for an entity that has a FK Menu
// This was generated using entityName = WorkRequestLog
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
import { WorkRequestLogCriteria, WorkRequestLogGETData, WorkRequestLogPOSTData, WorkRequestLogPUTData, HcclService, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
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
import { WorkRequestItemCrudComponent } from '@app/components/_crud/workrequestitem/workrequestitem-crud.component';

@Component({
  selector: 'app-workrequestlog-crud',
  templateUrl: './workrequestlog-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule,
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent, ReferenceDataComponent, WorkRequestCrudComponent, WorkRequestItemCrudComponent],
  standalone: true
})
export class WorkRequestLogCrudComponent extends AbstractCrudComponent<WorkRequestLogCrudWrapper> implements OnInit, OnChanges {

  constructor() {
    super();
  }

  // Error property for form validation
  public error: any = null;

  // Validation methods
  private validateNameText(nameText: string): string | null {
    if (!nameText || nameText.trim() === '') {
      return 'Name Text is required';
    }
    if (nameText.length > 255) {
      return 'Name Text must be less than 255 characters';
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

  private validateTransactionReferenceId(transactionReferenceId: string): string | null {
    if (!transactionReferenceId || transactionReferenceId.trim() === '') {
      return 'Transaction Reference ID is required';
    }
    return null;
  }

  private validateWorkRequestId(workRequestId: string): string | null {
    if (!workRequestId || workRequestId.trim() === '') {
      return 'Work Request ID is required';
    }
    return null;
  }

  private validateCreatedByUserId(createdByUserId: string): string | null {
    if (!createdByUserId || createdByUserId.trim() === '') {
      return 'Created By User ID is required';
    }
    return null;
  }

  private validateRoleCode(roleCode: string): string | null {
    if (!roleCode || roleCode.trim() === '') {
      return 'Role Code is required';
    }
    if (roleCode.length > 50) {
      return 'Role Code must be less than 50 characters';
    }
    return null;
  }

  private validateEventCode(eventCode: string): string | null {
    if (!eventCode || eventCode.trim() === '') {
      return 'Event Code is required';
    }
    if (eventCode.length > 50) {
      return 'Event Code must be less than 50 characters';
    }
    return null;
  }

  private validateActionSubCode(actionSubCode: string): string | null {
    if (actionSubCode && actionSubCode.length > 50) {
      return 'Action Sub Code must be less than 50 characters';
    }
    return null;
  }

  private validateStatusCode(statusCode: string): string | null {
    if (statusCode && statusCode.length > 50) {
      return 'Status Code must be less than 50 characters';
    }
    return null;
  }

  // Validate all fields and return error object
  private validateForm(): any {
    const errors: any = {};
    
    const nameTextError = this.validateNameText(this.nameText);
    if (nameTextError) {
      errors.nameText = { errorMessage: nameTextError };
    }
    
    const descriptionError = this.validateDescription(this.description);
    if (descriptionError) {
      errors.description = { errorMessage: descriptionError };
    }
    
    const transactionReferenceIdError = this.validateTransactionReferenceId(this.transactionReferenceId);
    if (transactionReferenceIdError) {
      errors.transactionReferenceId = { errorMessage: transactionReferenceIdError };
    }
    
    const workRequestIdError = this.validateWorkRequestId(this.workRequestId);
    if (workRequestIdError) {
      errors.workRequestId = { errorMessage: workRequestIdError };
    }
    
    const createdByUserIdError = this.validateCreatedByUserId(this.createdByUserId);
    if (createdByUserIdError) {
      errors.createdByUserId = { errorMessage: createdByUserIdError };
    }
    
    const roleCodeError = this.validateRoleCode(this.roleCode);
    if (roleCodeError) {
      errors.roleCode = { errorMessage: roleCodeError };
    }
    
    const eventCodeError = this.validateEventCode(this.eventCode);
    if (eventCodeError) {
      errors.eventCode = { errorMessage: eventCodeError };
    }
    
    const actionSubCodeError = this.validateActionSubCode(this.actionSubCode);
    if (actionSubCodeError) {
      errors.actionSubCode = { errorMessage: actionSubCodeError };
    }
    
    const statusCodeError = this.validateStatusCode(this.statusCode);
    if (statusCodeError) {
      errors.statusCode = { errorMessage: statusCodeError };
    }
    
    return errors;
  }

  private clearValidationErrors(): void {
    this.error = null;
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected async loadEntityByIdCall(id: string): Promise<WorkRequestLogCrudWrapper> {
    const workrequestlog = await this.hcclService.getWorkRequestLogById(id).toPromise();
    if (!workrequestlog) {
      throw new Error('WorkRequestLog not found');
    }
    return new WorkRequestLogCrudWrapper(workrequestlog, this.hcclService);
  }

  protected override async createEntityDataCall(entity: WorkRequestLogCrudWrapper): Promise<any> {
    const postData: WorkRequestLogPOSTData = {
      nameText: entity.getData().nameText || '',
      description: entity.getData().description || '',
      transactionReferenceId: entity.getData().transactionReferenceId || '',
      workRequestId: entity.getData().workRequestId || '',
      workRequestItemId: entity.getData().workRequestItemId,
      workRequestReasonId: entity.getData().workRequestReasonId,
      stateTransitionLogId: entity.getData().stateTransitionLogId,
      createdByUserId: entity.getData().createdByUserId || '',
      roleCode: entity.getData().roleCode || '',
      eventCode: entity.getData().eventCode || '',
      actionSubCode: entity.getData().actionSubCode,
      statusCode: entity.getData().statusCode,
      commentText: entity.getData().commentText
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    // This is important - the requestCreate method returns { id: string, status: 201 }
    try {
      // The requestCreate method returns { id: string, status: 201 }
      const response = await this.hcclService.createWorkRequestLog(postData);
      console.log('Create response:', response);
      this.clearValidationErrors(); // Clear errors on success
      return response;
    } catch (error) {
      console.error('Create error:', error);
      throw error;
    }

  }

  protected override async updateEntityDataCall(entity: WorkRequestLogCrudWrapper): Promise<void> {
    const putData: WorkRequestLogPUTData = {
      nameText: entity.getData().nameText || '',
      description: entity.getData().description || '',
      transactionReferenceId: entity.getData().transactionReferenceId || '',
      workRequestId: entity.getData().workRequestId || '',
      workRequestItemId: entity.getData().workRequestItemId,
      workRequestReasonId: entity.getData().workRequestReasonId,
      stateTransitionLogId: entity.getData().stateTransitionLogId,
      createdByUserId: entity.getData().createdByUserId || '',
      roleCode: entity.getData().roleCode || '',
      eventCode: entity.getData().eventCode || '',
      actionSubCode: entity.getData().actionSubCode,
      statusCode: entity.getData().statusCode,
      commentText: entity.getData().commentText
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    await this.hcclService.updateWorkRequestLogById(entity.getData().id!, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteWorkRequestLogById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting WorkRequestLog:', error);
      return false;
    }
  }

  public override newEmptyWrapper(): WorkRequestLogCrudWrapper {
    return WorkRequestLogCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  // Getter and setter methods for form binding
  public get nameText(): string {
    return this.getCurrentEntity()?.getData()?.nameText || '';
  }

  public set nameText(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().nameText = value;
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

  public get transactionReferenceId(): string {
    return this.getCurrentEntity()?.getData()?.transactionReferenceId || '';
  }

  public set transactionReferenceId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().transactionReferenceId = value;
    }
  }

  public get workRequestId(): string {
    return this.getCurrentEntity()?.getData()?.workRequestId || '';
  }

  public set workRequestId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().workRequestId = value;
    }
  }

  public get workRequestItemId(): string {
    return this.getCurrentEntity()?.getData()?.workRequestItemId || '';
  }

  public set workRequestItemId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().workRequestItemId = value;
    }
  }

  public get workRequestReasonId(): string {
    return this.getCurrentEntity()?.getData()?.workRequestReasonId || '';
  }

  public set workRequestReasonId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().workRequestReasonId = value;
    }
  }

  public get stateTransitionLogId(): string {
    return this.getCurrentEntity()?.getData()?.stateTransitionLogId || '';
  }

  public set stateTransitionLogId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().stateTransitionLogId = value;
    }
  }

  public get createdByUserId(): string {
    return this.getCurrentEntity()?.getData()?.createdByUserId || '';
  }

  public set createdByUserId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().createdByUserId = value;
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

  public get eventCode(): string {
    return this.getCurrentEntity()?.getData()?.eventCode || '';
  }

  public set eventCode(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().eventCode = value;
    }
  }

  public get actionSubCode(): string {
    return this.getCurrentEntity()?.getData()?.actionSubCode || '';
  }

  public set actionSubCode(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().actionSubCode = value;
    }
  }

  public get statusCode(): string {
    return this.getCurrentEntity()?.getData()?.statusCode || '';
  }

  public set statusCode(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().statusCode = value;
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

  public createWrapper(workrequestlogData: WorkRequestLogGETData): WorkRequestLogCrudWrapper {
    return new WorkRequestLogCrudWrapper(workrequestlogData, this.hcclService);
  }

  getWorkRequestLogFkMenuCriteria(): WorkRequestLogCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected workrequestlogMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: WorkRequestLogCrudWrapper): Promise<void> {
    const criteria = this.getWorkRequestLogFkMenuCriteria();
    const results = await this.hcclService.findWorkRequestLogs(criteria).toPromise();
    this.workrequestlogMenu = await entity.getFkMenu("workrequestlogs", this.id);
  }
}

export class WorkRequestLogCrudWrapper extends EntityWrapper<WorkRequestLogGETData> {

  public static newInstanceForCreate(hcclService: HcclService, entityIn?: WorkRequestLogGETData | null): WorkRequestLogCrudWrapper {
    const emptyData: WorkRequestLogGETData = {
      nameText: '',
      description: '',
      transactionReferenceId: '',
      workRequestId: '',
      createdByUserId: '',
      roleCode: '',
      eventCode: ''
    };
    return new WorkRequestLogCrudWrapper(entityIn || emptyData, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<WorkRequestLogCrudWrapper> {
    const data = await hcclService.getWorkRequestLogById(id).toPromise();
    if (!data) {
      throw new Error('WorkRequestLog not found');
    }
    return new WorkRequestLogCrudWrapper(data, hcclService);
  }

  constructor(data: WorkRequestLogGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  getDisplayText(entity?: WorkRequestLogGETData): string {
    const data = entity || this.getData();
    if (data.nameText) {
      return data.nameText;
    }
    if (data.description) {
      return data.description;
    }
    return data.id || 'Unknown WorkRequestLog';
  }

  getFullName(): string {
    return this.getData().nameText || '';
  }

  getDescription(): string {
    return this.getData().description || '';
  }

  getTransactionReferenceId(): string {
    return this.getData().transactionReferenceId || '';
  }

  getWorkRequestId(): string {
    return this.getData().workRequestId || '';
  }

  getCreatedByUserId(): string {
    return this.getData().createdByUserId || '';
  }

  getRoleCode(): string {
    return this.getData().roleCode || '';
  }

  getEventCode(): string {
    return this.getData().eventCode || '';
  }

  getFkMenuCriteria(): WorkRequestLogCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  async getWorkRequestLogs(criteria?: WorkRequestLogCriteria): Promise<WorkRequestLogGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const results = await this.hcclService.findWorkRequestLogs(criteria || this.getFkMenuCriteria()).toPromise();
    return results?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const workrequestlogs = await this.getWorkRequestLogs();
    return this.getMenuControlDataList("workrequestlogs", this.getEntityType() + " Menu", workrequestlogs, data);
  }
} 