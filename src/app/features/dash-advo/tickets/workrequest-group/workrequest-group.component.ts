import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { WorkRequestCrudWrapper, WorkrequestCrudComponent } from '@app/components/_crud/workrequest/workrequest-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { WorkrequestUpdateComponent } from '../workrequest-update/workrequest-update.component';

@Component({
  selector: 'app-workrequest-group',
  imports: [CommonModule, SimpleTabsetComponent, WorkrequestCrudComponent, WorkrequestUpdateComponent],
  templateUrl: './workrequest-group.component.html',
  styleUrl: './workrequest-group.component.scss'
})
export class WorkrequestGroupComponent extends AbstractEntityGroupComponent<WorkRequestCrudWrapper> implements OnInit {  
  @Input() id!: string;

  constructor(
    private route: ActivatedRoute
  ) {
    super();    
  }

  ngOnInit(): void {
    // Subscribe to route parameters
    this.route.params.subscribe(params => {
      const workRequestId = params['id'];
      const tabId = params['tabId'] || 'details';
      
      if (workRequestId) {
        this.id = workRequestId;
        this.tabs = this.setupTabs();
        this.currentTabId = tabId;
        // Load the work request data
        this.loadEntityById(workRequestId).then(entity => {
          this.entity = entity;
        }).catch(error => {
          console.error('Error loading work request:', error);
        });
      }
    });
  }

  protected async loadEntityById(id: string): Promise<WorkRequestCrudWrapper> {
    const workRequest = await this.hcclService.getWorkRequestById(id).toPromise();
    if (!workRequest) {
      throw new Error('Work Request not found');
    }
    this.entity = new WorkRequestCrudWrapper(workRequest, this.hcclService);
    return this.entity;
  }
  
  protected setupTabs(): SimpleTab[] {
    return [
      new SimpleTab('details', 'Details', '', 
        () => {
          this.currentTabId = 'details';
          this.router.navigate(['/advocate-dashboard/integrations/workrequests', this.id, 'details']);
        },
        () => {
          return this.entity !== null;
        }
      ),
      new SimpleTab('update', 'Update', '', 
        () => {
          this.currentTabId = 'update';
          this.router.navigate(['/advocate-dashboard/integrations/workrequests', this.id, 'update']);
        },
        () => {
          return this.entity !== null;
        }
      ),
      new SimpleTab('logs', 'Logs', '', 
        () => {
          this.currentTabId = 'logs';
          this.router.navigate(['/advocate-dashboard/integrations/workrequests', this.id, 'logs']);
        },
        () => {
          return this.entity !== null;
        }
      )
    ];
  }

  public override activateTab(tabId: string): void {
    this.currentTabId = tabId;
    // Update the URL to reflect the current tab
   // this.router.navigate(['/advocate-dashboard/integrations/workrequests', this.id, tabId]);
  }
}
