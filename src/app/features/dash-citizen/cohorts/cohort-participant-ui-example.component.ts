import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { SimpleTab, SimpleTabsetComponent } from '@app/components/_global/simple-tabset/simple-tabset.component';
import { CohortMvpDocLinkComponent } from '@app/features/dash-provider/cohorts/cohort-mvp-doc-link.component';
import { StdMarkdownDisplayComponent } from '@app/components/_global/std-markdown-display/std-markdown-display.component';
import { CohortParticipantLeaderMessageModalComponent } from './cohort-participant-leader-message-modal.component';
import {
  CohortUIConfiguration,
  COHORT_UI_CONFIGURATION_WIREFRAME,
} from '@app/features/dash-provider/cohorts/cohort-ui-configuration';
import {
  CohortParticipantPresetKey,
  getCohortParticipantPreset,
} from './cohort-participant-mock-presets';

@Component({
  selector: 'app-cohort-participant-ui-example',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SimpleTabsetComponent, CohortMvpDocLinkComponent, StdMarkdownDisplayComponent],
  templateUrl: './cohort-participant-ui-example.component.html',
  styleUrl: './cohort-participant-ui-example.component.scss',
})
export class CohortParticipantUiExampleComponent implements OnInit {
  @Input() showBackLink = false;
  @Input() presetKey: CohortParticipantPresetKey = 'healthcare';
  @Input() uiConfig: CohortUIConfiguration = COHORT_UI_CONFIGURATION_WIREFRAME;

  private modalService = inject(MdbModalService);
  private route = inject(ActivatedRoute);

  currentTabId = 'home';

  tabs: SimpleTab[] = [
    new SimpleTab('home', 'My Cohort', '', () => this.selectTab('home'), () => true),
    new SimpleTab('activities', 'Activities', '', () => this.selectTab('activities'), () => true),
    new SimpleTab('resources', 'Resources', '', () => this.selectTab('resources'), () => true),
    new SimpleTab('community', 'Community', '', () => this.selectTab('community'), () => true),
    new SimpleTab('progress', 'My Progress', '', () => this.selectTab('progress'), () => true),
    new SimpleTab('setup', 'Setup', '', () => this.selectTab('setup'), () => true),
  ];

  mockParticipant = { name: '', status: '', role: '' };
  mockCohort = {
    name: '',
    topic: '',
    leader: '',
    leaderMessageId: '',
    organization: '',
    currentPhase: '',
    startDate: '',
    endDate: '',
    completion: 0,
  };
  mockPhases: { name: string; active: boolean; complete: boolean }[] = [];
  mockUpcoming: { title: string; date: string; type: string }[] = [];
  mockWelcomeChecklist: { step: string; done: boolean }[] = [];
  mockConsentsAtSignup: { label: string; checked: boolean }[] = [];
  mockCurrentWeek = { week: 0, dateRange: '' };
  mockCurrentActivity = {
    title: '',
    type: '',
    status: '',
    due: '',
    description: '',
  };
  mockCurrentActivityLeaderNotes = { notes: '' };
  mockCurrentActivityResources: { title: string; type: string; viewed: boolean }[] = [];
  currentActivityStarted = false;
  mockCurrentActivityReflection = { prompt: '', response: '' };
  mockActivities: { week: number; title: string; type: string; status: string; due: string }[] = [];
  mockCalendarMonths: {
    month: string;
    activities: { date: string; title: string; type: string; status: string; current?: boolean }[];
  }[] = [];
  mockResourceLinks: { title: string; added: string }[] = [];
  mockResourceDocuments: { title: string; added: string }[] = [];
  mockResourceVideos: { title: string; added: string }[] = [];
  mockResourcePeople: { title: string; role: string; added: string }[] = [];
  mockThreads: { activity: string; replies: number; myReply: boolean }[] = [];
  mockReflectionWall: { author: string; takeaway: string }[] = [];
  mockSetupGoals: string[] = [];
  mockPersonalGoals: { goal: string; progress: number }[] = [];
  mockHoursLog: { type: string; hours: number }[] = [];
  mockBadges: { name: string; earned: boolean }[] = [];
  mockCheckInQuestions: string[] = [];
  mockRecentNotifications: { text: string; type: string; when: string }[] = [];

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

  ngOnInit(): void {
    const routePreset = this.route.snapshot.data['presetKey'] as CohortParticipantPresetKey | undefined;
    const routeShowBack = this.route.snapshot.data['showBackLink'] as boolean | undefined;
    if (routeShowBack !== undefined) {
      this.showBackLink = routeShowBack;
    }
    this.applyPreset(getCohortParticipantPreset(routePreset ?? this.presetKey));
  }

  private applyPreset(preset: ReturnType<typeof getCohortParticipantPreset>): void {
    this.mockParticipant = { ...preset.mockParticipant };
    this.mockCohort = { ...preset.mockCohort };
    this.mockPhases = [...preset.mockPhases];
    this.mockUpcoming = [...preset.mockUpcoming];
    this.mockWelcomeChecklist = [...preset.mockWelcomeChecklist];
    this.mockConsentsAtSignup = [...preset.mockConsentsAtSignup];
    this.mockCurrentWeek = { ...preset.mockCurrentWeek };
    this.mockCurrentActivity = { ...preset.mockCurrentActivity };
    this.mockCurrentActivityLeaderNotes = { ...preset.mockCurrentActivityLeaderNotes };
    this.mockCurrentActivityResources = preset.mockCurrentActivityResources.map((r) => ({ ...r }));
    this.mockCurrentActivityReflection = { ...preset.mockCurrentActivityReflection, response: '' };
    this.mockActivities = [...preset.mockActivities];
    this.mockCalendarMonths = preset.mockCalendarMonths.map((m) => ({
      month: m.month,
      activities: m.activities.map((a) => ({ ...a })),
    }));
    this.mockResourceLinks = [...preset.mockResourceLinks];
    this.mockResourceDocuments = [...preset.mockResourceDocuments];
    this.mockResourceVideos = [...preset.mockResourceVideos];
    this.mockResourcePeople = [...preset.mockResourcePeople];
    this.mockThreads = [...preset.mockThreads];
    this.mockReflectionWall = [...preset.mockReflectionWall];
    this.mockSetupGoals = [...preset.mockSetupGoals];
    this.mockPersonalGoals = [...preset.mockPersonalGoals];
    this.mockHoursLog = [...preset.mockHoursLog];
    this.mockBadges = [...preset.mockBadges];
    this.mockCheckInQuestions = [...preset.mockCheckInQuestions];
    this.mockRecentNotifications = [...preset.mockRecentNotifications];
    this.currentActivityStarted = false;
    this.currentTabId = 'home';
  }

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
