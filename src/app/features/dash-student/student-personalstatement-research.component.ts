import { Component, Input, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CatalogEntryInterestCriteria, CatalogEntryInterestGETData, HcclService } from '@app/restsvc/hccl.service';
import { PersonalStatementCrudWrapper } from '@app/components/_crud/personalstatement/personalstatement-crud.component';
import { AbstractMultimodeComponent } from '@app/components/_global/abstract-multimode/abstract-multimode.component';
import { CatalogEntryInterestListComponent } from "@app/components/_crud/catalogentryinterest/catalogentryinterest-list.component";
import { OnFinishLoadingBehavior, OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { StudentEngageInterestComponent } from './student-engage-interest/student-engage-interest.component';

@Component({
  selector: 'app-student-personalstatement-research',
  standalone: true,
  imports: [CommonModule, CatalogEntryInterestListComponent, StudentEngageInterestComponent],
  templateUrl: './student-personalstatement-research.component.html',
  styleUrl: '../../components/_global/abstract-crud/abstract-crud.component.scss'
})
export class StudentPersonalStatementResearchComponent extends AbstractMultimodeComponent<PersonalStatementCrudWrapper> implements OnInit  {
  
  // Properties referenced in template
  error: any = null;
  protected interestId: string = '';
  protected cdr = inject(ChangeDetectorRef);

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

  protected async loadEntityByIdCall(id: string): Promise<PersonalStatementCrudWrapper> {
    return PersonalStatementCrudWrapper.newInstance(id, this.hcclService);
  }

  // Methods for interest selection behavior (same as student-engage.component.ts)
  protected getSelectedInterestId(): string {
    return this.interestId;
  }

  protected setSelectedInterestId(interestId: string): void {
    this.interestId = interestId;
    this.cdr.detectChanges(); // Trigger change detection to update child component
  }

  protected onInterestRowClickBehavior(): OnRowClickBehavior {
    var x: OnRowClickBehavior = new OnRowClickBehavior();
    x.parentId = this.id;
    x.tabId = 'interest';
    x.alertMessage = 'Message';
    x.usingNavigateUrl = false;
    x.onRowClick = (id: string) => {
      this.setSelectedInterestId(id);
    };
    return x;
  }

  protected onFinishLoadingBehavior(): OnFinishLoadingBehavior {
    var x: OnFinishLoadingBehavior = new OnFinishLoadingBehavior();
    x.onFinishLoading = (id: string, data: any) => {
      this.setSelectedInterestId(id);
    };
    return x;
  }
}
