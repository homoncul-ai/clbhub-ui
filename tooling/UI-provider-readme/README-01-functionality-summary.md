# Provider Dashboard - Functionality Summary

## Overview

The Provider Dashboard is designed for educational institutions (schools/organizations) that provide vocational opportunities to students. It serves as a management interface for providers to manage their catalogs, track student interests, handle work requests, and manage their organization details.

## Main Purpose

The Provider Dashboard enables educational providers to:
1. **Monitor Engagement**: Track how students interact with their course catalogs and opportunities
2. **Manage Catalogs**: Create, edit, and manage course/job/event catalogs
3. **Handle Requests**: Process and manage work requests from students and other stakeholders
4. **Manage Organization**: View and update school/organization information and staff

## Dashboard Structure

### 1. Provider Dashboard (Main Dashboard Tab)

**Location:** `/provider-dashboard/dashboard`

**Purpose:** Overview of provider activity and key metrics

**Features:**
- **Provider Request Statistics**: Displays counts for:
  - New requests
  - In Progress requests
  - Closed requests
  - Total catalogs
- **Catalog Interests Chart**: Bar chart showing:
  - Interest counts per catalog
  - Entry counts per catalog
  - Business codes and date ranges (on hover)
- **Available Catalogs List**: Shows all catalogs with:
  - Catalog name
  - Description
  - Entry count badge
  - Last updated date

**Data Sources:**
- Work request statistics (by state)
- Catalog list with statistics
- Catalog interest data for charting

### 2. Provider Details

**Location:** `/provider-dashboard/details`

**Purpose:** Manage organization and staff information

#### Tab: My School
- **School Information Display**:
  - School name
  - Website URL
  - (Placeholder for address, phone)
- **Quick Actions**:
  - Edit school information button

#### Tab: Colleagues
- **School Staff List**:
  - Staff member names
  - Roles (Principal, Teacher, Counselor, etc.)
  - Departments
  - Email addresses
  - Role badges with color coding
- **Quick Actions**:
  - Add Colleague button
  - Send Message button

**Data Sources:**
- Organization data (`HcclOrganizationGETData`)
- Staff/team member data (from organization context)

### 3. Provider Work Request Dashboard

**Location:** `/provider-dashboard/workrequest`

**Purpose:** Manage work requests and queues

**Features:**
- **Work Queue List**:
  - Queue business codes
  - Queue descriptions
  - Active ticket counts
  - Assigned ticket counts
  - View Details button
  - Take Action button
- **Work Request Statistics**:
  - Open requests count
  - In Progress count
  - Completed count
  - Cancelled count
- **Recent Work Requests List**:
  - Request business codes
  - Descriptions
  - Current state (with color-coded badges)
  - Creation dates
- **Quick Actions**:
  - Create New Request
  - View All Requests

**Tabs:**
- **Work Requests**: Main dashboard view
- **My Open Tickets**: Filtered view of tickets assigned to current user

**Data Sources:**
- Work queues (`WorkQueueGETData`) filtered by organization
- Work request statistics
- Recent work requests

### 4. Catalog Dashboard

**Location:** `/provider-dashboard/catalog`

**Purpose:** Manage course/job/event catalogs

**Features:**
- **Catalog Tiles**: Grid display of all catalogs showing:
  - Catalog name with icon
  - Description
  - Entry count (large display)
  - Interest count (large display)
  - Last updated date
  - View button
  - Edit button
- **Quick Actions Section**:
  - Create New Catalog (large button)
  - Manage Entries (large button)
  - View Analytics (large button)
  - Export Data (large button)

**Data Sources:**
- Catalog list (`CatalogGETData`) filtered by organization
- Catalog statistics (entry counts, interest counts)

## Visual Appearance

### Layout Style
- **Card-based design**: All sections use Bootstrap cards
- **Grid layout**: Responsive columns (col-md-3, col-md-6, etc.)
- **Statistics display**: Large display-4 numbers for key metrics
- **List groups**: For displaying collections of items
- **Badges**: Color-coded status indicators

### Color Scheme
- **Primary (Blue)**: New/Open items, primary actions
- **Warning (Yellow)**: In Progress items
- **Success (Green)**: Completed/Closed items, success states
- **Info (Cyan)**: Informational displays, cancelled items
- **Danger (Red)**: High priority items (if used)

### Icons
- Dashboard: `fa-tachometer-alt`
- School: `fa-school`
- Colleagues: `fa-users`
- Work Requests: `fa-tasks`
- Catalogs: `fa-book`
- Charts: `fa-chart-bar`

## Key Components Used

### Abstract Components
- `AbstractMultimodeComponent<HcclOrganizationCrudWrapper>`: Base for most provider components
- `AbstractEntityGroupComponent<HcclUserProfileCrudWrapper>`: For group components with tabs
- `SimpleTabsetComponent`: For tab navigation

### CRUD Wrappers
- `HcclOrganizationCrudWrapper`: For organization/school data
- `HcclUserProfileCrudWrapper`: For user profile data

### External Libraries
- **Chart.js**: For catalog interests bar chart
- **Bootstrap**: For layout and styling

## Data Flow

1. **Initialization**: Components extend `AbstractMultimodeComponent` which loads organization data
2. **Data Loading**: 
   - `loadEntityByIdCall()` method loads organization by ID
   - Organization ID comes from user context (`currentUserProfile.organizationId`)
   - Additional data (catalogs, work queues) loaded based on organization ID
3. **Display**: Data displayed in cards, lists, and charts
4. **Actions**: Buttons trigger navigation or CRUD operations

## Current Limitations

1. **Mock Data**: Some components still use mock data (colleagues list, some statistics)
2. **Incomplete Features**: Some buttons are placeholders (Add Colleague, Send Message)
3. **Statistics**: Provider request stats currently return mock data
4. **Work Request Details**: View Details and Take Action buttons need implementation
5. **Catalog Management**: Create/Edit catalog functionality not fully implemented

## Integration Points

- **HcclContextService**: Provides current user profile and organization ID
- **HcclService**: All data operations (findCatalogs, findWorkQueues, getHcclOrganizationById)
- **Routing**: Uses Angular router with nested routes
- **Menu System**: Integrated with shell menu service for navigation

## User Workflow

1. **Login**: Provider user logs in and sees provider dashboard menu
2. **Dashboard Overview**: Views main dashboard with stats and charts
3. **Catalog Management**: Navigates to catalog dashboard to view/manage catalogs
4. **Request Handling**: Goes to work request dashboard to process requests
5. **Organization Management**: Updates school info and views colleagues in details section

This dashboard serves as the central hub for providers to manage their relationship with the vocational education platform and track student engagement with their offerings.

