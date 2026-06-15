import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
  /**
   * When set, results are queried by applicationCode instead of an exact subject
   * match (used for surveys whose subject varies per submission, e.g. check-in).
   */
  applicationCode?: string;
}

interface InterestSubmissionSummary {
  interest: string;
  careers: string[];
  skills: string[];
  localStartingPoint: string | null;
  opportunityExamples: string[];
  nextSteps: string[];
  followUpPartner: string | null;
}

@Component({
  selector: 'app-survey-results-viewer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './survey-results-viewer.component.html',
  styleUrl: './survey-results-viewer.component.scss',
})
export class SurveyResultsViewerComponent implements OnInit {
  private readonly hcclService = inject(HcclService);
  private readonly route = inject(ActivatedRoute);

  private readonly pageBucketSize = 10;
  private readonly maxResults = 50;

  readonly surveys: Record<string, SurveyDefinition> = {
    checkin: {
      key: 'checkin',
      label: 'Event Check-in: JM Chamber AI Class — May 31, 2026',
      subject: 'Event Check-in',
      description: 'CLBHub sign-ups and AI course registrations captured at events.',
      applicationCode: 'EventCheckin',
    },
    ai_summit_signin: {
      key: 'ai_summit_signin',
      label: 'AI Summit Sign-in — Jun 10, 2026',
      subject: 'Survey: AI Summit Sign-in',
      description: 'AI Summit attendee sign-in and career exploration responses.',
    },
    ai_workplace_skill_summary: {
      key: 'ai_workplace_skill_summary',
      label: 'AI Workplace Skill Summary — Jun 10, 2026',
      subject: 'Survey: AI Workplace Skill Summary',
      description: 'Employer perspectives on baseline digital readiness for AI-era graduates.',
    },
    npo_job_finder: {
      key: 'npo_job_finder',
      label: 'Non-profit job search assistance — Mar 10, 2025',
      subject: 'Survey: Do you have a job for me?',
      description: 'Feedback on how nonprofit teams support job seekers.',
    },
    register_interest: {
      key: 'register_interest',
      label: 'Register your interest in CLBHub — Apr 29, 2026',
      subject: 'Survey: Register Interest',
      description: 'Pre-launch interest registration and email collection.',
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

  get isAiSummitSignin(): boolean {
    return this.surveyKey === 'ai_summit_signin';
  }

  get isAiWorkplaceSkillSummary(): boolean {
    return this.surveyKey === 'ai_workplace_skill_summary';
  }

  get aiSummitSubmissionSummaries(): InterestSubmissionSummary[] {
    return this.buildAiSummitSummaries(this.selectedSurveyData);
  }

  displayPrimaryIndustry(data: Record<string, any>): string {
    const sector = `${data['primaryIndustry'] || ''}`.trim();
    if (!sector) {
      return '—';
    }
    if (sector === 'Other') {
      const other = `${data['primaryIndustryOther'] || ''}`.trim();
      return other ? `Other: ${other}` : 'Other';
    }
    return sector;
  }

  getTierStringList(data: Record<string, any>, field: string, tier: string): string[] {
    const record = this.asRecord(data[field]);
    if (!record) {
      return [];
    }
    return this.asStringArray(record[tier]);
  }

  getTierStringValue(data: Record<string, any>, field: string, tier: string): string {
    const record = this.asRecord(data[field]);
    if (!record) {
      return '—';
    }
    const value = record[tier];
    if (value === undefined || value === null || `${value}`.trim() === '') {
      return '—';
    }
    return `${value}`;
  }

  getStringList(data: Record<string, any>, field: string): string[] {
    return this.asStringArray(data[field]);
  }

  formatContactConsent(value: unknown): string {
    if (value === 'yes') {
      return 'Yes';
    }
    if (value === 'no') {
      return 'No';
    }
    return '—';
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
      'captchaToken',
      ...this.answerOrder,
      ...Object.keys(this.helpOptionLabels),
      ...(this.isAiSummitSignin ? this.aiSummitReservedFields : []),
      ...(this.isAiWorkplaceSkillSummary ? this.aiWorkplaceSkillSummaryReservedFields : []),
    ]);
    const extras: Array<{ label: string; value: string }> = [];
    Object.keys(data).forEach((key) => {
      if (reserved.has(key)) {
        return;
      }
      const value = data[key];
      const formatted = this.formatDisplayValue(value);
      if (!formatted) {
        return;
      }
      extras.push({ label: key, value: formatted });
    });
    return extras;
  }

  private readonly aiSummitReservedFields = [
    'canContactForFeedback',
    'attendeeInterest',
    'aiEnabledCareers',
    'skillsToStart',
    'localStartingPoint',
    'opportunityExamples',
    'nextSteps',
    'followUpPartners',
  ];

