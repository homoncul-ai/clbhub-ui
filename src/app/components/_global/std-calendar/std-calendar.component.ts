import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  allDay?: boolean;
  color?: string;
  data?: any;
}

export interface CalendarDateClickEvent {
  date: Date;
  events: CalendarEvent[];
}

export interface CalendarEventClickEvent {
  event: CalendarEvent;
  date: Date;
}

@Component({
  selector: 'app-std-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './std-calendar.component.html',
  styleUrls: ['./std-calendar.component.scss']
})
export class StdCalendarComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('calendarContainer') calendarContainer!: ElementRef;
  
  @Input() events: CalendarEvent[] = [];
  @Input() initialDate: Date = new Date();
  
  @Output() dateClick = new EventEmitter<CalendarDateClickEvent>();
  @Output() eventClick = new EventEmitter<CalendarEventClickEvent>();
  @Output() monthChange = new EventEmitter<{ month: number; year: number }>();
  
  currentDate: Date = new Date();
  currentMonth: number = 0;
  currentYear: number = 0;
  
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays: { date: Date; isCurrentMonth: boolean; isToday: boolean; events: CalendarEvent[] }[] = [];
  
  monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor() {}

  ngOnInit(): void {
    this.currentDate = new Date(this.initialDate);
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    this.generateCalendarDays();
  }

  ngAfterViewInit(): void {
    // Calendar is ready - could integrate with dhtmlxCalendar here in the future
    console.log('StdCalendarComponent initialized');
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Generate calendar days for the current month view
   */
  generateCalendarDays(): void {
    this.calendarDays = [];
    
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);
    
    // Get the day of week the month starts on (0 = Sunday)
    const startDayOfWeek = firstDayOfMonth.getDay();
    
    // Add days from previous month to fill the first week
    const prevMonthLastDay = new Date(this.currentYear, this.currentMonth, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(this.currentYear, this.currentMonth - 1, prevMonthLastDay - i);
      this.calendarDays.push({
        date,
        isCurrentMonth: false,
        isToday: this.isToday(date),
        events: this.getEventsForDate(date)
      });
    }
    
    // Add days of current month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(this.currentYear, this.currentMonth, day);
      this.calendarDays.push({
        date,
        isCurrentMonth: true,
        isToday: this.isToday(date),
        events: this.getEventsForDate(date)
      });
    }
    
    // Add days from next month to complete the grid (6 rows x 7 days = 42 cells)
    const remainingDays = 42 - this.calendarDays.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(this.currentYear, this.currentMonth + 1, day);
      this.calendarDays.push({
        date,
        isCurrentMonth: false,
        isToday: this.isToday(date),
        events: this.getEventsForDate(date)
      });
    }
  }

  /**
   * Check if a date is today
   */
  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  /**
   * Get events for a specific date
   */
  getEventsForDate(date: Date): CalendarEvent[] {
    return this.events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  }

  /**
   * Navigate to previous month
   */
  previousMonth(): void {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendarDays();
    this.monthChange.emit({ month: this.currentMonth, year: this.currentYear });
  }

  /**
   * Navigate to next month
   */
  nextMonth(): void {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendarDays();
    this.monthChange.emit({ month: this.currentMonth, year: this.currentYear });
  }

  /**
   * Go to today
   */
  goToToday(): void {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.generateCalendarDays();
    this.monthChange.emit({ month: this.currentMonth, year: this.currentYear });
  }

  /**
   * Handle date click
   */
  onDateClick(day: { date: Date; events: CalendarEvent[] }): void {
    this.dateClick.emit({
      date: day.date,
      events: day.events
    });
  }

  /**
   * Handle event click
   */
  onEventClick(event: CalendarEvent, date: Date, clickEvent: MouseEvent): void {
    clickEvent.stopPropagation();
    this.eventClick.emit({
      event,
      date
    });
  }

  /**
   * Get current month name
   */
  get currentMonthName(): string {
    return this.monthNames[this.currentMonth];
  }
}
