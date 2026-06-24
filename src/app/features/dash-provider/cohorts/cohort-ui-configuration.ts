export interface CohortUIMemberConfiguration {
  showingMyHours: boolean;
  showingMilestoneBadges: boolean;
  showingMilestonePhases: boolean;
  showingUpcoming: boolean;
}

export interface CohortUIConfiguration {
  member: CohortUIMemberConfiguration;
}

export function createDefaultCohortUIConfiguration(): CohortUIConfiguration {
  return {
    member: {
      showingMyHours: true,
      showingMilestoneBadges: true,
      showingMilestonePhases: true,
      showingUpcoming: true,
    },
  };
}

/** Demo/wireframe defaults — member progress sections toggled off. */
export const COHORT_UI_CONFIGURATION_WIREFRAME: CohortUIConfiguration = {
  member: {
    showingMyHours: false,
    showingMilestoneBadges: false,
    showingMilestonePhases: false,
    showingUpcoming: false,
  },
};
