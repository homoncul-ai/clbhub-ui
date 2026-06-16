# Student Dashboard - Use Cases

## Overview

This document outlines all use cases for the Student Dashboard, organized in chronological order as a typical student would encounter them during their career planning journey. Assumes the student has completed onboarding and has an assigned guidance counselor.

---

## Use Case Flow Diagram

```
Login → Dashboard Home → Explore Features → Write Statement → Search Opportunities 
  → Save Interests → Request Help → Check Messages → Track Progress → Iterate
```

---

## Phase 1: Initial Discovery & Orientation

### UC-001: View Dashboard Home (First Login)

**Actor:** Student (onboarded, has guidance counselor)

**Preconditions:**
- Student has successfully logged in
- Student profile exists in system
- Student is assigned to a school
- Guidance team is configured

**Main Flow:**
1. Student navigates to `/student-dashboard/home`
2. System displays personalized greeting with student's name
3. System loads and displays:
   - Quick Actions section (3 action cards)
   - My School card (left column)
   - My Guidance Team card (left column)
   - My Statements card (right column) - may be empty
   - Saved Interests card (right column) - may be empty
4. Student sees their school name, district, and organization
5. Student sees guidance team members with names and email addresses
6. Student sees "Message" button next to each guidance team member

**Alternative Flows:**
- **A1:** If no statements exist, student sees empty state with "Write Statement" CTA
- **A2:** If no interests exist, student sees empty state with "Explore Now" CTA
- **A3:** If school data unavailable, displays "School information not available"
- **A4:** If no guidance team assigned, displays "No guidance team members assigned yet"

**Postconditions:**
- Student understands dashboard layout
- Student knows where to find key information
- Student can see quick access to main features

**Service Calls:**
- `HcclContextService.waitForReady$()` → `HcclService.resolveTicketContext(userProfileId)`
  - Returns: `HcclUserContextGETData` (includes currentUserProfile)
- `StudentContextService.loadDashboardData()`:
  - `HcclService.findCLStudents(criteria: CLStudentCriteria)`
    - Criteria: `{ userProfileId, pageNumber: 1, pageSize: 1, isPaging: true }`
    - Returns: `CLStudentGETDataSearchResults`
  - `HcclService.getCLSchoolById(schoolId: string)` (if student has schoolId)
    - Returns: `CLSchoolGETData`
  - `HcclService.findHcclTeams(criteria: HcclTeamCriteria)` (if student has schoolId)
    - Criteria: `{ teamParentId: schoolId, teamParentEntityType: 'CLSchool', pageNumber: 1, pageSize: 1, isPaging: true, optionalDataHint: 'members' }`
    - Returns: `HcclTeamGETDataSearchResults`
- `StudentContextService.getPersonalStatements()`:
  - `HcclService.findPersonalStatements(criteria: PersonalStatementCriteria)`
    - Criteria: `{ parentEntityId: currentUserProfileId, isPaging: false, maxResults: 100 }`
    - Returns: `PersonalStatementGETDataSearchResults`
- `StudentContextService.getInterests()`:
  - `HcclService.findCatalogEntryInterests(criteria: CatalogEntryInterestCriteria)`
    - Criteria: `{ userProfileId: currentUserProfileId, pageNumber: 1, pageSize: 100, isPaging: true }`
    - Returns: `CatalogEntryInterestGETDataSearchResults`

**UI Elements:**
- Welcome header with greeting and avatar
- Navigation tabs at top
- Quick action cards (Write Statement, Explore Careers, Get Help)
- Information cards (School, Guidance Team)
- Summary cards (Recent Statements, Saved Interests)

---

### UC-002: View School Information

**Actor:** Student

**Preconditions:**
- Student is on dashboard home
- School data is available

**Main Flow:**
1. Student views "My School" card on dashboard home
2. System displays:
   - School name (e.g., "Lincoln Technical High School")
   - Organization name (if available)
   - District code (if available)
3. Student can see their school affiliation at a glance

**Postconditions:**
- Student confirms they're viewing the correct school information

**Service Calls:**
- No additional service calls (data loaded in UC-001 via `StudentContextService.loadDashboardData()`)
- Data accessed from: `StudentContextService.school()` (computed signal)

---

### UC-003: View Guidance Team Information

**Actor:** Student

**Preconditions:**
- Student is on dashboard home
- Guidance team is assigned

**Main Flow:**
1. Student views "My Guidance Team" card on dashboard home
2. System displays list of guidance team members
3. For each member, student sees:
   - Avatar with initials
   - Full name
   - Email address
   - "Message" button
4. Student can click "Message" button to initiate communication (future feature)

**Postconditions:**
- Student knows who their guidance counselors are
- Student has contact information for their team

**Service Calls:**
- No additional service calls (data loaded in UC-001 via `StudentContextService.loadDashboardData()`)
- Data accessed from: `StudentContextService.guidanceTeam()` (computed signal)
- Team members data structure: `HcclTeamGETData.teamMembers[]` with `HcclTeamMemberGETData`

---

## Phase 2: Career Planning - Personal Statements

### UC-004: View Personal Statements List (Empty State)

**Actor:** Student (new user, no statements yet)

**Preconditions:**
- Student has no personal statements created
- Student navigates to `/student-dashboard/statements`

**Main Flow:**
1. Student clicks "Statements" in navigation or "Write a Statement" quick action
2. System displays empty state page
3. Student sees:
   - Large file icon
   - Title: "What are your career dreams?"
   - Description explaining purpose of statements
   - Large "Write Your First Statement" button
4. Student clicks "Write Your First Statement" button
5. System opens create statement modal (see UC-005)

**Postconditions:**
- Student understands what personal statements are for
- Student is motivated to create their first statement

**Service Calls:**
- `StudentContextService.getPersonalStatements()`:
  - `HcclContextService.waitForReady$()` → `HcclService.resolveTicketContext(userProfileId)`
  - `HcclService.findPersonalStatements(criteria: PersonalStatementCriteria)`
    - Criteria: `{ parentEntityId: currentUserProfileId, isPaging: false, maxResults: 100 }`
    - Returns: `PersonalStatementGETDataSearchResults`
    - If empty: `searchResults = []`

---

### UC-005: Create First Personal Statement

**Actor:** Student

**Preconditions:**
- Student is on statements list page
- Student clicks "New Statement" or "Write Your First Statement"

**Main Flow:**
1. System opens modal dialog with create form
2. Student sees:
   - Modal title: "Create New Statement"
   - Form field: "Statement Name" with placeholder "e.g., My Healthcare Career Goals"
   - Hint text: "💡 Name it after the career field you're exploring"
   - Form field: "Describe Your Dreams" (large textarea)
   - Placeholder text with guidance questions
   - Character counter (0/2000)
   - Cancel and "Create Statement" buttons
