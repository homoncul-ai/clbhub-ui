import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { CLCourseCrudComponent, CLCourseCrudWrapper } from './clcourse-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-clcourse-group',
  templateUrl: './clcourse-group.component.html',
  styleUrl: '../../_global/abstract-entity-group/abstract-entity-group.component.scss',
  imports: [CommonModule, SimpleTabsetComponent, CLCourseCrudComponent],
  standalone: true
})
export class CLCourseGroupComponent extends AbstractEntityGroupComponent<CLCourseCrudWrapper> implements OnInit {
  @Input() id!: string;
  private route = inject(ActivatedRoute);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      const tabId = params['tabId'] || 'details';
      if (!id) {
        this.currentTabId = tabId;
        this.showingTabset = false;
        this.entity = CLCourseCrudWrapper.newInstanceForCreate(this.hcclService);
      } else {
        if (id) {
          this.id = id;
          this.tabs = this.setupTabs();
          this.currentTabId = tabId;
          this.loadEntityById(id).then(entity => {
            this.entity = entity;
          }).catch(error => {
            console.error('Error loading CLCourse:', error);
          });
        }
      }
    });
  }

  protected async loadEntityById(id: string): Promise<CLCourseCrudWrapper> {
    const data = await this.hcclService.getCLCourseById(id).toPromise();
    if (!data) {
      throw new Error('CLCourse not found');
    }
    return new CLCourseCrudWrapper(data, this.hcclService);
  }

  protected setupTabs(): SimpleTab[] {
    return [
      new SimpleTab('details', 'Details', '', 
        () => {
          this.currentTabId = 'details';
          this.router.navigate(['/ecoadmin-dashboard/integration_edu/clcourse', this.id, 'details']);
        },
        () => {
          return this.entity !== null;
        }
      ),
      new SimpleTab('list', 'List', '', 
        () => {
          this.router.navigate(['/ecoadmin-dashboard/integration_edu/clcourse']);
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