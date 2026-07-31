import { PSurveyRefGETData } from '@app/restsvc/hccl.service';

export interface SurveyBadge {
  label: string;
  badgeClass: string;
}

export interface SurveyRegistryEntry {
  /** Internal survey key used by the admin results viewer route. */
  key: string;
  title: string;
  subtitle: string;
  liveDate: string;
  dateCreated: string;
  /** Status tags shown in survey lists (e.g. New, Open, Unavailable). */
  badges: SurveyBadge[];
  publicRoute: string;
  menuIcon: string;
  /** From PSurveyRef when merged; 1 = available, 0 = unavailable. */
  available?: number;
}

export const ADMIN_SURVEYS_BASE = '/ecoadmin-dashboard/surveys';
export const ADMIN_SURVEYS_MANAGE_BASE = `${ADMIN_SURVEYS_BASE}/manage`;

const BADGE_NEW: SurveyBadge = { label: 'New', badgeClass: 'text-bg-success' };
const BADGE_OPEN: SurveyBadge = { label: 'Open', badgeClass: 'text-bg-primary' };
export const BADGE_UNAVAILABLE: SurveyBadge = {
  label: 'Unavailable',
  badgeClass: 'text-bg-secondary',
};

export const SURVEY_REGISTRY: SurveyRegistryEntry[] = [
  {
    key: 'parent_career_support_check',
    title: 'Parent Career Support Check — Jul 03, 2026',
    subtitle: 'Families’ support for youth career exploration and planning',
    liveDate: 'Jul 03, 2026',
    dateCreated: '2026-07-03T11:25:25-04:00',
    badges: [BADGE_NEW],
    publicRoute: '/public/surveys/parent-career-support-check',
    menuIcon: 'fas fa-people-roof',
  },
  {
    key: 'youth_career_check',
    title: 'Youth Career Check — Jul 03, 2026',
    subtitle: 'Understand how young people explore careers and use AI resources',
    liveDate: 'Jul 03, 2026',
    dateCreated: '2026-07-03T11:03:52-04:00',
    badges: [BADGE_NEW],
    publicRoute: '/public/surveys/youth-career-check',
    menuIcon: 'fas fa-user-graduate',
  },
  {
    key: 'ai_workplace_skill_summary',
    title: 'AI Workplace Skill Summary — Jun 10, 2026',
    subtitle: 'Employer perspectives on AI-era graduate readiness',
    liveDate: 'Jun 10, 2026',
    dateCreated: '2026-06-12T11:04:06-04:00',
    badges: [BADGE_NEW],
    publicRoute: '/public/surveys/ai-workplace-skill-summary',
    menuIcon: 'fas fa-briefcase',
  },
  {
    key: 'ai_summit_signin',
    title: 'AI Summit Sign-in — Jun 10, 2026',
    subtitle: 'Sign in and explore AI-enabled career paths',
    liveDate: 'Jun 10, 2026',
    dateCreated: '2026-06-11T17:36:55-04:00',
    badges: [BADGE_NEW],
    publicRoute: '/public/surveys/ai-summit-signin',
    menuIcon: 'fas fa-door-open',
  },
  {
    key: 'checkin',
    title: 'Event Check-in: JM Chamber AI Class — May 31, 2026',
    subtitle: 'CLBHub sign-ups and AI course registrations',
    liveDate: 'May 31, 2026',
    dateCreated: '2026-06-01T08:04:17-04:00',
    badges: [BADGE_NEW],
    publicRoute: '/public/surveys/checkin',
    menuIcon: 'fas fa-calendar-check',
  },
  {
    key: 'register_interest',
    title: 'Register your interest in CLBHub — Apr 29, 2026',
    subtitle: 'Pre-launch interest registration and email collection',
    liveDate: 'Apr 29, 2026',
    dateCreated: '2026-04-29T09:58:54-04:00',
    badges: [BADGE_NEW],
    publicRoute: '/public/surveys/register-interest',
    menuIcon: 'fas fa-envelope',
  },
  {
    key: 'npo_job_finder',
    title: 'Non-profit job search assistance — Mar 10, 2025',
    subtitle: 'Survey: Do you have a job for me?',
    liveDate: 'Mar 10, 2025',
    dateCreated: '2026-04-13T22:28:15-04:00',
    badges: [BADGE_OPEN],
    publicRoute: '/public/surveys/npo_job_finder',
    menuIcon: 'fas fa-list-check',
  },
];

