import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { CohortMvpDocLinkComponent } from '@app/features/dash-provider/cohorts/cohort-mvp-doc-link.component';

@Component({
  selector: 'app-cohort-participant-ui-example',
  standalone: true,
  imports: [CommonModule, RouterModule, SimpleTabsetComponent, CohortMvpDocLinkComponent],
  templateUrl: './cohort-participant-ui-example.component.html',
  styleUrl: './cohort-participant-ui-example.component.scss',
})
export class CohortParticipantUiExampleComponent {
  @Input() showBackLink = false;

  currentTabId = 'home';

  tabs: SimpleTab[] = [
    new SimpleTab('home', 'My Cohort', '', () => this.selectTab('home'), () => true),
    new SimpleTab('activities', 'Activities', '', () => this.selectTab('activities'), () => true),
    new SimpleTab('community', 'Community', '', () => this.selectTab('community'), () => true),
    new SimpleTab('progress', 'My Progress', '', () => this.selectTab('progress'), () => true),
    new SimpleTab('setup', 'Setup', '', () => this.selectTab('setup'), () => true),
    new SimpleTab('notifications', 'Notifications', '', () => this.selectTab('notifications'), () => true),
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

  mockActivities = [
    { week: 1, title: 'Watch: Day in the life of a CNA', type: 'Read / watch', status: 'Complete', due: 'Jun 5' },
    { week: 2, title: 'Attend: Nursing panel Zoom', type: 'Attend event', status: 'Upcoming', due: 'Jun 12' },
    { week: 3, title: 'Job shadow at Lawrence General', type: 'Job shadow', status: 'Not started', due: 'Jun 20' },
    { week: 4, title: 'Reflection: What surprised you?', type: 'Reflection', status: 'Locked', due: 'Jun 27' },
    { week: 5, title: 'Quiz: Healthcare basics', type: 'Quiz', status: 'Locked', due: 'Jul 4' },
  ];

  mockSessionResources = [
    { title: 'Healthcare Pathway Guide.pdf', linkedTo: 'Week 1 activity' },
    { title: 'Nursing career overview video', linkedTo: 'Week 1 activity' },
    { title: 'CNA info session @ Whittier', linkedTo: 'CLB Hub feed' },
  ];

  mockAnnouncements = [
    { title: 'Welcome to the Healthcare Careers cohort!', date: 'Jun 2', leader: true },
    { title: 'Shadow phase starts Jun 23 — prep checklist attached', date: 'Jun 18', leader: true },
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

  mockLeaderMessage = {
    from: 'Dr. Sarah Chen (Cohort Leader)',
    preview: 'Great progress on Week 1! Let me know if you need help scheduling your shadow.',
  };

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

  mockRecentNotifications = [
    { text: 'Reminder: Nursing panel Zoom tomorrow at 3 PM', type: 'reminder', when: 'Jun 11' },
    { text: 'You have not logged activity in 3 days — check in when you can', type: 'nudge', when: 'Jun 10' },
    { text: 'New announcement from cohort leader', type: 'announcement', when: 'Jun 9' },
  ];

  selectTab(tabId: string): void {
    this.currentTabId = tabId;
  }
}
