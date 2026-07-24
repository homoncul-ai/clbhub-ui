import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { SimpleMessage, SimpleMessageList } from '@app/restsvc/common-request-service.model';
import { HcclService, SurveyResponsePOSTData } from '@app/restsvc/hccl.service';
import { RecaptchaDisclosureComponent } from '@app/shared/components/recaptcha-disclosure/recaptcha-disclosure.component';
import { RadioChoiceGridComponent } from '@app/components/_global/radio-choice-grid/radio-choice-grid.component';
import { RecaptchaService } from '@app/shared/services/recaptcha.service';
import { SurveysPublicHeaderComponent } from '../components/surveys-public-header.component';
import {
  SurveyDraftV1,
  arrayToSet,
  clearSurveyDraft,
  loadSurveyDraft,
  saveSurveyDraft,
  setToArray,
  surveyDraftHasProgress,
} from '../utils/survey-draft-storage';

interface SurveyStepDefinition {
  step: number;
  title: string;
  subtitle?: string;
}

interface SurveyOption {
  id: string;
  label: string;
}

@Component({
  selector: 'app-survey-parent-career-support-check',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SimpleMessagesSectionComponent,
    SurveysPublicHeaderComponent,
    RecaptchaDisclosureComponent,
    RadioChoiceGridComponent,
  ],
  templateUrl: './survey-parent-career-support-check.component.html',
  styleUrl: './survey-parent-career-support-check.component.scss',
})
export class SurveyParentCareerSupportCheckComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly hcclService = inject(HcclService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly recaptchaService = inject(RecaptchaService);

  private static readonly CONTACT_CONSENT_STORAGE_KEY = 'parent-career-support-contact-consent';
  private static readonly DRAFT_SAVE_DEBOUNCE_MS = 250;

  private draftSaveTimer: ReturnType<typeof setTimeout> | null = null;

  readonly captchaEnabled = true;
  readonly surveyTitle = 'Parent Career Support Check';
  readonly surveyCode = 'parent_career_support_check';
  readonly pagePath = '/public/surveys/parent-career-support-check';
  readonly maxWorkLifeAspirationSelections = 10;

  readonly steps: SurveyStepDefinition[] = [
    { step: 1, title: 'Intro', subtitle: 'Learn about the survey and what you will answer.' },
    { step: 2, title: 'About You and the Young Person', subtitle: 'Share a little about your role and the young person you support.' },
    { step: 3, title: 'Your Involvement in Career Exploration', subtitle: 'Tell us how you help with career exploration and where you get information.' },
    { step: 4, title: 'Youth\'s Exploration', subtitle: 'Share how the young person may explore careers over the next few months.' },
    { step: 5, title: 'Your Confidence Supporting Career Exploration', subtitle: 'Tell us where you feel confident and what challenges you face.' },
    { step: 6, title: 'Technology & AI', subtitle: 'Share how the young person uses AI and your thoughts on it.' },
    { step: 7, title: 'Ideas & Feedback', subtitle: 'Share what would help us improve CLBHub for families and youth.' },
    { step: 8, title: 'Follow-up', subtitle: 'Let us know if we can contact you in the future.' },
    { step: 9, title: 'Submit Results', subtitle: 'Review and submit your responses.' },
  ];

  readonly totalSteps = this.steps.length;
  readonly stepNumbers = this.steps.map((step) => step.step);

  readonly relationshipOptions: SurveyOption[] = [
    { id: 'parent', label: 'Parent' },
    { id: 'guardian', label: 'Guardian' },
    { id: 'grandparent', label: 'Grandparent' },
    { id: 'foster_parent', label: 'Foster parent' },
    { id: 'friend', label: 'Friend' },
    { id: 'counsellor_advisor', label: 'Counsellor/Advisor' },
    { id: 'coach', label: 'Coach' },
    { id: 'employer', label: 'Employer' },
    { id: 'other', label: 'Other' },
  ];

  readonly youngPersonStatusOptions: SurveyOption[] = [
    { id: 'high_school', label: 'High school student' },
    { id: 'college_postsecondary', label: 'College or postsecondary student' },
    { id: 'working', label: 'Working (part-time or full-time)' },
    { id: 'not_school_or_working', label: 'Not currently in school or working' },
    { id: 'other', label: 'Other' },
  ];

  readonly youngPersonWorkStatusOptions: SurveyOption[] = [
    { id: 'full_time', label: 'Working full-time' },
    { id: 'part_time', label: 'Working part-time' },
    { id: 'self_employed', label: 'Self-employed or freelancing' },
    { id: 'looking_for_work', label: 'Looking for work' },
    { id: 'not_working', label: 'Not currently working' },
    { id: 'unable_to_work', label: 'Unable to work at this time' },
    { id: 'other', label: 'Other' },
  ];

  readonly youngPersonEducationStatusOptions: SurveyOption[] = [
    { id: 'high_school', label: 'High school student' },
    { id: 'college_university', label: 'College or university student' },
    { id: 'trade_school', label: 'Trade school or vocational program' },
    { id: 'apprenticeship', label: 'Apprenticeship' },
    { id: 'other_postsecondary', label: 'Other postsecondary education or certification program' },
    { id: 'not_enrolled', label: 'Not currently enrolled in school or training' },
    { id: 'graduated', label: 'Graduated and not currently enrolled' },
    { id: 'other', label: 'Other' },
  ];

  readonly youngPersonWorkGoalsOptions: SurveyOption[] = [
    { id: 'active_specific', label: 'They are actively working toward a specific career.' },
    { id: 'few_deciding', label: 'They have a few careers in mind but are still deciding.' },
    { id: 'exploring_many', label: 'They are exploring many different career options.' },
    { id: 'any_job', label: 'They are mainly focused on finding any job right now.' },
    { id: 'unsure_pursue', label: 'They are unsure what type of work they want to pursue.' },
    { id: 'not_thinking', label: 'They are not currently thinking about work or careers.' },
    { id: 'not_sure', label: "I'm not sure." },
  ];

  readonly youngPersonEducationGoalsOptions: SurveyOption[] = [
    { id: 'four_year', label: 'Attend a four-year college or university' },
    { id: 'two_year', label: 'Attend a two-year/community college' },
    { id: 'trade_school', label: 'Complete a trade school or vocational program' },
    { id: 'apprenticeship', label: 'Complete an apprenticeship' },
    { id: 'certifications', label: 'Earn certifications or industry credentials' },
    { id: 'military', label: 'Join the military' },
    { id: 'workforce', label: 'Enter the workforce after finishing current schooling' },
    { id: 'still_exploring', label: 'Still exploring different education or training paths' },
    { id: 'not_sure', label: 'Not sure' },
    { id: 'other', label: 'Other' },
  ];

  readonly involvementFrequencyOptions: SurveyOption[] = [
    { id: 'almost_every_day', label: 'We talk about it almost every day.' },
    { id: 'few_times_week', label: 'We talk about it a few times a week.' },
    { id: 'every_few_weeks', label: 'We talk about it every few weeks.' },
    { id: 'only_when_something_comes_up', label: 'We talk about it only when something comes up (applications, graduation, jobs, etc.).' },
    { id: 'rarely', label: 'We rarely talk about it.' },
    { id: 'havent_talked', label: "We haven't really talked about it." },
  ];

  readonly workLifeAspirationGroups: { title: string; options: SurveyOption[] }[] = [
    {
      title: 'Career stability',
      options: [
        { id: 'stable_employment', label: 'Stable employment' },
        { id: 'good_income', label: 'Good income' },
        { id: 'benefits', label: 'Benefits' },
      ],
    },
    {
      title: 'Personal growth',
      options: [
        { id: 'meaningful_work', label: 'Meaningful work' },
        { id: 'learning_opportunities', label: 'Learning opportunities' },
        { id: 'career_advancement', label: 'Career advancement' },
      ],
    },
    {
      title: 'Lifestyle',
      options: [
        { id: 'work_life_balance', label: 'Work-life balance' },
        { id: 'flexible_schedule', label: 'Flexible schedule' },
        { id: 'low_stress', label: 'Low stress' },
      ],
    },
    {
      title: 'Environment',
      options: [
        { id: 'respectful_workplace', label: 'Respectful workplace' },
        { id: 'inclusive_culture', label: 'Inclusive culture' },
        { id: 'safe_workplace', label: 'Safe workplace' },
      ],
    },
    {
      title: 'Future',
      options: [
        { id: 'entrepreneurship', label: 'Entrepreneurship' },
        { id: 'geographic_stability', label: 'Geographic stability' },
      ],
    },
  ];

  readonly workLifeAspirationOptions: SurveyOption[] = this.workLifeAspirationGroups.flatMap((group) => group.options);

  readonly involvementPreferenceOptions: SurveyOption[] = [
    { id: 'discuss_careers', label: 'Discuss careers' },
    { id: 'explore_education_training', label: 'Explore education/training' },
    { id: 'find_jobs_internships', label: 'Find jobs/internships' },
    { id: 'review_applications_resumes', label: 'Review applications/resumes' },
    { id: 'connect_with_mentors', label: 'Connect with mentors' },
    { id: 'encourage_exploration', label: 'Encourage exploration' },
    { id: 'other', label: 'Other' },
  ];

  readonly informationSourceOptions: SurveyOption[] = [
    { id: 'school_counselor', label: 'School counselors or school staff' },
    { id: 'teachers', label: 'Teachers' },
    { id: 'online_searches', label: 'Online searches' },
    { id: 'social_media', label: 'Social media' },
    { id: 'college_websites', label: 'College or university websites' },
    { id: 'employer_websites', label: 'Employer or company websites' },
    { id: 'friends_family', label: 'Friends or family' },
    { id: 'community_orgs', label: 'Community organizations or nonprofits' },
    { id: 'employers_professionals', label: 'Employers or professionals' },
    { id: 'career_fairs', label: 'Career fairs or community events' },
    { id: 'career_portal_clbhub', label: 'Career portal like "clbhub.org"' },
    { id: 'other', label: 'Other' },
  ];

  readonly youthExplorationOutlookOptions: SurveyOption[] = [
    { id: 'start_exploring', label: "They'll probably start exploring careers for the first time." },
    { id: 'continue_casually', label: "They'll continue casually exploring different options." },
    { id: 'actively_research', label: "They'll actively research careers, education, or training opportunities." },
    { id: 'concrete_steps', label: "They'll take concrete steps toward a specific career goal (applications, internships, certifications, etc.)." },
    { id: 'stay_same', label: "They'll probably stay about where they are now." },
    { id: 'not_sure', label: "I'm not sure." },
  ];

  readonly youthInvestigationAreaOptions: SurveyOption[] = [
    { id: 'career_options', label: 'Career options' },
    { id: 'college_planning', label: 'College planning' },
    { id: 'trade_schools', label: 'Trade schools and vocational programs' },
    { id: 'apprenticeships', label: 'Apprenticeships' },
    { id: 'internships', label: 'Internships' },
    { id: 'job_searching', label: 'Job searching' },
    { id: 'financial_aid', label: 'Financial aid or paying for education' },
    { id: 'scholarships', label: 'Scholarships' },
    { id: 'resume_interview', label: 'Resume or interview preparation' },
    { id: 'labor_market', label: 'Labor market or in-demand careers' },
    { id: 'other', label: 'Other' },
  ];

  readonly confidenceRows = [
    { key: 'confidenceExploringCareers', label: 'Exploring careers' },
    { key: 'confidenceEducationTraining', label: 'Education/training options' },
    { key: 'confidenceWorkExperiences', label: 'Finding work experiences/jobs' },
    { key: 'confidenceTrustworthyInfo', label: 'Finding trustworthy information' },
  ] as const;

  readonly confidenceOptions = [
    { id: 'very_confident', label: 'Very confident' },
    { id: 'somewhat_confident', label: 'Somewhat confident' },
    { id: 'not_very_confident', label: 'Not very confident' },
    { id: 'not_confident_at_all', label: 'Not confident at all' },
  ];

  readonly biggestChallengeOptions: SurveyOption[] = [
    { id: 'reliable_information', label: 'Finding reliable information' },
    { id: 'available_opportunities', label: 'Knowing what opportunities are available' },
    { id: 'limited_time', label: 'Limited time' },
    { id: 'financial_concerns', label: 'Financial concerns' },
    { id: 'keeping_them_motivated', label: 'Keeping them motivated or interested' },
    { id: 'knowing_how_to_guide', label: 'Knowing how to guide them' },
    { id: 'limited_opportunities', label: 'Limited opportunities nearby' },
    { id: 'other', label: 'Other' },
  ];

  readonly aiUseOptions: SurveyOption[] = [
    { id: 'frequently', label: 'Yes, frequently' },
    { id: 'few_times', label: 'Yes, a few times' },
    { id: 'interested', label: 'No, but they are interested' },
    { id: 'no', label: 'No' },
    { id: 'not_sure', label: "I'm not sure" },
  ];

  readonly aiFeelingOptions: SurveyOption[] = [
    { id: 'very_positive', label: 'Very positive' },
    { id: 'somewhat_positive', label: 'Somewhat positive' },
    { id: 'neutral', label: 'Neutral' },
    { id: 'somewhat_concerned', label: 'Somewhat concerned' },
    { id: 'very_concerned', label: 'Very concerned' },
  ];

  readonly aiOpinionOptions: SurveyOption[] = [
    { id: 'discover_options', label: 'It helps young people discover new career options.' },
    { id: 'saves_time', label: 'It saves time when researching careers.' },
    { id: 'useful_information', label: 'It provides useful information.' },
    { id: 'encourages_independent_exploration', label: 'It encourages independent exploration.' },
    { id: 'concerned_inaccurate_info', label: "I'm concerned about inaccurate information." },
    { id: 'concerned_reliance', label: "I'm concerned the young person may rely on it too much." },
    { id: 'dont_know_enough', label: "I don't know enough about AI to have an opinion." },
    { id: 'other', label: 'Other' },
  ];

  readonly clbHubAccountInterestOptions: SurveyOption[] = [
    { id: 'yes', label: 'Yes, please send me information.' },
    { id: 'maybe', label: "Maybe, I'd like to learn more." },
    { id: 'no', label: 'No, thank you.' },
  ];

  currentStep = 1;
  submitting = false;
  submitted = false;
  contactConsentAtSubmit = '';
  messagesList: SimpleMessageList = { messages: [] };
  showResumePrompt = false;
  pendingDraft: SurveyDraftV1 | null = null;

  selectedWorkLifeAspirations = new Set<string>();
  selectedInvolvementPreferences = new Set<string>();
  selectedInformationSources = new Set<string>();
  selectedYouthInvestigationAreas = new Set<string>();
  selectedAiOpinion = new Set<string>();

  readonly form = this.fb.nonNullable.group({
    relationship: [''],
    relationshipOther: [''],
    youngPersonStatus: [''],
    youngPersonStatusOther: [''],
    youngPersonWorkStatus: [''],
    youngPersonWorkStatusOther: [''],
    youngPersonEducationStatus: [''],
    youngPersonEducationStatusOther: [''],
    youngPersonWorkGoals: [''],
    youngPersonEducationGoals: [''],
    youngPersonEducationGoalsOther: [''],
    involvementFrequency: [''],
    involvementPreferencesOther: [''],
    informationSourcesOther: [''],
    youthExplorationOutlook: [''],
    youthInvestigationAreasOther: [''],
    biggestChallenge: [''],
    biggestChallengeOther: [''],
    confidenceExploringCareers: [''],
    confidenceEducationTraining: [''],
    confidenceWorkExperiences: [''],
    confidenceTrustworthyInfo: [''],
    aiUse: [''],
    aiFeelingAboutYouth: [''],
    aiOpinionOther: [''],
    aiThoughts: [''],
    clbHubImprovement: [''],
    additionalFeedback: [''],
    followUpConsent: [''],
    email: [''],
    clbHubAccountInterest: [''],
  });

  ngOnInit(): void {
    const pageParam = this.route.snapshot.queryParamMap.get('page');
    if (pageParam === 'thank-you') {
      this.showThankYouPage(this.readStoredContactConsent());
    } else {
      const draft = loadSurveyDraft(this.surveyCode);
      if (surveyDraftHasProgress(draft)) {
        this.pendingDraft = draft;
        this.showResumePrompt = true;
        this.currentStep = 1;
        this.syncPageQueryParam(1);
      } else {
        const step = this.parsePageParam(pageParam);
        this.currentStep = step || 1;
        this.syncPageQueryParam(this.currentStep);
      }
    }

    this.route.queryParamMap.subscribe((params) => {
      const rawPage = params.get('page');
      if (rawPage === 'thank-you') {
        this.showThankYouPage(this.readStoredContactConsent());
        return;
      }
      if (this.showResumePrompt) {
        return;
      }
      const step = this.parsePageParam(rawPage);
      if (step && step !== this.currentStep) {
        this.currentStep = step;
        this.setMessages([]);
        this.scrollToTop();
      }
    });

    if (this.captchaEnabled) {
      void this.recaptchaService.preload();
    }

    this.form.valueChanges.subscribe(() => this.scheduleDraftSave());
    this.scrollToTop();
  }

  ngOnDestroy(): void {
    if (this.draftSaveTimer != null) {
      clearTimeout(this.draftSaveTimer);
      this.draftSaveTimer = null;
    }
  }

  continueDraft(): void {
    if (!this.pendingDraft) {
      this.showResumePrompt = false;
      return;
    }
    this.hydrateAnswers(this.pendingDraft.answers);
    const step = Math.min(Math.max(this.pendingDraft.currentStep || 1, 1), this.totalSteps);
    this.showResumePrompt = false;
    this.pendingDraft = null;
    this.goToStep(step);
    this.scheduleDraftSave();
  }

  startOver(): void {
    clearSurveyDraft(this.surveyCode);
    this.pendingDraft = null;
    this.showResumePrompt = false;
    this.resetAnswersToDefaults();
    this.goToStep(1);
  }

  get currentStepDefinition(): SurveyStepDefinition {
    return this.steps[this.currentStep - 1] || this.steps[0];
  }

  get optedInToFollowUpSurvey(): boolean {
    return this.contactConsentAtSubmit === 'yes';
  }

  get showRelationshipOtherField(): boolean {
    return this.form.controls.relationship.value === 'other';
  }

  get showYoungPersonStatusOtherField(): boolean {
    return this.form.controls.youngPersonStatus.value === 'other';
  }

  get showYoungPersonWorkStatusOtherField(): boolean {
    return this.form.controls.youngPersonWorkStatus.value === 'other';
  }

  get showYoungPersonEducationStatusOtherField(): boolean {
    return this.form.controls.youngPersonEducationStatus.value === 'other';
  }

  get showYoungPersonEducationGoalsOtherField(): boolean {
    return this.form.controls.youngPersonEducationGoals.value === 'other';
  }

  get showInvolvementPreferencesOtherField(): boolean {
    return this.selectedInvolvementPreferences.has('other');
  }

  get showInformationSourcesOtherField(): boolean {
    return this.selectedInformationSources.has('other');
  }

  get showYouthInvestigationAreasOtherField(): boolean {
    return this.selectedYouthInvestigationAreas.has('other');
  }

  get showBiggestChallengeOtherField(): boolean {
    return this.form.controls.biggestChallenge.value === 'other';
  }

  get showAiOpinionOtherField(): boolean {
    return this.selectedAiOpinion.has('other');
  }

  onConfidenceSelectionChange(event: { rowKey: string; value: string }): void {
    this.form.controls[event.rowKey].setValue(event.value);
    this.scheduleDraftSave();
  }

  getConfidenceSelectionMap(): Record<string, string> {
    return this.confidenceRows.reduce<Record<string, string>>((acc, row) => {
      acc[row.key] = this.form.controls[row.key].value || '';
      return acc;
    }, {});
  }

  getConfidenceLabel(value: string | null | undefined): string {
    const selected = this.confidenceOptions.find((option) => option.id === value);
    return selected?.label || value || '—';
  }

  canNavigateTo(step: number): boolean {
    if (this.showResumePrompt || this.submitted) {
      return false;
    }
    return step >= 1 && step <= this.totalSteps;
  }

  goToStep(step: number): void {
    if (this.showResumePrompt || !this.canNavigateTo(step)) {
      return;
    }
    this.setMessages([]);
    this.currentStep = step;
    this.syncPageQueryParam(step);
    this.scrollToTop();
    this.scheduleDraftSave();
  }

  nextStep(): void {
    if (this.showResumePrompt) {
      return;
    }
    const validationMessages = this.validateCurrentStep();
    if (validationMessages.length) {
      this.setMessages(validationMessages);
      return;
    }

    this.setMessages([]);
    this.currentStep = Math.min(this.currentStep + 1, this.totalSteps);
    this.syncPageQueryParam(this.currentStep);
    this.scrollToTop();
    this.scheduleDraftSave();
  }

  prevStep(): void {
    if (this.showResumePrompt) {
      return;
    }
    this.setMessages([]);
    this.currentStep = Math.max(this.currentStep - 1, 1);
    this.syncPageQueryParam(this.currentStep);
    this.scrollToTop();
    this.scheduleDraftSave();
  }

  toggleMultiSelection(set: Set<string>, value: string): void {
    if (set.has(value)) {
      set.delete(value);
    } else {
      set.add(value);
    }
    this.scheduleDraftSave();
  }

  toggleWorkLifeAspiration(value: string): void {
    if (this.selectedWorkLifeAspirations.has(value)) {
      this.selectedWorkLifeAspirations.delete(value);
      this.scheduleDraftSave();
      return;
    }
    if (this.selectedWorkLifeAspirations.size < this.maxWorkLifeAspirationSelections) {
      this.selectedWorkLifeAspirations.add(value);
      this.scheduleDraftSave();
    }
  }

  isWorkLifeAspirationDisabled(value: string): boolean {
    return !this.selectedWorkLifeAspirations.has(value)
      && this.selectedWorkLifeAspirations.size >= this.maxWorkLifeAspirationSelections;
  }

  isOptionSelected(set: Set<string>, value: string): boolean {
    return set.has(value);
  }

  async submit(): Promise<void> {
    this.submitting = true;
    this.setMessages([]);

    let captchaToken = '';
    if (this.captchaEnabled) {
      try {
        captchaToken = await this.recaptchaService.execute(this.surveyCode);
      } catch {
        this.submitting = false;
        this.setMessages([{ message: 'We could not verify the survey submission. Please try again.', severity: 1 }]);
        return;
      }

      if (!captchaToken) {
        this.submitting = false;
        this.setMessages([{ message: 'We could not verify the survey submission. Please try again.', severity: 1 }]);
        return;
      }
    }

    const surveyData: Record<string, unknown> = {
      surveyCode: this.surveyCode,
      pagePath: this.pagePath,
      ...(this.captchaEnabled ? { captchaToken } : {}),
      relationship: this.getSelectedLabel(this.relationshipOptions, this.form.controls.relationship.value, this.form.controls.relationshipOther.value),
      youngPersonStatus: this.getSelectedLabel(this.youngPersonStatusOptions, this.form.controls.youngPersonStatus.value, this.form.controls.youngPersonStatusOther.value),
      youngPersonWorkStatus: this.getSelectedLabel(this.youngPersonWorkStatusOptions, this.form.controls.youngPersonWorkStatus.value, this.form.controls.youngPersonWorkStatusOther.value),
      youngPersonEducationStatus: this.getSelectedLabel(this.youngPersonEducationStatusOptions, this.form.controls.youngPersonEducationStatus.value, this.form.controls.youngPersonEducationStatusOther.value),
      youngPersonWorkGoals: this.getSelectedLabel(this.youngPersonWorkGoalsOptions, this.form.controls.youngPersonWorkGoals.value),
      youngPersonEducationGoals: this.getSelectedLabel(this.youngPersonEducationGoalsOptions, this.form.controls.youngPersonEducationGoals.value, this.form.controls.youngPersonEducationGoalsOther.value),
      involvementFrequency: this.getSelectedLabel(this.involvementFrequencyOptions, this.form.controls.involvementFrequency.value),
      workLifeAspirations: this.selectedWorkLifeAspirations.size
        ? Array.from(this.selectedWorkLifeAspirations).map((value) => this.getLabelFromOption(this.workLifeAspirationOptions, value))
        : [],
      involvementPreferences: this.selectedInvolvementPreferences.size
        ? Array.from(this.selectedInvolvementPreferences).map((value) => this.getLabelFromOption(this.involvementPreferenceOptions, value, this.form.controls.involvementPreferencesOther.value))
        : [],
      involvementPreferencesOther: this.form.controls.involvementPreferencesOther.value || '',
      informationSources: this.selectedInformationSources.size
        ? Array.from(this.selectedInformationSources).map((value) => this.getLabelFromOption(this.informationSourceOptions, value, this.form.controls.informationSourcesOther.value))
        : [],
      informationSourcesOther: this.form.controls.informationSourcesOther.value || '',
      youthExplorationOutlook: this.getSelectedLabel(this.youthExplorationOutlookOptions, this.form.controls.youthExplorationOutlook.value),
      youthInvestigationAreas: this.selectedYouthInvestigationAreas.size
        ? Array.from(this.selectedYouthInvestigationAreas).map((value) => this.getLabelFromOption(this.youthInvestigationAreaOptions, value, this.form.controls.youthInvestigationAreasOther.value))
        : [],
      youthInvestigationAreasOther: this.form.controls.youthInvestigationAreasOther.value || '',
      confidenceExploringCareers: this.getConfidenceLabel(this.form.controls.confidenceExploringCareers.value),
      confidenceEducationTraining: this.getConfidenceLabel(this.form.controls.confidenceEducationTraining.value),
      confidenceWorkExperiences: this.getConfidenceLabel(this.form.controls.confidenceWorkExperiences.value),
      confidenceTrustworthyInfo: this.getConfidenceLabel(this.form.controls.confidenceTrustworthyInfo.value),
      biggestChallenge: this.getSelectedLabel(this.biggestChallengeOptions, this.form.controls.biggestChallenge.value, this.form.controls.biggestChallengeOther.value),
      aiUse: this.getSelectedLabel(this.aiUseOptions, this.form.controls.aiUse.value),
      aiFeelingAboutYouth: this.getSelectedLabel(this.aiFeelingOptions, this.form.controls.aiFeelingAboutYouth.value),
      aiOpinion: this.selectedAiOpinion.size
        ? Array.from(this.selectedAiOpinion).map((value) => this.getLabelFromOption(this.aiOpinionOptions, value, this.form.controls.aiOpinionOther.value))
        : [],
      aiOpinionOther: this.form.controls.aiOpinionOther.value || '',
      aiThoughts: this.form.controls.aiThoughts.value || '',
      clbHubImprovement: this.form.controls.clbHubImprovement.value || '',
      additionalFeedback: this.form.controls.additionalFeedback.value || '',
      followUpConsent: this.form.controls.followUpConsent.value || '',
      email: this.form.controls.email.value?.trim() || '',
      clbHubAccountInterest: this.getSelectedLabel(this.clbHubAccountInterestOptions, this.form.controls.clbHubAccountInterest.value),
    };

    const payload: SurveyResponsePOSTData = {
      surveyCode: this.surveyCode,
      subject: `Survey: ${this.surveyTitle}`,
      emailFrom: this.form.controls.email.value?.trim() || undefined,
      mapJsonData: surveyData,
    };

    this.hcclService.saveSurveyResponse(payload).subscribe({
      next: () => {
        clearSurveyDraft(this.surveyCode);
        this.contactConsentAtSubmit = this.form.controls.followUpConsent.value === 'yes' ? 'yes' : 'no';
        this.saveContactConsentToSessionStorage(this.contactConsentAtSubmit);
        this.showThankYouPage(this.contactConsentAtSubmit);
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { page: 'thank-you' },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
        this.submitting = false;
      },
      error: (error) => {
        this.submitting = false;
        const fallback = 'We could not submit your survey response. Please try again.';
        const simpleMessages = error?.error?.messages || [];
        if (Array.isArray(simpleMessages) && simpleMessages.length) {
          this.setMessages(simpleMessages.map((item: unknown) => ({ message: `${item}`, severity: 1 })));
        } else {
          this.setMessages([{ message: fallback, severity: 1 }]);
        }
      },
    });
  }

  private validateCurrentStep(): SimpleMessage[] {
    return [];
  }

  getSelectedLabel(options: SurveyOption[], value: string, otherValue = ''): string {
    if (value === 'other') {
      const customValue = otherValue?.trim();
      return customValue ? `Other: ${customValue}` : options.find((option) => option.id === value)?.label || '';
    }
    return options.find((option) => option.id === value)?.label || '';
  }

  getLabelFromOption(options: SurveyOption[], value: string, otherValue = ''): string {
    if (value === 'other') {
      const customValue = otherValue?.trim();
      return customValue ? `Other: ${customValue}` : options.find((option) => option.id === value)?.label || value;
    }
    return options.find((option) => option.id === value)?.label || value;
  }

  private setMessages(messages: SimpleMessage[]): void {
    this.messagesList = { messages };
  }

  private parsePageParam(raw: string | null): number | null {
    if (!raw) {
      return null;
    }
    const parsed = Number.parseInt(raw, 10);
    if (Number.isNaN(parsed) || parsed < 1 || parsed > this.totalSteps) {
      return null;
    }
    return parsed;
  }

  private syncPageQueryParam(step: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: step },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private scrollToTop(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private showThankYouPage(consent: string): void {
    this.submitted = true;
    this.contactConsentAtSubmit = consent;
    this.messagesList = { messages: [] };
    this.scrollToTop();
  }

  private readStoredContactConsent(): string {
    if (typeof window === 'undefined') {
      return '';
    }
    return window.sessionStorage.getItem(SurveyParentCareerSupportCheckComponent.CONTACT_CONSENT_STORAGE_KEY) || '';
  }

  private saveContactConsentToSessionStorage(consent: string): void {
    if (typeof window === 'undefined') {
      return;
    }
    window.sessionStorage.setItem(SurveyParentCareerSupportCheckComponent.CONTACT_CONSENT_STORAGE_KEY, consent);
  }

  private scheduleDraftSave(): void {
    if (this.showResumePrompt || this.submitted) {
      return;
    }
    if (this.draftSaveTimer != null) {
      clearTimeout(this.draftSaveTimer);
    }
    this.draftSaveTimer = setTimeout(() => {
      this.draftSaveTimer = null;
      this.persistDraftNow();
    }, SurveyParentCareerSupportCheckComponent.DRAFT_SAVE_DEBOUNCE_MS);
  }

  private persistDraftNow(): void {
    if (this.showResumePrompt || this.submitted) {
      return;
    }
    saveSurveyDraft(this.surveyCode, {
      currentStep: this.currentStep,
      answers: this.serializeAnswers(),
    });
  }

  private serializeAnswers(): Record<string, unknown> {
    return {
      form: this.form.getRawValue(),
      selectedWorkLifeAspirations: setToArray(this.selectedWorkLifeAspirations),
      selectedInvolvementPreferences: setToArray(this.selectedInvolvementPreferences),
      selectedInformationSources: setToArray(this.selectedInformationSources),
      selectedYouthInvestigationAreas: setToArray(this.selectedYouthInvestigationAreas),
      selectedAiOpinion: setToArray(this.selectedAiOpinion),
    };
  }

  private hydrateAnswers(answers: Record<string, unknown>): void {
    const formValue = answers['form'];
    if (formValue && typeof formValue === 'object') {
      this.form.patchValue(formValue as Record<string, string>);
    }
    this.selectedWorkLifeAspirations = arrayToSet(answers['selectedWorkLifeAspirations']);
    this.selectedInvolvementPreferences = arrayToSet(answers['selectedInvolvementPreferences']);
    this.selectedInformationSources = arrayToSet(answers['selectedInformationSources']);
    this.selectedYouthInvestigationAreas = arrayToSet(answers['selectedYouthInvestigationAreas']);
    this.selectedAiOpinion = arrayToSet(answers['selectedAiOpinion']);
  }

  private resetAnswersToDefaults(): void {
    this.form.reset({
      relationship: '',
      relationshipOther: '',
      youngPersonStatus: '',
      youngPersonStatusOther: '',
      youngPersonWorkStatus: '',
      youngPersonWorkStatusOther: '',
      youngPersonEducationStatus: '',
      youngPersonEducationStatusOther: '',
      youngPersonWorkGoals: '',
      youngPersonEducationGoals: '',
      youngPersonEducationGoalsOther: '',
      involvementFrequency: '',
      involvementPreferencesOther: '',
      informationSourcesOther: '',
      youthExplorationOutlook: '',
      youthInvestigationAreasOther: '',
      biggestChallenge: '',
      biggestChallengeOther: '',
      confidenceExploringCareers: '',
      confidenceEducationTraining: '',
      confidenceWorkExperiences: '',
      confidenceTrustworthyInfo: '',
      aiUse: '',
      aiFeelingAboutYouth: '',
      aiOpinionOther: '',
      aiThoughts: '',
      clbHubImprovement: '',
      additionalFeedback: '',
      followUpConsent: '',
      email: '',
      clbHubAccountInterest: '',
    });
    this.selectedWorkLifeAspirations = new Set();
    this.selectedInvolvementPreferences = new Set();
    this.selectedInformationSources = new Set();
    this.selectedYouthInvestigationAreas = new Set();
    this.selectedAiOpinion = new Set();
  }
}
