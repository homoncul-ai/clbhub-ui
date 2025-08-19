import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-menu-control-data-list-m',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-control-data-list-m.component.html',
  styleUrl: './menu-control-data-list-m.component.scss'
})
export class MenuControlDataListMComponent implements OnInit {
  @Input() menuControlDataList: MenuControlDataList | null = null;
  @Input() placeholder: string = 'Select options...';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false; // if true, checkboxes are read-only and cannot be changed
  @Input() displayMode: string = 'checkbox'; // current mode, will support others in future
  
  @Output() selectionChange = new EventEmitter<MenuControlData[]>();
  
  selectedItems: MenuControlData[] = [];

  ngOnInit(): void {
    // Initialize selected items from menuControlDataList if any are pre-selected
    if (this.menuControlDataList?.menuItems) {
      this.selectedItems = this.menuControlDataList.menuItems.filter(item => item.selected === true);
    }
  }
  
  onSelectionChange(item: MenuControlData, checked: boolean): void {
    // Prevent selection change if component is readonly
    if (this.readonly) {
      return;
    }
    
    if (checked) {
      // Add item to selection if not already present
      if (!this.selectedItems.find(selected => selected.id === item.id)) {
        this.selectedItems = [...this.selectedItems, item];
      }
    } else {
      // Remove item from selection
      this.selectedItems = this.selectedItems.filter(selected => selected.id !== item.id);
    }
    
    this.selectionChange.emit([...this.selectedItems]);
  }
  
  isItemSelected(item: MenuControlData): boolean {
    return this.selectedItems.some(selected => selected.id === item.id);
  }
  
  get menuItems(): MenuControlData[] {
    var x :MenuControlData[] = this.menuControlDataList?.menuItems || [];
    return x;
  }
}
