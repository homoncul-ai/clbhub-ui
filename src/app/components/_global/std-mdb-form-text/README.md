# StdMdbFormTextComponent

A reusable Angular component for MDB form text fields with validation support.

## Usage

```html
<app-std-mdb-form-text 
  prefix="providerTypeRef" 
  name="name"
  label="administration_name_label"
  [required]="true"
  [error]="error"
  [(ngModel)]="name">
</app-std-mdb-form-text>
```

## Input Properties

- `prefix`: string - Prefix for the field name (e.g., "providerTypeRef")
- `name`: string - Field name (e.g., "name")
- `label`: string - Translation key for the label
- `required`: boolean - Whether the field is required (default: false)
- `disabled`: boolean - Whether the field is disabled (default: false)
- `autocomplete`: string - Autocomplete attribute (default: "off")
- `maxlength`: number | null - Maximum length for the input (default: null)
- `placeholder`: string - Placeholder text (default: "")
- `error`: any - Error object for validation display
- `showRequiredIndicator`: boolean - Show required indicator (default: true)
- `showErrorIndicator`: boolean - Show error indicator (default: true)

## Output Events

- `valueChange`: EventEmitter<string> - Emitted when the value changes

## Features

- MDB form control styling
- Translation support for labels
- Required field indicators († and *)
- Error message display
- Two-way data binding with ngModel
- ControlValueAccessor implementation for form integration
- Unique ID generation for accessibility
- Disabled state support
- Maxlength support
- Placeholder support

## Example

```typescript
// In your component
export class MyComponent {
  name: string = '';
  error: any = null;
  
  onSubmit() {
    // Handle form submission
  }
}
```

```html
<!-- In your template -->
<form (ngSubmit)="onSubmit()">
  <app-std-mdb-form-text 
    prefix="myForm" 
    name="name"
    label="Name"
    [required]="true"
    [error]="error"
    [(ngModel)]="name">
  </app-std-mdb-form-text>
</form>
``` 