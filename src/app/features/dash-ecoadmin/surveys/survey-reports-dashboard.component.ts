import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HcclService } from '@app/restsvc/hccl.service';
import {
  ADMIN_SURVEYS_BASE,
  ADMIN_SURVEYS_MANAGE_BASE,
  SurveyRegistryEntry,
  getOlderSurveys,
  getRecentSurveys,
  mergeSurveyRefsOntoRegistry,
} from '@app/features/surveys/survey-registry';

@Component({
  selector: 'app-survey-reports-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './survey-reports-dashboard.component.html',
  styleUrl: './survey-reports-dashboard.component.scss',
})
export class SurveyReportsDashboardComponent implements OnInit {
  private readonly hcclService = inject(HcclService);

  /** Base path for the internal results viewer. */
  readonly resultsBase = ADMIN_SURVEYS_BASE;
  readonly manageRoute = ADMIN_SURVEYS_MANAGE_BASE;

  recentSurveys: SurveyRegistryEntry[] = getRecentSurveys();
  olderSurveys: SurveyRegistryEntry[] = getOlderSurveys();
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.loadFromDb();
  }

  private loadFromDb(): void {
    this.loading = true;
    this.error = null;
    this.hcclService
      .findPSurveyRefs({ pageNumber: 1, pageSize: 50, isPaging: true })
      .subscribe({
        next: (response) => {
          const merged = mergeSurveyRefsOntoRegistry(response.searchResults || [], {
            availableOnly: false,
          });
          this.recentSurveys = getRecentSurveys(merged);
          this.olderSurveys = getOlderSurveys(merged);
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load PSurveyRef catalog', err);
          this.error = 'Could not load survey titles from the database; showing local registry.';
          this.loading = false;
        },
      });
  }
}
