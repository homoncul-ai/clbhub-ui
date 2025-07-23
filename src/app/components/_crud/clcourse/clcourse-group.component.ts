// This template is for generating a GROUP component  
// This was generated using entityName = CLCourse
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { CLCourseCrudWrapper, CLCourseCrudComponent } from '@app/components/_crud/clcourse/clcourse-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-clcourse-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, CLCourseCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './clcourse-group.component.html',
})
export class CLCourseGroupComponent extends AbstractEntityGroupComponent<CLCourseCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): CLCourseCrudWrapper {
    return CLCourseCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<CLCourseCrudWrapper> {
    return CLCourseCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

} 