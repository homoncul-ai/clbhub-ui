import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HcclContextService } from '@app/shell/services/hccl-context.service';
import { HcclService, HcclUserProfileGETData, StudentDashUIGETData } from '@app/restsvc/hccl.service';
import { StdCalendarComponent, CalendarEvent, CalendarDateClickEvent, CalendarEventClickEvent } from '@app/components/_global/std-calendar/std-calendar.component';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-dash-student-calendar',
  standalone: true,
  imports: [CommonModule, StdCalendarComponent],
  template: `
    <div class="container-fluid py-4">
      <div class="row">
        <div class="col-12">
          <!-- Header Section -->
          <div class="page-header mb-4">
            <div class="header-content">
              <div class="header-icon">
                <i class="fas fa-calendar-alt"></i>
              </div>
              <div class="header-text">
                <h1 class="page-title">My Calendar</h1>
                <p class="page-subtitle">Track your appointments, deadlines, and important events</p>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div *ngIf="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 text-muted">Loading your calendar...</p>
          </div>

          <!-- Calendar Card -->
          <div class="row" *ngIf="!loading">
            <div class="col-lg-9">
              <div class="calendar-card">
                <app-std-calendar
                  [events]="calendarEvents"
                  [initialDate]="initialDate"
                  (dateClick)="onDateClick($event)"
                  (eventClick)="onEventClick($event)"
                  (monthChange)="onMonthChange($event)">
                </app-std-calendar>
              </div>
            </div>

            <!-- Sidebar -->
            <div class="col-lg-3">
              <!-- Upcoming Events -->
              <div class="sidebar-card mb-4">
                <div class="sidebar-header">
                  <i class="fas fa-clock me-2"></i>
                  <h5>Upcoming Events</h5>
                </div>
                <div class="sidebar-body">
                  <div class="upcoming-events" *ngIf="upcomingEvents.length > 0">
                    <div class="event-item" *ngFor="let event of upcomingEvents">
                      <div class="event-indicator" [style.background-color]="event.color || '#667eea'"></div>
                      <div class="event-details">
                        <span class="event-title">{{ event.title }}</span>
                        <span class="event-date">{{ formatEventDate(event.start) }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="no-events" *ngIf="upcomingEvents.length === 0">
                    <i class="fas fa-calendar-check"></i>
                    <p>No upcoming events</p>
                    <span class="hint">Events will appear here once they're added to your calendar</span>
                  </div>
                </div>
              </div>

              <!-- Selected Date Info -->
              <div class="sidebar-card" *ngIf="selectedDate">
                <div class="sidebar-header">
                  <i class="fas fa-info-circle me-2"></i>
                  <h5>{{ formatSelectedDate(selectedDate) }}</h5>
                </div>
                <div class="sidebar-body">
                  <div *ngIf="selectedDateEvents.length > 0">
                    <div class="event-item" *ngFor="let event of selectedDateEvents">
                      <div class="event-indicator" [style.background-color]="event.color || '#667eea'"></div>
                      <div class="event-details">
                        <span class="event-title">{{ event.title }}</span>
                        <span class="event-time" *ngIf="!event.allDay">
                          {{ formatEventTime(event.start) }}
                        </span>
                        <span class="event-time" *ngIf="event.allDay">All day</span>
                      </div>
                    </div>
                  </div>
                  <div class="no-events" *ngIf="selectedDateEvents.length === 0">
                    <p>No events on this day</p>
                  </div>
                </div>
              </div>

              <!-- Quick Stats -->
              <div class="sidebar-card mt-4">
                <div class="sidebar-header">
                  <i class="fas fa-chart-bar me-2"></i>
                  <h5>This Month</h5>
                </div>
                <div class="sidebar-body">
                  <div class="stat-row">
                    <span class="stat-label">Total Events</span>
                    <span class="stat-value">{{ getEventsThisMonth() }}</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-label">Upcoming</span>
                    <span class="stat-value">{{ upcomingEvents.length }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      padding: 32px;
      color: white;
      box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .header-icon {
      width: 64px;
      height: 64px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        font-size: 28px;
      }
    }

    .page-title {
      font-size: 28px;
      font-weight: 700;
      margin: 0;
      letter-spacing: -0.5px;
    }

    .page-subtitle {
      margin: 4px 0 0;
      opacity: 0.85;
      font-size: 15px;
    }

    .calendar-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
    }

    .sidebar-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;

      h5 {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: #334155;
      }

      i {
        color: #667eea;
      }
    }

    .sidebar-body {
      padding: 16px 20px;
    }

    .event-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #f1f5f9;

      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      &:first-child {
        padding-top: 0;
      }
    }

    .event-indicator {
      width: 4px;
      height: 100%;
      min-height: 36px;
      border-radius: 2px;
      flex-shrink: 0;
    }

    .event-details {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .event-title {
      font-size: 14px;
      font-weight: 500;
      color: #334155;
    }

    .event-date,
    .event-time {
      font-size: 12px;
      color: #64748b;
    }

    .no-events {
      text-align: center;
      padding: 20px 0;
      color: #64748b;

      i {
        font-size: 32px;
        margin-bottom: 12px;
        opacity: 0.5;
        display: block;
      }

      p {
        margin: 0;
        font-weight: 500;
      }

      .hint {
        font-size: 12px;
        display: block;
        margin-top: 4px;
        opacity: 0.8;
      }
    }

    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #f1f5f9;

      &:last-child {
        border-bottom: none;
      }
    }

    .stat-label {
      font-size: 13px;
      color: #64748b;
    }

    .stat-value {
      font-size: 16px;
      font-weight: 600;
      color: #334155;
    }

    @media (max-width: 991px) {
      .col-lg-3 {
        margin-top: 24px;
      }
    }

    @media (max-width: 768px) {
      .page-header {
        padding: 24px;
      }

      .header-content {
        flex-direction: column;
        text-align: center;
      }

      .page-title {
        font-size: 24px;
      }
    }
  `]
})
export class DashStudentCalendarComponent implements OnInit {
  private hcclContextService = inject(HcclContextService);
  private hcclService = inject(HcclService);

