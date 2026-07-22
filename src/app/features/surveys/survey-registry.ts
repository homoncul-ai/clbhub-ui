export interface SurveyRegistryEntry {
  /** Internal survey key used by the admin results viewer route. */
  key: string;
  title: string;
  subtitle: string;
  liveDate: string;
  dateCreated: string;
  badge: string;
  badgeClass: string;
  publicRoute: string;
  menuIcon: string;
}

export const ADMIN_SURVEYS_BASE = '/ecoadmin-dashboard/surveys';

export const SURVEY_REGISTRY: SurveyRegistryEntry[] = [
  {
    key: 'parent_career_support_check',
    title: 'Parent Career Support Check — Jul 03, 2026',
    subtitle: 'Families’ support for youth career exploration and planning',
    liveDate: 'Jul 03, 2026',
    dateCreated: '2026-07-03T11:25:25-04:00',
    badge: 'New',
    badgeClass: 'text-bg-success',
    publicRoute: '/public/surveys/parent-career-support-check',
    menuIcon: 'fas fa-people-roof',
  },
  {
    key: 'youth_career_check',
    title: 'Youth Career Check — Jul 03, 2026',
    subtitle: 'Understand how young people explore careers and use AI resources',
    liveDate: 'Jul 03, 2026',
    dateCreated: '2026-07-03T11:03:52-04:00',
    badge: 'New',
    badgeClass: 'text-bg-success',
    publicRoute: '/public/surveys/youth-career-check',
    menuIcon: 'fas fa-user-graduate',
  },
  {
    key: 'ai_workplace_skill_summary',
    title: 'AI Workplace Skill Summary — Jun 10, 2026',
    subtitle: 'Employer perspectives on AI-era graduate readiness',
    liveDate: 'Jun 10, 2026',
    dateCreated: '2026-06-12T11:04:06-04:00',
    badge: 'New',
    badgeClass: 'text-bg-success',
    publicRoute: '/public/surveys/ai-workplace-skill-summary',
    menuIcon: 'fas fa-briefcase',
  },
  {
    key: 'ai_summit_signin',
    title: 'AI Summit Sign-in — Jun 10, 2026',
    subtitle: 'Sign in and explore AI-enabled career paths',
    liveDate: 'Jun 10, 2026',
    dateCreated: '2026-06-11T17:36:55-04:00',
    badge: 'New',
    badgeClass: 'text-bg-success',
    publicRoute: '/public/surveys/ai-summit-signin',
    menuIcon: 'fas fa-door-open',
  },
  {
    key: 'checkin',
    title: 'Event Check-in: JM Chamber AI Class — May 31, 2026',
    subtitle: 'CLBHub sign-ups and AI course registrations',
    liveDate: 'May 31, 2026',
    dateCreated: '2026-06-01T08:04:17-04:00',
    badge: 'New',
    badgeClass: 'text-bg-success',
    publicRoute: '/public/surveys/checkin',
    menuIcon: 'fas fa-calendar-check',
  },
  {
    key: 'register_interest',
    title: 'Register your interest in CLBHub — Apr 29, 2026',
    subtitle: 'Pre-launch interest registration and email collection',
    liveDate: 'Apr 29, 2026',
    dateCreated: '2026-04-29T09:58:54-04:00',
    badge: 'New',
    badgeClass: 'text-bg-success',
    publicRoute: '/public/surveys/register-interest',
    menuIcon: 'fas fa-envelope',
  },
  {
    key: 'npo_job_finder',
    title: 'Non-profit job search assistance — Mar 10, 2025',
    subtitle: 'Survey: Do you have a job for me?',
    liveDate: 'Mar 10, 2025',
    dateCreated: '2026-04-13T22:28:15-04:00',
    badge: 'Open',
    badgeClass: 'text-bg-primary',
    publicRoute: '/public/surveys/npo_job_finder',
    menuIcon: 'fas fa-list-check',
  },
];

function getOneMonthAgoMs(): number {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 1);
  return cutoff.getTime();
}

export function getSurveysSortedByDateCreated(): SurveyRegistryEntry[] {
  return [...SURVEY_REGISTRY].sort(
    (a, b) => Date.parse(b.dateCreated) - Date.parse(a.dateCreated),
  );
}

export function getRecentSurveys(): SurveyRegistryEntry[] {
  const oneMonthAgoMs = getOneMonthAgoMs();
  return getSurveysSortedByDateCreated().filter(
    (survey) => Date.parse(survey.dateCreated) >= oneMonthAgoMs,
  );
}

export function getOlderSurveys(): SurveyRegistryEntry[] {
  const oneMonthAgoMs = getOneMonthAgoMs();
  return getSurveysSortedByDateCreated().filter(
    (survey) => Date.parse(survey.dateCreated) < oneMonthAgoMs,
  );
}

export function getAdminSurveyRoute(survey: SurveyRegistryEntry): string {
  return `${ADMIN_SURVEYS_BASE}/${survey.key}`;
}
