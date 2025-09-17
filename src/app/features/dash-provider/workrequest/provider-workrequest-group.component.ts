import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclUserProfileCrudWrapper } from '@app/components/_crud/hccluserprofile/hccluserprofile-crud.component';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { HcclUserContextGETData, WorkQueueCriteria, WorkQueueGETData, WorkRequestCriteria } from '@app/restsvc/hccl.service';
import { ProviderWorkrequestTabDashComponent } from './provider-workrequest-tab-dash.component';
import { HcclOrganizationCrudWrapper } from '@app/components/_crud/hcclorganization/hcclorganization-crud.component';

@Component({
  selector: 'app-provider-workrequest-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, ProviderWorkrequestTabDashComponent],
  templateUrl: './provider-workrequest-group.component.html',
  styleUrl: './provider-workrequest-group.component.scss'
})
export class ProviderWorkrequestGroupComponent extends AbstractEntityGroupComponent<HcclUserProfileCrudWrapper> implements OnInit {

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
      
      if (this.currentTabId === 'queue'  && this.childId !== undefined) {
        let queueId = this.childId;
      for (let i = 0; i < this.workQueues?.length || 0; i++) {
        if (queueId === this.workQueues[i].id) {
          var queue = this.workQueues[i];
          tabs.push(new SimpleTab('queue', queue.businessCode || '--UNK--', '', 
            () => {
              this.router.navigate([baseRoute, 'queue', queue.id]);
            },
            () => {
              return true;
            }
          ));
          }
        }
      }

    return tabs;
  }

  protected override getDefaultTabId(): string {
    return 'dash';
  }

  protected getQueueById(id: string): WorkQueueGETData | undefined {
    return this.workQueues.find(queue => queue.id === id);
  }
}
