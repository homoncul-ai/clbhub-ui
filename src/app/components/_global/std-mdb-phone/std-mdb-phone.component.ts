import { Component, Input, Output, EventEmitter, forwardRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-std-mdb-phone',
  standalone: true,
  imports: [CommonModule, FormsModule, MdbFormsModule, TranslateModule],
  templateUrl: './std-mdb-phone.component.html',
  styleUrl: './std-mdb-phone.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StdMdbPhoneComponent),
      multi: true
    }
  ]
})
export class StdMdbPhoneComponent implements ControlValueAccessor, OnInit, OnChanges {
  @Input() prefix: string = '';
  @Input() name: string = '';
  @Input() label: string = 'Phone';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() placeholder: string = '(123) 456-7890';
  @Input() error: any = null;
  @Input() showRequiredIndicator: boolean = true;
  @Input() showErrorIndicator: boolean = true;
  @Input() helpText: string = '';
  @Input() phoneText: string = '';
  @Output() valueChange = new EventEmitter<string>();

  private _value: string = '';
  private onChange = (value: string) => {};
  private onTouched = () => {};

  uniqueId = `${this.prefix}-${this.name}-${Math.random().toString(36).substr(2, 9)}`;

  ngOnInit(): void {
    // Initialize with phoneText if provided
    if (this.phoneText && !this._value) {
      this.value = this.phoneText;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Handle updates to phoneText input
    if (changes['phoneText'] && changes['phoneText'].currentValue && !changes['phoneText'].firstChange) {
      this.value = changes['phoneText'].currentValue;
    }
  }

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

  get formattedPhone(): string {
    return this.formatPhoneNumber(this._value);
  }

  // Format phone number to (123) 456-7890 format
  private formatPhoneNumber(phone: string): string {
    if (!phone) return '';
    
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Check if we have a valid phone number
    if (cleaned.length === 0) return '';
    if (cleaned.length < 10) return phone; // Return as-is if too short
    
    // Format as (XXX) XXX-XXXX
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    
    // If it doesn't match the expected format, return as-is
    return phone;
  }

  // Parse phone number from formatted string
  private parsePhoneNumber(phone: string): string {
    if (!phone) return '';
    
    // Remove all non-digit characters
    return phone.replace(/\D/g, '');
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
    const input = event.target.value;
    // Allow only digits, spaces, parentheses, and hyphens
    const cleaned = input.replace(/[^\d\s\(\)\-]/g, '');
    this.value = cleaned;
  }

  onBlur(): void {
    this.onTouched();
    // Format the phone number when leaving the field
    if (this._value) {
      const formatted = this.formatPhoneNumber(this._value);
      if (formatted !== this._value) {
        this.value = formatted;
      }
    }
  }

  onFocus(event: any): void {
    // Select all text when focusing on the input
    event.target.select();
  }
}