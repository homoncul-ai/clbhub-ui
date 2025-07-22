// This template is for generating a GROUP component  
// This was generated using entityName = HcclTeamLog
// Generate the new [entityName]-group.component.ts   files using this template 

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclTeamLogCrudWrapper, HcclTeamLogCrudComponent } from '@app/components/_crud/hcclteamlog/hcclteamlog-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-hcclteamlog-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, HcclTeamLogCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './hcclteamlog-group.component.html',
})
export class HcclTeamLogGroupComponent extends AbstractEntityGroupComponent<HcclTeamLogCrudWrapper> implements OnInit {  
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
        this.entity = HcclTeamLogCrudWrapper.newInstanceForCreate(this.hcclService);
      } else {
      if (id) {
        this.id = id;
        this.tabs = this.setupTabs();
        this.currentTabId = tabId;
        this.loadEntityById(id).then(entity => {
          this.entity = entity;
        }).catch(error => {
          console.error('Error loading HcclTeamLog:', error);
        });
      }
      }
    });
  }

  protected async loadEntityById(id: string): Promise<HcclTeamLogCrudWrapper> {
    const ref = await this.hcclService.getHcclTeamLogById(id).toPromise();
    if (!ref) {
      throw new Error('HcclTeamLog not found');
    }
    this.entity = new HcclTeamLogCrudWrapper(ref, this.hcclService);
    return this.entity;
  }

  protected setupTabs(): SimpleTab[] {
    return [
      new SimpleTab('list', 'List', '', 
        () => {
          this.router.navigate(['/ecoadmin-dashboard/hcclteamlogs']);
        },
        () => {
          return true;
        }
      ),
      new SimpleTab('details', 'Details', '', 
        () => {
          this.currentTabId = 'details';
          this.router.navigate(['/ecoadmin-dashboard/hcclteamlogs', this.id, 'details']);
        },
        () => {
          return this.entity !== null;
        }
      ),
      new SimpleTab('debug', 'Debug', '', 
        () => {
          this.currentTabId = 'debug';
          this.router.navigate(['/ecoadmin-dashboard/hcclteamlogs', this.id, 'debug']);
        },
        () => {
          return true;
        }
      ),
      new SimpleTab('fk_menu', 'FK_MENU', '', 
        () => {
          this.currentTabId = 'fk_menu';
          this.router.navigate(['/ecoadmin-dashboard/hcclteamlogs', this.id, 'fk_menu']);
        },
        () => {
          return true;
        }
      )
    ];
  }

} 