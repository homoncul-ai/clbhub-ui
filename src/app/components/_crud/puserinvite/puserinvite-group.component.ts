import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { PUserInviteCrudWrapper, PUserInviteCrudComponent } from '@app/components/_crud/puserinvite/puserinvite-crud.component';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { PUserInviteListComponent } from '@app/components/_crud/puserinvite/puserinvite-list.component';

@Component({
  selector: 'app-puserinvite-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, PUserInviteCrudComponent, PUserInviteListComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './puserinvite-group.component.html'
})
export class PUserInviteGroupComponent extends AbstractEntityGroupComponent<PUserInviteCrudWrapper> implements OnInit {
  constructor() {
    super();
  }

  protected newCrudWrapperForCreate(): PUserInviteCrudWrapper {
    return PUserInviteCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<PUserInviteCrudWrapper> {
    return PUserInviteCrudWrapper.newInstance(id, this.hcclService);
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
