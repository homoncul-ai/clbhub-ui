import {
  arrayToSet,
  clearSurveyDraft,
  loadSurveyDraft,
  mapToObject,
  objectToMap,
  saveSurveyDraft,
  setToArray,
  surveyDraftHasProgress,
  surveyDraftStorageKey,
} from './survey-draft-storage';

describe('survey-draft-storage', () => {
  const surveyCode = 'youth_career_check';
  const storageKey = surveyDraftStorageKey(surveyCode);

  beforeEach(() => {
    window.localStorage.clear();
  });

  it('builds the expected storage key', () => {
    expect(storageKey).toBe('clbhub.survey.draft.youth_career_check');
  });

  it('save → load round trip', () => {
    saveSurveyDraft(surveyCode, {
      currentStep: 3,
      answers: { ageRange: '16–18', selectedInfoSources: ['school', 'friends'] },
    });

    const loaded = loadSurveyDraft(surveyCode);
    expect(loaded).not.toBeNull();
    expect(loaded!.version).toBe(1);
    expect(loaded!.currentStep).toBe(3);
    expect(loaded!.answers['ageRange']).toBe('16–18');
    expect(loaded!.answers['selectedInfoSources']).toEqual(['school', 'friends']);
    expect(typeof loaded!.updatedAt).toBe('string');
    expect(loaded!.updatedAt.length).toBeGreaterThan(0);
  });

  it('clear removes draft', () => {
    saveSurveyDraft(surveyCode, { currentStep: 2, answers: { email: 'a@b.com' } });
    clearSurveyDraft(surveyCode);
    expect(loadSurveyDraft(surveyCode)).toBeNull();
  });

  it('corrupt JSON → null', () => {
    window.localStorage.setItem(storageKey, '{not-json');
    expect(loadSurveyDraft(surveyCode)).toBeNull();
  });

  it('wrong version → null', () => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ version: 99, currentStep: 2, answers: {}, updatedAt: 'x' }),
    );
    expect(loadSurveyDraft(surveyCode)).toBeNull();
  });

  it('missing localStorage getItem → load returns null without throw', () => {
    const original = window.localStorage.getItem.bind(window.localStorage);
    spyOn(window.localStorage, 'getItem').and.callFake(() => {
      throw new Error('unavailable');
    });
    expect(() => loadSurveyDraft(surveyCode)).not.toThrow();
    expect(loadSurveyDraft(surveyCode)).toBeNull();
    (window.localStorage.getItem as jasmine.Spy).and.callFake(original);
  });

  it('save does not throw when setItem fails', () => {
    spyOn(window.localStorage, 'setItem').and.throwError('quota');
    expect(() =>
      saveSurveyDraft(surveyCode, { currentStep: 1, answers: { a: 1 } }),
    ).not.toThrow();
  });

  it('surveyDraftHasProgress detects step and answers', () => {
    expect(surveyDraftHasProgress(null)).toBeFalse();
    expect(
      surveyDraftHasProgress({
        version: 1,
        updatedAt: '',
        currentStep: 1,
        answers: {},
      }),
    ).toBeFalse();
    expect(
      surveyDraftHasProgress({
        version: 1,
        updatedAt: '',
        currentStep: 2,
        answers: {},
      }),
    ).toBeTrue();
    expect(
      surveyDraftHasProgress({
        version: 1,
        updatedAt: '',
        currentStep: 1,
        answers: { form: { ageRange: '16–18' } },
      }),
    ).toBeTrue();
  });

  it('set/array and map/object helpers round-trip', () => {
    expect(setToArray(new Set(['a', 'b']))).toEqual(['a', 'b']);
    expect(Array.from(arrayToSet(['a', 1, 'b']))).toEqual(['a', 'b']);
    expect(arrayToSet(null).size).toBe(0);

    const map = new Map<string, string>([
      ['highSchool', 'high'],
      ['college', 'moderate'],
    ]);
    expect(mapToObject(map)).toEqual({ highSchool: 'high', college: 'moderate' });
    expect(objectToMap({ highSchool: 'high', skip: 1 })).toEqual(new Map([['highSchool', 'high']]));
    expect(objectToMap(null).size).toBe(0);
  });
});
