import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, Validators } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { VocationEncodingRefCriteria, VocationEncodingRefGETData, VocationEncodingRefPOSTData, VocationEncodingRefPUTData, HcclService, MenuControlDataList, MenuControlData, PMFileGroupGETData } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { Observable, map } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';
import { PmfilegroupUiComponent } from '@app/components/_crud/pmfilegroup-ui/pmfilegroup-ui.component';

@Component({
  selector: 'app-vocationencodingref-crud',
  templateUrl: './vocationencodingref-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule,
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent, PmfilegroupUiComponent],
  standalone: true
})
export class VocationEncodingRefCrudComponent extends AbstractCrudComponent<VocationEncodingRefCrudWrapper> implements OnInit, OnChanges {

  constructor() {
    super();
  }

  // Error property for form validation
  public error: any = null;

  // PMFileGroup for this VocationEncodingRef
  protected fileGroup: PMFileGroupGETData | null = null;

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

    return Object.keys(errors).length > 0 ? errors : null;
  }

  // Clear validation errors
  private clearValidationErrors(): void {
    this.error = null;
  }

  /** Standard boiler plate for ngOnInit */
  override ngOnInit(): void {
    super.ngOnInit();
    this.entityType = 'VocationEncodingRef';
  }

  protected async loadEntityByIdCall(id: string): Promise<VocationEncodingRefCrudWrapper> {
    const vocationEncodingRef = await this.hcclService.getVocationEncodingRefById(id).toPromise();
    if (vocationEncodingRef) {
      // Load the associated FileGroup for this ref
      await this.loadFileGroupForRef(id);
      return new VocationEncodingRefCrudWrapper(vocationEncodingRef, this.hcclService);
    }
    throw new Error('Vocation Encoding Ref not found');
  }

  private async loadFileGroupForRef(refId: string): Promise<void> {
    try {
      const result = await this.hcclService.findPMFileGroups({
        parentEntityId: refId,
        parentEntityType: 'VocationEncodingRef',
        optionalDataHint: 'all'
      }).toPromise();

      if (result?.searchResults && result.searchResults.length > 0) {
        this.fileGroup = result.searchResults[0];
      } else {
        this.fileGroup = null;
      }
    } catch (error) {
      console.warn(`Failed to load FileGroup for VocationEncodingRef ${refId}:`, error);
      this.fileGroup = null;
    }
  }

  protected override async createEntityDataCall(entity: VocationEncodingRefCrudWrapper): Promise<any> {
    // Validate form before creating
    this.error = this.validateForm();
    if (this.error) {
      throw new Error('Validation failed');
    }

    // Use entityNew if in create mode, otherwise use the passed entity
    const vocationEncodingRefData = this.getMode() === CRUD_MODES.CREATE && this.entityNew ? this.entityNew.getData() : entity.getData();

    const postData: VocationEncodingRefPOSTData = {
      name: vocationEncodingRefData.name || '',
      businessCode: vocationEncodingRefData.businessCode || '',
      description: vocationEncodingRefData.description || '',
      available: vocationEncodingRefData.available || 1,
      primaryCode: vocationEncodingRefData.primaryCode,
      secondaryCode: vocationEncodingRefData.secondaryCode
    };

    try {
      const response = await this.hcclService.createVocationEncodingRef(postData).toPromise();
      console.log('Create response:', response);
      this.clearValidationErrors();
      return response;
    } catch (error) {
      console.error('Create error:', error);
      throw error;
    }
  }

  protected override async updateEntityDataCall(entity: VocationEncodingRefCrudWrapper): Promise<void> {
    // Validate form before updating
    this.error = this.validateForm();
    if (this.error) {
      throw new Error('Validation failed');
    }

    const vocationEncodingRefData = entity.getData();
    if (!vocationEncodingRefData.id) {
      throw new Error('Vocation Encoding Ref ID is required for update');
    }

    const putData: VocationEncodingRefPUTData = {
      name: vocationEncodingRefData.name || '',
      businessCode: vocationEncodingRefData.businessCode || '',
      description: vocationEncodingRefData.description || '',
      available: vocationEncodingRefData.available || 1,
      primaryCode: vocationEncodingRefData.primaryCode,
      secondaryCode: vocationEncodingRefData.secondaryCode
    };

    try {
      await this.hcclService.updateVocationEncodingRefById(vocationEncodingRefData.id, putData).toPromise();
      this.clearValidationErrors();
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteVocationEncodingRefById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting Vocation Encoding Ref:', error);
      throw error;
    }
  }

  public override newEmptyWrapper(): VocationEncodingRefCrudWrapper {
    const emptyVocationEncodingRef: VocationEncodingRefGETData = {
      name: '',
      businessCode: '',
      description: '',
      available: 1,
      primaryCode: undefined,
      secondaryCode: undefined
    };
    return new VocationEncodingRefCrudWrapper(emptyVocationEncodingRef, this.hcclService);
  }

  // Getter and setter methods for form binding
  public get name(): string {
    const x = this.getCurrentEntity().getData().name || '';
    return x;
  }

  public set name(value: string) {
    var data = super.getEntityForSet();
    data.getData().name = value;
  }

  public get businessCode(): string {
    return this.getCurrentEntity().getData().businessCode || '';
  }

  public set businessCode(value: string) {
    var data = super.getEntityForSet();
    data.getData().businessCode = value;
  }

  public get description(): string {
    return this.getCurrentEntity().getData().description || '';
  }

  public set description(value: string) {
    var data = super.getEntityForSet();
    data.getData().description = value;
  }

  public get available(): number {
    return this.getCurrentEntity().getData().available || 1;
  }

  public set available(value: number) {
    var data = super.getEntityForSet();
    data.getData().available = value;
  }

  public get primaryCode(): number | undefined {
    return this.getCurrentEntity().getData().primaryCode;
  }

  public set primaryCode(value: number | undefined) {
    var data = super.getEntityForSet();
    data.getData().primaryCode = value;
  }

  public get secondaryCode(): number | undefined {
    return this.getCurrentEntity().getData().secondaryCode;
  }

  public set secondaryCode(value: number | undefined) {
    var data = super.getEntityForSet();
    data.getData().secondaryCode = value;
  }

  /**
   * Create a wrapper from VocationEncodingRefGETData
   * @param vocationEncodingRefData The VocationEncodingRefGETData to wrap
   * @returns VocationEncodingRefCrudWrapper instance
   */
  public createWrapper(vocationEncodingRefData: VocationEncodingRefGETData): VocationEncodingRefCrudWrapper {
    return new VocationEncodingRefCrudWrapper(vocationEncodingRefData, this.hcclService);
  }

  getVocationEncodingRefFkMenuCriteria(): VocationEncodingRefCriteria {
    return {
      available: 1
    };
  }

  /** Define the menu objects for this crud component */
  protected vocationEncodingRefMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: VocationEncodingRefCrudWrapper): Promise<void> {
    return Promise.resolve();
  }
}

