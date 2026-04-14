import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  HcclService,
  UtilmonReportingEventCriteria,
  UtilmonReportingEventGETData,
} from '@app/restsvc/hccl.service';

interface SurveyDefinition {
  key: string;
  label: string;
  subject: string;
  description: string;
}

@Component({
  selector: 'app-survey-results-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './survey-results-viewer.component.html',
  styleUrl: './survey-results-viewer.component.scss',
})
export class SurveyResultsViewerComponent implements OnInit {
  private readonly hcclService = inject(HcclService);
  private readonly route = inject(ActivatedRoute);

  private readonly pageBucketSize = 10;
  private readonly maxResults = 50;

  readonly surveys: Record<string, SurveyDefinition> = {
    npo_job_finder: {
      key: 'npo_job_finder',
      label: 'Non-profit job search assistance',
      subject: 'Survey: Do you have a job for me?',
      description: 'Feedback on how nonprofit teams support job seekers.',
    },
  };

  loading = false;
  deleting = false;
  error = '';
  surveyKey = 'npo_job_finder';
  events: UtilmonReportingEventGETData[] = [];
  selectedAbsoluteIndex = -1;
  activeBucketIndex = 0;

  readonly keyLabels: Record<string, string> = {
    currentAnswer: 'How do you currently answer this question?',
    findJobs: 'How do you find the jobs you tell your clients about?',
    currentProcess: 'What does your current process look like?',
    educationGiven: 'What education do you provide around job search?',
    timeSink: 'What is most time consuming?',
    helpElaborate: 'How could software help? (details)',
    anythingElse: 'Anything else',
    sendInviteToClbHub: 'Please send me an invitation to join clbhub.org',
  };

  readonly helpOptionLabels: Record<string, string> = {
    help_jobListing: 'Job listing',
    help_clientCollab: 'Client collaboration',
    help_parentCollab: 'Parent collaboration',
    help_teamCollab: 'Internal team collaboration',
    help_orgCollab: 'Non-profit/school collaboration',
    help_providerCollab: 'Job provider collaboration',
  };

