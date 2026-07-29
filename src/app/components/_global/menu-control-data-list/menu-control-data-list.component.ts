import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef, forwardRef, inject } from '@angular/core';
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
export class MenuControlDataListComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() menuControlDataList: MenuControlDataList | null = null;
  /** When set, selects this menu item id without treating it as a user-initiated change. */
  @Input() selectedId: string | null = null;
  @Input() placeholder: string = 'Select an option...';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  
  @Output() selectionChange = new EventEmitter<MenuControlData | null>();
  
  selectedItem: MenuControlData | null = null;
  value: string = '';

  private cdr = inject(ChangeDetectorRef);
  private onChange = (value: string) => {};
  private onTouched = () => {};
  private suppressEmptyClear = false;

  ngOnInit(): void {
    this.syncSelectionFromMenu(false);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['menuControlDataList'] || changes['selectedId']) {
      this.syncSelectionFromMenu(false);
    }
  }

  writeValue(value: string): void {
    this.value = value || '';
    this.selectedItem = this.findItem(this.value);
    this.cdr.detectChanges();
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
    if (this.readonly) {
      return;
    }

    // Native <select> can emit "" while options are still rendering; don't clear an authoritative selection.
    if (!newValue && (this.selectedId || this.suppressEmptyClear)) {
      this.value = this.selectedId || this.value;
      this.cdr.detectChanges();
      return;
    }
    
    this.value = newValue || '';
    this.selectedItem = this.findItem(this.value);
    this.onChange(this.value);
    this.selectionChange.emit(this.selectedItem);
  }

  onBlur(): void {
    this.onTouched();
  }

  private syncSelectionFromMenu(emitChange: boolean): void {
    const items = this.menuControlDataList?.menuItems;
    if (!items?.length) {
      return;
    }

    const preferredId = this.selectedId || this.value;
    const selected =
      (preferredId ? items.find(item => item.id === preferredId) : undefined) ||
      items.find(item => item.selected === true);

    if (!selected?.id) {
      return;
    }

    this.suppressEmptyClear = true;
    this.value = selected.id;
    this.selectedItem = selected;
    this.cdr.detectChanges();

    // Allow empty clears again after options have had a chance to bind.
    setTimeout(() => {
      this.suppressEmptyClear = false;
    }, 0);

    if (emitChange) {
      this.onChange(this.value);
      this.selectionChange.emit(selected);
    }
  }

  private findItem(id: string): MenuControlData | null {
    if (!id || !this.menuControlDataList?.menuItems) {
      return null;
    }
    return this.menuControlDataList.menuItems.find(item => item.id === id) || null;
  }
  
  get menuItems(): MenuControlData[] {
    return this.menuControlDataList?.menuItems || [];
  }
}
