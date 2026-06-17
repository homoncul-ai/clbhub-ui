import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { HcclService, SurveyResponsePOSTData } from '@app/restsvc/hccl.service';
import { SimpleMessage, SimpleMessageList } from '@app/restsvc/common-request-service.model';
import { RecaptchaDisclosureComponent } from '@app/shared/components/recaptcha-disclosure/recaptcha-disclosure.component';
import { RecaptchaService } from '@app/shared/services/recaptcha.service';
import { SurveysPublicHeaderComponent } from '../components/surveys-public-header.component';

interface SurveyStepDefinition {
  step: number;
  pageIndex?: number;
  title: string;
  subtitle?: string;
  selectionMode?: 'none' | 'single' | 'multiple';
}

interface InterestOptionSection {
  interest: string;
  options: string[];
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
  selector: 'app-survey-ai-summit-signin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SimpleMessagesSectionComponent,
    SurveysPublicHeaderComponent,
    RecaptchaDisclosureComponent,
  ],
  templateUrl: './survey-ai-summit-signin.component.html',
  styleUrl: './survey-ai-summit-signin.component.scss',
})
export class SurveyAiSummitSigninComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly hcclService = inject(HcclService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly recaptchaService = inject(RecaptchaService);

  private static readonly CONTACT_CONSENT_STORAGE_KEY = 'ai-summit-signin-contact-consent';

  readonly surveyTitle = 'AI Summit Sign-in';
  readonly surveyCode = 'ai_summit_signin';
  readonly pagePath = '/public/surveys/ai-summit-signin';

  readonly steps: SurveyStepDefinition[] = [
    { step: 1, title: 'Intro', subtitle: 'Haverhill AI Summit — responsible preparation for the AI economy.' },
    { step: 2, pageIndex: 0, title: 'General Info', selectionMode: 'none' },
    { step: 3, pageIndex: 1, title: 'Attendee Interest', subtitle: 'Select multiple', selectionMode: 'multiple' },
    { step: 4, pageIndex: 2, title: 'Example AI-Enabled Careers', subtitle: 'Select multiple', selectionMode: 'multiple' },
    { step: 5, pageIndex: 3, title: 'Skills to Start', subtitle: 'Select multiple', selectionMode: 'multiple' },
    { step: 6, pageIndex: 4, title: 'Best Local Starting Point', subtitle: 'Select one', selectionMode: 'single' },
    { step: 7, pageIndex: 5, title: 'Opportunity Example', subtitle: 'Select multiple', selectionMode: 'multiple' },
    { step: 8, pageIndex: 6, title: 'One Next Step', subtitle: 'Select multiple', selectionMode: 'multiple' },
    { step: 9, pageIndex: 7, title: 'Results, Course of Action & Follow-Up Partner', subtitle: 'Select one', selectionMode: 'single' },
    { step: 10, title: 'Submit Results', subtitle: 'Review and submit your responses.' },
  ];

  readonly totalSteps = this.steps.length;
  readonly stepNumbers = this.steps.map((s) => s.step);

  currentStep = 1;
  submitting = false;
  submitted = false;
  contactConsentAtSubmit = '';
  messagesList: SimpleMessageList = { messages: [] };

  /** Placeholder option lists — content to be filled in per page. */
  readonly attendeeInterestOptions: string[] = [
    'Not sure / just getting started',
    'Business, office work, or entrepreneurship',
    'Manufacturing, engineering, or skilled trades',
    'Information technology, software, or cybersecurity',
    'Healthcare or public service',
    'Education, teaching, or student support',
    'Creative work, marketing, or communications',
    'Internship, job, or real-world experience',
  ];

  /** Example AI-enabled careers keyed by attendee interest (page 4). */
  readonly interestCareerOptions: Record<string, string[]> = {
    'Not sure / just getting started': [
      'AI-aware office assistant',
      'Customer service representative',
    ],
    'Business, office work, or entrepreneurship': [
      'Business analyst',
      'Project coordinator',
    ],
    'Manufacturing, engineering, or skilled trades': [
      'Manufacturing technician',
      'Automation technician',
    ],
    'Information technology, software, or cybersecurity': [
      'IT support specialist',
      'Software developer',
    ],
    'Healthcare or public service': [
      'Healthcare data support specialist',
      'Administrative support specialist',
    ],
    'Education, teaching, or student support': [
      'AI-informed educator',
      'Instructional support specialist',
    ],
    'Creative work, marketing, or communications': [
      'Graphic designer',
      'Digital marketing specialist',
    ],
    'Internship, job, or real-world experience': [
      'Student intern',
      'Co-op student',
      'Apprentice',
    ],
  };

  /** Skills to start keyed by attendee interest (page 5). */
  readonly interestSkillsOptions: Record<string, string[]> = {
    'Not sure / just getting started': [
      'AI basics',
      'Prompting',
      'Responsible use',
    ],
    'Business, office work, or entrepreneurship': [
      'AI productivity',
      'Communication',
    ],
    'Manufacturing, engineering, or skilled trades': [
      'Technical skills',
      'Digital tools',
      'Quality control',
    ],
    'Information technology, software, or cybersecurity': [
      'Digital literacy',
      'Programming',
    ],
    'Healthcare or public service': [
      'AI literacy',
      'Privacy awareness',
      'Communication',
    ],
    'Education, teaching, or student support': [
      'AI literacy',
      'Responsible use',
    ],
    'Creative work, marketing, or communications': [
      'Prompting',
      'Writing',
      'Visual design',
    ],
    'Internship, job, or real-world experience': [
      'Workplace communication',
      'Teamwork',
    ],
  };

  /** Best local starting point keyed by attendee interest (page 6). */
  readonly interestLocalStartingPointOptions: Record<string, string[]> = {
    'Not sure / just getting started': [
      'Google AI Essentials',
      'MakeIT Haverhill',
    ],
    'Business, office work, or entrepreneurship': [
      'MakeIT Haverhill',
      'NECC',
      'UMass Lowell',
    ],
    'Manufacturing, engineering, or skilled trades': [
      'Whittier Vo-Tech',
      'Haverhill High School CTE',
      'NECC',
    ],
    'Information technology, software, or cybersecurity': [
      'Haverhill High School CTE',
      'NECC',
      'Merrimack College',
      'UMass Lowell',
    ],
    'Healthcare or public service': [
      'NECC',
      'Gateway Academy',
      'MakeIT Haverhill',
    ],
    'Education, teaching, or student support': [
      'Merrimack College',
      'UMass Lowell',
      'Haverhill Public Schools',
    ],
    'Creative work, marketing, or communications': [
      'Haverhill High School CTE',
      'MakeIT Haverhill',
      'NECC',
    ],
    'Internship, job, or real-world experience': [
      'HP3',
      'NECC',
      'Haverhill High School',
      'UMass Lowell',
      'Merrimack College',
    ],
  };

  /** Opportunity examples keyed by attendee interest (page 7). */
  readonly interestOpportunityExampleOptions: Record<string, string[]> = {
    'Not sure / just getting started': [
      'Beginner AI course with local support',
    ],
    'Business, office work, or entrepreneurship': [
      'AI practice cohort',
      'Business analytics',
      'Career advising',
    ],
    'Manufacturing, engineering, or skilled trades': [
      'Technical program',
      'Adult training',
      'CTE pathway',
      'Internship',
    ],
    'Information technology, software, or cybersecurity': [
      'IT/CS course',
      'Certificate program',
      'Degree pathway',
      'Internship',
      'Co-op',
    ],
    'Healthcare or public service': [
      'Career advising',
      'Workforce training',
      'Digital skills support',
    ],
    'Education, teaching, or student support': [
      'Responsible AI resources',
      'Educator workshop',
      'Graduate pathway',
    ],
    'Creative work, marketing, or communications': [
      'Design and communications pathway',
      'AI practice lab',
      'Internship',
    ],
    'Internship, job, or real-world experience': [
      'Internship',
      'Co-op',
      'Job shadow',
      'Work-based learning',
      'Career services',
    ],
  };

  /** Next steps keyed by attendee interest (page 8). */
  readonly interestNextStepOptions: Record<string, string[]> = {
    'Not sure / just getting started': [
      'Enroll in AI Essentials',
      'Join a beginner cohort',
    ],
    'Business, office work, or entrepreneurship': [
      'Choose one course',
      'Advisor meeting',
      'Applied project',
    ],
    'Manufacturing, engineering, or skilled trades': [
      'Request program information',
      'Schedule a tour',
      'Work-based learning',
    ],
    'Information technology, software, or cybersecurity': [
      'Meet with an advisor',
      'Apply to one program',
    ],
    'Healthcare or public service': [
      'Select a training pathway and request follow-up',
    ],
    'Education, teaching, or student support': [
      'Request resources',
      'Training',
      'Faculty connection',
    ],
    'Creative work, marketing, or communications': [
      'Complete one sample project and explore a pathway',
    ],
    'Internship, job, or real-world experience': [
      'Submit interest and identify one follow-up owner',
    ],
  };

  /** Follow-up partners keyed by attendee interest (page 9). */
  readonly interestFollowUpPartnerOptions: Record<string, string[]> = {
    'Not sure / just getting started': [
      'MakeIT Haverhill',
      'Gateway Academy',
    ],
    'Business, office work, or entrepreneurship': [
      'MakeIT Haverhill',
      'NECC',
      'UMass Lowell',
    ],
    'Manufacturing, engineering, or skilled trades': [
      'Whittier Vo-Tech',
      'Haverhill High School',
      'NECC',
      'HP3',
    ],
    'Information technology, software, or cybersecurity': [
      'Haverhill High School',
      'NECC',
      'Merrimack College',
      'UMass Lowell',
    ],
    'Healthcare or public service': [
      'NECC',
      'Gateway Academy',
      'MakeIT Haverhill',
    ],
    'Education, teaching, or student support': [
      'Merrimack College',
      'UMass Lowell',
      'Haverhill Public Schools',
    ],
    'Creative work, marketing, or communications': [
      'Haverhill High School',
      'MakeIT Haverhill',
      'NECC',
      'HP3',
    ],
    'Internship, job, or real-world experience': [
      'HP3',
      'NECC',
      'Haverhill High School',
      'UMass Lowell',
      'Merrimack College',
    ],
  };

  selectedAttendeeInterests = new Set<string>();
  selectedAiEnabledCareers = new Set<string>();
  selectedSkillsToStart = new Set<string>();
  selectedLocalStartingPoints = new Map<string, string>();
  selectedOpportunityExamples = new Set<string>();
  selectedNextSteps = new Set<string>();
  selectedFollowUpPartners = new Map<string, string>();

  readonly form = this.fb.nonNullable.group({
    name: [''],
    organization: [''],
    email: [''],
    canContactForFeedback: [''],
  });

  ngOnInit(): void {
    const pageParam = this.route.snapshot.queryParamMap.get('page');
    if (pageParam === 'thank-you') {
      this.showThankYouPage(this.readStoredContactConsent());
    } else {
      const initialPage = this.parsePageParam(pageParam);
      if (initialPage !== null) {
        this.currentStep = initialPage;
      } else {
        this.syncPageQueryParam(this.currentStep);
      }
    }

    this.route.queryParamMap.subscribe((params) => {
      const rawPage = params.get('page');
      if (rawPage === 'thank-you') {
        this.showThankYouPage(this.readStoredContactConsent());
        return;
      }

      const page = this.parsePageParam(rawPage);
      if (page !== null && page !== this.currentStep && !this.submitted) {
        this.setMessages([]);
        this.currentStep = page;
        this.scrollToTop();
      }
    });

    void this.recaptchaService.preload();
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, 0);
  }

  get optedInToContact(): boolean {
    return this.contactConsentAtSubmit === 'yes';
  }

  /** Page 4 — filtered by page 3 selections; all sections when none selected. */
  get aiEnabledCareerSections(): InterestOptionSection[] {
    return this.buildInterestOptionSections(this.interestCareerOptions);
  }

  /** Page 5 — filtered by page 3 selections; all sections when none selected. */
  get skillsToStartSections(): InterestOptionSection[] {
    return this.buildInterestOptionSections(this.interestSkillsOptions);
  }

  /** Page 6 — filtered by page 3 selections; all sections when none selected. */
  get localStartingPointSections(): InterestOptionSection[] {
    return this.buildInterestOptionSections(this.interestLocalStartingPointOptions);
  }

  /** Page 7 — filtered by page 3 selections; all sections when none selected. */
  get opportunityExampleSections(): InterestOptionSection[] {
    return this.buildInterestOptionSections(this.interestOpportunityExampleOptions);
  }

  /** Page 8 — filtered by page 3 selections; all sections when none selected. */
  get nextStepSections(): InterestOptionSection[] {
    return this.buildInterestOptionSections(this.interestNextStepOptions);
  }

  /** Page 9 — filtered by page 3 selections; all sections when none selected. */
  get followUpPartnerSections(): InterestOptionSection[] {
    return this.buildInterestOptionSections(this.interestFollowUpPartnerOptions);
  }

  /** Page 10 — one block per interest selected on page 3. */
  get interestSubmissionSummaries(): InterestSubmissionSummary[] {
    const interests = this.selectedAttendeeInterests.size
      ? this.attendeeInterestOptions.filter((interest) => this.selectedAttendeeInterests.has(interest))
      : [];

    return interests.map((interest) => ({
      interest,
      careers: this.getSelectionsForInterest(this.selectedAiEnabledCareers, interest),
      skills: this.getSelectionsForInterest(this.selectedSkillsToStart, interest),
      localStartingPoint: this.selectedLocalStartingPoints.get(interest) ?? null,
      opportunityExamples: this.getSelectionsForInterest(this.selectedOpportunityExamples, interest),
      nextSteps: this.getSelectionsForInterest(this.selectedNextSteps, interest),
      followUpPartner: this.selectedFollowUpPartners.get(interest) ?? null,
    }));
  }

  get currentStepDefinition(): SurveyStepDefinition {
    return this.steps[this.currentStep - 1];
  }

  get isIntroStep(): boolean {
    return this.currentStep === 1;
  }

  get isSubmitStep(): boolean {
    return this.currentStep === this.totalSteps;
  }

  nextStep(): void {
    this.goToStep(this.currentStep + 1);
  }

  prevStep(): void {
    this.goToStep(this.currentStep - 1);
  }

  canNavigateTo(step: number): boolean {
    return !this.submitted && step >= 1 && step <= this.totalSteps && step !== this.currentStep;
  }

  goToStep(step: number): void {
    if (this.submitted) {
      return;
    }

    const target = Math.min(Math.max(step, 1), this.totalSteps);
    if (target === this.currentStep) {
      return;
    }

    this.setMessages([]);
    this.currentStep = target;
    this.syncPageQueryParam(target);
    this.scrollToTop();
  }

  interestSelectionKey(interest: string, option: string): string {
    return `${interest}|||${option}`;
  }

  isInterestOptionSelected(set: Set<string>, interest: string, option: string): boolean {
    return set.has(this.interestSelectionKey(interest, option));
  }

  toggleInterestOption(set: Set<string>, interest: string, option: string): void {
    this.toggleMultiSelection(set, this.interestSelectionKey(interest, option));
  }

  formatInterestGroupedSummary(set: Set<string>): string {
    if (!set.size) {
      return '—';
    }

    const grouped = this.groupInterestSelections(set);
    return Array.from(grouped.entries())
      .map(([interest, options]) => `${interest}: ${options.join(', ')}`)
      .join('; ');
  }

  formatAiEnabledCareersSummary(): string {
    return this.formatInterestGroupedSummary(this.selectedAiEnabledCareers);
  }

  formatSkillsToStartSummary(): string {
    return this.formatInterestGroupedSummary(this.selectedSkillsToStart);
  }

  isLocalStartingPointSelected(interest: string, option: string): boolean {
    return this.selectedLocalStartingPoints.get(interest) === option;
  }

  selectLocalStartingPoint(interest: string, option: string): void {
    this.selectedLocalStartingPoints.set(interest, option);
  }

  isFollowUpPartnerSelected(interest: string, option: string): boolean {
    return this.selectedFollowUpPartners.get(interest) === option;
  }

  selectFollowUpPartner(interest: string, option: string): void {
    this.selectedFollowUpPartners.set(interest, option);
  }

  formatLocalStartingPointSummary(): string {
    if (!this.selectedLocalStartingPoints.size) {
      return '—';
    }

    return Array.from(this.selectedLocalStartingPoints.entries())
      .map(([interest, option]) => `${interest}: ${option}`)
      .join('; ');
  }

  formatOpportunityExamplesSummary(): string {
    return this.formatInterestGroupedSummary(this.selectedOpportunityExamples);
  }

  formatNextStepsSummary(): string {
    return this.formatInterestGroupedSummary(this.selectedNextSteps);
  }

  formatFollowUpPartnersSummary(): string {
    if (!this.selectedFollowUpPartners.size) {
      return '—';
    }

    return Array.from(this.selectedFollowUpPartners.entries())
      .map(([interest, partner]) => `${interest}: ${partner}`)
      .join('; ');
  }

  toggleMultiSelection(set: Set<string>, value: string): void {
    if (set.has(value)) {
      set.delete(value);
    } else {
      set.add(value);
    }
  }

  isSelected(set: Set<string>, value: string): boolean {
    return set.has(value);
  }

  formatSelectionSummary(values: Set<string>): string {
    return values.size ? Array.from(values).join(', ') : '—';
  }

  formatContactConsent(value: string): string {
    if (value === 'yes') {
      return 'Yes';
    }
    if (value === 'no') {
      return 'No';
    }
    return '—';
  }

  async submit(): Promise<void> {
    this.submitting = true;
    this.setMessages([]);

    let captchaToken: string;
    try {
      captchaToken = await this.recaptchaService.execute('ai_summit_signin');
    } catch {
      this.submitting = false;
      this.setMessages([{ message: 'Security verification failed. Please try again.', severity: 1 }]);
      return;
    }

    const value = this.form.getRawValue();
    const surveyData: Record<string, unknown> = {
      surveyCode: this.surveyCode,
      pagePath: this.pagePath,
      name: value.name.trim(),
      organization: value.organization.trim(),
      email: value.email.trim(),
      canContactForFeedback: value.canContactForFeedback,
      captchaToken,
      attendeeInterest: Array.from(this.selectedAttendeeInterests),
      aiEnabledCareers: this.formatInterestGroupedForSubmit(this.selectedAiEnabledCareers),
      skillsToStart: this.formatInterestGroupedForSubmit(this.selectedSkillsToStart),
      localStartingPoint: Object.fromEntries(this.selectedLocalStartingPoints),
      opportunityExamples: this.formatInterestGroupedForSubmit(this.selectedOpportunityExamples),
      nextSteps: this.formatInterestGroupedForSubmit(this.selectedNextSteps),
      followUpPartners: Object.fromEntries(this.selectedFollowUpPartners),
    };

    const payload: SurveyResponsePOSTData = {
      surveyCode: this.surveyCode,
      subject: `Survey: ${this.surveyTitle}`,
      emailFrom: value.email.trim(),
      mapJsonData: surveyData,
    };

    this.hcclService
      .saveSurveyResponse(payload)
      .pipe(finalize(() => (this.submitting = false)))
      .subscribe({
        next: (response) => {
          this.messagesList = response?.messages || { messages: [] };
          this.contactConsentAtSubmit = value.canContactForFeedback;
          sessionStorage.setItem(
            SurveyAiSummitSigninComponent.CONTACT_CONSENT_STORAGE_KEY,
            this.contactConsentAtSubmit,
          );
          this.showThankYouPage(this.contactConsentAtSubmit);
          void this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { page: 'thank-you' },
            replaceUrl: true,
          });
        },
        error: (error) => {
          const fallback = { message: 'Unable to submit. Please try again later.', severity: 1 };
          this.messagesList = error?.error?.messages || { messages: [fallback] };
        },
      });
  }

  private showThankYouPage(contactConsent: string): void {
    this.submitted = true;
    this.contactConsentAtSubmit = contactConsent;
    this.scrollToTop();
  }

  private readStoredContactConsent(): string {
    return sessionStorage.getItem(SurveyAiSummitSigninComponent.CONTACT_CONSENT_STORAGE_KEY) ?? '';
  }

  private buildInterestOptionSections(optionsByInterest: Record<string, string[]>): InterestOptionSection[] {
    const interests = this.selectedAttendeeInterests.size
      ? this.attendeeInterestOptions.filter((interest) => this.selectedAttendeeInterests.has(interest))
      : this.attendeeInterestOptions;

    return interests.map((interest) => ({
      interest,
      options: optionsByInterest[interest] ?? [],
    }));
  }

  private getSelectionsForInterest(set: Set<string>, interest: string): string[] {
    const prefix = `${interest}|||`;
    return Array.from(set)
      .filter((key) => key.startsWith(prefix))
      .map((key) => key.slice(prefix.length));
  }

  private groupInterestSelections(set: Set<string>): Map<string, string[]> {
    const grouped = new Map<string, string[]>();
    for (const key of set) {
      const [interest, option] = key.split('|||');
      if (!interest || !option) {
        continue;
      }
      const options = grouped.get(interest) ?? [];
      options.push(option);
      grouped.set(interest, options);
    }
    return grouped;
  }

  private formatInterestGroupedForSubmit(set: Set<string>): Record<string, string[]> {
    const grouped: Record<string, string[]> = {};
    for (const [interest, options] of this.groupInterestSelections(set)) {
      grouped[interest] = options;
    }
    return grouped;
  }

  private parsePageParam(raw: string | null): number | null {
    if (!raw) {
      return null;
    }
    const page = Number.parseInt(raw, 10);
    if (Number.isNaN(page) || page < 1 || page > this.totalSteps) {
      return null;
    }
    return page;
  }

  private syncPageQueryParam(step: number): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: step },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private setMessages(messages: SimpleMessage[]): void {
    this.messagesList = { messages };
  }

  private scrollToTop(): void {
    setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }), 0);
  }
}
