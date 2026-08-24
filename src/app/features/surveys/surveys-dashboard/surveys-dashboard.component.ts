import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HcclService } from '@app/restsvc/hccl.service';
import { SurveysPublicHeaderComponent } from '../components/surveys-public-header.component';
import {
  SurveyRegistryEntry,
  getOlderSurveys,
  getRecentSurveys,
  mergeSurveyRefsOntoRegistry,
} from '../survey-registry';

/**
 * Public survey directory.
 * Titles/availability come from GET/query via publicFindPSurveyRefs; only available === 1.
 */
@Component({
  selector: 'app-surveys-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SurveysPublicHeaderComponent],
  templateUrl: './surveys-dashboard.component.html',
  styleUrl: './surveys-dashboard.component.scss',
})
export class SurveysDashboardComponent implements OnInit {
  private readonly hcclService = inject(HcclService);

  recentSurveys: SurveyRegistryEntry[] = [];
  olderSurveys: SurveyRegistryEntry[] = [];
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.loadFromDb();
  }

  private loadFromDb(): void {
    this.loading = true;
    this.error = null;
    this.hcclService
      .publicFindPSurveyRefs({
        pageNumber: 1,
        pageSize: 50,
        isPaging: true,
        available: 1,
      })
      .subscribe({
        next: (response) => {
          const merged = mergeSurveyRefsOntoRegistry(response.searchResults || [], {
            availableOnly: true,
          });
          this.recentSurveys = getRecentSurveys(merged);
          this.olderSurveys = getOlderSurveys(merged);
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load public PSurveyRef catalog', err);
          this.recentSurveys = [];
          this.olderSurveys = [];
          this.error = 'Could not load available surveys. Please try again later.';
          this.loading = false;
        },
      });
  }
}
