import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { HcclService, MenuControlData, MenuControlDataList, CheckinSurveyPOSTData } from '@app/restsvc/hccl.service';
import { SimpleMessage, SimpleMessageList } from '@app/restsvc/common-request-service.model';
import { SurveysPublicHeaderComponent } from '../components/surveys-public-header.component';
import { CAREER_LADDERS, CareerLadder } from '@app/shared/data/career-ladders';
import { GOOGLE_AI_COURSES, GoogleAICourse } from '@app/shared/data/google-ai-courses';

declare global {
  interface Window {
    grecaptcha?: {
      render: (container: HTMLElement, parameters: Record<string, unknown>) => number;
      reset: (widgetId?: number) => void;
    };
    __onRecaptchaLoad?: () => void;
  }
}

@Component({
  selector: 'app-survey-checkin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SimpleMessagesSectionComponent,
    MenuControlDataListComponent,
    SurveysPublicHeaderComponent,
  ],
  templateUrl: './survey-checkin.component.html',
  styleUrl: './survey-checkin.component.scss',
})
export class SurveyCheckinComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly hcclService = inject(HcclService);

  @ViewChild('captchaContainer') captchaContainer?: ElementRef<HTMLDivElement>;
  private recaptchaWidgetId: number | null = null;
  private recaptchaScriptPromise: Promise<void> | null = null;
  readonly recaptchaSiteKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

  currentStep = 1;
  totalSteps = 4;
  submitting = false;
  submitted = false;
  loadingUiData = false;
  preloadFailed = false;
  messagesList: SimpleMessageList = { messages: [] };

  schoolSelectData: MenuControlDataList | null = null;
  readonly careerLadders: CareerLadder[] = CAREER_LADDERS;
  readonly courses: GoogleAICourse[] = GOOGLE_AI_COURSES;

  readonly years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  readonly months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' },
    { value: 3, label: 'March' }, { value: 4, label: 'April' },
    { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' },
    { value: 9, label: 'September' }, { value: 10, label: 'October' },
    { value: 11, label: 'November' }, { value: 12, label: 'December' },
  ];

  selectedInterests: Set<string> = new Set();
  otherInterest = '';
  selectedCourseId = '';
  courseGoals = '';
  wantsGuidance = false;

  readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    birthMonth: [0, [Validators.required, Validators.min(1), Validators.max(12)]],
    birthYear: [0, [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
    schoolId: [''],
    acceptTos: [false, [Validators.requiredTrue]],
    captchaToken: ['', [Validators.required]],
  });

  readonly aiHubUrl = 'https://aihub.masstech.org/google-certificates';

  ngOnInit(): void {
    this.loadSchoolData();
    setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }), 0);
  }

  async ngAfterViewInit(): Promise<void> {
    // Captcha init deferred until step 3
  }

  ngOnDestroy(): void {
    if (this.recaptchaWidgetId !== null && window.grecaptcha) {
      window.grecaptcha.reset(this.recaptchaWidgetId);
    }
  }

  loadSchoolData(): void {
    this.loadingUiData = true;
    this.preloadFailed = false;
    this.hcclService.resolvePublicSignupUIData('').pipe(
      finalize(() => (this.loadingUiData = false))
    ).subscribe({
      next: (res) => {
        this.schoolSelectData = res?.schoolSelectData || null;
        if (!this.schoolSelectData?.menuItems?.length) {
          this.preloadFailed = true;
        }
      },
      error: () => {
        this.preloadFailed = true;
      },
    });
  }

  onSchoolSelectionChange(selected: MenuControlData | null): void {
    this.form.controls.schoolId.setValue(selected?.id || '');
    this.form.controls.schoolId.markAsTouched();
  }

  get computedAge(): number | null {
    const year = Number(this.form.controls.birthYear.value);
    const month = Number(this.form.controls.birthMonth.value);
    if (year < 1900 || month < 1) {
      return null;
    }
    const now = new Date();
    let age = now.getFullYear() - year;
    // Subtract a year if this year's birthday hasn't occurred yet (month-level approximation).
    if (now.getMonth() + 1 < month) {
      age -= 1;
    }
    return age;
  }

  get showSchoolSelector(): boolean {
    const age = this.computedAge;
    return age !== null && age > 16 && age < 19;
  }

  toggleInterest(id: string): void {
    if (this.selectedInterests.has(id)) {
      this.selectedInterests.delete(id);
    } else {
      this.selectedInterests.add(id);
    }
  }

  isInterestSelected(id: string): boolean {
    return this.selectedInterests.has(id);
  }

  selectCourse(courseId: string): void {
    this.selectedCourseId = courseId;
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      const msgs = this.validateStep1();
      if (msgs.length) {
        this.setMessages(msgs);
        return;
      }
    }
    this.setMessages([]);
    this.currentStep = Math.min(this.currentStep + 1, this.totalSteps);

    if (this.currentStep === this.totalSteps) {
      setTimeout(() => this.initializeRecaptcha(), 100);
    }
  }

  prevStep(): void {
    this.setMessages([]);
    this.currentStep = Math.max(this.currentStep - 1, 1);
  }

  private validateStep1(): SimpleMessage[] {
    const msgs: SimpleMessage[] = [];
    const c = this.form.controls;
    if (!c.firstName.value?.trim()) msgs.push({ message: 'First name is required.', severity: 1 });
    if (!c.lastName.value?.trim()) msgs.push({ message: 'Last name is required.', severity: 1 });
    if (!c.email.value?.trim()) msgs.push({ message: 'Email is required.', severity: 1 });
    else if (c.email.hasError('email')) msgs.push({ message: 'Enter a valid email address.', severity: 1 });
    if (c.birthMonth.value < 1) msgs.push({ message: 'Birth month is required.', severity: 1 });
    if (c.birthYear.value < 1900) msgs.push({ message: 'Birth year is required.', severity: 1 });
    return msgs;
  }

  submit(): void {
    const msgs: SimpleMessage[] = [];
    if (!this.form.controls.acceptTos.value) {
      msgs.push({ message: 'You must accept the Terms & Conditions.', severity: 1 });
    }
    if (!this.form.controls.captchaToken.value) {
      msgs.push({ message: 'Please complete the captcha.', severity: 1 });
    }
    if (msgs.length) {
      this.setMessages(msgs);
      return;
    }

    this.submitting = true;
    this.setMessages([]);

    const value = this.form.getRawValue();
    const payload: CheckinSurveyPOSTData = {
      firstName: value.firstName.trim(),
      lastName: value.lastName.trim(),
      email: value.email.trim(),
      schoolId: value.schoolId,
      birthMonth: value.birthMonth,
      birthYear: value.birthYear,
      selectedCourseId: this.selectedCourseId,
      courseGoals: this.courseGoals.trim(),
      wantsGuidance: this.wantsGuidance,
      interests: Array.from(this.selectedInterests),
      otherInterest: this.otherInterest.trim(),
      captchaToken: value.captchaToken,
    };

    this.hcclService.saveCheckinSurvey(payload).pipe(
      finalize(() => (this.submitting = false))
    ).subscribe({
      next: (response) => {
        this.messagesList = response?.messages || { messages: [] };
        this.submitted = true;
      },
      error: (error) => {
        const fallback = { message: 'Unable to submit. Please try again later.', severity: 1 };
        this.messagesList = error?.error?.messages || { messages: [fallback] };
      },
    });
  }

  getCourseName(courseId: string): string {
    return this.courses.find(c => c.id === courseId)?.title || '';
  }

  getInterestNames(): string {
    return Array.from(this.selectedInterests)
      .map(id => this.careerLadders.find(l => l.id === id)?.name || id)
      .join(', ');
  }

  private setMessages(messages: SimpleMessage[]): void {
    this.messagesList = { messages };
  }

  private async initializeRecaptcha(): Promise<void> {
    if (!this.captchaContainer?.nativeElement) return;
    await this.loadRecaptchaScript();
    if (!window.grecaptcha || this.recaptchaWidgetId !== null) return;
    this.recaptchaWidgetId = window.grecaptcha.render(this.captchaContainer.nativeElement, {
      sitekey: this.recaptchaSiteKey,
      callback: (token: string) => this.form.controls.captchaToken.setValue(token || ''),
      'expired-callback': () => this.form.controls.captchaToken.setValue(''),
      'error-callback': () => this.form.controls.captchaToken.setValue(''),
    });
  }

  private loadRecaptchaScript(): Promise<void> {
    if (window.grecaptcha?.render) return Promise.resolve();
    if (this.recaptchaScriptPromise) return this.recaptchaScriptPromise;

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
}
