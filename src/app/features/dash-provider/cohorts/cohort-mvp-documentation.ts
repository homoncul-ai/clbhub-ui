export interface CohortMvpDocSection {
  id: string;
  title: string;
  sectionNumber: number;
  /** Plain-language explanation of what this feature area is and why it matters. */
  summary: string;
  /** Optional per-UI-element explanations keyed by the doc-link `label` input. */
  contexts?: Record<string, string>;
  /** MVP spec requirements (source material). */
  markdown: string;
}

export const COHORT_MVP_DOCS: Record<string, CohortMvpDocSection> = {
  'creation-config': {
    id: 'creation-config',
    title: 'Creation & Configuration',
    sectionNumber: 1,
    summary:
      'Before a cohort runs, the leader defines its identity and shape: what pathway it covers, who can join, how long it runs, and what participants should accomplish. This is the foundation every other cohort feature builds on.',
    contexts: {
      Phases: 'Milestone phases (e.g. Explore → Shadow → Reflect) break the cohort into meaningful chapters—not just a weekly drip of content. Participants and leaders always know which chapter they are in and what kind of work is expected.',
      Events: 'Internal events are synchronous touchpoints—Zoom calls, site visits, volunteer days—that bring the cohort together in real time alongside self-paced activities.',
      Goals: 'Cohort-level goals describe what a typical participant can reasonably achieve by the end. They set expectations and help leaders, sponsors, and participants align on outcomes.',
      Resources: 'A document folder gives participants a single place to find guides, videos, and employer materials attached to the cohort—not scattered across email or external links.',
      Opportunities: 'Weekly opportunities tie live sessions and job-search activities to the calendar so each week has a clear focus (e.g. a Zoom panel plus related job listings).',
      'Sponsor activity': 'Even a newly created cohort can signal demand to sponsors—posting a pathway, capacity, and schedule helps employers know where to offer shadows, info sessions, or resources.',
      'Cohort structure': 'The cohort overview shows participants the pathway, leader, schedule, and current phase so they always understand where they are in the journey.',
    },
    markdown: `
**MVP requirements**

- Cohort name, topic/pathway (e.g., "Healthcare Careers," "Skilled Trades", "AI Education"), duration, and capacity
- **Type:** Cohort type — Open enrollment (cohort shows in Catalog)
- Start/end dates with milestone checkpoints — real phases like Explore → Shadow → Reflect, not just a drip schedule
- Add internal events to cohort — Synchronous meetings, group site visits, and community volunteer days
- Add **Goals** to the Cohort — what people can reasonably achieve during the cohort's activity
- Add **Resources** — fill out document folder
- Add **Opportunities** for each week for each cohort (Zoom Meeting, Job Search)
- Created, empty or populated cohort can be used to drive sponsor activity
`,
  },
  'enrollment-onboarding': {
    id: 'enrollment-onboarding',
    title: 'Enrollment & Onboarding',
    sectionNumber: 1,
    summary:
      'Onboarding is the participant\'s first experience in a cohort. It covers orientation steps, role assignment, and making sure everyone understands how the cohort works before activities begin.',
    contexts: {
      Checklist: 'The welcome checklist walks new participants through first-time steps—reviewing the schedule, setting goals, completing consents, and introducing themselves—so nobody starts the cohort lost or behind.',
      Roles: 'Every person in a cohort has a role: Participant (doing the work), Leader/Facilitator (running it), Observer (watching without participating), or Sponsor (contributing resources). Roles control what each person can see and do.',
      'Participant view': 'This screen shows the cohort from a participant\'s perspective—what they see after joining, their status, and the tools available to them as a member (not as a leader or sponsor).',
    },
    markdown: `
**MVP requirements**

**Onboard Dialogue**
- Welcome checklist — first-time orientation steps before the cohort begins

**Roles — Role assignment:**
- Participant
- Leader / Facilitator
- Observer
- Sponsor
`,
  },
  'onboard-leader-initiated': {
    id: 'onboard-leader-initiated',
    title: 'Onboard — Cohort Leader Initiated',
    sectionNumber: 1,
    summary:
      'When a leader already knows who should join, they invite people by email. The invitee signs up, accepts consents, and lands in the cohort as an accepted participant—no approval queue needed.',
    markdown: `
**MVP requirements**

1. Cohort Leader adds e-mail address
2. User received Email with invitation to join cohort
3. Fills out signup form, checks consents
4. Cohort Participant Added — Status **Accepted**
5. Cohort Sends "Welcome Message"
`,
  },
  'onboard-citizen-initiated': {
    id: 'onboard-citizen-initiated',
    title: 'Onboard — Citizen Initiated',
    sectionNumber: 1,
    summary:
      'Participants can also discover cohorts themselves—through search, the feed, or catalog—and request to join. They express interest, complete signup and consents, then wait for leader approval before becoming full members.',
    markdown: `
**MVP requirements**

1. Citizen finds cohort by research or feed
2. Adds to "Engagement" — by 'thumbs up'
3. "Signup" process
4. Citizen fills out onboarding form
5. Citizen checks consents
6. Citizen is added as "Cohort Participant" — Status **Pending**
7. Cohort Leader — Sees "Pending Request" — agrees — adds to cohort (Participant Status = Accepted)
8. Cohort Sends "Welcome Message"
`,
  },
  'seminar-program-builder': {
    id: 'seminar-program-builder',
    title: 'Program Builder',
    sectionNumber: 2,
    summary:
      'The Seminar layer is the structured curriculum: a sequenced set of activities (not just chat). Leaders build a week-by-week program; participants work through readings, events, shadows, reflections, and quizzes in order.',
    markdown: `
**MVP requirements**

**Program Builder**
- Session/module builder: each cohort has a sequence of structured activities (not just free-form chat)

**Activity types:**
- Read / watch something
- Attend an event
- Take a class
- Complete a job shadow
- Write a reflection
- Take a quiz
- Have a conversation with a professional
- **Clone Cohort** — somehow and customize per cohort (e.g., a standard "Healthcare Pathway" template)
`,
  },
  'seminar-resource-library': {
    id: 'seminar-resource-library',
    title: 'Resource Library',
    sectionNumber: 2,
    summary:
      'Resources are learning materials tied to cohort activities—articles, videos, employer profiles, and local opportunities. They can be attached directly to sessions or pulled from CLB Hub\'s opportunity feed.',
    markdown: `
**MVP requirements**

- Attach articles, videos, local employer profiles, and event listings directly to sessions
- Pull from clbhub's own opportunity feed — jobs, events, courses, and volunteer postings in Haverhill/Merrimack Valley — directly into cohort content
`,
  },
  'bookclub-communication': {
    id: 'bookclub-communication',
    title: 'Group Communication',
    sectionNumber: 3,
    summary:
      'The Book Club layer is peer participation: cohort-scoped discussion where participants engage with each other around activities. It complements the structured curriculum with conversation, reactions, and shared reflection.',
    contexts: {
      Channels: 'Each cohort has its own discussion space—not a global social feed—so conversation stays focused on this group and its activities.',
      Announcements: 'A leader-only announcements channel ensures important updates (schedule changes, phase transitions) are visible to everyone without getting lost in general chat.',
      Threads: 'Discussions are threaded per activity or session, so replies stay tied to the work participants are doing that week rather than one endless general chat.',
      Reactions: 'Emoji reactions let quieter participants engage without writing a full post—low friction, still visible to the group.',
      Emoji: 'Emoji reactions let quieter participants engage without writing a full post—low friction, still visible to the group.',
      'Reflection wall': 'A weekly reflection wall prompts everyone to share one takeaway—a structured, lightweight way to surface learning across the cohort.',
    },
    markdown: `
**MVP requirements**

**Group Communication**
- Cohort-scoped discussion channels — each cohort is its own space, not a global feed
- Threaded discussion per activity/session, not just a single general chat
- Reaction/emoji responses — low-friction way for quieter participants to engage
- Announcements channel controlled by leader only
- Optional: a "reflection wall" — structured weekly post where everyone shares one takeaway
`,
  },
  'leader-goals-tracking': {
    id: 'leader-goals-tracking',
    title: 'Goals & Progress Tracking',
    sectionNumber: 4,
    summary:
      'Progress tracking connects personal goals to real activity completion. Participants set intentions; leaders see who is on track, who needs a nudge, and hours that count toward grant reporting.',
    contexts: {
      'Personal goals': 'At cohort start each participant sets 1–3 personal goals (e.g. "learn if nursing is right for me"). They revisit these mid-cohort and at the end to reflect on whether the pathway fits.',
      'Hours log': 'Participants accumulate grant-reportable hours—classes, events, job shadows, volunteer time—that leaders can export for compliance and school credit verification.',
      Badges: 'Milestone badges mark real accomplishments (first shadow complete, reflection posted)—not arbitrary points. They celebrate progress tied to actual cohort activities.',
      Bottleneck: 'Leaders see who is falling behind on activities and can send a private nudge without embarrassing anyone in the group channel.',
    },
    markdown: `
**MVP requirements**

**Individual Goal Tracking**
- Each participant sets 1–3 personal goals at cohort start (e.g., "I want to learn if nursing is right for me")
- Mid-cohort and end-of-cohort self-assessment against those goals
- Leader can view and comment on individual goals privately
- Exit Interviews

**Progress & Completion Tracking**
- Per-participant activity completion status visible to leader
- Hours log: classes attended, events attended, job shadow hours, volunteer hours (grant-reportable)
- Bottleneck detection: leader can see who is falling behind and send a nudge without broadcasting it
- Milestone badges or markers — tied to real activities completed, not gamification for its own sake
`,
  },
  'leader-checkins': {
    id: 'leader-checkins',
    title: 'Check-ins & 1:1 Messaging',
    sectionNumber: 4,
    summary:
      'Check-ins are short periodic pulse surveys so leaders know how participants are feeling. Private 1:1 messaging lets a participant raise concerns without posting in the group.',
    contexts: {
      '1:1': 'Private messaging between participant and leader is separate from group channels—appropriate for scheduling help, sensitive questions, or personal follow-up.',
      '1:1 messaging': 'Private messaging between participant and leader is separate from group channels—appropriate for scheduling help, sensitive questions, or personal follow-up.',
    },
    markdown: `
**MVP requirements**

- Structured periodic check-in: a short 3–5 question form each participant fills out (e.g., "How are you feeling about this pathway? What's one thing you'd like to explore more?")
- Leader sees aggregated responses plus individual flags for anyone who needs a follow-up conversation
- 1:1 messaging between participant and leader — private, separate from group channels
`,
  },
  'facilitator-tools': {
    id: 'facilitator-tools',
    title: 'Leader & Facilitator Tools',
    sectionNumber: 5,
    summary:
      'Leader tools give facilitators an operational command center: cohort health at a glance, attendance, scheduled content, announcement tracking, and exports for grants and sponsors.',
    contexts: {
      'Leader dashboard': 'The leader dashboard surfaces enrollment, completion rates, upcoming deadlines, and at-risk participants in one view so facilitators can act before small issues become dropouts.',
      Enrollment: 'Shows how many seats are filled versus capacity—leaders know whether to recruit more participants or close enrollment.',
      'Completion rate': 'Aggregate activity completion across the cohort helps leaders see whether the group is keeping pace with the program schedule.',
      'Upcoming deadlines': 'Surfaces due dates for activities, check-ins, and phase transitions so nothing slips through the cracks.',
      'At-risk participants': 'Highlights members who are behind or disengaged so the leader can intervene early with a nudge or 1:1 conversation.',
      Attendance: 'Tracks who attended live sessions (Zoom or in-person)—important for synchronous cohort events and grant reporting.',
      Scheduling: 'Lets leaders queue activities, resources, and reminder nudges to publish on future dates instead of manual weekly posting.',
      'Read receipts': 'After broadcasting an announcement, leaders see who has read it—useful for critical updates that everyone must see.',
      Export: 'Participation reports export to PDF/CSV for grant compliance, sponsor reporting, and school credit verification.',
    },
    markdown: `
**MVP requirements**

- **Leader dashboard:** cohort health at a glance — enrollment count, activity completion rates, upcoming deadlines, at-risk participants
- **Attendance tracking** for live/synchronous sessions (Zoom or in-person)
- **Content scheduling:** queue up activities, resources, and nudges in advance
- **Announcement broadcasts** with read-receipt visibility
- **Export:** participation report for grant compliance, sponsor reporting, and school credit verification
`,
  },
  'consent-privacy': {
    id: 'consent-privacy',
    title: 'Consent & Privacy',
    sectionNumber: 6,
    summary:
      'Consent is built into enrollment—not added later. Participants choose what sponsors and observers can see, can change preferences anytime, and (for minors) require guardian involvement.',
    contexts: {
      'Minor handling': 'Participants under 18 require parental consent and optionally a guardian-linked account so adults can co-manage privacy settings and approvals.',
      'Audit log': 'Every consent change is recorded—who changed what and when—for accountability and compliance.',
    },
    markdown: `
**MVP requirements**

- Per-participant consent matrix at enrollment: what data each sponsor/observer can see

**Consent tiers:**
- Aggregate-only (default)
- Progress-visible
- Contact-shareable
- Open to outreach

- **Minor/underage handling:** parental consent form flow, guardian login linked to youth account
- Participant can update consent preferences at any time
- Audit log of consent changes
`,
  },
  'sponsor-experience': {
    id: 'sponsor-experience',
    title: 'Sponsor Experience',
    sectionNumber: 7,
    summary:
      'Sponsors (employers, community partners) get a read-only view of cohort impact plus ways to contribute job shadows, info sessions, and resources—without direct access to participant data unless consented.',
    contexts: {
      Dashboard: 'Sponsors see de-identified aggregate stats—completion rates, activity types, demographics—so they understand cohort impact without accessing individual records.',
      'Opted-in': 'Participants who consent to contact appear as limited profile cards; sponsors can request outreach through the platform (mediated—not direct email/phone).',
      Contributions: 'Sponsors can post job shadow slots, offer info sessions, or add resources to the cohort library—turning engagement into concrete opportunities for participants.',
    },
    markdown: `
**MVP requirements**

- **Sponsor dashboard:** aggregate cohort stats (completion rates, activity types, demographics — de-identified by default)
- **Opted-in participant cards:** for members who consented to contact, sponsor sees a limited profile and the ability to initiate an outreach request (mediated through the platform — not direct contact)
- **Sponsor can contribute resources:**
  - Post a job shadow slot
  - Offer an info session
  - Contribute a resource to the content library
- **Sponsorship impact report:** end-of-cohort summary suitable for employer CSR reporting
`,
  },
  'notifications-engagement': {
    id: 'notifications-engagement',
    title: 'Notifications & Engagement',
    sectionNumber: 8,
    summary:
      'Notifications keep participants on track and leaders informed. Smart nudges, activity reminders, and optional weekly digests reduce drop-off without overwhelming people with daily pings.',
    contexts: {
      Nudges: 'When a participant goes X days without logging in or completing an activity, they receive a gentle inactivity alert—before they fall too far behind.',
      Reminders: 'Upcoming activity reminders (email, SMS, or in-app) fire before due dates so participants don\'t miss Zoom sessions, shadows, or check-ins.',
      Digest: 'Participants who prefer async engagement can opt into a weekly summary email instead of daily notifications.',
      'Leader alerts': 'Leaders receive alerts when someone hasn\'t logged in, a check-in is overdue, or a cohort milestone is approaching—prompting timely follow-up.',
    },
    markdown: `
**MVP requirements**

- **Smart nudges:** inactivity alerts to participants after X days without engagement
- **Upcoming activity reminders** (email/SMS/in-app depending on preference)

**Leader alerts:**
- Participant hasn't logged in
- Check-in overdue
- Cohort milestone approaching

- **Digest option:** weekly summary email for participants who prefer async over daily pings
`,
  },
  'reporting-data': {
    id: 'reporting-data',
    title: 'Reporting & Data',
    sectionNumber: 9,
    summary:
      'Reporting turns cohort activity into accountability artifacts: weekly status for nonprofits, completion exports for grants, anonymized outcomes for sponsors, and community-wide pathway interest data.',
    contexts: {
      Heatmap: 'A pathway interest heatmap shows which careers generate the most engagement across all cohorts—useful for community planning and recruiting employers to high-demand pathways.',
    },
    markdown: `
**MVP requirements**

- Cohort Weekly Status reports for nonprofit accountability
- Cohort completion report (exportable PDF/CSV) for grant applications
- Anonymized cohort-level outcomes for sponsor reporting
- Pathway interest heatmap: across all cohorts, which careers are generating the most engagement — useful for community-level planning and employer recruitment
`,
  },
};

export function getCohortMvpDoc(docId: string): CohortMvpDocSection | undefined {
  return COHORT_MVP_DOCS[docId];
}

/** Returns the best explanation for a doc section, preferring a label-specific context when provided. */
export function getCohortMvpDocExplanation(docId: string, contextLabel?: string): string {
  const doc = COHORT_MVP_DOCS[docId];
  if (!doc) {
    return '';
  }
  if (contextLabel && doc.contexts?.[contextLabel]) {
    return doc.contexts[contextLabel];
  }
  return doc.summary;
}

/** Full markdown body for the doc modal: explanation + MVP requirements. */
export function buildCohortMvpDocModalMarkdown(docId: string, contextLabel?: string): string {
  const doc = COHORT_MVP_DOCS[docId];
  if (!doc) {
    return '';
  }

  const explanation = getCohortMvpDocExplanation(docId, contextLabel);
  const contextHeading = contextLabel && doc.contexts?.[contextLabel]
    ? `What “${contextLabel}” means`
    : 'What this feature is';

  return `
## ${contextHeading}

${explanation}

---

${doc.markdown.trim()}

---

*Source: CLB Hub cohort MVP spec · Section ${doc.sectionNumber}*
`;
}
