import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { StudentPersonalStatementResumeListComponent } from './student-personalstatement-resume-list.component';
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';

@Component({
  selector: 'app-dash-student-resumes',
  standalone: true,
  imports: [CommonModule, StudentPersonalStatementResumeListComponent],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                <i class="fas fa-file-alt me-2"></i>
                My Resumes
              </h3>
            </div>
            <div class="card-body">
              <app-student-personalstatement-resume-list 
                [onRowClickBehavior]="getResumeRowClickBehavior()"
                [showAllResumes]="true"
                [showingSearch]="true"
                [showingSearchHeading]="true"
                [showingGoButton]="true"
                [showingAddButton]="false"
                [showingIdCheckbox]="false">
              </app-student-personalstatement-resume-list>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashStudentResumesComponent implements OnInit {
  
  constructor(
    private hcclContextService: HcclContextService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Component initialization if needed
  }

  protected getResumeRowClickBehavior(): OnRowClickBehavior {
    const o = new OnRowClickBehavior();
    o.usingNavigateUrl = true;
    o.getNavigateUrl = (entityId: string): any[] => {
      // Navigate to the resume details within the personal statement group
      // We'll need to find which personal statement this resume belongs to
      // For now, navigate to a generic resume route
      return ['student-dashboard', 'resumes', entityId];
    };
    return o;
  }
}