3. Student enters statement name: "My Electrician Career Goals"
4. Student types career description in textarea:
   - "I've always been interested in working with my hands and fixing things. I want to become a licensed electrician and eventually start my own contracting business. I'm good at problem-solving and enjoy working on technical projects."
5. Student sees character count update as they type
6. Student clicks "Create Statement" button
7. System validates:
   - Name is not empty
   - Description is not empty
8. System creates statement with status "Draft"
9. System closes modal
10. System refreshes statements list
11. Student sees their new statement card in the grid

**Alternative Flows:**
- **A1:** Student clicks Cancel - modal closes, no data saved
- **A2:** Student tries to submit with empty fields - button remains disabled
- **A3:** Network error - error message displayed, modal stays open

**Postconditions:**
- New personal statement created
- Statement appears in list with "Draft" badge
- Student can now use statement to find opportunities

**Service Calls:**
- `HcclContextService.waitForReady$()` → `HcclService.resolveTicketContext(userProfileId)`
  - Returns: `HcclUserContextGETData` (to get currentUserProfileId)
- `StudentContextService.createPersonalStatement(data)`:
  - `HcclService.createPersonalStatement(postData: PersonalStatementPOSTData)`
    - POST `/hccl/vocode/personalstatement`
    - Body: `{ name, businessCode: 'autocalc', description: '', statementTypeCode: 'student_vocation', parentEntityId, parentEntityType: 'HcclUserProfile', parentEntityName: 'Student', rawText, encodingText: '', status: 0 }`
    - Returns: `PersonalStatementGETData` (newly created statement)
- After creation, `StudentContextService.getPersonalStatements()` is called to refresh list

**UI Elements:**
- Modal backdrop
- Modal dialog with header, body, footer
- Form inputs with validation
- Character counter
- Loading state on submit button

---

### UC-006: View Personal Statement Details

**Actor:** Student

**Preconditions:**
- Student has at least one personal statement
- Student is on statements list page

**Main Flow:**
1. Student clicks on a statement card
2. System navigates to `/student-dashboard/statements/{id}`
3. System displays statement detail page:
   - Breadcrumb navigation (Statements / Statement Name)
   - Page title with statement name
   - Status badge (Draft/Active)
   - Creation date
   - Edit and Delete buttons in header
   - Statement content card showing full text
   - "Find Matching Opportunities" section with 3 action cards:
     - Find Jobs
     - Find Courses
     - Find Events
4. Student can read their full statement
5. Student can see options to find opportunities based on statement

**Postconditions:**
- Student can review their statement
- Student knows how to find opportunities from statement

**Service Calls:**
- `StudentContextService.getPersonalStatementById(id: string)`:
  - `HcclService.getPersonalStatementById(id: string)`
    - GET `/hccl/vocode/personalstatement/{id}`
    - Returns: `PersonalStatementGETData`

---

### UC-007: Edit Personal Statement

**Actor:** Student

**Preconditions:**
- Student is viewing statement detail page
- Statement exists and belongs to student

**Main Flow:**
1. Student clicks "Edit" button in header
2. System switches to edit mode:
   - Statement name becomes editable input field
   - Statement text becomes editable textarea
   - Character counter appears
   - "Save Changes" and "Cancel" buttons replace Edit/Delete
3. Student modifies statement name: "My Electrical Career Goals" → "My Skilled Trades Career Goals"
4. Student adds more text to description
5. Student clicks "Save Changes"
6. System validates changes
7. System saves updated statement
8. System switches back to view mode
9. System displays updated content

**Alternative Flows:**
- **A1:** Student clicks Cancel - changes discarded, returns to view mode
- **A2:** Student makes no changes - Save button still works but no API call needed

**Postconditions:**
- Statement is updated in database
- View mode shows latest changes

**Service Calls:**
- `StudentContextService.getPersonalStatementById(id)` (to get existing data):
  - `HcclService.getPersonalStatementById(id: string)`
    - GET `/hccl/vocode/personalstatement/{id}`
- `StudentContextService.updatePersonalStatement(id, data)`:
  - `HcclService.updatePersonalStatementById(id: string, body: PersonalStatementPUTData)`
    - PUT `/hccl/vocode/personalstatement/{id}`
    - Body: `{ name, businessCode, parentEntityId, rawText, encodingText }`
    - Returns: Updated statement data
- After update, `getPersonalStatementById(id)` is called again to refresh view

---

### UC-008: Delete Personal Statement

**Actor:** Student

**Preconditions:**
- Student is viewing statement detail page
- Statement exists

**Main Flow:**
1. Student clicks "Delete" button (trash icon) in header
2. System displays confirmation modal:
   - Title: "Delete Statement?"
   - Message: "{Statement Name} will be permanently deleted. This cannot be undone."
   - Cancel and "Delete Statement" buttons
3. Student confirms deletion
4. System deletes statement
5. System navigates back to statements list
6. Statement no longer appears in list

**Alternative Flows:**
- **A1:** Student clicks Cancel - modal closes, statement remains
- **A2:** Deletion fails - error message shown, statement remains

**Postconditions:**
- Statement is permanently deleted
- Student is returned to statements list

**Service Calls:**
- `StudentContextService.deletePersonalStatement(id: string)`:
  - `HcclService.deletePersonalStatementById(id: string)`
    - DELETE `/hccl/vocode/personalstatement/{id}`
    - Returns: Success confirmation

---

### UC-009: Find Jobs from Personal Statement

**Actor:** Student

**Preconditions:**
- Student is viewing statement detail page
- Statement exists

**Main Flow:**
1. Student clicks "Find Jobs" action card in "Find Matching Opportunities" section
2. System opens new browser tab
3. System navigates to `/student-dashboard/search?type=job&statement={statementId}`
4. System automatically:
   - Sets filter to "Jobs" type
   - Pre-fills search with statement keywords (if implemented)
   - Executes search
5. Student sees job opportunities matching their statement
6. Student can browse and save jobs (see UC-014)

**Postconditions:**
- Student sees relevant job opportunities
- Search is filtered to jobs only

**Service Calls:**
- `StudentContextService.searchCatalog(params)`:
  - `HcclService.findCatalogEntrys(criteria: CatalogEntryCriteria)`
    - POST `/hccl/catalog/catalogentry/query`
    - Criteria: `{ searchByText: keyword, catalogTypeCode: 'job', available: 1 (if availableOnly), pageNumber: 1, pageSize: 50, isPaging: true }`
    - Returns: `CatalogEntryGETDataSearchResults`

