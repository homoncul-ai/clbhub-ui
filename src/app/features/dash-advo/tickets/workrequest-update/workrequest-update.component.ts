import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HcclService } from '@app/restsvc/hccl.service';
import { WorkRequestCrudWrapper, WorkrequestCrudComponent } from '@app/components/_crud/workrequest-crud/workrequest-crud.component';
import { SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { CRUD_MODES } from '@app/@core/constants';

@Component({
  selector: 'app-workrequest-update',
  imports: [CommonModule, SimpleTabsetComponent, WorkrequestCrudComponent],
  templateUrl: './workrequest-update.component.html',
  styleUrl: './workrequest-update.component.scss'
})
export class WorkrequestUpdateComponent implements OnInit  {
  @Input() id!: string;

  protected entity!: WorkRequestCrudWrapper ;
  protected CRUD_MODES = CRUD_MODES;
  private route = inject(ActivatedRoute);
  private hcclService = inject(HcclService);

  async ngOnInit(): Promise<void> {
    this.entity = await WorkRequestCrudWrapper.newInstance(this.id, this.hcclService);
  }
}
