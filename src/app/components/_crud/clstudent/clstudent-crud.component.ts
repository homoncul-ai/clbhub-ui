import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AbstractCrudComponent } from '@app/components/_global/abstract-crud/abstract-crud.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { CLStudentCriteria, CLStudentGETData, CLStudentPOSTData, CLStudentPUTData, HcclOrganizationCriteria, HcclOrganizationGETData, HcclService, HcclUserContextGETData, MenuControlDataList } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { Observable, map } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { HcclOrganizationCrudComponent } from '@app/components/_crud/hccl-organization/hccl-organization-crud.component';
import { ClschoolCrudComponent, CLSchoolCrudWrapper } from '@app/components/_crud/clschool/clschool-crud.component';
@Component({
  selector: 'app-clstudent-crud',
  imports: [CommonModule, FormsModule, SimpleMessagesSectionComponent, MenuControlDataListComponent, HcclOrganizationCrudComponent, ClschoolCrudComponent],
  templateUrl: './clstudent-crud.component.html',
  styleUrl: './clstudent-crud.component.scss'
})
export class ClstudentCrudComponent extends AbstractCrudComponent<ClStudentCrudWrapper> implements OnInit, OnChanges {
/**
 * This is a component that will be used to create, read, update and delete CL Students
 * It will use the AbstractCrudComponent to handle the CRUD operations
 * It will use the CLStudentGETData and CLStudentPOSTData interfaces to handle the data
 * It will use the HcclService to handle the data
 * 
 * Input parameter:
 * - id?: string - Optional student ID to load a specific student for viewing/editing
 * 
 * If no ID is provided, the component will load the full list of students.
 * If an ID is provided, the component will load that specific student and show it in detail mode.
 * 
 * Create a wrapper class that extends EntityWrapper<CLStudentGETData>
 * and implement the abstract methods of the AbstractCrudComponent
 */

  
  constructor() {
    super();
  }
     /** Standard boiler plate for ngOnInit */
  override ngOnInit(): void {
    super.ngOnInit();
    this.entityType = 'CLStudent';
  }



  protected async loadEntityByIdCall(id: string): Promise<ClStudentCrudWrapper> {
    const student = await this.hcclService.getCLStudentById(id).toPromise();
      if (student) {
        return new ClStudentCrudWrapper(student, this.hcclService);
      }
      throw new Error('Student not found');
  }
  


  protected async createEntityDataCall(entity: ClStudentCrudWrapper): Promise<ClStudentCrudWrapper> {
      // Use entityNew if in create mode, otherwise use the passed entity
      const studentData = this.getMode() === CRUD_MODES.CREATE && this.entityNew ? this.entityNew.getData() : entity.getData();
      
      const postData: CLStudentPOSTData = {
        organizationId: studentData.organizationId || '',
        name: studentData.name || '',
        businessCode: studentData.businessCode || '',
        available: studentData.available || 1,
        dataOriginCode: studentData.dataOriginCode,
        userProfileId: studentData.userProfileId,
        userId: studentData.userId,
        userEmail: studentData.userEmail,
        cellPhoneNumber: studentData.cellPhoneNumber,
        workPhoneNumber: studentData.workPhoneNumber,
        firstName: studentData.firstName || '',
        lastName: studentData.lastName || '',
        schoolId: studentData.schoolId || ''
      };

      const createdStudent = await this.hcclService.createCLStudent(postData).toPromise();
      if (createdStudent) {
        return new ClStudentCrudWrapper(createdStudent, this.hcclService);
      }
      throw new Error('Failed to create student');
     
  }

  protected async updateEntityDataCall(entity: ClStudentCrudWrapper): Promise<ClStudentCrudWrapper> {
      const studentData = entity.getData();
      if (!studentData.id) {
        throw new Error('Student ID is required for update');
      }

      const putData: CLStudentPUTData = {
        organizationId: studentData.organizationId,
        name: studentData.name || '',
        businessCode: studentData.businessCode || '',
        available: studentData.available || 1,
        dataOriginCode: studentData.dataOriginCode,
        userProfileId: studentData.userProfileId,
        userId: studentData.userId,
        userEmail: studentData.userEmail,
        cellPhoneNumber: studentData.cellPhoneNumber,
        workPhoneNumber: studentData.workPhoneNumber,
        firstName: studentData.firstName || '',
        lastName: studentData.lastName || '',
        schoolId: studentData.schoolId || ''
      };

      const updatedStudent = await this.hcclService.updateCLStudentById(studentData.id, putData).toPromise();
      if (updatedStudent) {
        return new ClStudentCrudWrapper(updatedStudent, this.hcclService);
      }
      throw new Error('Failed to update student');
  }

