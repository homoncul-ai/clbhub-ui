import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  TourRegistryEntry,
  getTourGuides,
} from './tour-registry';

@Component({
  selector: 'app-tour-guides-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tour-guides-dashboard.component.html',
  styleUrl: './tour-guides-dashboard.component.scss',
})
export class TourGuidesDashboardComponent {
  tours: TourRegistryEntry[] = getTourGuides();
}