---

### UC-010: Find Courses from Personal Statement

**Actor:** Student

**Preconditions:**
- Student is viewing statement detail page

**Main Flow:**
1. Student clicks "Find Courses" action card
2. System opens new tab to search page with course filter
3. System displays course opportunities
4. Student can browse and save courses

**Postconditions:**
- Student sees relevant course opportunities

**Service Calls:**
- `StudentContextService.searchCatalog(params)`:
  - `HcclService.findCatalogEntrys(criteria: CatalogEntryCriteria)`
    - POST `/hccl/catalog/catalogentry/query`
    - Criteria: `{ searchByText: keyword, catalogTypeCode: 'course', available: 1 (if availableOnly), pageNumber: 1, pageSize: 50, isPaging: true }`
    - Returns: `CatalogEntryGETDataSearchResults`

---

### UC-011: Find Events from Personal Statement

**Actor:** Student

**Preconditions:**
- Student is viewing statement detail page

**Main Flow:**
1. Student clicks "Find Events" action card
2. System opens new tab to search page with event filter
3. System displays event opportunities
4. Student can browse and save events

**Postconditions:**
- Student sees relevant event opportunities

**Service Calls:**
- `StudentContextService.searchCatalog(params)`:
  - `HcclService.findCatalogEntrys(criteria: CatalogEntryCriteria)`
    - POST `/hccl/catalog/catalogentry/query`
    - Criteria: `{ searchByText: keyword, catalogTypeCode: 'event', available: 1 (if availableOnly), pageNumber: 1, pageSize: 50, isPaging: true }`
    - Returns: `CatalogEntryGETDataSearchResults`

---

## Phase 3: Opportunity Discovery

### UC-012: Explore Opportunities (Initial Search)

**Actor:** Student

**Preconditions:**
- Student navigates to `/student-dashboard/search`
- Or clicks "Explore Careers" quick action

**Main Flow:**
1. System displays search page with:
   - Page title: "Explore Opportunities"
   - Large search box with placeholder "Search for jobs, courses, events..."
   - Filter chips: All, Jobs, Courses, Events
   - "Show available only" checkbox
   - Empty state message (if no search yet)
2. Student types keyword: "electrician"
3. Student clicks "Search" button or presses Enter
4. System displays loading spinner
5. System searches catalog for matching entries
6. System displays results grid:
   - Result count header
   - Cards for each opportunity showing:
     - Type badge (Job/Course/Event)
     - Availability badge
     - Title
     - Short description
     - Posted date
     - Price (if applicable)
     - "View Source" link
     - "Save" button
7. Student can scroll through results

**Alternative Flows:**
- **A1:** No results found - empty state with "Try different keywords" message
- **A2:** Student clicks filter chip before searching - filter is set, search executes when keyword entered

**Postconditions:**
- Student sees search results
- Student can filter and refine search

**Service Calls:**
- `StudentContextService.searchCatalog(params)`:
  - `HcclService.findCatalogEntrys(criteria: CatalogEntryCriteria)`
    - POST `/hccl/catalog/catalogentry/query`
    - Criteria: `{ searchByText: keyword, catalogTypeCode: selectedType (optional), available: 1 (if availableOnly), pageNumber: 1, pageSize: 50, isPaging: true }`
    - Returns: `CatalogEntryGETDataSearchResults`
    - Results accessed via: `searchResults[]` array of `CatalogEntryGETData`

---

### UC-013: Filter Search Results by Type

**Actor:** Student

**Preconditions:**
- Student is on search page
- Search has been executed (or student wants to filter before searching)

**Main Flow:**
1. Student clicks "Jobs" filter chip
2. System highlights "Jobs" chip as active
3. If search was already executed, system re-executes search with job filter
4. Results update to show only job opportunities
5. Student clicks "Courses" filter chip
6. System switches active filter to "Courses"
7. Results update to show only course opportunities
8. Student clicks "All" to remove filter
9. Results show all types again

**Postconditions:**
- Search results are filtered by selected type
- Active filter is visually indicated

**Service Calls:**
- `StudentContextService.searchCatalog(params)` (re-executed with new filter):
  - `HcclService.findCatalogEntrys(criteria: CatalogEntryCriteria)`
    - POST `/hccl/catalog/catalogentry/query`
    - Criteria: `{ searchByText: keyword, catalogTypeCode: newFilterType, available: 1 (if availableOnly), pageNumber: 1, pageSize: 50, isPaging: true }`
    - Returns: `CatalogEntryGETDataSearchResults` (filtered results)

---

### UC-014: Save Opportunity to Interests

**Actor:** Student

**Preconditions:**
- Student is viewing search results
- Student found an opportunity they want to save

**Main Flow:**
1. Student clicks "Save" button on an opportunity card
2. System displays confirmation: "Saved '{Title}' to your interests!"
3. System adds opportunity to student's interests list
4. Save button may change to "Saved" state (if implemented)
5. Student can navigate to Interests page to see saved item

**Alternative Flows:**
- **A1:** Save fails - error message shown, opportunity not saved
- **A2:** Opportunity already saved - message indicates it's already in interests

**Postconditions:**
- Opportunity is saved to student's interests
- Student can find it later in their interests list

**Service Calls:**
- **Note:** Save interest functionality is currently a placeholder (shows alert)
- **Future implementation:**
  - `HcclContextService.waitForReady$()` → `HcclService.resolveTicketContext(userProfileId)`
  - `HcclService.createCatalogEntryInterest(body: CatalogEntryInterestPOSTData)`
    - POST `/hccl/catalog/catalogentryinterest`
    - Body: `{ catalogId, catalogEntryId: entry.id, userProfileId: currentUserProfileId, interest: 1, notes: '' }`
    - Returns: `CatalogEntryInterestGETData`

---

### UC-015: View Saved Interests List

**Actor:** Student

**Preconditions:**
- Student has saved at least one interest
- Student navigates to `/student-dashboard/interests`

**Main Flow:**
1. System displays interests list page:
   - Page title: "My Saved Interests"
   - "Explore More" button in header
   - Grid of interest cards
2. For each saved interest, student sees:
   - Card with colored accent border (job=orange, course=cyan, event=purple)
   - Type icon in colored circle
   - Type badge
   - Opportunity title
   - Short description (truncated)
   - Date saved
   - Trash icon button to remove
3. Student can click on any card to view details (see UC-016)
4. Student can click "Explore More" to return to search

**Alternative Flows:**
- **A1:** No interests saved - empty state with "Start Exploring" CTA

