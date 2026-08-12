import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HcclService } from '@app/restsvc/hccl.service';
import { CitizenPersonalStatementResumeListComponent } from '../citizen-personalstatement-resume-list.component';
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';

@Component({
  selector: 'app-citizen-resumebuilder',
  standalone: true,
  imports: [CommonModule, RouterModule, CitizenPersonalStatementResumeListComponent],
  templateUrl: './citizen-resumebuilder.component.html',
  styleUrls: ['./citizen-resumebuilder.component.scss']
})
export class CitizenResumeBuilderComponent implements OnInit {

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
      return ['/citizen/resumes', entityId, 'resume'];
    };
    return o;
  }
}

