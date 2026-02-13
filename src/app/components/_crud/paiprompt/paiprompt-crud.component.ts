import { Component, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import {
  PAiPromptRefCriteria,
  PAiPromptRefGETData,
  PAiPromptRefPOSTData,
  PAiPromptRefPUTData,
  HcclService,
  MenuControlDataList
} from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';
import { ReferenceDataComponent } from '@app/components/_global/reference-data/reference-data.component';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';

@Component({
  selector: 'app-paiprompt-crud',
  templateUrl: './paiprompt-crud.component.html',
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
    AvailableSelectorComponent,
    DategetdataDisplayComponent,
    ReferenceDataComponent
  ],
  standalone: true
})
export class PAIPromptCrudComponent extends AbstractCrudComponent<PAIPromptCrudWrapper> implements OnInit, OnChanges {
  public error: any = null;

  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected async loadEntityByIdCall(id: string): Promise<PAIPromptCrudWrapper> {
    const paiPrompt = await PAIPromptCrudWrapper.newInstance(id, this.hcclService);
    return paiPrompt;
  }

  protected override async createEntityDataCall(entity: PAIPromptCrudWrapper): Promise<any> {
    const postData: PAiPromptRefPOSTData = {
      businessCode: entity.getData().businessCode || '',
      pojoClassName: entity.getData().pojoClassName || '',
      name: entity.getData().name || '',
      description: entity.getData().description || '',
      promptText: entity.getData().promptText || '',
      available: entity.getData().available ?? 1
    };

    try {
      const response = await this.hcclService.createPAiPromptRef(postData);
      console.log('Create response:', response);
      return response;
    } catch (createError) {
      console.error('Create error:', createError);
      throw createError;
    }
  }

  protected override async updateEntityDataCall(entity: PAIPromptCrudWrapper): Promise<void> {
    const putData: PAiPromptRefPUTData = {
      businessCode: entity.getData().businessCode || '',
      pojoClassName: entity.getData().pojoClassName || '',
      name: entity.getData().name || '',
      description: entity.getData().description || '',
      promptText: entity.getData().promptText || '',
      available: entity.getData().available ?? 1
    };

    await this.hcclService.updatePAiPromptRefById(entity.getData().id!, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deletePAiPromptRefById(id).toPromise();
      return true;
    } catch (deleteError) {
      console.error('Error deleting PAiPromptRef:', deleteError);
      return false;
    }
  }

  public override newEmptyWrapper(): PAIPromptCrudWrapper {
    return PAIPromptCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  public get businessCode(): string {
    return this.getCurrentEntity()?.getData()?.businessCode || '';
  }

  public set businessCode(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().businessCode = value;
    }
  }

  public get pojoClassName(): string {
    return this.getCurrentEntity()?.getData()?.pojoClassName || '';
  }

  public set pojoClassName(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().pojoClassName = value;
    }
  }

  public get name(): string {
    return this.getCurrentEntity()?.getData()?.name || '';
  }

  public set name(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().name = value;
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

  public get promptText(): string {
    return this.getCurrentEntity()?.getData()?.promptText || '';
  }

  public set promptText(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().promptText = value;
    }
  }

  public get available(): number {
    return this.getCurrentEntity()?.getData()?.available ?? 1;
  }

  public set available(value: number) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().available = value;
    }
  }

  public override get dateCreated(): any {
    return this.getCurrentEntity()?.getData()?.dateCreated;
  }

  public override get dateLastUpdated(): any {
    return this.getCurrentEntity()?.getData()?.dateLastUpdated;
  }

  public override get createdByInfo(): any {
    return this.getCurrentEntity()?.getData()?.createdByInfo;
  }

  public override get lastUpdatedByInfo(): any {
    return this.getCurrentEntity()?.getData()?.lastUpdatedByInfo;
  }

  public createWrapper(paiPromptData: PAiPromptRefGETData): PAIPromptCrudWrapper {
    return new PAIPromptCrudWrapper(paiPromptData, this.hcclService);
  }

  getPAIPromptFkMenuCriteria(): PAiPromptRefCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected paipromptMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: PAIPromptCrudWrapper): Promise<void> {
    // const criteria = this.getPAIPromptFkMenuCriteria();
    // const results = await this.hcclService.findPAiPromptRefs(criteria).toPromise();
    // this.paipromptMenu = await entity.getFkMenu('paipromptrefs', this.id);
    // Note: PAiPromptRef currently has no FK menu components.
  }
}

export class PAIPromptCrudWrapper extends EntityWrapper<PAiPromptRefGETData> {
  public static newInstanceForCreate(hcclService: HcclService, entityIn?: PAiPromptRefGETData | null): PAIPromptCrudWrapper {
    const emptyData: PAiPromptRefGETData = {
      businessCode: '',
      pojoClassName: '',
      name: '',
      description: '',
      promptText: '',
      available: 1
    };
    return new PAIPromptCrudWrapper(entityIn || emptyData, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<PAIPromptCrudWrapper> {
    const data = await hcclService.getPAiPromptRefById(id).toPromise();
    if (!data) {
      throw new Error('PAiPromptRef not found');
    }
    return new PAIPromptCrudWrapper(data, hcclService);
  }

  constructor(data: PAiPromptRefGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  getDisplayText(entity?: PAiPromptRefGETData): string {
    const data = entity || this.getData();
    if (data.name) {
      return data.name;
    }
    if (data.businessCode) {
      return data.businessCode;
    }
    return data.id || 'Unknown PAiPromptRef';
  }

  getFkMenuCriteria(): PAiPromptRefCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  async getPAiPromptRefs(criteria?: PAiPromptRefCriteria): Promise<PAiPromptRefGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const results = await this.hcclService.findPAiPromptRefs(criteria || this.getFkMenuCriteria()).toPromise();
    return results?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const paiPromptRefs = await this.getPAiPromptRefs();
    return this.getMenuControlDataList('paipromptrefs', this.getEntityType() + ' Menu', paiPromptRefs, data);
  }
}
