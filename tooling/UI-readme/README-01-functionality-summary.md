# Student Dashboard - Functionality Summary

## Overview

The Student Dashboard is a **Career & Education Planning Platform** designed for vocational technical students. It serves as a centralized hub where students can explore career opportunities, manage their professional development, and connect with guidance counselors and advocates.

### Primary Purpose
**Help high school vocational tech students plan their career path, build professional materials, and connect with opportunities.**

---

## Core Modules & Features

### 1. Dashboard Home (`/student-dashboard/home`)
**Purpose:** Personal information hub and at-a-glance overview

**Features:**
- Student profile display (name, email, phone, user code)
- Edit profile capability via modal
- School information card (school name, code, district, organization)
- Guidance Team display (team member names and contact emails)

**Data Sources:**
- `HcclUserProfile` - Student's user profile
- `CLStudent` - Student record linked to profile
- `CLSchool` - Associated school information
- `HcclTeam` - Guidance team members

---

### 2. Personal Statements (`/student-dashboard/personalstatements`)
**Purpose:** Create and manage career goal statements that drive opportunity matching

**Features:**
- Create new personal statements (name + career dreams/goals text)
- View statement cards with status badges (Draft, Active, Archived)
- **AI-Powered Matching Actions per statement:**
  - 🔍 Search matching **Jobs** (briefcase icon)
  - 🎓 Search matching **Courses** (graduation cap icon)
  - 📅 Search matching **Events** (calendar icon)
- Statement details view with tabs:
  - Details tab - Full statement view
  - Search tab - Results filtered by statement
  - Research tab - Deep dive exploration
  - Resumes tab - Associated resumes

**Related Sub-features:**
- **Resume Builder** - Create resumes linked to personal statements
- **Resume Entries** - Add work experience, education, skills sections
- **Drag-and-drop reordering** of resume sections
- **Markdown editing** for resume content

---

### 3. Interests (`/student-dashboard/interests`)
**Purpose:** Track saved/liked catalog opportunities

**Features:**
- List of saved catalog entry interests
- Filter and search capabilities
- Click-through to interest details
- **Interest Detail View:**
  - Full catalog entry information
  - "Sign Up" button (for courses/events)
  - "Apply" button (for jobs/programs)
  - Dynamic icons based on catalog type

---

### 4. Guidance & Support (`/student-dashboard/guidance`)
**Purpose:** Get help from guidance counselors and advocates

**Features:**
- **Dashboard Stats:**
  - Open tickets count
  - Completed tickets count
  - Cancelled tickets count
- **Recent Tickets List** with status badges
- **Quick Actions:**
  - Request Career Counseling (opens ticket creation modal)
- **Work Request Details** (`/student-dashboard/guidance/workrequests/:ticketId`):
  - Ticket information display
  - Status updates
  - Work request items
  - Activity logs

---

### 5. My Communications / Messages (`/student-dashboard/messages`)
**Purpose:** Messaging and communication center

**Features:**
- Message inbox list
- Message detail view with full conversation
- Tabbed navigation (Messages list → Individual message)

---

### 6. Progress (`/student-dashboard/progress`)
**Purpose:** Track academic and professional development progress

**Features:**
- **Key Metrics Display:**
  - GPA (e.g., 3.8)
  - Overall Progress percentage
  - Credits Earned
  - Credits Remaining
- **Recent Achievements** list (exam scores, project completions, awards)
- **Learning Goals** with progress bars
  - Goal titles with target dates
  - Visual progress indicators

*Note: Currently shows hardcoded sample data - needs backend integration*

---

### 7. Research / Catalog Search (`/student-dashboard/research`)
**Purpose:** Explore vocational opportunities catalog

**Features:**
- **Sidebar:** Catalog type checkboxes (filter by category)
- **Simple Search:** Keyword search
- **Advanced Search:** 
  - Keyword field
  - "Show Available Only" checkbox
  - Debug mode toggle
- **Results Display:**
  - Title, description, last updated date
  - Availability indicator
  - "View Source" link to original posting
- **Accessibility:** Font size toggle (zoom in/out)

---

### 8. Resume Entries (`/student-dashboard/resumeentries`)
**Purpose:** Manage individual resume items separately from full resumes

**Features:**
- List all resume entries
- Create new resume entries
- Edit entry details (title, organization, position, dates, description)
- Associate entries with resumes

---

## Navigation Structure

```
Student Dashboard
├── My Dashboard (home)
├── Personal Statements
│   ├── Statement Details
│   │   ├── Details
│   │   ├── Search (Jobs/Courses/Events)
│   │   ├── Research
│   │   └── Resumes
│   │       └── Resume Builder
│   └── Create New Statement
├── Progress
├── Guidance & Support
│   └── Work Requests
│       └── Ticket Details
├── Research (Catalog Search)
├── My Communications (Messages)
│   └── Message Details
├── Interests
│   └── Interest Details
└── Resume Entries
    └── Entry Details
```

---

## Visual Design Summary

### Current Aesthetic
- **Framework:** Angular 17+ with MDB (Material Design for Bootstrap)
- **Color Palette:** Bootstrap primary blue (#1B84FF), gray scale, green accents
- **Typography:** Poppins sans-serif, standard Bootstrap sizing
- **Layout:** Card-based design with headers, responsive grid system
- **Icons:** Font Awesome icons throughout
- **Side Navigation:** DHTMLX Tree component with gradient background

### UI Patterns
- Cards with headers and action buttons
- List groups for data display
- Badges for status indicators
- Modals for forms and confirmations
- Tabs for sub-navigation within features
- Loading spinners during data fetch
- Error alerts for failures

---

## Target User Profile

**High School Vocational Technical Students**
- Age: 14-18 years old
- Computer Literacy: Medium level
- Goals: Explore career paths, find job/course opportunities, build resumes
- Needs: Clear guidance, simple language, visual feedback, mobile access

---

## Technology Stack

- **Frontend:** Angular 17+ (standalone components)
- **UI Framework:** MDB Angular UI Kit (Material Design for Bootstrap)
- **State Management:** RxJS observables, service-based context
- **Authentication:** Keycloak integration
- **Internationalization:** ngx-translate
- **Tree Navigation:** DHTMLX Tree

