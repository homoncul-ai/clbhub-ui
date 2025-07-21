import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, Validators } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { CLCourseCriteria, CLCourseGETData, CLCoursePOSTData, CLCoursePUTData, HcclService, MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { Observable, map } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { AvailableSelectorComponent } from '@app/components/_global/available-selector/available-selector.component';
import { DategetdataDisplayComponent } from '@app/components/_global/dategetdata-display/dategetdata-display.component';
import { StdMdbFormTextComponent } from '@app/components/_global/std-mdb-form-text/std-mdb-form-text.component';
import { StdMdbFormTextareaComponent } from '@app/components/_global/std-mdb-form-textarea/std-mdb-form-textarea.component';

@Component({
  selector: 'app-clcourse-crud',
  templateUrl: './clcourse-crud.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss',
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule, 
    StdMdbFormTextComponent, StdMdbFormTextareaComponent,
    SimpleMessagesSectionComponent, MenuControlDataListComponent,
    AvailableSelectorComponent, DategetdataDisplayComponent],
  standalone: true
})
export class CLCourseCrudComponent extends AbstractCrudComponent<CLCourseCrudWrapper> implements OnInit, OnChanges {
/**
 * This is a component that will be used to create, read, update and delete CL Course data
 * It will use the AbstractCrudComponent to handle the CRUD operations
 * It will use the CLCourseGETData and CLCoursePOSTData interfaces to handle the data
 * It will use the HcclService to handle the data
 * 
 * Input parameter:
 * - id?: string - Optional CL Course ID to load a specific CL Course for viewing/editing
 * 
 * If no ID is provided, the component will load the full list of CL Courses.
 * If an ID is provided, the component will load that specific CL Course and show it in detail mode.
 * 
 * Create a wrapper class that extends EntityWrapper<CLCourseGETData>
 * and implement the abstract methods of the AbstractCrudComponent
 */

  
  constructor() {
    super();
  }

  // Error property for form validation
  public error: any = null;

  // Validation methods
  private validateName(name: string): string | null {
    if (!name || name.trim() === '') {
      return 'Name is required';
    }
    if (name.length > 255) {
      return 'Name must be less than 255 characters';
    }
    return null;
  }

  private validateBusinessCode(businessCode: string): string | null {
    if (!businessCode || businessCode.trim() === '') {
      return 'Business Code is required';
    }
    if (businessCode.length > 255) {
      return 'Business Code must be less than 255 characters';
    }
    return null;
  }

  private validateCatalogCode(catalogCode: string): string | null {
    if (!catalogCode || catalogCode.trim() === '') {
      return 'Catalog Code is required';
    }
    if (catalogCode.length > 255) {
      return 'Catalog Code must be less than 255 characters';
    }
    return null;
  }

  private validateTitle(title: string): string | null {
    if (!title || title.trim() === '') {
      return 'Title is required';
    }
    if (title.length > 255) {
      return 'Title must be less than 255 characters';
    }
    return null;
  }

  private validateShortDescription(shortDescription: string): string | null {
    if (!shortDescription || shortDescription.trim() === '') {
      return 'Short Description is required';
    }
    if (shortDescription.length > 1024) {
      return 'Short Description must be less than 1024 characters';
    }
    return null;
  }

  private validateDescription(description: string): string | null {
    if (!description || description.trim() === '') {
      return 'Description is required';
    }
    if (description.length > 1024) {
      return 'Description must be less than 1024 characters';
    }
    return null;
  }

