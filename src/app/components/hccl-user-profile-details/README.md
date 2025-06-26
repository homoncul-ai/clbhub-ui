# HcclUserProfileDetailsComponent

A reusable Angular component for displaying detailed information about HCCL user profiles.

## Features

- Loads and displays HcclUserProfileGETData using a userProfileId
- Customizable title (optional)
- Responsive design with modern UI
- Loading states and error handling
- Displays all user profile fields in organized sections
- Proper date formatting
- Status indicators for availability

## Usage

### Basic Usage

```html
<app-hccl-user-profile-details 
  [userProfileId]="'your-user-profile-id'">
</app-hccl-user-profile-details>
```

### With Custom Title

```html
<app-hccl-user-profile-details 
  [userProfileId]="'your-user-profile-id'"
  [title]="'Student Profile Information'">
</app-hccl-user-profile-details>
```

### In a Parent Component

```typescript
import { Component } from '@angular/core';
import { HcclUserProfileDetailsComponent } from './components/hccl-user-profile-details/hccl-user-profile-details.component';

@Component({
  selector: 'app-parent',
  template: `
    <div class="container">
      <h1>User Profile Viewer</h1>
      <app-hccl-user-profile-details 
        [userProfileId]="selectedUserProfileId"
        [title]="'Detailed User Information'">
      </app-hccl-user-profile-details>
    </div>
  `,
  imports: [HcclUserProfileDetailsComponent],
  standalone: true
})
export class ParentComponent {
  selectedUserProfileId = 'user-profile-123';
}
```

### With Dynamic User Profile ID

```typescript
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HcclUserProfileDetailsComponent } from './components/hccl-user-profile-details/hccl-user-profile-details.component';

@Component({
  selector: 'app-user-details-page',
  template: `
    <div class="container">
      <app-hccl-user-profile-details 
        [userProfileId]="userProfileId"
        [title]="pageTitle">
      </app-hccl-user-profile-details>
    </div>
  `,
  imports: [HcclUserProfileDetailsComponent],
  standalone: true
})
export class UserDetailsPageComponent {
  userProfileId: string = '';
  pageTitle: string = 'User Profile Details';

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.userProfileId = params['id'];
      this.pageTitle = `Profile Details for ${params['id']}`;
    });
  }
}
```

## Input Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| userProfileId | string | Yes | The ID of the user profile to load and display |
| title | string | No | Custom title to display. Defaults to "User Profile Details" if not provided |

## Displayed Information

The component displays the following user profile information in organized sections:

### Basic Information
- User Code
- User ID
- Profile Type
- Organization ID
- Status (Available/Not Available)

### Contact Information
- Email
- Cell Phone
- Work Phone

### External Information
- External User ID
- External User Entity Type
- External User Name

### Additional Data
- JSON Data (if available)

### Audit Information
- Created Date
- Created By
- Last Updated Date
- Last Updated By

## Styling

The component includes comprehensive styling with:
- Responsive grid layout
- Card-based sections
- Loading spinner
- Error and no-data states
- Status indicators
- Mobile-friendly design

## Dependencies

- Angular CommonModule
- HcclService (for data loading)
- RxJS (for reactive programming)

## Error Handling

The component handles various error scenarios:
- Network errors
- User profile not found
- Invalid user profile ID
- Service unavailable

## Loading States

- Shows loading spinner while fetching data
- Displays appropriate error messages
- Handles empty data gracefully 