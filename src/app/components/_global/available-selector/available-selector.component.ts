import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-available-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './available-selector.component.html',
  styleUrl: './available-selector.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AvailableSelectorComponent),
      multi: true
    }
  ]
})
export class AvailableSelectorComponent implements ControlValueAccessor {
  // This component is used to display a property called available commonly used in 
  // the hccl.service.ts file. 
  // if available is 1 or greater, then check the checkbox
  // if available is 0, then uncheck the checkbox
  // if available is a boolean display as if it's 1 or 0
  // Have a function passed in to handle the change of the checkbox
  // similar to the menu-control-data-list component

  @Input() disabled: boolean = false;
  @Input() label: string = 'Available';
  @Input() readonly: boolean = false;
  
  @Output() availableChange = new EventEmitter<number>();
  
  private _available: number | boolean = 0;
  private onChange = (value: number) => {};
  private onTouched = () => {};
  
  uniqueId = 'available-' + Math.random().toString(36).substr(2, 9);
  
  get available(): number | boolean {
    return this._available;
  }
  
  set available(value: number | boolean) {
    this._available = value;
    const numericValue = this.convertToNumeric(value);
    this.onChange(numericValue);
    this.availableChange.emit(numericValue);
  }
  
  get isChecked(): boolean {
    console.log(this._available + ' ' + this.readonly);
    if (typeof this._available === 'boolean') {
      return this._available;
    }
    return this._available >= 1;
  }
  
  private convertToNumeric(value: number | boolean): number {
    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }
    return value;
  }
  
  onCheckboxChange(event: any): void {
    if (this.readonly) {
      return; // Prevent changes when readonly
    }
    const isChecked = event.target.checked;
    const newValue = isChecked ? 1 : 0;
    this.available = newValue;
    this.onTouched();
  }

  // ControlValueAccessor implementation
  writeValue(value: number | boolean): void {
    this._available = value || 0;
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
