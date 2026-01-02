// PersonalStatementResume CRUD Component
// Generated from template-crud.component.ts for entityName = PersonalStatementResume

import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, Validators } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { PersonalStatementResumeCriteria, PersonalStatementResumeGETData, PersonalStatementResumePOSTData, PersonalStatementResumePUTData, HcclService, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { Observable, map } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';
import { ReferenceDataComponent } from '@app/components/_global/reference-data/reference-data.component';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';

// Import FK CRUD components
import { HcclUserProfileCrudComponent, HcclUserProfileCrudWrapper } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { PersonalStatementCrudComponent, PersonalStatementCrudWrapper } from '@app/components/_crud/personalstatement/personalstatement-crud.component';

@Component({
  selector: 'app-personalstatementresume-crud',
  templateUrl: './personalstatementresume-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule,
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent, ReferenceDataComponent,
    HcclUserProfileCrudComponent, PersonalStatementCrudComponent],
  standalone: true
})
export class PersonalStatementResumeCrudComponent extends AbstractCrudComponent<PersonalStatementResumeCrudWrapper> implements OnInit, OnChanges {

  constructor() {
    super();
  }

  // Error property for form validation
  public error: any = null;

  override ngOnInit(): void {
    super.ngOnInit();
    this.entityType = 'PersonalStatementResume';
  }

  protected async loadEntityByIdCall(id: string): Promise<PersonalStatementResumeCrudWrapper> {
    const personalStatementResume = await this.hcclService.getPersonalStatementResumeById(id).toPromise();
    if (personalStatementResume) {
      return new PersonalStatementResumeCrudWrapper(personalStatementResume, this.hcclService);
    }
    throw new Error('Personal Statement Resume not found');
  }

  protected override async createEntityDataCall(entity: PersonalStatementResumeCrudWrapper): Promise<any> {
    // Use entityNew if in create mode, otherwise use the passed entity
    const personalStatementResumeData = this.getMode() === CRUD_MODES.CREATE && this.entityNew ? this.entityNew.getData() : entity.getData();

    const postData: PersonalStatementResumePOSTData = {
      userProfileId: personalStatementResumeData.userProfileId || '',
      personalStatmentId: personalStatementResumeData.personalStatmentId || '',
      title: personalStatementResumeData.title || '',
      resumeMd: personalStatementResumeData.resumeMd || '',
      resumeMdEdited: personalStatementResumeData.resumeMdEdited,
      resumeJson: personalStatementResumeData.resumeJson || '{}',
      available: personalStatementResumeData.available || 1
    };

    try {
      const response = await this.hcclService.createPersonalStatementResume(postData).toPromise();
      console.log('Create response:', response);
      return response;
    } catch (error) {
      console.error('Create error:', error);
      throw error;
    }
  }

  protected override async updateEntityDataCall(entity: PersonalStatementResumeCrudWrapper): Promise<void> {
    const personalStatementResumeData = entity.getData();
    if (!personalStatementResumeData.id) {
      throw new Error('Personal Statement Resume ID is required for update');
    }

    const putData: PersonalStatementResumePUTData = {
      userProfileId: personalStatementResumeData.userProfileId || '',
      personalStatmentId: personalStatementResumeData.personalStatmentId || '',
      title: personalStatementResumeData.title || '',
      resumeMd: personalStatementResumeData.resumeMd || '',
      resumeMdEdited: personalStatementResumeData.resumeMdEdited,
      resumeJson: personalStatementResumeData.resumeJson || '{}',
      available: personalStatementResumeData.available || 1
    };

    try {
      await this.hcclService.updatePersonalStatementResumeById(personalStatementResumeData.id, putData).toPromise();
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deletePersonalStatementResumeById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting Personal Statement Resume:', error);
      return false;
    }
  }

