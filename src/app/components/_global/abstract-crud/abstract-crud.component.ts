import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { EntityWrapper } from '../../../models/crud-entity-wrapper';
import { CLStudentPOSTData, HcclService, HcclUserContextGETData, SimpleMessageList } from '../../../restsvc/hccl.service';
import { HcclContextService } from '../../../shell/services/hccl-context.service';
import { CRUD_MODES, CrudModeType } from '../../../@core/constants';

@Component({
  selector: 'app-abstract-crud',
  imports: [],
  templateUrl: './abstract-crud.component.html',
  styleUrl: './abstract-crud.component.scss'
})
export abstract class AbstractCrudComponent<R extends EntityWrapper<any>> {
  /**
   * This component takes a generic type T that  extends EntityWrapper<T>
   * and a generic type R that extends EntityWrapper<T>
   * 
   * It will provide the following properties:
   * - entityList : R[]
   * - entity : R
   * - loading : boolean
   * - error : string
   * - success : boolean
   * It will provide the following methods:
   * - getEntityById(id: string) : R
   * - getEntityList() : R[]
   * - createEntity(entity: T) : R
   * - updateEntity(entity: T) : R
   * 
   * this will handle all the events of the subclass (after load, create, update, delete)
   */
  
  // Common input parameters for CRUD components
  @Input() id?: string;
  @Input() modeName: string = 'detail';
  @Input() menuCreationHint?: string = '';

