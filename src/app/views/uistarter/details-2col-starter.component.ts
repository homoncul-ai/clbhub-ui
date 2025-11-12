import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Details component with 2-column layout
 */
@Component({
  selector: 'app-details-2col-starter',
  template: `
    <div class="container mt-4">
      <h2>Student Details</h2>
      
      <div class="row">
        <div class="col-md-6">
          <div class="detail-section">
            <div class="detail-group">
              <label>Name:</label>
              <span>John Doe</span>
            </div>
            <div class="detail-group">
              <label>Business Code:</label>
              <span>STU001</span>
            </div>
            <div class="detail-group">
              <label>Email:</label>
              <span>john.doe&#64;example.com</span>
            </div>
            <div class="detail-group">
              <label>Cell Phone:</label>
              <span>555-0101</span>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="detail-section">
            <div class="detail-group">
              <label>Work Phone:</label>
              <span>555-0102</span>
            </div>
            <div class="detail-group">
              <label>School ID:</label>
              <span>SCH001</span>
            </div>
            <div class="detail-group">
              <label>Available:</label>
              <span>Yes</span>
            </div>
            <div class="detail-group">
              <label>Status:</label>
              <span>Active</span>
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
export class Details2colStarterComponent {
}

