import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';

export type BooleanMode = 'checkbox' | 'yesno';

@Component({
  selector: 'app-std-boolean',
  standalone: true,
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule],
  templateUrl: './std-boolean.component.html',
  styleUrl: './std-boolean.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StdBooleanComponent),
      multi: true
    }
  ]
})
export class StdBooleanComponent implements ControlValueAccessor {
  @Input() prefix: string = '';
  @Input() name: string = '';
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() error: any = null;
  @Input() showRequiredIndicator: boolean = true;
  @Input() showErrorIndicator: boolean = true;
  @Input() helpText: string = '';
  @Input() mode: BooleanMode = 'checkbox';
  @Input() yesText: string = 'Yes';
  @Input() noText: string = 'No';
  
  @Output() valueChange = new EventEmitter<boolean>();

  private _value: boolean = false;
  private onChange = (value: boolean) => {};
  private onTouched = () => {};

  uniqueId = `${this.prefix}-${this.name}-${Math.random().toString(36).substr(2, 9)}`;

  get value(): boolean {
    return this._value;
  }

  set value(val: boolean) {
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

  get isCheckboxMode(): boolean {
    return this.mode === 'checkbox';
  }

  get isYesNoMode(): boolean {
    return this.mode === 'yesno';
  }

  writeValue(value: boolean): void {
    this._value = value || false;
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
    this.value = event.target.checked;
  }

  onBlur(): void {
    this.onTouched();
  }

  onYesNoChange(newValue: boolean): void {
    this.value = newValue;
  }

  toggleValue(): void {
    if (!this.disabled) {
      this.value = !this.value;
    }
  }
} 