**Postconditions:**
- Student can see all their saved opportunities
- Student can manage their interests

**Service Calls:**
- `StudentContextService.getInterests()`:
  - `HcclContextService.waitForReady$()` → `HcclService.resolveTicketContext(userProfileId)`
  - `HcclService.findCatalogEntryInterests(criteria: CatalogEntryInterestCriteria)`
    - POST `/hccl/catalog/catalogentryinterest/query`
    - Criteria: `{ userProfileId: currentUserProfileId, pageNumber: 1, pageSize: 100, isPaging: true }`
    - Returns: `CatalogEntryInterestGETDataSearchResults`
    - Each result includes: `CatalogEntryInterestGETData` with nested `catalogEntry: CatalogEntryGETData`

---

### UC-016: View Interest Details

**Actor:** Student

**Preconditions:**
- Student is on interests list page
- Student clicks on an interest card

**Main Flow:**
1. System navigates to `/student-dashboard/interests/{id}`
2. System displays interest detail page:
   - Breadcrumb: My Interests / Opportunity Title
   - Type badge and availability badge
   - Page title with opportunity name
   - Action buttons: "Apply Now" (if job) or "Sign Up" (if course/event)
   - Main card with:
     - Description section (full text)
     - Details grid:
       - Reference Code
       - Posted date
       - Last Updated date
       - Price (if applicable)
     - "View Original Posting" link (if URL available)
   - Notes section (currently empty, future feature)
3. Student can read full opportunity details
4. Student can click "View Original Posting" to see source website

**Postconditions:**
- Student has full information about the opportunity
- Student can take action (apply/sign up) if buttons are functional

**Service Calls:**
- `StudentContextService.getInterestById(id: string)`:
  - `HcclService.getCatalogEntryInterestById(id: string)`
    - GET `/hccl/catalog/catalogentryinterest/{id}`
    - Returns: `CatalogEntryInterestGETData`
    - Includes nested: `catalogEntry: CatalogEntryGETData` with full details

---

### UC-017: Remove Interest from Saved List

**Actor:** Student

**Preconditions:**
- Student is viewing interests list
- Student wants to remove a saved interest

**Main Flow:**
1. Student clicks trash icon button on an interest card
2. System displays browser confirmation: "Remove this from your saved interests?"
3. Student confirms
4. System removes interest from saved list
5. Interest card disappears from grid
6. List refreshes

**Alternative Flows:**
- **A1:** Student cancels confirmation - interest remains saved
- **A2:** Removal fails - error message shown, interest remains

**Postconditions:**
- Interest is removed from saved list
- Student's interests list is updated

**Service Calls:**
- `StudentContextService.removeInterest(id: string)`:
  - `HcclService.deleteCatalogEntryInterestById(id: string)`
    - DELETE `/hccl/catalog/catalogentryinterest/{id}`
    - Returns: Success confirmation
- After deletion, `StudentContextService.getInterests()` is called to refresh list

---

## Phase 4: Getting Help & Support

### UC-018: View Guidance & Support Dashboard

**Actor:** Student

**Preconditions:**
- Student navigates to `/student-dashboard/guidance`
- Or clicks "Get Help" quick action

**Main Flow:**
1. System displays guidance page:
   - Page title: "Guidance & Support"
   - "Request Help" button in header
   - Statistics cards (4 cards):
     - Open Requests (count)
     - In Progress (count)
     - Completed (count)
     - Cancelled (count)
   - Two-column layout:
     - Left: Recent Requests list
     - Right: Quick Actions ("How Can We Help?")
2. Student sees their support request statistics
3. Student sees recent tickets with:
   - Ticket code
   - Status badge
   - Description preview
   - Creation date
4. Student sees quick action options:
   - Career Advice
   - Resume Review
   - General Question

**Postconditions:**
- Student understands their support request status
- Student knows how to request help

**Service Calls:**
- `StudentContextService.getGuidanceData()`:
  - `HcclService.resolveGuidanceUIData()`
    - GET `/hccl/students/dash-ui/resolve-guidance-data`
    - Returns: `WorkRequestDashboardUIGETData`
    - Includes:
      - `recentWorkRequests: WorkRequestGETDataSearchResults`
      - `mapStats: { [stateCode: string]: EntityStateStatGETData }`
      - Stats contain: `{ itemCount, stateCode, stateLabel }` for each state

---

### UC-019: Request Career Advice

**Actor:** Student

**Preconditions:**
- Student is on guidance page
- Student needs career guidance

**Main Flow:**
1. Student clicks "Career Advice" quick action card
2. System opens "Request Help" modal with pre-filled title: "Career Advice Request"
3. Student sees form:
   - Title field (pre-filled): "Career Advice Request"
   - Description textarea (empty)
   - Character counter
   - Cancel and "Send Request" buttons
4. Student types description:
   - "I'm trying to decide between becoming an electrician or an HVAC technician. Can we talk about the differences, job outlook, and which might be a better fit for me?"
5. Student clicks "Send Request"
6. System validates form
7. System creates support ticket
8. System closes modal
9. System refreshes guidance dashboard
10. New ticket appears in "Recent Requests" list with "Open" status
11. Statistics update (Open Requests count increases)

**Alternative Flows:**
- **A1:** Student clicks Cancel - modal closes, no ticket created
- **A2:** Student submits with empty description - button disabled, validation prevents submission

**Postconditions:**
- Support ticket created
- Ticket visible in recent requests
- Guidance counselor receives notification (backend)

**Service Calls:**
- `HcclContextService.waitForReady$()` → `HcclService.resolveTicketContext(userProfileId)`
  - Returns: `HcclUserContextGETData` (to get currentUserProfileId)
- `StudentContextService.createGuidanceTicket(data)`:
  - `HcclService.callCreateTicket(body: CreateTicketPOSTData)`
    - POST `/hccl/tixui/create-ticket`
    - Body: `{ studentUserProfileId: currentUserProfileId, title: data.title, rawText: data.description }`
    - Returns: `WorkRequestGETData` (newly created ticket)
- After creation, `StudentContextService.getGuidanceData()` is called to refresh dashboard

---

### UC-020: Request Resume Review

**Actor:** Student

**Preconditions:**
- Student is on guidance page
- Student wants resume feedback

**Main Flow:**
1. Student clicks "Resume Review" quick action
2. System opens modal with pre-filled title: "Resume Review Request"
3. Student fills description: "I've created my first resume and would like feedback before applying to jobs. Can someone review it?"
4. Student submits request
5. System creates ticket
6. Ticket appears in recent requests

**Postconditions:**
- Resume review ticket created
- Guidance team can assist with resume