export class VocationEncodingRefCrudWrapper extends EntityWrapper<VocationEncodingRefGETData> {

  public static newInstanceForCreate(hcclService: HcclService, entityIn?: VocationEncodingRefGETData | null): VocationEncodingRefCrudWrapper {
    const entity = entityIn || {
      id: '0',
      name: '',
      businessCode: '',
      description: '',
      available: 1,
      primaryCode: undefined,
      secondaryCode: undefined
    } as VocationEncodingRefGETData;
    return new VocationEncodingRefCrudWrapper(entity, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<VocationEncodingRefCrudWrapper> {
    const vocationEncodingRef = await hcclService.getVocationEncodingRefById(id).toPromise();
    if (vocationEncodingRef) {
      return new VocationEncodingRefCrudWrapper(vocationEncodingRef, hcclService);
    }
    throw new Error('Vocation Encoding Ref not found');
  }

  constructor(data: VocationEncodingRefGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  getDisplayText(entity?: VocationEncodingRefGETData): string {
    const data = entity || this.data;
    const name = data.name || '';
    const businessCode = data.businessCode || '';
    if (name && businessCode) {
      return `${name} (${businessCode})`;
    } else if (name) {
      return name;
    } else if (businessCode) {
      return businessCode;
    } else {
      return 'Unnamed Vocation Encoding Ref';
    }
  }

  getFullName(): string {
    return this.getDisplayText();
  }

  getBusinessCode(): string {
    return this.data.businessCode || '';
  }

  getDescription(): string {
    return this.data.description || '';
  }

  getPrimaryCode(): number | undefined {
    return this.data.primaryCode;
  }

  getSecondaryCode(): number | undefined {
    return this.data.secondaryCode;
  }

  getAvailable(): number {
    return this.data.available || 1;
  }

  isActive(): boolean {
    return this.data.available === 1;
  }

  getFkMenuCriteria(): VocationEncodingRefCriteria {
    return {
      available: 1
    };
  }

  async getVocationEncodingRefs(criteria?: VocationEncodingRefCriteria): Promise<VocationEncodingRefGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const searchCriteria = criteria || this.getFkMenuCriteria();
    const response = await this.hcclService.findVocationEncodingRefs(searchCriteria).toPromise();
    return response?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    console.log('getFkMenu', menuHint, data);
    var criteria = this.getFkMenuCriteria();
    var vocationEncodingRefs = await this.getVocationEncodingRefs(criteria);
    var menuItems = vocationEncodingRefs.map(vocationEncodingRef => {
      return {
        id: vocationEncodingRef.id,
        name: vocationEncodingRef.name
      } as MenuControlData;
    });
    return { menuItems: menuItems } as MenuControlDataList;
  }
}

