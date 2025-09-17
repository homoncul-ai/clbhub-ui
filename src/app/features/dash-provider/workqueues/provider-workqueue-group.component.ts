import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclUserProfileCrudWrapper } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { HcclUserContextGETData, WorkQueueCriteria, WorkQueueGETData, WorkRequestCriteria } from '@app/restsvc/hccl.service';
import { HcclOrganizationCrudWrapper } from '@app/components/_crud/hcclorganization/hcclorganization-crud.component';
import { WorkRequestListComponent } from '@app/components/_crud/workrequest/workrequest-list.component';
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-provider-workqueue-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, WorkRequestListComponent],
  templateUrl: './provider-workqueue-group.component.html',
  styleUrl: './provider-workqueue-group.component.scss'
})
export class ProviderWorkqueueGroupComponent extends AbstractEntityGroupComponent<HcclUserProfileCrudWrapper> implements OnInit {

  @Input() queueId: string = '';
  override ngOnInit(): void {
    // For singleton behavior, always use current user profile ID
    this.hcclContextService.refreshContext().subscribe(context => {
      this.defaultId = context.currentUserProfileId || '';
      
      this.id = this.defaultId;
      this.organizationId = context.currentUserProfile.organizationId || '';
      // Call parent ngOnInit after setting the ID
      super.ngOnInit();
    });
  }


  protected override populateFromParams(params: any): void {
    super.populateFromParams(params);
    this.queueId = params['queueId'];
  }
  protected defaultId: string = '';
  protected override getDefaultId(): string {
    return this.defaultId;
  }

  protected newCrudWrapperForCreate(): HcclUserProfileCrudWrapper {
    return HcclUserProfileCrudWrapper.newInstanceForCreate(this.hcclService);
  }


  protected workQueues: WorkQueueGETData[] = [];
  protected getWorkQueues(): WorkQueueGETData[] {
    return this.workQueues;
  }

  protected queue: WorkQueueGETData | undefined;
  protected getQueue(): WorkQueueGETData | undefined {
    return this.queue;
  }
  protected async loadEntityById(id: string): Promise<HcclUserProfileCrudWrapper> { 
    let workQueueCriteria : WorkQueueCriteria = {
      organizationId: this.organizationId,
      externalQueue: 1,
      includingStats: true,
      pageNumber: 1,
      pageSize: 2,
      isPaging: true
    };
    if (this.queueId != null && this.queueId != '') {
        workQueueCriteria.ids = [this.queueId];
    }

    if (this.queueId == null && this.queueId == '') {
        const workQueueRsp = await this.hcclService.findWorkQueues(workQueueCriteria).toPromise();
        this. workQueues = workQueueRsp?.searchResults as WorkQueueGETData[] || [];
        if (this.workQueues.length > 0) {
            this.queue = this.workQueues[0];
            this.queueId = this.queue?.id || '--none--';
        }
    }
    this.tabId = 'queue';
    
    return HcclUserProfileCrudWrapper.newInstance(id, this.hcclService);
  }

  protected organizationId : string = '';
  protected getOrganizationId(): string {
    return this.organizationId;  
  }

  protected setupTabs(): SimpleTab[] {
    const baseRoute = this.getBaseRoute();
    var tabs: SimpleTab[] = [
      new SimpleTab('queue', 'Queue', '', 
        () => {
          this.router.navigate([baseRoute]);
        },
        () => {
          return true;
        }
      )];
      
    //   tabs.push(new SimpleTab('mytickets', "My Open Tickets", '', 
    //     () => {
    //       this.router.navigate([baseRoute, 'mytickets']);
    //     },
    //     () => {
    //       return true;
    //     }
    //   ));
      
   
    return tabs;
  }

  protected override getDefaultTabId(): string {
    return 'dash';
  }

  protected getQueueById(id: string): WorkQueueGETData | undefined {
    return this.workQueues.find(queue => queue.id === id);
  }


  onClickWorkRequestRow(): OnRowClickBehavior {
    var x: OnRowClickBehavior =  new OnRowClickBehavior();
    //x.alertMessage = 'Ticket';
    x.usingNavigateUrl = true;
    x.getNavigateUrl = (id: string) => {
      return ['/provider-dashboard', 'workrequest', 'mytickets', id];
    };
    //x.alertMessage = 'Catalog Entry';
    return x;
  }

  protected getWorkRequestCriteriaForQueue(queueId: string): WorkRequestCriteria {
    return {
      workQueueId: queueId,
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }

  protected getWorkRequestCriteriaForMyTickets(): WorkRequestCriteria {
    return {
      acceptedByUserId: this.hcclContextService.getCurrentUserProfile().id || ''
    };
  }
}
