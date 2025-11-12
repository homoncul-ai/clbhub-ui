import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Dashboard component with 3-column card list (kanban style board)
 */
@Component({
  selector: 'app-dash-cardlist-starter',
  template: `
    <div class="container mt-4">
      <h2>Work Requests Dashboard</h2>
      
      <div class="row">
        <!-- To Do Column -->
        <div class="col-md-4">
          <div class="card mb-3">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">To Do</h5>
            </div>
            <div class="card-body">
              <div class="card mb-2" *ngFor="let item of todoItems">
                <div class="card-body">
                  <h6 class="card-title">{{ item.title }}</h6>
                  <p class="card-text small">{{ item.description }}</p>
                  <span class="badge bg-secondary">{{ item.priority }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- In Progress Column -->
        <div class="col-md-4">
          <div class="card mb-3">
            <div class="card-header bg-warning text-dark">
              <h5 class="mb-0">In Progress</h5>
            </div>
            <div class="card-body">
              <div class="card mb-2" *ngFor="let item of inProgressItems">
                <div class="card-body">
                  <h6 class="card-title">{{ item.title }}</h6>
                  <p class="card-text small">{{ item.description }}</p>
                  <span class="badge bg-warning text-dark">{{ item.priority }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Done Column -->
        <div class="col-md-4">
          <div class="card mb-3">
            <div class="card-header bg-success text-white">
              <h5 class="mb-0">Done</h5>
            </div>
            <div class="card-body">
              <div class="card mb-2" *ngFor="let item of doneItems">
                <div class="card-body">
                  <h6 class="card-title">{{ item.title }}</h6>
                  <p class="card-text small">{{ item.description }}</p>
                  <span class="badge bg-success">{{ item.priority }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./uistarter.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class DashCardlistStarterComponent {
  todoItems = [
    { title: 'Review Application', description: 'Review student application for admission', priority: 'High' },
    { title: 'Update Records', description: 'Update student records in system', priority: 'Medium' },
    { title: 'Schedule Meeting', description: 'Schedule meeting with student advisor', priority: 'Low' }
  ];

  inProgressItems = [
    { title: 'Process Payment', description: 'Process tuition payment for semester', priority: 'High' },
    { title: 'Verify Documents', description: 'Verify submitted documents', priority: 'Medium' }
  ];

  doneItems = [
    { title: 'Complete Registration', description: 'Student registration completed', priority: 'High' },
    { title: 'Send Welcome Email', description: 'Welcome email sent to new student', priority: 'Medium' }
  ];
}

