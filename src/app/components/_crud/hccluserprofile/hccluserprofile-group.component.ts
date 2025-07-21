import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { HcclUserProfileCrudWrapper, HcclUserProfileCrudComponent } from './hccluserprofile-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-hccluserprofile-group',
  imports: [CommonModule, SimpleTabsetComponent, HcclUserProfileCrudComponent],
  templateUrl: './hccluserprofile-group.component.html',
  styleUrl: './hccluserprofile-group.component.scss'
})
export class HcclUserProfileGroupComponent extends AbstractEntityGroupComponent<HcclUserProfileCrudWrapper> implements OnInit {  
  @Input() id!: string;

  constructor(
    private route: ActivatedRoute
  ) {
    super();    
  }

  ngOnInit(): void {
    // Subscribe to route parameters
    this.route.params.subscribe(params => {
      const userProfileId = params['id'];
      const tabId = params['tabId'] || 'details';
      
      if (userProfileId) {
        this.id = userProfileId;
        this.tabs = this.setupTabs();
        this.currentTabId = tabId;
        // Load the user profile data
        this.loadEntityById(userProfileId).then(entity => {
          this.entity = entity;
        }).catch(error => {
          console.error('Error loading user profile:', error);
        });
      }
    });
  }

  protected async loadEntityById(id: string): Promise<HcclUserProfileCrudWrapper> {
    const userProfile = await this.hcclService.getHcclUserProfileById(id).toPromise();
    if (!userProfile) {
      throw new Error('User Profile not found');
    }
    this.entity = new HcclUserProfileCrudWrapper(userProfile, this.hcclService);
    return this.entity;
  }
  
  protected setupTabs(): SimpleTab[] {
    return [
      new SimpleTab('list', 'List', '', 
        () => {
          this.router.navigate(['/ecoadmin-dashboard/hccluserprofiles']);
        },
        () => {
          return true; // Always show the list tab
        }
      ),
      new SimpleTab('details', 'Details', '', 
        () => {
          this.currentTabId = 'details';
          this.router.navigate(['/ecoadmin-dashboard/hccluserprofiles', this.id, 'details']);
        },
        () => {
          return this.entity !== null;
        }
      ),
      new SimpleTab('debug', 'Debug', '', 
        () => {
          this.currentTabId = 'debug';
          this.router.navigate(['/ecoadmin-dashboard/hccluserprofiles', this.id, 'debug']);
        },
        () => {
          return this.entity !== null;
        }
      ),
      new SimpleTab('fk_menu', 'FK Menu', '', 
        () => {
          this.currentTabId = 'fk_menu';
          this.router.navigate(['/ecoadmin-dashboard/hccluserprofiles', this.id, 'fk_menu']);
        },
        () => {
          return this.entity !== null;
        }
      )
    ];
  }

  public onListTabClick(): void {
    this.currentTabId = 'list';
    this.router.navigate(['/ecoadmin-dashboard/hccluserprofiles']);
  }

  public override activateTab(tabId: string): void {
    this.currentTabId = tabId;
    // Update the URL to reflect the current tab
    // this.router.navigate(['/ecoadmin-dashboard/hccluserprofiles', this.id, tabId]);
  }
} 