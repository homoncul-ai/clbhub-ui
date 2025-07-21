# Reference Data Component

A reusable Angular component for displaying reference data with optional links.

## Overview

The `ReferenceDataComponent` displays reference information that may include a name and an optional link. If a link is provided, it will be displayed as a clickable link; otherwise, it will display as plain text.

## Usage

### Basic Usage

```html
<app-reference-data [data]="referenceData"></app-reference-data>
```

### With Reference Data

```typescript
// In your component
referenceData: Reference = {
  name: "John Doe",
  link: "https://example.com/profile/123"
};
```

```html
<!-- In your template -->
<app-reference-data [data]="referenceData"></app-reference-data>
```

### Without Link

```typescript
// In your component
referenceData: Reference = {
  name: "Jane Smith"
  // No link provided
};
```

```html
<!-- In your template -->
<app-reference-data [data]="referenceData"></app-reference-data>
```

## Input Properties

- `data?: Reference` - The reference data object containing name and optional link
- `modeName: string` - Display mode (defaults to "display")

## Reference Interface

```typescript
interface Reference {
  name?: string;
  link?: string;
}
```

## Features

- **Automatic Link Detection**: If a link is provided, it displays as a clickable link
- **Fallback to Text**: If no link is provided, displays as plain text
- **Accessibility**: Links include proper `target="_blank"` and `rel="noopener noreferrer"` attributes
- **Styling**: Includes hover effects and focus states for better UX

## Examples in the Codebase

The component is used in the HCCL Organization CRUD component to display:
- Created By information
- Last Updated By information

```html
<app-reference-data [data]="getCurrentEntity().getData().createdByInfo"></app-reference-data>
<app-reference-data [data]="getCurrentEntity().getData().lastUpdatedByInfo"></app-reference-data>
``` 