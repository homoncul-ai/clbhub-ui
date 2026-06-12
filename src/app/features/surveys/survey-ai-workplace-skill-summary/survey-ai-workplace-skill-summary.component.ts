import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { HcclService, SurveyResponsePOSTData } from '@app/restsvc/hccl.service';
import { SimpleMessage, SimpleMessageList } from '@app/restsvc/common-request-service.model';
import { SurveysPublicHeaderComponent } from '../components/surveys-public-header.component';

declare global {
  interface Window {
    grecaptcha?: {
      render: (container: HTMLElement, parameters: Record<string, unknown>) => number;
      reset: (widgetId?: number) => void;
    };
    __onRecaptchaLoad?: () => void;
  }
}

interface SurveyStepDefinition {
  step: number;
  title: string;
  subtitle?: string;
}

interface BaselineCompetency {
  id: string;
  label: string;
  description: string;
}

interface GraduatePrepOption {
  id: string;
  label: string;
}

interface SupervisionLevelOption {
  id: string;
  label: string;
}

type GraduateTier = 'highSchool' | 'college';

@Component({
  selector: 'app-survey-ai-workplace-skill-summary',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SimpleMessagesSectionComponent,
    SurveysPublicHeaderComponent,
  ],
  templateUrl: './survey-ai-workplace-skill-summary.component.html',
  styleUrl: './survey-ai-workplace-skill-summary.component.scss',
})
export class SurveyAiWorkplaceSkillSummaryComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly hcclService = inject(HcclService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private static readonly CONTACT_CONSENT_STORAGE_KEY = 'ai-workplace-skill-summary-contact-consent';

  @ViewChild('captchaContainer') captchaContainer?: ElementRef<HTMLDivElement>;
  private recaptchaWidgetId: number | null = null;
  private recaptchaScriptPromise: Promise<void> | null = null;
  readonly recaptchaSiteKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

  readonly surveyTitle = 'AI Workplace Skill Summary';
  readonly surveyCode = 'ai_workplace_skill_summary';
  readonly pagePath = '/public/surveys/ai-workplace-skill-summary';

  readonly steps: SurveyStepDefinition[] = [
    { step: 1, title: 'Intro', subtitle: 'Help us understand workplace readiness expectations for AI-era graduates.' },
    { step: 2, title: 'Your Information' },
    { step: 3, title: 'Part 1: Industry & Demographics' },
    { step: 4, title: 'Part 2: Core Readiness & Graduate Comparisons' },
    { step: 5, title: 'Part 3: Performance & Onboarding Expectations' },
    { step: 6, title: 'Part 4: Market Value' },
    { step: 7, title: 'Submit Results', subtitle: 'Review and submit your responses.' },
  ];

  readonly totalSteps = this.steps.length;
  readonly stepNumbers = this.steps.map((s) => s.step);

  readonly industrySectorOptions: string[] = [
    'Technology, Software, & Data Science',
    'Healthcare, BioTech, & Pharmaceuticals',
    'Finance, Banking, & Insurance',
    'Marketing, Advertising, & Creative Arts',
    'Professional Services (Legal, Consulting, Accounting)',
    'Manufacturing, Logistics, & Supply Chain',
    'Retail, Hospitality, & Customer Service',
    'Education & Non-Profit',
    'Other',
  ];

  readonly baselineCompetencies: BaselineCompetency[] = [
    {
      id: 'ai_productivity',
      label: 'AI Productivity',
      description: 'Prompting GenAI tools to speed up daily, routine tasks.',
    },
    {
      id: 'output_verification',
      label: 'Output Verification',
      description: 'Fact-checking and identifying errors or biases in AI/digital outputs.',
    },
    {
      id: 'agile_adaptability',
      label: 'Agile Adaptability',
      description: 'Comfortably learning new software and workflows on the fly.',
    },
    {
      id: 'data_security_privacy',
      label: 'Data Security & Privacy',
      description: 'Safely handling company data and spotting digital threats.',
    },
    {
      id: 'independent_troubleshooting',
      label: 'Independent Troubleshooting',
      description: 'Searching for a solution independently before asking a manager.',
    },
    {
      id: 'asynchronous_collaboration',
      label: 'Asynchronous Collaboration',
      description: 'Coordinating work via tools like Slack, Teams, or shared dashboards.',
    },
    {
      id: 'basic_data_literacy',
      label: 'Basic Data Literacy',
      description: 'Reading a simple spreadsheet or chart to make a data-backed decision.',
    },
  ];

  readonly highSchoolPrepOptions: GraduatePrepOption[] = [
    {
      id: 'highly_prepared',
      label: 'Highly Prepared – Require minimal training on workplace tools and behavioral skills.',
    },
    {
      id: 'somewhat_prepared',
      label: 'Somewhat Prepared – Understand basic tech, but lack professional application and boundary-setting.',
    },
    {
      id: 'unprepared',
      label: 'Unprepared – Require significant remediation in basic workplace readiness and tool literacy.',
    },
    {
      id: 'not_applicable',
      label: 'N/A – We do not hire high school graduates for entry-level roles.',
    },
  ];

  readonly collegePrepOptions: GraduatePrepOption[] = [
    {
      id: 'highly_prepared',
      label: 'Highly Prepared – Ready to leverage advanced tools and manage tasks autonomously.',
    },
    {
      id: 'somewhat_prepared',
      label: 'Somewhat Prepared – Strong academic knowledge, but struggle with fast-paced software adaptation and critical data auditing.',
    },
    {
      id: 'unprepared',
      label: 'Unprepared – Rely too heavily on automated tools without understanding underlying concepts or data verification.',
    },
  ];

  readonly supervisionLevelOptions: SupervisionLevelOption[] = [
    {
      id: 'high',
      label: 'High Supervision: Needs highly structured, task-by-task instructions and daily check-ins.',
    },
    {
      id: 'moderate',
      label: 'Moderate Supervision: Can manage daily routine workflows independently, but needs guidance on irregular problems.',
    },
    {
      id: 'low',
      label: 'Low Supervision: Given an outcome, they can independently research, troubleshoot, and execute the project.',
    },
  ];

  readonly marketValueImpactOptions: string[] = [
    'It makes them significantly more competitive against other applicants.',
    'It justifies a higher starting salary or wage premium within our standard pay bands.',
    'It has no impact on competitiveness, but reduces their initial training/onboarding time.',
    'It has no impact on our hiring decisions or compensation packages.',
  ];

  readonly graduateTierLabels: Record<GraduateTier, string> = {
    highSchool: 'High School Graduates',
    college: 'College Graduates',
  };

  currentStep = 1;
  submitting = false;
  submitted = false;
  contactConsentAtSubmit = '';
  messagesList: SimpleMessageList = { messages: [] };

  selectedIndustrySector = '';
  selectedBaselineEssentials = new Set<string>();
  selectedGraduatePreparedness = new Map<GraduateTier, string>();
  selectedSupervisionLevels = new Map<GraduateTier, string>();
  selectedMarketValueImpacts = new Set<string>();

  readonly form = this.fb.nonNullable.group({
    name: [''],
    organization: [''],
    email: [''],
    canContactForFeedback: [''],
    primaryIndustryOther: [''],
    captchaToken: [''],
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
        this.maybeInitCaptcha();
      }
    });

    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      this.maybeInitCaptcha();
    }, 0);
  }

  ngAfterViewInit(): void {
    this.maybeInitCaptcha();
  }

  ngOnDestroy(): void {
    if (this.recaptchaWidgetId !== null && window.grecaptcha) {
      window.grecaptcha.reset(this.recaptchaWidgetId);
    }
  }

  get optedInToContact(): boolean {
    return this.contactConsentAtSubmit === 'yes';
  }

  get currentStepDefinition(): SurveyStepDefinition {
    return this.steps[this.currentStep - 1];
  }

  get showIndustryOtherField(): boolean {
    return this.selectedIndustrySector === 'Other';
  }

  get displayIndustrySector(): string {
    if (this.selectedIndustrySector === 'Other') {
      const other = this.form.controls.primaryIndustryOther.value.trim();
      return other ? `Other: ${other}` : 'Other';
    }
    return this.selectedIndustrySector || '—';
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
    this.maybeInitCaptcha();
  }

  selectIndustrySector(sector: string): void {
    this.selectedIndustrySector = sector;
    if (sector !== 'Other') {
      this.form.controls.primaryIndustryOther.setValue('');
    }
  }

  isIndustrySectorSelected(sector: string): boolean {
    return this.selectedIndustrySector === sector;
  }

  baselineSelectionKey(competencyId: string, tier: GraduateTier): string {
    return `${competencyId}|||${tier}`;
  }

  isBaselineEssentialSelected(competencyId: string, tier: GraduateTier): boolean {
    return this.selectedBaselineEssentials.has(this.baselineSelectionKey(competencyId, tier));
  }

  toggleBaselineEssential(competencyId: string, tier: GraduateTier): void {
    this.toggleMultiSelection(this.selectedBaselineEssentials, this.baselineSelectionKey(competencyId, tier));
  }

  getBaselineEssentialsForTier(tier: GraduateTier): string[] {
    const suffix = `|||${tier}`;
    return this.baselineCompetencies
      .filter((competency) => this.selectedBaselineEssentials.has(`${competency.id}${suffix}`))
      .map((competency) => `${competency.label}: ${competency.description}`);
  }

  isGraduatePrepSelected(tier: GraduateTier, optionId: string): boolean {
    return this.selectedGraduatePreparedness.get(tier) === optionId;
  }

  selectGraduatePrep(tier: GraduateTier, optionId: string): void {
    this.selectedGraduatePreparedness.set(tier, optionId);
  }

  getGraduatePrepLabel(tier: GraduateTier): string {
    const optionId = this.selectedGraduatePreparedness.get(tier);
    if (!optionId) {
      return '—';
    }
    const options = tier === 'highSchool' ? this.highSchoolPrepOptions : this.collegePrepOptions;
    return options.find((option) => option.id === optionId)?.label ?? '—';
  }

  isSupervisionLevelSelected(tier: GraduateTier, levelId: string): boolean {
    return this.selectedSupervisionLevels.get(tier) === levelId;
  }

  selectSupervisionLevel(tier: GraduateTier, levelId: string): void {
    this.selectedSupervisionLevels.set(tier, levelId);
  }

  getSupervisionLevelLabel(tier: GraduateTier): string {
    const levelId = this.selectedSupervisionLevels.get(tier);
    if (!levelId) {
      return '—';
    }
    return this.supervisionLevelOptions.find((option) => option.id === levelId)?.label ?? '—';
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

  formatContactConsent(value: string): string {
    if (value === 'yes') {
      return 'Yes';
    }
    if (value === 'no') {
      return 'No';
    }
    return '—';
  }

  formatSelectionSummary(values: Set<string>): string {
    return values.size ? Array.from(values).join(', ') : '—';
  }

  submit(): void {
    if (!this.form.controls.captchaToken.value) {
      this.setMessages([{ message: 'Please complete the captcha.', severity: 1 }]);
      return;
    }

    this.submitting = true;
    this.setMessages([]);

    const value = this.form.getRawValue();
    const surveyData: Record<string, unknown> = {
      surveyCode: this.surveyCode,
      pagePath: this.pagePath,
      name: value.name.trim(),
      organization: value.organization.trim(),
      email: value.email.trim(),
      canContactForFeedback: value.canContactForFeedback,
      captchaToken: value.captchaToken,
      primaryIndustry: this.selectedIndustrySector,
      primaryIndustryOther: value.primaryIndustryOther.trim(),
      baselineEssentials: {
        highSchool: this.getBaselineEssentialsForTier('highSchool'),
        college: this.getBaselineEssentialsForTier('college'),
      },
      graduatePreparedness: {
        highSchool: this.getGraduatePrepLabel('highSchool'),
        college: this.getGraduatePrepLabel('college'),
      },
      expectedSupervision: {
        highSchool: this.getSupervisionLevelLabel('highSchool'),
        college: this.getSupervisionLevelLabel('college'),
      },
      aiProficiencyImpact: Array.from(this.selectedMarketValueImpacts),
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
            SurveyAiWorkplaceSkillSummaryComponent.CONTACT_CONSENT_STORAGE_KEY,
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
          if (this.recaptchaWidgetId !== null && window.grecaptcha) {
            window.grecaptcha.reset(this.recaptchaWidgetId);
            this.form.controls.captchaToken.setValue('');
          }
        },
      });
  }

  private showThankYouPage(contactConsent: string): void {
    this.submitted = true;
    this.contactConsentAtSubmit = contactConsent;
    this.scrollToTop();
  }

  private readStoredContactConsent(): string {
    return sessionStorage.getItem(SurveyAiWorkplaceSkillSummaryComponent.CONTACT_CONSENT_STORAGE_KEY) ?? '';
  }

  private maybeInitCaptcha(): void {
    if (this.currentStep === this.totalSteps && !this.submitted) {
      setTimeout(() => void this.initializeRecaptcha(), 100);
    }
  }

  private async initializeRecaptcha(): Promise<void> {
    if (!this.captchaContainer?.nativeElement || this.submitted) {
      return;
    }
    await this.loadRecaptchaScript();
    if (!window.grecaptcha || this.recaptchaWidgetId !== null) {
      return;
    }
    this.recaptchaWidgetId = window.grecaptcha.render(this.captchaContainer.nativeElement, {
      sitekey: this.recaptchaSiteKey,
      callback: (token: string) => this.form.controls.captchaToken.setValue(token || ''),
      'expired-callback': () => this.form.controls.captchaToken.setValue(''),
      'error-callback': () => this.form.controls.captchaToken.setValue(''),
    });
  }

  private loadRecaptchaScript(): Promise<void> {
    if (window.grecaptcha?.render) {
      return Promise.resolve();
    }
    if (this.recaptchaScriptPromise) {
      return this.recaptchaScriptPromise;
    }

    this.recaptchaScriptPromise = new Promise<void>((resolve, reject) => {
      const existing = document.querySelector('script[data-recaptcha-script="true"]') as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error('Failed to load reCAPTCHA.')), { once: true });
        return;
      }

      window.__onRecaptchaLoad = () => resolve();
      const script = document.createElement('script');
      script.setAttribute('data-recaptcha-script', 'true');
      script.src = 'https://www.google.com/recaptcha/api.js?onload=__onRecaptchaLoad&render=explicit';
      script.async = true;
      script.defer = true;
      script.onerror = () => reject(new Error('Failed to load reCAPTCHA.'));
      document.head.appendChild(script);
    });

    return this.recaptchaScriptPromise;
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
