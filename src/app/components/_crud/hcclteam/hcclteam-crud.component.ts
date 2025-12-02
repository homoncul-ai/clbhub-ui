import { ReferenceDataComponent } from '@app/components/_global/reference-data/reference-data.component';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, Validators } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { HcclTeamCriteria, HcclTeamGETData, HcclTeamPOSTData, HcclTeamPUTData, HcclService, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { Observable, map } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';

import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';
import { TeamTypeRefCrudComponent } from '@app/components/_crud/teamtyperef/teamtyperef-crud.component';
import { HcclOrganizationCrudComponent } from '@app/components/_crud/hcclorganization/hcclorganization-crud.component';

@Component({
  selector: 'app-hcclteam-crud',
  templateUrl: './hcclteam-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule, 
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent,
    TeamTypeRefCrudComponent, HcclOrganizationCrudComponent, ReferenceDataComponent],
  standalone: true
})
export class HcclTeamCrudComponent extends AbstractCrudComponent<HcclTeamCrudWrapper> implements OnInit, OnChanges {

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
    if (businessCode.length > 255) {
      return 'Business Code must be less than 255 characters';
    }
    return null;
  }

  private validateDescription(description: string): string | null {
    if (description && description.length > 1024) {
      return 'Description must be less than 1024 characters';
    }
    return null;
  }

  private validateTeamTypeId(teamTypeId: string): string | null {
    if (!teamTypeId || teamTypeId.trim() === '') {
      return 'Team Type is required';
    }
    return null;
  }

  private validateTeamParentId(teamParentId: string): string | null {
    if (teamParentId && teamParentId.length > 255) {
      return 'Team Parent ID must be less than 255 characters';
    }
    return null;
  }

  private validateTeamParentEntityType(teamParentEntityType: string): string | null {
    if (teamParentEntityType && teamParentEntityType.length > 255) {
      return 'Team Parent Entity Type must be less than 255 characters';
    }
    return null;
  }

  private validateTeamParentName(teamParentName: string): string | null {
    if (teamParentName && teamParentName.length > 255) {
      return 'Team Parent Name must be less than 255 characters';
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

    const teamTypeIdError = this.validateTeamTypeId(this.teamTypeId);
    if (teamTypeIdError) {
      errors.teamTypeId = { errorMessage: teamTypeIdError };
    }

    const teamParentIdError = this.validateTeamParentId(this.teamParentId);
    if (teamParentIdError) {
      errors.teamParentId = { errorMessage: teamParentIdError };
    }

    const teamParentEntityTypeError = this.validateTeamParentEntityType(this.teamParentEntityType);
    if (teamParentEntityTypeError) {
      errors.teamParentEntityType = { errorMessage: teamParentEntityTypeError };
    }

    const teamParentNameError = this.validateTeamParentName(this.teamParentName);
    if (teamParentNameError) {
      errors.teamParentName = { errorMessage: teamParentNameError };
    }
    
    return errors;
  }

  private clearValidationErrors(): void {
    this.error = null;
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected async loadEntityByIdCall(id: string): Promise<HcclTeamCrudWrapper> {
    const hcclteam = await this.hcclService.getHcclTeamById(id).toPromise();
    if (!hcclteam) {
      throw new Error('HcclTeam not found');
    }
    return new HcclTeamCrudWrapper(hcclteam, this.hcclService);
  }

  protected override async createEntityDataCall(entity: HcclTeamCrudWrapper): Promise<any> {
    const postData: HcclTeamPOSTData = {
      name: entity.getData().name || '',
      businessCode: entity.getData().businessCode || '',
      description: entity.getData().description || '',
      teamTypeId: entity.getData().teamTypeId || '',
      organizationId: entity.getData().organizationId,
      teamParentId: entity.getData().teamParentId,
      teamParentEntityType: entity.getData().teamParentEntityType,
      teamParentName: entity.getData().teamParentName,
      available: entity.getData().available || 0
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    try {
      const response = await this.hcclService.createHcclTeam(postData);
      console.log('Create response:', response);
      this.clearValidationErrors(); // Clear errors on success
      return response;
    } catch (error) {
      console.error('Create error:', error);
      throw error;
    }
  }

  protected override async updateEntityDataCall(entity: HcclTeamCrudWrapper): Promise<void> {
    const putData: HcclTeamPUTData = {
      name: entity.getData().name || '',
      businessCode: entity.getData().businessCode || '',
      description: entity.getData().description || '',
      teamTypeId: entity.getData().teamTypeId || '',
      organizationId: entity.getData().organizationId,
      teamParentId: entity.getData().teamParentId,
      teamParentEntityType: entity.getData().teamParentEntityType,
      teamParentName: entity.getData().teamParentName,
      available: entity.getData().available || 0
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    await this.hcclService.updateHcclTeamById(entity.getData().id!, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteHcclTeamById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting HcclTeam:', error);
      return false;
    }
  }

  public override newEmptyWrapper(): HcclTeamCrudWrapper {
    return HcclTeamCrudWrapper.newInstanceForCreate(this.hcclService);
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

  public get teamTypeId(): string {
    return this.getCurrentEntity()?.getData()?.teamTypeId || '';
  }

  public set teamTypeId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().teamTypeId = value;
    }
  }

  public get organizationId(): string {
    return this.getCurrentEntity()?.getData()?.organizationId || '';
  }

  public set organizationId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().organizationId = value;
    }
  }

  public get teamParentId(): string {
    return this.getCurrentEntity()?.getData()?.teamParentId || '';
  }

  public set teamParentId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().teamParentId = value;
    }
  }

  public get teamParentEntityType(): string {
    return this.getCurrentEntity()?.getData()?.teamParentEntityType || '';
  }

  public set teamParentEntityType(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().teamParentEntityType = value;
    }
  }

  public get teamParentName(): string {
    return this.getCurrentEntity()?.getData()?.teamParentName || '';
  }

  public set teamParentName(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().teamParentName = value;
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

  public createWrapper(hcclteamData: HcclTeamGETData): HcclTeamCrudWrapper {
    return new HcclTeamCrudWrapper(hcclteamData, this.hcclService);
  }

  getHcclTeamFkMenuCriteria(): HcclTeamCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected hcclteamMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: HcclTeamCrudWrapper): Promise<void> {
    const criteria = this.getHcclTeamFkMenuCriteria();
    const results = await this.hcclService.findHcclTeams(criteria).toPromise();
    this.hcclteamMenu = await entity.getFkMenu("hcclteams", this.id);
  }
}

