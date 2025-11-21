import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { StudentResumeEntriesListComponent } from './student-resumeentries-list.component';
import { StudentResumeEntryDetailsComponent } from './student-resumeentry-details.component';
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { CreateResumeEntryModalComponent } from './create-resume-entry-modal.component';

@Component({
  selector: 'app-student-resumeentry-group',
  standalone: true,
  imports: [
    CommonModule,
    SimpleTabsetComponent,
    StudentResumeEntriesListComponent,
    StudentResumeEntryDetailsComponent
  ],
  styleUrl: '../../components/_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './student-resumeentry-group.component.html',
})
export class StudentResumeEntryGroupComponent implements OnInit {
  protected route = inject(ActivatedRoute);
  protected router = inject(Router);
  protected modalService = inject(MdbModalService);

  protected tabs: SimpleTab[] = [];
  protected currentTabId: string = '';
  protected showingTabset: boolean = true;
  protected resumeEntryId: string | null = null;

  constructor() {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.resumeEntryId = params['id'] || null;
      this.calculateTabIds();
    });
    
    // Also subscribe to route changes to handle navigation
    this.route.url.subscribe(() => {
      this.calculateTabIds();
    });
  }

  protected setupTabs(): SimpleTab[] {
    const tabs: SimpleTab[] = [];
    const baseRoute = this.getBaseRoute();

    // Resume Entries list tab
    const listTab = new SimpleTab(
      'list',
      'Resume Entries',
      '',
      () => {
        this.router.navigate([baseRoute]);
      },
      () => {
        return true; // Always show
      }
    );
    tabs.push(listTab);

    // Resume Entry Details tab
    const detailsTab = new SimpleTab(
      'details',
      'Resume Entry Details',
      '',
      () => {
        if (this.resumeEntryId) {
          this.router.navigate([baseRoute, this.resumeEntryId, 'details']);
        }
      },
      () => {
        return this.currentTabId === 'details' && this.resumeEntryId !== null && this.resumeEntryId !== undefined && this.resumeEntryId !== '';
      }
    );
    tabs.push(detailsTab);

    return tabs;
  }

  protected calculateTabIdFromUrl(): string {
    const urlSegments = this.router.url.split('/').filter(segment => segment.length > 0);
    
    // URL structure: /student-dashboard/resumeentries or /student-dashboard/resumeentries/:id/:tabId
    const resumeEntriesIndex = urlSegments.indexOf('resumeentries');
    
    if (resumeEntriesIndex >= 0) {
      // We're on the resumeentries route
      const segmentsAfter = urlSegments.slice(resumeEntriesIndex + 1);
      
      if (segmentsAfter.length === 0) {
        return 'list'; // Just /resumeentries
      } else if (segmentsAfter.length === 1) {
        // We have an ID, default to details
        this.resumeEntryId = segmentsAfter[0];
        return 'details';
      } else if (segmentsAfter.length >= 2) {
        // We have an ID and a tabId
        this.resumeEntryId = segmentsAfter[0];
        return segmentsAfter[1]; // Return the tabId
      }
    }
    
    return 'list'; // Default to list
  }

  protected calculateTabIds(): void {
    const tabId = this.calculateTabIdFromUrl();
    this.currentTabId = tabId;
    this.tabs = this.setupTabs();
  }

  protected getBaseRoute(): string {
    return '/student-dashboard/resumeentries';
  }

  protected getResumeEntryRowClickBehavior(): OnRowClickBehavior {
    const o = new OnRowClickBehavior();
    o.tabId = 'details';
    o.usingNavigateUrl = true;
    o.getNavigateUrl = (entityId: string, baseRoute: string): any[] => {
      return [baseRoute, entityId, 'details'];
    };
    return o;
  }

  openCreateResumeEntryModal(): void {
    const modalRef = this.modalService.open(CreateResumeEntryModalComponent, {
      modalClass: 'modal-lg',
      backdrop: true,
      keyboard: true,
      ignoreBackdropClick: false
    });

    modalRef.onClose.subscribe((result) => {
      if (result && result.success) {
        // Refresh the page to show the new resume entry
        window.location.reload();
      }
    });
  }
}

