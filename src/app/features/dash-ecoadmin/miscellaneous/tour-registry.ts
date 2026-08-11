export interface TourRegistryEntry {
  key: string;
  title: string;
  subtitle: string;
  /** Absolute app path (no query string). */
  route: string;
  queryParams?: Record<string, string>;
  icon?: string;
}

export const ADMIN_TOUR_GUIDES_BASE = '/ecoadmin-dashboard/miscellaneous/tour-guides';
export const STUDENT_DASHBOARD_HOME = '/student-dashboard/home';
export const ONBOARD_STUDENT_TOUR_KEY = 'onboard-student';

/** Query keys used by OnboardStudentTour / welcome redirect. */
export const TOUR_QUERY = {
  tour: 'tour',
  tourReturn: 'tourReturn',
  tourSource: 'tourSource',
} as const;

/** Static catalog of product tours (extend as provider/company tours are added). */
export const TOUR_REGISTRY: TourRegistryEntry[] = [
  {
    key: ONBOARD_STUDENT_TOUR_KEY,
    title: 'Student Onboard Tour',
    subtitle: 'Walk through the student dashboard onboard experience.',
    route: STUDENT_DASHBOARD_HOME,
    queryParams: {
      [TOUR_QUERY.tour]: ONBOARD_STUDENT_TOUR_KEY,
      [TOUR_QUERY.tourReturn]: ADMIN_TOUR_GUIDES_BASE,
    },
    icon: 'fas fa-graduation-cap',
  },
];

export function getTourGuides(tours: TourRegistryEntry[] = TOUR_REGISTRY): TourRegistryEntry[] {
  return [...tours];
}

export function getTourLaunchUrl(tour: TourRegistryEntry): string {
  if (!tour.queryParams || Object.keys(tour.queryParams).length === 0) {
    return tour.route;
  }
  const params = new URLSearchParams(tour.queryParams).toString();
  return `${tour.route}?${params}`;
}

/** Student welcome tour URL after first login (`showingWelcomeMessage`). */
export function getStudentWelcomeTourUrl(): string {
  const params = new URLSearchParams({
    [TOUR_QUERY.tour]: ONBOARD_STUDENT_TOUR_KEY,
    [TOUR_QUERY.tourSource]: 'welcome',
  });
  return `${STUDENT_DASHBOARD_HOME}?${params.toString()}`;
}
