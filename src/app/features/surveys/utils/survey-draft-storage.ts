/**
 * Client-side draft persistence for multi-step public surveys.
 * Uses localStorage so progress survives tab close and browser restart.
 * Failures (private mode, quota, SSR) are swallowed — surveys still work.
 */

export interface SurveyDraftV1 {
  version: 1;
  updatedAt: string;
  currentStep: number;
  answers: Record<string, unknown>;
}

const DRAFT_KEY_PREFIX = 'clbhub.survey.draft.';

export function surveyDraftStorageKey(surveyCode: string): string {
  return `${DRAFT_KEY_PREFIX}${surveyCode}`;
}

export function loadSurveyDraft(surveyCode: string): SurveyDraftV1 | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(surveyDraftStorageKey(surveyCode));
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<SurveyDraftV1>;
    if (parsed?.version !== 1 || typeof parsed.currentStep !== 'number' || !parsed.answers || typeof parsed.answers !== 'object') {
      return null;
    }
    return {
      version: 1,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : '',
      currentStep: parsed.currentStep,
      answers: parsed.answers as Record<string, unknown>,
    };
  } catch {
    return null;
  }
}

export function saveSurveyDraft(
  surveyCode: string,
  draft: Omit<SurveyDraftV1, 'version' | 'updatedAt'> | SurveyDraftV1,
): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    const payload: SurveyDraftV1 = {
      version: 1,
      updatedAt: new Date().toISOString(),
      currentStep: draft.currentStep,
      answers: draft.answers ?? {},
    };
    window.localStorage.setItem(surveyDraftStorageKey(surveyCode), JSON.stringify(payload));
  } catch {
    // private mode / quota — ignore
  }
}

export function clearSurveyDraft(surveyCode: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.removeItem(surveyDraftStorageKey(surveyCode));
  } catch {
    // ignore
  }
}

/** True when a draft has a step beyond intro or any non-empty answer value. */
export function surveyDraftHasProgress(draft: SurveyDraftV1 | null): boolean {
  if (!draft) {
    return false;
  }
  if (draft.currentStep > 1) {
    return true;
  }
  const { maxStepReached: _maxStepReached, ...answerFields } = draft.answers;
  return hasNonEmptyAnswerValue(answerFields);
}

function hasNonEmptyAnswerValue(value: unknown): boolean {
  if (value == null) {
    return false;
  }
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return value !== 0 && value !== false;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).some(hasNonEmptyAnswerValue);
  }
  return false;
}

export function setToArray(set: Set<string>): string[] {
  return Array.from(set);
}

export function arrayToSet(values: unknown): Set<string> {
  if (!Array.isArray(values)) {
    return new Set();
  }
  return new Set(values.filter((v): v is string => typeof v === 'string'));
}

export function mapToObject(map: Map<string, string>): Record<string, string> {
  return Object.fromEntries(map);
}

export function objectToMap(obj: unknown): Map<string, string> {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return new Map();
  }
  const result = new Map<string, string>();
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (typeof value === 'string') {
      result.set(key, value);
    }
  }
  return result;
}