export class HcclTeamCrudWrapper extends EntityWrapper<HcclTeamGETData> {

  public static newInstanceForCreate(hcclService: HcclService, entityIn?: HcclTeamGETData | null): HcclTeamCrudWrapper {
    const emptyData: HcclTeamGETData = {
      name: '',
      businessCode: '',
      description: '',
      teamTypeId: '',
      available: 0
    };
    return new HcclTeamCrudWrapper(entityIn || emptyData, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<HcclTeamCrudWrapper> {
    const data = await hcclService.getHcclTeamById(id).toPromise();
    if (!data) {
      throw new Error('HcclTeam not found');
    }
    return new HcclTeamCrudWrapper(data, hcclService);
  }

  constructor(data: HcclTeamGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  getDisplayText(entity?: HcclTeamGETData): string {
    const data = entity || this.getData();
    if (data.name) {
      return data.name;
    }
    if (data.businessCode) {
      return data.businessCode;
    }
    return data.id || 'Unknown HcclTeam';
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

  getAvailable(): number {
    return this.getData().available || 0;
  }

  isActive(): boolean {
    return this.getData().available === 1;
  }

  getFkMenuCriteria(): HcclTeamCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  async getHcclTeams(criteria?: HcclTeamCriteria): Promise<HcclTeamGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const searchCriteria = criteria || this.getFkMenuCriteria();
    const results = await this.hcclService.findHcclTeams(searchCriteria).toPromise();
    return results?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    var criteria: HcclTeamCriteria = this.getFkMenuCriteria();
    
    // Merge the passed fkMenuCriteria (data) with default criteria
    if (data && typeof data === 'object') {
      criteria = { ...criteria, ...data };
    }
    
    const hcclteams = await this.getHcclTeams(criteria);
    var menuItems = hcclteams.map(team => {
      return {
        id: team.id,
        name: team.name
      } as MenuControlData;
    });
    return { menuItems: menuItems } as MenuControlDataList;
  }
} 