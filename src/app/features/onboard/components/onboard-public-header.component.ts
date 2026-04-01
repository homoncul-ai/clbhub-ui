import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-onboard-public-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './onboard-public-header.component.html',
  styleUrl: './onboard-public-header.component.scss',
})
export class OnboardPublicHeaderComponent {}
