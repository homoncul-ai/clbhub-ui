import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, Validators } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { TeamMemberRoleRefCriteria, TeamMemberRoleRefGETData, TeamMemberRoleRefPOSTData, TeamMemberRoleRefPUTData, HcclService, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { Observable, map } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';

@Component({
  selector: 'app-teammemberroleref-crud',
  templateUrl: './teammemberroleref-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule, 
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent],
  standalone: true
})
export class TeamMemberRoleRefCrudComponent extends AbstractCrudComponent<TeamMemberRoleRefCrudWrapper> implements OnInit, OnChanges {
/**
 * This is a component that will be used to create, read, update and delete Team Member Role References
 * It will use the AbstractCrudComponent to handle the CRUD operations
 * It will use the TeamMemberRoleRefGETData and TeamMemberRoleRefPOSTData interfaces to handle the data
 * It will use the HcclService to handle the data
 * 
 * Input parameter:
 * - id?: string - Optional team member role ref ID to load a specific team member role ref for viewing/editing
 * 
 * If no ID is provided, the component will load the full list of team member role refs.
 * If an ID is provided, the component will load that specific team member role ref and show it in detail mode.
 * 
 * Create a wrapper class that extends EntityWrapper<TeamMemberRoleRefGETData>
 * and implement the abstract methods of the AbstractCrudComponent
 */

  
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

  protected async loadEntityByIdCall(id: string): Promise<TeamMemberRoleRefCrudWrapper> {
    const teamMemberRoleRef = await this.hcclService.getTeamMemberRoleRefById(id).toPromise();
    if (!teamMemberRoleRef) {
      throw new Error('TeamMemberRoleRef not found');
    }
    return new TeamMemberRoleRefCrudWrapper(teamMemberRoleRef, this.hcclService);
  }

  protected override async createEntityDataCall(entity: TeamMemberRoleRefCrudWrapper): Promise<any> {
    const postData: TeamMemberRoleRefPOSTData = {
      name: entity.getData().name || '',
      businessCode: entity.getData().businessCode || '',
      description: entity.getData().description || '',
      available: entity.getData().available || 1
    };

    this.clearValidationErrors();
    const validationErrors = this.validateForm();
    if (Object.keys(validationErrors).length > 0) {
      this.error = validationErrors;
      throw new Error('Validation failed');
    }

    try {
        // The requestCreate method now returns { id: string, status: 201 }
        const response = await this.hcclService.createTeamMemberRoleRef(postData).toPromise()
        console.log('Create response:', response);
        this.clearValidationErrors(); // Clear errors on success
        return response;
      } catch (error) {
        console.error('Create error:', error);
        throw error;
      }


    
  }




  protected override async updateEntityDataCall(entity: TeamMemberRoleRefCrudWrapper): Promise<void> {
    const putData: TeamMemberRoleRefPUTData = {
      name: entity.getData().name || '',
      businessCode: entity.getData().businessCode || '',
      description: entity.getData().description || '',
      available: entity.getData().available || 1
    };

    this.clearValidationErrors();
    const validationErrors = this.validateForm();
    if (Object.keys(validationErrors).length > 0) {
      this.error = validationErrors;
      throw new Error('Validation failed');
    }

    await this.hcclService.updateTeamMemberRoleRefById(entity.getId() || '', putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteTeamMemberRoleRefById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting TeamMemberRoleRef:', error);
      return false;
    }
  }

  public override newEmptyWrapper(): TeamMemberRoleRefCrudWrapper {
    return TeamMemberRoleRefCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  // Getters and setters for form binding
  public get name(): string {
    return this.getCurrentEntity()?.getData()?.name || '';
  }

  public set name(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity().getData().name = value;
    }
  }

  public get businessCode(): string {
    return this.getCurrentEntity()?.getData()?.businessCode || '';
  }

  public set businessCode(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity().getData().businessCode = value;
    }
  }

  public get description(): string {
    return this.getCurrentEntity()?.getData()?.description || '';
  }

  public set description(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity().getData().description = value;
    }
  }

  public get available(): number {
    return this.getCurrentEntity()?.getData()?.available || 1;
  }

  public set available(value: number) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity().getData().available = value;
    }
  }

  public createWrapper(teamMemberRoleRefData: TeamMemberRoleRefGETData): TeamMemberRoleRefCrudWrapper {
    return new TeamMemberRoleRefCrudWrapper(teamMemberRoleRefData, this.hcclService);
  }

  getTeamMemberRoleRefFkMenuCriteria(): TeamMemberRoleRefCriteria {
    return {
      pageNumber: 1,
      pageSize: 100,
      isPaging: true
    };
  }

  // Menu implementation
  protected teamMemberRoleRefMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: TeamMemberRoleRefCrudWrapper): Promise<void> {
    //const criteria = this.getTeamMemberRoleRefFkMenuCriteria();
    //this.teamMemberRoleRefMenu = await entity.getFkMenu(teamMemberRoleRef, this.id);
    return Promise.resolve();
  }
}

export class TeamMemberRoleRefCrudWrapper extends EntityWrapper<TeamMemberRoleRefGETData> {
  public static newInstanceForCreate(hcclService: HcclService, entityIn?: TeamMemberRoleRefGETData | null): TeamMemberRoleRefCrudWrapper {
    const emptyData: TeamMemberRoleRefGETData = {
      name: '',
      businessCode: '',
      description: '',
      available: 1
    };
    return new TeamMemberRoleRefCrudWrapper(entityIn || emptyData, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<TeamMemberRoleRefCrudWrapper> {
    const data = await hcclService.getTeamMemberRoleRefById(id).toPromise();
    if (!data) {
      throw new Error('TeamMemberRoleRef not found');
    }
    return new TeamMemberRoleRefCrudWrapper(data, hcclService);
  }

  constructor(data: TeamMemberRoleRefGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  getDisplayText(entity?: TeamMemberRoleRefGETData): string {
    const data = entity || this.getData();
    if (!data) return '';
    
    const name = data.name || '';
    const businessCode = data.businessCode || '';
    
    if (name && businessCode) {
      return `${name} (${businessCode})`;
    } else if (name) {
      return name;
    } else if (businessCode) {
      return businessCode;
    } else {
      return 'Unnamed Team Member Role Ref';
    }
  }

  getFullName(): string {
    return this.getData()?.name || '';
  }

  getBusinessCode(): string {
    return this.getData()?.businessCode || '';
  }

  getDescription(): string {
    return this.getData()?.description || '';
  }

  getAvailable(): number {
    return this.getData()?.available || 1;
  }

  isActive(): boolean {
    return this.getData()?.available === 1;
  }

  getFkMenuCriteria(): TeamMemberRoleRefCriteria {
    return {
      pageNumber: 1,
      pageSize: 100,
      isPaging: true
    };
  }

  async getTeamMemberRoleRefs(criteria?: TeamMemberRoleRefCriteria): Promise<TeamMemberRoleRefGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const response = await this.hcclService.findTeamMemberRoleRefs(criteria || this.getFkMenuCriteria()).toPromise();
    return response?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const teamMemberRoleRefs = await this.getTeamMemberRoleRefs();
    return this.getMenuControlDataList("teamMemberRoleRefs", getEntityType() + " Menu", teamMemberRoleRefs, data);
  }
}

function getEntityType(): string {
  return 'TeamMemberRoleRef';
} 