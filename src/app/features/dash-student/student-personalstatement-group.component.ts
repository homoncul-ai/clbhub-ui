// This template is for generating a GROUP component  
// This was generated using entityName = PersonalStatement
// Generate the new personalstatement-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { PersonalStatementCrudWrapper, PersonalStatementCrudComponent } from '@app/components/_crud/personalstatement/personalstatement-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { StudentPersonalStatementSearchComponent } from './student-personalstatement-search.component';
import { StudentPersonalStatementResearchComponent } from './student-personalstatement-research.component';

@Component({
  selector: 'app-student-personalstatement-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, PersonalStatementCrudComponent, StudentPersonalStatementSearchComponent, StudentPersonalStatementResearchComponent],
  styleUrl: '../../components/_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: 'student-personalstatement-group.component.html',
})
export class StudentPersonalStatementGroupComponent extends AbstractEntityGroupComponent<PersonalStatementCrudWrapper> implements OnInit {  

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): PersonalStatementCrudWrapper {
    return PersonalStatementCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<PersonalStatementCrudWrapper> {
    return PersonalStatementCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    var tabs = this.setupListDetailsTabs();
   
    var baseRoute = this.getBaseRoute();
    var tab =  new SimpleTab('search', 'Search', '', 
      () => {
        //this.currentTabId = 'update';
        this.router.navigate([baseRoute, this.id, 'search']);
       // alert("update");
      },
      () => {
        return this.entity !== null;
      }
    );
    tabs.push(tab) 

     tab =  new SimpleTab('research', 'Research', '', 
      () => {
        //this.currentTabId = 'items';
        this.router.navigate([baseRoute, this.id, 'research']);
        
      },
      () => {
        return this.entity !== null;
      }
    );
    tabs.push(tab) 
     
    return tabs;
    return tabs;
  }

  /**
   * Get search type from route query parameters
   */
  getSearchTypeFromRoute(): string {
    return this.route.snapshot.queryParams['searchType'] || '';
  }
}
