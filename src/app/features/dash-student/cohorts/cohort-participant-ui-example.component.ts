import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { CohortMvpDocLinkComponent } from '@app/features/dash-provider/cohorts/cohort-mvp-doc-link.component';
import { StdMarkdownDisplayComponent } from '@app/components/_global/std-markdown-display/std-markdown-display.component';
import { CohortParticipantLeaderMessageModalComponent } from './cohort-participant-leader-message-modal.component';
import {
  CohortUIConfiguration,
  COHORT_UI_CONFIGURATION_WIREFRAME,
} from '@app/features/dash-provider/cohorts/cohort-ui-configuration';

@Component({
  selector: 'app-cohort-participant-ui-example',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SimpleTabsetComponent, CohortMvpDocLinkComponent, StdMarkdownDisplayComponent],
  templateUrl: './cohort-participant-ui-example.component.html',
  styleUrl: './cohort-participant-ui-example.component.scss',
})
export class CohortParticipantUiExampleComponent {
  @Input() showBackLink = false;
  @Input() uiConfig: CohortUIConfiguration = COHORT_UI_CONFIGURATION_WIREFRAME;

  private modalService = inject(MdbModalService);

  currentTabId = 'home';

  tabs: SimpleTab[] = [
    new SimpleTab('home', 'My Cohort', '', () => this.selectTab('home'), () => true),
    new SimpleTab('activities', 'Activities', '', () => this.selectTab('activities'), () => true),
    new SimpleTab('resources', 'Resources', '', () => this.selectTab('resources'), () => true),
    new SimpleTab('community', 'Community', '', () => this.selectTab('community'), () => true),
    new SimpleTab('progress', 'My Progress', '', () => this.selectTab('progress'), () => true),
    new SimpleTab('setup', 'Setup', '', () => this.selectTab('setup'), () => true),
  ];

  mockParticipant = {
    name: 'Alex Rivera',
    status: 'Accepted',
    role: 'Participant',
  };

  mockCohort = {
    name: 'Healthcare Careers Pathway',
    topic: 'Healthcare Careers',
    leader: 'Dr. Sarah Chen',
    leaderMessageId: '',
    organization: 'Whittier Regional Vocational High School',
    currentPhase: 'Explore',
    startDate: 'Jun 2, 2026',
    endDate: 'Aug 15, 2026',
    completion: 45,
  };

  mockPhases = [
    { name: 'Explore', active: true, complete: false },
    { name: 'Shadow', active: false, complete: false },
    { name: 'Reflect', active: false, complete: false },
  ];

  mockUpcoming = [
    { title: 'Orientation Zoom', date: 'Jun 3, 3:00 PM', type: 'Event' },
    { title: 'Watch: Day in the life of a CNA', date: 'Due Jun 5', type: 'Activity' },
    { title: 'Week 1 check-in form', date: 'Due Jun 7', type: 'Check-in' },
  ];

  mockWelcomeChecklist = [
    { step: 'Review cohort schedule & phases', done: true },
    { step: 'Set 1–3 personal goals', done: true },
    { step: 'Complete consent preferences', done: false },
    { step: 'Introduce yourself in the cohort channel', done: false },
  ];

  mockConsentsAtSignup = [
    { label: 'Aggregate-only (default)', checked: true },
    { label: 'Progress-visible to sponsors', checked: true },
    { label: 'Contact-shareable', checked: false },
    { label: 'Open to outreach', checked: false },
  ];

  mockCurrentWeek = {
    week: 2,
    dateRange: 'Jun 9 – Jun 15, 2026',
  };

  mockCurrentActivity = {
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
  };

  mockCurrentActivityLeaderNotes = {
    notes: 'This week we connect with nursing professionals across allied health roles. Come curious, bring two questions, and listen for paths that might fit your interests. This panel is a chance for the whole cohort to explore together — there are no wrong questions.',
  };

  mockCurrentActivityResources = [
    { title: 'Nursing career overview video', type: 'video', viewed: false },
    { title: 'Panel prep questions.pdf', type: 'document', viewed: false },
    { title: 'James Chen — CNA, Lawrence General', type: 'person', viewed: false },
  ];

  currentActivityStarted = false;

  mockCurrentActivityReflection = {
    prompt: 'What is one takeaway from the nursing panel that surprised or interested you?',
    response: '',
  };

  mockActivities = [
    { week: 1, title: 'Watch: Day in the life of a CNA', type: 'Read / watch', status: 'Complete', due: 'Jun 5' },
    { week: 3, title: 'Job shadow at Lawrence General', type: 'Job shadow', status: 'Not started', due: 'Jun 20' },
    { week: 4, title: 'Reflection: What surprised you?', type: 'Reflection', status: 'Locked', due: 'Jun 27' },
    { week: 5, title: 'Quiz: Healthcare basics', type: 'Quiz', status: 'Locked', due: 'Jul 4' },
  ];

  mockCalendarMonths = [
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
  ];