  private readonly aiWorkplaceSkillSummaryReservedFields = [
    'wantsFollowUpSurvey',
    'canContactForFeedback',
    'ageBracket',
    'company',
    'email',
    'primaryIndustry',
    'primaryIndustryOther',
    'baselineEssentials',
    'graduatePreparedness',
    'expectedSupervision',
    'aiProficiencyImpact',
  ];

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
    if (this.isAiWorkplaceSkillSummary) {
      return map['email'] || event.parentEntityName || event.id || 'Survey response';
    }
    return map['name'] || map['email'] || event.parentEntityName || event.id || 'Survey response';
  }

  workplaceCompany(data: Record<string, any>): string {
    return `${data['company'] || data['organization'] || ''}`.trim() || '—';
  }

  wantsFollowUpSurvey(data: Record<string, any>): boolean {
    if (data['wantsFollowUpSurvey'] === true || data['wantsFollowUpSurvey'] === 'true') {
      return true;
    }
    if (`${data['canContactForFeedback'] || ''}` === 'yes') {
      return true;
    }
    return !!(`${data['email'] || ''}`.trim());
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
    };
    if (this.currentSurvey.applicationCode) {
      criteria.applicationCode = this.currentSurvey.applicationCode;
    } else {
      criteria.subject = this.currentSurvey.subject;
    }

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

  private buildAiSummitSummaries(data: Record<string, any>): InterestSubmissionSummary[] {
    const interests = this.getAiSummitInterests(data);
    return interests.map((interest) => ({
      interest,
      careers: this.getGroupedListValues(data['aiEnabledCareers'], interest),
      skills: this.getGroupedListValues(data['skillsToStart'], interest),
      localStartingPoint: this.getGroupedSingleValue(data['localStartingPoint'], interest),
      opportunityExamples: this.getGroupedListValues(data['opportunityExamples'], interest),
      nextSteps: this.getGroupedListValues(data['nextSteps'], interest),
      followUpPartner: this.getGroupedSingleValue(data['followUpPartners'], interest),
    }));
  }

  private getAiSummitInterests(data: Record<string, any>): string[] {
    const fromSelection = this.asStringArray(data['attendeeInterest']);
    if (fromSelection.length) {
      return fromSelection;
    }

    const keys = new Set<string>();
    for (const field of this.aiSummitReservedFields) {
      if (field === 'canContactForFeedback' || field === 'attendeeInterest') {
        continue;
      }
      this.collectInterestKeys(data[field], keys);
    }
    return Array.from(keys);
  }

  private collectInterestKeys(field: unknown, keys: Set<string>): void {
    const record = this.asRecord(field);
    if (!record) {
      return;
    }
    Object.keys(record).forEach((key) => keys.add(key));
  }

  private getGroupedListValues(field: unknown, interest: string): string[] {
    const record = this.asRecord(field);
    if (!record) {
      return [];
    }
    return this.asStringArray(record[interest]);
  }

  private getGroupedSingleValue(field: unknown, interest: string): string | null {
    const record = this.asRecord(field);
    if (!record) {
      return null;
    }
    const value = record[interest];
    if (value === undefined || value === null || `${value}`.trim() === '') {
      return null;
    }
    return `${value}`;
  }

  private asRecord(value: unknown): Record<string, unknown> | null {
    if (!value) {
      return null;
    }
    if (typeof value === 'object' && !Array.isArray(value)) {
      return value as Record<string, unknown>;
    }
    if (typeof value === 'string') {
      const parsed = this.parseUnknown(value);
      return Object.keys(parsed).length ? parsed : null;
    }
    return null;
  }

  private asStringArray(value: unknown): string[] {
    if (value === undefined || value === null) {
      return [];
    }
    if (Array.isArray(value)) {
      return value.map((item) => `${item}`.trim()).filter(Boolean);
    }
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
    return [];
  }

  private formatDisplayValue(value: unknown): string {
    if (value === undefined || value === null) {
      return '';
    }
    if (Array.isArray(value)) {
      return value
        .map((item) => this.formatDisplayValue(item))
        .filter(Boolean)
        .join(', ');
    }
    if (typeof value === 'object') {
      return Object.entries(value as Record<string, unknown>)
        .map(([key, nested]) => {
          const nestedValue = this.formatDisplayValue(nested);
          return nestedValue ? `${key}: ${nestedValue}` : key;
        })
        .filter(Boolean)
        .join('; ');
    }
    const text = `${value}`.trim();
    return text === '[object Object]' ? '' : text;
  }
}
