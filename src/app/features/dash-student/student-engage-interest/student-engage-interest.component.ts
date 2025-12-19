import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, inject } from '@angular/core';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global';
import { HcclService, CatalogEntryInterestGETData, PMessageGETData, CatalogEntryGETData } from '@app/restsvc/hccl.service';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclUserProfileCrudWrapper } from '../../dash-ecoadmin/orgs/org-school-staff-crud.component';
import { CatalogEntryInterestCrudComponent, CatalogEntryInterestCrudWrapper } from '@app/components/_crud/catalogentryinterest/catalogentryinterest-crud.component';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PMessageCrudComponent } from '@app/components/_crud/pmessage/pmessage-crud.component';
import { PMessageUiComponent } from '@app/components/_crud/pmessage-ui/pmessage-ui.component';
import { CatalogEntryCrudComponent } from '@app/components/_crud/catalogentry/catalogentry-crud.component';
@Component({
  selector: 'app-student-engage-interest',
  standalone: true,
  imports: [SimpleTabsetComponent, CatalogEntryInterestCrudComponent, CommonModule, PMessageUiComponent, CatalogEntryCrudComponent],
  templateUrl: './student-engage-interest.component.html',
  styleUrl: './student-engage-interest.component.scss'
})
export class StudentEngageInterestComponent 
implements OnInit, OnDestroy, OnChanges {
  @Input() interestId: string = '';

  private hcclService = inject(HcclService);
  private destroy$ = new Subject<void>();
  
  protected interestGETData: CatalogEntryInterestGETData | null = null;
  protected entryGETData: CatalogEntryGETData | null = null;
  protected messageId: string = '';

  constructor() {
   // super();    
  }

  ngOnInit(): void {
    this.loadInterestData(); 
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Reload data when interestId input changes
    if (changes['interestId'] && !changes['interestId'].firstChange) {
      this.loadInterestData();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  private loadInterestData(): void {
    if (!this.interestId) return;
    
    this.hcclService.getCatalogEntryInterestById(this.interestId)
      .subscribe({
        next: (data) => {
          this.interestGETData = data;
          this.entryGETData = data.catalogEntry || null;
          this.messageId = data.messageId || '';
          // Setup tabs after data is loaded
          this.setupTabs();
        },
      });
  }
  
  protected showingTabset: boolean = false;
  protected currentTabId: string = '';
  protected tabs: SimpleTab[] = [];
  protected setupTabs(): SimpleTab[] {
    var tabs: SimpleTab[] = [
      new SimpleTab('details', 'Details', '', 
        () => {
          // Open up the details tab, showing
          // <app-catalogentryinterest-crud [id]="interestId" modeName="details"></app-catalogentryinterest-crud>
          this.currentTabId = 'details';
        },
        () => {
          return true;
        }
      )];
      
      // Show if the 
      var signupInfoTab = new SimpleTab('signupInfo', "Signup Information", '', 
        () => {
          this.currentTabId = 'signupInfo';
        },
        () => {
          return this.entryGETData?.signupPacketId !== null;
        }
      );
      tabs.push(signupInfoTab);

      var messageTab = new SimpleTab('message', "Message", '', 
        () => {
         // alert("message id: " + this.messageId);
          this.currentTabId = 'message';
        },
        () => {
          return this.messageId !== '' && this.messageId !==  null;
        }
      );
      tabs.push(messageTab);
      
      this.tabs = tabs;
      this.showingTabset = true;
      this.currentTabId = this.getDefaultTabId();
   
    return tabs;
  }

  protected   getDefaultTabId(): string {
    return 'details';
  }
  

}
