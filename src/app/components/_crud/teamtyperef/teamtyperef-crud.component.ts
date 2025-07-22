import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, Validators } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { TeamTypeRefCriteria, TeamTypeRefGETData, TeamTypeRefPOSTData, TeamTypeRefPUTData, HcclService, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { Observable, map } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';

@Component({
  selector: 'app-teamtyperef-crud',
  templateUrl: './teamtyperef-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule,
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent],
  standalone: true
})
export class TeamTypeRefCrudComponent extends AbstractCrudComponent<TeamTypeRefCrudWrapper> implements OnInit, OnChanges {

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
    
    return errors;
  }

  private clearValidationErrors(): void {
    this.error = null;
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected async loadEntityByIdCall(id: string): Promise<TeamTypeRefCrudWrapper> {
    const teamTypeRef = await this.hcclService.getTeamTypeRefById(id).toPromise();
    if (!teamTypeRef) {
      throw new Error('TeamTypeRef not found');
    }
    return new TeamTypeRefCrudWrapper(teamTypeRef, this.hcclService);
  }

  protected override async createEntityDataCall(entity: TeamTypeRefCrudWrapper): Promise<any> {
    const postData: TeamTypeRefPOSTData = {
      name: entity.getData().name || '',
      businessCode: entity.getData().businessCode || '',
      description: entity.getData().description || '',
      available: entity.getData().available || 1
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    try {
      const response = await this.hcclService.createTeamTypeRef(postData).toPromise();
      console.log('Create response:', response);
      this.clearValidationErrors(); // Clear errors on success
      return response;
    } catch (error) {
      console.error('Create error:', error);
      throw error;
    }
  }

  protected override async updateEntityDataCall(entity: TeamTypeRefCrudWrapper): Promise<void> {
    const putData: TeamTypeRefPUTData = {
      name: entity.getData().name || '',
      businessCode: entity.getData().businessCode || '',
      description: entity.getData().description || '',
      available: entity.getData().available || 1
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    await this.hcclService.updateTeamTypeRefById(entity.getData().id!, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteTeamTypeRefById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting TeamTypeRef:', error);
      return false;
    }
  }

  public override newEmptyWrapper(): TeamTypeRefCrudWrapper {
    return TeamTypeRefCrudWrapper.newInstanceForCreate(this.hcclService);
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
    return this.getCurrentEntity()?.getData()?.available || 1;
  }

  public set available(value: number) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().available = value;
    }
  }

  public createWrapper(teamTypeRefData: TeamTypeRefGETData): TeamTypeRefCrudWrapper {
    return new TeamTypeRefCrudWrapper(teamTypeRefData, this.hcclService);
  }

  getTeamTypeRefFkMenuCriteria(): TeamTypeRefCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected teamTypeRefMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: TeamTypeRefCrudWrapper): Promise<void> {
    const criteria = this.getTeamTypeRefFkMenuCriteria();
    const results = await this.hcclService.findTeamTypeRefs(criteria).toPromise();
    this.teamTypeRefMenu = await entity.getFkMenu("teamtyperefs", this.id);
  }
}

export class TeamTypeRefCrudWrapper extends EntityWrapper<TeamTypeRefGETData> {

  public static newInstanceForCreate(hcclService: HcclService, entityIn?: TeamTypeRefGETData | null): TeamTypeRefCrudWrapper {
    const emptyData: TeamTypeRefGETData = {
      name: '',
      businessCode: '',
      description: '',
      available: 1
    };
    return new TeamTypeRefCrudWrapper(entityIn || emptyData, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<TeamTypeRefCrudWrapper> {
    const data = await hcclService.getTeamTypeRefById(id).toPromise();
    if (!data) {
      throw new Error('TeamTypeRef not found');
    }
    return new TeamTypeRefCrudWrapper(data, hcclService);
  }

  constructor(data: TeamTypeRefGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  getDisplayText(entity?: TeamTypeRefGETData): string {
    const data = entity || this.getData();
    if (data.name) {
      return data.name;
    }
    if (data.businessCode) {
      return data.businessCode;
    }
    return data.id || 'Unknown TeamTypeRef';
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
    return this.getData().available || 1;
  }

  isActive(): boolean {
    return this.getData().available === 1;
  }

  getFkMenuCriteria(): TeamTypeRefCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  async getTeamTypeRefs(criteria?: TeamTypeRefCriteria): Promise<TeamTypeRefGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const results = await this.hcclService.findTeamTypeRefs(criteria || this.getFkMenuCriteria()).toPromise();
    return results?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const teamTypeRefs = await this.getTeamTypeRefs();
    return this.getMenuControlDataList("teamtyperefs", this.getEntityType() + " Menu", teamTypeRefs, data);
  }
} 