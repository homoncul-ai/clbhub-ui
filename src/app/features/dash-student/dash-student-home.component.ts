import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dash-student-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                <i class="fas fa-user-graduate me-2"></i>
                Student Dashboard
              </h3>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6 col-lg-4 mb-4">
                  <div class="card bg-primary text-white">
                    <div class="card-body">
                      <h5 class="card-title">
                        <i class="fas fa-book me-2"></i>
                        My Courses
                      </h5>
                      <p class="card-text">View and manage your enrolled courses</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-lg-4 mb-4">
                  <div class="card bg-success text-white">
                    <div class="card-body">
                      <h5 class="card-title">
                        <i class="fas fa-chart-line me-2"></i>
                        Progress
                      </h5>
                      <p class="card-text">Track your learning progress and achievements</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-lg-4 mb-4">
                  <div class="card bg-info text-white">
                    <div class="card-body">
                      <h5 class="card-title">
                        <i class="fas fa-calendar me-2"></i>
                        Schedule
                      </h5>
                      <p class="card-text">View your upcoming classes and events</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <div class="card">
                    <div class="card-header">
                      <h5>Welcome to Your Student Dashboard</h5>
                    </div>
                    <div class="card-body">
                      <p>This is your personalized student dashboard where you can:</p>
                      <ul>
                        <li>Access your enrolled courses and learning materials</li>
                        <li>Track your academic progress and achievements</li>
                        <li>View your class schedule and upcoming events</li>
                        <li>Connect with instructors and fellow students</li>
                        <li>Access support resources and guidance</li>
                      </ul>
                    </div>
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
    .card {
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
      border: 1px solid rgba(0, 0, 0, 0.125);
    }
    
    .card-header {
      background-color: #f8f9fa;
      border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    }
    
    .bg-primary {
      background-color: #0d6efd !important;
    }
    
    .bg-success {
      background-color: #198754 !important;
    }
    
    .bg-info {
      background-color: #0dcaf0 !important;
    }
  `]
})
export class DashStudentHomeComponent {
  constructor() {
    console.log('DashStudentHomeComponent initialized');
  }
}