**Service Calls:**
- Same as UC-019:
  - `HcclContextService.waitForReady$()` → `HcclService.resolveTicketContext(userProfileId)`
  - `HcclService.callCreateTicket(body: CreateTicketPOSTData)`
    - POST `/hccl/tixui/create-ticket`
    - Body: `{ studentUserProfileId, title: 'Resume Review Request', rawText: description }`
    - Returns: `WorkRequestGETData`

---

### UC-021: Request General Help

**Actor:** Student

**Preconditions:**
- Student is on guidance page
- Student has a general question

**Main Flow:**
1. Student clicks "General Question" quick action
2. System opens modal with empty form
3. Student enters custom title and description
4. Student submits
5. System creates general support ticket

**Postconditions:**
- General support ticket created

**Service Calls:**
- Same as UC-019:
  - `HcclContextService.waitForReady$()` → `HcclService.resolveTicketContext(userProfileId)`
  - `HcclService.callCreateTicket(body: CreateTicketPOSTData)`
    - POST `/hccl/tixui/create-ticket`
    - Body: `{ studentUserProfileId, title: customTitle, rawText: description }`
    - Returns: `WorkRequestGETData`

---

### UC-022: View Support Ticket Details

**Actor:** Student

**Preconditions:**
- Student has at least one support ticket
- Student is on guidance page

**Main Flow:**
1. Student clicks on a ticket in "Recent Requests" list
2. System navigates to `/student-dashboard/guidance/tickets/{id}`
3. System displays ticket detail page:
   - Breadcrumb: Guidance / Ticket Code
   - Status badge
   - Ticket code as page title
   - Creation date
   - Request Details card:
     - Title
     - Full description
     - Related entity (if applicable)
   - Activity section (placeholder for future timeline)
4. Student can see full ticket information
5. Student can see current status

**Postconditions:**
- Student has full context of their support request
- Student knows ticket status

**Service Calls:**
- `StudentContextService.getWorkRequestById(id: string)`:
  - `HcclService.getWorkRequestById(id: string)`
    - GET `/hccl/tix/workrequest/{id}`
    - Returns: `WorkRequestGETData`
    - Includes: `id, businessCode, name, description, currentStateCode, dateCreated, subjectEntityId, subjectEntityName, etc.`

---

## Phase 5: Communication

### UC-023: View Messages List

**Actor:** Student

**Preconditions:**
- Student navigates to `/student-dashboard/messages`
- Or clicks "Messages" in navigation

**Main Flow:**
1. System displays messages list page:
   - Page title: "My Messages"
   - Subtitle: "Conversations with your guidance team"
2. If messages exist:
   - System displays list of message cards
   - Each message shows:
     - Avatar icon
     - Message title
     - Description preview (truncated)
     - Creation date
     - Unread badge (if unread messages)
3. Student can click on any message to view details (see UC-024)

**Alternative Flows:**
- **A1:** No messages - empty state with "Get Help" CTA linking to guidance page

**Postconditions:**
- Student can see all their messages
- Student knows which messages are unread

**Service Calls:**
- `StudentContextService.getMessages()`:
  - `HcclContextService.waitForReady$()` → `HcclService.resolveTicketContext(userProfileId)`
  - `HcclService.findPMessages(criteria: PMessageCriteria)`
    - POST `/hccl/pattern/pmessage/query`
    - Criteria: `{ pageNumber: 1, pageSize: 100, isPaging: true }`
    - Returns: `PMessageGETDataSearchResults`
    - Each message includes: `id, title, description, dateCreated, unreadMessageCount, participants[]`

---

### UC-024: View Message Details

**Actor:** Student

**Preconditions:**
- Student is on messages list
- Student clicks on a message

**Main Flow:**
1. System navigates to `/student-dashboard/messages/{id}`
2. System displays message detail page:
   - Breadcrumb: Messages / Message Title
   - Message header with title and date
   - Participants list (if available)
   - Full message content
   - Placeholder note: "Full message thread and reply functionality coming soon"
3. Student can read full message
4. Student understands this is a one-way view currently

**Postconditions:**
- Student has read the message
- Student knows reply functionality is coming

**Service Calls:**
- `StudentContextService.getMessageById(id: string)`:
  - `HcclService.getPMessageById(id: string)`
    - GET `/hccl/pattern/pmessage/{id}`
    - Returns: `PMessageGETData`
    - Includes: `id, title, description, dateCreated, authorUserProfileId, participants: PMessageParticipantGETData[], unreadMessageCount`

---

## Phase 6: Progress Tracking

### UC-025: View Progress Dashboard

**Actor:** Student

**Preconditions:**
- Student navigates to `/student-dashboard/progress`
- Or clicks "Progress" in navigation

**Main Flow:**
1. System displays progress page:
   - Page title: "My Progress"
   - Large progress ring showing "Career Readiness Score" (0-100%)
   - Encouragement message based on score
   - Two-column layout:
     - Left: "Your Journey" checklist
     - Right: Stats summary and encouragement card
2. Student sees progress ring with percentage
3. Student sees checklist items:
   - ✓ Complete Your Profile (if done)
   - ✓ Write a Career Statement (if done)
   - ✓ Explore Opportunities (if 3+ interests saved)
   - ○ Build Your Resume (coming soon)
   - ○ Apply to Opportunities (coming soon)
4. Student sees stats:
   - Career Statements count
   - Saved Interests count
   - Support Requests count
   - Applications count
5. Student sees encouragement card with emoji and message

**Postconditions:**
- Student understands their progress
- Student knows what to do next

**Service Calls:**
- `StudentContextService.getPersonalStatements()`:
  - `HcclService.findPersonalStatements(criteria)` (to count statements)
- `StudentContextService.getInterests()`:
  - `HcclService.findCatalogEntryInterests(criteria)` (to count interests)
- `StudentContextService.getGuidanceData()`:
  - `HcclService.resolveGuidanceUIData()` (to get support request stats)
- Progress score calculated client-side based on:
  - Profile complete: `StudentContextService.userProfile()` (from context)
  - Statements count: from `getPersonalStatements()` result length
  - Interests count: from `getInterests()` result length (≥3 = complete)

---

### UC-026: Track Progress Over Time

**Actor:** Student (returning user)

**Preconditions:**
- Student has used dashboard multiple times
- Student has created statements and saved interests

**Main Flow:**
1. Student visits progress page
2. System calculates readiness score:
   - Profile complete: +25%
   - Statement created: +25%
   - 3+ interests saved: +25%
   - (Future: Resume +15%, Applications +10%)
