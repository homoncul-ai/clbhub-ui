// This template is for generating a GROUP component  
// This was generated using entityName = PMessage
// Generate the new pmessage-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { PMessageCrudWrapper, PMessageCrudComponent } from '@app/components/_crud/pmessage/pmessage-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-pmessage-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, PMessageCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './pmessage-group.component.html',
})
export class PMessageGroupComponent extends AbstractEntityGroupComponent<PMessageCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): PMessageCrudWrapper {
    return PMessageCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<PMessageCrudWrapper> {
    return PMessageCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

} 
