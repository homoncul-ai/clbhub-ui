import { Component, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import {
  HcclOrganizationInterestCriteria,
  HcclOrganizationInterestGETData,
  HcclOrganizationInterestPOSTData,
  HcclOrganizationInterestPUTData,
  HcclService,
  MenuControlDataList,
} from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';
import { ReferenceDataComponent } from '@app/components/_global/reference-data/reference-data.component';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';
import { HcclOrganizationCrudComponent } from '@app/components/_crud/hcclorganization/hcclorganization-crud.component';
import { HcclUserProfileCrudComponent } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';

@Component({
  selector: 'app-hcclorganizationinterest-crud',
  templateUrl: './hcclorganizationinterest-crud.component.html',
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
    HcclOrganizationCrudComponent,
    HcclUserProfileCrudComponent,
  ],
  standalone: true,
})
export class HcclOrganizationInterestCrudComponent
  extends AbstractCrudComponent<HcclOrganizationInterestCrudWrapper>
  implements OnInit, OnChanges
{
  public error: any = null;

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected async loadEntityByIdCall(id: string): Promise<HcclOrganizationInterestCrudWrapper> {
    const entity = await this.hcclService.getHcclOrganizationInterestById(id).toPromise();
    if (!entity) {
      throw new Error('HcclOrganizationInterest not found');
    }
    return new HcclOrganizationInterestCrudWrapper(entity, this.hcclService);
  }

  protected override async createEntityDataCall(entity: HcclOrganizationInterestCrudWrapper): Promise<any> {
    const postData: HcclOrganizationInterestPOSTData = {
      organizationId: entity.getData().organizationId || '',
      userProfileId: entity.getData().userProfileId || '',
      interest: entity.getData().interest || 0,
      notes: entity.getData().notes || '',
      messageId: entity.getData().messageId || '',
      currentStateCode: entity.getData().currentStateCode || '',
      currentStateTransitionId: entity.getData().currentStateTransitionId || '',
    };

    return this.hcclService.createHcclOrganizationInterest(postData).toPromise();
  }

  protected override async updateEntityDataCall(entity: HcclOrganizationInterestCrudWrapper): Promise<void> {
    const putData: HcclOrganizationInterestPUTData = {
      organizationId: entity.getData().organizationId || '',
      userProfileId: entity.getData().userProfileId || '',
      interest: entity.getData().interest || 0,
      notes: entity.getData().notes || '',
      messageId: entity.getData().messageId || '',
      currentStateCode: entity.getData().currentStateCode || '',
      currentStateTransitionId: entity.getData().currentStateTransitionId || '',
    };

    await this.hcclService.updateHcclOrganizationInterestById(entity.getData().id!, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteHcclOrganizationInterestById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting HcclOrganizationInterest:', error);
      return false;
    }
  }

  public override newEmptyWrapper(): HcclOrganizationInterestCrudWrapper {
    return HcclOrganizationInterestCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  public get organizationId(): string {
    return this.getCurrentEntity()?.getData()?.organizationId || '';
  }
  public set organizationId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().organizationId = value;
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

  public get messageId(): string {
    return this.getCurrentEntity()?.getData()?.messageId || '';
  }
  public set messageId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().messageId = value;
    }
  }

  public createWrapper(data: HcclOrganizationInterestGETData): HcclOrganizationInterestCrudWrapper {
    return new HcclOrganizationInterestCrudWrapper(data, this.hcclService);
  }

  getHcclOrganizationInterestFkMenuCriteria(): HcclOrganizationInterestCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true,
    };
  }

  protected hcclorganizationinterestMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: HcclOrganizationInterestCrudWrapper): Promise<void> {
    this.hcclorganizationinterestMenu = await entity.getFkMenu('hcclorganizationinterests', this.id);
  }
}

export class HcclOrganizationInterestCrudWrapper extends EntityWrapper<HcclOrganizationInterestGETData> {
  public static newInstanceForCreate(
    hcclService: HcclService,
    entityIn?: HcclOrganizationInterestGETData | null
  ): HcclOrganizationInterestCrudWrapper {
    const emptyData: HcclOrganizationInterestGETData = {
      organizationId: '',
      userProfileId: '',
      interest: 0,
      notes: '',
      messageId: '',
      currentStateCode: '',
      currentStateTransitionId: '',
    };
    return new HcclOrganizationInterestCrudWrapper(entityIn || emptyData, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<HcclOrganizationInterestCrudWrapper> {
    const data = await hcclService.getHcclOrganizationInterestById(id).toPromise();
    if (!data) {
      throw new Error('HcclOrganizationInterest not found');
    }
    return new HcclOrganizationInterestCrudWrapper(data, hcclService);
  }

  constructor(data: HcclOrganizationInterestGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  getDisplayText(entity?: HcclOrganizationInterestGETData): string {
    const data = entity || this.getData();
    const org = data.organization;
    if (org?.name || org?.businessCode) {
      return `${org.name || ''} ${org.businessCode ? `(${org.businessCode})` : ''}`.trim();
    }
    if (data.notes) {
      return data.notes;
    }
    if (data.interest !== undefined) {
      return `Interest Level: ${data.interest}`;
    }
    return data.id || 'Unknown HcclOrganizationInterest';
  }

  getFkMenuCriteria(): HcclOrganizationInterestCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true,
    };
  }

  async getHcclOrganizationInterests(
    criteria?: HcclOrganizationInterestCriteria
  ): Promise<HcclOrganizationInterestGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const results = await this.hcclService.findHcclOrganizationInterests(criteria || this.getFkMenuCriteria()).toPromise();
    return results?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const items = await this.getHcclOrganizationInterests();
    return this.getMenuControlDataList('hcclorganizationinterests', this.getEntityType() + ' Menu', items, data);
  }
}
