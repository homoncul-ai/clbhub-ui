import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { SimpleMessage, SimpleMessageList } from '@app/restsvc/common-request-service.model';
import { HcclService, SurveyResponsePOSTData } from '@app/restsvc/hccl.service';
import { RecaptchaDisclosureComponent } from '@app/shared/components/recaptcha-disclosure/recaptcha-disclosure.component';
import { RecaptchaService } from '@app/shared/services/recaptcha.service';
import { SurveysPublicHeaderComponent } from '../components/surveys-public-header.component';

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
  ],
  templateUrl: './survey-parent-career-support-check.component.html',
  styleUrl: './survey-parent-career-support-check.component.scss',
})
export class SurveyParentCareerSupportCheckComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly hcclService = inject(HcclService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly recaptchaService = inject(RecaptchaService);

  private static readonly CONTACT_CONSENT_STORAGE_KEY = 'parent-career-support-contact-consent';

  readonly captchaEnabled = true;
  readonly surveyTitle = 'Parent Career Support Check';
  readonly surveyCode = 'parent_career_support_check';
  readonly pagePath = '/public/surveys/parent-career-support-check';

  readonly steps: SurveyStepDefinition[] = [
    { step: 1, title: 'Intro', subtitle: 'Learn about the survey and what you will answer.' },
    { step: 2, title: 'About You and the Young Person', subtitle: 'Share a little about your role and the young person you support.' },
    { step: 3, title: 'Your Involvement in Career Exploration', subtitle: 'Tell us how you help with career exploration and where you get information.' },
    { step: 4, title: 'Youth Exploration and AI', subtitle: 'Share how the young person explores careers and uses AI.' },
    { step: 5, title: 'Confidence Supporting Career Exploration', subtitle: 'Tell us where you feel confident and where you would like more support.' },
    { step: 6, title: 'Communication Preferences', subtitle: 'Tell us how you would like to hear about opportunities and resources.' },
    { step: 7, title: 'Ideas & Feedback', subtitle: 'Share what would help you better support the young person.' },
    { step: 8, title: 'Submit Results', subtitle: 'Review and submit your responses.' },
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
    { id: 'other', label: 'Other' },
  ];

  readonly employmentStatusOptions: SurveyOption[] = [
    { id: 'employed_full_time', label: 'Employed full-time' },
    { id: 'employed_part_time', label: 'Employed part-time' },
    { id: 'self_employed', label: 'Self-employed' },
    { id: 'retired', label: 'Retired' },
    { id: 'not_employed', label: 'Not currently employed' },
    { id: 'other', label: 'Other' },
  ];

  readonly youngPersonStatusOptions: SurveyOption[] = [
    { id: 'high_school', label: 'High school student' },
    { id: 'college_postsecondary', label: 'College or postsecondary student' },
    { id: 'working', label: 'Working (part-time or full-time)' },
    { id: 'not_school_or_working', label: 'Not currently in school or working' },
    { id: 'other', label: 'Other' },
  ];

  readonly involvementLevelOptions: SurveyOption[] = [
    { id: 'very_involved', label: 'Very involved' },
    { id: 'somewhat_involved', label: 'Somewhat involved' },
    { id: 'occasionally_involved', label: 'Occasionally involved' },
    { id: 'rarely_involved', label: 'Rarely involved' },
    { id: 'not_involved', label: 'Not involved' },
  ];

  readonly involvementActivityOptions: SurveyOption[] = [
    { id: 'discussing_careers', label: 'Discussing possible careers' },
    { id: 'looking_up_careers', label: 'Looking up careers or occupations' },
    { id: 'exploring_colleges', label: 'Exploring colleges or universities' },
    { id: 'exploring_trade_schools', label: 'Exploring trade schools or vocational programs' },
    { id: 'researching_apprenticeships', label: 'Researching apprenticeships' },
    { id: 'looking_for_internships', label: 'Looking for internships or summer opportunities' },
    { id: 'looking_for_jobs', label: 'Looking for jobs' },
    { id: 'reviewing_resumes', label: 'Reviewing resumes or applications' },
    { id: 'preparing_for_interviews', label: 'Preparing for interviews' },
    { id: 'connecting_with_professionals', label: 'Connecting them with professionals or mentors' },
    { id: 'encouraging_exploration', label: 'Encouraging them to explore opportunities' },
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
    { id: 'other', label: 'Other' },
  ];

  readonly youthEnthusiasmOptions: SurveyOption[] = [
    { id: 'very_enthusiastic', label: 'Very enthusiastic' },
    { id: 'somewhat_enthusiastic', label: 'Somewhat enthusiastic' },
    { id: 'neutral', label: 'Neutral' },
    { id: 'somewhat_uninterested', label: 'Somewhat uninterested' },
    { id: 'very_uninterested', label: 'Very uninterested' },
    { id: 'not_sure', label: "I'm not sure" },
  ];

  readonly youthExplorationLevelOptions: SurveyOption[] = [
    { id: 'not_started', label: "They haven't really started yet." },
    { id: 'little_explored', label: "They've explored a little but not in depth." },
    { id: 'actively_exploring', label: "They're actively exploring different options." },
    { id: 'general_direction', label: 'They have a general direction but are still deciding.' },
    { id: 'clear_direction', label: 'They have a clear direction and are actively working toward it.' },
  ];

  readonly aiUseOptions: SurveyOption[] = [
    { id: 'frequently', label: 'Yes, frequently' },
    { id: 'few_times', label: 'Yes, a few times' },
    { id: 'interested', label: 'No, but they are interested' },
    { id: 'no', label: 'No' },
    { id: 'not_sure', label: "I'm not sure" },
  ];

  readonly aiOpinionOptions: SurveyOption[] = [
    { id: 'discover_options', label: 'It helps young people discover new career options.' },
    { id: 'saves_time', label: 'It saves time when researching careers.' },
    { id: 'useful_information', label: 'It provides useful information.' },
    { id: 'encourages_independent_exploration', label: 'It encourages independent exploration.' },
    { id: 'concerned_inaccurate_info', label: 'I\'m concerned about inaccurate information.' },
    { id: 'concerned_reliance', label: 'I\'m concerned the young person may rely on it too much.' },
    { id: 'dont_know_enough', label: "I don't know enough about AI to have an opinion." },
    { id: 'other', label: 'Other' },
  ];

  readonly supportAreaOptions: SurveyOption[] = [
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
    { id: 'no_additional_support', label: "I don't currently need additional support" },
    { id: 'other', label: 'Other' },
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

  readonly communicationChannelOptions: SurveyOption[] = [
    { id: 'email', label: 'Email' },
    { id: 'text', label: 'Text message' },
    { id: 'phone', label: 'Phone call' },
    { id: 'website', label: 'Organization website' },
    { id: 'other', label: 'Other' },
  ];

  readonly communicationFrequencyOptions: SurveyOption[] = [
    { id: 'multiple_times_week', label: 'Multiple times a week' },
    { id: 'once_week', label: 'Once a week' },
    { id: 'every_other_week', label: 'Every other week' },
    { id: 'once_month', label: 'Once a month' },
    { id: 'when_relevant', label: 'Only when relevant opportunities are available' },
    { id: 'rarely', label: 'Rarely' },
  ];

  readonly opportunityTypeOptions: SurveyOption[] = [
    { id: 'career_exploration_events', label: 'Career exploration events' },
    { id: 'internships', label: 'Internships' },
    { id: 'jobs', label: 'Jobs' },
    { id: 'apprenticeships', label: 'Apprenticeships' },
    { id: 'college_information', label: 'College information' },
    { id: 'trade_schools', label: 'Trade schools or vocational training' },
    { id: 'scholarships', label: 'Scholarships or financial aid' },
    { id: 'workshops', label: 'Workshops or skill-building opportunities' },
    { id: 'mentoring', label: 'Mentoring opportunities' },
    { id: 'community_programs', label: 'Community programs' },
    { id: 'other', label: 'Other' },
  ];

  readonly confidenceRows = [
    { key: 'confidenceChoosingCareers', label: 'Choosing possible careers' },
    { key: 'confidenceFindingColleges', label: 'Finding colleges or universities' },
    { key: 'confidenceFindingTradeSchools', label: 'Finding trade schools or vocational programs' },
    { key: 'confidenceFindingApprenticeships', label: 'Finding apprenticeships' },
    { key: 'confidenceFindingInternships', label: 'Finding internships or work experiences' },
    { key: 'confidenceSearchingJobs', label: 'Searching for jobs' },
    { key: 'confidenceUnderstandingRequirements', label: 'Understanding education or training requirements' },
    { key: 'confidenceFindingTrustworthyInfo', label: 'Finding trustworthy career information' },
  ] as const;

  currentStep = 1;
  maxStepReached = 1;
  submitting = false;
  submitted = false;
  contactConsentAtSubmit = '';
  messagesList: SimpleMessageList = { messages: [] };

  selectedInvolvementActivities = new Set<string>();
  selectedInformationSources = new Set<string>();
  selectedAiOpinion = new Set<string>();
  selectedSupportAreas = new Set<string>();
  selectedCommunicationChannels = new Set<string>();
  selectedOpportunityTypes = new Set<string>();

  readonly form = this.fb.nonNullable.group({
    relationship: [''],
    relationshipOther: [''],
    roughLocation: [''],
    employmentStatus: [''],
    employmentStatusOther: [''],
    youngPersonStatus: [''],
    youngPersonStatusOther: [''],
    involvementLevel: [''],
    involvementActivitiesOther: [''],
    informationSourcesOther: [''],
    youngPersonEnthusiasm: [''],
    youngPersonExplorationLevel: [''],
    aiUse: [''],
    aiOpinionOther: [''],
    supportAreasOther: [''],
    biggestChallenge: [''],
    biggestChallengeOther: [''],
    confidenceChoosingCareers: [''],
    confidenceFindingColleges: [''],
    confidenceFindingTradeSchools: [''],
    confidenceFindingApprenticeships: [''],
    confidenceFindingInternships: [''],
    confidenceSearchingJobs: [''],
    confidenceUnderstandingRequirements: [''],
    confidenceFindingTrustworthyInfo: [''],
    communicationFrequency: [''],
    communicationChannelsOther: [''],
    opportunityTypesOther: [''],
    feedback: [''],
    obstacles: [''],
    ideas: [''],
    followUpConsent: [''],
    email: [''],
    clbHubAccountInterest: [''],
  });

  ngOnInit(): void {
    const pageParam = this.route.snapshot.queryParamMap.get('page');
    if (pageParam === 'thank-you') {
      this.showThankYouPage(this.readStoredContactConsent());
    } else {
      const initialPage = this.parsePageParam(pageParam);
      if (initialPage !== null) {
        this.currentStep = initialPage;
        this.maxStepReached = Math.max(this.maxStepReached, this.currentStep);
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
      if (page !== null) {
        this.currentStep = page;
        this.maxStepReached = Math.max(this.maxStepReached, this.currentStep);
      }
      this.scrollToTop();
    });

    if (this.captchaEnabled) {
      void this.recaptchaService.preload();
    }

    this.scrollToTop();
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

  get showEmploymentStatusOtherField(): boolean {
    return this.form.controls.employmentStatus.value === 'other';
  }

  get showYoungPersonStatusOtherField(): boolean {
    return this.form.controls.youngPersonStatus.value === 'other';
  }

  get showInvolvementActivitiesOtherField(): boolean {
    return this.selectedInvolvementActivities.has('other');
  }

  get showInformationSourcesOtherField(): boolean {
    return this.selectedInformationSources.has('other');
  }

  get showAiOpinionOtherField(): boolean {
    return this.selectedAiOpinion.has('other');
  }

  get showSupportAreasOtherField(): boolean {
    return this.selectedSupportAreas.has('other');
  }

  get showBiggestChallengeOtherField(): boolean {
    return this.form.controls.biggestChallenge.value === 'other';
  }

  get showCommunicationChannelsOtherField(): boolean {
    return this.selectedCommunicationChannels.has('other');
  }

  get showOpportunityTypesOtherField(): boolean {
    return this.selectedOpportunityTypes.has('other');
  }

  nextStep(): void {
    const validationMessages = this.validateCurrentStep();
    if (validationMessages.length) {
      this.setMessages(validationMessages);
      return;
    }

    this.setMessages([]);
    this.currentStep = Math.min(this.currentStep + 1, this.totalSteps);
    this.maxStepReached = Math.max(this.maxStepReached, this.currentStep);
    this.syncPageQueryParam(this.currentStep);
    this.scrollToTop();
  }

  prevStep(): void {
    this.setMessages([]);
    this.currentStep = Math.max(this.currentStep - 1, 1);
    this.syncPageQueryParam(this.currentStep);
    this.scrollToTop();
  }

  canNavigateTo(step: number): boolean {
    return step >= 1 && step <= this.maxStepReached && step !== this.currentStep;
  }

  goToStep(step: number): void {
    if (!this.canNavigateTo(step)) {
      return;
    }
    this.setMessages([]);
    this.currentStep = step;
    this.syncPageQueryParam(this.currentStep);
    this.scrollToTop();
  }

  toggleMultiSelection(set: Set<string>, value: string): void {
    if (set.has(value)) {
      set.delete(value);
    } else {
      set.add(value);
    }
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
      roughLocation: this.form.controls.roughLocation.value || '',
      employmentStatus: this.getSelectedLabel(this.employmentStatusOptions, this.form.controls.employmentStatus.value, this.form.controls.employmentStatusOther.value),
      youngPersonStatus: this.getSelectedLabel(this.youngPersonStatusOptions, this.form.controls.youngPersonStatus.value, this.form.controls.youngPersonStatusOther.value),
      involvementLevel: this.getSelectedLabel(this.involvementLevelOptions, this.form.controls.involvementLevel.value),
      involvementActivities: this.selectedInvolvementActivities.size
        ? Array.from(this.selectedInvolvementActivities).map((value) => this.getLabelFromOption(this.involvementActivityOptions, value, this.form.controls.involvementActivitiesOther.value))
        : [],
      involvementActivitiesOther: this.form.controls.involvementActivitiesOther.value || '',
      informationSources: this.selectedInformationSources.size
        ? Array.from(this.selectedInformationSources).map((value) => this.getLabelFromOption(this.informationSourceOptions, value, this.form.controls.informationSourcesOther.value))
        : [],
      informationSourcesOther: this.form.controls.informationSourcesOther.value || '',
      youngPersonEnthusiasm: this.getSelectedLabel(this.youthEnthusiasmOptions, this.form.controls.youngPersonEnthusiasm.value),
      youngPersonExplorationLevel: this.getSelectedLabel(this.youthExplorationLevelOptions, this.form.controls.youngPersonExplorationLevel.value),
      aiUse: this.getSelectedLabel(this.aiUseOptions, this.form.controls.aiUse.value),
      aiOpinion: this.selectedAiOpinion.size
        ? Array.from(this.selectedAiOpinion).map((value) => this.getLabelFromOption(this.aiOpinionOptions, value, this.form.controls.aiOpinionOther.value))
        : [],
      aiOpinionOther: this.form.controls.aiOpinionOther.value || '',
      supportAreas: this.selectedSupportAreas.size
        ? Array.from(this.selectedSupportAreas).map((value) => this.getLabelFromOption(this.supportAreaOptions, value, this.form.controls.supportAreasOther.value))
        : [],
      supportAreasOther: this.form.controls.supportAreasOther.value || '',
      biggestChallenge: this.getSelectedLabel(this.biggestChallengeOptions, this.form.controls.biggestChallenge.value, this.form.controls.biggestChallengeOther.value),
      confidenceChoosingCareers: this.form.controls.confidenceChoosingCareers.value || '',
      confidenceFindingColleges: this.form.controls.confidenceFindingColleges.value || '',
      confidenceFindingTradeSchools: this.form.controls.confidenceFindingTradeSchools.value || '',
      confidenceFindingApprenticeships: this.form.controls.confidenceFindingApprenticeships.value || '',
      confidenceFindingInternships: this.form.controls.confidenceFindingInternships.value || '',
      confidenceSearchingJobs: this.form.controls.confidenceSearchingJobs.value || '',
      confidenceUnderstandingRequirements: this.form.controls.confidenceUnderstandingRequirements.value || '',
      confidenceFindingTrustworthyInfo: this.form.controls.confidenceFindingTrustworthyInfo.value || '',
      communicationChannels: this.selectedCommunicationChannels.size
        ? Array.from(this.selectedCommunicationChannels).map((value) => this.getLabelFromOption(this.communicationChannelOptions, value, this.form.controls.communicationChannelsOther.value))
        : [],
      communicationChannelsOther: this.form.controls.communicationChannelsOther.value || '',
      communicationFrequency: this.getSelectedLabel(this.communicationFrequencyOptions, this.form.controls.communicationFrequency.value),
      opportunityTypes: this.selectedOpportunityTypes.size
        ? Array.from(this.selectedOpportunityTypes).map((value) => this.getLabelFromOption(this.opportunityTypeOptions, value, this.form.controls.opportunityTypesOther.value))
        : [],
      opportunityTypesOther: this.form.controls.opportunityTypesOther.value || '',
      feedback: this.form.controls.feedback.value || '',
      obstacles: this.form.controls.obstacles.value || '',
      ideas: this.form.controls.ideas.value || '',
      followUpConsent: this.form.controls.followUpConsent.value || '',
      email: this.form.controls.email.value?.trim() || '',
      clbHubAccountInterest: this.form.controls.clbHubAccountInterest.value || '',
    };

    const payload: SurveyResponsePOSTData = {
      surveyCode: this.surveyCode,
      subject: `Survey: ${this.surveyTitle}`,
      emailFrom: this.form.controls.email.value?.trim() || undefined,
      mapJsonData: surveyData,
    };

    this.hcclService.saveSurveyResponse(payload).subscribe({
      next: () => {
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
    const messages: SimpleMessage[] = [];

    if (this.currentStep === 2) {
      if (!this.form.controls.relationship.value) {
        messages.push({ message: 'Please select your relationship to the young person.', severity: 1 });
      }
      if (this.form.controls.relationship.value === 'other' && !this.form.controls.relationshipOther.value?.trim()) {
        messages.push({ message: 'Please describe your relationship to the young person.', severity: 1 });
      }
      if (!this.form.controls.employmentStatus.value) {
        messages.push({ message: 'Please choose your employment status.', severity: 1 });
      }
      if (this.form.controls.employmentStatus.value === 'other' && !this.form.controls.employmentStatusOther.value?.trim()) {
        messages.push({ message: 'Please describe your employment status.', severity: 1 });
      }
      if (!this.form.controls.youngPersonStatus.value) {
        messages.push({ message: 'Please choose the young person’s current status.', severity: 1 });
      }
      if (this.form.controls.youngPersonStatus.value === 'other' && !this.form.controls.youngPersonStatusOther.value?.trim()) {
        messages.push({ message: 'Please describe the young person’s current status.', severity: 1 });
      }
    }

    if (this.currentStep === 3) {
      if (!this.form.controls.involvementLevel.value) {
        messages.push({ message: 'Please tell us how involved you are in helping the young person.', severity: 1 });
      }
      if (!this.selectedInvolvementActivities.size && !this.form.controls.involvementActivitiesOther.value?.trim()) {
        messages.push({ message: 'Please select at least one way you’ve helped the young person explore careers.', severity: 1 });
      }
      if (!this.selectedInformationSources.size && !this.form.controls.informationSourcesOther.value?.trim()) {
        messages.push({ message: 'Please select at least one place you get trusted career information.', severity: 1 });
      }
    }

    if (this.currentStep === 4) {
      if (!this.form.controls.youngPersonEnthusiasm.value) {
        messages.push({ message: 'Please tell us how enthusiastic the young person seems about exploring careers.', severity: 1 });
      }
      if (!this.form.controls.youngPersonExplorationLevel.value) {
        messages.push({ message: 'Please describe the young person’s current level of career exploration.', severity: 1 });
      }
      if (!this.form.controls.aiUse.value) {
        messages.push({ message: 'Please tell us whether the young person has used AI tools for career exploration.', severity: 1 });
      }
      if (!this.selectedAiOpinion.size && !this.form.controls.aiOpinionOther.value?.trim()) {
        messages.push({ message: 'Please choose at least one opinion about AI as a career exploration tool.', severity: 1 });
      }
    }

    if (this.currentStep === 5) {
      for (const row of this.confidenceRows) {
        if (!this.form.controls[row.key].value) {
          messages.push({ message: `Please tell us how confident you feel about ${row.label.toLowerCase()}.`, severity: 1 });
        }
      }
      if (!this.selectedSupportAreas.size && !this.form.controls.supportAreasOther.value?.trim()) {
        messages.push({ message: 'Please select at least one area where you would like more information or support.', severity: 1 });
      }
      if (!this.form.controls.biggestChallenge.value) {
        messages.push({ message: 'Please tell us the biggest challenge in helping the young person prepare for their future.', severity: 1 });
      }
      if (this.form.controls.biggestChallenge.value === 'other' && !this.form.controls.biggestChallengeOther.value?.trim()) {
        messages.push({ message: 'Please describe the biggest challenge you face.', severity: 1 });
      }
    }

    if (this.currentStep === 6) {
      if (!this.selectedCommunicationChannels.size && !this.form.controls.communicationChannelsOther.value?.trim()) {
        messages.push({ message: 'Please tell us how you would prefer organizations to share career opportunities with you.', severity: 1 });
      }
      if (!this.form.controls.communicationFrequency.value) {
        messages.push({ message: 'Please tell us how often you would like to receive information.', severity: 1 });
      }
      if (!this.selectedOpportunityTypes.size && !this.form.controls.opportunityTypesOther.value?.trim()) {
        messages.push({ message: 'Please select at least one type of opportunity you would like to hear about.', severity: 1 });
      }
    }

    return messages;
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
    if (Number.isNaN(parsed)) {
      return null;
    }
    if (parsed < 1 || parsed > this.totalSteps) {
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
    window.scrollTo({ top: 0, behavior: 'auto' });
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
}