  ngOnInit(): void {
    // Enable CRUD operations
    this.canCreate = false;
    this.canEdit = true;
    this.canDelete = false;

    // Set the initial mode
    this.setModeFromName(this.modeName);
 
    // Load the entity if an ID is provided
    //debugger
    if (this.id) {
      this.loadEntityById(this.id).then(entity => {
        this.entity = entity;
        this.setModeFromName(this.modeName); // Show details of the loaded student
      });
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    // Handle ID changes
    if (changes['id'] && this.id) {
      console.log('Loading student with ID:', this.id);
      this.loadEntityById(this.id).then(entity => {
        this.entity = entity;
        this.switchToDetailMode(); // Show details of the loaded student
      }).catch(error => {
        console.error('Error loading student by ID:', error);
        // Fallback is rerouting to route /advocate-dashboard/students
        this.router.navigate(['/advocate-dashboard/students']);
      });
    }
  }

  // Inject services using inject() function for standalone components
  protected hcclService = inject(HcclService);
  protected router = inject(Router);
  protected hcclContextService = inject(HcclContextService);


  // Properties
  protected entity: R | null = null;
  protected entityNew: R | null = null;
  public abstract  newEmptyWrapper(): R ;
  /**
   * Get current entity with guaranteed result
   * @returns ClStudentCrudWrapper instance, creates empty one if none exists
   */
  public getCurrentEntity(): R {
    // If in create mode, use entityNew
    if (this.isCreateMode && this.entityNew) {
      return this.entityNew;
    }
    
    // Otherwise use the current entity
    if (this.currentEntity) {
      return this.currentEntity;
    }
    
    return this.newEmptyWrapper();
  }
  
  
  protected loading: boolean = false;
  protected messages: SimpleMessageList = { messages: [] };
  protected success: boolean = false;

  protected CRUD_MODES = CRUD_MODES;

  protected isCrudModeCUD(): boolean {
    return this.currentMode === CRUD_MODES.EDIT || this.currentMode === CRUD_MODES.CREATE 
    || this.currentMode === CRUD_MODES.DELETE || this.currentMode === CRUD_MODES.DETAIL;
  }

  // Improved mode management system
  protected supportedModes: CrudModeType[] = [
    CRUD_MODES.EDIT,
    CRUD_MODES.CREATE,
    CRUD_MODES.DETAIL,
    CRUD_MODES.DELETE,
    CRUD_MODES.SECTION,
    CRUD_MODES.HEADING,
    CRUD_MODES.FK,
    CRUD_MODES.FK_MENU
    ];
  protected currentMode: CrudModeType | null = null;

  public get isCreateMode(): boolean {
    return this.currentMode === CRUD_MODES.CREATE;
  }
  public get isEditMode(): boolean {
    return this.currentMode === CRUD_MODES.EDIT;
  }
  public get isDetailMode(): boolean {
    return this.currentMode === CRUD_MODES.DETAIL;
  }
  public get isDeleteMode(): boolean {
    return this.currentMode === CRUD_MODES.DELETE;
  }
  public get isSectionMode(): boolean {
    return this.currentMode === CRUD_MODES.SECTION;
  }
  public get isHeadingMode(): boolean {
    return this.currentMode === CRUD_MODES.HEADING;
  }
  public get isFkMode(): boolean {
    return this.currentMode === CRUD_MODES.FK;
  }
  protected switchToCreateMode(): void {
    if (!this.entityNew) {
      this.entityNew = this.newEmptyWrapper();
    }
    this.prepareCreateMode().then(() => {
      this.setMode(this.CRUD_MODES.CREATE);
    });
  }
  protected  async prepareMenus(entity: R): Promise<void> {
    return Promise.resolve();
  }

  protected async prepareCreateMode(): Promise<void> {
    var entity: R = this.entityNew || this.newEmptyWrapper();
    await this.prepareMenus(entity);
    return Promise.resolve();
  }
  protected switchToEditMode(): void {
    this.prepareEditMode().then(() => {
      this.setMode(this.CRUD_MODES.EDIT);
    });
  }

  // create a method that 
  protected setEntityProperty(property: string, value: any): void {
    var entity: R = this.getEntityForSet();
    if (entity) {
      entity[property] = value;
    }
  }

  public getEntityForSet(): R {
    var data: R;
    if (this.isCreateMode && this.entityNew) {
       data = this.entityNew;
    } else {
      const entity = this.getCurrentEntity();
       data = entity;
    }
    return data;
  }

  protected async prepareEditMode(): Promise<void> {
    var entity: R = this.entity || this.newEmptyWrapper();
    await this.prepareMenus(entity);
    return Promise.resolve();
  }
  protected switchToDeleteMode(): void {
    this.setMode(this.CRUD_MODES.DELETE);
  }
  protected switchToDetailMode(): void {  
    this.setMode(this.CRUD_MODES.DETAIL);
  }

  protected supportingDelete: boolean = false;
  protected supportingCreate: boolean = false;
  protected supportingEdit: boolean = false;

  // Getter/setter properties for CRUD operations
  public get canCreate(): boolean {
    return this.supportingCreate;
  }

  public set canCreate(value: boolean) {
    this.supportingCreate = value;
  }

  public get canEdit(): boolean {
    return this.supportingEdit;
  }

  public set canEdit(value: boolean) {
    this.supportingEdit = value;
  }

  public get canDelete(): boolean {
    return this.supportingDelete;
  }

  public set canDelete(value: boolean) {
    this.supportingDelete = value;
  }

  // Abstract methods that subclasses must implement
 
  protected async loadEntityById(id: string): Promise<R> {
    try {
      return await this.loadEntityByIdCall(id);
    } catch (error) {
      console.error('Error loading ' + this.getEntityType() + ' by ID:', error);
      throw error;
    }
  }
  protected abstract loadEntityByIdCall(id: string): Promise<R>;

  protected  createEntityData(entity: R): Promise<R> {
    try {
      const createdStudent = this.createEntityDataCall(entity)
      return createdStudent;
    } catch (error) {
      console.error('Error creating  ' + this.getEntityType() + ' ', error);
      throw error;
    }
  }
  protected abstract createEntityDataCall(entity: R): Promise<R>;
  
  protected  updateEntityData(entity: R): Promise<R> {
    try {
      const updatedStudent = this.updateEntityDataCall(entity)
      return updatedStudent;
    } catch (error) {
      console.error('Error updating  ' + this.getEntityType() + ' ', error);
      throw error;
    }
  }
  protected abstract updateEntityDataCall(entity: R): Promise<R>;

  protected abstract deleteEntityData(id: string): Promise<boolean>;

  // Pre-operation handlers for validation and preparation
  // These are called before the respective operation starts
  // Use these for validation, data preparation, or pre-operation setup
  protected async preCreate(): Promise<void> {
    await this.validateCreateFormData();
  }
  protected async preUpdate(): Promise<void> {
    await this.validateUpdateFormData();
  }
  protected async preDelete(): Promise<void> {
    return Promise.resolve();
  }

  // Form validation methods that subclasses can override
  // These provide default validation behavior for create and update operations
  protected async validateCreateFormData(): Promise<void> {
    return Promise.resolve();
  }
  protected async validateUpdateFormData(): Promise<void> {
    return Promise.resolve();
  }

  // Event handlers that subclasses can override
  // These are called immediately after the respective operation completes
  // Use these for custom business logic, UI updates, or other custom actions
  protected onAfterLoad(): void {}
  protected onAfterCreate(): void {
    this.entityNew = null;

  }
  protected onAfterUpdate(): void {
    this.entity = null;
    this.switchToDetailMode
  }
  protected onAfterDelete(): void {}
  protected onError(error: string): void {}
  

  // Post operation handlers for cleanup and finalization
  // These are called after the event handlers as part of the final workflow
  // Use these for cleanup tasks, state resets, or finalization logic
   // Override post operation handlers for custom behavior
   abstract getEntityType(): string;
   protected  postSave(): void {
    console.log(this.getEntityType() + ' saved successfully');
  }

  protected  postDelete(): void {
    console.log(this.getEntityType() + ' deleted successfully');
  }

  protected  postCreate(): void {
    console.log(this.getEntityType() + ' created successfully');
  }
  // New mode management methods
  /**
   * Get the list of supported modes for this component
   * @returns Array of supported mode names
   */
  public getSupportedModes(): CrudModeType[] {
    return [...this.supportedModes];
  }

  /**
   * Check if a mode is supported by this component
   * @param modeName The mode name to check
   * @returns True if the mode is supported
   */
  public isModeSupported(modeName: string | CrudModeType): boolean {
    return this.supportedModes.includes(modeName as CrudModeType);
  }

  /**
   * Get the current mode
   * @returns The current mode or null if no mode is set
   */
  public getMode(): CrudModeType | null {
    return this.currentMode;
  }

  /**
   * Set the current mode
   * @param mode The mode to set
   * @throws Error if the mode is not supported
   */
  public setMode(mode: CrudModeType): void {
    if (!this.isModeSupported(mode)) {
      throw new Error(`Mode '${mode}' is not supported. Supported modes are: ${this.supportedModes.join(', ')}`);
    }
    this.currentMode = mode;
  }

  /**
   * Set the mode from a mode name string
   * @param modeName The mode name string
   * @throws Error if the mode name is invalid or not supported
   */
  public setModeFromName(modeName: string | CrudModeType): void {
    if (!this.isModeSupported(modeName)) {
      throw new Error(`Mode '${modeName}' is not supported. Supported modes are: ${this.supportedModes.join(', ')}`);
    }
    this.setMode(modeName as CrudModeType);
  }

  /**
   * Get the current mode as a boolean (for backward compatibility)
   * @param modeName The mode name to check
   * @returns True if the current mode matches the given mode name
   */
  public getModeFromName(modeName: string | CrudModeType): boolean {
    return this.currentMode === modeName;
  }

  /**
   * Gets entity by ID
   * @param id The entity ID
   * @returns The entity or null if not found
   */
  public async getEntityById(id: string): Promise<R | null> {
    try {
      this.loading = true;
      this.messages = { messages: [] };
      this.entity = await this.loadEntityById(id);
      this.onAfterLoad();
      return this.entity;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.messages = { 
        messages: [{ 
          messageCode: 'UnknownError', 
          message: errorMessage, 
          severity: 1 
        }] 
      };
      this.onError(errorMessage);
      return null;
    } finally {
      this.loading = false;
    }
  } 

  /**
   * Creates a new entity
   * @param entity The entity to create
   * @returns The created entity
   */
  public async createEntity(entity: R): Promise<R | null> {
    try {
      this.loading = true;
      this.messages = { messages: [] };
      this.success = false;
      
      // Call pre-create handler for validation and preparation
      this.preCreate();
      
      const createdEntity = await this.createEntityData(entity);
      this.entity = createdEntity;
      this.success = true;
      this.onAfterCreate();
      this.postCreate();
      
      return createdEntity;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.messages = { 
        messages: [{ 
          messageCode: 'UnknownError', 
          message: errorMessage, 
          severity: 1 
        }] 
      };
      this.onError(errorMessage);
      return null;
    } finally {
      this.loading = false;
    }
  }

  /**
   * Updates an existing entity
   * @param entity The entity to update
   * @returns The updated entity
   */
  public async updateEntity(entity: R): Promise<R | null> {
    try {
      this.loading = true;
      this.messages = { messages: [] };
      this.success = false;
      
      // Call pre-update handler for validation and preparation
      this.preUpdate();
      
      const updatedEntity = await this.updateEntityData(entity);
      this.entity = updatedEntity;
      this.success = true;
      this.onAfterUpdate();
      this.postSave();
      
      return updatedEntity;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.messages = { 
        messages: [{ 
          messageCode: 'UnknownError', 
          message: errorMessage, 
          severity: 1 
        }] 
      };
      this.onError(errorMessage);
      return null;
    } finally {
      this.loading = false;
    }
  }

  /**
   * Deletes an entity by ID
   * @param id The entity ID to delete
   * @returns True if successful, false otherwise
   */
  public async deleteEntity(id: string): Promise<boolean> {
    try {
      this.loading = true;
      this.messages = { messages: [] };
      this.success = false;
      
      // Call pre-delete handler for validation and preparation
      await this.preDelete();
      
      const deleted = await this.deleteEntityData(id);
      if (deleted) {
        this.success = true;
        this.onAfterDelete();
        this.postDelete();
      }
      
      return deleted;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.messages = { 
        messages: [{ 
          message: errorMessage, 
          messageCode: 'UnknownError',
          severity: 1 
        }] 
      };
      this.onError(errorMessage);
      return false;
    } finally {
      this.loading = false;
    }
  }

  // Getters for template access
  public get isLoading(): boolean {
    return this.loading;
  }

  public get hasError(): boolean {
    return this.messages.messages?.some(msg => msg.severity === 1) || false;
  }

  public get errorMessage(): string {
    const errorMessages = this.messages.messages?.filter(msg => msg.severity === 1) || [];
    return errorMessages.map(msg => msg.message).join('; ');
  }

  public get isSuccess(): boolean {
    return this.success;
  }

  public get currentEntity(): R | null {
    return this.entity;
  }

}
