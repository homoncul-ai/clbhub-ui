import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { CLSchoolCrudWrapper, CLSchoolCrudComponent } from '@app/components/_crud/clschool/clschool-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { HcclOrganizationCrudComponent } from '../hcclorganization/hcclorganization-crud.component';

@Component({
  selector: 'app-clschool-group',
  standalone: true,
  imports: [CommonModule, SimpleTabsetComponent, CLSchoolCrudComponent,HcclOrganizationCrudComponent],
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  templateUrl: './clschool-group.component.html',
})
export class CLSchoolGroupComponent extends AbstractEntityGroupComponent<CLSchoolCrudWrapper> implements OnInit {  
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
        this.entity = CLSchoolCrudWrapper.newInstanceForCreate(this.hcclService);
      } else {
      if (id) {
        this.id = id;
        this.tabs = this.setupTabs();
        this.currentTabId = tabId;
        this.loadEntityById(id).then(entity => {
          this.entity = entity;
        }).catch(error => {
          console.error('Error loading CLSchool:', error);
        });
      }
      }
    });
  }

  protected async loadEntityById(id: string): Promise<CLSchoolCrudWrapper> {
    const ref = await this.hcclService.getCLSchoolById(id).toPromise();
    if (!ref) {
      throw new Error('CLSchool not found');
    }
    this.entity = new CLSchoolCrudWrapper(ref, this.hcclService);
    return this.entity;
  }

  protected setupTabs(): SimpleTab[] {
    return [
      new SimpleTab('list', 'List', '', 
        () => {
          this.router.navigate(['/ecoadmin-dashboard/clschools']);
        },
        () => {
          return true;
        }
      ),
      new SimpleTab('details', 'Details', '', 
        () => {
          this.currentTabId = 'details';
          this.router.navigate(['/ecoadmin-dashboard/clschools', this.id, 'details']);
        },
        () => {
          return this.entity !== null;
        }
      ),
      new SimpleTab('debug', 'Debug', '', 
        () => {
          this.currentTabId = 'debug';
          this.router.navigate(['/ecoadmin-dashboard/clschools', this.id, 'debug']);
        },
        () => {
          return true;
        }
      ),
      new SimpleTab('fk_menu', 'FK_MENU', '', 
        () => {
          this.currentTabId = 'fk_menu';
          this.router.navigate(['/ecoadmin-dashboard/clschools', this.id, 'fk_menu']);
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