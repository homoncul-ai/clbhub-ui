# StdBubfileComponent

A reusable Angular component for displaying file information with icons, links, and popup details. This component is based on the `std-buba` component but specifically designed for PMFile objects.

## Features

- **File Icon Display**: Shows appropriate icons based on file extension
- **File Information Popup**: Hover over the icon to see detailed file properties
- **File Link**: Click to open the file in a new browser tab
- **Loading States**: Shows loading spinner while fetching file data
- **Error Handling**: Displays error messages if file loading fails
- **Responsive Design**: Adapts to different screen sizes
- **Dark Theme Support**: Automatically adapts to dark mode preferences

## Usage

```html
<app-std-bubfile 
  [entityId]="fileId"
  [showIcon]="true"
  [showLink]="true"
  [showTooltip]="true"
  [cssClass]="custom-class">
</app-std-bubfile>
```

## Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `entityId` | `string` | `''` | The ID of the PMFile to display |
| `showIcon` | `boolean` | `true` | Whether to show the file icon |
| `showLink` | `boolean` | `true` | Whether to make the filename clickable |
| `showTooltip` | `boolean` | `true` | Whether to show popup on hover |
| `cssClass` | `string` | `''` | Additional CSS classes to apply |

## File Icons

The component supports icons for the following file types:

- **PDF**: Red PDF icon
- **Word Documents** (.doc, .docx): Blue Word icon
- **Excel Spreadsheets** (.xls, .xlsx): Green Excel icon
- **PowerPoint Presentations** (.ppt, .pptx): Red PowerPoint icon
- **Text Files** (.txt, .rtf): Gray text icon
- **Images** (.jpg, .jpeg, .png, .gif, .svg): Purple image icon
- **Videos** (.mp4, .avi, .mov): Red video icon
- **Audio** (.mp3, .wav): Green audio icon
- **Archives** (.zip, .rar, .7z): Orange archive icon
- **Generic Files**: Default file icon for unknown extensions

## File Information Popup

When hovering over the file icon, a popup displays:

- File Name
- File Size (formatted in human-readable format)
- MIME Type
- Folder Path
- Access Code
- Availability Status
- Version
- Creation Date
- Last Updated Date

## Methods

### `getFileUrl(): string`

Returns the download URL for the file. Used internally by the component.

### `getFileIcon(): string`

Returns the appropriate icon path based on the file extension.

### `onFileClick(event: Event): void`

Handles file link clicks, opening the file in a new browser tab.

## Styling

The component uses SCSS with the following main classes:

- `.bubfile-wrapper`: Main container
- `.bubfile-content`: Content area with icon and text
- `.bubfile-icon`: File icon styling
- `.bubfile-link`: Clickable file link styling
- `.bubfile-popup`: Popup container and content styling

## Integration

The component integrates with:

- **HcclService**: For loading PMFile data via `getPMFileById()`
- **PMFileGETData**: TypeScript interface for file data structure

## Example

```typescript
// In your component
export class MyComponent {
  fileId = '12345-67890-abcdef';
  
  onFileSelected(fileId: string) {
    this.fileId = fileId;
  }
}
```

```html
<!-- In your template -->
<div class="file-display">
  <app-std-bubfile 
    [entityId]="fileId"
    cssClass="my-file-component">
  </app-std-bubfile>
</div>
```

## Dependencies

- Angular Common Module
- RxJS (for observables)
- HcclService (for PMFile data)
- PMFileGETData interface

## Browser Support

- Modern browsers with ES6+ support
- Responsive design works on mobile and desktop
- Dark theme support for browsers that support `prefers-color-scheme`
- High contrast mode support for accessibility