3. System displays updated score in progress ring
4. System updates checklist checkmarks
5. System updates stats numbers
6. System shows appropriate encouragement message
7. Student sees improvement from previous visits

**Postconditions:**
- Student sees their growth
- Student is motivated to complete more steps

**Service Calls:**
- Same as UC-025:
  - `StudentContextService.getPersonalStatements()` → `HcclService.findPersonalStatements()`
  - `StudentContextService.getInterests()` → `HcclService.findCatalogEntryInterests()`
  - `StudentContextService.getGuidanceData()` → `HcclService.resolveGuidanceUIData()`
- Progress calculation happens client-side by comparing current counts to previous state

---

## Phase 7: Iterative Use & Maintenance

### UC-027: Return to Dashboard After Time Away

**Actor:** Student (returning user)

**Preconditions:**
- Student has been away from dashboard for days/weeks
- Student has existing statements and interests

**Main Flow:**
1. Student logs in and navigates to dashboard home
2. System displays:
   - Updated greeting
   - Recent statements (up to 3)
   - Recent interests (up to 3)
   - Any new messages (if implemented)
3. Student sees what's new since last visit
4. Student can quickly access their work

**Postconditions:**
- Student can resume where they left off
- Student sees their progress

**Service Calls:**
- Same as UC-001 (Dashboard Home):
  - `StudentContextService.loadDashboardData()` → Multiple service calls
  - `StudentContextService.getPersonalStatements()` → `HcclService.findPersonalStatements()`
  - `StudentContextService.getInterests()` → `HcclService.findCatalogEntryInterests()`
- All data refreshed on page load

---

### UC-028: Create Multiple Personal Statements

**Actor:** Student (experienced user)

**Preconditions:**
- Student already has one statement
- Student wants to explore different career paths

**Main Flow:**
1. Student navigates to statements list
2. Student sees existing statement(s) in grid
3. Student clicks "New Statement" button
4. Student creates second statement: "My Healthcare Career Goals"
5. System adds new statement to grid
6. Student now has multiple statements
7. Student can use different statements to find different opportunities

**Postconditions:**
- Student has multiple career exploration paths
- Each statement can generate different opportunity matches

**Service Calls:**
- Same as UC-005 (Create Statement):
  - `HcclContextService.waitForReady$()` → `HcclService.resolveTicketContext(userProfileId)`
  - `HcclService.createPersonalStatement(postData: PersonalStatementPOSTData)`
    - POST `/hccl/vocode/personalstatement`
- After creation, list refreshes via `StudentContextService.getPersonalStatements()`

---

### UC-029: Search from Statement Card (Quick Action)

**Actor:** Student

**Preconditions:**
- Student is on statements list page
- Student has statements with action buttons

**Main Flow:**
1. Student views statement card in grid
2. Student sees three action buttons in card footer:
   - Jobs (briefcase icon)
   - Courses (graduation cap icon)
   - Events (calendar icon)
3. Student clicks "Jobs" button
4. System opens new tab with search filtered to jobs
5. Search is pre-configured with statement context (if implemented)
6. Student can browse and save jobs

**Postconditions:**
- Student quickly finds opportunities from statement
- Search is contextually relevant

**Service Calls:**
- Same as UC-012 (Explore Opportunities):
  - `StudentContextService.searchCatalog(params)`
    - `HcclService.findCatalogEntrys(criteria: CatalogEntryCriteria)`
    - POST `/hccl/catalog/catalogentry/query`
    - Criteria includes: `catalogTypeCode: 'job'` (or 'course'/'event' based on button clicked)
    - Future: May include `vocationEncodingId` from statement for better matching

---

### UC-030: Browse Saved Interests Periodically

**Actor:** Student

**Preconditions:**
- Student has multiple saved interests
- Student wants to review what they've saved

**Main Flow:**
1. Student navigates to interests list
2. Student sees grid of all saved opportunities
3. Student can:
   - Click any card to view full details
   - Remove interests they're no longer interested in
   - See when each was saved
4. Student reviews their collection
5. Student decides which to pursue further

**Postconditions:**
- Student maintains their interest list
- Student focuses on most relevant opportunities

**Service Calls:**
- Same as UC-015 (View Interests List):
  - `StudentContextService.getInterests()`
    - `HcclService.findCatalogEntryInterests(criteria: CatalogEntryInterestCriteria)`
    - POST `/hccl/catalog/catalogentryinterest/query`
- No additional calls needed for browsing (data already loaded)

---

## Phase 8: Advanced Features (Future)

### UC-031: Apply to Job Opportunity (Future)

**Actor:** Student

**Preconditions:**
- Student is viewing interest detail for a job
- "Apply Now" button is functional

**Main Flow:**
1. Student clicks "Apply Now" button
2. System opens application modal/form
3. Student selects personal statement to use
4. Student attaches resume (if built)
5. Student submits application
6. System creates application record
7. Application appears in progress tracking

**Postconditions:**
- Application submitted
- Student can track application status

**Service Calls:**
- **Future Implementation:**
  - `HcclService.createApplication(body: ApplicationPOSTData)` (TBD)
    - POST `/hccl/applications` (endpoint TBD)
    - Body: `{ catalogEntryId, personalStatementId, resumeId, studentUserProfileId }`
    - Returns: `ApplicationGETData`

---

### UC-032: Sign Up for Course/Event (Future)

**Actor:** Student

**Preconditions:**
- Student is viewing interest detail for course/event
- "Sign Up" button is functional

**Main Flow:**
1. Student clicks "Sign Up" button
2. System opens registration form
3. Student completes registration
4. System confirms registration
5. Registration appears in student's schedule/activities

**Postconditions:**
- Student is registered for course/event
- Student receives confirmation

**Service Calls:**
- **Future Implementation:**
  - `HcclService.createRegistration(body: RegistrationPOSTData)` (TBD)
    - POST `/hccl/registrations` (endpoint TBD)
    - Body: `{ catalogEntryId, studentUserProfileId, registrationDate }`
    - Returns: `RegistrationGETData`

---

## Use Case Summary Table

