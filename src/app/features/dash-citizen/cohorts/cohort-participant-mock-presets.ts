export type CohortParticipantPresetKey = 'healthcare' | 'ai-exploration';

export interface CohortParticipantMockPreset {
  key: CohortParticipantPresetKey;
  label: string;
  description: string;
  mockParticipant: { name: string; status: string; role: string };
  mockCohort: {
    name: string;
    topic: string;
    leader: string;
    leaderMessageId: string;
    organization: string;
    currentPhase: string;
    startDate: string;
    endDate: string;
    completion: number;
  };
  mockPhases: { name: string; active: boolean; complete: boolean }[];
  mockUpcoming: { title: string; date: string; type: string }[];
  mockWelcomeChecklist: { step: string; done: boolean }[];
  mockConsentsAtSignup: { label: string; checked: boolean }[];
  mockCurrentWeek: { week: number; dateRange: string };
  mockCurrentActivity: {
    title: string;
    type: string;
    status: string;
    due: string;
    description: string;
  };
  mockCurrentActivityLeaderNotes: { notes: string };
  mockCurrentActivityResources: { title: string; type: string; viewed: boolean }[];
  mockCurrentActivityReflection: { prompt: string; response: string };
  mockActivities: { week: number; title: string; type: string; status: string; due: string }[];
  mockCalendarMonths: {
    month: string;
    activities: {
      date: string;
      title: string;
      type: string;
      status: string;
      current?: boolean;
    }[];
  }[];
  mockResourceLinks: { title: string; added: string }[];
  mockResourceDocuments: { title: string; added: string }[];
  mockResourceVideos: { title: string; added: string }[];
  mockResourcePeople: { title: string; role: string; added: string }[];
  mockThreads: { activity: string; replies: number; myReply: boolean }[];
  mockReflectionWall: { author: string; takeaway: string }[];
  mockSetupGoals: string[];
  mockPersonalGoals: { goal: string; progress: number }[];
  mockHoursLog: { type: string; hours: number }[];
  mockBadges: { name: string; earned: boolean }[];
  mockCheckInQuestions: string[];
  mockRecentNotifications: { text: string; type: string; when: string }[];
}

