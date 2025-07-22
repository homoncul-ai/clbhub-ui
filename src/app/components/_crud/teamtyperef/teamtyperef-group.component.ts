import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { TeamTypeRefCrudWrapper, TeamTypeRefCrudComponent } from '@app/components/_crud/teamtyperef/teamtyperef-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-teamtyperef-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, TeamTypeRefCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './teamtyperef-group.component.html',
})
export class TeamTypeRefGroupComponent extends AbstractEntityGroupComponent<TeamTypeRefCrudWrapper> implements OnInit {  
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
        this.entity = TeamTypeRefCrudWrapper.newInstanceForCreate(this.hcclService);
      } else {
      if (id) {
        this.id = id;
        this.tabs = this.setupTabs();
        this.currentTabId = tabId;
        this.loadEntityById(id).then(entity => {
          this.entity = entity;
        }).catch(error => {
          console.error('Error loading TeamTypeRef:', error);
        });
      }
      }
    });
  }

  protected async loadEntityById(id: string): Promise<TeamTypeRefCrudWrapper> {
    const ref = await this.hcclService.getTeamTypeRefById(id).toPromise();
    if (!ref) {
      throw new Error('TeamTypeRef not found');
    }
    this.entity = new TeamTypeRefCrudWrapper(ref, this.hcclService);
    return this.entity;
  }

  protected setupTabs(): SimpleTab[] {
    return [
      new SimpleTab('list', 'List', '', 
        () => {
          this.router.navigate(['/ecoadmin-dashboard/teamTypeRefs']);
        },
        () => {
          return true;
        }
      ),
      new SimpleTab('details', 'Details', '', 
        () => {
          this.currentTabId = 'details';
          this.router.navigate(['/ecoadmin-dashboard/teamTypeRefs', this.id, 'details']);
        },
        () => {
          return this.entity !== null;
        }
      ),
      new SimpleTab('debug', 'Debug', '', 
        () => {
          this.currentTabId = 'debug';
          this.router.navigate(['/ecoadmin-dashboard/teamTypeRefs', this.id, 'debug']);
        },
        () => {
          return true;
        }
      ),
      new SimpleTab('fk_menu', 'FK_MENU', '', 
        () => {
          this.currentTabId = 'fk_menu';
          this.router.navigate(['/ecoadmin-dashboard/teamTypeRefs', this.id, 'fk_menu']);
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