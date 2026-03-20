import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import {
  HcclOrganizationInterestCrudWrapper,
  HcclOrganizationInterestCrudComponent,
} from '@app/components/_crud/hcclorganizationinterest/hcclorganizationinterest-crud.component';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-hcclorganizationinterest-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, HcclOrganizationInterestCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './hcclorganizationinterest-group.component.html',
})
export class HcclOrganizationInterestGroupComponent
  extends AbstractEntityGroupComponent<HcclOrganizationInterestCrudWrapper>
  implements OnInit
{
  constructor() {
    super();
  }

  protected newCrudWrapperForCreate(): HcclOrganizationInterestCrudWrapper {
    return HcclOrganizationInterestCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<HcclOrganizationInterestCrudWrapper> {
    return HcclOrganizationInterestCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }
}
