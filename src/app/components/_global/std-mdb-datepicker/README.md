# Std MDB Datepicker Component

A reusable Angular date picker component built with MDB Bootstrap and angular-mydatepicker.

## Features

- ✅ ControlValueAccessor implementation for reactive forms
- ✅ Translation support
- ✅ Error handling and validation display
- ✅ Required field indicators
- ✅ Help text support
- ✅ Disabled state support
- ✅ Customizable date format (MM/DD/YYYY by default)
- ✅ Calendar icon for easy date selection
- ✅ Responsive design

## Usage

### Basic Usage

```html
<app-std-mdb-datepicker
  name="dateDue"
  label="administration_dateDue_label"
  placeholder="MM/DD/YYYY">
</app-std-mdb-datepicker>
```

### With Reactive Forms

```typescript
// In your component
export class YourComponent {
  form = new FormGroup({
    dateDue: new FormControl('')
  });
}
```

```html
<form [formGroup]="form">
  <app-std-mdb-datepicker
    name="dateDue"
    label="administration_dateDue_label"
    placeholder="MM/DD/YYYY">
  </app-std-mdb-datepicker>
</form>
```

### With Error Handling

```html
<app-std-mdb-datepicker
  name="dateDue"
  label="administration_dateDue_label"
  [error]="formErrors"
  [showErrorIndicator]="true">
</app-std-mdb-datepicker>
```

### With Value Change Event

```html
<app-std-mdb-datepicker
  name="dateDue"
  label="administration_dateDue_label"
  (valueChange)="onDateChanged($event)">
</app-std-mdb-datepicker>
```

```typescript
onDateChanged(newValue: string) {
  console.log('Date changed to:', newValue);
  // Handle the date change
}
```

### With Required Field

```html
<app-std-mdb-datepicker
  name="dateDue"
  label="administration_dateDue_label"
  [required]="true"
  [showRequiredIndicator]="true">
</app-std-mdb-datepicker>
```

### With Help Text

```html
<app-std-mdb-datepicker
  name="dateDue"
  label="administration_dateDue_label"
  helpText="Enter the due date in MM/DD/YYYY format">
</app-std-mdb-datepicker>
```

### With Disabled State

```html
<app-std-mdb-datepicker
  name="dateDue"
  label="administration_dateDue_label"
  [disabled]="true">
</app-std-mdb-datepicker>
```

## Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `prefix` | string | '' | Prefix for field name |
| `name` | string | '' | Field name |
| `label` | string | '' | Label text (supports translation) |
| `required` | boolean | false | Whether field is required |
| `disabled` | boolean | false | Whether field is disabled |
| `placeholder` | string | 'MM/DD/YYYY' | Placeholder text |
| `error` | any | null | Error object for validation |
| `showRequiredIndicator` | boolean | true | Show required field indicator |
| `showErrorIndicator` | boolean | true | Show error messages |
| `helpText` | string | '' | Help text below the field |

## Output Events

| Event | Type | Description |
|-------|------|-------------|
| `valueChange` | EventEmitter<string> | Emitted when the date value changes |

## Dependencies

- `@angular/forms`
- `mdb-angular-ui-kit`
- `@ngx-translate/core`

## Installation

No additional dependencies required. The component uses native HTML input with custom styling.

## Styling

The component uses Bootstrap classes and includes custom SCSS for the date picker styling. The calendar icon uses Font Awesome (`fa fa-calendar`).

## Notes

- The component implements `ControlValueAccessor` for seamless integration with Angular reactive forms
- The component uses a simple text input with MM/DD/YYYY format
- The calendar icon focuses the input field when clicked
- Error messages are displayed below the input field when validation fails
- For advanced date picker functionality, consider using a different date picker library 