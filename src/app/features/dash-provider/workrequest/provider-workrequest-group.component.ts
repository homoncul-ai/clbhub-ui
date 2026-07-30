import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclUserProfileCrudWrapper } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { HcclUserContextGETData, WorkQueueCriteria, WorkQueueGETData, WorkRequestCriteria } from '@app/restsvc/hccl.service';
import { ProviderWorkrequestTabDashComponent } from './provider-workrequest-tab-dash.component';
import { HcclOrganizationCrudWrapper } from '@app/components/_crud/hcclorganization/hcclorganization-crud.component';
import { WorkRequestListComponent } from '@app/components/_crud/workrequest/workrequest-list.component';
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';

@Component({
  selector: 'app-provider-workrequest-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, ProviderWorkrequestTabDashComponent, WorkRequestListComponent],
  templateUrl: './provider-workrequest-group.component.html',
  styleUrl: './provider-workrequest-group.component.scss'
})
export class ProviderWorkrequestGroupComponent extends AbstractEntityGroupComponent<HcclUserProfileCrudWrapper> implements OnInit {

  override ngOnInit(): void {
    // For singleton behavior, always use current user profile ID
    this.hcclContextService.refreshContext().subscribe(context => {
    
      this.id = context.currentUserProfileId || '';
      this.organizationId = context.currentUserProfile.organizationId || '';
      // Call parent ngOnInit after setting the ID
      super.ngOnInit();
    });
  }
 

  protected newCrudWrapperForCreate(): HcclUserProfileCrudWrapper {
    return HcclUserProfileCrudWrapper.newInstanceForCreate(this.hcclService);
  }


  protected workQueues: WorkQueueGETData[] = [];
  protected getWorkQueues(): WorkQueueGETData[] {
    return this.workQueues;
  }
  protected async loadEntityById(id: string): Promise<HcclUserProfileCrudWrapper> { 
    const workQueueCriteria : WorkQueueCriteria = {
      organizationId: this.organizationId,
      externalQueue: 1,
      includingStats: true,
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
    const workQueueRsp = await this.hcclService.findWorkQueues(workQueueCriteria).toPromise();
    this. workQueues = workQueueRsp?.searchResults as WorkQueueGETData[] || [];

    return HcclUserProfileCrudWrapper.newInstance(id, this.hcclService);
  }

  protected organizationId : string = '';
  protected getOrganizationId(): string {
    return this.organizationId;  
  }

  protected setupTabs(): SimpleTab[] {
    const baseRoute = this.getBaseRoute();
    var tabs: SimpleTab[] = [
      new SimpleTab('dash', 'Work Requests', '', 
        () => {
          this.router.navigate([baseRoute]);
        },
        () => {
          return true;
        }
      )];
      
      tabs.push(new SimpleTab('mytickets', "My Open Tickets", '', 
        () => {
          this.router.navigate([baseRoute, 'mytickets']);
        },
        () => {
          return true;
        }
      ));
      
   
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


  protected getWorkRequestCriteriaForMyTickets(): WorkRequestCriteria {
    return {
      acceptedByUserId: this.hcclContextService.getCurrentUserProfile().id || '',
      pageNumber: 1,
      pageSize: 50,
      isPaging: true
    };
  }
}
