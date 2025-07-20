import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-available-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './available-selector.component.html',
  styleUrl: './available-selector.component.scss'
})
export class AvailableSelectorComponent {
  // This component is used to display a property called available commonly used in 
  // the hccl.service.ts file. 
  // if available is 1 or greater, then check the checkbox
  // if available is 0, then uncheck the checkbox
  // if available is a boolean display as if it's 1 or 0
  // Have a function passed in to handle the change of the checkbox
  // similar to the menu-control-data-list component

  @Input() available: number | boolean = 0;
  @Input() disabled: boolean = false;
  @Input() label: string = 'Available';
  
  @Output() availableChange = new EventEmitter<number>();
  
  uniqueId = 'available-' + Math.random().toString(36).substr(2, 9);
  
  get isChecked(): boolean {
    if (typeof this.available === 'boolean') {
      return this.available;
    }
    return this.available >= 1;
  }
  
  onCheckboxChange(event: any): void {
    const isChecked = event.target.checked;
    const newValue = isChecked ? 1 : 0;
    this.availableChange.emit(newValue);
  }
}
