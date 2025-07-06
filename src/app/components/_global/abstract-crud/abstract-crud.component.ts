import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EntityWrapper } from '../../../models/crud-entity-wrapper';
import { HcclService } from '../../../restsvc/hccl.service';
import { HcclContextService } from '../../../shell/services/hccl-context.service';
import { CRUD_MODES, CrudModeType } from '../../../@core/constants';

@Component({
  selector: 'app-abstract-crud',
  imports: [],
  templateUrl: './abstract-crud.component.html',
  styleUrl: './abstract-crud.component.scss'
})
export abstract class AbstractCrudComponent<T extends EntityWrapper<any>, R extends EntityWrapper<any>> {
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

  // Inject services using inject() function for standalone components
  protected hcclService = inject(HcclService);
  protected router = inject(Router);
  protected hcclContextService = inject(HcclContextService);


  // Properties
  protected entity: R | null = null;
  protected entityNew: R | null = null;
  protected loading: boolean = false;
  protected error: string = '';
  protected success: boolean = false;

  protected CRUD_MODES = CRUD_MODES;

  protected isCrudModeCUD(): boolean {
    return this.currentMode === CRUD_MODES.EDIT || this.currentMode === CRUD_MODES.CREATE || this.currentMode === CRUD_MODES.DELETE;
  }

  // Improved mode management system
  protected supportedModes: CrudModeType[] = [
    CRUD_MODES.EDIT,
    CRUD_MODES.CREATE,
    CRUD_MODES.VIEW,
    CRUD_MODES.DETAIL,
    CRUD_MODES.DELETE,
    CRUD_MODES.SECTION,
    CRUD_MODES.HEADING,
    CRUD_MODES.FK
  ];
  protected currentMode: CrudModeType | null = null;

  public get isCreateMode(): boolean {
    return this.currentMode === CRUD_MODES.CREATE;
  }
  public get isEditMode(): boolean {
    return this.currentMode === CRUD_MODES.EDIT;
  }
  public get isViewMode(): boolean {
    return this.currentMode === CRUD_MODES.VIEW;
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
  protected switchToEditMode(): void {
    this.setMode(this.CRUD_MODES.EDIT);
  }
  protected switchToCreateMode(): void {
    this.setMode(this.CRUD_MODES.CREATE);
  }
  protected switchToViewMode(): void {  
    this.setMode(this.CRUD_MODES.VIEW);
  }
  protected switchToDeleteMode(): void {
    this.setMode(this.CRUD_MODES.DELETE);
  }
  protected switchToDetailMode(): void {  
    this.setMode(this.CRUD_MODES.DETAIL);
  }

  protected supportingDelete: boolean = false;
  protected supportingCreate: boolean = false;
  protected supportingUpdate: boolean = false;

  // Getter/setter properties for CRUD operations
  public get canCreate(): boolean {
    return this.supportingCreate;
  }

  public set canCreate(value: boolean) {
    this.supportingCreate = value;
  }

  public get canUpdate(): boolean {
    return this.supportingUpdate;
  }

  public set canUpdate(value: boolean) {
    this.supportingUpdate = value;
  }

  public get canDelete(): boolean {
    return this.supportingDelete;
  }

  public set canDelete(value: boolean) {
    this.supportingDelete = value;
  }

  // Abstract methods that subclasses must implement
  protected abstract loadEntityById(id: string): Promise<R>;
  protected abstract createEntityData(entity: T): Promise<R>;
  protected abstract updateEntityData(entity: T): Promise<R>;
  protected abstract deleteEntityData(id: string): Promise<boolean>;

  // Event handlers that subclasses can override
  protected onAfterLoad(): void {}
  protected onAfterCreate(): void {}
  protected onAfterUpdate(): void {}
  protected onAfterDelete(): void {}
  protected onError(error: string): void {}

  // Post operation handlers
  protected postSave(): void {}
  protected postDelete(): void {}
  protected postCreate(): void {}

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
      this.error = '';
      this.entity = await this.loadEntityById(id);
      this.onAfterLoad();
      return this.entity;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Unknown error occurred';
      this.onError(this.error);
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
  public async createEntity(entity: T): Promise<R | null> {
    try {
      this.loading = true;
      this.error = '';
      this.success = false;
      
      const createdEntity = await this.createEntityData(entity);
      this.entity = createdEntity;
      this.success = true;
      this.onAfterCreate();
      this.postCreate();
      
      return createdEntity;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Unknown error occurred';
      this.onError(this.error);
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
  public async updateEntity(entity: T): Promise<R | null> {
    try {
      this.loading = true;
      this.error = '';
      this.success = false;
      
      const updatedEntity = await this.updateEntityData(entity);
      this.entity = updatedEntity;
      this.success = true;
      this.onAfterUpdate();
      this.postSave();
      
      return updatedEntity;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Unknown error occurred';
      this.onError(this.error);
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
      this.error = '';
      this.success = false;
      
      const deleted = await this.deleteEntityData(id);
      if (deleted) {
        this.success = true;
        this.onAfterDelete();
        this.postDelete();
      }
      
      return deleted;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Unknown error occurred';
      this.onError(this.error);
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
    return this.error !== '';
  }

  public get errorMessage(): string {
    return this.error;
  }

  public get isSuccess(): boolean {
    return this.success;
  }

  public get currentEntity(): R | null {
    return this.entity;
  }

}
