// This template is for generating a GROUP component  
// This was generated using entityName = HcclOrganization
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclOrganizationCrudWrapper, HcclOrganizationCrudComponent } from '@app/components/_crud/hcclorganization/hcclorganization-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-[entityname]-display',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, [EntityName]GETData],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  template: ' [put reasonable display of content here]',
})
export class [EntityName]DisplayComponent  implements OnInit {  
  @Input() id!: string;
 
  constructor() {
    super();    
  }
 
  protected async loadEntityById(id: string): Promise<[EntityName]GETData> {
    return this.hcclService.get[EntityName]ById(id);
  }
 
} 