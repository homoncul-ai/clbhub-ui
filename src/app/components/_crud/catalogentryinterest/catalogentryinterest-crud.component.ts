// This template is for generating a CRUD component for an entity that has a FK Menu
// This was generated using entityName = CatalogEntryInterest
// Generate the new catalogentryinterest-crud.component.ts   files using this template
// Of course, the code related to the attribtutes of the entity shoule be changed to match the entityName
// Review the HTML after the generation is complete and maker sure all the imports required are included.


import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, Validators } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { CatalogEntryInterestCriteria, CatalogEntryInterestGETData, CatalogEntryInterestPOSTData, CatalogEntryInterestPUTData, HcclService, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { Observable, map } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';
import { ReferenceDataComponent } from '@app/components/_global/reference-data/reference-data.component';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';

// Import are all the FK Menus for the UI to use <app-entityNameFk-crud>
import { CatalogCrudComponent } from '@app/components/_crud/catalog/catalog-crud.component';
import { CatalogEntryCrudComponent } from '@app/components/_crud/catalogentry/catalogentry-crud.component';
import { PersonalStatementCrudComponent } from '@app/components/_crud/personalstatement/personalstatement-crud.component';
import { HcclUserProfileCrudComponent } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';

@Component({
  selector: 'app-catalogentryinterest-crud',
  templateUrl: './catalogentryinterest-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [
    CommonModule, 
    FormsModule, 
    MdbFormsModule, 
    TranslateModule,
    StdMdbFormTextComponent,
    StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, 
    MenuControlDataListComponent,
    DategetdataDisplayComponent, 
    ReferenceDataComponent, 
    CatalogCrudComponent, 
    CatalogEntryCrudComponent, 
    PersonalStatementCrudComponent, 
    HcclUserProfileCrudComponent
    
  ],
  standalone: true
})
export class CatalogEntryInterestCrudComponent extends AbstractCrudComponent<CatalogEntryInterestCrudWrapper> implements OnInit, OnChanges {

  constructor() {
    super();
  }

  // Error property for form validation
  public error: any = null;

  

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected async loadEntityByIdCall(id: string): Promise<CatalogEntryInterestCrudWrapper> {
    const catalogentryinterest = await this.hcclService.getCatalogEntryInterestById(id).toPromise();
    if (!catalogentryinterest) {
      throw new Error('CatalogEntryInterest not found');
    }
    return new CatalogEntryInterestCrudWrapper(catalogentryinterest, this.hcclService);
  }

  protected override async createEntityDataCall(entity: CatalogEntryInterestCrudWrapper): Promise<any> {
    const postData: CatalogEntryInterestPOSTData = {
      catalogId: entity.getData().catalogId || '',
      catalogEntryId: entity.getData().catalogEntryId || '',
      personalStatementId: entity.getData().personalStatementId || '',
      userProfileId: entity.getData().userProfileId || '',
      interest: entity.getData().interest || 0,
      notes: entity.getData().notes || '',
      currentStateCode: entity.getData().currentStateCode || ''
    };
 
    // This is important - the requestCreate method returns { id: string, status: 201 }
    try {
      // The requestCreate method returns { id: string, status: 201 }
      const response = await this.hcclService.createCatalogEntryInterest(postData);
      console.log('Create response:', response);
      return response;
    } catch (error) {
      console.error('Create error:', error);
      throw error;
    }

  }

  protected override async updateEntityDataCall(entity: CatalogEntryInterestCrudWrapper): Promise<void> {
    const putData: CatalogEntryInterestPUTData = {
      catalogId: entity.getData().catalogId || '',
      catalogEntryId: entity.getData().catalogEntryId || '',
      personalStatementId: entity.getData().personalStatementId || '',
      userProfileId: entity.getData().userProfileId || '',
      interest: entity.getData().interest || 0,
      notes: entity.getData().notes || '',
      currentStateCode: entity.getData().currentStateCode || ''
    };

    await this.hcclService.updateCatalogEntryInterestById(entity.getData().id!, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteCatalogEntryInterestById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting CatalogEntryInterest:', error);
      return false;
    }
  }

