import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractEntityGroupComponent } from '@app/components/_global/abstract-entity-group/abstract-entity-group.component';
import { ClStudentCrudWrapper, ClstudentCrudComponent } from '@app/components/_crud/clstudent/clstudent-crud.component';
import { HcclService } from '@app/restsvc/hccl.service';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';

@Component({
  selector: 'app-clstudent-group',
  imports: [CommonModule, SimpleTabsetComponent, ClstudentCrudComponent],
  templateUrl: './clstudent-group.component.html',
  styleUrl: './clstudent-group.component.scss'
})
export class CLStudentGroupComponent extends AbstractEntityGroupComponent<ClStudentCrudWrapper> implements OnInit {  
  @Input() id!: string;

  constructor(
    private route: ActivatedRoute
  ) {
    super();    
  }

  ngOnInit(): void {
    // Subscribe to route parameters
    this.route.params.subscribe(params => {
      const studentId = params['id'];
      const tabId = params['tabId'] || 'details';
      
      if (studentId) {
        this.id = studentId;
        this.tabs = this.setupTabs();
        this.currentTabId = tabId;
        // Load the student data
        this.loadEntityById(studentId).then(entity => {
          this.entity = entity;
        }).catch(error => {
          console.error('Error loading student:', error);
        });
      }
    });
  }

  protected async loadEntityById(id: string): Promise<ClStudentCrudWrapper> {
    const student = await this.hcclService.getCLStudentById(id).toPromise();
    if (!student) {
      throw new Error('Student not found');
    }
    this.entity = new ClStudentCrudWrapper(student, this.hcclService);
    return this.entity;
  }
  
  protected setupTabs(): SimpleTab[] {
    return [
      new SimpleTab('details', 'Details', '', 
        () => {
          this.currentTabId = 'details';
          this.router.navigate(['/advocate-dashboard/integrations/students', this.id, 'details']);
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
   // this.router.navigate(['/advocate-dashboard/integrations/students', this.id, tabId]);
  }
}
