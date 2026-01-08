import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclUserProfileCrudWrapper } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { HcclUserContextGETData, WorkQueueGETData, WorkRequestCriteria } from '@app/restsvc/hccl.service';
import { AdvoMessagesComponent } from '../messages/advo-messages.component';
import { WorkRequestListComponent } from '@app/components/_crud/workrequest/workrequest-list.component';
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';

@Component({
  selector: 'app-advo-dash-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, AdvoMessagesComponent, WorkRequestListComponent],
  templateUrl: './advo-dash-group.component.html',
  styleUrl: './advo-dash-group.component.scss'
})
export class AdvoDashGroupComponent extends AbstractEntityGroupComponent<HcclUserProfileCrudWrapper> implements OnInit {

  override ngOnInit(): void {
    // For singleton behavior, always use current user profile ID
    this.hcclContextService.refreshContext().subscribe(context => {
      this.defaultId = context.currentUserProfileId || '';
      this.id = this.defaultId;
      this.setupWorkRequestListBlocks();
      // Call parent ngOnInit after setting the ID
      super.ngOnInit();
      //alert('defaultId ' + this.defaultId);
    });

  }
 

  protected defaultId: string = '';
  protected override getDefaultId(): string {
    return this.defaultId;
  }

  protected newCrudWrapperForCreate(): HcclUserProfileCrudWrapper {
    return HcclUserProfileCrudWrapper.newInstanceForCreate(this.hcclService);
  }

  protected async loadEntityById(id: string): Promise<HcclUserProfileCrudWrapper> {
    return HcclUserProfileCrudWrapper.newInstance(id, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    //debugger
    const baseRoute = this.getBaseRoute();
    return [
      new SimpleTab('home', 'Home', '', 
        () => {
          this.router.navigate([baseRoute]);
        },
        () => {
          return true;
        }
      ),
      new SimpleTab('messages', 'Messages', '', 
        () => {
          //this.currentTabId = 'details';
          this.router.navigate([baseRoute,  'messages']);
        },
        () => {
          return this.entity !== null;
        }
      )];

  }

  protected override getDefaultTabId(): string {
    return 'home';
  }

  protected workRequestListBlocks: WorkRequestListBlock[] = [];

  protected async setupWorkRequestListBlocks(): Promise<WorkRequestListBlock[]> {
    this.workRequestListBlocks = [];
    const queues = await this.hcclContextService.getContext().dashQueues || [];

    // First, inbound tickets 
    for (const queueT of queues) {
      const queue: WorkQueueGETData = queueT as WorkQueueGETData;
      const criteria: WorkRequestCriteria = {
        workQueueId: queue.id,
        currentStateCode: 'initial',
      }

      this.workRequestListBlocks.push(new WorkRequestListBlock(queue?.businessCode || '', '', criteria));
    }

    // Load queues, then get the instructions.
    return this.workRequestListBlocks;
  }

  onClickWorkRequestRow(): OnRowClickBehavior {
    var x: OnRowClickBehavior =  new OnRowClickBehavior();
    //x.alertMessage = 'Ticket';
    x.usingNavigateUrl = true;
    x.getNavigateUrl = (id: string) => {
      return ['/advocate-dashboard/e', 'workrequest', id, 'details'];
    //  return ['/advocate-dashboard', 'workrequests', id, 'update'];
    };
    //x.alertMessage = 'Catalog Entry';
    return x;
  }


  getMyAcceptedOpenTickets(): WorkRequestCriteria {
    return {
      acceptedByUserId: this.hcclContextService.getCurrentUserProfile().userId || ''
    };
  }

}
export class WorkRequestListBlock {
    public title: string = '';
    public criteria: WorkRequestCriteria = {};
    public helptext: string = '';

    constructor(  title: string,   helptext: string,   criteria: WorkRequestCriteria) {
      this.title = title;
      this.criteria = criteria;
      this.helptext = helptext;
    }
  }
