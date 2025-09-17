import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-simple-buttonbar',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './simple-buttonbar.component.html',
  styleUrl: './simple-buttonbar.component.scss'
})
export class SimpleButtonbarComponent implements OnInit {
  ngOnInit(): void {
  //    alert('SimpleButtonbarComponent ngOnInit ' + this.currentButtonId + ' ' + this.buttons.length);
  }

  @Input() buttonBar: SimpleButtonBar = new SimpleButtonBar(); 
  @Input() displayMode: string = 'buttons'; // 'buttons', 'tabs', or 'select'
  @Input() alertMsg: string = '';
  @Output() buttonSelected = new EventEmitter<string>();
  @Input() placeholder: string = 'Select an option...';

  public selectButton(id: string): void {
    this.buttonSelected.emit(id);
    if (this.alertMsg !== '') {
      alert(this.alertMsg + " " + id);
    }
    this.buttonBar?.getButton(id)?.activate(null);
  }

  public onDropdownChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedId = target.value;
    if (selectedId && selectedId !== '') {
      this.selectButton(selectedId);
      // Reset dropdown to placeholder
      target.value = '';
    }
  }
 
}

export class SimpleButtonBar {
  public buttons: SimpleButton[] = [];
  public hidingButtonBar: boolean = false;
  removeButton(button: SimpleButton): void {
    if (this.buttons) {
      this.buttons = this.buttons.filter(b => b.id !== button.id);
    }
  }
  getButton(id: string): SimpleButton | undefined {
    if (this.buttons) {
      return this.buttons.find(b => b.id === id);
    }
    return undefined;
  }
  
  hasButton(id: string): boolean {
    return this.getButton(id) !== undefined;
  }

  addButton(id: string, label: string, activateFunction?: (data?: any) => void): SimpleButton {
    if (activateFunction == null) {
      activateFunction = (data?: any ) => {alert('Empty Activate Function for ' + id + ' ' + label);};
    }
    var b : SimpleButton = new SimpleButton(id, label, activateFunction, () => {return true});
    this.buttons.push(b);
    return b;
  }

  isHidingButtonBar(): boolean {
    if ( this.hidingButtonBar) {
      return true;
    }

    // if all buttons are not showing, return true
   
    var x = false;
    this.buttons.forEach(element => {
      if (element.showingButtonFunction()) {
       x = true;
      }
    });
    return x;
    return false;
    }
  
}

export class SimpleButton {
  id: string;
  label: string;
  activateFunction: (data: any) => void;
  showingButtonFunction: () => boolean; 

  constructor(id: string, label: string,  activateFunction: (data?: any) => void, showingButtonFunction: () => boolean) {
    this.id = id;
    this.label = label; 
    this.activateFunction = activateFunction;
    this.showingButtonFunction = showingButtonFunction;
  }

  public activate(data?: any): void {
    this.activateFunction(data);
  }

  public deactivate(): void {
    this.activateFunction = () => {
      console.log('activateFunction not set' + this.id);
    };
  }
}
