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

/** Static catalog of product tours (extend as provider/company tours are added). */
export const TOUR_REGISTRY: TourRegistryEntry[] = [
  {
    key: 'onboard-student',
    title: 'Student Onboard Tour',
    subtitle: 'Walk through the student dashboard onboard experience.',
    route: '/student-dashboard',
    queryParams: { tour: 'onboard-student' },
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
