import { Component, OnInit } from '@angular/core';
import { AbstractMultimodeComponent } from '@app/components/_global/abstract-multimode/abstract-multimode.component';
import { WorkRequestItemCrudWrapper } from './workrequestitem-crud.component';
import { SimpleMessage } from '@app/restsvc/common-request-service.model';

@Component({
  selector: 'app-workrequestitem-requestrfi',
  imports: [],
  templateUrl: './workrequestitem-requestrfi.component.html',
  styleUrl: '../../_global/abstract-crud/abstract-crud.component.scss'
})
export class WorkrequestitemRequesRFIComponent extends AbstractMultimodeComponent<WorkRequestItemCrudWrapper> implements OnInit  {
  
  // Properties referenced in template
  acceptText: string = '';
  availableQueues: any[] = [];

  override async ngOnInit(): Promise<void> {
    alert("WorkrequestUpdateComponent ngOnInit " + this.id);
    console.log('WorkrequestUpdateComponent ngOnInit');
    this.entity = await WorkRequestItemCrudWrapper.newInstance(this.id, this.hcclService);
    //
    this.localModes = ['createNew', 'reroute'];
    super.ngOnInit();
  }

  protected override async prepareModeEntry(entity: WorkRequestItemCrudWrapper, mode: string): Promise<void> {
    super.prepareModeEntry(entity, mode);
    console.log('WorkrequestUpdateComponent ngOnInit ' + this.entity.dump);
    if (mode === 'accept') {
      // Create show a text area.
    } else if (mode === 'reroute') {
      // show a list of queues to reroute to.
    }
    return Promise.resolve();
  }

  

}