const REGISTRY_BY_KEY = new Map(SURVEY_REGISTRY.map((s) => [s.key, s]));

function getOneMonthAgoMs(): number {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 1);
  return cutoff.getTime();
}

export function getSurveysSortedByDateCreated(
  surveys: SurveyRegistryEntry[] = SURVEY_REGISTRY,
): SurveyRegistryEntry[] {
  return [...surveys].sort(
    (a, b) => Date.parse(b.dateCreated) - Date.parse(a.dateCreated),
  );
}

export function getRecentSurveys(
  surveys: SurveyRegistryEntry[] = SURVEY_REGISTRY,
): SurveyRegistryEntry[] {
  const oneMonthAgoMs = getOneMonthAgoMs();
  return getSurveysSortedByDateCreated(surveys).filter(
    (survey) => Date.parse(survey.dateCreated) >= oneMonthAgoMs,
  );
}

export function getOlderSurveys(
  surveys: SurveyRegistryEntry[] = SURVEY_REGISTRY,
): SurveyRegistryEntry[] {
  const oneMonthAgoMs = getOneMonthAgoMs();
  return getSurveysSortedByDateCreated(surveys).filter(
    (survey) => Date.parse(survey.dateCreated) < oneMonthAgoMs,
  );
}

export function getAdminSurveyRoute(survey: SurveyRegistryEntry): string {
  return `${ADMIN_SURVEYS_BASE}/${survey.key}`;
}

/** Public path for a survey_code slug (from registry when known). */
export function getPublicSurveyRoute(surveyCode: string): string {
  if (!surveyCode) {
    return '';
  }
  const fromRegistry = REGISTRY_BY_KEY.get(surveyCode)?.publicRoute;
  if (fromRegistry) {
    return fromRegistry;
  }
  return `/public/surveys/${surveyCode.replace(/_/g, '-')}`;
}

function withAvailabilityBadges(
  entry: SurveyRegistryEntry,
  available: number | undefined,
): SurveyRegistryEntry {
  const baseBadges = entry.badges.filter((b) => b.label !== BADGE_UNAVAILABLE.label);
  const isUnavailable = available !== undefined && available !== 1;
  return {
    ...entry,
    available,
    badges: isUnavailable ? [...baseBadges, BADGE_UNAVAILABLE] : baseBadges,
  };
}

/**
 * Overlay PSurveyRef DB name/description/available onto the static registry (routes/icons/live dates stay local).
 * Registry dateCreated is kept for "recent vs older" (DB row created-at is not the survey live date).
 * When availableOnly is true (public directory), only entries with a matching ref and available === 1.
 */
export function mergeSurveyRefsOntoRegistry(
  refs: PSurveyRefGETData[],
  options?: { availableOnly?: boolean },
): SurveyRegistryEntry[] {
  const availableOnly = options?.availableOnly === true;
  const byCode = new Map(
    refs.filter((r) => !!r.surveyCode).map((r) => [r.surveyCode as string, r]),
  );

  return SURVEY_REGISTRY.map((entry) => {
    const ref = byCode.get(entry.key);
    if (availableOnly && (!ref || ref.available !== 1)) {
      return null;
    }
    if (!ref) {
      return entry;
    }
    return withAvailabilityBadges(
      {
        ...entry,
        title: ref.name || entry.title,
        subtitle: ref.description || entry.subtitle,
      },
      ref.available,
    );
  }).filter((entry): entry is SurveyRegistryEntry => entry != null);
}
