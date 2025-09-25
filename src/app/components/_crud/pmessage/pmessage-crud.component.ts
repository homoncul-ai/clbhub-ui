// This template is for generating a CRUD component for an entity that has a FK Menu
// This was generated using entityName = PMessage
// Generate the new pmessage-crud.component.ts   files using this template
// Of course, the code related to the attribtutes of the entity shoule be changed to match the entityName
// Review the HTML after the generation is complete and maker sure all the imports required are included.


import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, Validators } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { PMessageCriteria, PMessageGETData, PMessagePOSTData, PMessagePUTData, HcclService, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { Observable, map } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';
import { ReferenceDataComponent } from '@app/components/_global/reference-data/reference-data.component';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';

// Import are all the FK Menus for the UI to use <app-entityNameFk-crud>
import { HcclUserProfileCrudComponent } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';

@Component({
  selector: 'app-pmessage-crud',
  templateUrl: './pmessage-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule,
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    DategetdataDisplayComponent, ReferenceDataComponent, HcclUserProfileCrudComponent],
  standalone: true
})
export class PMessageCrudComponent extends AbstractCrudComponent<PMessageCrudWrapper> implements OnInit, OnChanges {

  constructor() {
    super();
  }

  // Error property for form validation
  public error: any = null;

  

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected async loadEntityByIdCall(id: string): Promise<PMessageCrudWrapper> {
    const pmessage = await this.hcclService.getPMessageById(id).toPromise();
    if (!pmessage) {
      throw new Error('PMessage not found');
    }
    return new PMessageCrudWrapper(pmessage, this.hcclService);
  }

  protected override async createEntityDataCall(entity: PMessageCrudWrapper): Promise<any> {
    const postData: PMessagePOSTData = {
      authorUserProfileId: entity.getData().authorUserProfileId || '',
      title: entity.getData().title || '',
      description: entity.getData().description || '',
      subjectEntityId: entity.getData().subjectEntityId || '',
      subjectEntityType: entity.getData().subjectEntityType || '',
      dateLastEntry: entity.getData().dateLastEntry || ''
    };
 
    // This is important - the requestCreate method returns { id: string, status: 201 }
    try {
      // The requestCreate method returns { id: string, status: 201 }
      const response = await this.hcclService.createPMessage(postData);
      console.log('Create response:', response);
      return response;
    } catch (error) {
      console.error('Create error:', error);
      throw error;
    }

  }

  protected override async updateEntityDataCall(entity: PMessageCrudWrapper): Promise<void> {
    const putData: PMessagePUTData = {
      authorUserProfileId: entity.getData().authorUserProfileId || '',
      title: entity.getData().title || '',
      description: entity.getData().description || '',
      subjectEntityId: entity.getData().subjectEntityId || '',
      subjectEntityType: entity.getData().subjectEntityType || '',
      subjectEntityName: entity.getData().subjectEntityName || '',
      dateLastEntry: entity.getData().dateLastEntry || ''
    };

    await this.hcclService.updatePMessageById(entity.getData().id!, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deletePMessageById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting PMessage:', error);
      return false;
    }
  }

  public override newEmptyWrapper(): PMessageCrudWrapper {
    return PMessageCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  // Getter and setter methods for form binding
  public get authorUserProfileId(): string {
    return this.getCurrentEntity()?.getData()?.authorUserProfileId || '';
  }

  public set authorUserProfileId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().authorUserProfileId = value;
    }
  }

  public get title(): string {
    return this.getCurrentEntity()?.getData()?.title || '';
  }

  public set title(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().title = value;
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

  public get subjectEntityId(): string {
    return this.getCurrentEntity()?.getData()?.subjectEntityId || '';
  }

  public set subjectEntityId(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().subjectEntityId = value;
    }
  }

  public get subjectEntityType(): string {
    return this.getCurrentEntity()?.getData()?.subjectEntityType || '';
  }

  public set subjectEntityType(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().subjectEntityType = value;
    }
  }

  public get subjectEntityName(): string {
    return this.getCurrentEntity()?.getData()?.subjectEntityName || '';
  }

  public set subjectEntityName(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().subjectEntityName = value;
    }
  }

  public get dateLastEntry(): string {
    return this.getCurrentEntity()?.getData()?.dateLastEntry || '';
  }

  public set dateLastEntry(value: string) {
    if (this.getCurrentEntity()) {
      this.getCurrentEntity()!.getData().dateLastEntry = value;
    }
  }

  public createWrapper(pmessageData: PMessageGETData): PMessageCrudWrapper {
    return new PMessageCrudWrapper(pmessageData, this.hcclService);
  }

  getPMessageFkMenuCriteria(): PMessageCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected pmessageMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: PMessageCrudWrapper): Promise<void> {
    const criteria = this.getPMessageFkMenuCriteria();
    const results = await this.hcclService.findPMessages(criteria).toPromise();
    this.pmessageMenu =await entity.getFkMenu("pmessages", this.id);
  }
}

export class PMessageCrudWrapper extends EntityWrapper<PMessageGETData> {

  public static newInstanceForCreate(hcclService: HcclService, entityIn?: PMessageGETData | null): PMessageCrudWrapper {
    const emptyData: PMessageGETData = {
      title: '',
      description: '',
      authorUserProfileId: '',
      subjectEntityId: '',
      subjectEntityType: ''
    };
    return new PMessageCrudWrapper(entityIn || emptyData, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<PMessageCrudWrapper> {
    const data = await hcclService.getPMessageById(id).toPromise();
    if (!data) {
      throw new Error('PMessage not found');
    }
    return new PMessageCrudWrapper(data, hcclService);
  }

  constructor(data: PMessageGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  getDisplayText(entity?: PMessageGETData): string {
    const data = entity || this.getData();
    if (data.title) {
      return data.title;
    }
    if (data.description) {
      return data.description;
    }
    return data.id || 'Unknown PMessage';
  }

  getTitle(): string {
    return this.getData().title || '';
  }

  getDescription(): string {
    return this.getData().description || '';
  }

  getAuthorUserProfileId(): string {
    return this.getData().authorUserProfileId || '';
  }

  getSubjectEntityId(): string {
    return this.getData().subjectEntityId || '';
  }

  getSubjectEntityType(): string {
    return this.getData().subjectEntityType || '';
  }

  getSubjectEntityName(): string {
    return this.getData().subjectEntityName || '';
  }

  getDateLastEntry(): string {
    return this.getData().dateLastEntry || '';
  }

  getFkMenuCriteria(): PMessageCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  async getPMessages(criteria?: PMessageCriteria): Promise<PMessageGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const results = await this.hcclService.findPMessages(criteria || this.getFkMenuCriteria()).toPromise();
    return results?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const pmessages = await this.getPMessages();
    return this.getMenuControlDataList("pmessages", this.getEntityType() + " Menu", pmessages, data);
  }
} 
