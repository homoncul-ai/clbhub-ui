import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-simple-buttonbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './simple-buttonbar.component.html',
  styleUrl: './simple-buttonbar.component.scss'
})
export class SimpleButtonbarComponent implements OnInit {
  ngOnInit(): void {
  //    alert('SimpleButtonbarComponent ngOnInit ' + this.currentButtonId + ' ' + this.buttons.length);
  }

  @Input() buttons: SimpleButton[] | null = null;
  @Input() currentButtonId: string | null = null;
  @Input() displayMode: string = 'buttons'; // 'buttons' or 'tabs'

  @Output() buttonSelected = new EventEmitter<string>();


  public addButton(button: SimpleButton): void {
    if (this.buttons) {
      this.buttons.push(button);
    }
  }

  public removeButton(button: SimpleButton): void {
    if (this.buttons) {
      this.buttons = this.buttons.filter(b => b.id !== button.id);
    }
  }

  public getButton(id: string): SimpleButton | undefined {
    if (this.buttons) {
      return this.buttons.find(b => b.id === id);
    }
    return undefined;
  }

  
  get currentButton(): SimpleButton | undefined {
    return this.currentButtonId ? this.getButton(this.currentButtonId) : undefined;
  }

  public selectButton(id: string): void {
    this.buttonSelected.emit(id);
    this.getButton(id)?.activate(null);
  }

  public isActivated(id: string): boolean {
    return this.currentButtonId === id;
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