export const HEALTHCARE_COHORT_PARTICIPANT_PRESET: CohortParticipantMockPreset = {
  key: 'healthcare',
  label: 'Healthcare Careers Pathway',
  description: 'Explore allied health and nursing careers through panels, shadows, and reflections.',
  mockParticipant: {
    name: 'Alex Rivera',
    status: 'Accepted',
    role: 'Participant',
  },
  mockCohort: {
    name: 'Healthcare Careers Pathway',
    topic: 'Healthcare Careers',
    leader: 'Dr. Sarah Chen',
    leaderMessageId: '',
    organization: 'Whittier Regional Vocational High School',
    currentPhase: 'Explore',
    startDate: 'Jun 2, 2026',
    endDate: 'Aug 15, 2026',
    completion: 45,
  },
  mockPhases: [
    { name: 'Explore', active: true, complete: false },
    { name: 'Shadow', active: false, complete: false },
    { name: 'Reflect', active: false, complete: false },
  ],
  mockUpcoming: [
    { title: 'Orientation Zoom', date: 'Jun 3, 3:00 PM', type: 'Event' },
    { title: 'Watch: Day in the life of a CNA', date: 'Due Jun 5', type: 'Activity' },
    { title: 'Week 1 check-in form', date: 'Due Jun 7', type: 'Check-in' },
  ],
  mockWelcomeChecklist: [
    { step: 'Review cohort schedule & phases', done: true },
    { step: 'Set 1–3 personal goals', done: true },
    { step: 'Complete consent preferences', done: false },
    { step: 'Introduce yourself in the cohort channel', done: false },
  ],
  mockConsentsAtSignup: [
    { label: 'Aggregate-only (default)', checked: true },
    { label: 'Progress-visible to sponsors', checked: true },
    { label: 'Contact-shareable', checked: false },
    { label: 'Open to outreach', checked: false },
  ],
  mockCurrentWeek: {
    week: 2,
    dateRange: 'Jun 9 – Jun 15, 2026',
  },
  mockCurrentActivity: {
    title: 'Attend: Nursing panel Zoom',
    type: 'Attend event',
    status: 'Upcoming',
    due: 'Jun 12',
    description: `### Before the panel

1. Review the **Nursing career overview video** in the resources below.
2. Prepare **2 questions** you would like to ask the panelists.

### During the session

- Join via Zoom at **3:00 PM on Jun 12**
- Stay for the full hour and take notes on roles that interest you

### After

Post one takeaway in the cohort channel by end of week.`,
  },
  mockCurrentActivityLeaderNotes: {
    notes: 'This week we connect with nursing professionals across allied health roles. Come curious, bring two questions, and listen for paths that might fit your interests. This panel is a chance for the whole cohort to explore together — there are no wrong questions.',
  },
  mockCurrentActivityResources: [
    { title: 'Nursing career overview video', type: 'video', viewed: false },
    { title: 'Panel prep questions.pdf', type: 'document', viewed: false },
    { title: 'James Chen — CNA, Lawrence General', type: 'person', viewed: false },
  ],
  mockCurrentActivityReflection: {
    prompt: 'What is one takeaway from the nursing panel that surprised or interested you?',
    response: '',
  },
  mockActivities: [
    { week: 1, title: 'Watch: Day in the life of a CNA', type: 'Read / watch', status: 'Complete', due: 'Jun 5' },
    { week: 3, title: 'Job shadow at Lawrence General', type: 'Job shadow', status: 'Not started', due: 'Jun 20' },
    { week: 4, title: 'Reflection: What surprised you?', type: 'Reflection', status: 'Locked', due: 'Jun 27' },
    { week: 5, title: 'Quiz: Healthcare basics', type: 'Quiz', status: 'Locked', due: 'Jul 4' },
  ],
  mockCalendarMonths: [
    {
      month: 'June 2026',
      activities: [
        { date: 'Jun 3', title: 'Orientation Zoom', type: 'Event', status: 'Complete' },
        { date: 'Jun 5', title: 'Watch: Day in the life of a CNA', type: 'Read / watch', status: 'Complete' },
        { date: 'Jun 12', title: 'Attend: Nursing panel Zoom', type: 'Attend event', status: 'Upcoming', current: true },
        { date: 'Jun 20', title: 'Job shadow at Lawrence General', type: 'Job shadow', status: 'Not started' },
        { date: 'Jun 27', title: 'Reflection: What surprised you?', type: 'Reflection', status: 'Locked' },
      ],
    },
    {
      month: 'July 2026',
      activities: [
        { date: 'Jul 4', title: 'Quiz: Healthcare basics', type: 'Quiz', status: 'Locked' },
        { date: 'Jul 11', title: 'Professional conversation check-in', type: 'Conversation', status: 'Locked' },
        { date: 'Jul 18', title: 'Volunteer shift @ Whittier clinic', type: 'Volunteer', status: 'Locked' },
        { date: 'Jul 25', title: 'Mid-cohort self-assessment', type: 'Check-in', status: 'Locked' },
      ],
    },
    {
      month: 'August 2026',
      activities: [
        { date: 'Aug 1', title: 'Shadow reflection share-out', type: 'Reflection', status: 'Locked' },
        { date: 'Aug 8', title: 'Career pathway planning session', type: 'Attend event', status: 'Locked' },
        { date: 'Aug 15', title: 'Cohort closing celebration', type: 'Event', status: 'Locked' },
      ],
    },
  ],
  mockResourceLinks: [
    { title: 'Lawrence General Hospital careers page', added: 'Jun 10' },
    { title: 'MassHire Merrimack Valley job board', added: 'Jun 4' },
    { title: 'Nursing pathway overview — NLN', added: 'May 28' },
  ],
  mockResourceDocuments: [
    { title: 'Healthcare Pathway Guide.pdf', added: 'Jun 8' },
    { title: 'Job shadow preparation checklist.pdf', added: 'Jun 2' },
    { title: 'Cohort schedule & phases.pdf', added: 'Jun 1' },
  ],
  mockResourceVideos: [
    { title: 'Day in the life of a CNA', added: 'Jun 5' },
    { title: 'Allied health careers panel recording', added: 'Jun 12' },
    { title: 'Resume tips for healthcare students', added: 'May 30' },
  ],
  mockResourcePeople: [
    { title: 'Maria Lopez — Nurse Practitioner', role: 'Shadow mentor', added: 'Jun 3' },
    { title: 'James Chen — CNA, Lawrence General', role: 'Panel speaker', added: 'Jun 11' },
    { title: 'Dr. Sarah Chen', role: 'Cohort leader', added: 'Jun 1' },
  ],
  mockThreads: [
    { activity: 'Week 1 — Watch CNA video', replies: 8, myReply: false },
    { activity: 'General cohort lounge', replies: 34, myReply: true },
  ],
  mockReflectionWall: [
    { author: 'Maria S.', takeaway: 'I did not know how many allied health roles exist beyond nursing.' },
    { author: 'Chris T.', takeaway: 'The panel made me want to explore physical therapy.' },
  ],
  mockSetupGoals: [
    'Learn if nursing is right for me',
    'Complete one job shadow',
    '',
  ],
  mockPersonalGoals: [
    { goal: 'Learn if nursing is right for me', progress: 60 },
    { goal: 'Complete one job shadow', progress: 0 },
    { goal: 'Talk to a healthcare professional', progress: 100 },
  ],
  mockHoursLog: [
    { type: 'Zoom sessions', hours: 3 },
    { type: 'Job shadow', hours: 0 },
    { type: 'Volunteer', hours: 0 },
    { type: 'Classes', hours: 0 },
  ],
  mockBadges: [
    { name: 'Explore phase started', earned: true },
    { name: 'First activity complete', earned: true },
    { name: 'First reflection posted', earned: false },
    { name: 'Job shadow completed', earned: false },
  ],
  mockCheckInQuestions: [
    'How are you feeling about this pathway?',
    'What is one thing you would like to explore more?',
    'Any barriers we should know about?',
  ],
  mockRecentNotifications: [
    { text: 'Reminder: Nursing panel Zoom tomorrow at 3 PM', type: 'reminder', when: 'Jun 11' },
    { text: 'You have not logged activity in 3 days — check in when you can', type: 'nudge', when: 'Jun 10' },
    { text: 'New resource: Lawrence General Hospital careers page', type: 'resource', when: 'Jun 9' },
  ],
};