| UC ID | Use Case Name | Frequency | Priority | Status |
|-------|--------------|-----------|----------|--------|
| UC-001 | View Dashboard Home | Every session | High | ✅ Implemented |
| UC-002 | View School Information | Once per session | Medium | ✅ Implemented |
| UC-003 | View Guidance Team | Once per session | Medium | ✅ Implemented |
| UC-004 | View Statements List (Empty) | First time only | High | ✅ Implemented |
| UC-005 | Create First Statement | Once (then occasional) | High | ✅ Implemented |
| UC-006 | View Statement Details | Frequent | High | ✅ Implemented |
| UC-007 | Edit Statement | Occasional | Medium | ✅ Implemented |
| UC-008 | Delete Statement | Rare | Low | ✅ Implemented |
| UC-009 | Find Jobs from Statement | Frequent | High | ✅ Implemented |
| UC-010 | Find Courses from Statement | Frequent | High | ✅ Implemented |
| UC-011 | Find Events from Statement | Frequent | High | ✅ Implemented |
| UC-012 | Explore Opportunities | Very Frequent | High | ✅ Implemented |
| UC-013 | Filter Search Results | Very Frequent | High | ✅ Implemented |
| UC-014 | Save Opportunity | Very Frequent | High | ✅ Implemented |
| UC-015 | View Interests List | Frequent | High | ✅ Implemented |
| UC-016 | View Interest Details | Frequent | High | ✅ Implemented |
| UC-017 | Remove Interest | Occasional | Medium | ✅ Implemented |
| UC-018 | View Guidance Dashboard | Frequent | High | ✅ Implemented |
| UC-019 | Request Career Advice | Occasional | High | ✅ Implemented |
| UC-020 | Request Resume Review | Occasional | Medium | ✅ Implemented |
| UC-021 | Request General Help | Occasional | Medium | ✅ Implemented |
| UC-022 | View Ticket Details | Occasional | Medium | ✅ Implemented |
| UC-023 | View Messages List | Frequent | Medium | ✅ Implemented |
| UC-024 | View Message Details | Frequent | Medium | ✅ Implemented |
| UC-025 | View Progress Dashboard | Occasional | Medium | ✅ Implemented |
| UC-026 | Track Progress Over Time | Occasional | Medium | ✅ Implemented |
| UC-027 | Return to Dashboard | Every session | High | ✅ Implemented |
| UC-028 | Create Multiple Statements | Occasional | Medium | ✅ Implemented |
| UC-029 | Search from Statement Card | Frequent | High | ✅ Implemented |
| UC-030 | Browse Saved Interests | Frequent | Medium | ✅ Implemented |
| UC-031 | Apply to Job (Future) | Occasional | High | 🚧 Planned |
| UC-032 | Sign Up for Course/Event (Future) | Occasional | High | 🚧 Planned |

---

## User Journey Timeline

### Week 1: Initial Setup
- **Day 1:** UC-001, UC-002, UC-003 (Dashboard orientation)
- **Day 1-2:** UC-004, UC-005 (Create first statement)
- **Day 2-3:** UC-012, UC-013, UC-014 (Explore and save opportunities)

### Week 2-4: Active Exploration
- **Multiple sessions:** UC-009, UC-010, UC-011 (Find opportunities from statements)
- **Multiple sessions:** UC-012, UC-014 (Continue exploring and saving)
- **Week 2:** UC-015, UC-016 (Review saved interests)
- **Week 3:** UC-007 (Refine statements based on discoveries)
- **Week 4:** UC-025 (Check progress)

### Month 2+: Ongoing Use
- **As needed:** UC-019, UC-020, UC-021 (Request help)
- **Regularly:** UC-023, UC-024 (Check messages)
- **Periodically:** UC-025, UC-026 (Track progress)
- **Occasionally:** UC-028 (Create additional statements)
- **Regularly:** UC-030 (Review and manage interests)

---

## Edge Cases & Error Scenarios

### EC-001: Network Connectivity Issues
- **Scenario:** Student loses internet connection during form submission
- **Expected Behavior:** Error message displayed, form data preserved, retry option available

### EC-002: Concurrent Edits
- **Scenario:** Student opens statement in two tabs, edits in both
- **Expected Behavior:** Last save wins, or conflict resolution message

### EC-003: Large Result Sets
- **Scenario:** Search returns 100+ opportunities
- **Expected Behavior:** Pagination or "Load More" functionality (future)

### EC-004: Expired Session
- **Scenario:** Student session expires while using dashboard
- **Expected Behavior:** Graceful redirect to login, with return URL

### EC-005: Missing Data
- **Scenario:** School or guidance team data unavailable
- **Expected Behavior:** Graceful degradation, shows "Not available" message

---

## Success Metrics

### Engagement Metrics
- **UC-005 Success Rate:** % of new users who create first statement within 7 days
- **UC-014 Frequency:** Average number of interests saved per active user
- **UC-012 Frequency:** Average searches per user per week
- **UC-019 Frequency:** Average support requests per user per month

### Completion Metrics
- **UC-005 Completion Time:** Average time to create first statement (target: < 5 minutes)
- **UC-014 Completion Time:** Average time from search to save (target: < 2 minutes)
- **UC-019 Completion Time:** Average time to submit support request (target: < 3 minutes)

### Satisfaction Metrics
- **UC-025 Engagement:** % of users who check progress page monthly
- **UC-006 Frequency:** Average statement detail views per statement
- **Return Rate:** % of users who return within 7 days of first use

---

## HcclService Methods Reference

This section provides a comprehensive reference of all `HcclService` methods used across the student dashboard use cases.

### Context & Authentication
- **`resolveTicketContext(userProfileId: string)`**
  - GET `/hccl/tixui/get-context?userProfileId={id}`
  - Returns: `HcclUserContextGETData`
  - Used in: UC-001, UC-005, UC-014, UC-019, UC-020, UC-021, UC-023, UC-027, UC-028
  - Provides: Current user profile, user context, menu data

### Student & School Data
- **`findCLStudents(criteria: CLStudentCriteria)`**
  - POST `/hccl/integration_edu/clstudent/query`
  - Returns: `CLStudentGETDataSearchResults`
  - Used in: UC-001
  - Criteria: `{ userProfileId, pageNumber: 1, pageSize: 1, isPaging: true }`

- **`getCLSchoolById(id: string)`**
  - GET `/hccl/integration_edu/clschool/{id}`
  - Returns: `CLSchoolGETData`
  - Used in: UC-001
  - Loads school information for student

- **`findHcclTeams(criteria: HcclTeamCriteria)`**
  - POST `/hccl/teams/hcclteam/query`
  - Returns: `HcclTeamGETDataSearchResults`
  - Used in: UC-001
  - Criteria: `{ teamParentId: schoolId, teamParentEntityType: 'CLSchool', optionalDataHint: 'members' }`
  - Loads guidance team with members

### Personal Statements
- **`findPersonalStatements(criteria: PersonalStatementCriteria)`**
  - POST `/hccl/vocode/personalstatement/query`
  - Returns: `PersonalStatementGETDataSearchResults`
  - Used in: UC-001, UC-004, UC-025, UC-026, UC-027
  - Criteria: `{ parentEntityId: currentUserProfileId, isPaging: false, maxResults: 100 }`

