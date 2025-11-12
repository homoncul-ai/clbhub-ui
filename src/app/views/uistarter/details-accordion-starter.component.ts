import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';

/**
 * Details component with accordion sections
 * Each section has a title and contains detail groups
 */
@Component({
  selector: 'app-details-accordion-starter',
  template: `
    <div class="container mt-4">
      <h2>Student Details</h2>
      
      <mdb-accordion [multiple]="true">
        <mdb-accordion-item>
          <ng-template mdbAccordionItemHeader>Personal Information</ng-template>
          <ng-template mdbAccordionItemBody>
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
            </div>
          </ng-template>
        </mdb-accordion-item>

        <mdb-accordion-item>
          <ng-template mdbAccordionItemHeader>Contact Information</ng-template>
          <ng-template mdbAccordionItemBody>
            <div class="detail-section">
              <div class="detail-group">
                <label>Cell Phone:</label>
                <span>555-0101</span>
              </div>
              <div class="detail-group">
                <label>Work Phone:</label>
                <span>555-0102</span>
              </div>
              <div class="detail-group">
                <label>Address:</label>
                <span>123 Main St, City, State 12345</span>
              </div>
            </div>
          </ng-template>
        </mdb-accordion-item>

        <mdb-accordion-item>
          <ng-template mdbAccordionItemHeader>School Information</ng-template>
          <ng-template mdbAccordionItemBody>
            <div class="detail-section">
              <div class="detail-group">
                <label>School ID:</label>
                <span>SCH001</span>
              </div>
              <div class="detail-group">
                <label>School Name:</label>
                <span>Example High School</span>
              </div>
              <div class="detail-group">
                <label>Available:</label>
                <span>Yes</span>
              </div>
            </div>
          </ng-template>
        </mdb-accordion-item>
      </mdb-accordion>
    </div>
  `,
  styleUrls: ['./uistarter.scss'],
  standalone: true,
  imports: [CommonModule, MdbAccordionModule]
})
export class DetailsAccordionStarterComponent {
}

