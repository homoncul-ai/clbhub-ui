import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EntityWrapper } from '../../../models/crud-entity-wrapper';
import { HcclService } from '@app/restsvc/hccl.service';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { CRUD_MODES, CrudModeType } from '../../../@core/constants';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { SimpleMessageList } from '@app/restsvc/common-request-service.model';
import { AbstractListComponent } from '../abstract-list/abstract-list.component';

@Component({
  selector: 'app-abstract-multimode',
  standalone: true,
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule],
  templateUrl: './abstract-multimode.component.html',
  styleUrl: './abstract-multimode.component.scss'
})
export abstract class AbstractMultimodeComponent <R extends EntityWrapper<any>> implements OnInit {
  
  @Input() id!: string;
  @Input() childId!: string;
  @Input() modeName!: string;

  protected entity!: R ;

  protected CRUD_MODES = CRUD_MODES;

  protected localModes: string[] = [];
  protected hcclService = inject(HcclService);
  protected router = inject(Router);
  protected hcclContextService = inject(HcclContextService);
  protected messages: SimpleMessageList  = { messages: [] };
  protected currentMode: string = '';
  protected loading: boolean = false;

  async ngOnInit(): Promise<void> {
    this.loading = true;
    try {
      const entity = await this.loadEntityById(this.id);
      this.entity = entity;
    } catch (error) {
      console.error('Error loading entity:', error);
    } finally {
      this.loading = false;
    }
  }

  
  
  public canEnterMode(mode: string): boolean {  
    if (this.isValidMode(mode)) {
      return true;
    }
    return false;
  }

  public isValidMode(mode: string): boolean {
    return this.localModes.includes(mode);
  }
  protected isLoading(): boolean {
    return this.loading;
  }
  public async enterMode(mode: string): Promise<void> {
    this.loading = true;
    try {
      await this.prepareModeEntry(this.entity, mode);
      this.currentMode = mode;
    } catch (error) {
      console.error('Error entering mode:', error);
    } finally {
      this.loading = false;
    }
  }

  protected async loadEntityById(id: string): Promise<R> {
    try {
      return await this.loadEntityByIdCall(id);
    } catch (error) {
      console.error('Error loading ' + this.entity.getEntityType() + ' by ID:', error);
      throw error;
    }
  }
  protected abstract loadEntityByIdCall(id: string): Promise<R>;

   
  protected  async prepareModeEntry(entity: R, mode: string): Promise<void> {
    this.messages.messages = [];
    return Promise.resolve();
  }
  /**
   * Calculate the base route for the current entity type
   * @returns The base route path for navigation
   */
  protected getBaseRoute(): string {
    return AbstractListComponent.extractBaseRoute(this.router.url);
  }

  public routeToPath(routePath: string[]) {
    return AbstractListComponent.routeToPath(this.router, routePath);
  }
}