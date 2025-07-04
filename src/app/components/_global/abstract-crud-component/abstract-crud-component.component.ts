import { Component } from '@angular/core';
import { EntityWrapper } from '../../../models/crud-entity-wrapper';

@Component({
  selector: 'app-abstract-crud-component',
  imports: [],
  templateUrl: './abstract-crud-component.component.html',
  styleUrl: './abstract-crud-component.component.scss'
})
export abstract class AbstractCrudComponentComponent<T extends EntityWrapper<any>, R extends EntityWrapper<any>> {
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

  // Properties
  protected entityList: R[] = [];
  protected entity: R | null = null;
  protected loading: boolean = false;
  protected error: string = '';
  protected success: boolean = false;

  // Mode management properties
  protected editMode: boolean = false;
  protected createMode: boolean = false;
  protected viewMode: boolean = false;
  protected detailMode: boolean = false;
  protected deleteMode: boolean = false;
  protected sectionMode: boolean = false;
  protected headingMode: boolean = false;

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

  /**
   * Switch to edit mode
   */
  public switchToEditMode(): void {
    this.resetModes();
    this.editMode = true;
  }

  /**
   * Switch to create mode
   */
  public switchToCreateMode(): void {
    this.resetModes();
    this.createMode = true;
  }

  /**
   * Switch to view mode
   */
  public switchToViewMode(): void {
    this.resetModes();
    this.viewMode = true;
  }

  /**
   * Switch to detail mode
   */
  public switchToDetailMode(): void {
    this.resetModes();
    this.detailMode = true;
  }

  /**
   * Switch to delete mode
   */
  public switchToDeleteMode(): void {
    this.resetModes();
    this.deleteMode = true;
  }

  /**
   * Switch to section mode
   */
  public switchToSectionMode(): void {
    this.resetModes();
    this.sectionMode = true;
  }

  /**
   * Switch to heading mode
   */
  public switchToHeadingMode(): void {
    this.resetModes();
    this.headingMode = true;
  }

  /**
   * Reset all modes to false
   */
  private resetModes(): void {
    this.editMode = false;
    this.createMode = false;
    this.viewMode = false;
    this.detailMode = false;
    this.deleteMode = false;
    this.sectionMode = false;
    this.headingMode = false;
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
   * Gets the entity list
   * @returns Array of entities
   */
  public async getEntityList(): Promise<R[]> {
    try {
      this.loading = true;
      this.error = '';
      this.entityList = await this.loadEntityList();
      this.onAfterLoad();
      return this.entityList;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Unknown error occurred';
      this.onError(this.error);
      return [];
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

  public get entities(): R[] {
    return this.entityList;
  }

  // Mode getters for template access
  public get isEditMode(): boolean {
    return this.editMode;
  }

  public get isCreateMode(): boolean {
    return this.createMode;
  }

  public get isViewMode(): boolean {
    return this.viewMode;
  }

  public get isDetailMode(): boolean {
    return this.detailMode;
  }

  public get isDeleteMode(): boolean {
    return this.deleteMode;
  }

  public get isSectionMode(): boolean {
    return this.sectionMode;
  }

  public get isHeadingMode(): boolean {
    return this.headingMode;
  }
}
