import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, Validators } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { WorkRequestCriteria, WorkRequestGETData, WorkRequestPOSTData, WorkRequestPUTData, HcclService, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
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
import { WorkrequesttyperefCrudComponent } from '@app/components/_crud/workrequesttyperef/workrequesttyperef-crud.component';
import { WorkqueueCrudComponent } from '@app/components/_crud/workqueue/workqueue-crud.component';
import { HcclTeamCrudComponent } from '@app/components/_crud/hcclteam/hcclteam-crud.component';
import { HccluserCrudComponent } from '@app/components/_crud/hccluser/hccluser-crud.component';
import { ProviderCrudComponent } from '@app/components/_crud/provider/provider-crud.component';
import { ProviderRequestCrudComponent } from "../providerrequest/providerrequest-crud.component";

@Component({
  selector: 'app-workrequest-crud',
  templateUrl: './workrequest-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
      imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule,
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent, ReferenceDataComponent,
    WorkrequesttyperefCrudComponent, WorkqueueCrudComponent, HcclTeamCrudComponent, HccluserCrudComponent, ProviderRequestCrudComponent, ProviderRequestCrudComponent],
  standalone: true
})
export class WorkRequestCrudComponent extends AbstractCrudComponent<WorkRequestCrudWrapper> implements OnInit, OnChanges {

  constructor() {
    super();
  }

  // Error property for form validation
  public error: any = null;

  // Validation methods
  private validateName(name: string): string | null {
    if (!name || name.trim() === '') {
      return 'Name is required';
    }
    if (name.length > 255) {
      return 'Name must be less than 255 characters';
    }
    return null;
  }

  private validateBusinessCode(businessCode: string): string | null {
    if (!businessCode || businessCode.trim() === '') {
      return 'Business Code is required';
    }
    if (businessCode.length > 50) {
      return 'Business Code must be less than 50 characters';
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

  private validateWorkRequestTypeId(workRequestTypeId: string): string | null {
    if (!workRequestTypeId || workRequestTypeId.trim() === '') {
      return 'Work Request Type is required';
    }
    return null;
  }

  private validateCurrentStateCode(currentStateCode: string): string | null {
    if (!currentStateCode || currentStateCode.trim() === '') {
      return 'Current State Code is required';
    }
    return null;
  }

  private validateWorkQueueId(workQueueId: string): string | null {
    if (!workQueueId || workQueueId.trim() === '') {
      return 'Work Queue is required';
    }
    return null;
  }

  // Validate all fields and return error object
  private validateForm(): any {
    const errors: any = {};
    
    const nameError = this.validateName(this.name);
    if (nameError) {
      errors.name = { errorMessage: nameError };
    }
    
    const businessCodeError = this.validateBusinessCode(this.businessCode);
    if (businessCodeError) {
      errors.businessCode = { errorMessage: businessCodeError };
    }
    
    const descriptionError = this.validateDescription(this.description);
    if (descriptionError) {
      errors.description = { errorMessage: descriptionError };
    }
    
    const workRequestTypeIdError = this.validateWorkRequestTypeId(this.workRequestTypeId);
    if (workRequestTypeIdError) {
      errors.workRequestTypeId = { errorMessage: workRequestTypeIdError };
    }
    
    const currentStateCodeError = this.validateCurrentStateCode(this.currentStateCode);
    if (currentStateCodeError) {
      errors.currentStateCode = { errorMessage: currentStateCodeError };
    }
    
    const workQueueIdError = this.validateWorkQueueId(this.workQueueId);
    if (workQueueIdError) {
      errors.workQueueId = { errorMessage: workQueueIdError };
    }
    
    return errors;
  }

  private clearValidationErrors(): void {
    this.error = null;
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected async loadEntityByIdCall(id: string): Promise<WorkRequestCrudWrapper> {
    const workrequest = await this.hcclService.getWorkRequestById(id).toPromise();
    if (!workrequest) {
      throw new Error('WorkRequest not found');
    }
    return new WorkRequestCrudWrapper(workrequest, this.hcclService);
  }

  protected override async createEntityDataCall(entity: WorkRequestCrudWrapper): Promise<any> {
    const postData: WorkRequestPOSTData = {
      name: entity.getData().name || '',
      businessCode: entity.getData().businessCode || '',
      description: entity.getData().description || '',
      workRequestTypeId: entity.getData().workRequestTypeId || '',
      currentStateCode: entity.getData().currentStateCode || '',
      currentStateTransitionId: entity.getData().currentStateTransitionId,
      workQueueId: entity.getData().workQueueId || '',
      createdByTeamId: entity.getData().createdByTeamId,
      createdByUserId: entity.getData().createdByUserId,
      acceptedByTeamId: entity.getData().acceptedByTeamId,
      acceptedByUserId: entity.getData().acceptedByUserId,
      subjectEntityId: entity.getData().subjectEntityId,
      subjectEntityType: entity.getData().subjectEntityType,
      subjectEntityName: entity.getData().subjectEntityName,
      parentWorkRequestItemId: entity.getData().parentWorkRequestItemId,
      initialWorkQueueId: entity.getData().initialWorkQueueId || ''
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    try {
      const response = await this.hcclService.createWorkRequest(postData);
      console.log('Create response:', response);
      this.clearValidationErrors();
      return response;
    } catch (error) {
      console.error('Create error:', error);
      throw error;
    }
  }

  protected override async updateEntityDataCall(entity: WorkRequestCrudWrapper): Promise<void> {
    const putData: WorkRequestPUTData = {
      name: entity.getData().name || '',
      businessCode: entity.getData().businessCode || '',
      description: entity.getData().description || '',
      workRequestTypeId: entity.getData().workRequestTypeId || '',
      currentStateCode: entity.getData().currentStateCode || '',
      currentStateTransitionId: entity.getData().currentStateTransitionId,
      workQueueId: entity.getData().workQueueId || '',
      createdByTeamId: entity.getData().createdByTeamId,
      createdByUserId: entity.getData().createdByUserId,
      acceptedByTeamId: entity.getData().acceptedByTeamId,
      acceptedByUserId: entity.getData().acceptedByUserId,
      subjectEntityId: entity.getData().subjectEntityId,
      subjectEntityType: entity.getData().subjectEntityType,
      subjectEntityName: entity.getData().subjectEntityName,
      parentWorkRequestItemId: entity.getData().parentWorkRequestItemId,
      initialWorkQueueId: entity.getData().initialWorkQueueId || ''
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    await this.hcclService.updateWorkRequestById(entity.getData().id!, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteWorkRequestById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting WorkRequest:', error);
      return false;
    }
  }

  public override newEmptyWrapper(): WorkRequestCrudWrapper {
    return WorkRequestCrudWrapper.newInstanceForCreate(this.hcclService);
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

  public get workRequestTypeId(): string {
    return this.getCurrentEntity()?.getData()?.workRequestTypeId || '';
  }

  public set workRequestTypeId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().workRequestTypeId = value;
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



  public get workQueueId(): string {
    return this.getCurrentEntity()?.getData()?.workQueueId || '';
  }

  public set workQueueId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().workQueueId = value;
    }
  }

  public get createdByTeamId(): string {
    return this.getCurrentEntity()?.getData()?.createdByTeamId || '';
  }

  public set createdByTeamId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().createdByTeamId = value;
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

  public get acceptedByTeamId(): string {
    return this.getCurrentEntity()?.getData()?.acceptedByTeamId || '';
  }

  public set acceptedByTeamId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().acceptedByTeamId = value;
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

  public get parentWorkRequestItemId(): string {
    return this.getCurrentEntity()?.getData()?.parentWorkRequestItemId || '';
  }

  public set parentWorkRequestItemId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().parentWorkRequestItemId = value;
    }
  }

  public createWrapper(workrequestData: WorkRequestGETData): WorkRequestCrudWrapper {
    return new WorkRequestCrudWrapper(workrequestData, this.hcclService);
  }

  getWorkRequestFkMenuCriteria(): WorkRequestCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected workrequestMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: WorkRequestCrudWrapper): Promise<void> {
    const criteria = this.getWorkRequestFkMenuCriteria();
    const results = await this.hcclService.findWorkRequests(criteria).toPromise();
    this.workrequestMenu = await entity.getFkMenu("workrequests", this.id);
  }
}

export class WorkRequestCrudWrapper extends EntityWrapper<WorkRequestGETData> {

