import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CatalogEntryInterestCriteria, HcclService } from '@app/restsvc/hccl.service';
import { PersonalStatementCrudWrapper } from '@app/components/_crud/personalstatement/personalstatement-crud.component';
import { AbstractMultimodeComponent } from '@app/components/_global/abstract-multimode/abstract-multimode.component';
import { CatalogEntryInterestCrudComponent } from "@app/components/_crud/catalogentryinterest/catalogentryinterest-crud.component";
import { CatalogEntryInterestListComponent } from "@app/components/_crud/catalogentryinterest/catalogentryinterest-list.component";

@Component({
  selector: 'app-student-personalstatement-research',
  standalone: true,
  imports: [CommonModule, CatalogEntryInterestCrudComponent, CatalogEntryInterestListComponent],
  templateUrl: './student-personalstatement-research.component.html',
  styleUrl: '../../components/_global/abstract-crud/abstract-crud.component.scss'
})
export class StudentPersonalStatementResearchComponent extends AbstractMultimodeComponent<PersonalStatementCrudWrapper> implements OnInit  {
  
  // Properties referenced in template
  error: any = null;

  override async ngOnInit(): Promise<void> {
    super.ngOnInit();
    console.log('PersonalStatementResearchComponent ngOnInit');
    this.entity = await PersonalStatementCrudWrapper.newInstance(this.id, this.hcclService);
    this.localModes = ['mode1', 'mode2'];
    this.loading = false;
  }

  protected override async prepareModeEntry(entity: PersonalStatementCrudWrapper, mode: string): Promise<void> {
    super.prepareModeEntry(entity, mode);
    console.log('PersonalStatementResearchComponent prepareModeEntry ' + this.entity.dump);
    return Promise.resolve();
  }

  getInterestCriteria(): CatalogEntryInterestCriteria {
    return {
      personalStatementId: this.id,
      interestRangeMin: 5,
      interestRangeMax: 11
    };
  }
}
