import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { WorkQueueTypeRefCrudWrapper, WorkqueuetyperefCrudComponent } from '@app/components/_crud/workqueuetyperef/workqueuetyperef-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-workqueuetyperef-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, WorkqueuetyperefCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './workqueuetyperef-group.component.html',
})
export class WorkQueueTypeRefGroupComponent extends AbstractEntityGroupComponent<WorkQueueTypeRefCrudWrapper> implements OnInit {  
  @Input() id!: string;

  constructor(
    private route: ActivatedRoute
  ) {
    super();    
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      const tabId = params['tabId'] || 'details';
      if (!id) {
        this.currentTabId = tabId;
        this.showingTabset = false;
        this.entity = WorkQueueTypeRefCrudWrapper.newInstanceForCreate(this.hcclService);
      } else {
      if (id) {
        this.id = id;
        this.tabs = this.setupTabs();
        this.currentTabId = tabId;
        this.loadEntityById(id).then(entity => {
          this.entity = entity;
        }).catch(error => {
          console.error('Error loading WorkQueueTypeRef:', error);
        });
      }
      }
    });
  }

  protected async loadEntityById(id: string): Promise<WorkQueueTypeRefCrudWrapper> {
    const ref = await this.hcclService.getWorkQueueTypeRefById(id).toPromise();
    if (!ref) {
      throw new Error('WorkQueueTypeRef not found');
    }
    this.entity = new WorkQueueTypeRefCrudWrapper(ref, this.hcclService);
    return this.entity;
  }

  protected setupTabs(): SimpleTab[] {
    return [
      new SimpleTab('list', 'List', '', 
        () => {
          this.router.navigate(['/ecoadmin-dashboard/workqueuetyperefs']);
        },
        () => {
          return true;
        }
      ),
      new SimpleTab('details', 'Details', '', 
        () => {
          this.currentTabId = 'details';
          this.router.navigate(['/ecoadmin-dashboard/workqueuetyperefs', this.id, 'details']);
        },
        () => {
          return this.entity !== null;
        }
      ),
      new SimpleTab('debug', 'Debug', '', 
        () => {
          this.currentTabId = 'debug';
          this.router.navigate(['/ecoadmin-dashboard/workqueuetyperefs', this.id, 'debug']);
        },
        () => {
          return true;
        }
      ),
      new SimpleTab('fk_menu', 'FK_MENU', '', 
        () => {
          this.currentTabId = 'fk_menu';
          this.router.navigate(['/ecoadmin-dashboard/workqueuetyperefs', this.id, 'fk_menu']);
        },
        () => {
          return true;
        }
      )
    ];
  }

  public override activateTab(tabId: string): void {
    this.currentTabId = tabId;
  }
} 