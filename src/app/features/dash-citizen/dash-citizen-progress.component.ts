import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dash-citizen-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                <i class="fas fa-chart-line me-2"></i>
                My Progress
              </h3>
            </div>
            <div class="card-body">
              <div class="row mb-4">
                <div class="col-md-3">
                  <div class="text-center">
                    <div class="display-4 text-primary">3.8</div>
                    <div class="text-muted">GPA</div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="text-center">
                    <div class="display-4 text-success">85%</div>
                    <div class="text-muted">Overall Progress</div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="text-center">
                    <div class="display-4 text-info">12</div>
                    <div class="text-muted">Credits Earned</div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="text-center">
                    <div class="display-4 text-warning">8</div>
                    <div class="text-muted">Credits Remaining</div>
                  </div>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6">
                  <h5>Recent Achievements</h5>
                  <div class="list-group">
                    <div class="list-group-item">
                      <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">Perfect Score - Midterm Exam</h6>
                        <small class="text-muted">3 days ago</small>
                      </div>
                      <p class="mb-1">Introduction to Computer Science</p>
                    </div>
                    <div class="list-group-item">
                      <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">Project Completion</h6>
                        <small class="text-muted">1 week ago</small>
                      </div>
                      <p class="mb-1">Web Development Fundamentals</p>
                    </div>
                    <div class="list-group-item">
                      <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">Attendance Award</h6>
                        <small class="text-muted">2 weeks ago</small>
                      </div>
                      <p class="mb-1">Perfect attendance this month</p>
                    </div>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <h5>Learning Goals</h5>
                  <div class="list-group">
                    <div class="list-group-item">
                      <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">Complete Data Structures Course</h6>
                        <small class="text-muted">Target: End of Semester</small>
                      </div>
                      <div class="progress">
                        <div class="progress-bar" role="progressbar" style="width: 20%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">20%</div>
                      </div>
                    </div>
                    <div class="list-group-item">
                      <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">Improve GPA to 4.0</h6>
                        <small class="text-muted">Target: End of Semester</small>
                      </div>
                      <div class="progress">
                        <div class="progress-bar" role="progressbar" style="width: 75%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">75%</div>
                      </div>
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
    
    .progress {
      height: 0.5rem;
    }
    
    .list-group-item {
      border-left: none;
      border-right: none;
    }
  `]
})
export class DashCitizenProgressComponent {
  constructor() {
    console.log('DashCitizenProgressComponent initialized');
  }
}