  public static newInstanceForCreate(hcclService: HcclService, entityIn?: WorkRequestGETData | null): WorkRequestCrudWrapper {
    const emptyData: WorkRequestGETData = {
      name: '',
      businessCode: '',
      description: '',
      workRequestTypeId: '',
      currentStateCode: '',
      workQueueId: ''
    };
    return new WorkRequestCrudWrapper(entityIn || emptyData, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<WorkRequestCrudWrapper> {
    const data = await hcclService.getWorkRequestById(id).toPromise();
    if (!data) {
      throw new Error('WorkRequest not found');
    }
    return new WorkRequestCrudWrapper(data, hcclService);
  }

  constructor(data: WorkRequestGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  getDisplayText(entity?: WorkRequestGETData): string {
    const data = entity || this.getData();
    if (data.name) {
      return data.name;
    }
    if (data.businessCode) {
      return data.businessCode;
    }
    return data.id || 'Unknown WorkRequest';
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

  getWorkRequestTypeId(): string {
    return this.getData().workRequestTypeId || '';
  }

  getCurrentStateCode(): string {
    return this.getData().currentStateCode || '';
  }

  getWorkQueueId(): string {
    return this.getData().workQueueId || '';
  }

  getFkMenuCriteria(): WorkRequestCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  isTicketAccepted(): boolean {
    return this.getData().acceptedByUserId != null;
  }

  async getWorkRequests(criteria?: WorkRequestCriteria): Promise<WorkRequestGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const results = await this.hcclService.findWorkRequests(criteria || this.getFkMenuCriteria()).toPromise();
    return results?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const workrequests = await this.getWorkRequests();
    return this.getMenuControlDataList("workrequests", this.getEntityType() + " Menu", workrequests, data);
  }
} 