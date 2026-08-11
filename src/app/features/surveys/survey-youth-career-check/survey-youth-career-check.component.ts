import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { SimpleMessage, SimpleMessageList } from '@app/restsvc/common-request-service.model';
import { HcclService, SurveyResponsePOSTData } from '@app/restsvc/hccl.service';
import { RecaptchaDisclosureComponent } from '@app/shared/components/recaptcha-disclosure/recaptcha-disclosure.component';
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
  selector: 'app-survey-youth-career-check',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SimpleMessagesSectionComponent,
    SurveysPublicHeaderComponent,
    RecaptchaDisclosureComponent,
  ],
  templateUrl: './survey-youth-career-check.component.html',
  styleUrl: './survey-youth-career-check.component.scss',
})
export class SurveyYouthCareerCheckComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly hcclService = inject(HcclService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly recaptchaService = inject(RecaptchaService);

  private static readonly CONTACT_CONSENT_STORAGE_KEY = 'youth-career-check-contact-consent';
  private static readonly DRAFT_SAVE_DEBOUNCE_MS = 250;

  private draftSaveTimer: ReturnType<typeof setTimeout> | null = null;

  readonly captchaEnabled = true;
  readonly surveyTitle = 'Youth Career Check';
  readonly surveyCode = 'youth_career_check';
  readonly pagePath = '/public/surveys/youth-career-check';

  readonly steps: SurveyStepDefinition[] = [
    { step: 1, title: 'Intro', subtitle: 'Learn about the survey and what you will answer.' },
    { step: 2, title: 'About You', subtitle: 'Share a little about yourself so we can understand who this reaches.' },
    { step: 3, title: 'How You Explore Careers & AI', subtitle: 'Tell us how you explore career options and how you use AI.' },
    { step: 4, title: 'Who Is Involved & How You Plan', subtitle: 'Share who supports your career search and how you approach planning.' },
    { step: 5, title: 'CLBHub & Cohort Interest', subtitle: 'Tell us what online tools and cohort-style activities would feel useful.' },
    { step: 6, title: 'Ideas & Open Feedback', subtitle: 'Share what would help you most and any suggestions for CLBHub.' },
    { step: 7, title: 'Follow-up', subtitle: 'Let us know if we can contact you in the future.' },
    { step: 8, title: 'Submit Results', subtitle: 'Review and submit your responses.' },
  ];

  readonly totalSteps = this.steps.length;
  readonly stepNumbers = this.steps.map((step) => step.step);

  readonly ageRangeOptions: string[] = ['13–15', '16–18', '19–22', '23–26', 'Prefer not to say'];

  readonly workStatusOptions: SurveyOption[] = [
    { id: 'full_time', label: 'Working full-time' },
    { id: 'part_time', label: 'Working part-time' },
    { id: 'self_employed', label: 'Self-employed or freelancing' },
    { id: 'looking_for_work', label: 'Looking for work' },
    { id: 'not_working', label: 'Not currently working' },
    { id: 'unable_to_work', label: 'Unable to work at this time' },
    { id: 'other', label: 'Other' },
  ];

  readonly educationStatusOptions: SurveyOption[] = [
    { id: 'high_school', label: 'High school student' },
    { id: 'college_university', label: 'College or university student' },
    { id: 'trade_school', label: 'Trade school or vocational program' },
    { id: 'apprenticeship', label: 'Apprenticeship' },
    { id: 'other_postsecondary', label: 'Other postsecondary education or certification program' },
    { id: 'not_enrolled', label: 'Not currently enrolled in school or training' },
    { id: 'graduated', label: 'Graduated and not currently enrolled' },
    { id: 'other', label: 'Other' },
  ];
  readonly workGoalsOptions: SurveyOption[] = [
    { id: 'active_specific', label: "I'm actively working toward a specific career." },
    { id: 'few_deciding', label: "I have a few careers in mind but I'm still deciding." },
    { id: 'exploring_many', label: "I'm exploring many different career options." },
    { id: 'any_job', label: "I'm mainly focused on finding any job right now." },
    { id: 'unsure_pursue', label: "I'm unsure what type of work I want to pursue." },
    { id: 'not_thinking', label: "I'm not currently thinking about work or careers." },
    { id: 'not_sure', label: "I'm not sure." },
  ];

  readonly educationGoalsOptions: SurveyOption[] = [
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

  readonly careerExplorationOptions: SurveyOption[] = [
    { id: 'not_started', label: 'I haven’t really started yet' },
    { id: 'browsed_a_bit', label: 'I’ve browsed a bit but not in depth' },
    { id: 'actively_exploring', label: 'I’m actively exploring different paths' },
    { id: 'have_direction', label: 'I have a direction but I’m still confirming' },
    { id: 'set_on_path', label: 'I’m pretty set on a path and building toward it' },
  ];

  readonly infoSourceOptions: SurveyOption[] = [
    { id: 'online_searches', label: 'Online searches or videos' },
    { id: 'school', label: 'School classes or guidance office' },
    { id: 'social_media', label: 'Social media (TikTok, YouTube, Instagram, etc.)' },
    { id: 'friends', label: 'Friends or peers' },
    { id: 'parents', label: 'Parents or family' },
    { id: 'teachers', label: 'Teachers or coaches' },
    { id: 'community_programs', label: 'Community programs or nonprofits' },
    { id: 'employers', label: 'Employers or people already working in jobs' },
    { id: 'other', label: 'Other' },
  ];

  readonly aiToolUseOptions: SurveyOption[] = [
    { id: 'frequently', label: 'Yes, frequently' },
    { id: 'few_times', label: 'Yes, a few times' },
    { id: 'interested', label: "No, but I'm interested in trying it" },
    { id: 'no', label: 'No' },
    { id: 'not_sure', label: "I'm not sure" },
  ];

  readonly aiExperienceOptions: SurveyOption[] = [
    { id: 'discover_options', label: 'It helped me discover new career options.' },
    { id: 'answer_questions', label: 'It helped answer my questions.' },
    { id: 'saved_time', label: 'It saved me time researching.' },
    { id: 'new_ideas', label: 'It gave me ideas I hadn’t considered.' },
    { id: 'accuracy_concern', label: 'I wasn’t sure whether the information was accurate.' },
    { id: 'confusing', label: 'It was confusing or overwhelming.' },
    { id: 'havenot_used', label: 'I haven’t used AI for career exploration.' },
    { id: 'other', label: 'Other' },
  ];
  readonly supportPersonOptions: SurveyOption[] = [
    { id: 'mostly_myself', label: 'I mostly do it on my own' },
    { id: 'parents', label: 'Parents or guardians' },
    { id: 'other_family', label: 'Other family members' },
    { id: 'friends', label: 'Friends or classmates' },
    { id: 'teachers', label: 'Teachers or coaches' },
    { id: 'mentors', label: 'Mentors (formal or informal)' },
    { id: 'school_counselor', label: 'School counselor or career advisor' },
    { id: 'nonprofit_staff', label: 'Staff from a nonprofit or youth program' },
    { id: 'other', label: 'Other' },
  ];

  readonly programInvolvementOptions: SurveyOption[] = [
    { id: 'actively_involved', label: 'Yes, I’m actively involved' },
    { id: 'used_to_be', label: 'I used to be involved' },
    { id: 'aware_not_involved', label: 'I’m aware of programs but not involved' },
    { id: 'not_aware', label: 'I’m not aware of any programs like that' },
  ];

  readonly programTypeOptions: SurveyOption[] = [
    { id: 'afterschool', label: 'After-school program' },
    { id: 'summer_jobs', label: 'Youth employment or summer jobs program' },
    { id: 'faith_based', label: 'Faith-based or community organization' },
    { id: 'skills_training', label: 'Skills training or certification program' },
    { id: 'mentoring', label: 'Mentoring program' },
    { id: 'other', label: 'Other' },
  ];

  readonly planningApproachOptions: SurveyOption[] = [
    { id: 'only_when_brought_up', label: 'I only think about it when someone else brings it up' },
    { id: 'occasionally_no_steps', label: "I think about it on my own occasionally, but haven't taken many steps" },
    { id: 'explore_here_there', label: 'I explore on my own here and there: reading, watching videos, talking to people' },
    { id: 'regular_research', label: 'I regularly set aside time to research and work toward a career direction' },
    { id: 'consistent_focus', label: "It's a consistent focus. I'm actively building skills, seeking experiences, or making plans" },
  ];

  readonly planningTimeframeOptions: SurveyOption[] = [
    { id: '3_6_months', label: 'The next 3–6 months' },
    { id: '1_2_years', label: 'The next 1–2 years' },
    { id: '3_5_years', label: 'The next 3–5 years' },
    { id: 'longer_5_years', label: 'Longer than 5 years' },
    { id: 'not_sure', label: 'Not sure' },
  ];

  readonly onlineToolInterestOptions: SurveyOption[] = [
    { id: 'very_interested', label: 'Very interested' },
    { id: 'somewhat_interested', label: 'Somewhat interested' },
    { id: 'not_sure', label: 'Not sure' },
    { id: 'not_interested', label: 'Not interested' },
  ];

  readonly onlineToolFeatureGroups: { title: string; options: SurveyOption[] }[] = [
    {
      title: 'Personalization',
      options: [
        { id: 'describe_interests', label: 'Describe my interests' },
        { id: 'tailored_feed', label: 'Feed tailored to my needs' },
      ],
    },
    {
      title: 'Career Information and Learning',
      options: [
        { id: 'career_info', label: 'Information about careers' },
        { id: 'state_federal_resources', label: 'Information digested and presented from state/federal resources' },
        { id: 'tutorials', label: 'Tutorials' },
      ],
    },
    {
      title: 'Career Preparation',
      options: [
        { id: 'resume_building', label: 'Resume building' },
        { id: 'track_certifications', label: 'Tracking my certifications' },
      ],
    },
    {
      title: 'Opportunities',
      options: [
        { id: 'projects_join', label: 'Projects I could join' },
        { id: 'volunteer_opps', label: 'Volunteer opportunities' },
        { id: 'signup_interest', label: 'Sign-up to show interest' },
      ],
    },
    {
      title: 'Support & Community',
      options: [
        { id: 'advisory_team', label: 'Having an advisory team available to message' },
        { id: 'cohort', label: 'Cohort (see next question)' },
      ],
    },
  ];

  readonly onlineToolFeatureOptions: SurveyOption[] = this.onlineToolFeatureGroups.flatMap((group) => group.options);
  readonly cohortInterestOptions: SurveyOption[] = [
    { id: 'very_interested', label: 'Very interested' },
    { id: 'somewhat_interested', label: 'Somewhat interested' },
    { id: 'not_sure', label: 'Not sure' },
    { id: 'not_interested', label: 'Not interested' },
  ];

  readonly cohortActivityOptions: SurveyOption[] = [
    { id: 'in_person', label: 'In-person group sessions/discussion circles' },
    { id: 'online_meetings', label: 'Online group meetings or video calls' },
    { id: 'workplace_visits', label: 'Visiting workplaces (site visits, job shadows)' },
    { id: 'short_projects', label: 'Short projects or challenges related to a job' },
    { id: 'one_on_one', label: 'One-on-one conversations with mentors' },
    { id: 'short_courses', label: 'Short courses or workshops (online or in person)' },
    { id: 'group_chat', label: 'Group chat or online community focused on a career topic' },
    { id: 'other', label: 'Other activities' },
  ];

  readonly participationFrequencyOptions: SurveyOption[] = [
    { id: 'multiple_times_week', label: 'Multiple times a week' },
    { id: 'once_week', label: 'Once a week' },
    { id: 'every_other_week', label: 'Every other week' },
    { id: 'once_month', label: 'Once a month' },
    { id: 'occasional_events', label: 'Only for occasional events' },
    { id: 'not_sure', label: 'Not sure' },
  ];

  readonly cohortMotivatorOptions: SurveyOption[] = [
    { id: 'flexible_schedule', label: 'Flexible schedule or low time commitment' },
    { id: 'close_to_home', label: 'Activities close to home or accessible online' },
    { id: 'stipend', label: 'Stipend or small incentives' },
    { id: 'clear_connection', label: 'Clear connection to jobs or internships' },
    { id: 'trusted_adult', label: 'A trusted adult or organization running it' },
    { id: 'with_friends', label: 'Participating with friends' },
    { id: 'other', label: 'Other' },
  ];

  currentStep = 1;
  submitting = false;
  submitted = false;
  contactConsentAtSubmit = '';
  messagesList: SimpleMessageList = { messages: [] };
  showResumePrompt = false;
  pendingDraft: SurveyDraftV1 | null = null;

  selectedInfoSources = new Set<string>();
  selectedAiExperience = new Set<string>();
  selectedSupportPeople = new Set<string>();
  selectedProgramTypes = new Set<string>();
  selectedOnlineToolFeatures = new Set<string>();
  selectedCohortActivities = new Set<string>();
  selectedCohortMotivators = new Set<string>();

  readonly form = this.fb.nonNullable.group({
    ageRange: [''],
    workStatus: [''],
    workStatusOther: [''],
    educationStatus: [''],
    educationStatusOther: [''],
    workGoals: [''],
    educationGoals: [''],
    educationGoalsOther: [''],
    careerExplorationStage: [''],
    careerInfoSourcesOther: [''],
    aiToolUse: [''],
    aiExperienceOther: [''],
    supportPeopleOther: [''],
    involvedInPrograms: [''],
    programTypesOther: [''],
    planningApproach: [''],
    planningTimeframe: [''],
    onlineToolInterest: [''],
    cohortInterest: [''],
    cohortActivitiesOther: [''],
    participationFrequency: [''],
    cohortMotivatorsOther: [''],
    feedback: [''],
    ideas: [''],
    followUpConsent: [''],
    email: [''],
    clbHubAccountInterest: [''],
  });
  get currentStepDefinition(): SurveyStepDefinition {
    return this.steps[this.currentStep - 1];
  }

  get showWorkStatusOtherField(): boolean {
    return this.form.controls.workStatus.value === 'other';
  }

  get showEducationStatusOtherField(): boolean {
    return this.form.controls.educationStatus.value === 'other';
  }

  get showEducationGoalsOtherField(): boolean {
    return this.form.controls.educationGoals.value === 'other';
  }

  get showInfoSourceOtherField(): boolean {
    return this.selectedInfoSources.has('other');
  }

  get showAiExperienceOtherField(): boolean {
    return this.selectedAiExperience.has('other');
  }

  get showSupportPeopleOtherField(): boolean {
    return this.selectedSupportPeople.has('other');
  }

  get showProgramTypesOtherField(): boolean {
    return this.selectedProgramTypes.has('other');
  }

  get showCohortActivitiesOtherField(): boolean {
    return this.selectedCohortActivities.has('other');
  }

  get showCohortMotivatorsOtherField(): boolean {
    return this.selectedCohortMotivators.has('other');
  }

  get optedInToFollowUpSurvey(): boolean {
    return this.contactConsentAtSubmit === 'yes';
  }

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

    this.form.valueChanges.subscribe(() => this.scheduleDraftSave());
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
        if (!captchaToken) {
          this.submitting = false;
          this.setMessages([{ message: 'We could not verify the survey submission. Please try again.', severity: 1 }]);
          return;
        }
      } catch (err) {
        this.submitting = false;
        this.setMessages([{ message: 'We could not verify the survey submission. Please try again.', severity: 1 }]);
        return;
      }
    }

    const surveyData: Record<string, unknown> = {
      surveyCode: this.surveyCode,
      pagePath: this.pagePath,
      ...(this.captchaEnabled ? { captchaToken } : {}),
      ageRange: this.form.controls.ageRange.value || '',
      
      currentStatus: `Work: ${this.getSelectedLabel(this.workStatusOptions, this.form.controls.workStatus.value, this.form.controls.workStatusOther.value)} | Education: ${this.getSelectedLabel(this.educationStatusOptions, this.form.controls.educationStatus.value, this.form.controls.educationStatusOther.value)}`,
      
      workStatus: this.getSelectedLabel(this.workStatusOptions, this.form.controls.workStatus.value),
      workStatusOther: this.form.controls.workStatusOther.value || '',
      educationStatus: this.getSelectedLabel(this.educationStatusOptions, this.form.controls.educationStatus.value),
      educationStatusOther: this.form.controls.educationStatusOther.value || '',
      
      workGoals: this.getSelectedLabel(this.workGoalsOptions, this.form.controls.workGoals.value),
      educationGoals: this.getSelectedLabel(this.educationGoalsOptions, this.form.controls.educationGoals.value),
      educationGoalsOther: this.form.controls.educationGoalsOther.value || '',
      
      careerExplorationStage: this.getSelectedLabel(this.careerExplorationOptions, this.form.controls.careerExplorationStage.value),
      careerInfoSources: this.selectedInfoSources.size ? Array.from(this.selectedInfoSources).map(id => this.getLabelFromOption(this.infoSourceOptions, id, this.form.controls.careerInfoSourcesOther.value)) : [],
      careerInfoSourcesOther: this.form.controls.careerInfoSourcesOther.value || '',
      
      aiToolUse: this.getSelectedLabel(this.aiToolUseOptions, this.form.controls.aiToolUse.value),
      
      onlineToolInterest: this.getSelectedLabel(this.onlineToolInterestOptions, this.form.controls.onlineToolInterest.value),
      onlineToolFeatures: this.selectedOnlineToolFeatures.size ? Array.from(this.selectedOnlineToolFeatures).map(id => this.getLabelFromOption(this.onlineToolFeatureOptions, id)) : [],
      
      aiExperience: this.selectedAiExperience.size ? Array.from(this.selectedAiExperience).map(id => this.getLabelFromOption(this.aiExperienceOptions, id, this.form.controls.aiExperienceOther.value)) : [],
      aiExperienceOther: this.form.controls.aiExperienceOther.value || '',
      
      supportPeople: this.selectedSupportPeople.size ? Array.from(this.selectedSupportPeople).map(id => this.getLabelFromOption(this.supportPersonOptions, id, this.form.controls.supportPeopleOther.value)) : [],
      supportPeopleOther: this.form.controls.supportPeopleOther.value || '',
      
      involvedInPrograms: this.getSelectedLabel(this.programInvolvementOptions, this.form.controls.involvedInPrograms.value),
      programTypes: this.selectedProgramTypes.size ? Array.from(this.selectedProgramTypes).map(id => this.getLabelFromOption(this.programTypeOptions, id, this.form.controls.programTypesOther.value)) : [],
      programTypesOther: this.form.controls.programTypesOther.value || '',
      
      planningApproach: this.getSelectedLabel(this.planningApproachOptions, this.form.controls.planningApproach.value),
      planningTimeframe: this.getSelectedLabel(this.planningTimeframeOptions, this.form.controls.planningTimeframe.value),
      
      cohortInterest: this.getSelectedLabel(this.cohortInterestOptions, this.form.controls.cohortInterest.value),
      cohortActivities: this.selectedCohortActivities.size ? Array.from(this.selectedCohortActivities).map(id => this.getLabelFromOption(this.cohortActivityOptions, id, this.form.controls.cohortActivitiesOther.value)) : [],
      cohortActivitiesOther: this.form.controls.cohortActivitiesOther.value || '',
      
      participationFrequency: this.getSelectedLabel(this.participationFrequencyOptions, this.form.controls.participationFrequency.value),
      cohortMotivators: this.selectedCohortMotivators.size ? Array.from(this.selectedCohortMotivators).map(id => this.getLabelFromOption(this.cohortMotivatorOptions, id, this.form.controls.cohortMotivatorsOther.value)) : [],
      cohortMotivatorsOther: this.form.controls.cohortMotivatorsOther.value || '',
      
      feedback: this.form.controls.feedback.value || '',
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
    // All questions are optional!
    return [];
  }

  getSelectedLabel(options: SurveyOption[], value: string, otherValue = ''): string {
    if (value === 'other') {
      return otherValue ? `Other: ${otherValue}` : 'Other';
    }
    const found = options.find((opt) => opt.id === value);
    return found ? found.label : value;
  }

  getLabelFromOption(options: SurveyOption[], value: string, otherValue = ''): string {
    if (value === 'other') {
      return otherValue ? `Other: ${otherValue}` : 'Other';
    }
    const found = options.find((opt) => opt.id === value);
    return found ? found.label : value;
  }

  private setMessages(messages: SimpleMessage[]): void {
    this.messagesList = { messages };
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
    return window.sessionStorage.getItem(SurveyYouthCareerCheckComponent.CONTACT_CONSENT_STORAGE_KEY) || '';
  }

  private saveContactConsentToSessionStorage(consent: string): void {
    if (typeof window === 'undefined') {
      return;
    }
    window.sessionStorage.setItem(SurveyYouthCareerCheckComponent.CONTACT_CONSENT_STORAGE_KEY, consent);
  }

  private parsePageParam(raw: string | null): number | null {
    if (!raw) {
      return null;
    }
    const parsed = parseInt(raw, 10);
    if (isNaN(parsed) || parsed < 1 || parsed > this.totalSteps) {
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
    }, SurveyYouthCareerCheckComponent.DRAFT_SAVE_DEBOUNCE_MS);
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
      selectedInfoSources: setToArray(this.selectedInfoSources),
      selectedAiExperience: setToArray(this.selectedAiExperience),
      selectedSupportPeople: setToArray(this.selectedSupportPeople),
      selectedProgramTypes: setToArray(this.selectedProgramTypes),
      selectedOnlineToolFeatures: setToArray(this.selectedOnlineToolFeatures),
      selectedCohortActivities: setToArray(this.selectedCohortActivities),
      selectedCohortMotivators: setToArray(this.selectedCohortMotivators),
    };
  }

  private hydrateAnswers(answers: Record<string, unknown>): void {
    const formValue = answers['form'];
    if (formValue && typeof formValue === 'object') {
      this.form.patchValue(formValue as Record<string, string>);
    }
    this.selectedInfoSources = arrayToSet(answers['selectedInfoSources']);
    this.selectedAiExperience = arrayToSet(answers['selectedAiExperience']);
    this.selectedSupportPeople = arrayToSet(answers['selectedSupportPeople']);
    this.selectedProgramTypes = arrayToSet(answers['selectedProgramTypes']);
    this.selectedOnlineToolFeatures = arrayToSet(answers['selectedOnlineToolFeatures']);
    this.selectedCohortActivities = arrayToSet(answers['selectedCohortActivities']);
    this.selectedCohortMotivators = arrayToSet(answers['selectedCohortMotivators']);
  }

  private resetAnswersToDefaults(): void {
    this.form.reset({
      ageRange: '',
      workStatus: '',
      workStatusOther: '',
      educationStatus: '',
      educationStatusOther: '',
      workGoals: '',
      educationGoals: '',
      educationGoalsOther: '',
      careerExplorationStage: '',
      careerInfoSourcesOther: '',
      aiToolUse: '',
      aiExperienceOther: '',
      supportPeopleOther: '',
      involvedInPrograms: '',
      programTypesOther: '',
      planningApproach: '',
      planningTimeframe: '',
      onlineToolInterest: '',
      cohortInterest: '',
      cohortActivitiesOther: '',
      participationFrequency: '',
      cohortMotivatorsOther: '',
      feedback: '',
      ideas: '',
      followUpConsent: '',
      email: '',
      clbHubAccountInterest: '',
    });
    this.selectedInfoSources = new Set();
    this.selectedAiExperience = new Set();
    this.selectedSupportPeople = new Set();
    this.selectedProgramTypes = new Set();
    this.selectedOnlineToolFeatures = new Set();
    this.selectedCohortActivities = new Set();
    this.selectedCohortMotivators = new Set();
  }
}
