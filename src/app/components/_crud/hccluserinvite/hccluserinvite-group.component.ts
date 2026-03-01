import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclUserInviteCrudWrapper, HcclUserInviteCrudComponent } from '@app/components/_crud/hccluserinvite/hccluserinvite-crud.component';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { HcclUserInviteListComponent } from '@app/components/_crud/hccluserinvite/hccluserinvite-list.component';

@Component({
  selector: 'app-hccluserinvite-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, HcclUserInviteCrudComponent, HcclUserInviteListComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './hccluserinvite-group.component.html'
})
export class HcclUserInviteGroupComponent extends AbstractEntityGroupComponent<HcclUserInviteCrudWrapper> implements OnInit {
  constructor() {
    super();
  }

  protected newCrudWrapperForCreate(): HcclUserInviteCrudWrapper {
    return HcclUserInviteCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<HcclUserInviteCrudWrapper> {
    return HcclUserInviteCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }

  protected override setupIfNoId(): void {
    this.currentTabId = 'list';
    this.showingTabset = true;
    this.entity = null;
    this.tabs = this.setupTabs();
  }
}
