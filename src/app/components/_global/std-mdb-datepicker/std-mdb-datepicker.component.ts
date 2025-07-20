import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-std-mdb-datepicker',
  standalone: true,
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule],
  templateUrl: './std-mdb-datepicker.component.html',
  styleUrl: './std-mdb-datepicker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StdMdbDatepickerComponent),
      multi: true
    }
  ]
})
export class StdMdbDatepickerComponent implements ControlValueAccessor {
  @Input() prefix: string = '';
  @Input() name: string = '';
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() placeholder: string = 'MM/DD/YYYY';
  @Input() error: any = null;
  @Input() showRequiredIndicator: boolean = true;
  @Input() showErrorIndicator: boolean = true;
  @Input() helpText: string = '';
  
  @Output() valueChange = new EventEmitter<string>();

  private _value: string = '';
  private onChange = (value: string) => {};
  private onTouched = () => {};

  uniqueId = `${this.prefix}-${this.name}-${Math.random().toString(36).substr(2, 9)}`;

  get value(): string {
    return this._value;
  }

  set value(val: string) {
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

  writeValue(value: string): void {
    this._value = value || '';
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
    this.value = event.target.value;
  }

  onBlur(): void {
    this.onTouched();
  }

  onFocus(event: any): void {
    // Handle focus event if needed
  }

  toggleCalendar(): void {
    // For now, just focus the input
    const input = document.getElementById(this.uniqueId);
    if (input) {
      input.focus();
    }
  }
} 