  mockResourceLinks = [
    { title: 'Lawrence General Hospital careers page', added: 'Jun 10' },
    { title: 'MassHire Merrimack Valley job board', added: 'Jun 4' },
    { title: 'Nursing pathway overview — NLN', added: 'May 28' },
  ];

  mockResourceDocuments = [
    { title: 'Healthcare Pathway Guide.pdf', added: 'Jun 8' },
    { title: 'Job shadow preparation checklist.pdf', added: 'Jun 2' },
    { title: 'Cohort schedule & phases.pdf', added: 'Jun 1' },
  ];

  mockResourceVideos = [
    { title: 'Day in the life of a CNA', added: 'Jun 5' },
    { title: 'Allied health careers panel recording', added: 'Jun 12' },
    { title: 'Resume tips for healthcare students', added: 'May 30' },
  ];

  mockResourcePeople = [
    { title: 'Maria Lopez — Nurse Practitioner', role: 'Shadow mentor', added: 'Jun 3' },
    { title: 'James Chen — CNA, Lawrence General', role: 'Panel speaker', added: 'Jun 11' },
    { title: 'Dr. Sarah Chen', role: 'Cohort leader', added: 'Jun 1' },
  ];

  mockThreads = [
    { activity: 'Week 1 — Watch CNA video', replies: 8, myReply: false },
    { activity: 'General cohort lounge', replies: 34, myReply: true },
  ];

  mockReflectionWall = [
    { author: 'Maria S.', takeaway: 'I did not know how many allied health roles exist beyond nursing.' },
    { author: 'Chris T.', takeaway: 'The panel made me want to explore physical therapy.' },
  ];

  mockSetupGoals = [
    'Learn if nursing is right for me',
    'Complete one job shadow',
    '',
  ];

  mockPersonalGoals = [
    { goal: 'Learn if nursing is right for me', progress: 60 },
    { goal: 'Complete one job shadow', progress: 0 },
    { goal: 'Talk to a healthcare professional', progress: 100 },
  ];

  mockHoursLog = [
    { type: 'Zoom sessions', hours: 3 },
    { type: 'Job shadow', hours: 0 },
    { type: 'Volunteer', hours: 0 },
    { type: 'Classes', hours: 0 },
  ];

  mockBadges = [
    { name: 'Explore phase started', earned: true },
    { name: 'First activity complete', earned: true },
    { name: 'First reflection posted', earned: false },
    { name: 'Job shadow completed', earned: false },
  ];

  mockCheckInQuestions = [
    'How are you feeling about this pathway?',
    'What is one thing you would like to explore more?',
    'Any barriers we should know about?',
  ];

  mockConsentSettings = [
    { key: 'aggregate', label: 'Aggregate-only (default)', enabled: true },
    { key: 'progress', label: 'Progress-visible', enabled: true },
    { key: 'contact', label: 'Contact-shareable', enabled: false },
    { key: 'outreach', label: 'Open to outreach', enabled: false },
  ];

  mockNotificationPrefs = {
    email: true,
    sms: false,
    inApp: true,
    weeklyDigest: true,
  };

  mockSetupNotifications = [
    { key: 'leaderAnnouncement', label: 'Leader Announcement', enabled: true },
    { key: 'newResources', label: 'New Resources Available', enabled: true },
    { key: 'nudgesCheckin', label: 'Nudges to checkin', enabled: true },
    { key: 'nudgesReflect', label: 'Nudges to reflect', enabled: true },
    { key: 'upcomingEvents', label: 'Upcoming events, Events Cancelled', enabled: true },
    { key: 'newReflections', label: 'New Reflections', enabled: false },
  ];

  mockRecentNotifications = [
    { text: 'Reminder: Nursing panel Zoom tomorrow at 3 PM', type: 'reminder', when: 'Jun 11' },
    { text: 'You have not logged activity in 3 days — check in when you can', type: 'nudge', when: 'Jun 10' },
    { text: 'New resource: Lawrence General Hospital careers page', type: 'resource', when: 'Jun 9' },
  ];

  selectTab(tabId: string): void {
    this.currentTabId = tabId;
  }

  startCurrentActivity(): void {
    this.currentActivityStarted = true;
  }

  openMessageLeader(): void {
    this.modalService.open(CohortParticipantLeaderMessageModalComponent, {
      modalClass: 'modal-xl modal-dialog-scrollable',
      data: {
        leaderName: this.mockCohort.leader,
        messageId: this.mockCohort.leaderMessageId,
      },
    });
  }

  relatedResourceIcon(type: string): string {
    switch (type) {
      case 'link': return 'fa-link';
      case 'document': return 'fa-file';
      case 'video': return 'fa-video';
      case 'person': return 'fa-user';
      default: return 'fa-book';
    }
  }

  relatedResourceLabel(type: string): string {
    switch (type) {
      case 'link': return 'Link';
      case 'document': return 'Document';
      case 'video': return 'Video';
      case 'person': return 'Person';
      default: return type;
    }
  }
}
