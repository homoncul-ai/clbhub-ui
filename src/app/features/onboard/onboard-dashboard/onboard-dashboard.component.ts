import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OnboardPublicHeaderComponent } from '../components/onboard-public-header.component';

@Component({
  selector: 'app-onboard-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, OnboardPublicHeaderComponent],
  templateUrl: './onboard-dashboard.component.html',
  styleUrl: './onboard-dashboard.component.scss',
})
export class OnboardDashboardComponent {}
