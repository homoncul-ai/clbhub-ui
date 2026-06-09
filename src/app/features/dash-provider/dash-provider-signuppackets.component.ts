import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclUserProfileCrudWrapper } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { CatalogEntrySignupPacketCriteria } from '@app/restsvc/hccl.service';
import { SimpleTab } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { CatalogEntrySignupPacketListComponent } from '@app/components/_crud/catalogentrysignuppacket/catalogentrysignuppacket-list.component';
import { CatalogEntrySignupPacketCreateModalComponent } from '@app/components/_crud/catalogentrysignuppacket/catalogentrysignuppacket-create-modal.component';
import { SignupPacketTabsetUiComponent } from '@app/components/_crud/signuppacket-ui/signuppacket-tabset-ui.component';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
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
  selector: 'app-dash-provider-signuppackets',
  standalone: true,
  imports: [CommonModule, MdbAccordionModule, CatalogEntrySignupPacketListComponent, SignupPacketTabsetUiComponent],
  styleUrl: './dash-provider-signuppackets.component.scss',
  templateUrl: './dash-provider-signuppackets.component.html',
})
export class DashProviderSignupPacketsComponent extends AbstractEntityGroupComponent<HcclUserProfileCrudWrapper> implements OnInit, OnDestroy, OnChanges {

  @Input() packetId: string = '';
  @ViewChild('packetPanel') packetPanel!: ElementRef;
  @ViewChild(CatalogEntrySignupPacketListComponent) packetList?: CatalogEntrySignupPacketListComponent;

  private modalService = inject(MdbModalService);
  private destroy$ = new Subject<void>();

  selectedPacketId: string = '';
  selectedPacketTitle: string = '';

  override loading = true;
  private openAccordionId: string = 'signuppackets';

  constructor() {
    super();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['packetId'] && changes['packetId'].currentValue) {
      this.selectedPacketId = changes['packetId'].currentValue;
      this.loadPacketTitle(changes['packetId'].currentValue);
      this.scrollToPanel();
    }
  }

  private loadPacketTitle(packetId: string): void {
    this.selectedPacketTitle = 'Loading...';
    this.hcclService.getCatalogEntrySignupPacketById(packetId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (packet) => {
          this.selectedPacketTitle = packet.name || 'Signup Packet Details';
        },
        error: () => {
          this.selectedPacketTitle = 'Signup Packet Details';
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

      if (this.packetId) {
        this.selectedPacketId = this.packetId;
        this.loadPacketTitle(this.packetId);
        this.openAccordionId = 'signuppackets';
        setTimeout(() => this.scrollToPanel(), 100);
      }
    });
  }

  protected override calculateTabIdFromUrl(tabId_in: string): string {
    return this.tabId;
  }

  protected override populateFromParams(params: any): void {
    super.populateFromParams(params);
    const routePacketId = this.route.snapshot.params['packetId'];
    if (routePacketId) {
      this.packetId = routePacketId;
      this.selectedPacketId = routePacketId;
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
      new SimpleTab('signuppackets', 'Signup Packets', '',
        () => { this.router.navigate([baseRoute]); },
        () => true
      )
    ];
  }

  protected override getDefaultTabId(): string {
    return 'signuppackets';
  }

  private onPacketSelected(packetId: string): void {
    this.selectedPacketId = packetId;
    this.packetId = packetId;
    this.loadPacketTitle(packetId);
    setTimeout(() => this.scrollToPanel(), 50);
  }

  private scrollToPanel(): void {
    if (this.packetPanel?.nativeElement) {
      this.packetPanel.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  closePacketPanel(): void {
    this.selectedPacketId = '';
    this.packetId = '';
    this.selectedPacketTitle = '';
  }

  protected onPacketRowClickBehavior(): OnRowClickBehavior {
    return new InlinePanelRowClickBehavior((entityId: string) => {
      this.onPacketSelected(entityId);
    });
  }

  isAccordionCollapsed(accordionId: string): boolean {
    return this.openAccordionId !== accordionId;
  }

  openAccordion(accordionId: string): void {
    this.openAccordionId = accordionId;
  }

  getSignupPacketCriteria(): CatalogEntrySignupPacketCriteria {
    return {
      organizationId: this.organizationId,
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  /**
   * Refresh the list after a signup packet is edited and saved, and update the
   * inline panel title in case the name changed.
   */
  onPacketSaved(): void {
    this.packetList?.refresh();
    if (this.selectedPacketId) {
      this.loadPacketTitle(this.selectedPacketId);
    }
  }

  /**
   * Open the create modal for a new signup packet. On successful creation,
   * refresh the list so the new packet appears.
   */
  openCreateModal(): void {
    const modalRef = this.modalService.open(CatalogEntrySignupPacketCreateModalComponent, {
      modalClass: 'modal-lg',
    });

    modalRef.onClose.subscribe((result: any) => {
      if (result && result.created) {
        this.packetList?.refresh();
      }
    });
  }
}
