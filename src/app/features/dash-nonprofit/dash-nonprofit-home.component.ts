import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dash-nonprofit-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h4 class="mb-0">
                <i class="fas fa-tachometer-alt me-2"></i>
                Nonprofit Dashboard
              </h4>
            </div>
            <div class="card-body">
              <div class="text-center py-5">
                <i class="fas fa-building fa-4x text-muted mb-3"></i>
                <h5 class="text-muted">Welcome to the Nonprofit Dashboard</h5>
                <p class="text-muted">This dashboard is under construction. More features coming soon.</p>
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
  `]
})
export class DashNonprofitHomeComponent implements OnInit {
  constructor() {
    console.log('DashNonprofitHomeComponent initialized');
  }

  ngOnInit(): void {
    // Initialize component
  }
}
