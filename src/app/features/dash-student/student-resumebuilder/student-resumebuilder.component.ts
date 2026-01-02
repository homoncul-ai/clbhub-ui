import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HcclService } from '@app/restsvc/hccl.service';
import { StudentPersonalStatementResumeListComponent } from '../student-personalstatement-resume-list.component';
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';

@Component({
  selector: 'app-student-resumebuilder',
  standalone: true,
  imports: [CommonModule, RouterModule, StudentPersonalStatementResumeListComponent],
  templateUrl: './student-resumebuilder.component.html',
  styleUrls: ['./student-resumebuilder.component.scss']
})
export class StudentResumeBuilderComponent implements OnInit {

  constructor(
    private hcclService: HcclService
  ) {}

  ngOnInit(): void {
    // Component initialization
  }

  protected getResumeRowClickBehavior(): OnRowClickBehavior {
    const o = new OnRowClickBehavior();
    o.tabId = 'resume';
    o.usingNavigateUrl = true;
    o.getNavigateUrl = (entityId: string, baseRoute: string): any[] => {
      // Navigate to the resume details page
      return ['/student-dashboard/resumes', entityId, 'resume'];
    };
    return o;
  }
}

