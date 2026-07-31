import { Component, OnInit, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import {
  PSurveyRefCriteria,
  PSurveyRefGETData,
  PSurveyRefPUTData,
  HcclService,
  MenuControlDataList,
} from '@app/restsvc/hccl.service';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';
import {
  ADMIN_SURVEYS_BASE,
  getPublicSurveyRoute,
} from '@app/features/surveys/survey-registry';
import { MenuService } from '@app/shell/services/menu.service';

@Component({
  selector: 'app-psurveyref-crud',
  templateUrl: './psurveyref-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    MdbFormsModule,
    TranslateModule,
    RouterLink,
    StdMdbFormTextComponent,
    StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent,
    MenuControlDataListComponent,
    AvailableSelectorComponent,
    DategetdataDisplayComponent,
  ],
  standalone: true,
})
export class PSurveyRefCrudComponent
  extends AbstractCrudComponent<PSurveyRefCrudWrapper>
  implements OnInit, OnChanges
{
  public error: any = null;
  private readonly menuService = inject(MenuService);

  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.canCreate = false;
    this.canDelete = false;
    this.canEdit = true;
  }

  private validateName(name: string): string | null {
    if (!name || name.trim() === '') {
      return 'Title is required';
    }
    if (name.length > 255) {
      return 'Title must be less than 255 characters';
    }
    return null;
  }

  private validateDescription(description: string): string | null {
    if (description && description.length > 2048) {
      return 'Description must be less than 2048 characters';
    }
    return null;
  }

  private validateForm(): any {
    const errors: any = {};
    const nameError = this.validateName(this.name);
    if (nameError) {
      errors.name = { errorMessage: nameError };
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

  protected async loadEntityByIdCall(id: string): Promise<PSurveyRefCrudWrapper> {
    const row = await this.hcclService.getPSurveyRefById(id).toPromise();
    if (!row) {
      throw new Error('PSurveyRef not found');
    }
    return new PSurveyRefCrudWrapper(row, this.hcclService);
  }

  protected override async createEntityDataCall(_entity: PSurveyRefCrudWrapper): Promise<any> {
    throw new Error('Creating survey refs from the UI is not supported');
  }

  protected override async updateEntityDataCall(entity: PSurveyRefCrudWrapper): Promise<void> {
    const putData: PSurveyRefPUTData = {
      name: entity.getData().name || '',
      surveyCode: entity.getData().surveyCode || '',
      description: entity.getData().description || '',
      available: entity.getData().available === 0 ? 0 : (entity.getData().available ?? 1),
    };

    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.error = errors;
      throw new Error('Validation failed');
    }

    await this.hcclService.updatePSurveyRefById(entity.getData().id!, putData).toPromise();
    this.clearValidationErrors();
    // Sidebar recent-survey labels come from PSurveyRef — refresh after title edits.
    this.menuService.requestMenuRefresh();
  }

  protected async deleteEntityData(_id: string): Promise<boolean> {
    return false;
  }

  public override newEmptyWrapper(): PSurveyRefCrudWrapper {
    return PSurveyRefCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  public get name(): string {
    return this.getCurrentEntity()?.getData()?.name || '';
  }
  public set name(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().name = value;
    }
  }

  public get surveyCode(): string {
    return this.getCurrentEntity()?.getData()?.surveyCode || '';
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
    return this.getCurrentEntity()?.getData()?.available ?? 1;
  }
  public set available(value: number) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().available = value;
    }
  }

  public get publicRoute(): string {
    return getPublicSurveyRoute(this.surveyCode);
  }

  public get resultsRoute(): string {
    return this.surveyCode ? `${ADMIN_SURVEYS_BASE}/${this.surveyCode}` : '';
  }

  protected pSurveyRefMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: PSurveyRefCrudWrapper): Promise<void> {
    this.pSurveyRefMenu = await entity.getFkMenu('psurveyrefs', this.id);
  }
}

export class PSurveyRefCrudWrapper extends EntityWrapper<PSurveyRefGETData> {
  public static newInstanceForCreate(
    hcclService: HcclService,
    entityIn?: PSurveyRefGETData | null,
  ): PSurveyRefCrudWrapper {
    const emptyData: PSurveyRefGETData = {
      name: '',
      surveyCode: '',
      description: '',
      available: 1,
    };
    return new PSurveyRefCrudWrapper(entityIn || emptyData, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<PSurveyRefCrudWrapper> {
    const data = await hcclService.getPSurveyRefById(id).toPromise();
    if (!data) {
      throw new Error('PSurveyRef not found');
    }
    return new PSurveyRefCrudWrapper(data, hcclService);
  }

  constructor(data: PSurveyRefGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  getDisplayText(entity?: PSurveyRefGETData): string {
    const data = entity || this.getData();
    return data.name || data.surveyCode || data.id || 'Unknown Survey';
  }

  getFkMenuCriteria(): PSurveyRefCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true,
    };
  }

  async getPSurveyRefs(criteria?: PSurveyRefCriteria): Promise<PSurveyRefGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const results = await this.hcclService.findPSurveyRefs(criteria || this.getFkMenuCriteria()).toPromise();
    return results?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const rows = await this.getPSurveyRefs();
    return this.getMenuControlDataList(menuHint || 'psurveyrefs', 'Survey Menu', rows, data);
  }
}
