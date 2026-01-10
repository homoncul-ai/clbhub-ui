import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, Validators } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { CatalogEntrySignupPacketCriteria, CatalogEntrySignupPacketGETData, CatalogEntrySignupPacketPOSTData, CatalogEntrySignupPacketPUTData, HcclService, MenuControlDataList, MenuControlData, ManageSignupPacketUIData } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { Observable, map } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';
import { ReferenceDataComponent } from '@app/components/_global/reference-data/reference-data.component';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';
import { StdMarkdownDisplayComponent } from '@app/components/_global/std-markdown-display/std-markdown-display.component';

// Import FK Crud components for display
import { HcclOrganizationCrudComponent } from '@app/components/_crud/hcclorganization/hcclorganization-crud.component';
import { CatalogCrudComponent } from '@app/components/_crud/catalog/catalog-crud.component';
import { CatalogEntryCrudComponent } from '@app/components/_crud/catalogentry/catalogentry-crud.component';

@Component({
  selector: 'app-catalogentrysignuppacket-crud',
  templateUrl: './catalogentrysignuppacket-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule,
    StdMdbFormTextComponent, StdMdbFormTextareaComponent, StdMarkdownDisplayComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent, ReferenceDataComponent,
    HcclOrganizationCrudComponent, CatalogCrudComponent, CatalogEntryCrudComponent],
  standalone: true
})
export class CatalogEntrySignupPacketCrudComponent extends AbstractCrudComponent<CatalogEntrySignupPacketCrudWrapper> implements OnInit, OnChanges {

  constructor() {
    super();
  }

  // Error property for form validation
  public error: any = null;

  // Output event for when entity is created successfully (useful for modal contexts)
  @Output() entityCreated = new EventEmitter<any>();

  // ViewChild references for markdown editors
  @ViewChild('createInstructionsMd') createInstructionsMdComponent?: StdMarkdownDisplayComponent;
  @ViewChild('editInstructionsMd') editInstructionsMdComponent?: StdMarkdownDisplayComponent;

  // Signup behavior select data loaded from ManageSignupPacketUIData
  public signupBehaviorSelectData: MenuControlDataList | null = null;

  override ngOnInit(): void {
    super.ngOnInit();
    this.entityType = 'CatalogEntrySignupPacket';
    this.loadSignupPacketUIData();
  }

  private async loadSignupPacketUIData(): Promise<void> {
    try {
      const uiData = await this.hcclService.getSignupPacketsSetupData().toPromise();
      if (uiData) {
        this.signupBehaviorSelectData = uiData.signupBehaviorSelectData || null;
      }
    } catch (error) {
      console.error('Error loading signup packet UI data:', error);
    }
  }

  protected async loadEntityByIdCall(id: string): Promise<CatalogEntrySignupPacketCrudWrapper> {
    const entity = await CatalogEntrySignupPacketCrudWrapper.newInstance(id, this.hcclService);
    return entity;
  }

  protected override async createEntityDataCall(entity: CatalogEntrySignupPacketCrudWrapper): Promise<any> {
    const entityData = this.getMode() === CRUD_MODES.CREATE && this.entityNew ? this.entityNew.getData() : entity.getData();

    // Get markdown content from the editor component
    const instructionsMdContent = this.createInstructionsMdComponent?.getContent() || entityData.instructionsMd || '';

    var organizationId = super.getCurrentOrganizationId();
    const postData: CatalogEntrySignupPacketPOSTData = {
      organizationId: organizationId || '',
      name: entityData.name || '',
      signupBehaviorCode: entityData.signupBehaviorCode || '',
      description: entityData.description || '',
      available: entityData.available || 0,
      instructionsMd: instructionsMdContent
    };

    try {
      const response = await this.hcclService.createCatalogEntrySignupPacket(postData).toPromise();
      console.log('Create response:', response);
      return response;
    } catch (error) {
      console.error('Create error:', error);
      throw error;
    }
  }

  protected override async updateEntityDataCall(entity: CatalogEntrySignupPacketCrudWrapper): Promise<void> {
    const entityData = entity.getData();
    if (!entityData.id) {
      throw new Error('CatalogEntrySignupPacket ID is required for update');
    }

    // Get markdown content from the editor component
    const instructionsMdContent = this.editInstructionsMdComponent?.getContent() || entityData.instructionsMd || '';

    const putData: CatalogEntrySignupPacketPUTData = {
      organizationId: entityData.organizationId || '',
      catalogId: entityData.catalogId,
      catalogEntryId: entityData.catalogEntryId,
      fileGroupId: entityData.fileGroupId,
      name: entityData.name || '',
      signupBehaviorCode: entityData.signupBehaviorCode || '',
      description: entityData.description || '',
      available: entityData.available || 0,
      instructionsMd: instructionsMdContent
    };

    await this.hcclService.updateCatalogEntrySignupPacketById(entityData.id, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteCatalogEntrySignupPacketById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting CatalogEntrySignupPacket:', error);
      return false;
    }
  }

