import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclUserProfileCrudWrapper } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { HcclService, PMessageCriteria, PMessageGETData, HcclUserInviteCriteria } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { PMessageListComponent } from '@app/components/_crud/pmessage/pmessage-list.component';
import { PMessageUiComponent } from '@app/components/_crud/pmessage-ui/pmessage-ui.component';
import { HcclUserInviteListComponent } from '@app/components/_crud/hccluserinvite/hccluserinvite-list.component';
import { Subject, takeUntil } from 'rxjs';

class InlinePanelRowClickBehavior extends OnRowClickBehavior {
  private callback: (entityId: string) => void;

  constructor(callback: (entityId: string) => void) {
    super();
    this.doNotNavigate = true;
    this.callback = callback;
  }

  override onRowClick(entityId: string, baseRoute: string, router: Router): void {
    this.callback(entityId);
  }
}

@Component({
  selector: 'app-dash-provider-messages',
  standalone: true,
  imports: [CommonModule, MdbAccordionModule, PMessageListComponent, PMessageUiComponent, HcclUserInviteListComponent],
  styleUrl: './dash-provider-messages.component.scss',
  templateUrl: './dash-provider-messages.component.html',
})
export class DashProviderMessagesComponent extends AbstractEntityGroupComponent<HcclUserProfileCrudWrapper> implements OnInit, OnDestroy, OnChanges {

  @Input() messageId: string = '';
  @ViewChild('messagePanel') messagePanel!: ElementRef;

  private pmessage: PMessageGETData | null = null;
  private destroy$ = new Subject<void>();

  selectedMessageId: string = '';
  selectedMessageTitle: string = '';

  override loading = true;
  private openAccordionId: string = 'invitations';

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
      this.loadMessageTitle(changes['messageId'].currentValue);
      this.scrollToPanel();
    }
  }

  private loadMessageTitle(messageId: string): void {
    this.selectedMessageTitle = 'Loading...';
    this.hcclService.getPMessageById(messageId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (message) => {
          this.selectedMessageTitle = message.title || 'Message Details';
        },
        error: () => {
          this.selectedMessageTitle = 'Message Details';
        }
      });
  }

  override ngOnInit(): void {
    this.hcclContextService.refreshContext().subscribe(context => {
      this.defaultId = context.currentUserProfileId || '';
      this.id = this.defaultId;
      this.organizationId = context.currentUserProfile.organizationId || '';
      super.ngOnInit();
      this.loading = false;

      if (this.messageId) {
        this.selectedMessageId = this.messageId;
        this.loadMessageTitle(this.messageId);
        this.openAccordionId = 'messages';
        setTimeout(() => this.scrollToPanel(), 100);
      }
    });
  }

  protected override calculateTabIdFromUrl(tabId_in: string): string {
    return this.tabId;
  }

  protected override populateFromParams(params: any): void {
    super.populateFromParams(params);
    const routeMessageId = this.route.snapshot.params['messageId'];
    if (routeMessageId) {
      this.messageId = routeMessageId;
      this.selectedMessageId = routeMessageId;
    }
  }

  protected organizationId: string = '';
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
    return [
      new SimpleTab('messages', 'Messages', '',
        () => { this.router.navigate([baseRoute]); },
        () => true
      )
    ];
  }

  protected override getDefaultTabId(): string {
    return 'messages';
  }

  private onMessageSelected(messageId: string): void {
    this.selectedMessageId = messageId;
    this.messageId = messageId;
    this.loadMessageTitle(messageId);
    setTimeout(() => this.scrollToPanel(), 50);
  }

  private scrollToPanel(): void {
    if (this.messagePanel?.nativeElement) {
      this.messagePanel.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  closeMessagePanel(): void {
    this.selectedMessageId = '';
    this.messageId = '';
    this.selectedMessageTitle = '';
  }

  protected onMessageRowClickBehavior(): OnRowClickBehavior {
    return new InlinePanelRowClickBehavior((entityId: string) => {
      this.onMessageSelected(entityId);
    });
  }

  isAccordionCollapsed(accordionId: string): boolean {
    return this.openAccordionId !== accordionId;
  }

  openAccordion(accordionId: string): void {
    this.openAccordionId = accordionId;
  }

  getInviteCriteria(): HcclUserInviteCriteria {
    return {
      inviteeId: this.id,
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  getPMessageCriteria(): PMessageCriteria {
    return {
      participantUserProfileId: this.id,
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }
}
