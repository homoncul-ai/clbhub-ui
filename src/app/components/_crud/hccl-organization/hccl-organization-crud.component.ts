import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { HcclOrganizationGETData, HcclOrganizationPOSTData, HcclOrganizationPUTData, HcclService, HcclOrganizationCriteria, MenuControlDataList } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';

@Component({
  selector: 'app-hccl-organization-crud',
  imports: [CommonModule, FormsModule, SimpleMessagesSectionComponent],
  templateUrl: './hccl-organization-crud.component.html',
  styleUrl: './hccl-organization-crud.component.scss'
})
export class HcclOrganizationCrudComponent extends AbstractCrudComponent<HcclOrganizationCrudWrapper> implements OnInit, OnChanges {
  constructor() { super();
    this.entityType = HcclOrganizationCrudWrapper.ENTITY_TYPE;
   }

  override ngOnInit(): void { super.ngOnInit(); }

  protected async loadEntityByIdCall(id: string): Promise<HcclOrganizationCrudWrapper> {
    const org = await this.hcclService.getHcclOrganizationById(id).toPromise();
    if (org) return new HcclOrganizationCrudWrapper(org, this.hcclService);
    throw new Error('Organization not found');
  }

  protected override async createEntityDataCall(entity: HcclOrganizationCrudWrapper): Promise<any> {
    const data = this.getMode() === CRUD_MODES.CREATE && this.entityNew ? this.entityNew.getData() : entity.getData();
    const postData: HcclOrganizationPOSTData = {
      name: data.name || '',
      businessCode: data.businessCode || '',
      description: data.description || '',
      available: data.available || 1,
      jsonData: data.jsonData,
      websiteUrl: data.websiteUrl,
      organizationTypeId: data.organizationTypeId || '',
      parentEntityId: data.parentEntityId,
      parentEntityEntityType: data.parentEntityEntityType,
      parentEntityName: data.parentEntityName,
      organizationTypeCode: data.organizationTypeId || ''
    };
    return this.hcclService.createHcclOrganization(postData);
  }



  protected override async updateEntityDataCall(entity: HcclOrganizationCrudWrapper): Promise<void> {
    const data = entity.getData();
    if (!data.id) throw new Error('Organization ID is required for update');
    const putData: HcclOrganizationPUTData = {
      name: data.name || '',
      businessCode: data.businessCode || '',
      description: data.description || '',
      available: data.available || 1,
      jsonData: data.jsonData,
      websiteUrl: data.websiteUrl,
      organizationTypeId: data.organizationTypeId || '',
      parentEntityId: data.parentEntityId,
      parentEntityEntityType: data.parentEntityEntityType,
      parentEntityName: data.parentEntityName
    };
    await this.hcclService.updateHcclOrganizationById(data.id, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    await this.hcclService.deleteHcclOrganizationById(id).toPromise();
    return true;
  }

  public override newEmptyWrapper(): HcclOrganizationCrudWrapper {
    return this.createWrapper(HcclOrganizationCrudWrapper.newEmpty());
  }

  public createWrapper(data: HcclOrganizationGETData): HcclOrganizationCrudWrapper {
    return new HcclOrganizationCrudWrapper(data, this.hcclService);
  }

  protected organizationTypeMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: HcclOrganizationCrudWrapper): Promise<void> {
    this.organizationTypeMenu = null;
    return Promise.resolve();
  }

  public get name(): string { return this.getCurrentEntity().getData().name || ''; }
  public set name(value: string) { this.getEntityForSet().getData().name = value; }

  public get businessCode(): string { return this.getCurrentEntity().getData().businessCode || ''; }
  public set businessCode(value: string) { this.getEntityForSet().getData().businessCode = value; }

  public get description(): string { return this.getCurrentEntity().getData().description || ''; }
  public set description(value: string) { this.getEntityForSet().getData().description = value; }

  public get websiteUrl(): string { return this.getCurrentEntity().getData().websiteUrl || ''; }
  public set websiteUrl(value: string) { this.getEntityForSet().getData().websiteUrl = value; }

  public get organizationTypeId(): string { return this.getCurrentEntity().getData().organizationTypeId || ''; }
  public set organizationTypeId(value: string) { this.getEntityForSet().getData().organizationTypeId = value; }

  public get parentEntityId(): string { return this.getCurrentEntity().getData().parentEntityId || ''; }
  public set parentEntityId(value: string) { this.getEntityForSet().getData().parentEntityId = value; }

  public get parentEntityName(): string { return this.getCurrentEntity().getData().parentEntityName || ''; }
  public set parentEntityName(value: string) { this.getEntityForSet().getData().parentEntityName = value; }

  public get available(): number { return this.getCurrentEntity().getData().available || 1; }
  public set available(value: number) { this.getEntityForSet().getData().available = value; }
}

export class HcclOrganizationCrudWrapper extends EntityWrapper<HcclOrganizationGETData> {
  constructor(data: HcclOrganizationGETData, hcclService?: HcclService) {
    super(data, hcclService);
    this.entityType = HcclOrganizationCrudWrapper.ENTITY_TYPE;
  }

  public static ENTITY_TYPE = 'HcclOrganization';
  public static async newInstance(id: string, hcclService: HcclService): Promise<HcclOrganizationCrudWrapper> {
    const organization: HcclOrganizationGETData | undefined = id && id.length > 0 ? await hcclService.getHcclOrganizationById(id).toPromise() : undefined;
    if (!organization) {
      return new HcclOrganizationCrudWrapper(HcclOrganizationCrudWrapper.newEmpty(), hcclService);
    }
    return new HcclOrganizationCrudWrapper(organization, hcclService);
  }

  public static newEmpty() : HcclOrganizationGETData {
      return {
      name: '',
      businessCode: '',
      description: '',
      available: 1
    };
  }

  getDisplayText(entity?: HcclOrganizationGETData): string {
    const d = entity || this.data;
    return d.name || d.businessCode || 'Unnamed Organization';
  }

  getFkMenuCriteria(): HcclOrganizationCriteria {
    return {
      available: 1
    };
  }
  async getOrganizations(criteria?: HcclOrganizationCriteria): Promise<HcclOrganizationGETData[]> {
    if (!criteria) {
      criteria = this.getFkMenuCriteria();
    }
    const organizations = await this.hcclService?.findHcclOrganizations(criteria).toPromise();
    return organizations?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const organizations = await this.getOrganizations();
    const id = this.getId();
    return this.getMenuControlDataList('organizations', 'Organizations', organizations, id);
  }
 

}
