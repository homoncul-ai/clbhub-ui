import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { HcclTeamMemberCriteria, HcclTeamMemberGETData, HcclTeamMemberPOSTData, HcclTeamMemberPUTData, HcclService, 
  MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { Observable, map } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';
import { HcclTeamCrudComponent } from '@app/components/_crud/hcclteam/hcclteam-crud.component';
import { HccluserCrudComponent } from '@app/components/_crud/hccluser/hccluser-crud.component';
import { HcclUserProfileCrudComponent } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { ReferenceDataComponent } from '@app/components/_global/reference-data/reference-data.component';
import { DateGETData } from '@app/restsvc/common-request-service.model';

@Component({
  selector: 'app-teammember-crud',
  templateUrl: './teammember-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MdbFormsModule, TranslateModule, 
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent,
    HcclTeamCrudComponent, HccluserCrudComponent, HcclUserProfileCrudComponent, ReferenceDataComponent],
  standalone: true
})
export class TeamMemberCrudComponent extends AbstractCrudComponent<HcclTeamMemberCrudWrapper> implements OnInit, OnChanges {

  public form: FormGroup;
  public isSubmitting = false;

  constructor() {
    super();
    this.form = new FormGroup({});
  }

  // Error property for form validation
  public error: any = null;

  // Validation methods
  private validateTeamId(teamId: string): string | null {
    if (!teamId || teamId.trim() === '') {
      return 'Team is required';
    }
    return null;
  }

  private validateUserId(userId: string): string | null {
    if (!userId || userId.trim() === '') {
      return 'User is required';
    }
    return null;
  }

  private validateDateAdded(dateAdded: DateGETData): string | null {
    if (!dateAdded  ) {
      return 'Date Added is required';
    }
    return null;
  }

  // Validate all fields and return error object
  private validateForm(): any {
    const errors: any = {};
    
    const teamIdError = this.validateTeamId(this.teamId);
    if (teamIdError) {
      errors.teamId = { errorMessage: teamIdError };
    }
    
    const userIdError = this.validateUserId(this.userId);
    if (userIdError) {
      errors.userId = { errorMessage: userIdError };
    }
    
    const dateAddedError = this.validateDateAdded(this.dateAdded);
    if (dateAddedError) {
      errors.dateAdded = { errorMessage: dateAddedError };
    }
    
    return errors;
  }

  private clearValidationErrors(): void {
    this.error = null;
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected async loadEntityByIdCall(id: string): Promise<HcclTeamMemberCrudWrapper> {
    const teammember = await this.hcclService.getHcclTeamMemberById(id).toPromise();
    if (!teammember) {
      throw new Error('TeamMember not found');
    }
    return new HcclTeamMemberCrudWrapper(teammember, this.hcclService);
  }

  protected override async createEntityDataCall(entity: HcclTeamMemberCrudWrapper): Promise<any> {
    const postData: HcclTeamMemberPOSTData = {
      teamId: entity.getData().teamId || '',
      userId: entity.getData().userId || '',
      userProfileId: entity.getData().userProfileId,
      dateAdded: entity.getDateAdded().formattedDate || '',
      dateRemoved: entity.getDateRemoved().formattedDate || ''
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    try {
      const response = await this.hcclService.createHcclTeamMember(postData);
      console.log('Create response:', response);
      this.clearValidationErrors(); // Clear errors on success
      return response;
    } catch (error) {
      console.error('Create error:', error);
      throw error;
    }
  }

  protected override async updateEntityDataCall(entity: HcclTeamMemberCrudWrapper): Promise<void> {
    const putData: HcclTeamMemberPUTData = {
      teamId: entity.getData().teamId || '',
      userId: entity.getData().userId || '',
      userProfileId: entity.getData().userProfileId,
      dateAdded: entity.getDateAdded()?.formattedDate || '',
      dateRemoved: entity.getDateRemoved()?.formattedDate || ''
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    await this.hcclService.updateHcclTeamMemberById(entity.getData().id!, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteHcclTeamMemberById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting TeamMember:', error);
      return false;
    }
  }

  public override newEmptyWrapper(): HcclTeamMemberCrudWrapper {
    return HcclTeamMemberCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  // Getter and setter methods for form binding
  public get teamId(): string {
    return this.getCurrentEntity()?.getData()?.teamId || '';
  }

  public set teamId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().teamId = value;
    }
  }

  public get userId(): string {
    return this.getCurrentEntity()?.getData()?.userId || '';
  }

  public set userId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().userId = value;
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

  public get dateAdded(): DateGETData {
    return this.getCurrentEntity()?.getDateAdded() || '';
  }

  public set dateAdded(value: DateGETData) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.setDateAdded(value);
    }
  }

