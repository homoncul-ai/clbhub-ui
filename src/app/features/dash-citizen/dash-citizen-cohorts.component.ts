import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { OnRowClickBehavior } from '@app/components/_global/abstract-list/abstract-list.component';
import { CitizenCohortListComponent } from '@app/components/_crud/cohort/citizen-cohort-list.component';
import { COHORT_PARTICIPANT_PRESET_LIST } from './cohorts/cohort-participant-mock-presets';

class CitizenCohortPageRowClickBehavior extends OnRowClickBehavior {
  override onRowClick(entityId: string, baseRoute: string, router: Router): void {
    router.navigate([baseRoute, entityId]);
  }
}

@Component({
  selector: 'app-dash-citizen-cohorts',
  standalone: true,
  imports: [CommonModule, RouterModule, CitizenCohortListComponent],
  templateUrl: './dash-citizen-cohorts.component.html',
  styleUrl: './dash-citizen-cohorts.component.scss',
})
export class DashCitizenCohortsComponent {
  readonly cohortRowClickBehavior = new CitizenCohortPageRowClickBehavior();

  cohortSpecs = COHORT_PARTICIPANT_PRESET_LIST.map((preset) => ({
    key: preset.key,
    label: preset.label,
    route: preset.key === 'healthcare' ? 'healthcare-ui-example' : 'ai-exploration-ui-example',
  }));
}
