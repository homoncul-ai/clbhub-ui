import { CommonModule } from '@angular/common';
import { DateGETData } from './../../../restsvc/currency.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dategetdata-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dategetdata-display.component.html',
  styleUrl: './dategetdata-display.component.scss'
})
export class DategetdataDisplayComponent implements OnInit {
  @Input() data?: DateGETData ;
  @Input() modeName: string = "date";

  displayText: string = "";
  constructor() {
  }


  ngOnInit(): void {
  //  debugger
    if (this.data) {
      switch (this.modeName) {
        case "date":
          this.displayText = this.data.formattedDate || "";
          break;
        case "datetime":
          this.displayText = this.data.formattedDateTime ||"" ;
          break;
        default: 
          this.displayText = "Invalid mode or no date data";
          break;
      }
    }
  }
}
