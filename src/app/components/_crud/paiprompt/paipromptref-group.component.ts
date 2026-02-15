import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { PAIPromptCrudWrapper, PAIPromptCrudComponent } from '@app/components/_crud/paiprompt/paiprompt-crud.component';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { PAIPromptRefListComponent } from '@app/components/_crud/paiprompt/paipromptref-list.component';

@Component({
  selector: 'app-paipromptref-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, PAIPromptCrudComponent, PAIPromptRefListComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './paipromptref-group.component.html',
})
export class PAIPromptRefGroupComponent extends AbstractEntityGroupComponent<PAIPromptCrudWrapper> implements OnInit {
  constructor() {
    super();
  }

  protected newCrudWrapperForCreate(): PAIPromptCrudWrapper {
    return PAIPromptCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<PAIPromptCrudWrapper> {
    return PAIPromptCrudWrapper.newInstance(id, this.hcclService);
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
