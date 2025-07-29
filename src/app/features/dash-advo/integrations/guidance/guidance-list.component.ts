import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CLGuidanceListComponent } from '@app/components/_crud/clguidance/clguidance-list.component';

@Component({
  selector: 'app-guidance-list',
  standalone: true,
  imports: [CommonModule, CLGuidanceListComponent],
  template: '<app-clguidance-list></app-clguidance-list>'
})
export class GuidanceListComponent {
  // This is a wrapper component that simply displays the CLGuidanceListComponent
} 