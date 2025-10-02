// This template is for generating a CRUD component for an entity that has a FK Menu
// This was generated using entityName = HcclTeamLog
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
import { HcclTeamLogCriteria, HcclTeamLogGETData, HcclTeamLogPOSTData, HcclTeamLogPUTData, HcclService, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
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
import { HcclTeamCrudComponent } from '@app/components/_crud/hcclteam/hcclteam-crud.component';import { TeamMemberCrudComponent } from '@app/components/_crud/teammember/teammember-crud.component';
import { HcclUserProfileCrudComponent } from '../hccluserprofile/hccluserprofile-crud.component';

@Component({
  selector: 'app-hcclteamlog-crud',
  templateUrl: './hcclteamlog-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule,
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent, ReferenceDataComponent, HcclTeamCrudComponent, HcclUserProfileCrudComponent],
  standalone: true
})
export class HcclTeamLogCrudComponent extends AbstractCrudComponent<HcclTeamLogCrudWrapper> implements OnInit, OnChanges {

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

  private validateTeamId(teamId: string): string | null {
    if (!teamId || teamId.trim() === '') {
      return 'Team ID is required';
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

  private validateActionCode(actionCode: string): string | null {
    if (!actionCode || actionCode.trim() === '') {
      return 'Action Code is required';
    }
    if (actionCode.length > 50) {
      return 'Action Code must be less than 50 characters';
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
    
    const teamIdError = this.validateTeamId(this.teamId);
    if (teamIdError) {
      errors.teamId = { errorMessage: teamIdError };
    }
    
    const roleCodeError = this.validateRoleCode(this.roleCode);
    if (roleCodeError) {
      errors.roleCode = { errorMessage: roleCodeError };
    }
    
    const actionCodeError = this.validateActionCode(this.actionCode);
    if (actionCodeError) {
      errors.actionCode = { errorMessage: actionCodeError };
    }
    
    return errors;
  }

  private clearValidationErrors(): void {
    this.error = null;
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected async loadEntityByIdCall(id: string): Promise<HcclTeamLogCrudWrapper> {
    const hcclteamlog = await this.hcclService.getHcclTeamLogById(id).toPromise();
    if (!hcclteamlog) {
      throw new Error('HcclTeamLog not found');
    }
    return new HcclTeamLogCrudWrapper(hcclteamlog, this.hcclService);
  }

  protected override async createEntityDataCall(entity: HcclTeamLogCrudWrapper): Promise<any> {
    const postData: HcclTeamLogPOSTData = {
      nameText: entity.getData().nameText || '',
      description: entity.getData().description || '',
      teamId: entity.getData().teamId || '',
      userProfileId: entity.getData().userProfileId,
      roleCode: entity.getData().roleCode || '',
      actionCode: entity.getData().actionCode || '',
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
      const response = await this.hcclService.createHcclTeamLog(postData);
      console.log('Create response:', response);
      this.clearValidationErrors(); // Clear errors on success
      return response;
    } catch (error) {
      console.error('Create error:', error);
      throw error;
    }

  }

  protected override async updateEntityDataCall(entity: HcclTeamLogCrudWrapper): Promise<void> {
    const putData: HcclTeamLogPUTData = {
      nameText: entity.getData().nameText || '',
      description: entity.getData().description || '',
      teamId: entity.getData().teamId || '',
      userProfileId: entity.getData().userProfileId,
      roleCode: entity.getData().roleCode || '',
      actionCode: entity.getData().actionCode || '',
      commentText: entity.getData().commentText
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    await this.hcclService.updateHcclTeamLogById(entity.getData().id!, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteHcclTeamLogById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting HcclTeamLog:', error);
      return false;
    }
  }

  public override newEmptyWrapper(): HcclTeamLogCrudWrapper {
    return HcclTeamLogCrudWrapper.newInstanceForCreate(this.hcclService);
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

  public get teamId(): string {
    return this.getCurrentEntity()?.getData()?.teamId || '';
  }

  public set teamId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().teamId = value;
    }
  }

  public get userProfileId(): string {
    return this.getCurrentEntity()?.getData()?.userProfileId || '';
  }

  public set userProfileId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().userProfileId = value;
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

  public get commentText(): string {
    return this.getCurrentEntity()?.getData()?.commentText || '';
  }

  public set commentText(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().commentText = value;
    }
  }

  public createWrapper(hcclteamlogData: HcclTeamLogGETData): HcclTeamLogCrudWrapper {
    return new HcclTeamLogCrudWrapper(hcclteamlogData, this.hcclService);
  }

  getHcclTeamLogFkMenuCriteria(): HcclTeamLogCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected hcclteamlogMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: HcclTeamLogCrudWrapper): Promise<void> {
    const criteria = this.getHcclTeamLogFkMenuCriteria();
    const results = await this.hcclService.findHcclTeamLogs(criteria).toPromise();
    this.hcclteamlogMenu = await entity.getFkMenu("hcclteamlogs", this.id);
  }
}

export class HcclTeamLogCrudWrapper extends EntityWrapper<HcclTeamLogGETData> {

  public static newInstanceForCreate(hcclService: HcclService, entityIn?: HcclTeamLogGETData | null): HcclTeamLogCrudWrapper {
    const emptyData: HcclTeamLogGETData = {
      nameText: '',
      description: '',
      teamId: '',
      roleCode: '',
      actionCode: ''
    };
    return new HcclTeamLogCrudWrapper(entityIn || emptyData, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<HcclTeamLogCrudWrapper> {
    const data = await hcclService.getHcclTeamLogById(id).toPromise();
    if (!data) {
      throw new Error('HcclTeamLog not found');
    }
    return new HcclTeamLogCrudWrapper(data, hcclService);
  }

  constructor(data: HcclTeamLogGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  getDisplayText(entity?: HcclTeamLogGETData): string {
    const data = entity || this.getData();
    if (data.nameText) {
      return data.nameText;
    }
    return data.id || 'Unknown HcclTeamLog';
  }

  getNameText(): string {
    return this.getData().nameText || '';
  }

  getDescription(): string {
    return this.getData().description || '';
  }

  getTeamId(): string {
    return this.getData().teamId || '';
  }

  getUserProfileId(): string {
    return this.getData().userProfileId || '';
  }

  getRoleCode(): string {
    return this.getData().roleCode || '';
  }

  getActionCode(): string {
    return this.getData().actionCode || '';
  }

  getCommentText(): string {
    return this.getData().commentText || '';
  }

  getFkMenuCriteria(): HcclTeamLogCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  async getHcclTeamLogs(criteria?: HcclTeamLogCriteria): Promise<HcclTeamLogGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const results = await this.hcclService.findHcclTeamLogs(criteria || this.getFkMenuCriteria()).toPromise();
    return results?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const hcclteamlogs = await this.getHcclTeamLogs();
    return this.getMenuControlDataList("hcclteamlogs", this.getEntityType() + " Menu", hcclteamlogs, data);
  }
} 