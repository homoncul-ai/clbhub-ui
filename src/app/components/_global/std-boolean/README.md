# Std Boolean Component

A reusable Angular boolean input component that supports both checkbox and yes/no button modes.

## Features

- ✅ ControlValueAccessor implementation for reactive forms
- ✅ Two display modes: checkbox and yes/no buttons
- ✅ Translation support
- ✅ Error handling and validation display
- ✅ Required field indicators
- ✅ Help text support
- ✅ Disabled state support
- ✅ Customizable yes/no text labels
- ✅ Responsive design

## Usage

### Checkbox Mode (Default)

```html
<app-std-boolean
  name="isActive"
  label="Is Active"
  [value]="true"
  mode="checkbox">
</app-std-boolean>
```

### Yes/No Mode

```html
<app-std-boolean
  name="isActive"
  label="Is Active"
  [value]="true"
  mode="yesno"
  yesText="Active"
  noText="Inactive">
</app-std-boolean>
```

### With Reactive Forms

```typescript
// In your component
export class YourComponent {
  form = new FormGroup({
    isActive: new FormControl(true)
  });
}
```

```html
<form [formGroup]="form">
  <app-std-boolean
    name="isActive"
    label="Is Active"
    mode="yesno">
  </app-std-boolean>
</form>
```

### With Error Handling

```html
<app-std-boolean
  name="isActive"
  label="Is Active"
  [error]="formErrors"
  [showErrorIndicator]="true"
  mode="checkbox">
</app-std-boolean>
```

### With Value Change Event

```html
<app-std-boolean
  name="isActive"
  label="Is Active"
  (valueChange)="onBooleanChanged($event)"
  mode="yesno">
</app-std-boolean>
```

```typescript
onBooleanChanged(newValue: boolean) {
  console.log('Boolean value changed to:', newValue);
  // Handle the boolean change
}
```

### With Required Field

```html
<app-std-boolean
  name="isActive"
  label="Is Active"
  [required]="true"
  [showRequiredIndicator]="true"
  mode="checkbox">
</app-std-boolean>
```

### With Help Text

```html
<app-std-boolean
  name="isActive"
  label="Is Active"
  helpText="Select whether this item is active or not"
  mode="yesno">
</app-std-boolean>
```

### With Disabled State

```html
<app-std-boolean
  name="isActive"
  label="Is Active"
  [disabled]="true"
  mode="checkbox">
</app-std-boolean>
```

## Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `prefix` | string | '' | Prefix for field name |
| `name` | string | '' | Field name |
| `label` | string | '' | Label text (supports translation) |
| `required` | boolean | false | Whether field is required |
| `disabled` | boolean | false | Whether field is disabled |
| `error` | any | null | Error object for validation |
| `showRequiredIndicator` | boolean | true | Show required field indicator |
| `showErrorIndicator` | boolean | true | Show error messages |
| `helpText` | string | '' | Help text below the field |
| `mode` | BooleanMode | 'checkbox' | Display mode: 'checkbox' or 'yesno' |
| `yesText` | string | 'Yes' | Text for yes button (supports translation) |
| `noText` | string | 'No' | Text for no button (supports translation) |

## Output Events

| Event | Type | Description |
|-------|------|-------------|
| `valueChange` | EventEmitter<boolean> | Emitted when the boolean value changes |

## Types

```typescript
export type BooleanMode = 'checkbox' | 'yesno';
```

## Dependencies

- `@angular/forms`
- `mdb-angular-ui-kit`
- `@ngx-translate/core`

## Styling

The component uses Bootstrap classes and includes custom SCSS for:
- Checkbox styling with proper focus states
- Yes/No button group styling
- Error message styling
- Help text styling
- Disabled state styling
- Hover effects

## Notes

- The component implements `ControlValueAccessor` for seamless integration with Angular reactive forms
- Checkbox mode uses standard HTML checkbox input
- Yes/No mode uses Bootstrap button group with radio inputs
- Both modes support translation for labels and yes/no text
- Error messages are displayed below the input when validation fails
- The component is fully accessible with proper ARIA labels 