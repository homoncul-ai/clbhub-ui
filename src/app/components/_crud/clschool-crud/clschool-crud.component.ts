import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { CLSchoolGETData, CLSchoolPOSTData, CLSchoolPUTData, CLSchoolCriteria, HcclService, MenuControlDataList } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { HcclOrganizationCrudComponent, HcclOrganizationCrudWrapper } from '@app/components/_crud/hccl-organization-crud/hccl-organization-crud.component';

@Component({
  selector: 'app-clschool-crud',
  imports: [CommonModule, FormsModule, SimpleMessagesSectionComponent, MenuControlDataListComponent, HcclOrganizationCrudComponent],
  templateUrl: './clschool-crud.component.html',
  styleUrl: './clschool-crud.component.scss'
})
export class ClschoolCrudComponent extends AbstractCrudComponent<CLSchoolCrudWrapper> implements OnInit, OnChanges {
  constructor() { super(); }

  override ngOnInit(): void { 
    super.ngOnInit(); 
    this.entityType = CLSchoolCrudWrapper.ENTITY_TYPE;
  }

  protected async loadEntityByIdCall(id: string): Promise<CLSchoolCrudWrapper> {
    const school = await this.hcclService.getCLSchoolById(id).toPromise();
    if (school) return new CLSchoolCrudWrapper(school, this.hcclService);
    throw new Error('School not found');
  }

  protected async createEntityDataCall(entity: CLSchoolCrudWrapper): Promise<CLSchoolCrudWrapper> {
    const data = this.getMode() === CRUD_MODES.CREATE && this.entityNew ? this.entityNew.getData() : entity.getData();
    const postData: CLSchoolPOSTData = {
      organizationId: data.organizationId || '',
      name: data.name || '',
      businessCode: data.businessCode || '',
      available: data.available || 1,
      dataOriginCode: data.dataOriginCode,
      organizationName: data.organizationName,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      addressLine3: data.addressLine3,
      addressLine4: data.addressLine4,
      districtCode: data.districtCode
    };
    const created = await this.hcclService.createCLSchool(postData).toPromise();
    if (created) return new CLSchoolCrudWrapper(created, this.hcclService);
    throw new Error('Failed to create school');
  }

  protected async updateEntityDataCall(entity: CLSchoolCrudWrapper): Promise<CLSchoolCrudWrapper> {
    const data = entity.getData();
    if (!data.id) throw new Error('School ID is required for update');
    const putData: CLSchoolPUTData = {
      organizationId: data.organizationId || '',
      name: data.name || '',
      businessCode: data.businessCode || '',
      available: data.available || 1,
      dataOriginCode: data.dataOriginCode,
      organizationName: data.organizationName,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      addressLine3: data.addressLine3,
      addressLine4: data.addressLine4,
      districtCode: data.districtCode
    };
    const updated = await this.hcclService.updateCLSchoolById(data.id, putData).toPromise();
    if (updated) return new CLSchoolCrudWrapper(updated, this.hcclService);
    throw new Error('Failed to update school');
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    await this.hcclService.deleteCLSchoolById(id).toPromise();
    return true;
  }

  public override newEmptyWrapper(): CLSchoolCrudWrapper {
    const empty: CLSchoolGETData = {
      name: '',
      businessCode: '',
      available: 1
    };
    return new CLSchoolCrudWrapper(empty, this.hcclService);
  }

  public createWrapper(data: CLSchoolGETData): CLSchoolCrudWrapper {
    return new CLSchoolCrudWrapper(data, this.hcclService);
  }

  public get name(): string { return this.getCurrentEntity().getData().name || ''; }
  public set name(value: string) { this.getEntityForSet().getData().name = value; }

  public get businessCode(): string { return this.getCurrentEntity().getData().businessCode || ''; }
  public set businessCode(value: string) { this.getEntityForSet().getData().businessCode = value; }

  public get organizationId(): string { return this.getCurrentEntity().getData().organizationId || ''; }
  public set organizationId(value: string) { this.getEntityForSet().getData().organizationId = value; }