export const AI_EXPLORATION_COHORT_PARTICIPANT_PRESET: CohortParticipantMockPreset = {
  key: 'ai-exploration',
  label: 'AI Exploration Cohort',
  description: 'Discover AI tools, ethics, and career paths through hands-on labs and practitioner conversations.',
  mockParticipant: {
    name: 'Alex Rivera',
    status: 'Accepted',
    role: 'Participant',
  },
  mockCohort: {
    name: 'AI Exploration Cohort',
    topic: 'Artificial Intelligence & Future Careers',
    leader: 'Dr. Marcus Webb',
    leaderMessageId: '',
    organization: 'CLB Hub · Merrimack Valley AI Learning Network',
    currentPhase: 'Discover',
    startDate: 'Sep 8, 2026',
    endDate: 'Nov 21, 2026',
    completion: 30,
  },
  mockPhases: [
    { name: 'Discover', active: true, complete: false },
    { name: 'Experiment', active: false, complete: false },
    { name: 'Apply', active: false, complete: false },
  ],
  mockUpcoming: [
    { title: 'Kickoff: What is generative AI?', date: 'Sep 10, 4:00 PM', type: 'Event' },
    { title: 'Watch: AI in everyday work', date: 'Due Sep 12', type: 'Activity' },
    { title: 'Week 1 reflection prompt', date: 'Due Sep 14', type: 'Check-in' },
  ],
  mockWelcomeChecklist: [
    { step: 'Review cohort schedule & AI safety guidelines', done: true },
    { step: 'Set 1–3 learning goals', done: true },
    { step: 'Complete consent preferences', done: false },
    { step: 'Introduce yourself in the cohort channel', done: false },
  ],
  mockConsentsAtSignup: [
    { label: 'Aggregate-only (default)', checked: true },
    { label: 'Progress-visible to sponsors', checked: true },
    { label: 'Contact-shareable', checked: false },
    { label: 'Open to outreach', checked: false },
  ],
  mockCurrentWeek: {
    week: 2,
    dateRange: 'Sep 15 – Sep 21, 2026',
  },
  mockCurrentActivity: {
    title: 'Attend: AI tools workshop (live lab)',
    type: 'Attend event',
    status: 'Upcoming',
    due: 'Sep 18',
    description: `### Before the workshop

1. Review the **Prompt engineering basics** guide in the resources below.
2. Bring one real task from school or work you'd like to try with AI assistance.

### During the session

- Join via Zoom at **4:00 PM on Sep 18**
- Follow along with the guided lab and note what worked (and what didn't)

### After

Share one prompt you tried and whether you'd use it again — in the cohort channel by end of week.`,
  },
  mockCurrentActivityLeaderNotes: {
    notes: 'This week we get hands-on with AI tools in a safe, structured lab. Experiment boldly, ask questions openly, and focus on learning how AI can support your goals — not replace your judgment. The whole cohort is exploring together.',
  },
  mockCurrentActivityResources: [
    { title: 'Prompt engineering basics.pdf', type: 'document', viewed: false },
    { title: 'AI tools overview video', type: 'video', viewed: false },
    { title: 'Priya Nair — ML Engineer, local startup', type: 'person', viewed: false },
  ],
  mockCurrentActivityReflection: {
    prompt: 'What is one task where AI helped you this week — and one where it fell short?',
    response: '',
  },
  mockActivities: [
    { week: 1, title: 'Watch: AI in everyday work', type: 'Read / watch', status: 'Complete', due: 'Sep 12' },
    { week: 3, title: 'Build a mini AI-assisted project', type: 'Project', status: 'Not started', due: 'Sep 26' },
    { week: 4, title: 'Reflection: Ethics & responsible use', type: 'Reflection', status: 'Locked', due: 'Oct 3' },
    { week: 5, title: 'Quiz: AI literacy fundamentals', type: 'Quiz', status: 'Locked', due: 'Oct 10' },
  ],
  mockCalendarMonths: [
    {
      month: 'September 2026',
      activities: [
        { date: 'Sep 10', title: 'Kickoff: What is generative AI?', type: 'Event', status: 'Complete' },
        { date: 'Sep 12', title: 'Watch: AI in everyday work', type: 'Read / watch', status: 'Complete' },
        { date: 'Sep 18', title: 'Attend: AI tools workshop (live lab)', type: 'Attend event', status: 'Upcoming', current: true },
        { date: 'Sep 26', title: 'Build a mini AI-assisted project', type: 'Project', status: 'Not started' },
      ],
    },
    {
      month: 'October 2026',
      activities: [
        { date: 'Oct 3', title: 'Reflection: Ethics & responsible use', type: 'Reflection', status: 'Locked' },
        { date: 'Oct 10', title: 'Quiz: AI literacy fundamentals', type: 'Quiz', status: 'Locked' },
        { date: 'Oct 17', title: 'Guest speaker: AI careers panel', type: 'Attend event', status: 'Locked' },
        { date: 'Oct 24', title: 'Peer project showcase', type: 'Event', status: 'Locked' },
      ],
    },
    {
      month: 'November 2026',
      activities: [
        { date: 'Nov 7', title: 'Professional conversation: AI in your field', type: 'Conversation', status: 'Locked' },
        { date: 'Nov 14', title: 'Capstone planning session', type: 'Attend event', status: 'Locked' },
        { date: 'Nov 21', title: 'Cohort demo day & closing', type: 'Event', status: 'Locked' },
      ],
    },
  ],
  mockResourceLinks: [
    { title: 'MIT RAISE — AI education resources', added: 'Sep 11' },
    { title: 'Common Sense AI literacy hub', added: 'Sep 9' },
    { title: 'Massachusetts AI workforce initiative', added: 'Sep 5' },
  ],
  mockResourceDocuments: [
    { title: 'AI Exploration pathway guide.pdf', added: 'Sep 8' },
    { title: 'Responsible AI use checklist.pdf', added: 'Sep 7' },
    { title: 'Cohort schedule & phases.pdf', added: 'Sep 1' },
  ],
  mockResourceVideos: [
    { title: 'AI in everyday work (15 min)', added: 'Sep 12' },
    { title: 'How ML engineers think about problems', added: 'Sep 16' },
    { title: 'Demystifying large language models', added: 'Sep 4' },
  ],
  mockResourcePeople: [
    { title: 'Priya Nair — ML Engineer', role: 'Workshop facilitator', added: 'Sep 14' },
    { title: 'Jordan Lee — Data Analyst', role: 'Careers panel', added: 'Sep 10' },
    { title: 'Dr. Marcus Webb', role: 'Cohort leader', added: 'Sep 1' },
  ],
  mockThreads: [
    { activity: 'Week 1 — AI in everyday work', replies: 12, myReply: false },
    { activity: 'General cohort lounge', replies: 28, myReply: true },
  ],
  mockReflectionWall: [
    { author: 'Sam K.', takeaway: 'I did not realize how many jobs already use AI behind the scenes.' },
    { author: 'Jordan L.', takeaway: 'The ethics discussion made me think harder about when not to use AI.' },
  ],
  mockSetupGoals: [
    'Understand how AI is used in careers I am considering',
    'Complete one hands-on AI lab project',
    '',
  ],
  mockPersonalGoals: [
    { goal: 'Understand how AI is used in careers I am considering', progress: 40 },
    { goal: 'Complete one hands-on AI lab project', progress: 0 },
    { goal: 'Talk to someone working with AI professionally', progress: 50 },
  ],
  mockHoursLog: [
    { type: 'Zoom sessions', hours: 2 },
    { type: 'Lab / project time', hours: 1 },
    { type: 'Self-study', hours: 2 },
    { type: 'Classes', hours: 0 },
  ],
  mockBadges: [
    { name: 'Discover phase started', earned: true },
    { name: 'First activity complete', earned: true },
    { name: 'First reflection posted', earned: false },
    { name: 'Mini project submitted', earned: false },
  ],
  mockCheckInQuestions: [
    'How confident do you feel using AI tools responsibly?',
    'What career or field are you most curious about applying AI to?',
    'Any concerns about AI we should discuss as a cohort?',
  ],
  mockRecentNotifications: [
    { text: 'Reminder: AI tools workshop tomorrow at 4 PM', type: 'reminder', when: 'Sep 17' },
    { text: 'Try this week\'s reflection prompt when you have a few minutes', type: 'nudge', when: 'Sep 16' },
    { text: 'New resource: Prompt engineering basics.pdf', type: 'resource', when: 'Sep 15' },
  ],
};

const PRESETS: Record<CohortParticipantPresetKey, CohortParticipantMockPreset> = {
  healthcare: HEALTHCARE_COHORT_PARTICIPANT_PRESET,
  'ai-exploration': AI_EXPLORATION_COHORT_PARTICIPANT_PRESET,
};

export function getCohortParticipantPreset(key: CohortParticipantPresetKey): CohortParticipantMockPreset {
  return PRESETS[key];
}

export const COHORT_PARTICIPANT_PRESET_LIST: CohortParticipantMockPreset[] = [
  HEALTHCARE_COHORT_PARTICIPANT_PRESET,
  AI_EXPLORATION_COHORT_PARTICIPANT_PRESET,
];
