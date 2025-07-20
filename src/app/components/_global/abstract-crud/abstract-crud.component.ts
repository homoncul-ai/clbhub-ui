import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EntityWrapper } from '../../../models/crud-entity-wrapper';
import { CLStudentPOSTData, HcclService, HcclUserContextGETData, MenuControlDataList, SimpleMessageList } from '../../../restsvc/hccl.service';
import { HcclContextService } from '../../../shell/services/hccl-context.service';
import { CRUD_MODES, CrudModeType } from '../../../@core/constants';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-abstract-crud',
  standalone: true,
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule],
  templateUrl: './abstract-crud.component.html',
  styleUrl: './abstract-crud.component.scss'
})
export abstract class AbstractCrudComponent<R extends EntityWrapper<any>> implements OnInit {
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

  protected ngOnInitInternal(): void {
    this.ngOnInit()
  }
  ngOnInit(): void {
    // Enable CRUD operations
    this.canCreate = false;
    this.canEdit = true;
    this.canDelete = false;

 
    // Some modes required load, some don't 
    // CREATE, FK_MENU, DEBUG, dont require load
    // DETAIL, EDIT, DELETE, SECTION, HEADING, FK do
    console.log("modeName: " + this.modeName + " id: " + this.id + " entityType: " + this.getEntityType());
    if (!this.id && this.modeName == 'detail') {
     //this.switchToCreateMode();
     this.modeName = CRUD_MODES.CREATE;
    }

    switch (this.modeName) {
      case CRUD_MODES.CREATE:
        this.switchToCreateMode();
        break;
      case CRUD_MODES.FK_MENU:
        this.switchToFkMenuMode();
        break;
      case CRUD_MODES.DEBUG:
        this.setMode(this.CRUD_MODES.DEBUG);
        //this.switchToDebugMode();
        break;
      case CRUD_MODES.DETAIL:
        this.switchToDetailMode();
        break;
      case CRUD_MODES.EDIT:
        this.switchToEditMode();
        break;
      case CRUD_MODES.DELETE:
        this.switchToDeleteMode();
        break;  
      case CRUD_MODES.SECTION:
      case CRUD_MODES.HEADING:
      case CRUD_MODES.FK:
        if (this.id && this.modeName) {
          this.loadEntityById(this.id).then(entity => {
            this.entity = entity;
            this.setModeFromName(this.modeName);
          });
        } else {
          this.switchToDetailMode();
        }
      break;

      default:
        this.switchToDetailMode();
        break;
    }
    // if (this.id) {
    //   this.loadEntityById(this.id).then(entity => {
    //     this.entity = entity;
    //   });
    // } else {
    //   alert("setting createMode")
    //   this.setMode(this.CRUD_MODES.CREATE);
    // }
    // // Set the initial mode
    // this.setModeFromName(this.modeName);

  }


  ngOnChanges(changes: SimpleChanges): void {
    // Handle ID changes
    // if (changes['id'] && this.id) {
    //   console.log('Loading student with ID:', this.id);
    //   this.loadEntityById(this.id).then(entity => {
    //     this.entity = entity;
    //     this.switchToDetailMode(); // Show details of the loaded student
    //   }).catch(error => {
    //     console.error('Error loading ' + this.getEntityType() + ' by ID:', error);
    //     // Fallback is rerouting to the list route
    //     const baseRoute = this.getBaseRoute();
    //     this.router.navigate([baseRoute]);
    //   });
    // }
  }

  // Inject services using inject() function for standalone components
  protected hcclService = inject(HcclService);
  protected router = inject(Router);
  protected route = inject(ActivatedRoute);
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
    
    // If still loading, return empty wrapper
    if (this.loading) {
      return this.newEmptyWrapper();
    }
    
    // Otherwise use the current entity
    if (this.currentEntity) {
      return this.currentEntity;
    }
    
    // If we have an ID but no entity, we might still be loading
    if (this.id && !this.currentEntity) {
      return this.newEmptyWrapper();
    }
    
