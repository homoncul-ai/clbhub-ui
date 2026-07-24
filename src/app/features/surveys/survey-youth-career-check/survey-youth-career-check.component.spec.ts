import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { HcclService } from '@app/restsvc/hccl.service';
import { RecaptchaService } from '@app/shared/services/recaptcha.service';
import {
  clearSurveyDraft,
  saveSurveyDraft,
  surveyDraftStorageKey,
} from '../utils/survey-draft-storage';
import { SurveyYouthCareerCheckComponent } from './survey-youth-career-check.component';

describe('SurveyYouthCareerCheckComponent draft resume', () => {
  let component: SurveyYouthCareerCheckComponent;
  let fixture: ComponentFixture<SurveyYouthCareerCheckComponent>;
  const surveyCode = 'youth_career_check';

  const hcclServiceSpy = jasmine.createSpyObj('HcclService', ['saveSurveyResponse']);
  const recaptchaServiceSpy = jasmine.createSpyObj('RecaptchaService', ['execute', 'preload']);
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    hcclServiceSpy.saveSurveyResponse.calls.reset();
    recaptchaServiceSpy.execute.and.resolveTo('captcha-token');
    hcclServiceSpy.saveSurveyResponse.and.returnValue(of({ messages: { messages: [] } }));

    await TestBed.configureTestingModule({
      imports: [SurveyYouthCareerCheckComponent],
      providers: [
        { provide: HcclService, useValue: hcclServiceSpy },
        { provide: RecaptchaService, useValue: recaptchaServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParamMap: convertToParamMap({}) },
            queryParamMap: of(convertToParamMap({})),
          },
        },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    clearSurveyDraft(surveyCode);
  });

  it('Continue hydrates answers and restores step from a pre-seeded draft', () => {
    saveSurveyDraft(surveyCode, {
      currentStep: 3,
      answers: {
        form: { ageRange: '16–18', workStatus: 'part_time' },
        selectedInfoSources: ['school', 'friends'],
        selectedAiExperience: [],
        selectedSupportPeople: [],
        selectedProgramTypes: [],
        selectedOnlineToolFeatures: [],
        selectedCohortActivities: [],
        selectedCohortMotivators: [],
      },
    });

    fixture = TestBed.createComponent(SurveyYouthCareerCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.showResumePrompt).toBeTrue();
    expect(component.currentStep).toBe(1);

    component.continueDraft();

    expect(component.showResumePrompt).toBeFalse();
    expect(component.currentStep).toBe(3);
    expect(component.form.controls.ageRange.value).toBe('16–18');
    expect(component.form.controls.workStatus.value).toBe('part_time');
    expect(component.selectedInfoSources.has('school')).toBeTrue();
    expect(component.selectedInfoSources.has('friends')).toBeTrue();
  });

  it('successful submit clears the draft', fakeAsync(async () => {
    saveSurveyDraft(surveyCode, {
      currentStep: 2,
      answers: { form: { ageRange: '16–18' } },
    });
    expect(window.localStorage.getItem(surveyDraftStorageKey(surveyCode))).not.toBeNull();

    fixture = TestBed.createComponent(SurveyYouthCareerCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.startOver();

    component.form.patchValue({ ageRange: '16–18', followUpConsent: 'no' });
    await component.submit();
    tick();

    expect(hcclServiceSpy.saveSurveyResponse).toHaveBeenCalled();
    expect(window.localStorage.getItem(surveyDraftStorageKey(surveyCode))).toBeNull();
  }));
});
