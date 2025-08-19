import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuControlDataList, MenuControlData } from '@app/restsvc/hccl.service';

@Component({
  selector: 'app-menu-control-data-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-control-data-list.component.html',
  styleUrl: './menu-control-data-list.component.scss'
})
export class MenuControlDataListComponent implements OnInit {
  @Input() menuControlDataList: MenuControlDataList | null = null;
  @Input() placeholder: string = 'Select an option...';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false; // if true, dropdown is read-only and cannot be changed
  
  @Output() selectionChange = new EventEmitter<MenuControlData | null>();
  
  selectedItem: MenuControlData | null = null;

  ngOnInit(): void {
  }
  
  onSelectionChange(event: any): void {
    // Prevent selection change if component is readonly
    if (this.readonly) {
      return;
    }
    
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
    var x :MenuControlData[] = this.menuControlDataList?.menuItems || [];
    return x;
  }
}
