// This template is for generating a CRUD component for an entity that has a FK Menu
// This was generated using entityName = WorkItemDeliverable
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
import { WorkItemDeliverableCriteria, WorkItemDeliverableGETData, WorkItemDeliverablePOSTData, WorkItemDeliverablePUTData, HcclService, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
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
// Note: No FK components needed for WorkItemDeliverable based on the interface

@Component({
  selector: 'app-workitemdeliverable-crud',
  templateUrl: './workitemdeliverable-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule,
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent, ReferenceDataComponent],
  standalone: true
})
export class WorkItemDeliverableCrudComponent extends AbstractCrudComponent<WorkItemDeliverableCrudWrapper> implements OnInit, OnChanges {

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

  private validateBusinessCode(businessCode: string): string | null {
    if (!businessCode || businessCode.trim() === '') {
      return 'Business Code is required';
    }
    if (businessCode.length > 128) {
      return 'Business Code must be less than 128 characters';
    }
    return null;
  }

  private validateDescription(description: string): string | null {
    if (description && description.length > 1024) {
      return 'Description must be less than 1024 characters';
    }
    return null;
  }

  private validateDelivTypeCode(delivTypeCode: string): string | null {
    if (!delivTypeCode || delivTypeCode.trim() === '') {
      return 'Delivery Type Code is required';
    }
    if (delivTypeCode.length > 128) {
      return 'Delivery Type Code must be less than 128 characters';
    }
    return null;
  }

  private validateComments(comments: string): string | null {
    if (comments && comments.length > 1024) {
      return 'Comments must be less than 1024 characters';
    }
    return null;
  }

  private validateSubjectEntityType(subjectEntityType: string): string | null {
    if (subjectEntityType && subjectEntityType.length > 50) {
      return 'Subject Entity Type must be less than 50 characters';
    }
    return null;
  }

  private validateSubjectEntityName(subjectEntityName: string): string | null {
    if (subjectEntityName && subjectEntityName.length > 255) {
      return 'Subject Entity Name must be less than 255 characters';
    }
    return null;
  }

  private validateCurrentStateCode(currentStateCode: string): string | null {
    if (!currentStateCode || currentStateCode.trim() === '') {
      return 'Current State Code is required';
    }
    if (currentStateCode.length > 50) {
      return 'Current State Code must be less than 50 characters';
    }
    return null;
  }

  private validateWorkRequestId(workRequestId: string): string | null {
    if (!workRequestId || workRequestId.trim() === '') {
      return 'Work Request ID is required';
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
    
    const businessCodeError = this.validateBusinessCode(this.businessCode);
    if (businessCodeError) {
      errors.businessCode = { errorMessage: businessCodeError };
    }
    
    const descriptionError = this.validateDescription(this.description);
    if (descriptionError) {
      errors.description = { errorMessage: descriptionError };
    }
    
    const delivTypeCodeError = this.validateDelivTypeCode(this.delivTypeCode);
    if (delivTypeCodeError) {
      errors.delivTypeCode = { errorMessage: delivTypeCodeError };
    }
    
    const commentsError = this.validateComments(this.comments);
    if (commentsError) {
      errors.comments = { errorMessage: commentsError };
    }
    
    const subjectEntityTypeError = this.validateSubjectEntityType(this.subjectEntityType);
    if (subjectEntityTypeError) {
      errors.subjectEntityType = { errorMessage: subjectEntityTypeError };
    }
    
    const subjectEntityNameError = this.validateSubjectEntityName(this.subjectEntityName);
    if (subjectEntityNameError) {
      errors.subjectEntityName = { errorMessage: subjectEntityNameError };
    }
    
    const currentStateCodeError = this.validateCurrentStateCode(this.currentStateCode);
    if (currentStateCodeError) {
      errors.currentStateCode = { errorMessage: currentStateCodeError };
    }
    
    const workRequestIdError = this.validateWorkRequestId(this.workRequestId);
    if (workRequestIdError) {
      errors.workRequestId = { errorMessage: workRequestIdError };
    }
    
    return errors;
  }

  private clearValidationErrors(): void {
    this.error = null;
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected async loadEntityByIdCall(id: string): Promise<WorkItemDeliverableCrudWrapper> {
    const workitemdeliverable = await this.hcclService.getWorkItemDeliverableById(id).toPromise();
    if (!workitemdeliverable) {
      throw new Error('WorkItemDeliverable not found');
    }
    return new WorkItemDeliverableCrudWrapper(workitemdeliverable, this.hcclService);
  }

  protected override async createEntityDataCall(entity: WorkItemDeliverableCrudWrapper): Promise<any> {
    const postData: WorkItemDeliverablePOSTData = {
      workRequestId: entity.getData().workRequestId || '',
      workRequestItemId: entity.getData().workRequestItemId,
      nameText: entity.getData().nameText || '',
      businessCode: entity.getData().businessCode || '',
      description: entity.getData().description,
      delivTypeCode: entity.getData().delivTypeCode || '',
      comments: entity.getData().comments,
      jsonData: entity.getData().jsonData,
      subjectEntityId: entity.getData().subjectEntityId,
      subjectEntityType: entity.getData().subjectEntityType,
      subjectEntityName: entity.getData().subjectEntityName,
      currentStateCode: entity.getData().currentStateCode || '',
      currentStateTransitionId: entity.getData().currentStateTransitionId,
      linkToDeliverableId: entity.getData().linkToDeliverableId
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    // This is important - the requestCreate method returns { id: string, status: 201 }
    try {
      // The requestCreate method returns { id: string, status: 201 }
      const response = await this.hcclService.createWorkItemDeliverable(postData);
      console.log('Create response:', response);
      this.clearValidationErrors(); // Clear errors on success
      return response;
    } catch (error) {
      console.error('Create error:', error);
      throw error;
    }
  }

  protected override async updateEntityDataCall(entity: WorkItemDeliverableCrudWrapper): Promise<void> {
    const putData: WorkItemDeliverablePUTData = {
      workRequestId: entity.getData().workRequestId || '',
      workRequestItemId: entity.getData().workRequestItemId,
      nameText: entity.getData().nameText || '',
      businessCode: entity.getData().businessCode || '',
      description: entity.getData().description,
      delivTypeCode: entity.getData().delivTypeCode || '',
      comments: entity.getData().comments,
      jsonData: entity.getData().jsonData,
      subjectEntityId: entity.getData().subjectEntityId,
      subjectEntityType: entity.getData().subjectEntityType,
      subjectEntityName: entity.getData().subjectEntityName,
      currentStateCode: entity.getData().currentStateCode || '',
      currentStateTransitionId: entity.getData().currentStateTransitionId,
      linkToDeliverableId: entity.getData().linkToDeliverableId
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    await this.hcclService.updateWorkItemDeliverableById(entity.getData().id!, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteWorkItemDeliverableById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting WorkItemDeliverable:', error);
      return false;
    }
  }

  public override newEmptyWrapper(): WorkItemDeliverableCrudWrapper {
    return WorkItemDeliverableCrudWrapper.newInstanceForCreate(this.hcclService);
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

  public get workRequestItemId(): string {
    return this.getCurrentEntity()?.getData()?.workRequestItemId || '';
  }

  public set workRequestItemId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().workRequestItemId = value;
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

  public get description(): string {
    return this.getCurrentEntity()?.getData()?.description || '';
  }

  public set description(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().description = value;
    }
  }

  public get delivTypeCode(): string {
    return this.getCurrentEntity()?.getData()?.delivTypeCode || '';
  }

  public set delivTypeCode(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().delivTypeCode = value;
    }
  }

  public get comments(): string {
    return this.getCurrentEntity()?.getData()?.comments || '';
  }

  public set comments(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().comments = value;
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

  public get subjectEntityId(): string {
    return this.getCurrentEntity()?.getData()?.subjectEntityId || '';
  }

  public set subjectEntityId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().subjectEntityId = value;
    }
  }

  public get subjectEntityType(): string {
    return this.getCurrentEntity()?.getData()?.subjectEntityType || '';
  }

  public set subjectEntityType(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().subjectEntityType = value;
    }
  }

  public get subjectEntityName(): string {
    return this.getCurrentEntity()?.getData()?.subjectEntityName || '';
  }

  public set subjectEntityName(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().subjectEntityName = value;
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



  public get linkToDeliverableId(): string {
    return this.getCurrentEntity()?.getData()?.linkToDeliverableId || '';
  }

  public set linkToDeliverableId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().linkToDeliverableId = value;
    }
  }

