# StdBuba Component

The `StdBubaComponent` is a reusable Angular component that generates dynamic links with tooltips and icons based on entity data. It integrates with the HCCL service to fetch entity information and provides a consistent way to display entity references throughout the application.

## Features

- **Dynamic Entity Display**: Shows entity names, IDs, and icons based on entity type
- **Tooltip Support**: Displays detailed information on hover
- **Routing Integration**: Generates appropriate routes for navigation
- **Template System**: Uses customizable HTML templates for different entity types
- **Loading States**: Shows loading indicators while fetching data
- **Error Handling**: Graceful error handling with fallback display
- **Accessibility**: Proper ARIA labels and keyboard navigation support

## Usage

### Basic Usage

```html
<app-std-buba 
  entityName="Student" 
  entityId="12345">
</app-std-buba>
```

### Advanced Usage

```html
<app-std-buba 
  entityName="Provider" 
  entityId="PROV789"
  profileTypeCode="HEALTHCARE_PROVIDER"
  aspect="clinical"
  [showIcon]="true"
  [showTooltip]="true"
  cssClass="custom-provider-buba">
</app-std-buba>
```

## Input Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `entityName` | `string` | Yes | - | The name/type of the entity (e.g., "Student", "Provider") |
| `entityId` | `string` | Yes | - | The unique identifier for the entity |
| `profileTypeCode` | `string` | No | - | Optional profile type code |
| `aspect` | `string` | No | - | Optional aspect parameter |
| `showIcon` | `boolean` | No | `true` | Whether to display the entity icon |
| `showTooltip` | `boolean` | No | `true` | Whether to show tooltip on hover |
| `cssClass` | `string` | No | - | Additional CSS classes to apply |

## Output

The component generates a `BubaResult` object containing:

- **html**: Rendered HTML content
- **name**: Display name for the entity
- **icon**: FontAwesome icon class
- **routePath**: Calculated route for navigation
- **tooltip**: Tooltip text with entity details

## Templates

The component uses HTML templates stored in `/assets/templates/buba/` directory. Templates are loaded based on the `entityName` (converted to lowercase).

### Template Variables

Templates support the following variables:

- `{{name}}` - Display name
- `{{entityId}}` - Entity ID
- `{{entityName}}` - Entity name
- `{{icon}}` - Icon class
- `{{description}}` - Entity description
- `{{status}}` - Entity status
- `{{displayName}}` - Full display name

### Example Template

```html
<div class="buba-container student-buba">
  <i class="{{icon}}"></i>
  <span class="buba-name">{{displayName}}</span>
  <span class="buba-id">({{entityId}})</span>
  <span class="buba-status" *ngIf="status">{{status}}</span>
</div>
```

## Icons

The component automatically maps entity types to appropriate FontAwesome icons:

- `student` → `fas fa-user-graduate`
- `school` → `fas fa-school`
- `provider` → `fas fa-hospital`
- `broker` → `fas fa-handshake`
- `advocate` → `fas fa-user-tie`
- `workrequest` → `fas fa-tasks`
- `catalog` → `fas fa-book`
- `user` → `fas fa-user`
- `profile` → `fas fa-id-card`
- Default → `fas fa-cube`

## Routing

The component calculates routes based on:

1. Current dashboard type from HCCL context
2. Entity name (converted to lowercase)
3. Entity ID
4. Optional profile type code and aspect parameters

Example route: `/advocate-dashboard/student/12345?profileTypeCode=STUDENT_PROFILE&aspect=academic`

## Styling

The component includes comprehensive SCSS styling with:

- Responsive design support
- Dark theme compatibility
- High contrast mode support
- Loading and error states
- Hover effects and transitions
- Tooltip positioning

## Integration with HCCL Service

The component integrates with the existing HCCL service architecture:

- Uses `HcclContextService` for context data
- Leverages `HcclService` for entity data fetching
- Follows the application's routing patterns
- Maintains consistency with existing UI components

## Error Handling

The component includes robust error handling:

- Network errors during data fetching
- Missing templates (falls back to default)
- Invalid entity data
- Service unavailability

## Accessibility

- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management

## Testing

Use the `BubaDemoComponent` to test different configurations:

```typescript
import { BubaDemoComponent } from './buba-demo.component';

// Add to your module or use as standalone
```

## Future Enhancements

- Real HCCL service integration for entity data
- Caching mechanism for frequently accessed entities
- Animation support for state transitions
- Custom icon mapping configuration
- Batch loading for multiple entities
