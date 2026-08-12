// This template is for generating a GROUP component  
// This was generated using entityName = HcclUserProfile
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclUserProfileCrudWrapper, HcclUserProfileCrudComponent } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { HcclService, PersonalStatementResumeGETData } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { CitizenPersonalStatementResumeListComponent } from './citizen-personalstatement-resume-list.component';
import { DashCitizenResumeComponent } from './dash-citizen-resume.component';
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { A } from 'node_modules/@angular/cdk/activedescendant-key-manager.d-Bjic5obv';
import { PersonalStatementResumeCrudComponent } from '@app/components/_crud/personalstatementresume/personalstatementresume-crud.component';

@Component({
  selector: 'app-dash-citizen-resumes-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, 
    HcclUserProfileCrudComponent, CitizenPersonalStatementResumeListComponent,
    DashCitizenResumeComponent, PersonalStatementResumeCrudComponent],
  styleUrl: '../../components/_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './dash-citizen-resumes-group.component.html',
})
export class DashCitizenResumesGroupComponent 
extends AbstractEntityGroupComponent<HcclUserProfileCrudWrapper> implements OnInit {  

  private resumeTab: SimpleTab | undefined;
  private resume: PersonalStatementResumeGETData | null = null;
  
  constructor() {
    super();    
  }

  override ngOnInit(): void {
    // For singleton behavior, always use current user profile ID
    this.hcclContextService.refreshContext().subscribe(context => {
      this.defaultId = context.currentUserProfileId || '';
      this.id = this.defaultId;
      // Call parent ngOnInit after setting the ID
      super.ngOnInit();
    });
  }
  
  protected defaultId: string = '';
  protected override getDefaultId(): string {
    return this.defaultId;
  }
  protected newCrudWrapperForCreate(): HcclUserProfileCrudWrapper {
    return HcclUserProfileCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<HcclUserProfileCrudWrapper> {
    return HcclUserProfileCrudWrapper.newInstance(id, this.hcclService);
  }
 

  getResumeCriteria(): any {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }



  protected override calculateTabIdFromUrl(tabId_in: string): string {
    let xx = super.calculateTabIdFromUrl(tabId_in);
    // alert('calculateTabIdFromUrl: ' + tabId_in + ' ' + this.tabId + ' ' + this.resumeId + ' ' + xx);

    // let tabId = tabId_in;
    // tabId = this.tabId;
    // alert('tabId: ' + tabId);
    return xx;
  }
  
  protected override populateFromParams(params: any): void {
    super.populateFromParams(params);
    this.resumeId = this.route.snapshot.params['resumeId'];
  }
  
  protected resumeId: string = '';
  protected getResumeId(): string {
    return this.resumeId;
  } 
  protected organizationId : string = '';
  protected getOrganizationId(): string {
    return this.organizationId;  
  }
 

  

  protected setupTabs(): SimpleTab[] {
    const baseRoute = this.getBaseRoute();
    var tabs: SimpleTab[] = [
      new SimpleTab('resumes', 'Resumes', '', 
        () => {
          this.router.navigate([baseRoute]);
        },
        () => {
          return true;
        }
      )];
      var tab = new SimpleTab('details', 'Details', '', 
        () => {
          this.router.navigate([baseRoute, this.resumeId, 'details']);
        },
        () => {
          return this.resumeId !== null && this.resumeId !== '';
        }
      );
      tabs.push(tab);
      this.resumeTab = new SimpleTab('resume', "Resume", '', 
        () => {
          this.router.navigate(['citizen', 'resumes', this.resumeId, 'resume']);
        },
        () => {
          return this.resumeId !== null && this.resumeId !== '';
        }
      );
      tabs.push(this.resumeTab);
      
      // Load resume data if resumeId is available
      if (this.resumeId) {
        this.loadResumeData();
      }
   
    return tabs;
  }

  protected override getDefaultTabId(): string {
    return 'resumes';
  }

  protected onResumeRowClickBehavior(): OnRowClickBehavior   {
    var x: OnRowClickBehavior =  new OnRowClickBehavior();
    x.parentId = this.id;
    x.tabId = 'resume';
    //  x.alertMessage = 'Resume';

    x.getNavigateUrl = (id: string) => {
      return ['citizen', 'resumes', id, 'resume'];
    };
    return x;
  }
   
  private loadResumeData(): void {
    if (!this.resumeId) return;
    
    this.hcclService.getResume(this.resumeId)
      .subscribe({
        next: (data) => {
          this.resume = data;
          this.updateResumeTabLabel();
        },
        error: (err) => {
          console.error('Failed to load resume:', err);
        }
      });
  }

  private updateResumeTabLabel(): void {
    if (this.resumeTab && this.resume?.title) {
      this.resumeTab.label = this.resume.title;
    }
  }

}

