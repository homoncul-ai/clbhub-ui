# HcclContextService

A singleton service that manages HCCL (Health Care Claims and Logistics) context data and initializes after Keycloak authentication is complete.

## Overview

The `HcclContextService` provides a centralized way to manage HCCL context data throughout the application. It ensures that context is loaded only after Keycloak authentication is ready and provides reactive state management using Angular signals.

## Features

- **Singleton Pattern**: Single instance across the application
- **Reactive State Management**: Uses Angular signals for reactive updates
- **Keycloak Integration**: Initializes after Keycloak authentication
- **Error Handling**: Comprehensive error handling and logging
- **Backward Compatibility**: Provides both signals and observables
- **Type Safety**: Full TypeScript support

## Usage

### Basic Usage

```typescript
import { HcclContextService } from './services/hccl-context.service';

@Component({...})
export class MyComponent {
  constructor(private hcclContextService: HcclContextService) {}

  ngOnInit() {
    // Check if context is ready
    if (this.hcclContextService.isReady()) {
      const context = this.hcclContextService.getContext();
      console.log('Context:', context);
    }
  }
}
```

### Reactive Usage with Signals

```typescript
import { HcclContextService } from './services/hccl-context.service';

@Component({...})
export class MyComponent {
  constructor(private hcclContextService: HcclContextService) {}

  // Access reactive state
  isReady = this.hcclContextService.isReady;
  context = this.hcclContextService.context;
  isLoading = this.hcclContextService.isLoading;
  error = this.hcclContextService.error;

  ngOnInit() {
    // Template can use these signals directly
    // <div *ngIf="isReady()">Context loaded!</div>
    // <div *ngIf="isLoading()">Loading...</div>
    // <div *ngIf="error()">Error: {{ error() }}</div>
  }
}
```

### Observable Usage (Backward Compatibility)

```typescript
import { HcclContextService } from './services/hccl-context.service';

@Component({...})
export class MyComponent {
  constructor(private hcclContextService: HcclContextService) {}

  ngOnInit() {
    // Subscribe to context changes
    this.hcclContextService.context$.subscribe(context => {
      if (context) {
        console.log('Context updated:', context);
      }
    });
  }
}
```

### Waiting for Context to be Ready

```typescript
import { HcclContextService } from './services/hccl-context.service';

@Component({...})
export class MyComponent {
  constructor(private hcclContextService: HcclContextService) {}

  async ngOnInit() {
    try {
      // Wait for context to be ready (with 30 second timeout)
      const context = await this.hcclContextService.waitForReady(30000);
      console.log('Context is ready:', context);
    } catch (error) {
      console.error('Failed to load context:', error);
    }
  }
}
```

### Manual Initialization

```typescript
import { HcclContextService } from './services/hccl-context.service';

@Component({...})
export class MyComponent {
  constructor(private hcclContextService: HcclContextService) {}

  initializeContext() {
    this.hcclContextService.initializeContext('user-profile-id').subscribe({
      next: (context) => {
        console.log('Context initialized:', context);
      },
      error: (error) => {
        console.error('Failed to initialize context:', error);
      }
    });
  }

  refreshContext() {
    this.hcclContextService.refreshContext('user-profile-id').subscribe({
      next: (context) => {
        console.log('Context refreshed:', context);
      }
    });
  }
}
```

## API Reference

### Properties

- `state`: Readonly signal containing the current state
- `isInitialized`: Computed signal indicating if context is initialized
- `isLoading`: Computed signal indicating if context is loading
- `error`: Computed signal containing any error message
- `context`: Computed signal containing the current context data
- `lastUpdated`: Computed signal containing the last update timestamp
- `context$`: Observable for backward compatibility

### Methods

#### `initializeContext(userProfileId?: string): Observable<HcclUserContextGETData>`
Initializes the HCCL context with the specified user profile ID.

#### `refreshContext(userProfileId?: string): Observable<HcclUserContextGETData>`
Refreshes the HCCL context data.

#### `getContext(): HcclUserContextGETData | null`
Returns the current context data or null if not initialized.

#### `getCurrentUserProfileId(): string | null`
Returns the current user profile ID or null if not available.

#### `getCurrentUserProfile(): any`
Returns the current user profile or null if not available.

#### `getUserProfileMenu(): any`
Returns the user profile menu or null if not available.

#### `getMessages(): any`
Returns messages or null if not available.

#### `isReady(): boolean`
Returns true if context is initialized and has data.

#### `clearContext(): void`
Clears the context (useful for logout).

#### `getState(): HcclContextState`
Returns the current state object for debugging.

#### `waitForReady(timeout?: number): Promise<HcclUserContextGETData>`
Waits for context to be ready with optional timeout.

## Migration Guide

### From Direct HcclService Usage

**Before:**
```typescript
constructor(private hcclService: HcclService) {}

ngOnInit() {
  this.hcclService.resolveTicketContext('').subscribe(context => {
    this.ticketContext = context;
  });
}

getTicketContext() {
  return this.ticketContext;
}
```

**After:**
```typescript
constructor(private hcclContextService: HcclContextService) {}

ngOnInit() {
  // Context is automatically initialized after Keycloak
  // No need to manually call resolveTicketContext
}

getTicketContext() {
  return this.hcclContextService.getContext();
}
```

### From Shell Component

**Before:**
```typescript
private ticketContext: HcclUserContextGETData | null = null;

// In Keycloak event handler
this.hcclService.resolveTicketContext('').subscribe((ticketContext: HcclUserContextGETData) => {
  this.ticketContext = ticketContext;
});

public getTicketContext(): HcclUserContextGETData | null {
  return this.ticketContext;
}
```

**After:**
```typescript
// In Keycloak event handler
this.hcclContextService.initializeContext('').subscribe((ticketContext: HcclUserContextGETData) => {
  // Context is now managed by the service
});

public getTicketContext(): HcclUserContextGETData | null {
  return this.hcclContextService.getContext();
}
```

## Integration with Keycloak

The service is designed to be initialized after Keycloak authentication is complete. In the shell component:

```typescript
// Keycloak Event
effect(() => {
  const keycloakEvent = this.keycloakSignal();

  if (keycloakEvent.type === KeycloakEventType.Ready) {
    // Initialize HCCL context after Keycloak is ready
    this.hcclContextService.initializeContext('').subscribe((ticketContext: HcclUserContextGETData) => {
      this._router.navigate(['/advocate-dashboard/messages']);
      console.log('Ticket Context:', ticketContext);
    });
  }
});
```

## Error Handling

The service provides comprehensive error handling:

```typescript
// Check for errors
if (this.hcclContextService.error()) {
  console.error('Context error:', this.hcclContextService.error());
}

// Handle initialization errors
this.hcclContextService.initializeContext('').subscribe({
  next: (context) => {
    console.log('Success:', context);
  },
  error: (error) => {
    console.error('Failed to initialize:', error);
  }
});
```

## Testing

The service includes comprehensive unit tests. See `hccl-context.service.spec.ts` for examples of how to test the service.

## Best Practices

1. **Use the service as a singleton**: Don't create multiple instances
2. **Check if ready**: Always check `isReady()` before accessing context data
3. **Handle errors**: Always handle potential errors when initializing or refreshing
4. **Use reactive patterns**: Prefer signals over manual subscriptions when possible
5. **Clear on logout**: Call `clearContext()` when the user logs out
6. **Wait for ready**: Use `waitForReady()` when you need to ensure context is loaded 