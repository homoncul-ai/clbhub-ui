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
  @Input() displayMode: string = 'buttons'; // 'buttons' or 'tabs'
  @Input() alertMsg: string = '';
  @Output() buttonSelected = new EventEmitter<string>();

  public selectButton(id: string): void {
    this.buttonSelected.emit(id);
    alert(this.alertMsg + " " + id);
    this.buttonBar?.getButton(id)?.activate(null);
  }
 
}

export class SimpleButtonBar {
  public buttons: SimpleButton[] = [];
  
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
