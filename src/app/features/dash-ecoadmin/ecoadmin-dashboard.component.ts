import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface KeyMetric {
  metric: string;
  target: string;
  trackingMethod: string;
  icon: string;
}

@Component({
  selector: 'app-ecoadmin-dashboard',
  templateUrl: './ecoadmin-dashboard.component.html',
  styleUrl: './ecoadmin-dashboard.component.scss',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class EcoAdminDashboardComponent {
  keyMetrics: KeyMetric[] = [
    { metric: 'Student signups', target: '500+', trackingMethod: 'Dashboard count', icon: 'fas fa-user-graduate' },
    { metric: 'Opportunities listed', target: '200+', trackingMethod: 'Provider catalog', icon: 'fas fa-briefcase' },
    { metric: 'Placement rate', target: '20%+', trackingMethod: 'Hired/accepted status', icon: 'fas fa-handshake' },
    { metric: 'Completion rate', target: '80%+', trackingMethod: 'End-of-summer check-ins', icon: 'fas fa-check-circle' },
    { metric: 'Feedback NPS', target: '7+', trackingMethod: 'Post-placement surveys', icon: 'fas fa-star' },
    { metric: 'Provider retention', target: '70%+', trackingMethod: 'Returning listings', icon: 'fas fa-redo' }
  ];
} 