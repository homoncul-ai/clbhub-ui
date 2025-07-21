import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Reference } from '../../../restsvc/hccl.service';

@Component({
  selector: 'app-reference-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reference-data.component.html',
  styleUrl: './reference-data.component.scss'
})
export class ReferenceDataComponent implements OnInit {
  @Input() data?: Reference;
  @Input() modeName: string = "display";

  displayText: string = "";
  hasLink: boolean = false;

  constructor() {
  }

  ngOnInit(): void { 
    if (this.data) {
      this.displayText = this.data.name || "";
      this.hasLink = !!(this.data.link && this.data.link.trim());
    }
  }

  getDisplayText(): string {
    return this.displayText;
  }

  getLink(): string {
    return this.data?.link || "";
  }

  hasValidLink(): boolean {
    return this.hasLink;
  }
} 