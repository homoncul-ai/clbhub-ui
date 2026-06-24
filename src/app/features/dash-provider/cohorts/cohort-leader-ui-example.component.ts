import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { CohortMvpDocLinkComponent } from './cohort-mvp-doc-link.component';

@Component({
  selector: 'app-cohort-leader-ui-example',
  standalone: true,
  imports: [CommonModule, RouterModule, SimpleTabsetComponent, CohortMvpDocLinkComponent],
  templateUrl: './cohort-leader-ui-example.component.html',
  styleUrl: './cohort-leader-ui-example.component.scss',
})
export class CohortLeaderUiExampleComponent {
  @Input() showBackLink = true;

  currentTabId = 'structure';

  tabs: SimpleTab[] = [
    new SimpleTab('structure', '1. Structure', '', () => this.selectTab('structure'), () => true),
    new SimpleTab('seminar', '2. Seminar', '', () => this.selectTab('seminar'), () => true),
    new SimpleTab('bookclub', '3. Book Club', '', () => this.selectTab('bookclub'), () => true),
    new SimpleTab('progress', '4. Goals & Progress', '', () => this.selectTab('progress'), () => true),
    new SimpleTab('tools', '5. Leader Tools', '', () => this.selectTab('tools'), () => true),
    new SimpleTab('consent', '6. Consent', '', () => this.selectTab('consent'), () => true),
    new SimpleTab('sponsor', '7. Sponsor', '', () => this.selectTab('sponsor'), () => true),
    new SimpleTab('notifications', '8. Notifications', '', () => this.selectTab('notifications'), () => true),
    new SimpleTab('reporting', '9. Reporting', '', () => this.selectTab('reporting'), () => true),
  ];

  mockCohort = {
    name: 'Healthcare Careers Pathway',
    topic: 'Healthcare Careers',
    type: 'Open enrollment',
    capacity: 24,
    enrolled: 18,
    startDate: 'Jun 2, 2026',
    endDate: 'Aug 15, 2026',
    durationWeeks: 11,
    phases: [
      { name: 'Explore', start: 'Jun 2', end: 'Jun 20' },
      { name: 'Shadow', start: 'Jun 23', end: 'Jul 25' },
      { name: 'Reflect', start: 'Jul 28', end: 'Aug 15' },
    ],
  };

  mockEvents = [
    { title: 'Orientation Zoom', date: 'Jun 3, 2026', type: 'Synchronous meeting' },
    { title: 'Lawrence General Hospital site visit', date: 'Jun 18, 2026', type: 'Group site visit' },
    { title: 'Community health fair volunteer day', date: 'Jul 12, 2026', type: 'Volunteer day' },
  ];

  mockCohortGoals = [
    'Complete at least one job shadow in a healthcare setting',
    'Identify two post-secondary pathways of interest',
    'Build a resume section for healthcare experience',
  ];

  mockWeeklyOpportunities = [
    { week: 1, items: ['Zoom: Healthcare overview', 'Job Search: Entry-level listings'] },
    { week: 2, items: ['Zoom: Nursing panel Q&A', 'Job Search: CNA openings'] },
    { week: 3, items: ['Zoom: Allied health careers', 'Job Search: Hospital volunteer roles'] },
  ];

  mockResources = [
    { name: 'Healthcare Pathway Guide.pdf', folder: 'Documents' },
    { name: 'Nursing career overview video', folder: 'Videos' },
    { name: 'Local employer profiles — Merrimack Valley', folder: 'Employers' },
  ];

  mockWelcomeChecklist = [
    { step: 'Review cohort schedule & phases', done: true },
    { step: 'Set 1–3 personal goals', done: true },
    { step: 'Complete consent preferences', done: false },
    { step: 'Introduce yourself in the cohort channel', done: false },
  ];

  mockRoles = [
    { role: 'Participant', count: 16 },
    { role: 'Leader / Facilitator', count: 1 },
    { role: 'Observer', count: 2 },
    { role: 'Sponsor', count: 3 },
  ];

  mockPendingRequests = [
    { name: 'Alex Rivera', email: 'alex.r@example.com', requested: 'Jun 10, 2026' },
    { name: 'Jordan Kim', email: 'j.kim@example.com', requested: 'Jun 11, 2026' },
  ];

  mockLeaderInvites = [
    { email: 'sam.p@example.com', status: 'Sent', expires: 'Jun 20, 2026' },
  ];

  mockActivities = [
    { week: 1, title: 'Watch: Day in the life of a CNA', type: 'Read / watch', status: 'Published' },
    { week: 2, title: 'Attend: Nursing panel Zoom', type: 'Attend event', status: 'Published' },
    { week: 3, title: 'Job shadow at Lawrence General', type: 'Job shadow', status: 'Scheduled' },
    { week: 4, title: 'Reflection: What surprised you?', type: 'Reflection', status: 'Draft' },
    { week: 5, title: 'Quiz: Healthcare basics', type: 'Quiz', status: 'Draft' },
    { week: 6, title: 'Conversation with a nurse practitioner', type: 'Professional chat', status: 'Draft' },
  ];

