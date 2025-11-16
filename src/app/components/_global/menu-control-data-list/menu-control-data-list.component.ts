import { Component, Input, Output, EventEmitter, OnInit, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-menu-control-data-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-control-data-list.component.html',
  styleUrl: './menu-control-data-list.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MenuControlDataListComponent),
      multi: true
    }
  ]
})
export class MenuControlDataListComponent implements OnInit, ControlValueAccessor {
  @Input() menuControlDataList: MenuControlDataList | null = null;
  @Input() placeholder: string = 'Select an option...';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false; // if true, dropdown is read-only and cannot be changed
  
  @Output() selectionChange = new EventEmitter<MenuControlData | null>();
  
  selectedItem: MenuControlData | null = null;
  private _value: string = '';
  private onChange = (value: string) => {};
  private onTouched = () => {};

  ngOnInit(): void {
  }
  
  get value(): string {
    return this._value;
  }

  set value(val: string) {
    if (this._value !== val) {
      this._value = val || '';
      this.updateSelectedItem();
    }
  }

  writeValue(value: string): void {
    // Only update if value actually changed to avoid infinite loops
    if (this._value !== (value || '')) {
      this._value = value || '';
      this.updateSelectedItem();
    }
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
  
  onValueChange(newValue: string): void {
    // Prevent selection change if component is readonly
    if (this.readonly) {
      return;
    }
    
    const selectedId = newValue || '';
    this._value = selectedId;
    this.updateSelectedItem();
    this.onChange(selectedId);
  }

  onBlur(): void {
    this.onTouched();
  }

  private updateSelectedItem(): void {
    if (this._value && this.menuControlDataList?.menuItems) {
      this.selectedItem = this.menuControlDataList.menuItems.find(item => item.id === this._value) || null;
      this.selectionChange.emit(this.selectedItem);
    } else {
      this.selectedItem = null;
      this.selectionChange.emit(null);
    }
  }
  
  get menuItems(): MenuControlData[] {
    var x :MenuControlData[] = this.menuControlDataList?.menuItems || [];
    return x;
  }
}
