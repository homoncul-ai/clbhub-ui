import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { CLSchoolCrudWrapper, ClschoolCrudComponent } from '@app/components/_crud/clschool/clschool-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-clschool-group',
  imports: [CommonModule, SimpleTabsetComponent, ClschoolCrudComponent],
  templateUrl: './clschool-group.component.html',
  styleUrl: './clschool-group.component.scss'
})
export class ClschoolGroupComponent extends AbstractEntityGroupComponent<CLSchoolCrudWrapper> implements OnInit {  
  @Input() id!: string;

  constructor(
    private route: ActivatedRoute
  ) {
    super();    
  }

  ngOnInit(): void {
    // Subscribe to route parameters
    this.route.params.subscribe(params => {
      const schoolId = params['id'];
      const tabId = params['tabId'] || 'details';
      
      if (schoolId) {
        this.id = schoolId;
        this.tabs = this.setupTabs();
        this.currentTabId = tabId;
        // Load the school data
        this.loadEntityById(schoolId).then(entity => {
          this.entity = entity;
        }).catch(error => {
          console.error('Error loading school:', error);
        });
      }
    });
  }

  protected async loadEntityById(id: string): Promise<CLSchoolCrudWrapper> {
    const school = await this.hcclService.getCLSchoolById(id).toPromise();
    if (!school) {
      throw new Error('School not found');
    }
    this.entity = new CLSchoolCrudWrapper(school, this.hcclService);
    return this.entity;
  }
  
  protected setupTabs(): SimpleTab[] {
    return [
      new SimpleTab('details', 'Details', '', 
        () => {
          this.currentTabId = 'details';
          this.router.navigate(['/advocate-dashboard/integrations/schools', this.id, 'details']);
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
   // this.router.navigate(['/advocate-dashboard/integrations/schools', this.id, tabId]);
  }
}
