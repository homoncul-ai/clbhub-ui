import { Component, Input, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HcclService, StudentDashUIGETData } from '@app/restsvc/hccl.service';
import { CRUD_MODES } from '@app/@core/constants';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { HcclUserProfileCrudComponent } from './hccluserprofile-crud.component';
import { FamilyunitComponent } from './familyunit-component';
import { HcclOrganizationCrudComponent } from '../hcclorganization/hcclorganization-crud.component';
import { HcclTeamCrudComponent } from '../hcclteam/hcclteam-crud.component';
import { PMessageUiComponent } from '../pmessage-ui/pmessage-ui.component';
import { PersonalStatementCrudComponent } from '../personalstatement/personalstatement-crud.component';

@Component({
  selector: 'app-student-ui',
  templateUrl: './student-ui.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MdbAccordionModule,
    HcclUserProfileCrudComponent,
    FamilyunitComponent,
    HcclOrganizationCrudComponent,
    HcclTeamCrudComponent,
    PMessageUiComponent,
    PersonalStatementCrudComponent,
  ],
})
export class StudentUiComponent implements OnInit, OnChanges {
  @Input() userProfileId!: string;

  dashData: StudentDashUIGETData | null = null;
  loading = false;
  error = '';

  readonly CRUD_MODES = CRUD_MODES;

  /** Accordion state: which section is open. First (studentInfo) open by default. */
  accordionId = 'studentInfo';

  private hcclService = inject(HcclService);

  openAccordion(id: string): void {
    this.accordionId = id;
  }

  isAccordionCollapsed(id: string): boolean {
    return this.accordionId !== id;
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userProfileId']) {
      this.loadData();
    }
  }

  private loadData(): void {
    if (!this.userProfileId) {
      this.dashData = null;
      return;
    }
    this.loading = true;
    this.error = '';
    this.hcclService.resolveStudentDashData(this.userProfileId).subscribe({
      next: (data) => {
        this.dashData = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Failed to load student data';
        this.loading = false;
      },
    });
  }
}