  mockLibraryItems = [
    { title: 'Article: Merrimack Valley healthcare jobs outlook', source: 'CLB Hub feed' },
    { title: 'Event: CNA info session @ Whittier', source: 'CLB Hub feed' },
    { title: 'Course: First aid certification', source: 'CLB Hub feed' },
  ];

  mockThreads = [
    { activity: 'Week 1 — Watch CNA video', replies: 8, reactions: 14 },
    { activity: 'Week 2 — Nursing panel', replies: 12, reactions: 22 },
    { activity: 'General cohort lounge', replies: 34, reactions: 67 },
  ];

  mockReflectionWall = [
    { author: 'Maria S.', takeaway: 'I did not know how many allied health roles exist beyond nursing.' },
    { author: 'Chris T.', takeaway: 'The panel made me want to explore physical therapy.' },
  ];

  mockParticipants = [
    { name: 'Maria Santos', goals: 2, completion: 78, hours: 12, status: 'On track', atRisk: false },
    { name: 'Chris Thompson', goals: 3, completion: 45, hours: 6, status: 'Behind', atRisk: true },
    { name: 'Taylor Nguyen', goals: 1, completion: 92, hours: 18, status: 'On track', atRisk: false },
    { name: 'Jamie Lee', goals: 2, completion: 60, hours: 9, status: 'Needs nudge', atRisk: true },
  ];

  mockCheckInQuestions = [
    'How are you feeling about this pathway?',
    'What is one thing you would like to explore more?',
    'Any barriers we should know about?',
  ];

  mockCheckInSummary = { responded: 14, total: 18, flagged: 2 };

  mockDashboardStats = {
    enrollment: 18,
    completionRate: 62,
    upcomingDeadlines: 3,
    atRisk: 2,
  };

  dashboardStatCards = [
    { label: 'Enrollment', valueKey: 'enrollment' as const, suffix: '', icon: 'fa-users' },
    { label: 'Completion rate', valueKey: 'completionRate' as const, suffix: '%', icon: 'fa-chart-line' },
    { label: 'Upcoming deadlines', valueKey: 'upcomingDeadlines' as const, suffix: '', icon: 'fa-clock' },
    { label: 'At-risk participants', valueKey: 'atRisk' as const, suffix: '', icon: 'fa-exclamation-triangle' },
  ];

  mockScheduledContent = [
    { item: 'Week 4 reflection prompt', publishDate: 'Jun 30, 2026' },
    { item: 'Reminder: Job shadow prep', publishDate: 'Jul 1, 2026' },
    { item: 'Mid-cohort check-in form', publishDate: 'Jul 7, 2026' },
  ];

  mockAnnouncementReceipts = { sent: 18, read: 14, unread: 4 };

  mockConsentMatrix = [
    { participant: 'Maria Santos', aggregate: true, progress: true, contact: false, outreach: false, minor: false },
    { participant: 'Chris Thompson', aggregate: true, progress: true, contact: true, outreach: false, minor: true },
    { participant: 'Taylor Nguyen', aggregate: true, progress: false, contact: false, outreach: false, minor: false },
  ];

  mockConsentAudit = [
    { when: 'Jun 5, 2026', who: 'Chris Thompson (guardian)', change: 'Contact-shareable → Progress-visible' },
    { when: 'Jun 8, 2026', who: 'Maria Santos', change: 'Progress-visible enabled' },
  ];

  mockSponsorStats = {
    completionRate: 58,
    topActivities: ['Job shadow', 'Zoom sessions', 'Reflections'],
    demographics: 'De-identified aggregate',
  };

  mockSponsorContributions = [
    { type: 'Job shadow slot', title: '2 slots — Medical assistant shadow' },
    { type: 'Info session', title: 'Allied health careers @ Whittier Hospital' },
    { type: 'Resource', title: 'Employer day-in-the-life video' },
  ];

  mockOptedInParticipants = [
    { name: 'Maria Santos', pathway: 'Nursing interest', consent: 'Contact-shareable' },
    { name: 'Chris Thompson', pathway: 'Allied health', consent: 'Open to outreach' },
  ];

  mockNotifications = {
    participantNudges: 3,
    upcomingReminders: 5,
    leaderAlerts: [
      'Chris Thompson — no login in 5 days',
      'Check-in overdue — 4 participants',
      'Milestone: Shadow phase ends in 7 days',
    ],
    digestEnabled: 11,
  };

  mockReports = [
    { name: 'Weekly Status Report', format: 'PDF', period: 'Week of Jun 9' },
    { name: 'Cohort Completion Report', format: 'CSV / PDF', period: 'End of cohort' },
    { name: 'Sponsor Outcomes (anonymized)', format: 'PDF', period: 'End of cohort' },
  ];

  mockPathwayHeatmap = [
    { pathway: 'Healthcare Careers', engagement: 92 },
    { pathway: 'Skilled Trades', engagement: 74 },
    { pathway: 'AI Education', engagement: 68 },
  ];

  selectTab(tabId: string): void {
    this.currentTabId = tabId;
  }
}
