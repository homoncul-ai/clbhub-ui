import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { HcclService, StudentCohortSummaryGETData } from '@app/restsvc/hccl.service';
import { CohortTabsetUiComponent } from '@app/components/_crud/cohort/cohort-tabset-ui.component';
import { COHORT_PARTICIPANT_PRESET_LIST } from './cohorts/cohort-participant-mock-presets';

@Component({
  selector: 'app-dash-citizen-cohorts',
  standalone: true,
  imports: [CommonModule, RouterModule, CohortTabsetUiComponent],
  templateUrl: './dash-citizen-cohorts.component.html',
  styleUrl: './dash-citizen-cohorts.component.scss',
})
export class DashCitizenCohortsComponent implements OnInit, OnDestroy {
  private hcclService = inject(HcclService);
  private destroy$ = new Subject<void>();

  @ViewChild('cohortPanel') cohortPanel?: ElementRef;

  loading = true;
  error = '';
  cohorts: StudentCohortSummaryGETData[] = [];
  selectedCohortId = '';
  selectedCohortTitle = '';

  cohortSpecs = COHORT_PARTICIPANT_PRESET_LIST.map((preset) => ({
    key: preset.key,
    label: preset.label,
    description: preset.description,
    leader: preset.mockCohort.leader,
    schedule: `${preset.mockCohort.startDate} – ${preset.mockCohort.endDate}`,
    route: preset.key === 'healthcare' ? 'healthcare-ui-example' : 'ai-exploration-ui-example',
  }));

  ngOnInit(): void {
    this.loadMyCohorts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectCohort(cohort: StudentCohortSummaryGETData): void {
    if (!cohort.cohortId) {
      return;
    }
    this.selectedCohortId = cohort.cohortId;
    this.selectedCohortTitle = cohort.cohortName || 'Cohort Details';
    setTimeout(() => this.scrollToPanel(), 50);
  }

  closeCohortPanel(): void {
    this.selectedCohortId = '';
    this.selectedCohortTitle = '';
  }

  private loadMyCohorts(): void {
    this.loading = true;
    this.error = '';
    this.hcclService.loadMyCohorts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.cohorts = data?.cohorts || [];
          this.loading = false;
          const errors = data?.messages?.messages?.filter((m) => m.severity === 1) || [];
          if (errors.length) {
            this.error = errors.map((e) => e.message).filter(Boolean).join(' ');
          }
        },
        error: () => {
          this.loading = false;
          this.cohorts = [];
          this.error = 'Unable to load your cohorts.';
        },
      });
  }

  private scrollToPanel(): void {
    this.cohortPanel?.nativeElement?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}