  readonly answerOrder = [
    'currentAnswer',
    'findJobs',
    'currentProcess',
    'educationGiven',
    'timeSink',
    'helpElaborate',
    'anythingElse',
    'sendInviteToClbHub',
  ];

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const key = (params['surveyKey'] || 'npo_job_finder').toString();
      this.surveyKey = this.surveys[key] ? key : 'npo_job_finder';
      this.loadSurveyEvents();
    });
  }

  get currentSurvey(): SurveyDefinition {
    return this.surveys[this.surveyKey] || this.surveys['npo_job_finder'];
  }

  get selectedEvent(): UtilmonReportingEventGETData | null {
    if (this.selectedAbsoluteIndex < 0 || this.selectedAbsoluteIndex >= this.events.length) {
      return null;
    }
    return this.events[this.selectedAbsoluteIndex] || null;
  }

  get selectedSurveyData(): Record<string, any> {
    return this.extractSurveyData(this.selectedEvent);
  }

  get totalBuckets(): number {
    return Math.ceil(this.events.length / this.pageBucketSize);
  }

  get bucketLabels(): string[] {
    return Array.from({ length: this.totalBuckets }, (_, i) => {
      const start = i * this.pageBucketSize + 1;
      const end = Math.min((i + 1) * this.pageBucketSize, this.events.length);
      return `${start}-${end}`;
    });
  }

  get bucketEvents(): UtilmonReportingEventGETData[] {
    const start = this.activeBucketIndex * this.pageBucketSize;
    return this.events.slice(start, start + this.pageBucketSize);
  }

  get canGoPrev(): boolean {
    return this.selectedAbsoluteIndex > 0;
  }

  get canGoNext(): boolean {
    return this.selectedAbsoluteIndex >= 0 && this.selectedAbsoluteIndex < this.events.length - 1;
  }

  get canDelete(): boolean {
    return !!this.selectedEvent && !this.deleting;
  }

  getSelectedHelpAreas(data: Record<string, any>): string[] {
    return Object.keys(this.helpOptionLabels)
      .filter((key) => this.asBoolean(data[key]))
      .map((key) => this.helpOptionLabels[key]);
  }

  getPrimaryAnswers(data: Record<string, any>): Array<{ label: string; value: string }> {
    const results: Array<{ label: string; value: string }> = [];
    for (const key of this.answerOrder) {
      if (key.startsWith('help_')) {
        continue;
      }
      const rawValue = data[key];
      if (rawValue === undefined || rawValue === null || `${rawValue}`.trim() === '') {
        continue;
      }
      const value =
        key === 'sendInviteToClbHub'
          ? this.asBoolean(rawValue)
            ? 'Yes'
            : 'No'
          : `${rawValue}`;
      results.push({ label: this.keyLabels[key] || key, value });
    }
    return results;
  }

  getAdditionalAnswers(data: Record<string, any>): Array<{ label: string; value: string }> {
    const reserved = new Set([
      'name',
      'email',
      'organization',
      'surveyCode',
      'pagePath',
      ...this.answerOrder,
      ...Object.keys(this.helpOptionLabels),
    ]);
    const extras: Array<{ label: string; value: string }> = [];
    Object.keys(data).forEach((key) => {
      if (reserved.has(key)) {
        return;
      }
      const value = data[key];
      if (value === undefined || value === null || `${value}`.trim() === '') {
        return;
      }
      extras.push({ label: key, value: `${value}` });
    });
    return extras;
  }

  selectBucket(index: number): void {
    if (index < 0 || index >= this.totalBuckets) {
      return;
    }
    this.activeBucketIndex = index;
    const firstAbsolute = this.activeBucketIndex * this.pageBucketSize;
    if (firstAbsolute < this.events.length) {
      this.selectedAbsoluteIndex = firstAbsolute;
    }
  }

  selectEvent(event: UtilmonReportingEventGETData): void {
    const index = this.events.findIndex((x) => x.id === event.id);
    if (index < 0) {
      return;
    }
    this.selectedAbsoluteIndex = index;
    this.activeBucketIndex = Math.floor(index / this.pageBucketSize);
  }

  nextEvent(): void {
    if (!this.canGoNext) {
      return;
    }
    this.selectedAbsoluteIndex += 1;
    this.activeBucketIndex = Math.floor(this.selectedAbsoluteIndex / this.pageBucketSize);
  }

  prevEvent(): void {
    if (!this.canGoPrev) {
      return;
    }
    this.selectedAbsoluteIndex -= 1;
    this.activeBucketIndex = Math.floor(this.selectedAbsoluteIndex / this.pageBucketSize);
  }

  deleteSelectedEvent(): void {
    const event = this.selectedEvent;
    const id = event?.id || '';
    if (!id || this.deleting) {
      return;
    }

    const ok = window.confirm('Deleting - are you sure ?');
    if (!ok) {
      return;
    }

    this.deleting = true;
    this.error = '';
    this.hcclService.deleteUtilmonReportingEventById(id).subscribe({
      next: () => {
        this.deleting = false;
        const removedIndex = this.selectedAbsoluteIndex;
        this.events = this.events.filter((x) => x.id !== id);

        if (!this.events.length) {
          this.selectedAbsoluteIndex = -1;
          this.activeBucketIndex = 0;
          return;
        }

        const newIndex = Math.min(removedIndex, this.events.length - 1);
        this.selectedAbsoluteIndex = Math.max(newIndex, 0);
        this.activeBucketIndex = Math.floor(this.selectedAbsoluteIndex / this.pageBucketSize);
      },
      error: () => {
        this.deleting = false;
        this.error = 'Unable to delete survey response.';
      },
    });
  }

  eventLabel(event: UtilmonReportingEventGETData): string {
    const map = this.extractSurveyData(event);
    return map['name'] || map['email'] || event.parentEntityName || event.id || 'Survey response';
  }

  eventDate(event: UtilmonReportingEventGETData): string {
    return event.dateCreated?.formattedDate || event.dateLastUpdated?.formattedDate || '';
  }

  private loadSurveyEvents(): void {
    this.loading = true;
    this.error = '';
    const criteria: UtilmonReportingEventCriteria = {
      pageNumber: 1,
      pageSize: this.maxResults,
      isPaging: true,
      subject: this.currentSurvey.subject,
    };

    this.hcclService.findUtilmonReportingEvents(criteria).subscribe({
      next: (response) => {
        this.loading = false;
        this.events = response?.searchResults || [];
        if (!this.events.length) {
          this.selectedAbsoluteIndex = -1;
          this.activeBucketIndex = 0;
          return;
        }
        this.selectedAbsoluteIndex = 0;
        this.activeBucketIndex = 0;
      },
      error: () => {
        this.loading = false;
        this.events = [];
        this.selectedAbsoluteIndex = -1;
        this.error = 'Unable to load survey results.';
      },
    });
  }

  private extractSurveyData(event: UtilmonReportingEventGETData | null): Record<string, any> {
    if (!event) {
      return {};
    }
    const maybeObjects = [event.extraInfoJson, event.eventData]
      .map((raw) => this.parseUnknown(raw))
      .filter((x) => !!x);

    for (const obj of maybeObjects) {
      const mapJsonData = this.parseUnknown(obj['mapJsonData']);
      if (mapJsonData && Object.keys(mapJsonData).length > 0) {
        return mapJsonData;
      }
      if (this.looksLikeSurveyData(obj)) {
        return obj;
      }
    }

    return {};
  }

  private looksLikeSurveyData(obj: Record<string, any>): boolean {
    return (
      Object.prototype.hasOwnProperty.call(obj, 'currentAnswer') ||
      Object.prototype.hasOwnProperty.call(obj, 'findJobs') ||
      Object.prototype.hasOwnProperty.call(obj, 'timeSink')
    );
  }

  private parseUnknown(raw: any): Record<string, any> {
    if (!raw) {
      return {};
    }
    if (typeof raw === 'object') {
      return raw as Record<string, any>;
    }
    if (typeof raw !== 'string') {
      return {};
    }
    try {
      const parsed = JSON.parse(raw);
      return typeof parsed === 'object' && parsed ? parsed : {};
    } catch {
      return {};
    }
  }

  private asBoolean(raw: any): boolean {
    return raw === true || raw === 'true' || raw === 1 || raw === '1';
  }
}
