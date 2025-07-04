import { Component, OnInit, Input } from '@angular/core';
import { AbstractCrudComponentComponent } from '@app/components/_global/abstract-crud-component/abstract-crud-component.component';
import { EntityWrapper } from '@app/models/crud-entity-wrapper';
import { CLStudentGETData, CLStudentPOSTData, CLStudentPUTData, HcclService } from '@app/restsvc/hccl.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-clstudent-crud',
  imports: [],
  templateUrl: './clstudent-crud.component.html',
  styleUrl: './clstudent-crud.component.scss'
})
export class ClstudentCrudComponent extends AbstractCrudComponentComponent<ClStudentCrudWrapper, ClStudentCrudWrapper> implements OnInit {
/**
 * This is a component that will be used to create, read, update and delete CL Students
 * It will use the AbstractCrudComponentComponent to handle the CRUD operations
 * It will use the CLStudentGETData and CLStudentPOSTData interfaces to handle the data
 * It will use the CLStudentService to handle the data
 * It will use the CLStudentComponent to display the data
 * It will use the CLStudentFormComponent to create the form
 * It will use the CLStudentListComponent to display the list
 * 
 * instantiate component with input parameter of type CLStudentGETData (or create an empty one).
 * Create a wrapper class that extends EntityWrapper<CLStudentGETData>
 * and implement the abstract methods of the AbstractCrudComponentComponent
 * 
 * AbstractCrudComponentComponent needs handle 
 * 
 * 
 */

  @Input() initialStudentData?: CLStudentGETData;

  constructor(private hcclService: HcclService) {
    super();
  }

  ngOnInit(): void {
    // Initialize with input data if provided
    if (this.initialStudentData) {
      this.entity = new ClStudentCrudWrapper(this.initialStudentData);
      this.switchToDetailMode(); // Show details of the provided student
    } else {
      // Initialize component - load entity list by default
      this.loadEntityList();
    }
  }

  protected async loadEntityList(): Promise<ClStudentCrudWrapper[]> {
    try {
      const criteria = {}; // Empty criteria to get all students
      const response = await this.hcclService.findCLStudents(criteria).toPromise();
      if (response?.searchResults) {
        return response.searchResults.map(student => new ClStudentCrudWrapper(student));
      }
      return [];
    } catch (error) {
      console.error('Error loading CL students:', error);
      throw error;
    }
  }

  protected async loadEntityById(id: string): Promise<ClStudentCrudWrapper> {
    try {
      const student = await this.hcclService.getCLStudentById(id).toPromise();
      if (student) {
        return new ClStudentCrudWrapper(student);
      }
      throw new Error('Student not found');
    } catch (error) {
      console.error('Error loading CL student by ID:', error);
      throw error;
    }
  }

  protected async createEntityData(entity: ClStudentCrudWrapper): Promise<ClStudentCrudWrapper> {
    try {
      const studentData = entity.getData();
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
        return new ClStudentCrudWrapper(createdStudent);
      }
      throw new Error('Failed to create student');
    } catch (error) {
      console.error('Error creating CL student:', error);
      throw error;
    }
  }

  protected async updateEntityData(entity: ClStudentCrudWrapper): Promise<ClStudentCrudWrapper> {
    try {
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
        return new ClStudentCrudWrapper(updatedStudent);
      }
      throw new Error('Failed to update student');
    } catch (error) {
      console.error('Error updating CL student:', error);
      throw error;
    }
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

  // Override post operation handlers for custom behavior
  protected override postSave(): void {
    console.log('CL Student saved successfully');
    // Refresh the entity list after save
    this.loadEntityList();
  }

  protected override postDelete(): void {
    console.log('CL Student deleted successfully');
    // Refresh the entity list after delete
    this.loadEntityList();
  }

  protected override postCreate(): void {
    console.log('CL Student created successfully');
    // Refresh the entity list after create
    this.loadEntityList();
  }

  // Helper methods for component usage
  public createNewStudent(): void {
    const emptyStudent: CLStudentGETData = {
      organizationId: '',
      name: '',
      businessCode: '',
      available: 1,
      firstName: '',
      lastName: '',
      schoolId: ''
    };
    this.entity = new ClStudentCrudWrapper(emptyStudent);
    this.switchToCreateMode();
  }

  public editStudent(student: ClStudentCrudWrapper): void {
    this.entity = student;
    this.switchToEditMode();
  }

  public viewStudent(student: ClStudentCrudWrapper): void {
    this.entity = student;
    this.switchToViewMode();
  }

  public deleteStudent(student: ClStudentCrudWrapper): void {
    this.entity = student;
    this.switchToDeleteMode();
  }

  /**
   * Set initial student data and create wrapper
   * @param studentData The CLStudentGETData to initialize with
   */
  public setInitialStudentData(studentData: CLStudentGETData): void {
    this.entity = new ClStudentCrudWrapper(studentData);
    this.switchToDetailMode();
  }

  /**
   * Create a wrapper from CLStudentGETData
   * @param studentData The CLStudentGETData to wrap
   * @returns ClStudentCrudWrapper instance
   */
  public createWrapper(studentData: CLStudentGETData): ClStudentCrudWrapper {
    return new ClStudentCrudWrapper(studentData);
  }
}

export class ClStudentCrudWrapper extends EntityWrapper<CLStudentGETData> {
  constructor(data: CLStudentGETData) {
    super(data);
  }

  getDisplayText(): string {
    const firstName = this.data.firstName || '';
    const lastName = this.data.lastName || '';
    const name = this.data.name || '';
    
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
}