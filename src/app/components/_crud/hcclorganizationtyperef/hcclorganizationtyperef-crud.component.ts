import { Component, OnInit, Input, OnChanges, SimpleChanges, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, Validators } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { HcclOrganizationTypeRefCriteria, HcclOrganizationTypeRefGETData, HcclOrganizationTypeRefPOSTData, HcclOrganizationTypeRefPUTData, HcclService, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { Observable, map } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';

@Component({
  selector: 'app-hcclorganizationtyperef-crud',
  templateUrl: './hcclorganizationtyperef-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule,
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent],
  standalone: true
})
export class HcclOrganizationTypeRefCrudComponent extends AbstractCrudComponent<HcclOrganizationTypeRefCrudWrapper> implements OnInit, OnChanges {

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

  protected async loadEntityByIdCall(id: string): Promise<HcclOrganizationTypeRefCrudWrapper> {
    const hcclorganizationtyperef = await this.hcclService.getHcclOrganizationTypeRefById(id).toPromise();
    if (!hcclorganizationtyperef) {
      throw new Error('HcclOrganizationTypeRef not found');
    }
    return new HcclOrganizationTypeRefCrudWrapper(hcclorganizationtyperef, this.hcclService);
  }

  protected override async createEntityDataCall(entity: HcclOrganizationTypeRefCrudWrapper): Promise<any> {
    const postData: HcclOrganizationTypeRefPOSTData = {
      name: entity.getData().name || '',
      businessCode: entity.getData().businessCode || '',
      description: entity.getData().description || '',
      available: entity.getData().available || 0
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    return this.hcclService.createHcclOrganizationTypeRef(postData).toPromise();
  }

  protected override async updateEntityDataCall(entity: HcclOrganizationTypeRefCrudWrapper): Promise<void> {
    const putData: HcclOrganizationTypeRefPUTData = {
      name: entity.getData().name || '',
      businessCode: entity.getData().businessCode || '',
      description: entity.getData().description || '',
      available: entity.getData().available || 0
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    await this.hcclService.updateHcclOrganizationTypeRefById(entity.getData().id!, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteHcclOrganizationTypeRefById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting HcclOrganizationTypeRef:', error);
      return false;
    }
  }

  public override newEmptyWrapper(): HcclOrganizationTypeRefCrudWrapper {
    return HcclOrganizationTypeRefCrudWrapper.newInstanceForCreate(this.hcclService);
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
    return this.getCurrentEntity()?.getData()?.available || 0;
  }

  public set available(value: number) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().available = value;
    }
  }

  public createWrapper(hcclorganizationtyperefData: HcclOrganizationTypeRefGETData): HcclOrganizationTypeRefCrudWrapper {
    return new HcclOrganizationTypeRefCrudWrapper(hcclorganizationtyperefData, this.hcclService);
  }

  getHcclOrganizationTypeRefFkMenuCriteria(): HcclOrganizationTypeRefCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected hcclorganizationtyperefMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: HcclOrganizationTypeRefCrudWrapper): Promise<void> {
    const criteria = this.getHcclOrganizationTypeRefFkMenuCriteria();
    this.hcclorganizationtyperefMenu = await entity.getFkMenu("hcclorganizationtyperefs", this.id);
  }
}

export class HcclOrganizationTypeRefCrudWrapper extends EntityWrapper<HcclOrganizationTypeRefGETData> {

  public static newInstanceForCreate(hcclService: HcclService, entityIn?: HcclOrganizationTypeRefGETData | null): HcclOrganizationTypeRefCrudWrapper {
    const emptyData: HcclOrganizationTypeRefGETData = {
      name: '',
      businessCode: '',
      description: '',
      available: 0
    };
    return new HcclOrganizationTypeRefCrudWrapper(entityIn || emptyData, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<HcclOrganizationTypeRefCrudWrapper> {
    const data = await hcclService.getHcclOrganizationTypeRefById(id).toPromise();
    if (!data) {
      throw new Error('HcclOrganizationTypeRef not found');
    }
    return new HcclOrganizationTypeRefCrudWrapper(data, hcclService);
  }

  public static async newInstanceByCode(code: string, hcclService: HcclService): Promise<HcclOrganizationTypeRefCrudWrapper> {
    const criteria: HcclOrganizationTypeRefCriteria = {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true,
      businessCode: code
    };
    const data = await hcclService.findHcclOrganizationTypeRefs(criteria).toPromise();
    if (!data?.searchResults || data.searchResults.length === 0) {
      throw new Error('HcclOrganizationTypeRef not found');
    }
    console.log('HcclOrganizationTypeRefCrudWrapper.newInstanceByCode: ' + JSON.stringify(data.searchResults[0]));
    return new HcclOrganizationTypeRefCrudWrapper(data.searchResults[0], hcclService);
  }

  constructor(data: HcclOrganizationTypeRefGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  getDisplayText(entity?: HcclOrganizationTypeRefGETData): string {
    const data = entity || this.getData();
    if (data.name) {
      return data.name;
    }
    if (data.businessCode) {
      return data.businessCode;
    }
    return data.id || 'Unknown HcclOrganizationTypeRef';
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

  getFkMenuCriteria(): HcclOrganizationTypeRefCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  async getHcclOrganizationTypeRefs(criteria?: HcclOrganizationTypeRefCriteria): Promise<HcclOrganizationTypeRefGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const results = await this.hcclService.findHcclOrganizationTypeRefs(criteria || this.getFkMenuCriteria()).toPromise();
    return results?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const hcclorganizationtyperefs = await this.getHcclOrganizationTypeRefs();
    return this.getMenuControlDataList("hcclorganizationtyperefs", "HCCL Organization Type Refs", hcclorganizationtyperefs, data);
  }
} 