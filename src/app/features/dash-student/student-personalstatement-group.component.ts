// This template is for generating a GROUP component  
// This was generated using entityName = PersonalStatement
// Generate the new personalstatement-group.component.ts   files using this template 

import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { PersonalStatementCrudWrapper, PersonalStatementCrudComponent } from '@app/components/_crud/personalstatement/personalstatement-crud.component';
import { HcclService, PersonalStatementResumeGETData } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { StudentPersonalStatementSearchComponent } from './student-personalstatement-search.component';
import { StudentPersonalStatementResearchComponent } from './student-personalstatement-research.component';
import { StudentPersonalStatementResumeListComponent } from './student-personalstatement-resume-list.component';
import { CreateResumeModalComponent } from './create-resume-modal.component';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';

@Component({
  selector: 'app-student-personalstatement-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, PersonalStatementCrudComponent, StudentPersonalStatementSearchComponent, StudentPersonalStatementResearchComponent, StudentPersonalStatementResumeListComponent],
  styleUrl: '../../components/_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: 'student-personalstatement-group.component.html',
})
export class StudentPersonalStatementGroupComponent extends AbstractEntityGroupComponent<PersonalStatementCrudWrapper> implements OnInit {  

  protected resume: PersonalStatementResumeGETData | null = null;
  protected modalService = inject(MdbModalService);

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): PersonalStatementCrudWrapper {
    return PersonalStatementCrudWrapper.newInstanceForCreate(this.hcclService);
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

    tab = new SimpleTab('resumes', 'Resumes', '', 
      () => {
        this.router.navigate([baseRoute, this.id, 'resumes']);
      },
      () => {
        return this.entity !== null;
      }
    );
    tabs.push(tab);

    tab = new SimpleTab('resume', this.getResumeTabLabel(), '', 
      () => {
        this.router.navigate([baseRoute, this.id, 'resume', this.childId]);
      },
      () => {
        return this.currentTabId === 'resume' && this.childId !== null && this.childId !== undefined && this.childId !== '';
      }
    );
    tabs.push(tab);
     
    return tabs;
  }

  protected getResumeTabLabel(): string {
    return this.resume?.title ? `Resume: ${this.resume.title}` : 'Resume';
  }

  protected override async loadEntityById(id: string): Promise<PersonalStatementCrudWrapper> {
    const entity = await PersonalStatementCrudWrapper.newInstance(id, this.hcclService);
    return entity;
  }

  protected override calculateTabIds(): void {
    let tabId = this.calculateTabIdFromUrl(this.tabId);
 
    var id = this.id;
    if (tabId === 'create') {
      this.currentTabId = 'create';
      this.showingTabset = true;
      this.entity = this.newCrudWrapperForCreate();
    } else if (!id) {
      this.setupIfNoId();
    } else {
      this.currentTabId = tabId;
      this.loadEntityById(id).then(entity => {
        this.entity = entity;
        this.tabs = this.setupTabs();
        const defaultTabId = this.getDefaultTabId();
        // Check to see if the tabId is a valid tab
        if (!this.tabs.find(tab => tab.id === tabId)) {
          tabId = defaultTabId;
        }

        const finalTabId = tabId || defaultTabId;
        this.currentTabId = finalTabId;
        
        // If we're on the resume tab, load the resume data
        if (this.currentTabId === 'resume' && this.childId) {
          this.loadResumeById(this.childId);
        }
      }).catch(error => {
        console.error('Error loading :', error);
      });
    }
  }

  protected async loadResumeById(resumeId: string): Promise<void> {
    this.hcclService.getPersonalStatementResumeById(resumeId).subscribe({
      next: (resume) => {
        this.resume = resume;
        this.tabs = this.setupTabs(); // Refresh tabs to update label
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading resume:', error);
      }
    });
  }

  openCreateResumeModal(): void {
    const modalRef = this.modalService.open(CreateResumeModalComponent, {
      modalClass: 'modal-lg',
      backdrop: true,
      keyboard: true,
      ignoreBackdropClick: false
    });

    modalRef.component.personalStatementId = this.id;

    modalRef.onClose.subscribe((result) => {
      if (result && result.success) {
        // Refresh the component to show the new resume
        this.refreshComponent();
      }
    });
  }

  protected getResumeCriteria(): any {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true,
      personalStatmentId: this.id
    };
  }

  protected getResumeRowClickBehavior(): OnRowClickBehavior {
    const o = new OnRowClickBehavior();
    o.parentId = this.id;
    o.tabId = 'resume';
    o.usingNavigateUrl = true;
    o.getNavigateUrl = (entityId: string, baseRoute: string): any[] => {
      return [baseRoute, this.id, 'resume', entityId];
    };
    return o;
  }

  /**
   * Get search type from route query parameters
   */
  getSearchTypeFromRoute(): string {
    return this.route.snapshot.queryParams['searchType'] || '';
  }
}