  public override newEmptyWrapper(): CatalogEntrySignupPacketCrudWrapper {
    const emptyData: CatalogEntrySignupPacketGETData = {
      organizationId: '',
      name: '',
      signupBehaviorCode: '',
      description: '',
      available: 1,
      instructionsMd: ''
    };
    return new CatalogEntrySignupPacketCrudWrapper(emptyData, this.hcclService);
  }

  // Getter and setter methods for form binding
  public get name(): string {
    return this.getCurrentEntity()?.getData()?.name || '';
  }

  public set name(value: string) {
    var data = super.getEntityForSet();
    data.getData().name = value;
  }

  public get signupBehaviorCode(): string {
    return this.getCurrentEntity()?.getData()?.signupBehaviorCode || '';
  }

  public set signupBehaviorCode(value: string) {
    var data = super.getEntityForSet();
    data.getData().signupBehaviorCode = value;
  }

  public get description(): string {
    return this.getCurrentEntity()?.getData()?.description || '';
  }

  public set description(value: string) {
    var data = super.getEntityForSet();
    data.getData().description = value;
  }

  public get available(): number {
    return this.getCurrentEntity()?.getData()?.available || 0;
  }

  public set available(value: number) {
    var data = super.getEntityForSet();
    data.getData().available = value;
  }

  public get instructionsMd(): string {
    return this.getCurrentEntity()?.getData()?.instructionsMd || '';
  }

  public set instructionsMd(value: string) {
    var data = super.getEntityForSet();
    data.getData().instructionsMd = value;
  }

  public get signupInstructionsMD(): string {
    return this.getCurrentEntity()?.getData()?.signupInstructionsMD || '';
  }

  public get organizationId(): string {
    return this.getCurrentEntity()?.getData()?.organizationId || '';
  }

  public set organizationId(value: string) {
    var data = super.getEntityForSet();
    data.getData().organizationId = value;
  }

  public get catalogId(): string {
    return this.getCurrentEntity()?.getData()?.catalogId || '';
  }

  public set catalogId(value: string) {
    var data = super.getEntityForSet();
    data.getData().catalogId = value;
  }

  public get catalogEntryId(): string {
    return this.getCurrentEntity()?.getData()?.catalogEntryId || '';
  }

  public set catalogEntryId(value: string) {
    var data = super.getEntityForSet();
    data.getData().catalogEntryId = value;
  }

  public get fileGroupId(): string {
    return this.getCurrentEntity()?.getData()?.fileGroupId || '';
  }

  public set fileGroupId(value: string) {
    var data = super.getEntityForSet();
    data.getData().fileGroupId = value;
  }

  public createWrapper(data: CatalogEntrySignupPacketGETData): CatalogEntrySignupPacketCrudWrapper {
    return new CatalogEntrySignupPacketCrudWrapper(data, this.hcclService);
  }

  getCatalogEntrySignupPacketFkMenuCriteria(): CatalogEntrySignupPacketCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected catalogEntrySignupPacketMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: CatalogEntrySignupPacketCrudWrapper): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Override onAfterCreate to emit the entityCreated event
   * This is useful for modal contexts where we need to close after creation
   */
  protected override onAfterCreate(): void {
    super.onAfterCreate();
    this.entityCreated.emit({ id: this.id });
  }
}

export class CatalogEntrySignupPacketCrudWrapper extends EntityWrapper<CatalogEntrySignupPacketGETData> {

  public static newInstanceForCreate(hcclService: HcclService, entityIn?: CatalogEntrySignupPacketGETData | null): CatalogEntrySignupPacketCrudWrapper {
    const emptyData: CatalogEntrySignupPacketGETData = {
      organizationId: '',
      name: '',
      signupBehaviorCode: '',
      description: '',
      available: 1,
      instructionsMd: ''
    };
    return new CatalogEntrySignupPacketCrudWrapper(entityIn || emptyData, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<CatalogEntrySignupPacketCrudWrapper> {
    const data = await hcclService.getCatalogEntrySignupPacketById(id).toPromise();
    if (!data) {
      throw new Error('CatalogEntrySignupPacket not found');
    }
    return new CatalogEntrySignupPacketCrudWrapper(data, hcclService);
  }

  constructor(data: CatalogEntrySignupPacketGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  getDisplayText(entity?: CatalogEntrySignupPacketGETData): string {
    const data = entity || this.getData();
    if (data.name) {
      return data.name;
    }
    if (data.signupBehaviorCode) {
      return data.signupBehaviorCode;
    }
    return data.id || 'Unknown CatalogEntrySignupPacket';
  }

  getFullName(): string {
    return this.getData().name || '';
  }

  getSignupBehaviorCode(): string {
    return this.getData().signupBehaviorCode || '';
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

  getFkMenuCriteria(): CatalogEntrySignupPacketCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  async getCatalogEntrySignupPackets(criteria?: CatalogEntrySignupPacketCriteria): Promise<CatalogEntrySignupPacketGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const results = await this.hcclService.findCatalogEntrySignupPackets(criteria || this.getFkMenuCriteria()).toPromise();
    return results?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const entities = await this.getCatalogEntrySignupPackets();
    return this.getMenuControlDataList("catalogentrysignuppackets", this.getEntityType() + " Menu", entities, data);
  }
}

