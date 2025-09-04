import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HcclService } from '@app/restsvc/hccl.service';
import { PersonalStatementCrudWrapper } from '@app/components/_crud/personalstatement/personalstatement-crud.component';
import { AbstractMultimodeComponent } from '@app/components/_global/abstract-multimode/abstract-multimode.component';

@Component({
  selector: 'app-student-personalstatement-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-personalstatement-search.component.html',
  styleUrl: '../../components/_global/abstract-crud/abstract-crud.component.scss'
})
export class StudentPersonalStatementSearchComponent extends AbstractMultimodeComponent<PersonalStatementCrudWrapper> implements OnInit  {
  
  // Properties referenced in template
  error: any = null;

  override async ngOnInit(): Promise<void> {
    super.ngOnInit();
    console.log('PersonalStatementSearchComponent ngOnInit');
    this.entity = await PersonalStatementCrudWrapper.newInstance(this.id, this.hcclService);
    this.localModes = ['mode1', 'mode2'];
    this.loading = false;
  }

  protected override async prepareModeEntry(entity: PersonalStatementCrudWrapper, mode: string): Promise<void> {
    super.prepareModeEntry(entity, mode);
    console.log('PersonalStatementSearchComponent prepareModeEntry ' + this.entity.dump);
    return Promise.resolve();
  }
}
