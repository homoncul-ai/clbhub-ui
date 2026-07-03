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
export class SurveyYouthCareerCheckComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly hcclService = inject(HcclService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly recaptchaService = inject(RecaptchaService);

  private static readonly CONTACT_CONSENT_STORAGE_KEY = 'youth-career-check-contact-consent';

  readonly captchaEnabled = true;
  readonly surveyTitle = 'Youth Career Check';
  readonly surveyCode = 'youth_career_check';
  readonly pagePath = '/public/surveys/youth-career-check';

  readonly steps: SurveyStepDefinition[] = [
    { step: 1, title: 'Intro', subtitle: 'Learn about the survey and what you will answer.' },
    { step: 2, title: 'About You', subtitle: 'Share a little about yourself so we can understand who this reaches.' },
    { step: 3, title: 'How You Explore Careers', subtitle: 'Choose the ways you learn about jobs and training.' },
    { step: 4, title: 'AI in Career Exploration', subtitle: 'Tell us how you use AI in your search for opportunities.' },
    { step: 5, title: 'Who Supports Your Career Search', subtitle: 'Share who is involved and how you plan for the future.' },
    { step: 6, title: 'Cohort Interest', subtitle: 'Tell us what kinds of group activities would feel useful.' },
    { step: 7, title: 'Ideas & Open Feedback', subtitle: 'Share what would help you most and what gets in the way.' },
    { step: 8, title: 'Submit Results', subtitle: 'Review and submit your responses.' },
  ];

  readonly totalSteps = this.steps.length;
  readonly stepNumbers = this.steps.map((step) => step.step);

  readonly ageRangeOptions: string[] = ['13–15', '16–18', '19–22', '23–26', 'Prefer not to say'];
  readonly currentStatusOptions: SurveyOption[] = [
    { id: 'middle_high_school', label: 'Middle/high school student' },
    { id: 'college_postsecondary', label: 'College/postsecondary student' },
    { id: 'working', label: 'Working (part-time or full-time)' },
    { id: 'not_school_or_working', label: 'Not currently in school or working' },
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
    { id: 'interested', label: 'No, but I’m interested in trying it' },
    { id: 'no', label: 'No' },
    { id: 'not_sure', label: 'I’m not sure' },
  ];
  readonly aiHelpfulnessOptions: SurveyOption[] = [
    { id: 'very_helpful', label: 'Very helpful' },
    { id: 'somewhat_helpful', label: 'Somewhat helpful' },
    { id: 'neutral', label: 'Neutral' },
    { id: 'not_very_helpful', label: 'Not very helpful' },
    { id: 'not_helpful', label: 'Not helpful at all' },
    { id: 'not_sure', label: 'I’m not sure' },
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
    { id: 'family', label: 'Other family members' },
    { id: 'friends', label: 'Friends or classmates' },
    { id: 'teachers', label: 'Teachers or coaches' },
    { id: 'mentors', label: 'Mentors (formal or informal)' },
    { id: 'counselor', label: 'School counselor or career advisor' },
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
    { id: 'youth_employment', label: 'Youth employment or summer jobs program' },
    { id: 'faith_community', label: 'Faith-based or community organization' },
    { id: 'skills_training', label: 'Skills training or certification program' },
    { id: 'mentoring', label: 'Mentoring program' },
    { id: 'other', label: 'Other' },
  ];
  readonly planningFrequencyOptions: SurveyOption[] = [
    { id: 'almost_daily', label: 'Almost every day' },
    { id: 'few_times_week', label: 'A few times a week' },
    { id: 'about_once_month', label: 'About once a month' },
    { id: 'few_times_year', label: 'A few times a year' },
    { id: 'only_big_events', label: 'Only when something big happens' },
  ];
  readonly planningApproachOptions: SurveyOption[] = [
    { id: 'only_when_brought_up', label: 'I only think about it when someone else brings it up' },
    { id: 'occasionally_own', label: 'I think about it on my own occasionally, but haven’t taken many steps' },
    { id: 'explore_here_and_there', label: 'I explore on my own here and there: reading, watching videos, talking to people' },
    { id: 'regular_time', label: 'I regularly set aside time to research and work toward a career direction' },
    { id: 'consistent_focus', label: 'It’s a consistent focus. I’m actively building skills, seeking experiences, or making plans' },
  ];
  readonly planningTimeframeOptions: SurveyOption[] = [
    { id: '3_6_months', label: 'The next 3–6 months' },
    { id: '1_2_years', label: 'The next 1–2 years' },
    { id: '3_5_years', label: 'The next 3–5 years' },
    { id: 'over_5_years', label: 'Longer than 5 years' },
    { id: 'not_sure', label: 'Not sure' },
  ];
  readonly cohortInterestOptions: SurveyOption[] = [
    { id: 'very_interested', label: 'Very interested' },
    { id: 'somewhat_interested', label: 'Somewhat interested' },
    { id: 'not_sure', label: 'Not sure' },
    { id: 'not_interested', label: 'Not interested' },
  ];
  readonly cohortActivityOptions: SurveyOption[] = [
    { id: 'in_person', label: 'In-person group sessions/discussion circles' },
    { id: 'online_group', label: 'Online group meetings or video calls' },
    { id: 'site_visits', label: 'Visiting workplaces (site visits, job shadows)' },
    { id: 'projects', label: 'Short projects or challenges related to a job' },
    { id: 'mentoring', label: 'One-on-one conversations with mentors' },
    { id: 'workshops', label: 'Short courses or workshops (online or in person)' },
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
    { id: 'local_or_online', label: 'Activities close to home or accessible online' },
    { id: 'stipend', label: 'Stipend or small incentives' },
    { id: 'jobs_or_internships', label: 'Clear connection to jobs or internships' },
    { id: 'trusted_adult', label: 'A trusted adult or organization running it' },
    { id: 'friends', label: 'Participating with friends' },
    { id: 'other', label: 'Other' },
  ];

  currentStep = 1;
  maxStepReached = 1;
  submitting = false;
  submitted = false;
  contactConsentAtSubmit = '';
  messagesList: SimpleMessageList = { messages: [] };

  selectedInfoSources = new Set<string>();
  selectedAiExperience = new Set<string>();
  selectedSupportPeople = new Set<string>();
  selectedProgramTypes = new Set<string>();
  selectedCohortActivities = new Set<string>();
  selectedCohortMotivators = new Set<string>();

  readonly form = this.fb.nonNullable.group({
    ageRange: [''],
    currentStatus: [''],
    currentStatusOther: [''],
    roughLocation: [''],
    careerExplorationStage: [''],
    careerInfoSourcesOther: [''],
    aiToolUse: [''],
    aiHelpfulness: [''],
    aiExperienceOther: [''],
    supportPeopleOther: [''],
    involvedInPrograms: [''],
    programTypesOther: [''],
    planningFrequency: [''],
    planningApproach: [''],
    planningTimeframe: [''],
    cohortInterest: [''],
    cohortActivitiesOther: [''],
    participationFrequency: [''],
    cohortMotivatorsOther: [''],
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

  get showCurrentStatusOtherField(): boolean {
    return this.form.controls.currentStatus.value === 'other';
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
      ageRange: this.form.controls.ageRange.value || '',
      currentStatus: this.getSelectedLabel(this.currentStatusOptions, this.form.controls.currentStatus.value),
      currentStatusOther: this.form.controls.currentStatusOther.value || '',
      roughLocation: this.form.controls.roughLocation.value || '',
      careerExplorationStage: this.getSelectedLabel(this.careerExplorationOptions, this.form.controls.careerExplorationStage.value),
      careerInfoSources: this.selectedInfoSources.size
        ? Array.from(this.selectedInfoSources).map((value) => this.getLabelFromOption(this.infoSourceOptions, value))
        : [],
      careerInfoSourcesOther: this.form.controls.careerInfoSourcesOther.value || '',
      aiToolUse: this.getSelectedLabel(this.aiToolUseOptions, this.form.controls.aiToolUse.value),
      aiHelpfulness: this.getSelectedLabel(this.aiHelpfulnessOptions, this.form.controls.aiHelpfulness.value),
      aiExperience: this.selectedAiExperience.size
        ? Array.from(this.selectedAiExperience).map((value) => this.getLabelFromOption(this.aiExperienceOptions, value))
        : [],
      aiExperienceOther: this.form.controls.aiExperienceOther.value || '',
      supportPeople: this.selectedSupportPeople.size
        ? Array.from(this.selectedSupportPeople).map((value) => this.getLabelFromOption(this.supportPersonOptions, value))
        : [],
      supportPeopleOther: this.form.controls.supportPeopleOther.value || '',
      involvedInPrograms: this.getSelectedLabel(this.programInvolvementOptions, this.form.controls.involvedInPrograms.value),
      programTypes: this.selectedProgramTypes.size
        ? Array.from(this.selectedProgramTypes).map((value) => this.getLabelFromOption(this.programTypeOptions, value))
        : [],
      programTypesOther: this.form.controls.programTypesOther.value || '',
      planningFrequency: this.getSelectedLabel(this.planningFrequencyOptions, this.form.controls.planningFrequency.value),
      planningApproach: this.getSelectedLabel(this.planningApproachOptions, this.form.controls.planningApproach.value),
      planningTimeframe: this.getSelectedLabel(this.planningTimeframeOptions, this.form.controls.planningTimeframe.value),
      cohortInterest: this.getSelectedLabel(this.cohortInterestOptions, this.form.controls.cohortInterest.value),
      cohortActivities: this.selectedCohortActivities.size
        ? Array.from(this.selectedCohortActivities).map((value) => this.getLabelFromOption(this.cohortActivityOptions, value))
        : [],
      cohortActivitiesOther: this.form.controls.cohortActivitiesOther.value || '',
      participationFrequency: this.getSelectedLabel(this.participationFrequencyOptions, this.form.controls.participationFrequency.value),
      cohortMotivators: this.selectedCohortMotivators.size
        ? Array.from(this.selectedCohortMotivators).map((value) => this.getLabelFromOption(this.cohortMotivatorOptions, value))
        : [],
      cohortMotivatorsOther: this.form.controls.cohortMotivatorsOther.value || '',
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
      if (!this.form.controls.currentStatus.value) {
        messages.push({ message: 'Please choose your current status.', severity: 1 });
      }
      if (this.form.controls.currentStatus.value === 'other' && !this.form.controls.currentStatusOther.value?.trim()) {
        messages.push({ message: 'Please describe your current status.', severity: 1 });
      }
    }

    if (this.currentStep === 3) {
      if (!this.form.controls.careerExplorationStage.value) {
        messages.push({ message: 'Please choose how much you have explored careers so far.', severity: 1 });
      }
      if (!this.selectedInfoSources.size && !this.form.controls.careerInfoSourcesOther.value?.trim()) {
        messages.push({ message: 'Please select at least one place you usually get career information from.', severity: 1 });
      }
    }

    if (this.currentStep === 4) {
      if (!this.form.controls.aiToolUse.value) {
        messages.push({ message: 'Please tell us whether you have used AI tools for career exploration.', severity: 1 });
      }
      if (!this.form.controls.aiHelpfulness.value) {
        messages.push({ message: 'Please tell us how helpful you think AI is for career exploration.', severity: 1 });
      }
      if (!this.selectedAiExperience.size && !this.form.controls.aiExperienceOther.value?.trim()) {
        messages.push({ message: 'Please select at least one experience with AI or add a note in the other field.', severity: 1 });
      }
    }

    if (this.currentStep === 5) {
      if (!this.selectedSupportPeople.size && !this.form.controls.supportPeopleOther.value?.trim()) {
        messages.push({ message: 'Please tell us who is usually involved in your career planning.', severity: 1 });
      }
      if (!this.form.controls.involvedInPrograms.value) {
        messages.push({ message: 'Please tell us whether you are involved in a community, nonprofit, or youth program.', severity: 1 });
      }
      if (!this.form.controls.planningFrequency.value) {
        messages.push({ message: 'Please tell us how often you think about or work on your career plans.', severity: 1 });
      }
      if (!this.form.controls.planningApproach.value) {
        messages.push({ message: 'Please tell us how you describe your approach to exploring career options.', severity: 1 });
      }
      if (!this.form.controls.planningTimeframe.value) {
        messages.push({ message: 'Please tell us what timeframe you are mainly planning for right now.', severity: 1 });
      }
    }

    if (this.currentStep === 6) {
      if (!this.form.controls.cohortInterest.value) {
        messages.push({ message: 'Please tell us how interested you would be in a small cohort.', severity: 1 });
      }
      if (!this.selectedCohortActivities.size && !this.form.controls.cohortActivitiesOther.value?.trim()) {
        messages.push({ message: 'Please select at least one kind of activity you would be willing to do.', severity: 1 });
      }
      if (!this.form.controls.participationFrequency.value) {
        messages.push({ message: 'Please let us know how often you would realistically participate.', severity: 1 });
      }
      if (!this.selectedCohortMotivators.size && !this.form.controls.cohortMotivatorsOther.value?.trim()) {
        messages.push({ message: 'Please select at least one thing that would make you more likely to join a cohort.', severity: 1 });
      }
    }

    if (this.currentStep === 7) {
      return messages;
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
    return window.sessionStorage.getItem(SurveyYouthCareerCheckComponent.CONTACT_CONSENT_STORAGE_KEY) || '';
  }

  private saveContactConsentToSessionStorage(consent: string): void {
    if (typeof window === 'undefined') {
      return;
    }
    window.sessionStorage.setItem(SurveyYouthCareerCheckComponent.CONTACT_CONSENT_STORAGE_KEY, consent);
  }
}
