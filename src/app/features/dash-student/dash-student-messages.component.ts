// This template is for generating a GROUP component  
// This was generated using entityName = HcclUserProfile
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclUserProfileCrudWrapper } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { HcclService, PMessageCriteria, PMessageGETData } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { PMessageListComponent } from '@app/components/_crud/pmessage/pmessage-list.component';
import { PMessageUiComponent } from '@app/components/_crud/pmessage-ui/pmessage-ui.component';
import { Subject, takeUntil } from 'rxjs';

/**
 * Custom OnRowClickBehavior that calls a callback instead of navigating
 */
class InlinePanelRowClickBehavior extends OnRowClickBehavior {
  private callback: (entityId: string) => void;

  constructor(callback: (entityId: string) => void) {
    super();
    this.doNotNavigate = true;
    this.callback = callback;
  }

  override onRowClick(entityId: string, baseRoute: string, router: Router): void {
    console.log('InlinePanelRowClickBehavior.onRowClick called with entityId:', entityId);
    this.callback(entityId);
  }
}

@Component({
  selector: 'app-dash-student-messages',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, PMessageListComponent, PMessageUiComponent],
  styleUrl: './dash-student-messages.component.scss',
  templateUrl: './dash-student-messages.component.html',
})
export class DashStudentMessagesComponent extends AbstractEntityGroupComponent<HcclUserProfileCrudWrapper> implements OnInit, OnDestroy, OnChanges {  

  @Input() messageId: string = '';
  @ViewChild('messagePanel') messagePanel!: ElementRef;
  
  private pmessage: PMessageGETData | null = null;
  private destroy$ = new Subject<void>();
  
  // Track selected message for inline panel display
  selectedMessageId: string = '';

  constructor() {
    super();    
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['messageId'] && changes['messageId'].currentValue) {
      this.selectedMessageId = changes['messageId'].currentValue;
      this.scrollToPanel();
    }
  }

  override ngOnInit(): void {
    
    // For singleton behavior, always use current user profile ID
    this.hcclContextService.refreshContext().subscribe(context => {
      this.defaultId = context.currentUserProfileId || '';
      this.id = this.defaultId;
      this.organizationId = context.currentUserProfile.organizationId || '';
      // Call parent ngOnInit after setting the ID
      super.ngOnInit();
      
      // If messageId was passed as input, set it as selected
      if (this.messageId) {
        this.selectedMessageId = this.messageId;
        setTimeout(() => this.scrollToPanel(), 100);
      }
    });
  }

  protected override calculateTabIdFromUrl(tabId_in: string): string {
    let tabId = tabId_in;
    tabId = this.tabId;
    return tabId;
  }

  protected override populateFromParams(params: any): void {
    super.populateFromParams(params);
    const routeMessageId = this.route.snapshot.params['messageId'];
    if (routeMessageId) {
      this.messageId = routeMessageId;
      this.selectedMessageId = routeMessageId;
    }
  }

  protected organizationId : string = '';
  protected getOrganizationId(): string {
    return this.organizationId;  
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

  protected setupTabs(): SimpleTab[] {
    const baseRoute = this.getBaseRoute();
    var tabs: SimpleTab[] = [
      new SimpleTab('messages', 'Messages', '', 
        () => {
          this.router.navigate([baseRoute]);
        },
        () => {
          return true;
        }
      )];
   
    return tabs;
  }

  protected override getDefaultTabId(): string {
    return 'messages';
  }

  /**
   * Handle message row click - show panel below and scroll to it
   */
  private onMessageSelected(messageId: string): void {
    this.selectedMessageId = messageId;
    this.messageId = messageId;
    
    // Allow Angular to render the panel, then scroll to it
    setTimeout(() => this.scrollToPanel(), 50);
  }

  /**
   * Scroll to the message panel smoothly
   */
  private scrollToPanel(): void {
    if (this.messagePanel?.nativeElement) {
      this.messagePanel.nativeElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }

  /**
   * Close the message panel
   */
  closeMessagePanel(): void {
    this.selectedMessageId = '';
    this.messageId = '';
  }
 
  protected onMessageRowClickBehavior(): OnRowClickBehavior {
    return new InlinePanelRowClickBehavior((entityId: string) => {
      this.onMessageSelected(entityId);
    });
  }

  protected onMessageRowClickBehavior1(): OnRowClickBehavior   {
    var x: OnRowClickBehavior =  new OnRowClickBehavior();
    x.parentId = this.id;
    x.tabId = 'message';
  //  x.alertMessage = 'Message';

    x.getNavigateUrl = (id: string) => {
      //return [this.getBaseRoute(),  id, 'message'];
      return ['student-dashboard', 'messages', id, 'message'];
    };
    return x;
  }

  getPMessageCriteria(): PMessageCriteria {
    return {
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }
}