  public override newEmptyWrapper(): CatalogEntryInterestCrudWrapper {
    return CatalogEntryInterestCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  // Getter and setter methods for form binding
  public get catalogId(): string {
    return this.getCurrentEntity()?.getData()?.catalogId || '';
  }

  public set catalogId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().catalogId = value;
    }
  }

  public get catalogEntryId(): string {
    return this.getCurrentEntity()?.getData()?.catalogEntryId || '';
  }

  public set catalogEntryId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().catalogEntryId = value;
    }
  }

  public get personalStatementId(): string {
    return this.getCurrentEntity()?.getData()?.personalStatementId || '';
  }

  public set personalStatementId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().personalStatementId = value;
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

  public get interest(): number {
    return this.getCurrentEntity()?.getData()?.interest || 0;
  }

  public set interest(value: number) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().interest = value;
    }
  }

  public get notes(): string {
    return this.getCurrentEntity()?.getData()?.notes || '';
  }

  public set notes(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().notes = value;
    }
  }

  public createWrapper(catalogentryinterestData: CatalogEntryInterestGETData): CatalogEntryInterestCrudWrapper {
    return new CatalogEntryInterestCrudWrapper(catalogentryinterestData, this.hcclService);
  }

  getCatalogEntryInterestFkMenuCriteria(): CatalogEntryInterestCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected catalogentryinterestMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: CatalogEntryInterestCrudWrapper): Promise<void> {
    const criteria = this.getCatalogEntryInterestFkMenuCriteria();
    const results = await this.hcclService.findCatalogEntryInterests(criteria).toPromise();
    this.catalogentryinterestMenu = await entity.getFkMenu("catalogentryinterests", this.id);
  }
}

export class CatalogEntryInterestCrudWrapper extends EntityWrapper<CatalogEntryInterestGETData> {

  public static newInstanceForCreate(hcclService: HcclService, entityIn?: CatalogEntryInterestGETData | null): CatalogEntryInterestCrudWrapper {
    const emptyData: CatalogEntryInterestGETData = {
      catalogId: '',
      catalogEntryId: '',
      personalStatementId: '',
      userProfileId: '',
      interest: 0,
      notes: ''
    };
    return new CatalogEntryInterestCrudWrapper(entityIn || emptyData, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<CatalogEntryInterestCrudWrapper> {
    const data = await hcclService.getCatalogEntryInterestById(id).toPromise();
    if (!data) {
      throw new Error('CatalogEntryInterest not found');
    }
    return new CatalogEntryInterestCrudWrapper(data, hcclService);
  }

  constructor(data: CatalogEntryInterestGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  getDisplayText(entity?: CatalogEntryInterestGETData): string {
    const data = entity || this.getData();
    if (data.notes) {
      return data.notes;
    }
    if (data.interest !== undefined) {
      return `Interest Level: ${data.interest}`;
    }
    return data.id || 'Unknown CatalogEntryInterest';
  }

  getInterest(): number {
    return this.getData().interest || 0;
  }

  getNotes(): string {
    return this.getData().notes || '';
  }

  getCatalogId(): string {
    return this.getData().catalogId || '';
  }

  getCatalogEntryId(): string {
    return this.getData().catalogEntryId || '';
  }

  getPersonalStatementId(): string {
    return this.getData().personalStatementId || '';
  }

  getUserProfileId(): string {
    return this.getData().userProfileId || '';
  }

  getFkMenuCriteria(): CatalogEntryInterestCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  async getCatalogEntryInterests(criteria?: CatalogEntryInterestCriteria): Promise<CatalogEntryInterestGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const results = await this.hcclService.findCatalogEntryInterests(criteria || this.getFkMenuCriteria()).toPromise();
    return results?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const catalogentryinterests = await this.getCatalogEntryInterests();
    return this.getMenuControlDataList("catalogentryinterests", this.getEntityType() + " Menu", catalogentryinterests, data);
  }
}
