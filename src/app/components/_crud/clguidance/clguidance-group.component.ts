// This template is for generating a GROUP component  
// This was generated using entityName = CLGuidance
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { CLGuidanceCrudWrapper, CLGuidanceCrudComponent } from '@app/components/_crud/clguidance/clguidance-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-clguidance-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, CLGuidanceCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './clguidance-group.component.html',
})
export class CLGuidanceGroupComponent extends AbstractEntityGroupComponent<CLGuidanceCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): CLGuidanceCrudWrapper {
    return CLGuidanceCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<CLGuidanceCrudWrapper> {
    return CLGuidanceCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

} 