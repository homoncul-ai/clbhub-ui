// This template is for generating a CRUD component for an entity that has a FK Menu
// This was generated using entityName = ProviderRequest
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
import { ProviderRequestCriteria, ProviderRequestGETData, ProviderRequestPOSTData, ProviderRequestPUTData, HcclService, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
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
import { ProviderRequestTypeRefCrudComponent } from '@app/components/_crud/providerrequesttyperef/providerrequesttyperef-crud.component';

@Component({
  selector: 'app-providerrequest-crud',
  templateUrl: './providerrequest-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule,
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent, ReferenceDataComponent, ProviderRequestTypeRefCrudComponent],
  standalone: true
})
export class ProviderRequestCrudComponent extends AbstractCrudComponent<ProviderRequestCrudWrapper> implements OnInit, OnChanges {

  constructor() {
    super();
  }

  // Error property for form validation
  public error: any = null;
 
  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected async loadEntityByIdCall(id: string): Promise<ProviderRequestCrudWrapper> {
    const providerRequest = await this.hcclService.getProviderRequestById(id).toPromise();
    if (!providerRequest) {
      throw new Error('ProviderRequest not found');
    }
    return new ProviderRequestCrudWrapper(providerRequest, this.hcclService);
  }

  protected override async createEntityDataCall(entity: ProviderRequestCrudWrapper): Promise<any> {
    const postData: ProviderRequestPOSTData = {
      name: entity.getData().name || '',
      businessCode: entity.getData().businessCode || '',
      description: entity.getData().description || '',
      currentStateTransitionId: entity.getData().currentStateTransitionId,
      currentStateCode: entity.getData().currentStateCode || '',
      currentStateDateEntered: new Date().toISOString(), // Default to current date/time
      rawRequestText: entity.getData().rawRequestText || '',
      requesterUserId: entity.getData().requesterUserId || '',
      advocateUserId: entity.getData().advocateUserId || '',
      vocationEncodingId: entity.getData().vocationEncodingId,
      requestTypeId: entity.getData().requestTypeId || ''
    };

    // This is important - the requestCreate method returns { id: string, status: 201 }
    try {
      // The requestCreate method returns { id: string, status: 201 }
      const response = await this.hcclService.createProviderRequest(postData);
      console.log('Create response:', response);
      return response;
    } catch (error) {
      console.error('Create error:', error);
      throw error;
    }

  }

  protected override async updateEntityDataCall(entity: ProviderRequestCrudWrapper): Promise<void> {
    const putData: ProviderRequestPUTData = {
      name: entity.getData().name || '',
      businessCode: entity.getData().businessCode || '',
      description: entity.getData().description || '',
      currentStateTransitionId: entity.getData().currentStateTransitionId,
      currentStateCode: entity.getData().currentStateCode || '',
      currentStateDateEntered: new Date().toISOString(), // Default to current date/time
      rawRequestText: entity.getData().rawRequestText || '',
      requesterUserId: entity.getData().requesterUserId || '',
      advocateUserId: entity.getData().advocateUserId || '',
      vocationEncodingId: entity.getData().vocationEncodingId,
      requestTypeId: entity.getData().requestTypeId || ''
    };

    
    await this.hcclService.updateProviderRequestById(entity.getData().id!, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteProviderRequestById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting ProviderRequest:', error);
      return false;
    }
  }

  public override newEmptyWrapper(): ProviderRequestCrudWrapper {
    return ProviderRequestCrudWrapper.newInstanceForCreate(this.hcclService);
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

  public get currentStateCode(): string {
    return this.getCurrentEntity()?.getData()?.currentStateCode || '';
  }

  public set currentStateCode(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().currentStateCode = value;
    }
  }

  public get rawRequestText(): string {
    return this.getCurrentEntity()?.getData()?.rawRequestText || '';
  }

  public set rawRequestText(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().rawRequestText = value;
    }
  }

  public get requesterUserId(): string {
    return this.getCurrentEntity()?.getData()?.requesterUserId || '';
  }

  public set requesterUserId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().requesterUserId = value;
    }
  }

  public get advocateUserId(): string {
    return this.getCurrentEntity()?.getData()?.advocateUserId || '';
  }

  public set advocateUserId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().advocateUserId = value;
    }
  }

  public get vocationEncodingId(): string {
    return this.getCurrentEntity()?.getData()?.vocationEncodingId || '';
  }

  public set vocationEncodingId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().vocationEncodingId = value;
    }
  }

  public get requestTypeId(): string {
    return this.getCurrentEntity()?.getData()?.requestTypeId || '';
  }

  public set requestTypeId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().requestTypeId = value;
    }
  }

  public createWrapper(providerRequestData: ProviderRequestGETData): ProviderRequestCrudWrapper {
    return new ProviderRequestCrudWrapper(providerRequestData, this.hcclService);
  }

  getProviderRequestFkMenuCriteria(): ProviderRequestCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected providerRequestMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: ProviderRequestCrudWrapper): Promise<void> {
    const criteria = this.getProviderRequestFkMenuCriteria();
    const results = await this.hcclService.findProviderRequests(criteria).toPromise();
    this.providerRequestMenu = await entity.getFkMenu("providerrequests", this.id);
  }
}

export class ProviderRequestCrudWrapper extends EntityWrapper<ProviderRequestGETData> {

  public static newInstanceForCreate(hcclService: HcclService, entityIn?: ProviderRequestGETData | null): ProviderRequestCrudWrapper {
    const emptyData: ProviderRequestGETData = {
      name: '',
      businessCode: '',
      description: '',
      currentStateCode: '',
      rawRequestText: '',
      requesterUserId: '',
      advocateUserId: '',
      requestTypeId: ''
    };
    return new ProviderRequestCrudWrapper(entityIn || emptyData, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<ProviderRequestCrudWrapper> {
    const data = await hcclService.getProviderRequestById(id).toPromise();
    if (!data) {
      throw new Error('ProviderRequest not found');
    }
    return new ProviderRequestCrudWrapper(data, hcclService);
  }

  constructor(data: ProviderRequestGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  getDisplayText(entity?: ProviderRequestGETData): string {
    const data = entity || this.getData();
    if (data.name) {
      return data.name;
    }
    if (data.businessCode) {
      return data.businessCode;
    }
    return data.id || 'Unknown ProviderRequest';
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

  getCurrentStateCode(): string {
    return this.getData().currentStateCode || '';
  }

  getRawRequestText(): string {
    return this.getData().rawRequestText || '';
  }

  getRequesterUserId(): string {
    return this.getData().requesterUserId || '';
  }

  getAdvocateUserId(): string {
    return this.getData().advocateUserId || '';
  }

  getvocationEncodingId(): string {
    return this.getData().vocationEncodingId || '';
  }

  getRequestTypeId(): string {
    return this.getData().requestTypeId || '';
  }

  getFkMenuCriteria(): ProviderRequestCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  async getProviderRequests(criteria?: ProviderRequestCriteria): Promise<ProviderRequestGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const results = await this.hcclService.findProviderRequests(criteria || this.getFkMenuCriteria()).toPromise();
    return results?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const providerRequests = await this.getProviderRequests();
    return this.getMenuControlDataList("providerrequests", this.getEntityType() + " Menu", providerRequests, data);
  }
} 