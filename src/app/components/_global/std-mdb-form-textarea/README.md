# StdMdbFormTextareaComponent

A reusable Angular component for MDB form textarea fields with validation support.

## Usage

```html
<app-std-mdb-form-textarea 
  prefix="providerTypeRef" 
  name="description"
  label="administration_description_label"
  [rows]="4"
  [maxlength]="1024"
  [showCharCounter]="true"
  [helpText]="'admin_descriptionHelp_label'"
  [(ngModel)]="description">
</app-std-mdb-form-textarea>
```

## Input Properties

- `prefix`: string - Prefix for the field name (e.g., "providerTypeRef")
- `name`: string - Field name (e.g., "description")
- `label`: string - Translation key for the label
- `required`: boolean - Whether the field is required (default: false)
- `disabled`: boolean - Whether the field is disabled (default: false)
- `readonly`: boolean - Whether the field is read-only (default: false)
- `rows`: number - Number of rows for the textarea (default: 4)
- `maxlength`: number | null - Maximum length for the input (default: null)
- `placeholder`: string - Placeholder text (default: "")
- `error`: any - Error object for validation display
- `showRequiredIndicator`: boolean - Show required indicator (default: true)
- `showErrorIndicator`: boolean - Show error indicator (default: true)
- `showCharCounter`: boolean - Show character counter (default: true)
- `helpText`: string - Help text to display below the field (default: "")

## Output Events

- `valueChange`: EventEmitter<string> - Emitted when the value changes

## Features

- MDB form control styling
- Translation support for labels and help text
- Required field indicators († and *)
- Error message display
- Character counter support
- Help text display
- Two-way data binding with ngModel
- ControlValueAccessor implementation for form integration
- Unique ID generation for accessibility
- Disabled state support
- Read-only state support
- Configurable rows and maxlength
- Vertical resize support

## Example

```typescript
// In your component
export class MyComponent {
  description: string = '';
  error: any = null;
  
  onSubmit() {
    // Handle form submission
  }
}
```

```html
<!-- In your template -->
<form (ngSubmit)="onSubmit()">
  <app-std-mdb-form-textarea 
    prefix="myForm" 
    name="description"
    label="Description"
    [rows]="6"
    [maxlength]="500"
    [showCharCounter]="true"
    [helpText]="'Enter a detailed description'"
    [error]="error"
    [(ngModel)]="description">
  </app-std-mdb-form-textarea>
</form>
```

## Differences from StdMdbFormTextComponent

- Uses `<textarea>` instead of `<input type="text">`
- Supports `rows` property for height configuration
- Includes character counter by default
- Supports help text display
- Optimized for multi-line text input
- Vertical resize enabled 