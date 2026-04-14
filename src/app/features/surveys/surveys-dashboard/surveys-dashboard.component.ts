import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SurveysPublicHeaderComponent } from '../components/surveys-public-header.component';

@Component({
  selector: 'app-surveys-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SurveysPublicHeaderComponent],
  templateUrl: './surveys-dashboard.component.html',
  styleUrl: './surveys-dashboard.component.scss',
})
export class SurveysDashboardComponent {}
