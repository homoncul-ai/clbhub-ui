import { Component, Input, Output, EventEmitter, forwardRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-std-mdb-integer',
  standalone: true,
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule],
  templateUrl: './std-mdb-integer.component.html',
  styleUrl: './std-mdb-integer.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StdMdbIntegerComponent),
      multi: true
    }
  ]
})
export class StdMdbIntegerComponent implements ControlValueAccessor, OnInit, OnChanges {
  @Input() prefix: string = '';
  @Input() name: string = '';
  @Input() label: string = 'Integer';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() placeholder: string = 'Enter integer value';
  @Input() error: any = null;
  @Input() showRequiredIndicator: boolean = true;
  @Input() showErrorIndicator: boolean = true;
  @Input() helpText: string = '';
  @Input() integerText: string = '';
  @Input() min: number | null = null;
  @Input() max: number | null = null;
  @Input() step: number = 1;
  @Output() valueChange = new EventEmitter<number | null>();

  private _value: number | null = null;
  private onChange = (value: number | null) => {};
  private onTouched = () => {};

  uniqueId = `${this.prefix}-${this.name}-${Math.random().toString(36).substr(2, 9)}`;

  ngOnInit(): void {
    // Initialize with integerText if provided
    if (this.integerText && this._value === null) {
      const parsedValue = this.parseInteger(this.integerText);
      if (parsedValue !== null) {
        this.value = parsedValue;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Handle updates to integerText input
    if (changes['integerText'] && changes['integerText'].currentValue && !changes['integerText'].firstChange) {
      const parsedValue = this.parseInteger(changes['integerText'].currentValue);
      if (parsedValue !== null) {
        this.value = parsedValue;
      }
    }
  }

  get value(): number | null {
    return this._value;
  }

  set value(val: number | null) {
    this._value = val;
    this.onChange(val);
    this.valueChange.emit(val);
  }

  get fieldName(): string {
    return `${this.prefix}-${this.name}`;
  }

  get hasError(): boolean {
    return this.error && this.error[this.name] && this.error[this.name].errorMessage;
  }

  get errorMessage(): string {
    return this.hasError ? this.error[this.name].errorMessage : '';
  }

  get displayValue(): string {
    return this._value !== null ? this._value.toString() : '';
  }

  // Parse integer from string input
  private parseInteger(value: string | number): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    
    const parsed = typeof value === 'number' ? value : parseInt(value.toString(), 10);
    
    if (isNaN(parsed)) {
      return null;
    }
    
    return parsed;
  }

  // Validate integer value against min/max constraints
  private validateInteger(value: number): number {
    if (this.min !== null && value < this.min) {
      return this.min;
    }
    if (this.max !== null && value > this.max) {
      return this.max;
    }
    return value;
  }

  writeValue(value: number | null): void {
    this._value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: any): void {
    const input = event.target.value;
    // Allow only digits, minus sign at the beginning, and empty string
    const cleaned = input.replace(/[^\d\-]/g, '');
    
    // Ensure minus sign is only at the beginning
    const parts = cleaned.split('-');
    if (parts.length > 2) {
      // Multiple minus signs, keep only the first one
      const finalValue = '-' + parts.slice(1).join('');
      event.target.value = finalValue;
    }
    
    const parsedValue = this.parseInteger(cleaned);
    if (parsedValue !== null) {
      const validatedValue = this.validateInteger(parsedValue);
      this.value = validatedValue;
    } else if (cleaned === '' || cleaned === '-') {
      this.value = null;
    }
  }

  onBlur(): void {
    this.onTouched();
    // Validate and format the integer when leaving the field
    if (this._value !== null) {
      const validatedValue = this.validateInteger(this._value);
      if (validatedValue !== this._value) {
        this.value = validatedValue;
      }
    }
  }

  onFocus(event: any): void {
    // Select all text when focusing on the input
    event.target.select();
  }

  onKeyDown(event: KeyboardEvent): void {
    // Allow: backspace, delete, tab, escape, enter, home, end, left, right
    if ([8, 9, 27, 13, 46, 35, 36, 37, 39].indexOf(event.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (event.keyCode === 65 && event.ctrlKey === true) ||
        (event.keyCode === 67 && event.ctrlKey === true) ||
        (event.keyCode === 86 && event.ctrlKey === true) ||
        (event.keyCode === 88 && event.ctrlKey === true)) {
      return;
    }
    
    // Ensure that it is a number and stop the keypress
    if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && 
        (event.keyCode < 96 || event.keyCode > 105) && 
        event.keyCode !== 189) { // Allow minus sign
      event.preventDefault();
    }
  }
}