  public override newEmptyWrapper(): PersonalStatementResumeCrudWrapper {
    return PersonalStatementResumeCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  // Getter and setter methods for form binding
  public get title(): string {
    return this.getCurrentEntity()?.getData()?.title || '';
  }

  public set title(value: string) {
    const data = super.getEntityForSet();
    data.getData().title = value;
  }

  public get userProfileId(): string {
    return this.getCurrentEntity()?.getData()?.userProfileId || '';
  }

  public set userProfileId(value: string) {
    const data = super.getEntityForSet();
    data.getData().userProfileId = value;
  }

  public get personalStatmentId(): string {
    return this.getCurrentEntity()?.getData()?.personalStatmentId || '';
  }

  public set personalStatmentId(value: string) {
    const data = super.getEntityForSet();
    data.getData().personalStatmentId = value;
  }

  public get resumeMd(): string {
    return this.getCurrentEntity()?.getData()?.resumeMd || '';
  }

  public set resumeMd(value: string) {
    const data = super.getEntityForSet();
    data.getData().resumeMd = value;
  }

  public get resumeMdEdited(): string {
    return this.getCurrentEntity()?.getData()?.resumeMdEdited || '';
  }

  public set resumeMdEdited(value: string) {
    const data = super.getEntityForSet();
    data.getData().resumeMdEdited = value;
  }

  public get resumeJson(): string {
    return this.getCurrentEntity()?.getData()?.resumeJson || '';
  }

  public set resumeJson(value: string) {
    const data = super.getEntityForSet();
    data.getData().resumeJson = value;
  }

  public get available(): number {
    return this.getCurrentEntity()?.getData()?.available || 1;
  }

  public set available(value: number) {
    const data = super.getEntityForSet();
    data.getData().available = value;
  }

  public createWrapper(personalStatementResumeData: PersonalStatementResumeGETData): PersonalStatementResumeCrudWrapper {
    return new PersonalStatementResumeCrudWrapper(personalStatementResumeData, this.hcclService);
  }

  getPersonalStatementResumeFkMenuCriteria(): PersonalStatementResumeCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  /** Define the menu objects for this crud component */
  protected personalStatementResumeMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: PersonalStatementResumeCrudWrapper): Promise<void> {
    // const criteria = this.getPersonalStatementResumeFkMenuCriteria();
    // const results = await this.hcclService.findPersonalStatementResumes(criteria).toPromise();
    // this.personalStatementResumeMenu = await entity.getFkMenu("personalstatementresumes", this.id);
    return Promise.resolve();
  }
}

export class PersonalStatementResumeCrudWrapper extends EntityWrapper<PersonalStatementResumeGETData> {

  public static newInstanceForCreate(hcclService: HcclService, entityIn?: PersonalStatementResumeGETData | null): PersonalStatementResumeCrudWrapper {
    const emptyData: PersonalStatementResumeGETData = {
      userProfileId: '',
      personalStatmentId: '',
      title: '',
      resumeMd: '',
      resumeMdEdited: '',
      resumeJson: '{}',
      available: 1
    };
    return new PersonalStatementResumeCrudWrapper(entityIn || emptyData, hcclService);
  }

  public static async newInstance(id: string, hcclService: HcclService): Promise<PersonalStatementResumeCrudWrapper> {
    const data = await hcclService.getPersonalStatementResumeById(id).toPromise();
    if (!data) {
      throw new Error('Personal Statement Resume not found');
    }
    return new PersonalStatementResumeCrudWrapper(data, hcclService);
  }

  constructor(data: PersonalStatementResumeGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  getDisplayText(entity?: PersonalStatementResumeGETData): string {
    const data = entity || this.getData();
    if (data.title) {
      return data.title;
    }
    return data.id || 'Unknown Personal Statement Resume';
  }

  getTitle(): string {
    return this.getData().title || '';
  }

  getUserProfileId(): string {
    return this.getData().userProfileId || '';
  }

  getPersonalStatmentId(): string {
    return this.getData().personalStatmentId || '';
  }

  getResumeMd(): string {
    return this.getData().resumeMd || '';
  }

  getResumeMdEdited(): string {
    return this.getData().resumeMdEdited || '';
  }

  getResumeJson(): string {
    return this.getData().resumeJson || '';
  }

  getAvailable(): number {
    return this.getData().available || 0;
  }

  isActive(): boolean {
    return this.getData().available === 1;
  }

  getFkMenuCriteria(): PersonalStatementResumeCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  async getPersonalStatementResumes(criteria?: PersonalStatementResumeCriteria): Promise<PersonalStatementResumeGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const results = await this.hcclService.findPersonalStatementResumes(criteria || this.getFkMenuCriteria()).toPromise();
    return results?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const personalStatementResumes = await this.getPersonalStatementResumes();
    return this.getMenuControlDataList("personalstatementresumes", this.getEntityType() + " Menu", personalStatementResumes, data);
  }
}

