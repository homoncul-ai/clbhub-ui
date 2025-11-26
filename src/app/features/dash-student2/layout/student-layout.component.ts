import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { StudentContextService } from '../shared/student-context.service';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  styleUrls: ['../dash-student2.styles.scss'],
  template: `
    <div class="student-dashboard">
      <div class="sd-container">
        <!-- Welcome Header -->
        <header class="sd-welcome-header">
          <div class="sd-flex sd-flex--between sd-flex--center">
            <div>
              <h1 class="sd-welcome-title">
                {{ getGreeting() }}, {{ studentContext.getDisplayName() }}!
              </h1>
              <p class="sd-welcome-subtitle">
                Welcome to your Career Compass dashboard
              </p>
            </div>
            <div class="sd-avatar sd-avatar--lg">
              {{ studentContext.getInitials() }}
            </div>
          </div>
        </header>

        <!-- Navigation Tabs -->
        <nav class="sd-nav">
          <a 
            class="sd-nav-item" 
            routerLink="home" 
            routerLinkActive="sd-nav-item--active"
            [routerLinkActiveOptions]="{ exact: true }">
            <i class="fas fa-home"></i>
            <span>Home</span>
          </a>
          <a 
            class="sd-nav-item" 
            routerLink="statements" 
            routerLinkActive="sd-nav-item--active">
            <i class="fas fa-file-alt"></i>
            <span>Statements</span>
          </a>
          <a 
            class="sd-nav-item" 
            routerLink="interests" 
            routerLinkActive="sd-nav-item--active">
            <i class="fas fa-heart"></i>
            <span>Interests</span>
          </a>
          <a 
            class="sd-nav-item" 
            routerLink="search" 
            routerLinkActive="sd-nav-item--active">
            <i class="fas fa-search"></i>
            <span>Explore</span>
          </a>
          <a 
            class="sd-nav-item" 
            routerLink="messages" 
            routerLinkActive="sd-nav-item--active">
            <i class="fas fa-envelope"></i>
            <span>Messages</span>
          </a>
          <a 
            class="sd-nav-item" 
            routerLink="guidance" 
            routerLinkActive="sd-nav-item--active">
            <i class="fas fa-life-ring"></i>
            <span>Help</span>
          </a>
          <a 
            class="sd-nav-item" 
            routerLink="progress" 
            routerLinkActive="sd-nav-item--active">
            <i class="fas fa-chart-line"></i>
            <span>Progress</span>
          </a>
        </nav>

        <!-- Page Content -->
        <main class="sd-main">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .sd-welcome-header {
      padding: 1.5rem 0;
      margin-bottom: 1rem;
    }

    .sd-welcome-title {
      font-family: 'DM Sans', sans-serif;
      font-size: 1.75rem;
      font-weight: 700;
      color: #1F2937;
      margin: 0 0 0.25rem 0;
    }

    .sd-welcome-subtitle {
      color: #6B7280;
      margin: 0;
      font-size: 1rem;
    }

    .sd-nav {
      display: flex;
      gap: 0.25rem;
      background: white;
      padding: 0.5rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      margin-bottom: 1.5rem;
      overflow-x: auto;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .sd-nav-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      border-radius: 0.75rem;
      color: #4B5563;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.9375rem;
      transition: all 0.15s ease;
      white-space: nowrap;

      i {
        font-size: 1rem;
      }

      &:hover {
        background: #F3F4F6;
        color: #1F2937;
      }

      &--active {
        background: #2563EB;
        color: white;

        &:hover {
          background: #1D4ED8;
          color: white;
        }
      }
    }

    .sd-main {
      min-height: calc(100vh - 250px);
    }

    @media (max-width: 768px) {
      .sd-welcome-title {
        font-size: 1.5rem;
      }

      .sd-nav-item {
        padding: 0.625rem 1rem;
        font-size: 0.875rem;

        span {
          display: none;
        }

        i {
          font-size: 1.125rem;
        }
      }
    }
  `]
})
export class StudentLayoutComponent implements OnInit {
  studentContext = inject(StudentContextService);

  ngOnInit() {
    // Load dashboard data on init
    this.studentContext.loadDashboardData().subscribe();
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }
}

