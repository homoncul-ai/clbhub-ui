import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-surveys-public-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './surveys-public-header.component.html',
  styleUrl: './surveys-public-header.component.scss',
})
export class SurveysPublicHeaderComponent {}
