import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dash-student-schedule',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                <i class="fas fa-calendar me-2"></i>
                My Schedule
              </h3>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-8">
                  <h5>This Week's Schedule</h5>
                  <div class="table-responsive">
                    <table class="table table-hover">
                      <thead>
                        <tr>
                          <th>Time</th>
                          <th>Monday</th>
                          <th>Tuesday</th>
                          <th>Wednesday</th>
                          <th>Thursday</th>
                          <th>Friday</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>9:00 AM</td>
                          <td class="table-primary">Computer Science<br><small>Room 101</small></td>
                          <td></td>
                          <td class="table-primary">Computer Science<br><small>Room 101</small></td>
                          <td></td>
                          <td class="table-primary">Computer Science<br><small>Room 101</small></td>
                        </tr>
                        <tr>
                          <td>11:00 AM</td>
                          <td></td>
                          <td class="table-success">Web Development<br><small>Room 205</small></td>
                          <td></td>
                          <td class="table-success">Web Development<br><small>Room 205</small></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>2:00 PM</td>
                          <td></td>
                          <td></td>
                          <td class="table-info">Data Structures<br><small>Room 301</small></td>
                          <td></td>
                          <td class="table-info">Data Structures<br><small>Room 301</small></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div class="col-md-4">
                  <h5>Upcoming Events</h5>
                  <div class="list-group">
                    <div class="list-group-item">
                      <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">Midterm Exam</h6>
                        <small class="text-danger">Tomorrow</small>
                      </div>
                      <p class="mb-1">Introduction to Computer Science</p>
                      <small class="text-muted">Room 101, 9:00 AM</small>
                    </div>
                    <div class="list-group-item">
                      <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">Project Due</h6>
                        <small class="text-warning">Friday</small>
                      </div>
                      <p class="mb-1">Web Development Final Project</p>
                      <small class="text-muted">Submit online by 11:59 PM</small>
                    </div>
                    <div class="list-group-item">
                      <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">Study Group</h6>
                        <small class="text-info">Next Monday</small>
                      </div>
                      <p class="mb-1">Data Structures Review</p>
                      <small class="text-muted">Library, 3:00 PM</small>
                    </div>
                  </div>
                  
                  <h5 class="mt-4">Office Hours</h5>
                  <div class="list-group">
                    <div class="list-group-item">
                      <h6 class="mb-1">Dr. Smith</h6>
                      <p class="mb-1">Computer Science</p>
                      <small class="text-muted">Mon/Wed 1:00-3:00 PM, Room 201</small>
                    </div>
                    <div class="list-group-item">
                      <h6 class="mb-1">Prof. Johnson</h6>
                      <p class="mb-1">Web Development</p>
                      <small class="text-muted">Tue/Thu 10:00-12:00 PM, Room 205</small>
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
    
    .table th {
      background-color: #f8f9fa;
      border-top: none;
    }
    
    .table td {
      vertical-align: middle;
    }
    
    .list-group-item {
      border-left: none;
      border-right: none;
    }
  `]
})
export class DashStudentScheduleComponent {
  constructor() {
    console.log('DashStudentScheduleComponent initialized');
  }
}