  public get organizationName(): string { return this.getCurrentEntity().getData().organizationName || ''; }
  public set organizationName(value: string) { this.getEntityForSet().getData().organizationName = value; }

  public get addressLine1(): string { return this.getCurrentEntity().getData().addressLine1 || ''; }
  public set addressLine1(value: string) { this.getEntityForSet().getData().addressLine1 = value; }

  public get addressLine2(): string { return this.getCurrentEntity().getData().addressLine2 || ''; }
  public set addressLine2(value: string) { this.getEntityForSet().getData().addressLine2 = value; }

  public get addressLine3(): string { return this.getCurrentEntity().getData().addressLine3 || ''; }
  public set addressLine3(value: string) { this.getEntityForSet().getData().addressLine3 = value; }

  public get addressLine4(): string { return this.getCurrentEntity().getData().addressLine4 || ''; }
  public set addressLine4(value: string) { this.getEntityForSet().getData().addressLine4 = value; }

  public get districtCode(): string { return this.getCurrentEntity().getData().districtCode || ''; }
  public set districtCode(value: string) { this.getEntityForSet().getData().districtCode = value; }

  public get available(): number { return this.getCurrentEntity().getData().available || 1; }
  public set available(value: number) { this.getEntityForSet().getData().available = value; }

  onOrganizationChange(selectedOrganization: any): void {
    console.log('Organization selected:', selectedOrganization);
    if (selectedOrganization && this.getCurrentEntity()) {
      this.organizationId = selectedOrganization.id || '';
    }
  }


   /** Define the menu objects for this crud component */
   protected organizationMenu: MenuControlDataList | null = null;
   protected override async prepareMenus(entity: CLSchoolCrudWrapper): Promise<void> {
    var organizationWrapper = await HcclOrganizationCrudWrapper.newInstance(entity.getOrganizationId(), this.hcclService);
    const fkMenu = await organizationWrapper.getFkMenu();
    // Actually, we're going to load the organization wrapper, then call getSchoolsMenu
    this.organizationMenu = fkMenu || null;

 
    return Promise.resolve();
  }

}

export class CLSchoolCrudWrapper extends EntityWrapper<CLSchoolGETData> {

  public static ENTITY_TYPE = 'CLSchool';
  public static async newInstance(id: string, hcclService: HcclService): Promise<CLSchoolCrudWrapper> {
    const school = await hcclService.getCLSchoolById(id).toPromise();
    if (school) {
      return new CLSchoolCrudWrapper(school, hcclService);
    }
    throw new Error('Student not found');
  }

  constructor(data: CLSchoolGETData, hcclService?: HcclService) {
    super(data, hcclService);
    this.entityType = CLSchoolCrudWrapper.ENTITY_TYPE;
  }
  
  getDisplayText(entity?: CLSchoolGETData): string {
    const d = entity || this.data;
    return d.name || d.businessCode || 'Unnamed School';
  }

  getFullName(): string {
    return this.data.name || '';
  }

  getBusinessCode(): string {
    return this.data.businessCode || '';
  }

  getOrganizationId(): string {
    return this.data.organizationId || '';
  }

  getOrganizationName(): string {
    return this.data.organizationName || '';
  }

  getAddress(): string {
    const parts = [
      this.data.addressLine1,
      this.data.addressLine2,
      this.data.addressLine3,
      this.data.addressLine4
    ].filter(part => part && part.trim());
    return parts.join(', ');
  }

  getDistrictCode(): string {
    return this.data.districtCode || '';
  }

  isActive(): boolean {
    return this.data.available === 1;
  }

  getFkMenuCriteria(): CLSchoolCriteria {
    return {
      available: 1
    };
  }

  async getSchools(criteria?: CLSchoolCriteria): Promise<CLSchoolGETData[]> {
    const searchResults = await this.hcclService!.findCLSchools(criteria || this.getFkMenuCriteria()).toPromise();
    return searchResults?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const schools = await this.getSchools();
    return this.getMenuControlDataList('schools', 'Schools', schools);
  }

}