  public get dateRemoved(): DateGETData {
    return this.getCurrentEntity()?.getDateRemoved() || '';
  }

  public set dateRemoved(value: DateGETData) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.setDateRemoved(value);
    }
  }

  public createWrapper(teammemberData: HcclTeamMemberGETData): HcclTeamMemberCrudWrapper {
    return new HcclTeamMemberCrudWrapper(teammemberData, this.hcclService);
  }

  getTeamMemberFkMenuCriteria(): HcclTeamMemberCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected teammemberMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: HcclTeamMemberCrudWrapper): Promise<void> {
    const criteria = this.getTeamMemberFkMenuCriteria();
    const results = await this.hcclService.findHcclTeamMembers(criteria).toPromise();
    this.teammemberMenu = await entity.getFkMenu("teammembers", this.id);
  }

  public onSubmit(): void {
    if (this.form.valid) {
      this.isSubmitting = true;
      // Handle form submission
      this.isSubmitting = false;
    }
  }

  public onCancel(): void {
    // Handle cancel action
  }

  public onDelete(): void {
    // Handle delete action
  }
}

export class HcclTeamMemberCrudWrapper extends EntityWrapper<HcclTeamMemberGETData> {

  public static newInstanceForCreate(hcclService: HcclService, entityIn?: HcclTeamMemberGETData | null): HcclTeamMemberCrudWrapper {
    const emptyData: HcclTeamMemberGETData = {
      teamId: '',
      userId: '',
      userProfileId: '',
      dateAdded: super.newDateGETData(),
      dateRemoved: super.newDateGETData()
    };
    return new HcclTeamMemberCrudWrapper(entityIn || emptyData, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<HcclTeamMemberCrudWrapper> {
    const data = await hcclService.getHcclTeamMemberById(id).toPromise();
    if (!data) {
      throw new Error('TeamMember not found');
    }
    return new HcclTeamMemberCrudWrapper(data, hcclService);
  }

  constructor(data: HcclTeamMemberGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  getDisplayText(entity?: HcclTeamMemberGETData): string {
    const data = entity || this.getData();
    if (data.teamId && data.userId) {
      return `Team ${data.teamId} - User ${data.userId}`;
    }
    if (data.teamId) {
      return `Team ${data.teamId}`;
    }
    if (data.userId) {
      return `User ${data.userId}`;
    }
    return data.id || 'Unknown TeamMember';
  }

  getTeamId(): string {
    return this.getData().teamId || '';
  }

  getUserId(): string {
    return this.getData().userId || '';
  }

  getUserProfileId(): string {
    return this.getData().userProfileId || '';
  }

  getDateAdded(): DateGETData {
    return this.getData().dateAdded || EntityWrapper.newDateGETData();
  }

  setDateAdded(value: DateGETData): void {
    this.getData().dateAdded = value;
  }

  getDateRemoved(): DateGETData {
    return this.getData().dateRemoved || EntityWrapper.newDateGETData();
  }

  setDateRemoved(value: DateGETData): void {
    this.getData().dateRemoved = value;
  }

  getFkMenuCriteria(): HcclTeamMemberCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  async getTeamMembers(criteria?: HcclTeamMemberCriteria): Promise<HcclTeamMemberGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const results = await this.hcclService.findHcclTeamMembers(criteria || this.getFkMenuCriteria()).toPromise();
    return results?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const teammembers = await this.getTeamMembers();
    return this.getMenuControlDataList("teammembers", this.getEntityType() + " Menu", teammembers, data);
  }
} 