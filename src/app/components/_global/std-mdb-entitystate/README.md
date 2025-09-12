# StdMdbEntitystateComponent

A reusable Angular component for managing entity state changes using the HCCL service.

## Overview

This component provides a user interface for displaying and executing entity state transitions. It integrates with the HCCL service to fetch available state changes and execute state transitions.

## Features

- **State Change Setup**: Automatically loads available state transitions for an entity
- **Menu Display**: Shows available state changes in an intuitive menu format
- **Action Execution**: Handles state change execution when menu items are selected
- **Error Handling**: Provides user-friendly error messages and retry functionality
- **Loading States**: Shows loading indicators during API calls
- **Responsive Design**: Works well on both desktop and mobile devices
- **Debug Mode**: Includes optional debug information for development

## Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `entityName` | `string` | `''` | The name/type of the entity (e.g., 'WorkRequest', 'Ticket') |
| `entityId` | `string` | `''` | The unique identifier of the entity |
| `callChangeSetupUI` | `boolean` | `true` | Whether to automatically call the setup UI on component initialization |

## Outputs

| Event | Type | Description |
|-------|------|-------------|
| `stateChangeResponse` | `EventEmitter<StateChangeFormResponse>` | Emitted when a state change response is received |
| `menuItemSelected` | `EventEmitter<MenuControlData>` | Emitted when a menu item is selected |

## Usage

### Basic Usage

```html
<app-std-mdb-entitystate
  entityName="WorkRequest"
  entityId="12345"
  (stateChangeResponse)="onStateChangeResponse($event)"
  (menuItemSelected)="onMenuItemSelected($event)">
</app-std-mdb-entitystate>
```

### Component Integration

```typescript
import { StdMdbEntitystateComponent } from '@app/components/_global/std-mdb-entitystate';

@Component({
  // ... component configuration
  imports: [StdMdbEntitystateComponent]
})
export class MyComponent {
  onStateChangeResponse(response: StateChangeFormResponse): void {
    console.log('State change response:', response);
    // Handle the response
  }

  onMenuItemSelected(menuItem: MenuControlData): void {
    console.log('Menu item selected:', menuItem);
    // Handle menu item selection
  }
}
```

### Manual Control

```html
<app-std-mdb-entitystate
  entityName="WorkRequest"
  entityId="12345"
  [callChangeSetupUI]="false"
  (stateChangeResponse)="onStateChangeResponse($event)">
</app-std-mdb-entitystate>

<button (click)="entityStateComponent.refresh()">Refresh State Changes</button>
```

## API Integration

The component integrates with the following HCCL service methods:

- `callStateChangeUISetup(entity_name: string, entity_id: string)`: Fetches available state transitions
- `callStateChangeGo(body: StateChangeFormRequest)`: Executes a state change

## Styling

The component uses Bootstrap classes and custom SCSS for styling. It supports:

- Responsive design for mobile and desktop
- Dark mode support (via CSS media queries)
- Hover effects and transitions
- Loading and error states
- Customizable menu item appearance

## Error Handling

The component handles various error scenarios:

- Network errors during API calls
- Invalid entity name/ID combinations
- Missing or empty state change responses
- Permission-based menu item restrictions

## Development

### Debug Mode

The component includes a collapsible debug section that shows the raw `StateChangeFormResponse` data. This is useful for development and troubleshooting.

### Testing

The component can be tested by:

1. Providing mock data for `StateChangeFormResponse`
2. Testing different error scenarios
3. Verifying menu item selection behavior
4. Testing responsive design on different screen sizes

## Dependencies

- Angular Common Module
- Angular Forms Module
- HCCL Service (`@app/restsvc/hccl.service`)
- Bootstrap CSS classes
- Font Awesome icons

## Related Components

- `MenuControlDataListComponent`: For dropdown-style menu display
- `MenuControlDataListMComponent`: For multi-select menu display
- `SimpleMessagesSectionComponent`: For displaying messages from state change responses