  protected async deleteEntityData(id: string): Promise<boolean> {
    try {
      await this.hcclService.deleteCLStudentById(id).toPromise();
      return true;
    } catch (error) {
      console.error('Error deleting CL student:', error);
      throw error;
    }
  }


  
  public override newEmptyWrapper(): ClStudentCrudWrapper {
    // Create an empty student if no current entity exists
    const emptyStudent: CLStudentGETData = {
      organizationId: '',
      name: '',
      businessCode: '',
      available: 1,
      firstName: '',
      lastName: '',
      schoolId: ''
    };
    
    return new ClStudentCrudWrapper(emptyStudent, this.hcclService);
  }
  // Getter methods for form binding
  public get firstName(): string {
    return this.getCurrentEntity().getData().firstName || '';
  }

  public set firstName(value: string) {
    var data = super.getEntityForSet();
    data.getData().firstName = value;
  }

  public get lastName(): string {
    return this.getCurrentEntity().getData().lastName || '';
  }

  public set lastName(value: string) {
    var data = super.getEntityForSet();
    data.getData().lastName = value;
  }

  public get userEmail(): string {
    return this.getCurrentEntity().getData().userEmail || '';
  }

  public set userEmail(value: string) {
    var data = super.getEntityForSet();
    data.getData().userEmail = value;
  }

  public get schoolId(): string {
    return this.getCurrentEntity().getData().schoolId || '';
  }

  public set schoolId(value: string) {
    var data = super.getEntityForSet();
    data.getData().schoolId = value;
  }

 
  /**
   * Create a wrapper from CLStudentGETData
   * @param studentData The CLStudentGETData to wrap
   * @returns ClStudentCrudWrapper instance
   */
  public createWrapper(studentData: CLStudentGETData): ClStudentCrudWrapper {
    return new ClStudentCrudWrapper(studentData, this.hcclService);
  }

  getOrganizationFkMenuCriteria(): HcclOrganizationCriteria {
    // School organization.
    return {
      available: 1
    };
  }

  getOrganizationFkMenu(): MenuControlDataList | null {
    // This method should return the organization menu data
    // For now, return null - implement based on your business logic
    return null;
  }

  onSchoolChange(selectedSchool: any): void {
    // Handle school selection change
    console.log('School selected:', selectedSchool);
    // Implement your school change logic here
    // For example, update the current entity's schoolId
    if (selectedSchool && this.getCurrentEntity()) {
      this.schoolId = selectedSchool.id || '';
    }
  }



   /** Define the menu objects for this crud component */
   protected organizationMenu: MenuControlDataList | null = null;
   protected schoolMenu: MenuControlDataList | null = null;
   protected override async prepareMenus(entity: ClStudentCrudWrapper): Promise<void> {
    
    const fkMenu = await entity.getFkMenu();
    // Actually, we're going to load the organization wrapper, then call getSchoolsMenu
    this.organizationMenu = fkMenu || null;


    var schoolWrapper = await CLSchoolCrudWrapper.newInstance(entity.getSchoolId(), this.hcclService);
    this.schoolMenu = await schoolWrapper.getFkMenu();
    return Promise.resolve();
  }


}

export class ClStudentCrudWrapper extends EntityWrapper<CLStudentGETData> {

  public static async newInstance(id: string, hcclService: HcclService): Promise<ClStudentCrudWrapper> {
    const student = await hcclService.getCLStudentById(id).toPromise();
    if (student) {
      return new ClStudentCrudWrapper(student, hcclService);
    }
    throw new Error('Student not found');
  }
  constructor(data: CLStudentGETData, hcclService?: HcclService) {
    super(data, hcclService);
  }
  
  getDisplayText(entity?: CLStudentGETData): string {
    const data = entity || this.data;
    const firstName = data.firstName || '';
    const lastName = data.lastName || '';
    const name = data.name || '';
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (name) {
      return name;
    } else {
      return 'Unnamed Student';
    }
  }

  getFullName(): string {
    const firstName = this.data.firstName || '';
    const lastName = this.data.lastName || '';
    return `${firstName} ${lastName}`.trim();
  }

  getEmail(): string {
    return this.data.userEmail || '';
  }

  getPhone(): string {
    return this.data.cellPhoneNumber || this.data.workPhoneNumber || '';
  }

  getSchoolId(): string {
    return this.data.schoolId || '';
  }

  getOrganizationId(): string {
    return this.data.organizationId || '';
  }
  isActive(): boolean {
    return this.data.available === 1;
  }

  getFkMenuCriteria(): CLStudentCriteria {
    return {
      organizationId: this.data.organizationId || '',
      available: 1
    };
  }
  async getStudents(criteria?: CLStudentCriteria): Promise<CLStudentGETData[]> {
    if (!criteria) {
      criteria = this.getFkMenuCriteria();
    }
    const students = await this.hcclService?.findCLStudents(criteria).toPromise();
    return students?.searchResults || [];
  }

  public override async getFkMenu(menuHint?: string, data?: any): Promise<MenuControlDataList> {
    const students = await this.getStudents();
    return this.getMenuControlDataList('students', 'Students', students);
  }

}