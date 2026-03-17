// This template is for generating a GROUP component  
// This was generated using entityName = PersonalStatement
// Generate the new personalstatement-group.component.ts   files using this template 

import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { PersonalStatementCrudWrapper } from '@app/components/_crud/personalstatement/personalstatement-crud.component';
import { CatalogEntryInterestCriteria, CatalogEntryInterestGETData, HcclAddrCriteria, HcclAddrGETData, HcclService, PersonalStatementResumeGETData } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { StudentPersonalStatementSearchComponent } from './student-personalstatement-search.component';
import { StudentPersonalStatementEngageComponent } from './student-personalstatement-engage.component';
import { StudentPersonalStatementResumeListComponent } from './student-personalstatement-resume-list.component';
import { CreateResumeModalComponent } from './create-resume-modal.component';
import { StudentPersonalStatementResumeComponent } from './student-personalstatement-resume.component';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { StudentPersonalStatementDetailsComponent } from "./student-personalstatement-details.component";
import { MapAddrUiComponent } from '@app/components/_crud/map-addr-ui/map-addr-ui.component';

@Component({
  selector: 'app-student-personalstatement-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent,
    StudentPersonalStatementSearchComponent, StudentPersonalStatementEngageComponent, 
    StudentPersonalStatementResumeListComponent, StudentPersonalStatementResumeComponent, 
    StudentPersonalStatementDetailsComponent, MapAddrUiComponent],
  styleUrl: '../../components/_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: 'student-personalstatement-group.component.html',
})
export class StudentPersonalStatementGroupComponent extends AbstractEntityGroupComponent<PersonalStatementCrudWrapper> implements OnInit {  

  protected resume: PersonalStatementResumeGETData | null = null;
  protected modalService = inject(MdbModalService);
  protected engageMapCriteria: HcclAddrCriteria | null = null;

  constructor() {
    super();    
  }

  protected newCrudWrapperForCreate(): PersonalStatementCrudWrapper {
    return PersonalStatementCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    var tabs: SimpleTab[] = [];
    const baseRoute = this.getBaseRoute();
      var tab  =     
      new SimpleTab('details', this.getDetailsTabLabel(), '', 
        () => {
          //this.currentTabId = 'details';
          this.router.navigate([baseRoute, this.id, 'details']);
        },
        () => {
          return this.entity !== null;
        }
      );
     tabs.push(tab);
      tab =  new SimpleTab('search', 'Search', '', 
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
      // tab = new SimpleTab('messages', 'Messages', '', 
      //   () => {
      //     this.router.navigate([baseRoute, this.id, 'messages']);
      //   },
      //   () => {
      //     return this.entity !== null;
      //   }
      // );
      // tabs.push(tab);
      
       tab =  new SimpleTab('engage', 'Engage', '', 
        () => {
          //this.currentTabId = 'items';
          this.router.navigate([baseRoute, this.id, 'engage']);          
        },
        () => {
          return this.entity !== null;
        }
      );
      tabs.push(tab) 

      tab =  new SimpleTab('engage-map', 'Engage Map', '',
        () => {
          this.router.navigate([baseRoute, this.id, 'engage-map']);
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

  protected override calculateTabIdFromUrl(tabId_in: string): string {
    // Check if we're on a resume route by examining URL segments
    const urlSegments = this.router.url.split('/').filter(segment => segment.length > 0);
    
    // If the second-to-last segment is 'resume', we're on the resume tab
    // URL structure: /baseRoute/personalStatementId/resume/resumeId
    if (urlSegments.length >= 2) {
      const secondToLast = urlSegments[urlSegments.length - 2];
      if (secondToLast === 'resume') {
        // Extract the resume ID (childId) from the last segment
        const resumeId = urlSegments[urlSegments.length - 1];
        if (resumeId && resumeId !== 'resume') {
          this.childId = resumeId;
        }
       // alert("resume :" + this.childId + " " + this.router.url);
        return 'resume';
      }
    }
    
    // Otherwise use the default logic
    return super.calculateTabIdFromUrl(tabId_in);
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
      this.updateEngageMapCriteria(id);
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

  getInterestCriteria(): CatalogEntryInterestCriteria {
    return {
      personalStatementId: this.id,
      interestRangeMin: 1,
      interestRangeMax: 11
    };
  }

  private updateEngageMapCriteria(id: string): void {

    // Get the catalog entry interests, then go through each 
    //  catalogEntry.HcclAddrIds for each catalog entry 
    // then set the mapCriteria.ids to the HcclAddrIds
    const criteria: CatalogEntryInterestCriteria = this.getInterestCriteria();
    criteria.optionalDataHint = 'all';

    this.hcclService.findCatalogEntryInterests(criteria).subscribe({
      next: (catalogEntryInterests) => {
        this.engageMapCriteria = {
          ids: [],
          pageNumber: 1,
          pageSize: 500,
          isPaging: true
        };
        catalogEntryInterests.searchResults?.forEach((catalogEntryInterest: CatalogEntryInterestGETData) => {
          if (catalogEntryInterest.catalogEntry?.hcclAddrId) {
            
            this.engageMapCriteria?.ids?.push(catalogEntryInterest.catalogEntry?.hcclAddrId);
          } else if (catalogEntryInterest.catalogEntry?.catalog?.organization?.hcclAddrId) {
            this.engageMapCriteria?.ids?.push(catalogEntryInterest.catalogEntry?.catalog?.organization?.hcclAddrId);
          }
          //alert('entity:' + JSON.stringify(catalogEntryInterest.catalogEntry?.catalog?.organization) );

        });
      },
      error: (error) => {
        console.error('Error getting catalog entry interests:', error);
      }
    });
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
    //o.alertMessage = 'Resume list: onRowClick called with resumeId: ' + this.id + ' ' + this.router.url;
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

  onEngageMapPinClick(addr: HcclAddrGETData): void {
    console.log('Engage map pin clicked:', addr);
  }
}
