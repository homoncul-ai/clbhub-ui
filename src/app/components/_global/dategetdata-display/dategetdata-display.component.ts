import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dategetdata-display',
  imports: [],
  templateUrl: './dategetdata-display.component.html',
  styleUrl: './dategetdata-display.component.scss'
})
export class DategetdataDisplayComponent {
  @Input() dateData: any;
}
