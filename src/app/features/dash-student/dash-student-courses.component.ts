import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dash-student-courses',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                <i class="fas fa-book me-2"></i>
                My Courses
              </h3>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6 col-lg-4 mb-4">
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title">Introduction to Computer Science</h5>
                      <p class="card-text">Learn the fundamentals of programming and computer science concepts.</p>
                      <div class="progress mb-3">
                        <div class="progress-bar" role="progressbar" style="width: 75%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">75%</div>
                      </div>
                      <small class="text-muted">Next class: Tomorrow at 10:00 AM</small>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-lg-4 mb-4">
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title">Web Development Fundamentals</h5>
                      <p class="card-text">Build modern web applications using HTML, CSS, and JavaScript.</p>
                      <div class="progress mb-3">
                        <div class="progress-bar" role="progressbar" style="width: 45%" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100">45%</div>
                      </div>
                      <small class="text-muted">Next class: Wednesday at 2:00 PM</small>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-lg-4 mb-4">
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title">Data Structures & Algorithms</h5>
                      <p class="card-text">Master essential data structures and algorithmic problem-solving techniques.</p>
                      <div class="progress mb-3">
                        <div class="progress-bar" role="progressbar" style="width: 20%" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">20%</div>
                      </div>
                      <small class="text-muted">Next class: Friday at 11:00 AM</small>
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
  `]
})
export class DashStudentCoursesComponent {
  constructor() {
    console.log('DashStudentCoursesComponent initialized');
  }
}
