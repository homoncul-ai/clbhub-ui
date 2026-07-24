import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { SimpleMessagesSectionComponent } from '@app/components/_global/simple-messages-section/simple-messages-section.component';
import { MenuControlDataListComponent } from '@app/components/_global/menu-control-data-list/menu-control-data-list.component';
import { HcclService, MenuControlData, MenuControlDataList, CheckinSurveyPOSTData } from '@app/restsvc/hccl.service';
import { SimpleMessage, SimpleMessageList } from '@app/restsvc/common-request-service.model';
import { RecaptchaDisclosureComponent } from '@app/shared/components/recaptcha-disclosure/recaptcha-disclosure.component';
import { RecaptchaService } from '@app/shared/services/recaptcha.service';
import { SurveysPublicHeaderComponent } from '../components/surveys-public-header.component';
import { CAREER_LADDERS, CareerLadder } from '@app/shared/data/career-ladders';
import { GOOGLE_AI_COURSES, GoogleAICourse } from '@app/shared/data/google-ai-courses';
import {
  SurveyDraftV1,
  arrayToSet,
  clearSurveyDraft,
  loadSurveyDraft,
  saveSurveyDraft,
  setToArray,
  surveyDraftHasProgress,
} from '../utils/survey-draft-storage';

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
    RecaptchaDisclosureComponent,
  ],
  templateUrl: './survey-checkin.component.html',
  styleUrl: './survey-checkin.component.scss',
})
export class SurveyCheckinComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly hcclService = inject(HcclService);
  private readonly recaptchaService = inject(RecaptchaService);

  private static readonly DRAFT_SAVE_DEBOUNCE_MS = 250;
  private draftSaveTimer: ReturnType<typeof setTimeout> | null = null;

  readonly surveyCode = 'checkin';

  currentStep = 1;
  totalSteps = 4;
  maxStepReached = 1;
  submitting = false;
  submitted = false;
  loadingUiData = false;
  preloadFailed = false;
  messagesList: SimpleMessageList = { messages: [] };
  showResumePrompt = false;
  pendingDraft: SurveyDraftV1 | null = null;

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
  selectedSchoolName = '';

  messageHandleEdited = false;

  readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    messageHandle: [''],
    birthMonth: [0, [Validators.required, Validators.min(1), Validators.max(12)]],
    birthYear: [0, [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
    schoolId: [''],
    acceptTos: [false, [Validators.requiredTrue]],
  });

  readonly aiHubUrl = 'https://aihub.masstech.org/google-certificates';

  ngOnInit(): void {
    const draft = loadSurveyDraft(this.surveyCode);
    if (surveyDraftHasProgress(draft)) {
      this.pendingDraft = draft;
      this.showResumePrompt = true;
      this.currentStep = 1;
      this.maxStepReached = 1;
    }

    this.loadSchoolData();
    void this.recaptchaService.preload();
    this.form.valueChanges.subscribe(() => this.scheduleDraftSave());
    setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }), 0);
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
    const savedMax =
      typeof this.pendingDraft.answers['maxStepReached'] === 'number'
        ? this.pendingDraft.answers['maxStepReached']
        : step;
    this.maxStepReached = Math.max(1, Math.min(Math.max(savedMax, step), this.totalSteps));
    this.showResumePrompt = false;
    this.pendingDraft = null;
    this.currentStep = step;
    this.setMessages([]);
    this.scheduleDraftSave();
  }

  startOver(): void {
    clearSurveyDraft(this.surveyCode);
    this.pendingDraft = null;
    this.showResumePrompt = false;
    this.resetAnswersToDefaults();
    this.currentStep = 1;
    this.maxStepReached = 1;
    this.setMessages([]);
  }

  onDraftFieldChange(): void {
    this.scheduleDraftSave();
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

  onEmailInput(): void {
    if (!this.messageHandleEdited) {
      this.form.controls.messageHandle.setValue(this.form.controls.email.value);
    }
  }

  onMessageHandleInput(): void {
    this.messageHandleEdited = true;
  }

  onSchoolSelectionChange(selected: MenuControlData | null): void {
    this.form.controls.schoolId.setValue(selected?.id || '');
    this.form.controls.schoolId.markAsTouched();
    this.selectedSchoolName = selected?.name || '';
    this.scheduleDraftSave();
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
    this.scheduleDraftSave();
  }

  isInterestSelected(id: string): boolean {
    return this.selectedInterests.has(id);
  }

  selectCourse(courseId: string): void {
    this.selectedCourseId = courseId;
    this.scheduleDraftSave();
  }

  nextStep(): void {
    if (this.showResumePrompt) {
      return;
    }
    if (this.currentStep === 1) {
      const msgs = this.validateStep1();
      if (msgs.length) {
        this.setMessages(msgs);
        return;
      }
    }
    if (this.currentStep === 2 && !this.selectedCourseId) {
      this.setMessages([{ message: 'Please select an AI course to continue.', severity: 1 }]);
      return;
    }
    this.setMessages([]);
    this.currentStep = Math.min(this.currentStep + 1, this.totalSteps);
    this.maxStepReached = Math.max(this.maxStepReached, this.currentStep);
    this.scheduleDraftSave();
  }

  prevStep(): void {
    if (this.showResumePrompt) {
      return;
    }
    this.setMessages([]);
    this.currentStep = Math.max(this.currentStep - 1, 1);
    this.scheduleDraftSave();
  }

  /** True when the given step has already been reached and can be navigated to directly. */
  canNavigateTo(step: number): boolean {
    return !this.showResumePrompt && step >= 1 && step <= this.maxStepReached && step !== this.currentStep;
  }

  /** Jump directly to a previously reached step (via the dots). */
  goToStep(step: number): void {
    if (!this.canNavigateTo(step)) {
      return;
    }
    this.setMessages([]);
    this.currentStep = step;
    this.scheduleDraftSave();
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

  async submit(): Promise<void> {
    const msgs: SimpleMessage[] = [];
    if (!this.form.controls.acceptTos.value) {
      msgs.push({ message: 'You must accept the Terms & Conditions.', severity: 1 });
    }
    if (msgs.length) {
      this.setMessages(msgs);
      return;
    }

    this.submitting = true;
    this.setMessages([]);

    let captchaToken: string;
    try {
      captchaToken = await this.recaptchaService.execute('survey_checkin');
    } catch {
      this.submitting = false;
      this.setMessages([{ message: 'Security verification failed. Please try again.', severity: 1 }]);
      return;
    }

    const value = this.form.getRawValue();
    const payload: CheckinSurveyPOSTData = {
      firstName: value.firstName.trim(),
      lastName: value.lastName.trim(),
      email: value.email.trim(),
      messageHandle: (value.messageHandle || value.email).trim(),
      schoolId: value.schoolId,
      birthMonth: value.birthMonth,
      birthYear: value.birthYear,
      selectedCourseId: this.selectedCourseId,
      courseGoals: this.courseGoals.trim(),
      wantsGuidance: this.wantsGuidance,
      interests: Array.from(this.selectedInterests),
      otherInterest: this.otherInterest.trim(),
      captchaToken,
    };

    this.hcclService.saveCheckinSurvey(payload).pipe(
      finalize(() => (this.submitting = false))
    ).subscribe({
      next: (response) => {
        clearSurveyDraft(this.surveyCode);
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
    }, SurveyCheckinComponent.DRAFT_SAVE_DEBOUNCE_MS);
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
      selectedInterests: setToArray(this.selectedInterests),
      otherInterest: this.otherInterest,
      selectedCourseId: this.selectedCourseId,
      courseGoals: this.courseGoals,
      wantsGuidance: this.wantsGuidance,
      selectedSchoolName: this.selectedSchoolName,
      messageHandleEdited: this.messageHandleEdited,
      maxStepReached: this.maxStepReached,
    };
  }

  private hydrateAnswers(answers: Record<string, unknown>): void {
    const formValue = answers['form'];
    if (formValue && typeof formValue === 'object') {
      this.form.patchValue(formValue as Record<string, string | number | boolean>);
    }
    this.selectedInterests = arrayToSet(answers['selectedInterests']);
    this.otherInterest = typeof answers['otherInterest'] === 'string' ? answers['otherInterest'] : '';
    this.selectedCourseId = typeof answers['selectedCourseId'] === 'string' ? answers['selectedCourseId'] : '';
    this.courseGoals = typeof answers['courseGoals'] === 'string' ? answers['courseGoals'] : '';
    this.wantsGuidance = answers['wantsGuidance'] === true;
    this.selectedSchoolName =
      typeof answers['selectedSchoolName'] === 'string' ? answers['selectedSchoolName'] : '';
    this.messageHandleEdited = answers['messageHandleEdited'] === true;
  }

  private resetAnswersToDefaults(): void {
    this.form.reset({
      firstName: '',
      lastName: '',
      email: '',
      messageHandle: '',
      birthMonth: 0,
      birthYear: 0,
      schoolId: '',
      acceptTos: false,
    });
    this.selectedInterests = new Set();
    this.otherInterest = '';
    this.selectedCourseId = '';
    this.courseGoals = '';
    this.wantsGuidance = false;
    this.selectedSchoolName = '';
    this.messageHandleEdited = false;
  }
}
