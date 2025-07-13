import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { EntityWrapper } from '../../../models/crud-entity-wrapper';
import { HcclService, SimpleMessageList } from '@app/restsvc/hccl.service';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { CRUD_MODES, CrudModeType } from '../../../@core/constants';

@Component({
  selector: 'app-abstract-multimode',
  imports: [],
  templateUrl: './abstract-multimode.component.html',
  styleUrl: './abstract-multimode.component.scss'
})
export abstract class AbstractMultimodeComponent <R extends EntityWrapper<any>>  {
  
  @Input() id!: string;
  @Input() modeName!: string;

  protected entity!: R ;

  protected CRUD_MODES = CRUD_MODES;

  ngOnInit(): void {
    
    this.enterMode(this.modeName);

    // Load the entity if an ID is provided
    //if (!this.id){alert("mode name: " + this.modeName + " " + this.getEntityType() + ' CrudComponent :  No ID provided');}

    if (this.id) {
      // this.loadEntityById(this.id).then(entity => {
      //   this.entity = entity;
      //   this.switchToMode(this.modeName);
      // });
    }
  }

  protected localModes: string[] = [];
  protected hcclService = inject(HcclService);
  protected router = inject(Router);
  protected hcclContextService = inject(HcclContextService);
  protected messages: SimpleMessageList = { messages: [] };
  protected currentMode: string = ''; 


  public canEnterMode(mode: string): boolean {  
    if (this.isValidMode(mode)) {
      return true;
    }
    return false;
  }

  public isValidMode(mode: string): boolean {
    return this.localModes.includes(mode);
  }

  public enterMode(mode: string): void {
    this.prepareModeEntry(this.entity, mode).then(() => {
      this.currentMode = mode;
    });
  }

  // protected async loadEntityById(id: string): Promise<R> {
  //   try {
  //     return await this.loadEntityByIdCall(id);
  //   } catch (error) {
  //     console.error('Error loading ' + this.entity.getEntityType() + ' by ID:', error);
  //     throw error;
  //   }
  // }
  // protected abstract loadEntityByIdCall(id: string): Promise<R>;

   
  protected  async prepareModeEntry(entity: R, mode: string): Promise<void> {
    this.messages.messages = [];
    return Promise.resolve();
  }
}