    //alert(this.getEntityType() + " No entity found id=" + this.id);
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
    CRUD_MODES.FK_MENU,
    CRUD_MODES.DEBUG
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
  public get isFkMenuMode(): boolean {
    return this.currentMode === CRUD_MODES.FK_MENU;
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
  protected switchToFkMenuMode(): void {
    this.prepareFkMenuMode().then(() => {
      this.setMode(this.CRUD_MODES.FK_MENU);
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

  public fkMenu : MenuControlDataList | null = null;
  protected async prepareFkMenuMode(): Promise<void> {
    this.entity  = this.entity || this.newEmptyWrapper();
    this.fkMenu = await this.entity.getFkMenu(this.menuCreationHint, null);
    if (this.id) {
      this.entity.setSelectedOption(this.fkMenu, this.id)
    }
    return Promise.resolve();
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
    if (this.id == null) {
      this.router.navigate([this.getBaseRoute()]);
    }
    this.prepareDetailMode().then(() => {
    this.setMode(this.CRUD_MODES.DETAIL);
  });
  }
  
  protected async prepareDetailMode(): Promise<void> {
    if (this.id) {
      this.loadEntityById(this.id).then(entity => {
        this.entity = entity;
        this.prepareMenus(entity);
      });
    }
    return Promise.resolve();
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
      this.loading = true;
      return await this.loadEntityByIdCall(id);
    } catch (error) {
      console.error('Error loading ' + this.getEntityType() + ' by ID:', error);
      throw error;
    } finally {
      this.loading = false; 
    } 
  }
  protected abstract loadEntityByIdCall(id: string): Promise<R>;

  protected  createEntityData(entity: R): Promise<R> {
    try {
      const createdStudent = this.createEntityDataCall(entity);
      return createdStudent;
    } catch (error) {
      console.error('Error creating  ' + this.getEntityType() + ' ', error);
      throw error;
    }
  }
  
  protected abstract deleteEntityData(id: string): Promise<boolean>;

  // Pre-operation handlers for validation and preparation
  // These are called before the respective operation starts
  // Use these for validation, data preparation, or pre-operation setup
  protected async  preCreate(entity: R): Promise<void> {
    await this.validateCreateFormData(entity);
  }
  protected async preUpdate(): Promise<void> {
    await this.validateUpdateFormData();
  }
  protected async preDelete(): Promise<void> {
    return Promise.resolve();
  }

  // Form validation methods that subclasses can override
  // These provide default validation behavior for create and update operations
  protected async validateCreateFormData(entity: R): Promise<void> {
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
    this.entityNew = this.newEmptyWrapper();

  }
  protected onAfterUpdate(): void {
    this.entity = null;
    this.switchToDetailMode()
  }
  protected onAfterDelete(): void {}
  protected onError(error: string): void {}
  

  // Post operation handlers for cleanup and finalization
  // These are called after the event handlers as part of the final workflow
  // Use these for cleanup tasks, state resets, or finalization logic
   // Override post operation handlers for custom behavior
   protected  postSave(): void {
    console.log(this.getEntityType() + ' saved successfully');
    this.switchToDetailMode();
  }

  protected  postDelete(): void {
    console.log(this.getEntityType() + ' deleted successfully');
  }

  /**
   * Calculate the base route for the current entity type
   * @returns The base route path for navigation
   */
  protected getBaseRoute(): string {
    // Get the current URL segments
    const urlSegments = this.router.url.split('/').filter(segment => segment.length > 0);
    
    // Find the dashboard type (advocate-dashboard, broker-dashboard, etc.)
    const dashboardIndex = urlSegments.findIndex(segment => segment.includes('-dashboard'));
    if (dashboardIndex === -1) {
      // Fallback to ecoadmin-dashboard if no dashboard found
      return '/ecoadmin-dashboard';
    }
    
    const dashboardType = urlSegments[dashboardIndex];
    
    // Find the entity route (the segment after the dashboard)
    const entityRouteIndex = dashboardIndex + 1;
    if (entityRouteIndex >= urlSegments.length) {
      // If no entity route found, return dashboard
      return `/${dashboardType}`;
    }
    
    // Get the entity route (e.g., 'providertyperefs', 'clstudents', etc.)
    const entityRoute = urlSegments[entityRouteIndex];
    
    // Remove any trailing segments like 'create', 'details', etc. to get the base route
    // This handles cases where we're on a route like /dashboard/entity/create
    const baseRoute = `/${dashboardType}/${entityRoute}`;
    
    return baseRoute;
  }

  protected  postCreate(): void {
    console.log(this.getEntityType() + ' created successfully');
    // Calculate the route dynamically and navigate to the detail mode
    const baseRoute = this.getBaseRoute();
    console.log('Current URL:', this.router.url);
    console.log('Calculated base route:', baseRoute);
    console.log('Navigating to:', [baseRoute, this.id, 'details']);
    this.router.navigate([baseRoute, this.id, 'details']);
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
    }
  } 


  protected  async createEntityDataCall(entity: R): Promise<any> {
    return Promise.resolve(entity);
  }

  /**
   * Creates a new entity
   * @param entity The entity to create
   * @returns The created entity
   */
  public async createEntity(entityIn?: R): Promise<R | null> {
    try {
      this.messages = { messages: [] };
      this.success = false;

      const entity = entityIn || this.entityNew || this.newEmptyWrapper();
      

      // Call pre-create handler for validation and preparation
      this.preCreate(entity);
      const createResponse = await this.createEntityDataCall(entity);
      this.id = createResponse.id;
      // triggers load.
      this.switchToDetailMode();

      this.onAfterCreate();
      this.postCreate();

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
    } 
  }



  protected async updateEntityDataCall(entity: R): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Updates an existing entity
   * @param entity The entity to update
   * @returns The updated entity
   */
  public async updateEntity(entity: R): Promise<R | null> {
    try {
      this.messages = { messages: [] };
      this.success = false;
      
      // Call pre-update handler for validation and preparation
      this.preUpdate();
      
      await this.updateEntityDataCall(entity);
      this.success = true;
      this.onAfterUpdate();
      this.postSave();
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
    }
  }

  /**
   * Deletes an entity by ID
   * @param id The entity ID to delete
   * @returns True if successful, false otherwise
   */
  public async deleteEntity(id: string): Promise<boolean> {
    try {
      this.messages = { messages: [] };
      this.success = false;
      
      // Call pre-delete handler for validation and preparation
      await this.preDelete();
      
      await this.deleteEntityData(id);
      
      return true;
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
  public dump(): string {
    return JSON.stringify(this.entity, null, 2);
  }

  protected entityType: string = '';
  public  getEntityType(): string {
    return this.entityType;
  }
}
