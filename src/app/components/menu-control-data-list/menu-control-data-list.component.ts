import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuControlDataList, MenuControlData } from '../../restsvc/hccl.interfaces';

@Component({
  selector: 'app-menu-control-data-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-control-data-list.component.html',
  styleUrl: './menu-control-data-list.component.scss'
})
export class MenuControlDataListComponent {
  @Input() menuControlDataList: MenuControlDataList | null = null;
  @Input() placeholder: string = 'Select an option...';
  @Input() disabled: boolean = false;
  
  @Output() selectionChange = new EventEmitter<MenuControlData | null>();
  
  selectedItem: MenuControlData | null = null;
  
  onSelectionChange(event: any): void {
    const selectedId = event.target.value;
    if (selectedId && this.menuControlDataList?.menuItems) {
      this.selectedItem = this.menuControlDataList.menuItems.find(item => item.id === selectedId) || null;
      this.selectionChange.emit(this.selectedItem);
    } else {
      this.selectedItem = null;
      this.selectionChange.emit(null);
    }
  }
  
  get menuItems(): MenuControlData[] {
    return this.menuControlDataList?.menuItems || [];
  }
}
