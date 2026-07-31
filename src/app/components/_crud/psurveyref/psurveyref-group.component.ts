import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { PSurveyRefCrudWrapper, PSurveyRefCrudComponent } from '@app/components/_crud/psurveyref/psurveyref-crud.component';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { ADMIN_SURVEYS_MANAGE_BASE } from '@app/features/surveys/survey-registry';

@Component({
  selector: 'app-psurveyref-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, PSurveyRefCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './psurveyref-group.component.html',
})
export class PSurveyRefGroupComponent
  extends AbstractEntityGroupComponent<PSurveyRefCrudWrapper>
  implements OnInit
{
  constructor() {
    super();
  }

  protected override getBaseRoute(): string {
    return ADMIN_SURVEYS_MANAGE_BASE;
  }

  protected newCrudWrapperForCreate(): PSurveyRefCrudWrapper {
    return PSurveyRefCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<PSurveyRefCrudWrapper> {
    return PSurveyRefCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return this.setupListDetailsTabs();
  }
}