  loading: boolean = true;
  userProfile: HcclUserProfileGETData | null = null;
  dashUIData: StudentDashUIGETData | null = null;
  
  calendarEvents: CalendarEvent[] = [];
  upcomingEvents: CalendarEvent[] = [];
  selectedDate: Date | null = null;
  selectedDateEvents: CalendarEvent[] = [];
  initialDate: Date = new Date();
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();

  constructor() {
    console.log('DashStudentCalendarComponent initialized');
  }

  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Load calendar data
   */
  private loadData(): void {
    this.loading = true;

    this.hcclContextService.waitForReady$().subscribe({
      next: (context) => {
        if (!context || !context.currentUserProfileId) {
          this.loading = false;
          return;
        }

        this.userProfile = context.currentUserProfile || null;

        // Load student dashboard data
        this.hcclService.resolveStudentDashData().pipe(
          catchError(err => {
            console.warn('Error loading student dashboard data:', err);
            return of(null);
          })
        ).subscribe({
          next: (data) => {
            this.dashUIData = data;
            this.loadCalendarEvents();
            this.loading = false;
          },
          error: (err) => {
            console.error('Error loading data:', err);
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error waiting for context:', err);
        this.loading = false;
      }
    });
  }

  /**
   * Load calendar events from various sources
   * This method will be expanded later to include actual events
   */
  private loadCalendarEvents(): void {
    // For now, initialize with empty events
    // Events will be populated later from work requests, deadlines, etc.
    this.calendarEvents = [];
    this.updateUpcomingEvents();
  }

  /**
   * Update upcoming events list
   */
  private updateUpcomingEvents(): void {
    const now = new Date();
    this.upcomingEvents = this.calendarEvents
      .filter(event => new Date(event.start) >= now)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 5);
  }

  /**
   * Handle date click from calendar
   */
  onDateClick(event: CalendarDateClickEvent): void {
    this.selectedDate = event.date;
    this.selectedDateEvents = event.events;
    console.log('Date clicked:', event.date, 'Events:', event.events);
  }

  /**
   * Handle event click from calendar
   */
  onEventClick(event: CalendarEventClickEvent): void {
    console.log('Event clicked:', event.event);
    // Could open a modal or navigate to event details
  }

  /**
   * Handle month change from calendar
   */
  onMonthChange(event: { month: number; year: number }): void {
    this.currentMonth = event.month;
    this.currentYear = event.year;
    console.log('Month changed:', event.month + 1, event.year);
    // Could load events for the new month from backend
  }

  /**
   * Format event date for display
   */
  formatEventDate(date: Date): string {
    const eventDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    };
    return eventDate.toLocaleDateString('en-US', options);
  }

  /**
   * Format event time for display
   */
  formatEventTime(date: Date): string {
    const eventDate = new Date(date);
    return eventDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }

  /**
   * Format selected date for display
   */
  formatSelectedDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  }

  /**
   * Get count of events this month
   */
  getEventsThisMonth(): number {
    return this.calendarEvents.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getMonth() === this.currentMonth && 
             eventDate.getFullYear() === this.currentYear;
    }).length;
  }
}
