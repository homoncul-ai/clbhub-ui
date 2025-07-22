import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractEntityGroupComponent } from '../../_global/abstract-entity-group/abstract-entity-group.component';
import { WorkRequestItemGETData, HcclService } from '../../../restsvc/hccl.service';
import { WorkRequestItemCrudWrapper } from './workrequestitem-crud.component';
import { WorkRequestItemCrudComponent } from './workrequestitem-crud.component';
import { SimpleTabsetComponent } from '../../_global/simple-tabset/simple-tabset.component';
import { SimpleTab } from '../../_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-workrequestitem-group',
  templateUrl: './workrequestitem-group.component.html',
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  imports: [CommonModule, TranslateModule, SimpleTabsetComponent, WorkRequestItemCrudComponent],
  standalone: true
})
export class WorkRequestItemGroupComponent extends AbstractEntityGroupComponent<WorkRequestItemCrudWrapper> {
  @Input() id?: string;
  
  constructor() {
    super();
  }

  protected async loadEntityById(id: string): Promise<WorkRequestItemCrudWrapper> {
    const workRequestItemData = await this.hcclService.getWorkRequestItemById(id).toPromise();
    if (!workRequestItemData) {
      throw new Error('WorkRequestItem not found');
    }
    return new WorkRequestItemCrudWrapper(workRequestItemData, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return [
      new SimpleTab('details', 'Details', '/details', () => {}, () => {}),
      new SimpleTab('create', 'Create', '/create', () => {}, () => {}),
      new SimpleTab('debug', 'Debug', '/debug', () => {}, () => {}),
      new SimpleTab('fk_menu', 'FK Menu', '/fk_menu', () => {}, () => {})
    ];
  }

  protected getEntityType(): string {
    return 'WorkRequestItem';
  }

  protected getBaseRoute(): string {
    return '/ecoadmin-dashboard/workrequestitems';
  }
} 