- **`getPersonalStatementById(id: string)`**
  - GET `/hccl/vocode/personalstatement/{id}`
  - Returns: `PersonalStatementGETData`
  - Used in: UC-006, UC-007

- **`createPersonalStatement(body: PersonalStatementPOSTData)`**
  - POST `/hccl/vocode/personalstatement`
  - Returns: `PersonalStatementGETData`
  - Used in: UC-005, UC-028
  - Body: `{ name, businessCode: 'autocalc', statementTypeCode: 'student_vocation', parentEntityId, parentEntityType: 'HcclUserProfile', rawText, encodingText: '', status: 0 }`

- **`updatePersonalStatementById(id: string, body: PersonalStatementPUTData)`**
  - PUT `/hccl/vocode/personalstatement/{id}`
  - Returns: Updated `PersonalStatementGETData`
  - Used in: UC-007
  - Body: `{ name, businessCode, parentEntityId, rawText, encodingText }`

- **`deletePersonalStatementById(id: string)`**
  - DELETE `/hccl/vocode/personalstatement/{id}`
  - Returns: Success confirmation
  - Used in: UC-008

### Catalog & Interests
- **`findCatalogEntrys(criteria: CatalogEntryCriteria)`**
  - POST `/hccl/catalog/catalogentry/query`
  - Returns: `CatalogEntryGETDataSearchResults`
  - Used in: UC-009, UC-010, UC-011, UC-012, UC-013, UC-029
  - Criteria: `{ searchByText: keyword, catalogTypeCode: type, available: 1 (optional), pageNumber: 1, pageSize: 50, isPaging: true }`

- **`findCatalogEntryInterests(criteria: CatalogEntryInterestCriteria)`**
  - POST `/hccl/catalog/catalogentryinterest/query`
  - Returns: `CatalogEntryInterestGETDataSearchResults`
  - Used in: UC-001, UC-015, UC-025, UC-026, UC-027, UC-030
  - Criteria: `{ userProfileId: currentUserProfileId, pageNumber: 1, pageSize: 100, isPaging: true }`

- **`getCatalogEntryInterestById(id: string)`**
  - GET `/hccl/catalog/catalogentryinterest/{id}`
  - Returns: `CatalogEntryInterestGETData`
  - Used in: UC-016
  - Includes nested `catalogEntry: CatalogEntryGETData`

- **`createCatalogEntryInterest(body: CatalogEntryInterestPOSTData)`**
  - POST `/hccl/catalog/catalogentryinterest`
  - Returns: `CatalogEntryInterestGETData`
  - Used in: UC-014 (Future implementation)
  - Body: `{ catalogId, catalogEntryId, userProfileId, interest: 1, notes: '' }`

- **`deleteCatalogEntryInterestById(id: string)`**
  - DELETE `/hccl/catalog/catalogentryinterest/{id}`
  - Returns: Success confirmation
  - Used in: UC-017

### Messages
- **`findPMessages(criteria: PMessageCriteria)`**
  - POST `/hccl/pattern/pmessage/query`
  - Returns: `PMessageGETDataSearchResults`
  - Used in: UC-023
  - Criteria: `{ pageNumber: 1, pageSize: 100, isPaging: true }`

- **`getPMessageById(id: string)`**
  - GET `/hccl/pattern/pmessage/{id}`
  - Returns: `PMessageGETData`
  - Used in: UC-024
  - Includes: `participants: PMessageParticipantGETData[]`, `unreadMessageCount`

### Guidance & Support
- **`resolveGuidanceUIData()`**
  - GET `/hccl/students/dash-ui/resolve-guidance-data`
  - Returns: `WorkRequestDashboardUIGETData`
  - Used in: UC-018, UC-025, UC-026
  - Includes: `recentWorkRequests`, `mapStats` (state statistics)

- **`getWorkRequestById(id: string)`**
  - GET `/hccl/tix/workrequest/{id}`
  - Returns: `WorkRequestGETData`
  - Used in: UC-022
  - Includes: `businessCode, name, description, currentStateCode, dateCreated, subjectEntityId, subjectEntityName`

- **`callCreateTicket(body: CreateTicketPOSTData)`**
  - POST `/hccl/tixui/create-ticket`
  - Returns: `WorkRequestGETData`
  - Used in: UC-019, UC-020, UC-021
  - Body: `{ studentUserProfileId, title, rawText }`

### Service Call Patterns

#### Initialization Pattern
Most use cases that need user context follow this pattern:
```
HcclContextService.waitForReady$()
  → HcclService.resolveTicketContext(userProfileId)
    → Returns HcclUserContextGETData
      → Extract currentUserProfileId
        → Use in subsequent calls
```

#### List Loading Pattern
```
StudentContextService.get[Entity]()
  → HcclContextService.waitForReady$() (if needed)
    → HcclService.find[Entity]s(criteria)
      → Returns [Entity]GETDataSearchResults
        → Extract searchResults[]
```

#### Detail View Pattern
```
StudentContextService.get[Entity]ById(id)
  → HcclService.get[Entity]ById(id)
    → Returns [Entity]GETData
```

#### Create Pattern
```
HcclContextService.waitForReady$()
  → Get currentUserProfileId
    → Build POST data with userProfileId
      → HcclService.create[Entity](postData)
        → Returns [Entity]GETData
          → Refresh list if needed
```

#### Update Pattern
```
StudentContextService.get[Entity]ById(id) (get existing)
  → Merge changes with existing data
    → HcclService.update[Entity]ById(id, putData)
      → Returns updated [Entity]GETData
        → Refresh detail view
```

#### Delete Pattern
```
HcclService.delete[Entity]ById(id)
  → Returns success confirmation
    → Navigate back to list
      → List auto-refreshes
```

### Error Handling

All service calls in `StudentContextService` include error handling:
- `catchError(() => of(null))` for single entity fetches
- `catchError(() => of([]))` for list fetches
- Error state is set in signals for UI display
- User sees friendly error messages, not technical errors

### Data Flow Summary

```
User Action
  ↓
Component Method
  ↓
StudentContextService Method
  ↓
HcclContextService (if user context needed)
  ↓
HcclService Method
  ↓
HTTP Request (GET/POST/PUT/DELETE)
  ↓
Backend API
  ↓
Response Data
  ↓
StudentContextService (transform/format)
  ↓
Signal Update
  ↓
Component Template (reactive display)
```

---

This comprehensive use case document covers all major interactions a student will have with the dashboard, organized in the natural order they would occur during a student's career planning journey.

