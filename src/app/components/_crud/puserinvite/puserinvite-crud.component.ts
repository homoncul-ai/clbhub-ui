import { Component, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import {
  HcclUserInviteCriteria,
  HcclUserInviteGETData,
  HcclUserInvitePOSTData,
  HcclUserInvitePUTData,
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
  selector: 'app-puserinvite-crud',
  templateUrl: './puserinvite-crud.component.html',
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
export class PUserInviteCrudComponent extends AbstractCrudComponent<PUserInviteCrudWrapper> implements OnInit, OnChanges {
  public error: any = null;

  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected async loadEntityByIdCall(id: string): Promise<PUserInviteCrudWrapper> {
    return PUserInviteCrudWrapper.newInstance(id, this.hcclService);
  }

  protected override async createEntityDataCall(entity: PUserInviteCrudWrapper): Promise<any> {
    const postData: HcclUserInvitePOSTData = {
      emailAddress: entity.getData().emailAddress || '',
      organizationId: entity.getData().organizationId || '',
      teamId: entity.getData().teamId || '',
      inviteCode: entity.getData().inviteCode || '',
      notes: entity.getData().notes || '',
      available: entity.getData().available ?? 1,
      currentStateCode: entity.getData().currentStateCode || 'NEW'
    };
    return this.hcclService.createHcclUserInvite(postData);
  }

  protected override async updateEntityDataCall(entity: PUserInviteCrudWrapper): Promise<void> {
    const putData: HcclUserInvitePUTData = {
      emailAddress: entity.getData().emailAddress || '',
      organizationId: entity.getData().organizationId || '',
      teamId: entity.getData().teamId || '',
      inviteCode: entity.getData().inviteCode || '',
      notes: entity.getData().notes || '',
      available: entity.getData().available ?? 1,
      currentStateCode: entity.getData().currentStateCode || 'NEW'
    };
    await this.hcclService.updateHcclUserInviteById(entity.getData().id!, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteHcclUserInviteById(id).toPromise();
      return true;
    } catch (deleteError) {
      console.error('Error deleting HcclUserInvite:', deleteError);
      return false;
    }
  }

  public override newEmptyWrapper(): PUserInviteCrudWrapper {
    return PUserInviteCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  public get emailAddress(): string {
    return this.getCurrentEntity()?.getData()?.emailAddress || '';
  }
  public set emailAddress(value: string) {
    if (this.getCurrentEntity()) this.getCurrentEntity()!.getData().emailAddress = value;
  }

  public get organizationId(): string {
    return this.getCurrentEntity()?.getData()?.organizationId || '';
  }
  public set organizationId(value: string) {
    if (this.getCurrentEntity()) this.getCurrentEntity()!.getData().organizationId = value;
  }

  public get teamId(): string {
    return this.getCurrentEntity()?.getData()?.teamId || '';
  }
  public set teamId(value: string) {
    if (this.getCurrentEntity()) this.getCurrentEntity()!.getData().teamId = value;
  }

  public get inviteCode(): string {
    return this.getCurrentEntity()?.getData()?.inviteCode || '';
  }
  public set inviteCode(value: string) {
    if (this.getCurrentEntity()) this.getCurrentEntity()!.getData().inviteCode = value;
  }

  public get currentStateCode(): string {
    return this.getCurrentEntity()?.getData()?.currentStateCode || '';
  }
  public set currentStateCode(value: string) {
    if (this.getCurrentEntity()) this.getCurrentEntity()!.getData().currentStateCode = value;
  }

  public get notes(): string {
    return this.getCurrentEntity()?.getData()?.notes || '';
  }
  public set notes(value: string) {
    if (this.getCurrentEntity()) this.getCurrentEntity()!.getData().notes = value;
  }

  public get available(): number {
    return this.getCurrentEntity()?.getData()?.available ?? 1;
  }
  public set available(value: number) {
    if (this.getCurrentEntity()) this.getCurrentEntity()!.getData().available = value;
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

  public createWrapper(data: HcclUserInviteGETData): PUserInviteCrudWrapper {
    return new PUserInviteCrudWrapper(data, this.hcclService);
  }

  getPUserInviteFkMenuCriteria(): HcclUserInviteCriteria {
    return { pageNumber: 1, pageSize: 50, isPaging: true };
  }

  protected puserinviteMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: PUserInviteCrudWrapper): Promise<void> {
    // No FK menus are required for this entity yet.
    void entity;
  }
}

export class PUserInviteCrudWrapper extends EntityWrapper<HcclUserInviteGETData> {
  public static newInstanceForCreate(hcclService: HcclService, entityIn?: HcclUserInviteGETData | null): PUserInviteCrudWrapper {
    const emptyData: HcclUserInviteGETData = {
      emailAddress: '',
      organizationId: '',
      teamId: '',
      inviteCode: '',
      notes: '',
      available: 1,
      currentStateCode: 'NEW'
    };
    return new PUserInviteCrudWrapper(entityIn || emptyData, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<PUserInviteCrudWrapper> {
    const data = await hcclService.getHcclUserInviteById(id).toPromise();
    if (!data) throw new Error('HcclUserInvite not found');
    return new PUserInviteCrudWrapper(data, hcclService);
  }

  constructor(data: HcclUserInviteGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  getDisplayText(entity?: HcclUserInviteGETData): string {
    const data = entity || this.getData();
    if (data.emailAddress) return data.emailAddress;
    if (data.inviteCode) return data.inviteCode;
    return data.id || 'Unknown HcclUserInvite';
  }

  getFkMenuCriteria(): HcclUserInviteCriteria {
    return { pageNumber: 1, pageSize: 50, isPaging: true };
  }

  async getPUserInvites(criteria?: HcclUserInviteCriteria): Promise<HcclUserInviteGETData[]> {
    if (!this.hcclService) throw new Error('HcclService not available');
    const results = await this.hcclService.findHcclUserInvites(criteria || this.getFkMenuCriteria()).toPromise();
    return results?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const invites = await this.getPUserInvites();
    return this.getMenuControlDataList('puserinvites', this.getEntityType() + ' Menu', invites, data);
  }
}