  public createWrapper(workitemdeliverableData: WorkItemDeliverableGETData): WorkItemDeliverableCrudWrapper {
    return new WorkItemDeliverableCrudWrapper(workitemdeliverableData, this.hcclService);
  }

  getWorkItemDeliverableFkMenuCriteria(): WorkItemDeliverableCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected workitemdeliverableMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: WorkItemDeliverableCrudWrapper): Promise<void> {
    const criteria = this.getWorkItemDeliverableFkMenuCriteria();
    const results = await this.hcclService.findWorkItemDeliverables(criteria).toPromise();
    this.workitemdeliverableMenu = await entity.getFkMenu("workitemdeliverables", this.id);
  }
}

export class WorkItemDeliverableCrudWrapper extends EntityWrapper<WorkItemDeliverableGETData> {

  public static newInstanceForCreate(hcclService: HcclService, entityIn?: WorkItemDeliverableGETData | null): WorkItemDeliverableCrudWrapper {
    const emptyData: WorkItemDeliverableGETData = {
      workRequestId: '',
      nameText: '',
      businessCode: '',
      delivTypeCode: '',
      currentStateCode: ''
    };
    return new WorkItemDeliverableCrudWrapper(entityIn || emptyData, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<WorkItemDeliverableCrudWrapper> {
    const data = await hcclService.getWorkItemDeliverableById(id).toPromise();
    if (!data) {
      throw new Error('WorkItemDeliverable not found');
    }
    return new WorkItemDeliverableCrudWrapper(data, hcclService);
  }

  constructor(data: WorkItemDeliverableGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  getDisplayText(entity?: WorkItemDeliverableGETData): string {
    const data = entity || this.getData();
    if (data.nameText) {
      return data.nameText;
    }
    if (data.businessCode) {
      return data.businessCode;
    }
    return data.id || 'Unknown WorkItemDeliverable';
  }

  getNameText(): string {
    return this.getData().nameText || '';
  }

  getBusinessCode(): string {
    return this.getData().businessCode || '';
  }

  getDescription(): string {
    return this.getData().description || '';
  }

  getDelivTypeCode(): string {
    return this.getData().delivTypeCode || '';
  }

  getComments(): string {
    return this.getData().comments || '';
  }

  getCurrentStateCode(): string {
    return this.getData().currentStateCode || '';
  }

  getFkMenuCriteria(): WorkItemDeliverableCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  async getWorkItemDeliverables(criteria?: WorkItemDeliverableCriteria): Promise<WorkItemDeliverableGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const results = await this.hcclService.findWorkItemDeliverables(criteria || this.getFkMenuCriteria()).toPromise();
    return results?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const workitemdeliverables = await this.getWorkItemDeliverables();
    return this.getMenuControlDataList("workitemdeliverables", this.getEntityType() + " Menu", workitemdeliverables, data);
  }
} 