  // Validate all fields and return error object
  private validateForm(): any {
    const errors: any = {};
    
    const nameError = this.validateName(this.name);
    if (nameError) {
      errors.name = { errorMessage: nameError };
    }
    
    const businessCodeError = this.validateBusinessCode(this.businessCode);
    if (businessCodeError) {
      errors.businessCode = { errorMessage: businessCodeError };
    }
    
    const catalogCodeError = this.validateCatalogCode(this.catalogCode);
    if (catalogCodeError) {
      errors.catalogCode = { errorMessage: catalogCodeError };
    }
    
    const titleError = this.validateTitle(this.title);
    if (titleError) {
      errors.title = { errorMessage: titleError };
    }
    
    const shortDescriptionError = this.validateShortDescription(this.shortDescription);
    if (shortDescriptionError) {
      errors.shortDescription = { errorMessage: shortDescriptionError };
    }
    
    const descriptionError = this.validateDescription(this.description);
    if (descriptionError) {
      errors.description = { errorMessage: descriptionError };
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  }

  private clearValidationErrors(): void {
    this.error = null;
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected async loadEntityByIdCall(id: string): Promise<CLCourseCrudWrapper> {
    const data = await this.hcclService.getCLCourseById(id).toPromise();
    if (!data) {
      throw new Error('CLCourse not found');
    }
    return new CLCourseCrudWrapper(data, this.hcclService);
  }

  protected override async createEntityDataCall(entity: CLCourseCrudWrapper): Promise<any> {
    const postData: CLCoursePOSTData = {
      organizationId: entity.organizationId,
      name: entity.name,
      businessCode: entity.businessCode,
      available: entity.available,
      dataOriginCode: entity.dataOriginCode,
      catalogCode: entity.catalogCode,
      title: entity.title,
      shortDescription: entity.shortDescription,
      description: entity.description,
      schoolId: entity.schoolId
    };
    
    return await this.hcclService.createCLCourse(postData).toPromise();
  }

  protected override async updateEntityDataCall(entity: CLCourseCrudWrapper): Promise<void> {
    const putData: CLCoursePUTData = {
      organizationId: entity.organizationId,
      name: entity.name,
      businessCode: entity.businessCode,
      available: entity.available,
      dataOriginCode: entity.dataOriginCode,
      catalogCode: entity.catalogCode,
      title: entity.title,
      shortDescription: entity.shortDescription,
      description: entity.description,
      schoolId: entity.schoolId
    };
    
    await this.hcclService.updateCLCourseById(entity.id!, putData).toPromise();
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteCLCourseById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting CL Course:', error);
      return false;
    }
  }

  public override newEmptyWrapper(): CLCourseCrudWrapper {
    return CLCourseCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  public get name(): string {
    return this.entity?.name || '';
  }

  public set name(value: string) {
    if (this.entity) {
      this.entity.name = value;
    }
  }

  public get businessCode(): string {
    return this.entity?.businessCode || '';
  }

  public set businessCode(value: string) {
    if (this.entity) {
      this.entity.businessCode = value;
    }
  }

  public get catalogCode(): string {
    return this.entity?.catalogCode || '';
  }

  public set catalogCode(value: string) {
    if (this.entity) {
      this.entity.catalogCode = value;
    }
  }

  public get title(): string {
    return this.entity?.title || '';
  }

  public set title(value: string) {
    if (this.entity) {
      this.entity.title = value;
    }
  }

  public get shortDescription(): string {
    return this.entity?.shortDescription || '';
  }

  public set shortDescription(value: string) {
    if (this.entity) {
      this.entity.shortDescription = value;
    }
  }

  public get description(): string {
    return this.entity?.description || '';
  }

  public set description(value: string) {
    if (this.entity) {
      this.entity.description = value;
    }
  }

  public get available(): number {
    return this.entity?.available || 0;
  }

  public set available(value: number) {
    if (this.entity) {
      this.entity.available = value;
    }
  }

  public get organizationId(): string {
    return this.entity?.organizationId || '';
  }

  public set organizationId(value: string) {
    if (this.entity) {
      this.entity.organizationId = value;
    }
  }

  public get dataOriginCode(): string {
    return this.entity?.dataOriginCode || '';
  }

  public set dataOriginCode(value: string) {
    if (this.entity) {
      this.entity.dataOriginCode = value;
    }
  }

  public get schoolId(): string {
    return this.entity?.schoolId || '';
  }

  public set schoolId(value: string) {
    if (this.entity) {
      this.entity.schoolId = value;
    }
  }

  public createWrapper(clCourseData: CLCourseGETData): CLCourseCrudWrapper {
    return new CLCourseCrudWrapper(clCourseData, this.hcclService);
  }

  getCLCourseFkMenuCriteria(): CLCourseCriteria {
    return {
      available: 1
    };
  }

  protected clCourseMenu: MenuControlDataList | null = null;
  protected override async prepareMenus(entity: CLCourseCrudWrapper): Promise<void> {
    // Prepare FK menus if needed
  }
}

export class CLCourseCrudWrapper extends EntityWrapper<CLCourseGETData> {

  public static newInstanceForCreate(hcclService: HcclService, entityIn?: CLCourseGETData | null): CLCourseCrudWrapper {
    const emptyData: CLCourseGETData = {
      id: '',
      organizationId: '',
      name: '',
      businessCode: '',
      available: 1,
      dataOriginCode: '',
      catalogCode: '',
      title: '',
      shortDescription: '',
      description: '',
      schoolId: ''
    };
    return new CLCourseCrudWrapper(entityIn || emptyData, hcclService);
  }

  constructor(data: CLCourseGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }

  // Properties for form binding
  get organizationId(): string {
    return this.data.organizationId || '';
  }

  set organizationId(value: string) {
    this.data.organizationId = value;
  }

  get name(): string {
    return this.data.name || '';
  }

  set name(value: string) {
    this.data.name = value;
  }

  get businessCode(): string {
    return this.data.businessCode || '';
  }

  set businessCode(value: string) {
    this.data.businessCode = value;
  }

  get available(): number {
    return this.data.available || 0;
  }

  set available(value: number) {
    this.data.available = value;
  }

  get dataOriginCode(): string {
    return this.data.dataOriginCode || '';
  }

  set dataOriginCode(value: string) {
    this.data.dataOriginCode = value;
  }

  get catalogCode(): string {
    return this.data.catalogCode || '';
  }

  set catalogCode(value: string) {
    this.data.catalogCode = value;
  }

  get title(): string {
    return this.data.title || '';
  }

  set title(value: string) {
    this.data.title = value;
  }

  get shortDescription(): string {
    return this.data.shortDescription || '';
  }

  set shortDescription(value: string) {
    this.data.shortDescription = value;
  }

  get description(): string {
    return this.data.description || '';
  }

  set description(value: string) {
    this.data.description = value;
  }

  get schoolId(): string {
    return this.data.schoolId || '';
  }

  set schoolId(value: string) {
    this.data.schoolId = value;
  }

  get id(): string {
    return this.data.id || '';
  }

  set id(value: string) {
    this.data.id = value;
  }

  getDisplayText(entity?: CLCourseGETData): string {
    const targetEntity: CLCourseGETData = entity ? entity : (this.data || {});
    return targetEntity.name || targetEntity.title || targetEntity.businessCode || 'CL Course';
  }

  getFullName(): string {
    return this.data.name || '';
  }

  getBusinessCode(): string {
    return this.data.businessCode || '';
  }

  getCatalogCode(): string {
    return this.data.catalogCode || '';
  }

  getTitle(): string {
    return this.data.title || '';
  }

  getShortDescription(): string {
    return this.data.shortDescription || '';
  }

  getDescription(): string {
    return this.data.description || '';
  }

  getAvailable(): number {
    return this.data.available || 0;
  }

  isActive(): boolean {
    return this.data.available === 1;
  }

  getFkMenuCriteria(): CLCourseCriteria {
    return {
      available: 1
    };
  }

  async getCLCourses(criteria?: CLCourseCriteria): Promise<CLCourseGETData[]> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    const results = await this.hcclService.findCLCourses(criteria || this.getFkMenuCriteria()).toPromise();
    return results?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    if (!this.hcclService) {
      throw new Error('HcclService not available');
    }
    
    const courses = await this.getCLCourses();
    const menuItems: MenuControlData[] = courses.map(course => ({
      id: course.id || '',
      name: course.name || course.title || course.businessCode || 'CL Course'
    }));
    
    return {
      menuItems: menuItems
    };
  }
} 